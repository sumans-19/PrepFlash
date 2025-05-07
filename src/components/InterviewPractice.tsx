"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import InterviewControls from "./InterviewControls"
import InterviewSetup from "./InterviewSetups"
import type { RecordingState, InterviewQuestion, EmotionDataPoint, InterviewSession } from "@/types/index"
import recordingService from "../services/recordingService"
import { detectFace, drawFaceDetections, loadModels } from "../services/faceDetectionService"
import {
  generateInterviewQuestions,
  generateQuestionFeedback,
  generateOverallFeedback,
  transcribeAudio,
} from "@/services/aiService"
import EmotionDisplay from "./EmotionDisplay"
import FeedbackDisplay from "./FeedbackDisplay"
import LiveTranscription from "./LiveTranscription"
import type { DifficultyLevel } from "../types/index"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { FaceExpressions, DominantEmotion } from '@/types/index';
export const InterviewPractice: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoPlaybackRef = useRef<HTMLVideoElement>(null)
  const faceDetectionRef = useRef<number | null>(null)

  // State
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [emotionData, setEmotionData] = useState<EmotionDataPoint[]>([])
  const [currentQuestionEmotionData, setCurrentQuestionEmotionData] = useState<EmotionDataPoint[]>([])
  const [jobDomain, setJobDomain] = useState<string | null>(null)
  const [isProcessingFeedback, setIsProcessingFeedback] = useState(false)
  const [sessionData, setSessionData] = useState<InterviewSession | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState<string>("")
  const [cameraInitialized, setCameraInitialized] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("current")
  const [isFaceDetectionRunning, setIsFaceDetectionRunning] = useState(false)

  // Load face-api models on component mount
  useEffect(() => {
    const initFaceModels = async () => {
      try {
        await loadModels()
        console.log("Face-api models loaded successfully")
      } catch (error) {
        console.error("Failed to load face-api models:", error)
        toast.error("Failed to load facial analysis models. Some features may not work properly.")
      }
    }

    initFaceModels()

    // Clean up on unmount
    return () => {
      if (faceDetectionRef.current) {
        cancelAnimationFrame(faceDetectionRef.current)
        faceDetectionRef.current = null
      }
      recordingService.closeMediaStream()
      if (recordingUrl) URL.revokeObjectURL(recordingUrl)
    }
  }, [])

  // Set up recording service face processor when face models are loaded
  useEffect(() => {
    recordingService.setFaceApiProcessor(detectFace)
  }, [])

  // Start face detection loop when camera is initialized
  useEffect(() => {
    if (cameraInitialized && canvasRef.current && videoRef.current) {
      startFaceDetectionLoop()
    }
  }, [cameraInitialized])

  // Function to start the face detection loop
  const startFaceDetectionLoop = () => {
    if (!videoRef.current || !canvasRef.current) return

    // Clear any existing animation frame
    if (faceDetectionRef.current) {
      cancelAnimationFrame(faceDetectionRef.current)
      faceDetectionRef.current = null
    }

    setIsFaceDetectionRunning(true)
    console.log("Starting face detection loop")

    const detectFaceLoop = async () => {
      if (videoRef.current && canvasRef.current) {
        try {
          // Check if video is ready and has dimensions
          if (videoRef.current.readyState >= 2 && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
            const detection = await detectFace(videoRef.current)

            // Only try to draw if we have a valid video element with dimensions
            if (videoRef.current && videoRef.current.videoWidth > 0) {
              drawFaceDetections(canvasRef.current, videoRef.current, detection)
            }

            // Always update emotion data when we have a detection, regardless of recording state
            if (detection && detection.expressions) {
              const timestamp = Date.now()
              const emotionDataPoint: EmotionDataPoint = {
                timestamp,
                expressions: detection.expressions,
                dominantEmotion: Object.entries(detection.expressions).reduce(
                  (max, [emotion, value]) => (value > max.value ? { emotion, value } : max),
                  { emotion: "neutral" as keyof FaceExpressions, value: 0 },
                ).emotion as DominantEmotion,
                confidence: Math.max(...Object.values(detection.expressions)),
                audioLevel: 0, // No audio when not recording
              }

              // Always update current question emotion data
              setCurrentQuestionEmotionData((prev) => [...prev, emotionDataPoint])
            }
          }
        } catch (error) {
          console.error("Error in face detection loop:", error)
          // Don't stop the loop on error, just continue
        }
      }

      // Continue the loop only if we haven't been unmounted
      if (videoRef.current && canvasRef.current) {
        faceDetectionRef.current = requestAnimationFrame(detectFaceLoop)
      }
    }

    // Start the loop
    faceDetectionRef.current = requestAnimationFrame(detectFaceLoop)
  }

  // Start a new interview session with the selected job domain
  const handleStartInterview = async (
    selectedDomain: string,
    options: {
      customJobRole?: string
      technologies?: string
      questionCount: number
      difficultyLevel: DifficultyLevel
    },
  ) => {
    try {
      setJobDomain(selectedDomain)
      setRecordingState("idle")
      setEmotionData([])
      setCurrentQuestionEmotionData([])
      setRecordingUrl(null)
      setCurrentQuestionIndex(0)
      setSessionData(null)
      setCurrentTranscript("")
      setCameraInitialized(false)
      setIsFaceDetectionRunning(false)

      const jobTitle = options.customJobRole ? `${options.customJobRole} (${selectedDomain})` : selectedDomain

      const techInfo = options.technologies ? ` with ${options.technologies}` : ""

      toast.info(`Setting up ${jobTitle}${techInfo} interview questions...`)

      // Generate questions for the selected domain with the specified options
      const generatedQuestions = await generateInterviewQuestions(selectedDomain, {
        customJobRole: options.customJobRole,
        technologies: options.technologies,
        count: options.questionCount,
        difficultyLevel: options.difficultyLevel,
      })

      setQuestions(generatedQuestions)

      // Create a new session
      setSessionData({
        id: `session-${Date.now()}`,
        startTime: new Date(),
        jobDomain: selectedDomain,
        questions: generatedQuestions,
        emotionData: [],
      })

      toast.success(`Interview ready! ${generatedQuestions.length} questions prepared.`)
    } catch (error) {
      console.error("Failed to start interview:", error)
      toast.error("Failed to set up interview questions. Please try again.")
    }
  }

  // Set up media (camera and microphone)
  const handleSetupMedia = async () => {
    if (!videoRef.current) return

    try {
      toast.info("Requesting camera and microphone access...")

      // Request permissions with higher quality audio settings
      await recordingService.requestMediaPermissions(videoRef.current)

      setHasMediaPermissions(true)
      setCameraInitialized(true)
      setRecordingState("preparing")

      toast.success("Camera and microphone ready!")
    } catch (error) {
      console.error("Media setup error:", error)
      toast.error("Failed to access camera or microphone. Please check your permissions.")
    }
  }

  // Start recording
  const handleStartRecording = async () => {
    try {
      if (!videoRef.current) return

      // Reset transcript and emotion data for this question
      setCurrentTranscript("")
      setCurrentQuestionEmotionData([])

      // Track question start time
      const updatedQuestions = [...questions]
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        startTime: Date.now(), // Use actual timestamp for question start
        liveTranscript: "", // Reset live transcript
      }
      setQuestions(updatedQuestions)

      setRecordingState("recording")
      toast.info("Recording started. Answer the question clearly.")

      // Start the recording with our service
      await recordingService.startRecording({
        video: true,
        audio: true,
        onDataAvailable: (blob) => {
          if (recordingUrl) URL.revokeObjectURL(recordingUrl)
          const url = URL.createObjectURL(blob)
          setRecordingUrl(url)
        },
        onEmotionUpdate: (data) => {
          setEmotionData((prevData) => [...prevData, data])
          setCurrentQuestionEmotionData((prevData) => [...prevData, data])
        },
        onTranscription: (text) => {
          console.log("Received transcription update:", text.length)
          setCurrentTranscript(text)

          // Also update the question's live transcript
          const updatedQuestions = [...questions]
          updatedQuestions[currentQuestionIndex] = {
            ...updatedQuestions[currentQuestionIndex],
            liveTranscript: text,
          }
          setQuestions(updatedQuestions)
        },
        onError: (error) => {
          console.error("Recording error:", error)
          toast.error("Recording error occurred. Please try again.")
          setRecordingState("preparing")
        },
      })
    } catch (error) {
      console.error("Failed to start recording:", error)
      toast.error("Failed to start recording. Please try again.")
      setRecordingState("preparing")
    }
  }

  // Pause recording
  const handlePauseRecording = () => {
    recordingService.pauseRecording()
    setRecordingState("paused")
    toast.info("Recording paused.")
  }

  // Resume recording
  const handleResumeRecording = () => {
    recordingService.resumeRecording()
    setRecordingState("recording")
    toast.info("Recording resumed.")
  }

  // Stop recording and process feedback
  const handleStopRecording = async () => {
    try {
      setRecordingState("processing")
      toast.info("Processing recording...")

      // Stop recording and get the final blob
      const recordingBlob = await recordingService.stopRecording()
      if (!recordingBlob) {
        throw new Error("Failed to get recording data")
      }

      // Get the final transcript
      const finalTranscript = currentTranscript

      // Update the current question's end time and transcript
      const updatedQuestions = [...questions]
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        endTime: Date.now(), // Current time as end time
        answer: finalTranscript, // Save the final transcript as the answer
      }
      setQuestions(updatedQuestions)

      setIsProcessingFeedback(true)

      // We'll use the transcribed text directly instead of processing the audio again
      const transcription = finalTranscript || (await transcribeAudio(recordingBlob))

      // Get emotion data for this question's time range
      const questionStartTime = updatedQuestions[currentQuestionIndex].startTime || 0
      const questionEndTime = updatedQuestions[currentQuestionIndex].endTime || Date.now()

      const questionEmotionData = emotionData.filter(
        (data) => data.timestamp >= questionStartTime && data.timestamp <= questionEndTime,
      )

      // Generate feedback for this question
      const feedback = await generateQuestionFeedback(
        updatedQuestions[currentQuestionIndex].questionText,
        transcription,
        questionEmotionData,
      )

      // Update question with answer and feedback
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        answer: transcription,
        feedback,
      }

      setQuestions(updatedQuestions)
      setIsProcessingFeedback(false)
      setRecordingState("reviewing")

      // Restart face detection loop to ensure it's running during review
      startFaceDetectionLoop()

      // If this is the last question, generate overall feedback
      if (currentQuestionIndex === questions.length - 1) {
        setIsProcessingFeedback(true)
        toast.info("Generating comprehensive feedback on your interview...")

        const overallFeedback = await generateOverallFeedback(jobDomain || "General", updatedQuestions, emotionData)

        setSessionData((prevSession) => {
          if (!prevSession) return null
          return {
            ...prevSession,
            questions: updatedQuestions,
            emotionData,
            endTime: new Date(),
            overallFeedback,
          }
        })

        setIsProcessingFeedback(false)
        toast.success("Interview complete! Review your performance below.")
        setActiveTab("summary") // Switch to summary tab after completing all questions
      } else {
        toast.success("Answer recorded! Continue to the next question.")
      }
    } catch (error) {
      console.error("Error stopping recording:", error)
      toast.error("Error processing your answer. Please try again.")
      setRecordingState("preparing")
      setIsProcessingFeedback(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Stop any existing face detection loop
      if (faceDetectionRef.current) {
        cancelAnimationFrame(faceDetectionRef.current)
        faceDetectionRef.current = null
      }

      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentTranscript("") // Clear transcript for the next question
      setCurrentQuestionEmotionData([]) // Clear emotion data for the next question

      if (recordingState === "reviewing") {
        setRecordingState("preparing")
      }

      // Keep camera on - don't reset media permissions
      // Just ensure we're in the right state for the next question
      if (hasMediaPermissions && !["recording", "paused"].includes(recordingState)) {
        setRecordingState("preparing")
      }

      // Make sure the video element is properly connected to the stream
      if (videoRef.current && videoRef.current.srcObject === null && hasMediaPermissions) {
        // Re-request media permissions to ensure the camera is active
        recordingService
          .requestMediaPermissions(videoRef.current)
          .then(() => {
            console.log("Camera reconnected successfully")
            // Restart face detection with a delay to ensure video is ready
            setTimeout(() => {
              startFaceDetectionLoop()
            }, 500)
          })
          .catch((error) => {
            console.error("Failed to reconnect camera:", error)
            toast.error("Camera connection lost. Please refresh the page.")
          })
      } else {
        // Restart face detection with a longer delay to ensure video is ready
        setTimeout(() => {
          startFaceDetectionLoop()
        }, 500)
      }

      setActiveTab("current") // Switch to current question tab

      // Reset current question emotion data but keep the video feed active
      setCurrentQuestionEmotionData([])

      // Make sure we're properly updating the emotion data display
      if (faceDetectionRef.current) {
        cancelAnimationFrame(faceDetectionRef.current)
        faceDetectionRef.current = null
      }

      // Ensure we restart face detection with a slight delay to allow video to initialize
      setTimeout(() => {
        startFaceDetectionLoop()
      }, 300)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Stop any existing face detection loop
      if (faceDetectionRef.current) {
        cancelAnimationFrame(faceDetectionRef.current)
        faceDetectionRef.current = null
      }

      setCurrentQuestionIndex(currentQuestionIndex - 1)

      // If we have a transcript for this question, show it
      const previousTranscript = questions[currentQuestionIndex - 1].answer || ""
      setCurrentTranscript(previousTranscript)

      // Keep camera on but update state
      if (hasMediaPermissions && !["recording", "paused"].includes(recordingState)) {
        setRecordingState("reviewing")
      }

      // Make sure the video element is properly connected to the stream
      if (videoRef.current && videoRef.current.srcObject === null && hasMediaPermissions) {
        // Re-request media permissions to ensure the camera is active
        recordingService
          .requestMediaPermissions(videoRef.current)
          .then(() => {
            console.log("Camera reconnected successfully")
            // Restart face detection with a delay to ensure video is ready
            setTimeout(() => {
              startFaceDetectionLoop()
            }, 500)
          })
          .catch((error) => {
            console.error("Failed to reconnect camera:", error)
            toast.error("Camera connection lost. Please refresh the page.")
          })
      } else {
        // Restart face detection with a longer delay to ensure video is ready
        setTimeout(() => {
          startFaceDetectionLoop()
        }, 500)
      }

      setActiveTab("current") // Switch to current question tab
    }
  }

  // Reset interview
  const handleResetInterview = () => {
    // Stop face detection loop
    if (faceDetectionRef.current) {
      cancelAnimationFrame(faceDetectionRef.current)
      faceDetectionRef.current = null
    }

    // Now we fully close the media stream when resetting the interview
    recordingService.closeMediaStream()
    if (recordingUrl) URL.revokeObjectURL(recordingUrl)

    setJobDomain(null)
    setRecordingState("idle")
    setEmotionData([])
    setCurrentQuestionEmotionData([])
    setRecordingUrl(null)
    setCurrentQuestionIndex(0)
    setQuestions([])
    setHasMediaPermissions(false)
    setCameraInitialized(false)
    setSessionData(null)
    setActiveTab("current")
    setIsFaceDetectionRunning(false)
  }

  // If no job domain is selected yet, show the setup screen
  if (!jobDomain) {
    return <InterviewSetup onStart={handleStartInterview} isLoading={false} />
  }

  // Determine if we have completed questions with feedback
  const hasCompletedQuestions = questions.some((q) => q.feedback)

  // Determine if we have overall feedback
  const hasOverallFeedback = sessionData?.overallFeedback !== undefined

  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-interview-blue-dark">{jobDomain} Interview Practice</h1>

        <Button variant="outline" onClick={handleResetInterview}>
          Start New Interview
        </Button>
      </div>

      {/* Current question */}
      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-2">Question {currentQuestionIndex + 1}:</h2>
          <p className="text-lg">{questions[currentQuestionIndex]?.questionText || "Loading question..."}</p>
        </CardContent>
      </Card>

      {/* Tabs for current question and summary */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="current">Current Question</TabsTrigger>
          <TabsTrigger value="summary" disabled={!hasCompletedQuestions}>
            Interview Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left side: Video and controls */}
            <div className="lg:col-span-7 space-y-4">
              {/* Video feed */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                {recordingState === "reviewing" && recordingUrl ? (
                  <video ref={videoPlaybackRef} src={recordingUrl} controls className="w-full h-full" autoPlay />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted={recordingState !== "recording"} // Only muted when not recording
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="face-overlay absolute top-0 left-0 w-full h-full" />

                    {/* Face detection status indicator */}
                    {isFaceDetectionRunning && (
                      <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 text-white px-3 py-1 rounded-full">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium">Face Detection Active</span>
                      </div>
                    )}
                  </>
                )}

                {/* Recording indicator */}
                {recordingState === "recording" && (
                  <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/50 text-white px-3 py-1 rounded-full">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse-light" />
                    <span className="text-sm font-medium">REC</span>
                  </div>
                )}
              </div>

              {/* Live transcription - show only during recording or reviewing */}
              {(recordingState === "recording" || recordingState === "paused" || recordingState === "reviewing") && (
                <LiveTranscription text={currentTranscript} isActive={recordingState === "recording"} />
              )}

              {/* Controls */}
              <InterviewControls
                recordingState={recordingState}
                onStartRecording={handleStartRecording}
                onPauseRecording={handlePauseRecording}
                onResumeRecording={handleResumeRecording}
                onStopRecording={handleStopRecording}
                onSetupMedia={handleSetupMedia}
                hasMediaStream={hasMediaPermissions}
                currentQuestion={currentQuestionIndex}
                totalQuestions={questions.length}
                onNextQuestion={handleNextQuestion}
                onPreviousQuestion={handlePreviousQuestion}
              />
            </div>

            {/* Right side: Emotions and feedback */}
            <div className="lg:col-span-5 space-y-4">
  {/* Emotion chart */}
  <Card>
    <CardContent className="p-4">
      <h3 className="text-lg font-medium mb-4">Emotional Analysis</h3>
      <div className="flex justify-center">
        <div className="w-full max-w-[750px] px-4 pb-6">
          <EmotionDisplay
            emotionData={
              recordingState === "recording" || recordingState === "paused"
                ? currentQuestionEmotionData
                : emotionData
            }
            height={320} // Slightly more vertical space
          />
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Current question feedback */}
  {questions[currentQuestionIndex]?.feedback && (
    <FeedbackDisplay
      feedback={questions[currentQuestionIndex].feedback!}
      isQuestionFeedback={true}
    />
  )}

  {/* Processing indicator */}
  {isProcessingFeedback && (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
      <p className="text-muted-foreground">Processing your answer and generating feedback...</p>
      <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-pulse w-full"></div>
      </div>
    </div>
  )}
</div>



          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-4 space-y-6">
          {/* Overall feedback */}
          {hasOverallFeedback && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Interview Performance Summary</h2>
              <FeedbackDisplay feedback={sessionData!.overallFeedback!} isQuestionFeedback={false} />
            </div>
          )}

          {/* Question-by-question breakdown */}
          <div className="space-y-6 mt-8">
            <h2 className="text-2xl font-bold">Question-by-Question Analysis</h2>

            {questions.map((question, index) =>
              question.feedback ? (
                <div key={question.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        Content: {question.feedback.contentScore}%
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        Emotional: {question.feedback.emotionalScore}%
                      </span>
                    </div>
                  </div>

                  <p className="font-medium">{question.questionText}</p>

                  {question.answer && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700">{question.answer}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-600">Strengths</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {question.feedback.strengths.map((strength, i) => (
                          <li key={i} className="text-sm">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-amber-600">Areas for Improvement</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {question.feedback.improvements.map((improvement, i) => (
                          <li key={i} className="text-sm">
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-sm text-gray-600">
                    <p>{question.feedback.contentFeedback}</p>
                  </div>
                </div>
              ) : null,
            )}
          </div>

          {/* Emotional trends */}
          {emotionData.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Emotional Trends</h2>
              <Card>
                <CardContent className="p-4">
                  <EmotionDisplay emotionData={emotionData} height={300} showLegend={true} showAxis={true} />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InterviewPractice
