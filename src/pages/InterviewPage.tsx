// // src/pages/InterviewPage.tsx (or your appropriate path)

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from "sonner"; // Assuming 'sonner' is used for toasts
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select imports
// import { Mic, Video, Loader, Check, MessageSquare, User, Play, ArrowDown, AlertCircle, BarChart } from 'lucide-react';
// import { cn } from "@/lib/utils";
// import { pythonAI } from "@/lib/pythonAI.sdk"; // Import the PythonAI SDK instance
// import { geminiGenerateQuestions, InterviewParams, analyzeAnswer, saveAnswerFeedback, AnswerFeedback } from "@/lib/gemini.sdk"; // Import Gemini SDK functions and types
// import { createFeedback } from "@/lib/feedback"; // Import feedback creation function
// import { DashboardNav } from "@/components/DashboardNav"; // Assuming this exists
// import { auth, db } from "@/lib/firebase"; // Import Firebase auth and db
// import { doc, getDoc } from "firebase/firestore";
// import AnswerFeedbackCard from "@/components/AnswerFeedbackCard"; // Import the feedback card component

// // Enum for call statuses
// const CallStatus = {
//   INACTIVE: "INACTIVE",
//   CONNECTING: "CONNECTING",
//   ACTIVE: "ACTIVE",
//   FINISHED: "FINISHED", // Interview ended, processing starts
//   ANALYZING: "ANALYZING", // Post-call analysis in progress
// };

// // Type for different stages of the interview page UI
// type Stage = "idle" | "generating" | "ready" | "calling" | "analyzing" | "feedback" | "done";

// const InterviewPage = () => {
//   const [stage, setStage] = useState<Stage>("idle");
//   const navigate = useNavigate();
//   const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
//   const [messages, setMessages] = useState<{ role: string; content: string; responseTime?: number }[]>([]);
//   const [isSpeaking, setIsSpeaking] = useState(false); // Track if AI is speaking
//   const [error, setError] = useState<string>("");
//   const [userName, setUserName] = useState("");
//   const [userId, setUserId] = useState("");
//   const [interviewId, setInterviewId] = useState<string | null>(null);
//   const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
//   const [lastMessage, setLastMessage] = useState<string>(""); // Display last spoken message
//   const [isGenerating, setIsGenerating] = useState(false); // Loading state for question generation
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1); // Track current question
//   const [userAnswers, setUserAnswers] = useState<string[]>([]); // Store user's answers
//   const [answerFeedbacks, setAnswerFeedbacks] = useState<(AnswerFeedback | null)[]>([]); // Store feedback for each answer
//   const [isAnalyzing, setIsAnalyzing] = useState(false); // General analyzing state (overlaps with CallStatus.ANALYZING)
//   const [overallScore, setOverallScore] = useState<number>(0);
//   const [feedbackReady, setFeedbackReady] = useState(false); // Flag when all feedback is processed

//   // Interview preferences state
//   const [jobRole, setJobRole] = useState("");
//   const [techStack, setTechStack] = useState("");
//   const [experienceLevel, setExperienceLevel] = useState("intermediate"); // Default experience level
//   const [questionCount, setQuestionCount] = useState<number>(5); // Default question count

//   // Fetch user data on component mount
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       if (user) {
//         setUserId(user.uid);
//         try {
//           const userDocRef = doc(db, "users", user.uid);
//           const userDoc = await getDoc(userDocRef);
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             const displayName = userData.displayName || user.displayName || "User";
//             setUserName(displayName);
//             // Pre-fill preferences if available
//             if (userData.jobRole) setJobRole(userData.jobRole);
//             if (userData.techStack) setTechStack(userData.techStack.join(', ')); // Assuming stored as array
//             if (userData.experienceLevel) setExperienceLevel(userData.experienceLevel);
//           } else {
//             setUserName(user.displayName || "User"); // Fallback to auth display name
//           }
//         } catch (err) {
//           console.error("Error fetching user data:", err);
//           setError("Could not load user profile.");
//           setUserName(user.displayName || "User"); // Fallback
//         }
//       } else {
//         // Handle user not logged in - perhaps redirect or show login prompt
//         navigate('/login'); // Example redirect
//       }
//     });
//     return () => unsubscribe(); // Cleanup subscription
//   }, [navigate]);

//   // Function to handle interview generation
//   const handleGenerateInterview = async () => {
//     if (!userId || !userName || !jobRole || !techStack) {
//         toast.error("Please fill in all preference fields.");
//         setError("Job Role and Tech Stack are required to generate questions.");
//         return;
//     }
//     setStage("generating");
//     setIsGenerating(true);
//     setError("");
//     setInterviewQuestions([]); // Reset previous questions
//     setInterviewId(null);

//     try {
//       const params: InterviewParams = {
//         userId,
//         userName,
//         jobRole,
//         // Clean up tech stack input
//         techStack: techStack.split(',').map(item => item.trim()).filter(item => item.length > 0),
//         experienceLevel,
//         questionCount
//       };

//       console.log("Generating interview with params:", params);
//       toast.info("Generating personalized interview questions...");

//       // Call Gemini SDK to generate questions
//       const { questions, interviewId: id } = await geminiGenerateQuestions(params);

//       console.log("Generated questions:", questions);
//       console.log("Interview ID:", id);
//       toast.success("Interview questions generated successfully!");

//       setInterviewQuestions(questions);
//       setInterviewId(id); // Store the generated interview ID
//       setAnswerFeedbacks(new Array(questions.length).fill(null)); // Initialize feedback array
//       setUserAnswers(new Array(questions.length).fill("")); // Initialize answers array
//       setStage("ready");

//     } catch (err) {
//       console.error("Error generating questions:", err);
//       const errorMessage = err instanceof Error ? err.message : String(err);
//       setError(`Failed to generate interview questions: ${errorMessage}`);
//       toast.error("Failed to generate interview questions. Please check console or try again.");
//       setStage("idle"); // Revert to idle stage on error
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Function to analyze a single user answer
//   const analyzeUserAnswer = async (
//     questionIndex: number,
//     question: string,
//     answer: string,
//     responseTime?: number
//   ) => {
//     if (!interviewId) {
//         console.error("Cannot analyze answer without interviewId");
//         return;
//     }
//     // Prevent analyzing if feedback already exists for this index
//     if (answerFeedbacks[questionIndex] !== null) {
//         console.log(`Feedback for question ${questionIndex + 1} already exists. Skipping analysis.`);
//         return;
//     }

//     try {
//       console.log(`Analyzing answer for question ${questionIndex + 1}...`);
//       toast.info(`Analyzing answer ${questionIndex + 1}...`);

//       // Call Gemini SDK to analyze the answer
//       const feedback = await analyzeAnswer(question, answer, jobRole, experienceLevel, responseTime);

//       // Save the feedback to Firebase
//       await saveAnswerFeedback(
//         interviewId,
//         userId,
//         questionIndex,
//         question,
//         answer,
//         feedback
//       );

//       console.log(`Feedback received for question ${questionIndex + 1}:`, feedback);
//       toast.success(`Feedback ready for question ${questionIndex + 1}!`);

//       // Update state with the new feedback, ensuring immutability
//       setAnswerFeedbacks(prev => {
//         const newFeedbacks = [...prev];
//         newFeedbacks[questionIndex] = feedback;
//         return newFeedbacks;
//       });

//     } catch (err) {
//       console.error(`Error analyzing answer for question ${questionIndex + 1}:`, err);
//       toast.error(`Failed to get feedback for question ${questionIndex + 1}.`);
//        // Optionally set a placeholder error feedback or leave as null
//        setAnswerFeedbacks(prev => {
//          const newFeedbacks = [...prev];
//          // You might want to set an error object here instead of null
//          // newFeedbacks[questionIndex] = { error: 'Analysis Failed' };
//          return newFeedbacks;
//        });
//     }
//   };

//   // Effect to handle PythonAI SDK events
//   useEffect(() => {
//     function onCallStart() {
//       console.log("Call started event received");
//       setCallStatus(CallStatus.ACTIVE);
//       setStage("calling");
//       setError("");
//       setMessages([]); // Clear previous messages
//       setCurrentQuestionIndex(-1); // Reset index
//       setFeedbackReady(false); // Reset feedback flag
//       setLastMessage("Interview is starting...");
//     }

//     function onCallEnd() {
//       console.log("Call ended event received");
//       setCallStatus(CallStatus.FINISHED); // Move to finished, analysis happens next
//       setStage("analyzing");
//       setIsAnalyzing(true); // Set analyzing state
//       setLastMessage("Interview finished. Analyzing responses...");
//       toast.info("Interview ended. Analyzing your answers...");
//     }

//     async function onMessage(message: any) {
//       console.log("Message received:", message);
//       if (message?.type === "transcript") {
//          // Update the last spoken message display
//          if (message.role === 'assistant' || message.transcriptType === 'final') {
//             setLastMessage(message.transcript);
//          }

//          // Store final transcripts in messages state
//          if (message.transcriptType === 'final') {
//              const newMessage = { role: message.role, content: message.transcript, responseTime: message.responseTime };
//              setMessages(prev => [...prev, newMessage]);

//              if (message.role === 'assistant') {
//                // Update UI to show which question is being asked
//                setCurrentQuestionIndex(pythonAI.getCurrentQuestionIndex());
//              } else if (message.role === 'user') {
//                // Store the user's final answer transcript
//                const answerIndex = message.questionIndex ?? pythonAI.getCurrentQuestionIndex(); // Use index from message if available
//                if (answerIndex >= 0 && answerIndex < interviewQuestions.length) {
//                  setUserAnswers(prev => {
//                    const newAnswers = [...prev];
//                    newAnswers[answerIndex] = message.transcript;
//                    return newAnswers;
//                  });

//                  // Trigger analysis for this answer
//                  const question = interviewQuestions[answerIndex];
//                  analyzeUserAnswer(answerIndex, question, message.transcript, message.responseTime);
//                } else {
//                  console.warn("Received user answer but index is out of bounds:", answerIndex);
//                }
//              }
//          }
//       }
//     }

//     function onSpeechStart() {
//         console.log("AI Speech started");
//         setIsSpeaking(true);
//     }
//     function onSpeechEnd() {
//         console.log("AI Speech ended");
//         setIsSpeaking(false);
//     }
//     function onError(err: any) {
//       const errorMsg = "Call error: " + (err?.message || String(err));
//       console.error(errorMsg, err);
//       setError(errorMsg + ". Please check microphone permissions and try again.");
//       toast.error("An error occurred during the interview.");
//       setCallStatus(CallStatus.INACTIVE);
//       // Decide where to reset the stage, perhaps back to 'ready' or 'idle'
//       setStage("ready");
//       setIsSpeaking(false);
//       setIsAnalyzing(false);
//     }

//     // Register event listeners
//     pythonAI.on("call-start", onCallStart);
//     pythonAI.on("call-end", onCallEnd);
//     pythonAI.on("message", onMessage);
//     pythonAI.on("speech-start", onSpeechStart);
//     pythonAI.on("speech-end", onSpeechEnd);
//     pythonAI.on("error", onError);

//     // Cleanup function to remove listeners
//     return () => {
//       pythonAI.off("call-start", onCallStart);
//       pythonAI.off("call-end", onCallEnd);
//       pythonAI.off("message", onMessage);
//       pythonAI.off("speech-start", onSpeechStart);
//       pythonAI.off("speech-end", onSpeechEnd);
//       pythonAI.off("error", onError);
//       // Ensure call is stopped if component unmounts during active call
//       if (pythonAI.isActive) {
//           pythonAI.stop();
//       }
//     };
//   }, [interviewQuestions, interviewId, userId, jobRole, experienceLevel]); // Add dependencies that analyzeUserAnswer uses

//   // Effect to check if all feedback is ready and transition to feedback stage
//   useEffect(() => {
//     // Check conditions: interview finished, analyzing state is set, and all feedbacks are received
//     if (stage === "analyzing" && callStatus === CallStatus.FINISHED && answerFeedbacks.length === interviewQuestions.length && answerFeedbacks.every(fb => fb !== null)) {
//         console.log("All feedback received. Calculating overall score.");

//         // Calculate overall score
//         const validFeedbacks = answerFeedbacks.filter(fb => fb !== null) as AnswerFeedback[];
//         const totalScore = validFeedbacks.reduce((sum, feedback) => sum + feedback.overallScore, 0);
//         const avgScore = validFeedbacks.length > 0 ? Math.round(totalScore / validFeedbacks.length) : 0;
//         setOverallScore(avgScore);

//         console.log("Overall Score:", avgScore);
//         setFeedbackReady(true); // Mark feedback as ready
//         setStage("feedback"); // Transition to feedback stage
//         setIsAnalyzing(false); // Turn off general analyzing indicator
//         setCallStatus(CallStatus.FINISHED); // Ensure status is Finished
//         toast.success("Analysis complete! View your feedback below.");
//     }
//   }, [stage, callStatus, answerFeedbacks, interviewQuestions.length]); // Dependencies that trigger this check

//   // Function to start the interview call
//   const handleStartCall = async () => {
//     if (interviewQuestions.length === 0 || !interviewId) {
//         setError("Questions not generated or interview ID missing.");
//         toast.error("Cannot start interview. Please generate questions first.");
//         return;
//     }
//     setError("");
//     setCallStatus(CallStatus.CONNECTING);
//     setStage("calling"); // Set stage to calling immediately
//     setCurrentQuestionIndex(-1);
//     // Reset states for a new call
//     setUserAnswers(new Array(interviewQuestions.length).fill(""));
//     setAnswerFeedbacks(new Array(interviewQuestions.length).fill(null));
//     setMessages([]);
//     setFeedbackReady(false);
//     setOverallScore(0);
//     setLastMessage("Connecting...");

//     try {
//       // Start the PythonAI SDK interview process
//       await pythonAI.start(interviewQuestions, {
//         userName,
//         userId,
//         jobRole,
//         techStack, // Pass the raw string, SDK might not need it structured
//         experienceLevel
//       });
//       // onCallStart event will handle setting status to ACTIVE
//     } catch (err) {
//       console.error("Failed to start interview call:", err);
//       const errorMsg = err instanceof Error ? err.message : String(err);
//       setError(`Failed to start interview. Check microphone access. Error: ${errorMsg}`);
//       toast.error("Failed to start interview. Check microphone permissions.");
//       setCallStatus(CallStatus.INACTIVE);
//       setStage("ready"); // Go back to ready stage
//     }
//   };

//   // Function to manually stop the interview
//   const handleDisconnect = () => {
//     console.log("User initiated disconnect.");
//     // Don't set to ANALYZING here, let the onCallEnd event handle the state transition
//     pythonAI.stop(); // This should trigger the 'call-end' event
//   };

//   // Function to navigate to a detailed feedback page (if implemented)
//   const handleViewDetailedFeedback = async () => {
//     setStage("done"); // Indicate final processing/navigation
//     toast.info("Preparing detailed feedback report...");
//     try {
//       // Optional: Call a function to generate a more comprehensive feedback report if needed
//       // This example assumes createFeedback primarily saves the session info for retrieval
//        const { success, feedbackId: finalFeedbackId } = await createFeedback({
//          interviewId,
//          userId,
//          transcript: messages, // Pass the collected messages
//          // feedbackId might be needed if createFeedback updates an existing doc
//        });

//       if (success && finalFeedbackId && interviewId) {
//         console.log("Navigating to detailed feedback page for interview:", interviewId);
//         navigate(`/interview/${interviewId}/feedback/${finalFeedbackId}`); // Navigate to specific feedback page
//       } else {
//         throw new Error("Failed to record feedback session.");
//       }
//     } catch (err) {
//       console.error("Error preparing or navigating to detailed feedback:", err);
//       toast.error("Could not load detailed feedback page.");
//       setStage("feedback"); // Revert stage if navigation fails
//        // Optionally navigate to a general dashboard or stay on the page
//       // navigate("/dashboard");
//     }
//   };

//   // Render logic based on the current stage
//   const renderContent = () => {
//     switch (stage) {
//       case "idle":
//       case "generating": // Show preferences form also during generation maybe? Or a loader like below
//         return (
//           <div className="flex flex-col gap-4 w-full">
//             <h3 className="font-medium text-lg mb-1 text-center">Interview Preferences</h3>
//              {!userId && <p className="text-center text-destructive">Loading user info...</p>}
//              {userId && <p className="text-center text-muted-foreground mb-4">Welcome, {userName}!</p>}

//              <div className="space-y-4 px-4 md:px-8">
//               <div>
//                 <label htmlFor="jobRole" className="text-sm font-medium block mb-1">Target Job Role*</label>
//                 <Input
//                   id="jobRole"
//                   placeholder="e.g. Senior Frontend Developer"
//                   value={jobRole}
//                   onChange={e => setJobRole(e.target.value)}
//                   disabled={isGenerating || !userId}
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="techStack" className="text-sm font-medium block mb-1">Key Technologies / Skills (comma-separated)*</label>
//                 <Input
//                   id="techStack"
//                   placeholder="e.g. React, TypeScript, Node.js, AWS"
//                   value={techStack}
//                   onChange={e => setTechStack(e.target.value)}
//                   disabled={isGenerating || !userId}
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                       <label htmlFor="experienceLevel" className="text-sm font-medium block mb-1">Experience Level</label>
//                       <Select value={experienceLevel} onValueChange={setExperienceLevel} disabled={isGenerating || !userId}>
//                           <SelectTrigger id="experienceLevel">
//                               <SelectValue placeholder="Select level" />
//                           </SelectTrigger>
//                           <SelectContent>
//                               <SelectItem value="beginner">Beginner (0-2 yrs)</SelectItem>
//                               <SelectItem value="intermediate">Intermediate (2-5 yrs)</SelectItem>
//                               <SelectItem value="expert">Expert (5+ yrs)</SelectItem>
//                           </SelectContent>
//                       </Select>
//                   </div>
//                   <div>
//                       <label htmlFor="questionCount" className="text-sm font-medium block mb-1">Number of Questions</label>
//                        <Select value={String(questionCount)} onValueChange={(value) => setQuestionCount(Number(value))} disabled={isGenerating || !userId}>
//                           <SelectTrigger id="questionCount">
//                               <SelectValue placeholder="Select count" />
//                           </SelectTrigger>
//                           <SelectContent>
//                               <SelectItem value="3">3 Questions</SelectItem>
//                               <SelectItem value="5">5 Questions</SelectItem>
//                               <SelectItem value="7">7 Questions</SelectItem>
//                               <SelectItem value="10">10 Questions</SelectItem>
//                           </SelectContent>
//                       </Select>
//                   </div>
//               </div>
//             </div>

//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-primary to-primary/80 text-white w-full max-w-md mx-auto mt-6"
//               onClick={handleGenerateInterview}
//               disabled={isGenerating || !userId || !jobRole || !techStack}
//             >
//               {isGenerating ? (
//                 <> <Loader className="animate-spin mr-2 w-4 h-4" /> Generating Questions... </>
//               ) : "Generate Interview Questions"}
//             </Button>
//           </div>
//         );

//       case "ready":
//         return (
//           <div className="w-full flex flex-col gap-6 items-center animate-fade-in">
//             <Card className="w-full border-0 bg-gradient-to-br from-background via-muted/50 to-background dark:from-gray-800 dark:to-gray-900 shadow-md">
//               <CardHeader className="flex flex-row items-center gap-4 pb-2">
//                 <MessageSquare className="w-7 h-7 text-primary" />
//                 <CardTitle className="font-medium text-xl">Your AI Interview is Ready</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground mb-3">Based on your preferences ({jobRole}, {experienceLevel}, {techStack}), here are your questions:</p>
//                 <ol className="list-decimal pl-5 space-y-2 text-sm">
//                   {interviewQuestions.length > 0 ? (
//                     interviewQuestions.map((q, i) => (
//                       <li key={i} className="mb-1 p-1 rounded">{q}</li>
//                     ))
//                   ) : (
//                     <div className="text-center p-4 text-muted-foreground italic">
//                       No questions generated. Please try again.
//                     </div>
//                   )}
//                 </ol>
//                  <p className="text-xs text-muted-foreground mt-4 italic">Interview ID: {interviewId}</p>
//               </CardContent>
//             </Card>
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-full max-w-md mx-auto"
//               onClick={handleStartCall}
//               disabled={interviewQuestions.length === 0 || callStatus === CallStatus.CONNECTING}
//             >
//               {callStatus === CallStatus.CONNECTING ? (
//                   <> <Loader className="animate-spin mr-2 w-4 h-4" /> Connecting... </>
//               ) : (
//                   <> <Play className="mr-2 w-5 h-5" /> Start Interview </>
//               )}
//             </Button>
//              <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setStage("idle")} // Allow going back to change preferences
//                 disabled={callStatus === CallStatus.CONNECTING}
//             >
//                 Change Preferences
//             </Button>
//           </div>
//         );

//       case "calling":
//         return (
//           <div className="w-full flex flex-col gap-4 items-center animate-fade-in">
//             {/* Interviewer/User Display */}
//             <div className="flex items-center justify-center gap-8 mb-4 w-full">
//               {/* AI Interviewer */}
//               <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/5 border border-primary/10 shadow-sm w-1/2">
//                 <div className="relative mb-2">
//                   <div className={cn(
//                     "h-16 w-16 rounded-full border-2 border-primary/20 shadow-md flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20 transition-all duration-300",
//                     isSpeaking ? "ring-4 ring-primary/40 ring-offset-2 ring-offset-background scale-110" : "scale-100"
//                   )}>
//                     <Mic className="h-8 w-8 text-primary" />
//                   </div>
//                   {isSpeaking && (
//                     <span className="absolute right-0 bottom-0 block w-4 h-4 rounded-full bg-green-400 animate-pulse ring-2 ring-white dark:ring-gray-800" />
//                   )}
//                 </div>
//                 <div className="font-medium text-sm text-primary">AI Interviewer</div>
//                 <Badge variant="outline" className="mt-1 text-xs">
//                   {isSpeaking ? "Speaking..." : "Listening..."}
//                 </Badge>
//               </div>
//               {/* User */}
//               <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 border border-border shadow-sm w-1/2">
//                 <div className="relative mb-2">
//                     <User className="h-16 w-16 rounded-full bg-muted border-2 border-muted-foreground/20 text-muted-foreground p-3" />
//                      {/* Optional: Add indicator if user is detected speaking */}
//                 </div>
//                 <div className="font-medium text-sm text-foreground">{userName}</div>
//                  <Badge variant="secondary" className="mt-1 text-xs">{jobRole}</Badge>
//               </div>
//             </div>

//              {/* Current Question Display */}
//             {currentQuestionIndex >= 0 && currentQuestionIndex < interviewQuestions.length && (
//               <div className="w-full p-3 bg-background border rounded-md shadow-sm text-center">
//                 <Badge variant="outline" className="mb-2 text-xs">
//                   Question {currentQuestionIndex + 1} of {interviewQuestions.length}
//                 </Badge>
//                 <p className="font-medium text-sm md:text-base">{interviewQuestions[currentQuestionIndex]}</p>
//               </div>
//             )}

//             {/* Last Message / Status Display */}
//             <div className="w-full bg-muted rounded-lg p-4 min-h-[60px] text-center shadow-inner transition-all duration-500 border border-border">
//               <span className="text-sm text-muted-foreground italic">
//                 {callStatus === CallStatus.CONNECTING ? "Connecting to interview..." : (lastMessage || "Waiting for AI...")}
//               </span>
//             </div>

//             {/* Call Controls */}
//             <div className="flex gap-4 mt-4 justify-center">
//               {callStatus === CallStatus.ACTIVE ? (
//                 <Button
//                   variant="destructive"
//                   size="lg"
//                   className="px-8 py-3 text-base"
//                   onClick={handleDisconnect}
//                 >
//                   <ArrowDown className="mr-2 w-5 h-5" /> End Interview
//                 </Button>
//               ) : (
//                  <Button
//                   size="lg"
//                   className="px-8 py-3 text-base"
//                   disabled // Button usually disabled here as start is handled elsewhere
//                 >
//                   <Loader className="animate-spin mr-2 w-4 h-4" /> Connecting...
//                 </Button>
//               )}
//             </div>
//           </div>
//         );

//        case "analyzing":
//         return (
//           <div className="w-full flex flex-col items-center gap-4 animate-fade-in text-center py-8">
//             <div className="text-xl font-semibold mb-2">Analyzing Responses</div>
//             <Loader className="animate-spin w-12 h-12 text-primary mb-4" />
//             <p className="text-muted-foreground max-w-md">
//               Please wait while the AI analyzes your answers based on clarity, relevance, confidence, and other factors. This may take a moment...
//             </p>
//             {/* Progress Indicator (Optional) */}
//             <div className="w-full max-w-sm bg-muted rounded-full h-2.5 dark:bg-gray-700 mt-4">
//                 <div className="bg-primary h-2.5 rounded-full animate-pulse" style={{ width: `${(answerFeedbacks.filter(fb => fb !== null).length / interviewQuestions.length) * 100}%` }}></div>
//             </div>
//              <p className="text-xs text-muted-foreground mt-2">
//                 Analyzed {answerFeedbacks.filter(fb => fb !== null).length} of {interviewQuestions.length} answers.
//             </p>
//           </div>
//         );


//       case "feedback":
//         return (
//           <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
//             {/* Overall Score */}
//             <div className="flex flex-col items-center justify-center w-full bg-gradient-to-r from-background via-muted/30 to-background p-6 rounded-lg shadow-md mb-4 border">
//               <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Overall Performance</div>
//               <div className={cn("text-5xl font-bold mb-2",
//                 overallScore >= 8 ? "text-green-600 dark:text-green-400" :
//                 overallScore >= 5 ? "text-amber-600 dark:text-amber-400" :
//                                     "text-red-600 dark:text-red-400"
//               )}>
//                 {overallScore} / 10
//               </div>
//               <p className="text-sm text-muted-foreground text-center max-w-sm">
//                 This score reflects an average of your performance across all questions based on relevance, clarity, and confidence.
//               </p>
//             </div>

//             {/* Detailed Feedback Section */}
//             <div className="w-full space-y-4">
//               <div className="flex items-center mb-2">
//                 <BarChart className="w-5 h-5 text-primary mr-2" />
//                 <h3 className="text-xl font-semibold">Detailed Answer Feedback</h3>
//               </div>

//               {/* Map through answers and render feedback cards */}
//               {interviewQuestions.map((question, index) => {
//                  // Check if both answer and feedback exist for this index
//                  const answer = userAnswers[index];
//                  const feedback = answerFeedbacks[index];
//                  if (answer && feedback) {
//                      return (
//                          <AnswerFeedbackCard
//                              key={index}
//                              question={question}
//                              answer={answer}
//                              feedback={feedback}
//                              questionNumber={index + 1}
//                          />
//                      );
//                  } else if (question) {
//                      // Render a placeholder if feedback is missing (optional)
//                      return (
//                         <Card key={index} className="w-full mb-4 shadow-sm border-dashed border-muted-foreground/50 opacity-70">
//                             <CardHeader className="pb-2">
//                                 <CardTitle className="text-base font-medium text-muted-foreground">
//                                     Question {index + 1}: {question}
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <p className="text-sm text-muted-foreground italic">
//                                     {answer ? "Feedback analysis pending or failed." : "No answer recorded for this question."}
//                                 </p>
//                             </CardContent>
//                         </Card>
//                      )
//                  }
//                  return null; // Should not happen if questions array is source
//               })}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="w-full sm:w-1/2"
//                 onClick={() => {
//                     setStage("ready"); // Go back to ready state with same questions
//                     setCallStatus(CallStatus.INACTIVE);
//                     setError('');
//                 }}
//               >
//                 Try This Interview Again
//               </Button>
//               <Button
//                 size="lg"
//                 className="bg-gradient-to-r from-primary to-primary/80 text-white w-full sm:w-1/2"
//                 onClick={handleViewDetailedFeedback} // Use the specific handler
//               >
//                 View Full Report & Transcript
//               </Button>
//             </div>
//              <Button
//                 variant="link"
//                 size="sm"
//                 className="mt-2 text-muted-foreground"
//                 onClick={() => {
//                     setStage("idle"); // Go back to start to generate new questions
//                     setCallStatus(CallStatus.INACTIVE);
//                     setError('');
//                     setInterviewQuestions([]);
//                     setInterviewId(null);
//                 }}
//               >
//                 Start a New Interview
//               </Button>
//           </div>
//         );

//        case "done":
//         return (
//           <div className="w-full flex flex-col items-center gap-4 animate-fade-in text-center py-8">
//              <Check className="w-16 h-16 text-green-500 drop-shadow-lg mb-3" />
//              <div className="text-xl font-semibold">Processing Complete!</div>
//              <div className="text-muted-foreground mb-4">
//                 Redirecting you to the detailed feedback report...
//              </div>
//              <Loader className="animate-spin w-8 h-8 text-primary" />
//            </div>
//         );

//       default:
//         return <div>Loading or unknown state...</div>;
//     }
//   };

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 flex items-start justify-center overflow-auto px-4">
//       <DashboardNav /> {/* Assuming DashboardNav handles its own positioning */}
//       {/* Background decorative elements */}
//        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
//             <div className="absolute -left-24 top-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse opacity-50" />
//             <div className="absolute -right-10 bottom-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse opacity-40" />
//       </div>

//       <Card className="relative z-10 max-w-3xl w-full shadow-xl border-0 bg-card/80 dark:bg-gray-800/90 backdrop-blur-lg mt-16 mb-8 animate-fade-in">
//         <CardHeader className="flex flex-col items-center gap-3 bg-gradient-to-r from-primary/5 to-background/0 rounded-t-lg pt-8 pb-6 border-b">
//            <div className="flex items-center gap-3">
//              <Badge variant="outline" className="px-3 py-1 border-primary/30 bg-primary/10 text-primary dark:text-primary shadow-sm">
//                <Mic className="w-4 h-4 mr-1.5" />
//                AI Voice Interview
//              </Badge>
//               <Badge variant="secondary" className="px-3 py-1 bg-muted text-muted-foreground dark:text-white shadow-sm">
//                <Video className="w-4 h-4 mr-1.5" /> {/* Icon represents analysis */}
//                Speech Analysis
//              </Badge>
//            </div>
//            <CardTitle className="text-2xl md:text-3xl font-semibold mt-2 text-center">
//               { stage === 'calling' ? 'Interview in Progress' :
//                 stage === 'feedback' ? 'Interview Feedback' :
//                 'Personalized AI Interview Practice'
//               }
//            </CardTitle>
//            <CardDescription className="text-center max-w-lg text-muted-foreground text-sm md:text-base">
//              { stage === 'idle' ? 'Define your target role and skills to generate a tailored practice interview.' :
//                stage === 'ready' ? 'Review the generated questions and start when ready.' :
//                stage === 'calling' ? 'Listen to the AI interviewer and respond clearly.' :
//                stage === 'analyzing' ? 'Your responses are being analyzed for detailed feedback.' :
//                stage === 'feedback' ? 'Review your performance score and feedback for each question.' :
//                'Ace your next interview with AI-powered practice and insights.'
//              }
//            </CardDescription>
//          </CardHeader>

//         <CardContent className="flex flex-col items-center py-8 px-4 md:px-8 space-y-6 min-h-[300px]">
//           {/* Error Display */}
//           {error && (
//             <div className="w-full px-4 py-3 bg-destructive/10 text-destructive-foreground rounded-md text-center font-medium shadow border border-destructive/20 mb-4 flex items-center justify-center gap-2">
//               <AlertCircle className="h-5 w-5" />
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Render dynamic content based on stage */}
//           {renderContent()}

//         </CardContent>

//         <CardFooter className="flex justify-center text-xs text-muted-foreground font-mono bg-muted/30 py-3 border-t">
//            Powered by Gemini AI & Web Speech API
//          </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default InterviewPage;