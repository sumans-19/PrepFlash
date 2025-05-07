import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FeedbackData, QuestionFeedback } from "../types/index"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FeedbackDisplayProps {
  feedback: FeedbackData | QuestionFeedback
  isQuestionFeedback?: boolean
  transcript?: string
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, isQuestionFeedback = false, transcript }) => {
  // Handle both overall feedback and question feedback
  const contentScore = isQuestionFeedback
    ? (feedback as QuestionFeedback).contentScore
    : (feedback as FeedbackData).overallScore

  const emotionalScore = isQuestionFeedback
    ? (feedback as QuestionFeedback).emotionalScore
    : (feedback as FeedbackData).overallScore

  const contentFeedback = isQuestionFeedback
    ? (feedback as QuestionFeedback).contentFeedback
    : (feedback as FeedbackData).contentAnalysis

  const emotionalFeedback = isQuestionFeedback
    ? (feedback as QuestionFeedback).emotionalFeedback
    : (feedback as FeedbackData).emotionalAnalysis

  const voiceAnalysis = isQuestionFeedback
    ? (feedback as QuestionFeedback).voiceAnalysis
    : (feedback as FeedbackData).voiceAnalysis

  const paceScore = isQuestionFeedback ? (feedback as QuestionFeedback).paceScore : undefined

  const clarityScore = isQuestionFeedback ? (feedback as QuestionFeedback).clarityScore : undefined

  const strengths = isQuestionFeedback ? (feedback as QuestionFeedback).strengths : (feedback as FeedbackData).strengths

  const improvements = isQuestionFeedback
    ? (feedback as QuestionFeedback).improvements
    : (feedback as FeedbackData).improvements

  const recommendations = isQuestionFeedback ? null : (feedback as FeedbackData).recommendations

  const summary = isQuestionFeedback ? null : (feedback as FeedbackData).summary

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isQuestionFeedback ? "Question Feedback" : "Interview Feedback"}</CardTitle>
        <CardDescription>{summary || "Analysis of your performance"}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Transcribed answer if available */}
        {isQuestionFeedback && (transcript || (feedback as any)?.answer) && (
          <div className="mb-4 p-4 bg-gray-100 rounded-md border border-gray-300">
            <h3 className="text-md font-semibold mb-2">Your Transcribed Answer:</h3>
            <div className="overflow-y-auto max-h-40 p-2 bg-white rounded-md text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-200">
              {transcript || (feedback as any)?.answer || "No transcription available."}
            </div>
          </div>
        )}

        {/* Feedback tabs for more detailed analysis */}
        <Tabs defaultValue="scores" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="scores">Scores</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="actionable">Action Items</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="space-y-4">
            {/* Score section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Content Quality</span>
                  <span>{contentScore}%</span>
                </div>
                <Progress value={contentScore} className={getScoreColor(contentScore)} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Emotional Presentation</span>
                  <span>{emotionalScore}%</span>
                </div>
                <Progress value={emotionalScore} className={getScoreColor(emotionalScore)} />
              </div>

              {paceScore !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Speaking Pace</span>
                    <span>{paceScore}%</span>
                  </div>
                  <Progress value={paceScore} className={getScoreColor(paceScore)} />
                </div>
              )}

              {clarityScore !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Speaking Clarity</span>
                    <span>{clarityScore}%</span>
                  </div>
                  <Progress value={clarityScore} className={getScoreColor(clarityScore)} />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {/* Content feedback */}
            <div>
              <h3 className="text-lg font-medium mb-2">Content Analysis</h3>
              <p className="text-muted-foreground">{contentFeedback}</p>
            </div>

            {/* Emotional feedback */}
            <div>
              <h3 className="text-lg font-medium mb-2">Emotional Analysis</h3>
              <p className="text-muted-foreground">{emotionalFeedback}</p>
            </div>

            {/* Voice feedback */}
            {voiceAnalysis && (
              <div>
                <h3 className="text-lg font-medium mb-2">Voice Analysis</h3>
                <p className="text-muted-foreground">{voiceAnalysis}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="actionable" className="space-y-4">
            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-green-600">Strengths</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {strengths.map((strength, index) => (
                    <li key={index} className="text-muted-foreground">
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-amber-600">Areas for Improvement</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {improvements.map((improvement, index) => (
                    <li key={index} className="text-muted-foreground">
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  <p className="text-muted-foreground">{recommendations}</p>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default FeedbackDisplay
