
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Input } from "@/components/ui/input";
import { Mic, Video, Loader, Check, MessageSquare, User, Play, ArrowDown, AlertCircle, BarChart } from 'lucide-react';
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { geminiGenerateQuestions, InterviewParams, analyzeAnswer, saveAnswerFeedback, AnswerFeedback } from "@/lib/gemini.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/feedback";
import { DashboardNav } from "@/components/DashboardNav";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import AnswerFeedbackCard from "@/components/AnswerFeedbackCard";

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
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string>("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [answerFeedbacks, setAnswerFeedbacks] = useState<AnswerFeedback[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [speechAnalysisCompleted, setSpeechAnalysisCompleted] = useState(false);

  // Interview preferences
  const [jobRole, setJobRole] = useState("");
  const [techStack, setTechStack] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("intermediate");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        
        // Try to get user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.displayName || user.displayName || "");
            if (userData.jobRole) setJobRole(userData.jobRole);
            if (userData.techStack) setTechStack(userData.techStack);
            if (userData.experienceLevel) setExperienceLevel(userData.experienceLevel);
          } else if (user.displayName) {
            setUserName(user.displayName);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          if (user.displayName) setUserName(user.displayName);
        }
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handleGenerateInterview = async () => {
    setStage("generating");
    setIsGenerating(true);
    setError("");
    
    try {
      const params: InterviewParams = {
        userId,
        userName,
        jobRole,
        techStack: techStack.split(',').map(item => item.trim()).filter(item => item.length > 0),
        experienceLevel,
        questionCount: 5
      };
      
      console.log("Generating interview with params:", params);
      toast.info("Generating personalized interview questions...");
      
      const { questions, interviewId: id } = await geminiGenerateQuestions(params);
      
      console.log("Generated questions:", questions);
      toast.success("Interview questions generated successfully!");
      
      setInterviewQuestions(questions);
      setInterviewId(id);
      setStage("ready");
    } catch (err) {
      console.error("Error generating questions:", err);
      setStage("idle");
      setError(`Failed to generate interview questions: ${err instanceof Error ? err.message : String(err)}`);
      toast.error("Failed to generate interview questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    function onCallStart() {
      setCallStatus(CallStatus.ACTIVE);
      setStage("calling");
      setError("");
    }
    
    function onCallEnd() {
      setCallStatus(CallStatus.FINISHED);
      // Now we'll trigger analysis instead of immediately showing "done"
      setStage("analyzing");
      setCallStatus(CallStatus.ANALYZING);
    }
    
    async function onMessage(message: any) {
      if (message?.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages(prev => [...prev, newMessage]);

        // Track current question and user answers
        if (message.role === 'assistant') {
          // This is a question from the interviewer
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else if (message.role === 'user') {
          // This is an answer from the user
          setUserAnswers(prev => [...prev, message.transcript]);
          
          // If we have both question and answer, we can analyze
          const questionIdx = vapi.getCurrentQuestionIndex() - 1;
          if (questionIdx >= 0 && questionIdx < interviewQuestions.length) {
            const question = interviewQuestions[questionIdx];
            analyzeUserAnswer(questionIdx, question, message.transcript);
          }
        }
      }
    }
    
    function onSpeechStart() { setIsSpeaking(true); }
    function onSpeechEnd() { setIsSpeaking(false); }
    function onError(err: any) {
      setError("Call error: " + (err?.message || String(err)));
      setCallStatus(CallStatus.INACTIVE);
      setStage("ready");
    }

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [interviewQuestions]);

  const analyzeUserAnswer = async (
    questionIndex: number, 
    question: string, 
    answer: string
  ) => {
    try {
      console.log(`Analyzing answer for question ${questionIndex + 1}: ${question}`);
      
      // Get feedback for this answer
      const feedback = await analyzeAnswer(question, answer, jobRole, experienceLevel);
      
      // Save the feedback
      await saveAnswerFeedback(
        interviewId || 'unknown', 
        userId, 
        questionIndex, 
        question, 
        answer, 
        feedback
      );
      
      // Update state with new feedback
      setAnswerFeedbacks(prev => {
        const newFeedbacks = [...prev];
        newFeedbacks[questionIndex] = feedback;
        return newFeedbacks;
      });
      
    } catch (err) {
      console.error(`Error analyzing answer for question ${questionIndex + 1}:`, err);
    }
  };

  useEffect(() => {
    if (messages.length > 0) setLastMessage(messages[messages.length - 1].content);
  }, [messages]);

  useEffect(() => {
    // When all questions are answered and analyzed, calculate overall score
    if (callStatus === CallStatus.ANALYZING && answerFeedbacks.length > 0 && 
        answerFeedbacks.length === interviewQuestions.length && 
        userAnswers.length === interviewQuestions.length) {
      
      // Wait a bit to make sure all analyses are complete
      setTimeout(() => {
        const totalScore = answerFeedbacks.reduce((sum, feedback) => sum + feedback.overallScore, 0);
        const avgScore = Math.round(totalScore / answerFeedbacks.length);
        setOverallScore(avgScore);
        
        setSpeechAnalysisCompleted(true);
        setStage("feedback");
        setCallStatus(CallStatus.FINISHED);
      }, 1000);
    }
  }, [callStatus, answerFeedbacks, interviewQuestions.length, userAnswers.length]);

  const handleStartCall = async () => {
    setError("");
    setCallStatus(CallStatus.CONNECTING);
    setStage("calling");
    setCurrentQuestionIndex(-1);
    setUserAnswers([]);
    setAnswerFeedbacks([]);
    setMessages([]);
    setSpeechAnalysisCompleted(false);
    
    try {
      const formattedQuestions = interviewQuestions?.map(q => `- ${q}`).join("\n") || "";
      await vapi.start(interviewer.id, {
        variableValues: {
          questions: formattedQuestions,
          username: userName,
          userid: userId,
          jobRole,
          techStack,
          experienceLevel
        },
      });
    } catch (err) {
      setError("Failed to start interview. Check your API/service keys.");
      setCallStatus(CallStatus.INACTIVE);
      setStage("ready");
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.ANALYZING);
    vapi.stop();
  };

  const handleViewFeedback = async () => {
    try {
      const { success, feedbackId: id } = await createFeedback({
        interviewId,
        userId,
        transcript: messages,
        feedbackId,
      });
      
      if (success && id && interviewId) {
        navigate(`/interview/${interviewId}/feedback`);
      } else {
        toast.error("Failed to generate detailed feedback");
        navigate("/");
      }
    } catch (err) {
      console.error("Error generating feedback:", err);
      toast.error("Failed to generate detailed feedback");
      navigate("/");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 flex items-center justify-center overflow-auto px-4">
      <DashboardNav />
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-24 top-10 w-48 h-48 bg-primary/30 rounded-full blur-3xl animate-spin-slow" />
        <div className="absolute right-10 bottom-20 w-80 h-80 bg-primary/20 rounded-full blur-2xl" />
      </div>
      <Card className="relative z-10 max-w-2xl w-full shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl mt-16">
        <CardHeader className="flex flex-col items-center gap-2 bg-gradient-to-r from-primary/30 to-background/10 rounded-t-xl pt-8">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-gradient-to-r from-primary/30 to-primary/20 border-none text-primary dark:text-primary shadow-md">
              <Mic className="w-4 h-4 mr-1" />
              Smart AI Interview
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 bg-muted text-muted-foreground dark:text-white">
              <Video className="w-4 h-4 mr-1" />
              Vapi + Gemini
            </Badge>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-semibold mt-1 text-center">
            Personalized AI Interview Generator
          </CardTitle>
          <CardDescription className="text-center max-w-lg text-muted-foreground dark:text-muted-foreground">
            Generate, join, and ace your practice interview! Powered by state-of-the-art AI for realistic Q&A and instant feedback.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center py-8 space-y-6">
          {error && (
            <div className="w-full px-3 py-2 bg-destructive/20 text-destructive rounded-md text-center font-medium shadow border border-destructive/20 mb-2">
              <AlertCircle className="h-4 w-4 inline-block mr-1" />
              {error}
            </div>
          )}

          {!userName || !userId ? (
            <div className="flex flex-col gap-4 w-full items-center">
              <label className="font-medium text-lg mb-1">Enter your details to begin:</label>
              <Input
                className="w-full md:w-2/3"
                placeholder="Your Name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                required
              />
              <Input
                className="w-full md:w-2/3"
                placeholder="Your User ID"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                required
              />
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 text-white w-full md:w-2/3 mt-2"
                onClick={handleGenerateInterview}
                disabled={!userName || !userId || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin mr-2 w-4 h-4" /> Generating...
                  </>
                ) : "Create Interview"}
              </Button>
            </div>
          ) : stage === "idle" ? (
            <div className="flex flex-col gap-4 w-full">
              <h3 className="font-medium text-lg mb-1">Enter interview preferences:</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="jobRole" className="text-sm font-medium block mb-1">Job Role</label>
                  <Input
                    id="jobRole"
                    placeholder="e.g. Frontend Developer"
                    value={jobRole}
                    onChange={e => setJobRole(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="techStack" className="text-sm font-medium block mb-1">Tech Stack (comma separated)</label>
                  <Input
                    id="techStack"
                    placeholder="e.g. React, TypeScript, Node.js"
                    value={techStack}
                    onChange={e => setTechStack(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="experienceLevel" className="text-sm font-medium block mb-1">Experience Level</label>
                  <select
                    id="experienceLevel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={experienceLevel}
                    onChange={e => setExperienceLevel(e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 text-white w-full mt-4"
                onClick={handleGenerateInterview}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin mr-2 w-4 h-4" /> Generating...
                  </>
                ) : "Generate Interview Questions"}
              </Button>
            </div>
          ) : stage === "generating" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader className="animate-spin w-12 h-12 text-primary mb-4" />
              <p className="text-muted-foreground">Generating personalized interview questions...</p>
            </div>
          ) : null}

          {stage === "ready" && (
            <div className="w-full flex flex-col gap-6 items-center">
              <Card className="w-full border-0 bg-gradient-to-br from-background via-muted to-background dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center gap-4">
                  <MessageSquare className="w-7 h-7 text-primary" />
                  <CardTitle className="font-medium">Your AI-Generated Interview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    {interviewQuestions.length > 0 ? (
                      interviewQuestions.map((q, i) => (
                        <li key={i} className="mb-2 py-1">{q}</li>
                      ))
                    ) : (
                      <div className="text-center p-4 text-muted-foreground italic">
                        No questions generated yet. Please try again.
                      </div>
                    )}
                  </ol>
                </CardContent>
              </Card>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 text-white w-full"
                onClick={handleStartCall}
                disabled={interviewQuestions.length === 0}
              >
                <Play className="mr-2 w-4 h-4" /> Start Interview
              </Button>
            </div>
          )}

          {stage === "calling" && (
            <div className="w-full flex flex-col gap-6 items-center animate-fade-in">
              <div className="flex items-center justify-center gap-8 mb-2">
                <div className="flex flex-col items-center bg-primary/10 px-6 py-4 rounded-xl border border-primary/10 shadow">
                  <div className="relative">
                    <div className={cn("h-14 w-14 rounded-full border-2 shadow flex items-center justify-center bg-muted", 
                      isSpeaking ? "ring-4 ring-primary/40" : "")}>
                      <Mic className="h-8 w-8 text-primary" />
                    </div>
                    {isSpeaking && <span className="absolute right-1 bottom-1 block w-4 h-4 rounded-full bg-green-400 animate-pulse ring-2 ring-white" />}
                  </div>
                  <div className="font-medium mt-2 text-primary">AI Interviewer</div>
                </div>
                <div className="flex flex-col items-center bg-muted px-6 py-4 rounded-xl border border-muted shadow">
                  <div className="relative">
                    <User className="h-14 w-14 rounded-full bg-muted border-2 border-muted-foreground text-muted-foreground p-2" />
                  </div>
                  <div className="font-medium mt-2 text-muted-foreground">{userName}</div>
                </div>
              </div>
              
              {currentQuestionIndex >= 0 && currentQuestionIndex < interviewQuestions.length && (
                <div className="w-full">
                  <Badge variant="outline" className="mb-2">
                    Question {currentQuestionIndex + 1} of {interviewQuestions.length}
                  </Badge>
                  <div className="font-medium mb-2">{interviewQuestions[currentQuestionIndex]}</div>
                </div>
              )}
              
              <div className="w-full bg-muted rounded-lg p-4 min-h-[60px] text-center shadow transition-all duration-500">
                <span className="text-muted-foreground">
                  {lastMessage || <span className="italic">Speak when you see the microphone light up...</span>}
                </span>
              </div>
              <div className="flex gap-4 mt-4 justify-center">
                {callStatus !== CallStatus.ACTIVE ? (
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-2 text-lg relative"
                    onClick={handleStartCall}
                    disabled={callStatus === CallStatus.CONNECTING}
                  >
                    {callStatus === CallStatus.CONNECTING ? (<Loader className="animate-spin mr-2 w-4 h-4" />) : (<Play className="mr-2 w-4 h-4" />)}
                    {callStatus === CallStatus.INACTIVE ? "Call" : "Connecting..."}
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    size="lg"
                    className="px-8 py-2 text-lg"
                    onClick={handleDisconnect}
                  >
                    <ArrowDown className="mr-2 w-5 h-5" /> End Interview
                  </Button>
                )}
              </div>
            </div>
          )}

          {stage === "analyzing" && (
            <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
              <div className="text-xl font-semibold">Analyzing your responses...</div>
              <Loader className="animate-spin w-10 h-10 text-primary mb-2" />
              <div className="w-full bg-muted rounded-lg p-4 text-center">
                <span className="text-muted-foreground">
                  Our AI is analyzing your speech patterns, clarity, relevance, and more...
                </span>
              </div>
            </div>
          )}

          {stage === "feedback" && speechAnalysisCompleted && (
            <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
              <div className="flex items-center justify-center w-full bg-gradient-to-r from-background to-muted p-4 rounded-lg shadow-sm mb-2">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-1">Overall Score</div>
                  <div className={cn("text-4xl font-bold", 
                    overallScore >= 8 ? "text-green-500" : 
                    overallScore >= 6 ? "text-amber-500" : 
                    "text-red-500"
                  )}>
                    {overallScore}/10
                  </div>
                </div>
              </div>
              
              <div className="w-full space-y-2">
                <div className="flex items-center mb-2">
                  <BarChart className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold">Detailed Feedback</h3>
                </div>
                
                {userAnswers.map((answer, index) => (
                  index < interviewQuestions.length && answerFeedbacks[index] ? (
                    <AnswerFeedbackCard
                      key={index}
                      question={interviewQuestions[index]}
                      answer={answer}
                      feedback={answerFeedbacks[index]}
                      questionNumber={index + 1}
                    />
                  ) : null
                ))}
              </div>
              
              <div className="flex gap-4 w-full">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-1/2"
                  onClick={() => setStage("ready")}
                >
                  Try Again
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 text-white w-1/2"
                  onClick={handleViewFeedback}
                >
                  Get Detailed AI Feedback
                </Button>
              </div>
            </div>
          )}

          {stage === "done" && (
            <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
              <Check className="w-12 h-12 text-green-500 drop-shadow" />
              <div className="text-xl font-semibold">Interview complete!</div>
              <div className="text-muted-foreground text-center">
                Generating feedback... <Loader className="inline animate-spin w-6 h-6" />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end text-xs text-muted-foreground font-mono">
          powered by Vapi + Gemini AI
        </CardFooter>
      </Card>
    </div>
  );
};

export default InterviewPage;
