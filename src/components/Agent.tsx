// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Image from "./Image"; // Replace with correct import for Image or use <img>
// import { cn } from "../lib/utils";
// import { vapi } from "../lib/vapi.sdk";
// import { interviewer } from "../constants";
// import { createFeedback } from "../lib/actions/general.action";

// const CallStatus = {
//   INACTIVE: "INACTIVE",
//   CONNECTING: "CONNECTING",
//   ACTIVE: "ACTIVE",
//   FINISHED: "FINISHED",
// };

// const Agent = ({ userName, userId, interviewId, feedbackId, type, questions }) => {
//   const navigate = useNavigate();
//   const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
//   const [messages, setMessages] = useState([]);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [lastMessage, setLastMessage] = useState("");

//   useEffect(() => {
//     const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
//     const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
//     const onMessage = (message) => {
//       if (message.type === "transcript" && message.transcriptType === "final") {
//         const newMessage = { role: message.role, content: message.transcript };
//         setMessages((prev) => [...prev, newMessage]);
//       }
//     };
//     const onSpeechStart = () => setIsSpeaking(true);
//     const onSpeechEnd = () => setIsSpeaking(false);
//     const onError = (error) => console.error("Error:", error);

//     vapi.on("call-start", onCallStart);
//     vapi.on("call-end", onCallEnd);
//     vapi.on("message", onMessage);
//     vapi.on("speech-start", onSpeechStart);
//     vapi.on("speech-end", onSpeechEnd);
//     vapi.on("error", onError);

//     return () => {
//       vapi.off("call-start", onCallStart);
//       vapi.off("call-end", onCallEnd);
//       vapi.off("message", onMessage);
//       vapi.off("speech-start", onSpeechStart);
//       vapi.off("speech-end", onSpeechEnd);
//       vapi.off("error", onError);
//     };
//   }, []);

//   useEffect(() => {
//     if (messages.length > 0) {
//       setLastMessage(messages[messages.length - 1].content);
//     }

//     const handleGenerateFeedback = async (messages) => {
//       const { success, feedbackId: id } = await createFeedback({
//         interviewId,
//         userId,
//         transcript: messages,
//         feedbackId,
//       });

//       if (success && id) navigate(`/interview/${interviewId}/feedback`);
//       else navigate("/");
//     };

//     if (callStatus === CallStatus.FINISHED) {
//       if (type === "generate") navigate("/");
//       else handleGenerateFeedback(messages);
//     }
//   }, [messages, callStatus]);

//   const handleCall = async () => {
//     setCallStatus(CallStatus.CONNECTING);
//     if (type === "generate") {
//       await vapi.start(process.env.REACT_APP_VAPI_WORKFLOW_ID, {
//         variableValues: { username: userName, userid: userId },
//       });
//     } else {
//       const formattedQuestions = questions?.map((q) => `- ${q}`).join("\n") || "";
//       await vapi.start(interviewer, {
//         variableValues: { questions: formattedQuestions },
//       });
//     }
//   };

//   const handleDisconnect = () => {
//     setCallStatus(CallStatus.FINISHED);
//     vapi.stop();
//   };

//   return (
//     <>
//       <div className="call-view">
//         <div className="card-interviewer">
//           <div className="avatar">
//             <img src="/ai-avatar.png" alt="AI Interviewer" width={65} height={54} />
//             {isSpeaking && <span className="animate-speak" />}
//           </div>
//           <h3>AI Interviewer</h3>
//         </div>

//         <div className="card-border">
//           <div className="card-content">
//             <img src="/user-avatar.png" alt="User" width={120} height={120} className="rounded-full object-cover" />
//             <h3>{userName}</h3>
//           </div>
//         </div>
//       </div>

//       {messages.length > 0 && (
//         <div className="transcript-border">
//           <div className="transcript">
//             <p className={cn("transition-opacity duration-500 animate-fadeIn")}>{lastMessage}</p>
//           </div>
//         </div>
//       )}

//       <div className="w-full flex justify-center">
//         {callStatus !== CallStatus.ACTIVE ? (
//           <button className="btn-call" onClick={handleCall}>
//             <span className={cn("absolute animate-ping", callStatus !== CallStatus.CONNECTING && "hidden")} />
//             <span className="relative">
//               {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? "Call" : ". . ."}
//             </span>
//           </button>
//         ) : (
//           <button className="btn-disconnect" onClick={handleDisconnect}>End</button>
//         )}
//       </div>
//     </>
//   );
// };

// export default Agent;