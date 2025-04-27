import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, Check, MessageSquare, Video, Mic, Play, AlertCircle, BarChart } from 'lucide-react';
import { DashboardNav } from "@/components/DashboardNav";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import AnswerFeedbackCard from "@/components/AnswerFeedbackCard";
import InterviewPreparationForm from "@/components/InterviewPreparationForm";
import InterviewSession from "@/components/InterviewSession";
import { aiInterviewEngine, Message } from "@/lib/aiInterviewEngine";
import { geminiGenerateQuestions, InterviewParams, analyzeAnswer, saveAnswerFeedback, AnswerFeedback } from "@/lib/gemini.sdk";
import { createFeedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";

const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
  ANALYZING: "ANALYZING",
};

type Stage = "idle" | "generating" | "ready" | "calling" | "analyzing" | "feedback" | "done";

const InterviewPage = () => {
  const [stage, setStage] = useState<Stage>("idle");
  const navigate = useNavigate();
  const location = useLocation();
  
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [userAnswers, setUserAnswers] = useState<Message[]>([]);
  const [answerFeedbacks, setAnswerFeedbacks] = useState<(AnswerFeedback | null)[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [feedbackReady, setFeedbackReady] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);
  
  // Add the missing state variables
  const [jobRole, setJobRole] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicPermissionGranted(permissionStatus.state === 'granted');
        
        permissionStatus.onchange = () => {
          setMicPermissionGranted(permissionStatus.state === 'granted');
        };
      } catch (err) {
        console.error("Error checking microphone permission:", err);
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          setMicPermissionGranted(true);
        } catch (err) {
          console.error("Error accessing microphone:", err);
          setMicPermissionGranted(false);
        }
      }
    };
    
    checkMicrophonePermission();
  }, []);

  useEffect(() => {
    if (location.state) {
      const { jobRole: stateJobRole, industry: stateIndustry, experienceLevel: stateExperienceLevel, techStack: stateTechStack } = location.state;
      if (stateJobRole) setJobRole(stateJobRole);
      if (stateIndustry) setIndustry(stateIndustry);
      if (stateExperienceLevel) setExperienceLevel(stateExperienceLevel);
      if (stateTechStack) {
        if (typeof stateTechStack === 'string') {
          setTechStack(stateTechStack.split(',').map((item: string) => item.trim()));
        } else if (Array.isArray(stateTechStack)) {
          setTechStack(stateTechStack);
        }
      }
    }
  }, [location.state]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const displayName = userData.displayName || user.displayName || "User";
            setUserName(displayName);
            
            // Pre-fill preferences if available
            if (userData.jobRole && !jobRole) setJobRole(userData.jobRole);
            if (userData.techStack && techStack.length === 0) {
              setTechStack(typeof userData.techStack === 'string' 
                ? userData.techStack.split(',').map(item => item.trim())
                : Array.isArray(userData.techStack) ? userData.techStack : []);
            }
            if (userData.experienceLevel && !experienceLevel) setExperienceLevel(userData.experienceLevel);
            if (userData.industry && !industry) setIndustry(userData.industry);
          } else {
            setUserName(user.displayName || "User");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Could not load user profile.");
          setUserName(user.displayName || "User");
        } finally {
          setIsUserLoaded(true);
        }
      } else {
        setIsUserLoaded(true);
      }
    });
    
    return () => unsubscribe();
  }, [jobRole, experienceLevel, industry, techStack]);

  const handleGenerateInterview = async (data: {
    jobRole: string;
    techStack: string[];
    experienceLevel: string;
    industry: string;
    questionCount: number;
    additionalInfo: string;
  }) => {
    if (!userId || !userName) {
      toast.error("Please login to continue.");
      setError("User authentication required.");
      return;
    }
    
    setStage("generating");
    setIsGenerating(true);
    setError("");
    setInterviewQuestions([]);
    setInterviewId(null);
    
    setJobRole(data.jobRole);
    setTechStack(data.techStack);
    setExperienceLevel(data.experienceLevel);
    setIndustry(data.industry);
    setQuestionCount(data.questionCount);
    setAdditionalInfo(data.additionalInfo);

    try {
      const params: InterviewParams = {
        userId,
        userName,
        jobRole: data.jobRole,
        industry: data.industry,
        experienceLevel: data.experienceLevel,
        questionCount: data.questionCount,
        techStack: data.techStack
      };

      console.log("Generating interview with params:", params);
      toast.info("Generating personalized interview questions...");

      const { questions, interviewId: id } = await geminiGenerateQuestions(params);

      console.log("Generated questions:", questions);
      console.log("Interview ID:", id);
      toast.success("Interview questions generated successfully!");

      setInterviewQuestions(questions);
      setInterviewId(id);
      setAnswerFeedbacks(new Array(questions.length).fill(null));
      setUserAnswers([]);
      setStage("ready");
    } catch (err) {
      console.error("Error generating questions:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to generate interview questions: ${errorMessage}`);
      toast.error("Failed to generate interview questions. Please try again.");
      setStage("idle");
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeUserAnswer = async (
    questionIndex: number,
    question: string,
    answer: string,
    responseTime?: number,
    fillerWords?: string[],
    hesitations?: number
  ) => {
    if (!interviewId) {
      console.error("Cannot analyze answer without interviewId");
      return;
    }
    
    if (answerFeedbacks[questionIndex] !== null) {
      console.log(`Feedback for question ${questionIndex + 1} already exists. Skipping analysis.`);
      return;
    }

    try {
      console.log(`Analyzing answer for question ${questionIndex + 1}...`);
      toast.info(`Analyzing answer ${questionIndex + 1}...`);

      const feedback = await analyzeAnswer(
        question, 
        answer, 
        jobRole, 
        experienceLevel, 
        responseTime,
        fillerWords,
        hesitations
      );

      await saveAnswerFeedback(
        interviewId,
        userId,
        questionIndex,
        question,
        answer,
        feedback
      );

      console.log(`Feedback received for question ${questionIndex + 1}:`, feedback);
      toast.success(`Feedback ready for question ${questionIndex + 1}!`);

      setAnswerFeedbacks(prev => {
        const newFeedbacks = [...prev];
        newFeedbacks[questionIndex] = feedback;
        return newFeedbacks;
      });
    } catch (err) {
      console.error(`Error analyzing answer for question ${questionIndex + 1}:`, err);
      toast.error(`Failed to get feedback for question ${questionIndex + 1}.`);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermissionGranted(true);
      toast.success("Microphone access granted!");
      return true;
    } catch (err) {
      console.error("Error requesting microphone permission:", err);
      setMicPermissionGranted(false);
      setError("Microphone access denied. Please grant permission to continue.");
      toast.error("Microphone access denied. Please grant permission in your browser settings.");
      return false;
    }
  };

  useEffect(() => {
    function onCallStart() {
      console.log("Call started event received");
      setCallStatus(CallStatus.ACTIVE);
      setStage("calling");
      setError("");
      setMessages([]);
      setCurrentQuestionIndex(-1);
      setFeedbackReady(false);
      setLastMessage("Interview is starting...");
    }

    function onCallEnd() {
      console.log("Call ended event received");
      setCallStatus(CallStatus.FINISHED);
      setStage("analyzing");
      setIsAnalyzing(true);
      setLastMessage("Interview finished. Analyzing responses...");
      toast.info("Interview ended. Analyzing your answers...");
    }

    async function onMessage(message: Message) {
      console.log("Message received:", message);
      
      if (message?.role === 'assistant' || message?.role === 'user') {
        setLastMessage(message.content);

        setMessages(prev => [...prev, message]);

        if (message.role === 'assistant') {
          setCurrentQuestionIndex(aiInterviewEngine.getCurrentQuestionIndex());
          setInterimTranscript("");
        } else if (message.role === 'user') {
          setUserAnswers(prev => [...prev, message]);
          
          const answerIndex = message.questionIndex ?? aiInterviewEngine.getCurrentQuestionIndex();
          if (answerIndex >= 0 && answerIndex < interviewQuestions.length) {
            const question = interviewQuestions[answerIndex];
            analyzeUserAnswer(
              answerIndex, 
              question, 
              message.content, 
              message.responseTime,
              message.fillerWords,
              message.hesitations
            );
          }
        }
      }
    }

    function onInterimTranscript(data: { transcript: string }) {
      console.log("Interim transcript:", data.transcript);
      setInterimTranscript(data.transcript);
    }

    function onSpeechStart() {
      console.log("AI Speech started");
      setIsSpeaking(true);
    }
    
    function onSpeechEnd() {
      console.log("AI Speech ended");
      setIsSpeaking(false);
    }
    
    function onError(err: any) {
      const errorMsg = "Interview error: " + (err?.message || String(err));
      console.error(errorMsg, err);
      setError(errorMsg);
      toast.error("An error occurred during the interview.");
      setCallStatus(CallStatus.INACTIVE);
      setStage("ready");
      setIsSpeaking(false);
      setIsAnalyzing(false);
    }

    aiInterviewEngine.on("call-start", onCallStart);
    aiInterviewEngine.on("call-end", onCallEnd);
    aiInterviewEngine.on("message", onMessage);
    aiInterviewEngine.on("interim-transcript", onInterimTranscript);
    aiInterviewEngine.on("speech-start", onSpeechStart);
    aiInterviewEngine.on("speech-end", onSpeechEnd);
    aiInterviewEngine.on("error", onError);
    aiInterviewEngine.on("recognition-start", () => {
      console.log("Speech recognition started successfully");
      setError("");
    });

    return () => {
      aiInterviewEngine.off("call-start", onCallStart);
      aiInterviewEngine.off("call-end", onCallEnd);
      aiInterviewEngine.off("message", onMessage);
      aiInterviewEngine.off("interim-transcript", onInterimTranscript);
      aiInterviewEngine.off("speech-start", onSpeechStart);
      aiInterviewEngine.off("speech-end", onSpeechEnd);
      aiInterviewEngine.off("error", onError);
      aiInterviewEngine.off("recognition-start", () => {});
      
      if (aiInterviewEngine.active) {
        aiInterviewEngine.stop();
      }
    };
  }, [interviewQuestions, interviewId, userId, jobRole, experienceLevel]);

  useEffect(() => {
    if (
      stage === "analyzing" && 
      callStatus === CallStatus.FINISHED && 
      userAnswers.length > 0 && 
      userAnswers.length === answerFeedbacks.filter(fb => fb !== null).length
    ) {
      console.log("All feedback received. Calculating overall score.");

      const validFeedbacks = answerFeedbacks.filter(fb => fb !== null) as AnswerFeedback[];
      const totalScore = validFeedbacks.reduce((sum, feedback) => sum + feedback.overallScore, 0);
      const avgScore = validFeedbacks.length > 0 ? Math.round(totalScore / validFeedbacks.length) : 0;
      setOverallScore(avgScore);

      console.log("Overall Score:", avgScore);
      setFeedbackReady(true);
      setStage("feedback");
      setIsAnalyzing(false);
      toast.success("Analysis complete! View your feedback below.");
    }
  }, [stage, callStatus, answerFeedbacks, userAnswers]);

  const handleStartCall = async () => {
    if (interviewQuestions.length === 0 || !interviewId) {
      setError("Questions not generated or interview ID missing.");
      toast.error("Cannot start interview. Please generate questions first.");
      return;
    }
    
    if (micPermissionGranted === false) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }
    
    setError("");
    setCallStatus(CallStatus.CONNECTING);
    setStage("calling");
    setCurrentQuestionIndex(-1);
    setUserAnswers([]);
    setAnswerFeedbacks(new Array(interviewQuestions.length).fill(null));
    setMessages([]);
    setFeedbackReady(false);
    setOverallScore(0);
    setLastMessage("Connecting...");
    setInterimTranscript("");

    try {
      window.speechSynthesis.getVoices();
      await aiInterviewEngine.start(interviewQuestions, {
        userName,
        userId,
        jobRole,
        industry,
        experienceLevel,
        techStack
      });
    } catch (err) {
      console.error("Failed to start interview:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Failed to start interview: ${errorMsg}`);
      toast.error("Failed to start interview. Please check microphone permissions.");
      setCallStatus(CallStatus.INACTIVE);
      setStage("ready");
    }
  };

  const handleDisconnect = () => {
    console.log("User initiated disconnect.");
    aiInterviewEngine.stop();
  };

  const handleResetMicrophone = () => {
    if (callStatus === CallStatus.ACTIVE) {
      aiInterviewEngine.resetRecognition();
      toast.info("Resetting microphone connection...");
    }
  };

  const handleViewDetailedFeedback = async () => {
    setStage("done");
    toast.info("Preparing detailed feedback report...");
    
    try {
      const feedbackParams = {
        interviewId: interviewId || "",
        userId,
        feedbackId: "",
        transcript: messages,
      };

      const { success, feedbackId } = await createFeedback(feedbackParams);

      if (success && interviewId) {
        console.log("Navigating to detailed feedback page");
        navigate(`/interview/${interviewId}/feedback`);
      } else {
        throw new Error("Failed to record feedback session.");
      }
    } catch (err) {
      console.error("Error preparing or navigating to feedback:", err);
      toast.error("Could not load detailed feedback page.");
      setStage("feedback");
    }
  };

  const renderContent = () => {
    switch (stage) {
      case "idle":
        return (
          <div className="flex flex-col gap-4 w-full">
            <h3 className="font-medium text-lg mb-1 text-center">Interview Preferences</h3>
            {!userId && <p className="text-center text-destructive">Loading user info...</p>}
            {userId && <p className="text-center text-muted-foreground mb-4">Welcome, {userName}!</p>}

            <InterviewPreparationForm
              onGenerateInterview={handleGenerateInterview}
              isGenerating={isGenerating}
              userName={userName}
              initialValues={{
                jobRole,
                techStack: techStack.join(', '),
                experienceLevel,
                industry
              }}
            />
          </div>
        );
        
      case "generating":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader className="animate-spin w-12 h-12 text-primary mb-4" />
            <p className="text-muted-foreground">Generating personalized interview questions...</p>
            <p className="text-xs text-muted-foreground mt-2">Creating questions for {jobRole} role with {techStack.join(', ')} expertise...</p>
          </div>
        );

      case "ready":
        return (
          <div className="w-full flex flex-col gap-6 items-center animate-fade-in">
            <Card className="w-full border-0 bg-gradient-to-br from-background via-muted/50 to-background dark:from-gray-800 dark:to-gray-900 shadow-md">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <MessageSquare className="w-7 h-7 text-primary" />
                <CardTitle className="font-medium text-xl">Your AI Interview is Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Based on your preferences ({jobRole}, {experienceLevel}), here are your interview questions:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  {interviewQuestions.length > 0 ? (
                    interviewQuestions.map((q, i) => (
                      <li key={i} className="mb-1 p-1 rounded">{q}</li>
                    ))
                  ) : (
                    <div className="text-center p-4 text-muted-foreground italic">
                      No questions generated. Please try again.
                    </div>
                  )}
                </ol>
                <p className="text-xs text-muted-foreground mt-4 italic">Interview ID: {interviewId}</p>
              </CardContent>
            </Card>
            
            {micPermissionGranted === false && (
              <div className="w-full bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-4 rounded-md text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="font-medium">Microphone permission required</p>
                  <p className="text-sm mt-1">Please allow microphone access to start the interview.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 bg-yellow-200 dark:bg-yellow-800 border-yellow-300 dark:border-yellow-700"
                    onClick={requestMicrophonePermission}
                  >
                    Grant microphone access
                  </Button>
                </div>
              </div>
            )}
            
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-full max-w-md mx-auto"
              onClick={handleStartCall}
              disabled={interviewQuestions.length === 0 || callStatus === CallStatus.CONNECTING || micPermissionGranted === false}
            >
              {callStatus === CallStatus.CONNECTING ? (
                <> <Loader className="animate-spin mr-2 w-4 h-4" /> Connecting... </>
              ) : (
                <> <Play className="mr-2 w-5 h-5" /> Start Interview </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStage("idle")}
              disabled={callStatus === CallStatus.CONNECTING}
            >
              Change Preferences
            </Button>
          </div>
        );

      case "calling":
        return (
          <>
            <InterviewSession
                    currentQuestionIndex={currentQuestionIndex}
                    interviewQuestions={interviewQuestions}
                    lastMessage={lastMessage}
                    isSpeaking={isSpeaking}
                    userName={userName}
                    jobRole={jobRole}
                    interimTranscript={interimTranscript}
                    onEndInterview={handleDisconnect}
                    isActive={callStatus === CallStatus.ACTIVE} messages={[]}            />
            
            {callStatus === CallStatus.ACTIVE && (
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleResetMicrophone}
                  className="text-xs"
                >
                  Reset Microphone
                </Button>
              </div>
            )}
          </>
        );

      case "analyzing":
        return (
          <div className="w-full flex flex-col items-center gap-4 animate-fade-in text-center py-8">
            <div className="text-xl font-semibold mb-2">Analyzing Responses</div>
            <Loader className="animate-spin w-12 h-12 text-primary mb-4" />
            <p className="text-muted-foreground max-w-md">
              Please wait while the AI analyzes your answers based on clarity, relevance, confidence, and other factors. This may take a moment...
            </p>
            <div className="w-full max-w-sm bg-muted rounded-full h-2.5 dark:bg-gray-700 mt-4">
              <div className="bg-primary h-2.5 rounded-full animate-pulse" 
                style={{ width: `${(answerFeedbacks.filter(fb => fb !== null).length / userAnswers.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Analyzed {answerFeedbacks.filter(fb => fb !== null).length} of {userAnswers.length} answers.
            </p>
          </div>
        );

      case "feedback":
        return (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            <div className="flex flex-col items-center justify-center w-full bg-gradient-to-r from-background via-muted/30 to-background p-6 rounded-lg shadow-md mb-4 border">
              <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Overall Performance</div>
              <div className={cn("text-5xl font-bold mb-2",
                overallScore >= 8 ? "text-green-600 dark:text-green-400" :
                overallScore >= 5 ? "text-amber-600 dark:text-amber-400" :
                                    "text-red-600 dark:text-red-400"
              )}>
                {overallScore} / 10
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                This score reflects an average of your performance across all questions based on relevance, clarity, and confidence.
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-center mb-2">
                <BarChart className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold">Detailed Answer Feedback</h3>
              </div>

              {userAnswers.map((userAnswer, index) => {
                if (!userAnswer.questionIndex && userAnswer.questionIndex !== 0) return null;
                
                const question = interviewQuestions[userAnswer.questionIndex];
                const feedback = answerFeedbacks[userAnswer.questionIndex];
                
                if (question && feedback) {
                  return (
                    <AnswerFeedbackCard
                      key={index}
                      question={question}
                      answer={userAnswer.content}
                      feedback={feedback}
                      questionNumber={userAnswer.questionIndex + 1}
                    />
                  );
                } else if (question) {
                  return (
                    <Card key={index} className="w-full mb-4 shadow-sm border-dashed border-muted-foreground/50 opacity-70">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium text-muted-foreground">
                          Question {userAnswer.questionIndex + 1}: {question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground italic">
                          Feedback analysis pending...
                        </p>
                      </CardContent>
                    </Card>
                  );
                }
                return null;
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-1/2"
                onClick={() => {
                  setStage("ready");
                  setCallStatus(CallStatus.INACTIVE);
                  setError('');
                }}
              >
                Try This Interview Again
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 text-white w-full sm:w-1/2"
                onClick={handleViewDetailedFeedback}
              >
                View Full Report & Transcript
              </Button>
            </div>
            <Button
              variant="link"
              size="sm"
              className="mt-2 text-muted-foreground"
              onClick={() => {
                setStage("idle");
                setCallStatus(CallStatus.INACTIVE);
                setError('');
                setInterviewQuestions([]);
                setInterviewId(null);
              }}
            >
              Start a New Interview
            </Button>
          </div>
        );

      case "done":
        return (
          <div className="w-full flex flex-col items-center gap-4 animate-fade-in text-center py-8">
            <Check className="w-16 h-16 text-green-500 drop-shadow-lg mb-3" />
            <div className="text-xl font-semibold">Processing Complete!</div>
            <div className="text-muted-foreground mb-4">
              Redirecting you to the detailed feedback report...
            </div>
            <Loader className="animate-spin w-8 h-8 text-primary" />
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 flex items-start justify-center overflow-auto px-4">
      <DashboardNav />
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -left-24 top-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse opacity-50" />
        <div className="absolute -right-10 bottom-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse opacity-40" />
      </div>

      <Card className="relative z-10 max-w-3xl w-full shadow-xl border-0 bg-card/80 dark:bg-gray-800/90 backdrop-blur-lg mt-16 mb-8 animate-fade-in">
        <CardHeader className="flex flex-col items-center gap-3 bg-gradient-to-r from-primary/5 to-background/0 rounded-t-lg pt-8 pb-6 border-b">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 border-primary/30 bg-primary/10 text-primary dark:text-primary shadow-sm">
              <Mic className="w-4 h-4 mr-1.5" />
              AI Voice Interview
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 bg-muted text-muted-foreground dark:text-white shadow-sm">
              <Video className="w-4 h-4 mr-1.5" />
              Speech Analysis
            </Badge>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-semibold mt-2 text-center">
            { stage === 'calling' ? 'Interview in Progress' :
              stage === 'feedback' ? 'Interview Feedback' :
              'Personalized AI Interview Practice'
            }
          </CardTitle>
          <CardDescription className="text-center max-w-lg text-muted-foreground text-sm md:text-base">
            { stage === 'idle' ? 'Define your target role and skills to generate a tailored practice interview.' :
              stage === 'ready' ? 'Review the generated questions and start when ready.' :
              stage === 'calling' ? 'Listen to the AI interviewer and respond clearly.' :
              stage === 'analyzing' ? 'Your responses are being analyzed for detailed feedback.' :
              stage === 'feedback' ? 'Review your performance score and feedback for each question.' :
              'Ace your next interview with AI-powered practice and insights.'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center py-8 px-4 md:px-8 space-y-6 min-h-[300px]">
          {error && (
            <div className="w-full px-4 py-3 bg-destructive/10 text-destructive rounded-md text-center font-medium shadow border border-destructive/20 mb-4 flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {renderContent()}
        </CardContent>

        <CardFooter className="flex justify-center text-xs text-muted-foreground font-mono bg-muted/30 py-3 border-t">
          Powered by Gemini AI & Web Speech API
        </CardFooter>
      </Card>
    </div>
  );
};

export default InterviewPage;
