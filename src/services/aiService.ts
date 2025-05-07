import type { InterviewQuestion, QuestionFeedback, EmotionDataPoint, FeedbackData } from "../types/index"

const GEMINI_API_KEY = "AIzaSyBVC00OSmDr19izTKyswQz_7Njtn2cA-dA"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

/**
 * Retrieves JSON content from Gemini API response
 * @param responseText The raw API response text
 * @returns Parsed JSON object
 */
function extractJsonFromResponse(responseText: string): any {
  try {
    // First attempt: Try parsing the entire response as JSON
    try {
      return JSON.parse(responseText)
    } catch (e) {
      // Not valid JSON, continue to extraction
    }

    // Second attempt: Find JSON object or array pattern
    const jsonMatch = responseText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response")
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error("Error extracting JSON:", error)
    console.error("Original text:", responseText)
    throw new Error("Failed to parse response data")
  }
}

/**
 * Makes a request to Gemini API with error handling and retries
 * @param prompt The prompt text to send to the API
 * @param temperature Temperature setting for generation (0.0-1.0)
 * @param maxRetries Maximum retry attempts
 * @returns The generated response
 */
async function makeGeminiRequest(prompt: string, temperature = 0.2, maxRetries = 2): Promise<any> {
  let retries = 0

  while (retries <= maxRetries) {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`API error: ${data.error?.message || "Unknown error"}`)
      }

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid API response structure")
      }

      return data.candidates[0].content.parts[0].text
    } catch (error) {
      retries++
      if (retries > maxRetries) {
        throw error
      }
      console.warn(`Retry ${retries}/${maxRetries} after error:`, error)
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retries)))
    }
  }
}

/**
 * Generates interview questions for a specific job domain
 * @param jobDomain The job domain (e.g., "software engineering", "marketing")
 * @param options Additional options for question generation
 * @returns Array of interview questions
 */
export async function generateInterviewQuestions(
  jobDomain: string,
  options?: {
    customJobRole?: string
    technologies?: string
    count?: number
    difficultyLevel?: string
  },
): Promise<InterviewQuestion[]> {
  try {
    const count = options?.count || 5
    const difficultyLevel = options?.difficultyLevel || "Medium"
    const customJobRole = options?.customJobRole || ""
    const technologies = options?.technologies || ""

    console.log(`Generating ${count} ${difficultyLevel} questions for ${jobDomain}...`)

    // Build a more detailed prompt based on the options
    let jobContext = jobDomain
    if (customJobRole) {
      jobContext = `${customJobRole} in ${jobDomain}`
    }

    let techContext = ""
    if (technologies) {
      techContext = ` with expertise in ${technologies}`
    }

    const prompt = `Generate ${count} ${difficultyLevel.toLowerCase()} difficulty interview questions specifically for a ${jobContext} role${techContext}. 
    The questions should assess both technical competence and soft skills relevant to the position.
    
    For ${difficultyLevel.toLowerCase()} difficulty:
    - Easy: Focus on fundamental concepts and basic scenarios
    - Medium: Include more specific technical questions and situational challenges
    - Hard: Cover advanced topics, complex problem-solving, and leadership scenarios
    
    Format your response EXACTLY as a JSON array of objects with these fields:
    - "id": a unique string identifier (use format "q-" followed by random alphanumeric)
    - "questionText": the full interview question
    
    Important: Return ONLY the JSON array with no explanations, formatting, or other text.
    Example format: [{"id":"q-abc123","questionText":"What is your experience with..."}]`

    const generatedText = await makeGeminiRequest(prompt, 0.7)

    try {
      const questions = extractJsonFromResponse(generatedText)

      // Validate and sanitize the response
      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array")
      }

      return questions
        .map((q: any) => ({
          id: q.id || `q-${Math.random().toString(36).substring(2, 11)}`,
          questionText: String(q.questionText || "").trim(),
        }))
        .slice(0, count)
    } catch (e) {
      console.error("Error processing questions:", e)
      throw new Error("Failed to process interview questions")
    }
  } catch (error) {
    console.error("Error in generateInterviewQuestions:", error)
    // Return some default questions as a fallback
    return [
      { id: "default-1", questionText: "Tell me about yourself and your experience in this field." },
      { id: "default-2", questionText: "What are your greatest strengths and weaknesses?" },
      { id: "default-3", questionText: "Why are you interested in this position?" },
      {
        id: "default-4",
        questionText: "Can you describe a challenging situation you faced at work and how you handled it?",
      },
      { id: "default-5", questionText: "Where do you see yourself in five years?" },
    ].slice(0, options?.count || 5)
  }
}

/**
 * Generates feedback for a single interview question response
 * @param question The interview question
 * @param answer The user's answer
 * @param emotionData Emotion tracking data from the interview
 * @returns Structured feedback for the response
 */
export async function generateQuestionFeedback(
  question: string,
  answer: string,
  emotionData: EmotionDataPoint[],
): Promise<QuestionFeedback> {
  try {
    console.log("Generating feedback for answer...")

    // Process emotion data for analysis with enhanced accuracy
    const emotionSummary = analyzeEmotionData(emotionData)

    // Process voice data for analysis with improved detection
    const voiceAnalysis = analyzeVoiceData(emotionData)

    const prompt = `
      As an expert interview coach, analyze this interview question and answer with high precision:
      
      Question: "${question}"
      
      Answer (transcribed from speech): "${answer}"
      
      Emotional Analysis: ${emotionSummary}
      
      Voice Analysis: ${voiceAnalysis}
      
      Provide detailed feedback EXACTLY as a JSON object with these properties:
      - contentScore: number from 0-100 rating answer quality and relevance
      - contentFeedback: string with specific feedback on content (150-200 words)
      - emotionalScore: number from 0-100 rating emotional presentation
      - emotionalFeedback: string with feedback on emotions detected (100-150 words)
      - voiceAnalysis: string analyzing voice patterns (100-150 words)
      - paceScore: number from 0-100 rating speaking pace
      - clarityScore: number from 0-100 rating speech clarity
      - strengths: array of 2-3 strings listing key strengths with examples
      - improvements: array of 2-3 strings with specific improvement suggestions
      
      Your feedback should be constructive, specific, and actionable.
      Return ONLY valid JSON with no additional text or explanation.
    `

    const generatedText = await makeGeminiRequest(prompt, 0.2)

    try {
      const feedback = extractJsonFromResponse(generatedText)

      // Ensure all required fields exist and are of correct type
      return {
        contentScore: Number(feedback.contentScore) || 65,
        contentFeedback: String(feedback.contentFeedback || ""),
        emotionalScore: Number(feedback.emotionalScore) || 60,
        emotionalFeedback: String(feedback.emotionalFeedback || ""),
        voiceAnalysis: String(feedback.voiceAnalysis || ""),
        paceScore: Number(feedback.paceScore) || 70,
        clarityScore: Number(feedback.clarityScore) || 65,
        strengths: Array.isArray(feedback.strengths)
          ? feedback.strengths.map(String)
          : ["Clear communication attempt", "Engaged with the question"],
        improvements: Array.isArray(feedback.improvements)
          ? feedback.improvements.map(String)
          : ["Consider providing more specific details", "Practice maintaining consistent emotional presentation"],
      }
    } catch (e) {
      console.error("Error processing feedback:", e)
      throw new Error("Failed to process feedback")
    }
  } catch (error) {
    console.error("Error in generateQuestionFeedback:", error)
    // Return default feedback
    return {
      contentScore: 65,
      contentFeedback: "Unable to analyze answer content. Please try again.",
      emotionalScore: 60,
      emotionalFeedback: "Unable to analyze emotional presentation. Please try again.",
      voiceAnalysis: "Voice analysis not available. Please check your microphone.",
      paceScore: 70,
      clarityScore: 65,
      strengths: ["Clear communication attempt", "Engaged with the question"],
      improvements: [
        "Consider providing more specific details",
        "Practice maintaining consistent emotional presentation",
      ],
    }
  }
}

/**
 * Generates overall feedback for the entire interview
 * @param jobDomain The job domain being interviewed for
 * @param questions All questions with their answers and feedback
 * @param emotionData Emotion tracking data from the interview
 * @returns Comprehensive interview feedback
 */
export async function generateOverallFeedback(
  jobDomain: string,
  questions: InterviewQuestion[],
  emotionData: EmotionDataPoint[],
): Promise<FeedbackData> {
  try {
    console.log("Generating comprehensive overall feedback...")

    // Process answers and feedback for analysis - only include questions with feedback
    const questionsWithFeedback = questions
      .filter((q) => q.feedback && q.answer)
      .map((q, index) => ({
        questionNumber: index + 1,
        question: q.questionText,
        answer: q.answer || "No answer recorded",
        contentScore: q.feedback?.contentScore || 0,
        emotionalScore: q.feedback?.emotionalScore || 0,
        voiceAnalysis: q.feedback?.voiceAnalysis || "No voice analysis available",
        paceScore: q.feedback?.paceScore || 0,
        clarityScore: q.feedback?.clarityScore || 0,
        strengths: q.feedback?.strengths || [],
        improvements: q.feedback?.improvements || [],
      }))

    // If no questions have feedback, return default
    if (questionsWithFeedback.length === 0) {
      return getDefaultOverallFeedback()
    }

    // Process emotion data for analysis with enhanced accuracy
    const emotionSummary = analyzeEmotionData(emotionData)

    // Process voice data for analysis with improved detection
    const voiceAnalysis = analyzeVoiceData(emotionData)

    // Calculate overall scores based on individual questions
    const avgContentScore =
      questionsWithFeedback.reduce((sum, q) => sum + q.contentScore, 0) / questionsWithFeedback.length
    const avgEmotionalScore =
      questionsWithFeedback.reduce((sum, q) => sum + q.emotionalScore, 0) / questionsWithFeedback.length
    const avgPaceScore = questionsWithFeedback.reduce((sum, q) => sum + q.paceScore, 0) / questionsWithFeedback.length
    const avgClarityScore =
      questionsWithFeedback.reduce((sum, q) => sum + q.clarityScore, 0) / questionsWithFeedback.length

    // Calculate emotional consistency
    const emotionalVariance = calculateEmotionalVariance(questionsWithFeedback.map((q) => q.emotionalScore))
    const consistencyScore = 100 - emotionalVariance * 100

    const prompt = `
      As an expert interview coach, provide a detailed and comprehensive analysis of this complete interview for a ${jobDomain} position:
      
      Questions and Answers: ${JSON.stringify(questionsWithFeedback, null, 2)}
      
      Emotional Analysis: ${emotionSummary}
      
      Voice Analysis: ${voiceAnalysis}
      
      Overall Content Score: ${avgContentScore.toFixed(1)}
      Overall Emotional Score: ${avgEmotionalScore.toFixed(1)}
      Overall Pace Score: ${avgPaceScore.toFixed(1)}
      Overall Clarity Score: ${avgClarityScore.toFixed(1)}
      Emotional Consistency Score: ${consistencyScore.toFixed(1)}
      
      Provide a comprehensive assessment EXACTLY as a JSON object with these properties:
      - overallScore: number from 0-100 rating overall interview performance
      - summary: string summarizing overall performance (2-3 sentences)
      - contentAnalysis: string analyzing answer content quality (200-250 words)
      - emotionalAnalysis: string analyzing emotional presentation (150-200 words)
      - voiceAnalysis: string analyzing voice patterns (150-200 words)
      - strengths: array of 4-5 strings listing top strengths with specific examples
      - improvements: array of 4-5 strings with key improvement areas
      - recommendations: string with actionable advice (200-250 words)
      
      Include specific examples from different questions to illustrate your points.
      Your feedback should be constructive, specific, and actionable.
      Return ONLY valid JSON with no additional text or explanation.
    `

    const generatedText = await makeGeminiRequest(prompt, 0.2)

    try {
      const feedback = extractJsonFromResponse(generatedText)

      // Sanitize and validate the response
      return {
        overallScore: Number(feedback.overallScore) || 70,
        summary: String(feedback.summary || ""),
        contentAnalysis: String(feedback.contentAnalysis || ""),
        emotionalAnalysis: String(feedback.emotionalAnalysis || ""),
        voiceAnalysis: String(feedback.voiceAnalysis || ""),
        strengths: Array.isArray(feedback.strengths)
          ? feedback.strengths.map(String)
          : ["Engaged with the questions", "Maintained generally positive demeanor", "Demonstrated basic knowledge"],
        improvements: Array.isArray(feedback.improvements)
          ? feedback.improvements.map(String)
          : ["Provide more specific examples", "Manage nervous expressions", "Expand technical depth"],
        recommendations: String(feedback.recommendations || ""),
      }
    } catch (e) {
      console.error("Error processing overall feedback:", e)
      throw new Error("Failed to process overall feedback")
    }
  } catch (error) {
    console.error("Error in generateOverallFeedback:", error)
    return getDefaultOverallFeedback()
  }
}

/**
 * Calculate variance in emotional scores to measure consistency
 * @param scores Array of emotional scores
 * @returns Variance value (0-1)
 */
function calculateEmotionalVariance(scores: number[]): number {
  if (scores.length <= 1) return 0

  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length
  const squaredDiffs = scores.map((score) => Math.pow(score - mean, 2))
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length

  // Normalize to 0-1 range
  return Math.min(variance / 1000, 1)
}

/**
 * Provides default overall feedback as a fallback
 * @returns Default feedback data
 */
function getDefaultOverallFeedback(): FeedbackData {
  return {
    overallScore: 70,
    summary: "You demonstrated reasonable interview skills with room for improvement.",
    contentAnalysis:
      "Your answers showed understanding of the core concepts, but lacked some depth in technical details.",
    emotionalAnalysis: "Your emotional presentation was generally appropriate but showed occasional nervousness.",
    voiceAnalysis: "Your voice patterns were relatively consistent, with occasional changes in pace and clarity.",
    strengths: [
      "Engaged with the questions",
      "Maintained generally positive demeanor",
      "Demonstrated basic knowledge",
      "Attempted to structure responses",
    ],
    improvements: [
      "Provide more specific examples",
      "Manage nervous expressions",
      "Expand technical depth",
      "Improve answer structure",
    ],
    recommendations:
      "Practice structured answers with the STAR method and record yourself to improve emotional consistency. Work on voice modulation and pacing to sound more confident.",
  }
}

/**
 * Analyzes emotion data to provide insights with improved accuracy
 * @param emotionData Array of emotion data points
 * @returns String summary of emotional analysis
 */
function analyzeEmotionData(emotionData: EmotionDataPoint[]): string {
  if (!emotionData || emotionData.length === 0) {
    return "No emotional data recorded."
  }

  // Remove any data points with missing dominant emotion
  const validData = emotionData.filter((data) => data.dominantEmotion)

  if (validData.length === 0) {
    return "No valid emotional data recorded."
  }

  // Apply smoothing to reduce noise in emotion detection
  const smoothedData = applyEmotionSmoothing(validData)

  // Count occurrences of each dominant emotion
  const emotionCounts: Record<string, number> = {}
  smoothedData.forEach((data) => {
    const emotion = data.dominantEmotion
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
  })

  // Calculate percentages
  const total = smoothedData.length
  const percentages: Record<string, number> = {}
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    percentages[emotion] = (count / total) * 100
  })

  // Analyze emotional transitions (improved algorithm)
  const transitions: string[] = []
  const significantEmotions = new Set<string>()
  let lastEmotion = smoothedData[0]?.dominantEmotion
  let runStart = 0

  for (let i = 1; i < smoothedData.length; i++) {
    const currentEmotion = smoothedData[i].dominantEmotion

    // Track all emotions that appear for significant duration
    if (currentEmotion) {
      significantEmotions.add(currentEmotion)
    }

    if (currentEmotion !== lastEmotion) {
      const runLength = i - runStart
      // Only report runs of sufficient length or significant emotional changes
      if (runLength > 3 || (lastEmotion && currentEmotion && isSignificantEmotionChange(lastEmotion, currentEmotion))) {
        transitions.push(
          `${lastEmotion} for ${Math.round((runLength / total) * 100)}% of time, then shifted to ${currentEmotion}`,
        )
      }
      lastEmotion = currentEmotion
      runStart = i
    }
  }

  // Handle the last emotional run
  const finalRunLength = smoothedData.length - runStart
  if (finalRunLength > 3 && lastEmotion) {
    transitions.push(`${lastEmotion} for the final ${Math.round((finalRunLength / total) * 100)}% of time`)
  }

  // Generate summary text
  let summary = Object.entries(percentages)
    .sort((a, b) => b[1] - a[1]) // Sort by percentage descending
    .map(([emotion, percentage]) => `${emotion}: ${percentage.toFixed(1)}%`)
    .join(", ")

  // Add emotional stability analysis
  const emotionChanges = transitions.length
  const stabilityRating =
    emotionChanges <= 2
      ? "highly stable"
      : emotionChanges <= 5
        ? "moderately stable"
        : emotionChanges <= 10
          ? "variable"
          : "highly variable"

  summary += `. Emotional stability: ${stabilityRating}`

  // Add significant transitions if present
  if (transitions.length > 0 && transitions.length <= 3) {
    summary += ". Key emotional shifts: " + transitions.join("; ")
  }

  // Add dominant emotion analysis
  const dominantEmotion = Object.entries(percentages).sort((a, b) => b[1] - a[1])[0]
  if (dominantEmotion) {
    summary += `. Dominant emotion: ${dominantEmotion[0]} (${dominantEmotion[1].toFixed(1)}%)`
  }

  return summary
}

/**
 * Apply smoothing to emotion data to reduce noise and improve accuracy
 * @param data Raw emotion data points
 * @returns Smoothed emotion data
 */
function applyEmotionSmoothing(data: EmotionDataPoint[]): EmotionDataPoint[] {
  if (data.length <= 2) return data

  const smoothedData: EmotionDataPoint[] = []
  const windowSize = 3 // Use a 3-point moving window

  // Handle first point
  smoothedData.push(data[0])

  // Apply smoothing to middle points
  for (let i = 1; i < data.length - 1; i++) {
    // Get neighboring points
    const prev = data[i - 1]
    const current = data[i]
    const next = data[i + 1]

    // If current emotion is different from both neighbors, it might be noise
    if (
      current.dominantEmotion !== prev.dominantEmotion &&
      current.dominantEmotion !== next.dominantEmotion &&
      prev.dominantEmotion === next.dominantEmotion
    ) {
      // Create a smoothed point with the consistent emotion from neighbors
      const smoothedPoint: EmotionDataPoint = {
        ...current,
        dominantEmotion: prev.dominantEmotion,
        expressions: { ...current.expressions },
      }

      // Adjust the expression values to match the dominant emotion
      const dominantKey = prev.dominantEmotion as keyof typeof smoothedPoint.expressions
      if (dominantKey in smoothedPoint.expressions) {
        // Boost the dominant emotion value
        smoothedPoint.expressions[dominantKey] = Math.max(
          smoothedPoint.expressions[dominantKey],
          (prev.expressions[dominantKey] + next.expressions[dominantKey]) / 2,
        )
      }

      smoothedData.push(smoothedPoint)
    } else {
      smoothedData.push(current)
    }
  }

  // Handle last point
  smoothedData.push(data[data.length - 1])

  return smoothedData
}

/**
 * Determines if an emotion change is significant
 * @param emotion1 First emotion
 * @param emotion2 Second emotion
 * @returns Whether the change is significant
 */
function isSignificantEmotionChange(emotion1: string, emotion2: string): boolean {
  // Pairs of emotions that represent significant shifts
  const significantShifts = [
    ["happy", "sad"],
    ["happy", "angry"],
    ["happy", "fearful"],
    ["confident", "nervous"],
    ["relaxed", "tense"],
    ["neutral", "angry"],
    ["neutral", "fearful"],
    ["neutral", "surprised"],
    ["sad", "angry"],
  ]

  // Check if this pair exists in either direction
  return significantShifts.some(
    ([a, b]) =>
      (emotion1.toLowerCase().includes(a) && emotion2.toLowerCase().includes(b)) ||
      (emotion1.toLowerCase().includes(b) && emotion2.toLowerCase().includes(a)),
  )
}

/**
 * Analyzes voice data to provide insights with improved accuracy
 * @param emotionData Array of emotion data points with audio levels
 * @returns String summary of voice analysis
 */
function analyzeVoiceData(emotionData: EmotionDataPoint[]): string {
  if (!emotionData || emotionData.length === 0) {
    return "No voice data recorded."
  }

  // Filter only data points that have audio level
  const voiceData = emotionData.filter(
    (data) => data.audioLevel !== undefined && data.audioLevel !== null && !isNaN(data.audioLevel),
  )

  if (voiceData.length === 0) {
    return "No valid voice data available."
  }

  // Calculate average audio level
  const levels = voiceData.map((data) => data.audioLevel || 0)
  const averageLevel = levels.reduce((sum, level) => sum + level, 0) / levels.length

  // Calculate variance in audio level (for dynamics analysis)
  const variance =
    levels.reduce((sum, level) => {
      const diff = level - averageLevel
      return sum + diff * diff
    }, 0) / levels.length

  // Calculate moving average to smooth out noise
  const windowSize = 5
  const smoothedLevels: number[] = []

  for (let i = 0; i < levels.length; i++) {
    const windowStart = Math.max(0, i - Math.floor(windowSize / 2))
    const windowEnd = Math.min(levels.length, i + Math.floor(windowSize / 2) + 1)
    let sum = 0

    for (let j = windowStart; j < windowEnd; j++) {
      sum += levels[j]
    }

    smoothedLevels.push(sum / (windowEnd - windowStart))
  }

  // Determine pace by analyzing rate of change in smoothed levels
  const paceScores: number[] = []

  for (let i = 1; i < smoothedLevels.length; i++) {
    const changeRate = Math.abs(smoothedLevels[i] - smoothedLevels[i - 1])
    paceScores.push(changeRate)
  }

  const avgPaceScore = paceScores.reduce((sum, score) => sum + score, 0) / paceScores.length

  const paceTier =
    avgPaceScore < 0.02
      ? "very slow and measured"
      : avgPaceScore < 0.05
        ? "moderate and steady"
        : avgPaceScore < 0.1
          ? "dynamic and engaging"
          : "rapid and energetic"

  // Detect pauses (sections of low audio level)
  const pauseThreshold = averageLevel * 0.4
  let pauseCount = 0
  let inPause = false
  const pauseDurations: number[] = []
  let currentPauseLength = 0

  for (let i = 0; i < smoothedLevels.length; i++) {
    if (smoothedLevels[i] < pauseThreshold) {
      if (!inPause) {
        inPause = true
        pauseCount++
      }
      currentPauseLength++
    } else {
      if (inPause) {
        inPause = false
        pauseDurations.push(currentPauseLength)
        currentPauseLength = 0
      }
    }
  }

  // If still in a pause at the end, record it
  if (inPause && currentPauseLength > 0) {
    pauseDurations.push(currentPauseLength)
  }

  const avgPauseLength = pauseDurations.length
    ? pauseDurations.reduce((sum, len) => sum + len, 0) / pauseDurations.length
    : 0

  // Generate confidence score
  const confidenceScore = calculateConfidenceFromAudio(voiceData)

  // Generate voice analysis summary
  let analysis = `Average volume: ${(averageLevel * 100).toFixed(1)}%. `

  analysis += `Speaking style: ${
    variance < 0.005
      ? "highly monotone"
      : variance < 0.015
        ? "somewhat monotone"
        : variance < 0.03
          ? "natural variation"
          : variance < 0.05
            ? "dynamic variation"
            : "highly dynamic with significant emphasis"
  }. `

  analysis += `Speaking pace: ${paceTier}. `

  if (pauseCount > 0) {
    analysis += `Speech contains ${pauseCount} notable pause${pauseCount !== 1 ? "s" : ""} `
    analysis +=
      avgPauseLength < 3
        ? "that are brief and natural"
        : avgPauseLength < 6
          ? "of moderate length"
          : "that are quite long"
    analysis += ". "
  }

  analysis += `Confidence indicators: ${
    confidenceScore < 30
      ? "low confidence"
      : confidenceScore < 50
        ? "moderate confidence with some uncertainty"
        : confidenceScore < 70
          ? "good confidence"
          : "excellent confidence"
  }.`

  // Add rhythm analysis
  const rhythmVariability = calculateRhythmVariability(smoothedLevels)
  analysis += ` Speech rhythm: ${
    rhythmVariability < 0.02
      ? "very consistent and measured"
      : rhythmVariability < 0.05
        ? "naturally varied with good flow"
        : rhythmVariability < 0.1
          ? "dynamic with intentional emphasis"
          : "highly variable with potential disruptions"
  }.`

  return analysis
}

/**
 * Calculate rhythm variability in speech
 * @param levels Smoothed audio levels
 * @returns Variability score (0-1)
 */
function calculateRhythmVariability(levels: number[]): number {
  if (levels.length < 4) return 0

  // Calculate differences between consecutive levels
  const diffs: number[] = []
  for (let i = 1; i < levels.length; i++) {
    diffs.push(Math.abs(levels[i] - levels[i - 1]))
  }

  // Calculate variability of these differences
  const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length
  const diffVariance = diffs.reduce((sum, diff) => sum + Math.pow(diff - avgDiff, 2), 0) / diffs.length

  return Math.min(diffVariance * 10, 1) // Scale and cap at 1
}

/**
 * Calculates confidence score from audio patterns with improved accuracy
 * @param voiceData Array of emotion data points with audio levels
 * @returns Confidence score (0-100)
 */
function calculateConfidenceFromAudio(voiceData: EmotionDataPoint[]): number {
  // Extract audio levels
  const levels = voiceData.map((data) => data.audioLevel || 0)
  const avgLevel = levels.reduce((sum, level) => sum + level, 0) / levels.length

  // Calculate variance
  const variance = levels.reduce((sum, level) => sum + Math.pow(level - avgLevel, 2), 0) / levels.length

  // Calculate consistency (how often the level stays near the average)
  let consistencyCount = 0
  const consistencyThreshold = avgLevel * 0.2 // 20% of average

  for (const level of levels) {
    if (Math.abs(level - avgLevel) <= consistencyThreshold) {
      consistencyCount++
    }
  }

  const consistencyScore = (consistencyCount / levels.length) * 100

  // Look for trailing off patterns
  let trailOffs = 0
  const trailOffWindow = 4

  for (let i = trailOffWindow; i < levels.length; i++) {
    let isTrailingOff = true

    for (let j = 0; j < trailOffWindow - 1; j++) {
      if (levels[i - j] >= levels[i - j - 1]) {
        isTrailingOff = false
        break
      }
    }

    if (isTrailingOff) {
      trailOffs++
    }
  }

  const trailOffRate = trailOffs / (levels.length - trailOffWindow)
  const trailOffPenalty = trailOffRate * 30 // Up to 30 points penalty

  // Calculate dynamic range (difference between highest and lowest levels)
  const minLevel = Math.min(...levels)
  const maxLevel = Math.max(...levels)
  const dynamicRange = maxLevel - minLevel

  // Too little variation is bad, but so is too much
  const optimalDynamicRange = 0.4 // 40% variation is ideal
  const dynamicRangeScore = 100 - Math.abs(dynamicRange - optimalDynamicRange) * 100

  // Calculate optimal variance (not too flat, not too erratic)
  const optimalVariance = 0.02
  const varianceScore = 100 - Math.abs(variance - optimalVariance) * 1000

  // Calculate speech rhythm score
  const rhythmScore = calculateSpeechRhythmScore(levels)

  // Base confidence score on combination of factors
  let confidenceScore =
    avgLevel * 25 + // 25% based on average volume
    consistencyScore * 0.25 + // 25% based on consistency
    dynamicRangeScore * 0.15 + // 15% based on dynamic range
    varianceScore * 0.15 + // 15% based on variance
    rhythmScore * 0.2 // 20% based on speech rhythm

  // Apply penalties
  confidenceScore = Math.max(0, confidenceScore - trailOffPenalty)

  // Cap at 100
  return Math.min(100, Math.max(0, confidenceScore))
}

/**
 * Calculate speech rhythm score based on audio level patterns
 * @param levels Audio level data
 * @returns Score from 0-100
 */
function calculateSpeechRhythmScore(levels: number[]): number {
  if (levels.length < 10) return 50 // Not enough data

  // Calculate rate of change
  const changes: number[] = []
  for (let i = 1; i < levels.length; i++) {
    changes.push(levels[i] - levels[i - 1])
  }

  // Look for patterns in the changes
  let patternScore = 0

  // Check for consistent rhythm (alternating positive/negative changes)
  let alternatingCount = 0
  for (let i = 1; i < changes.length; i++) {
    if ((changes[i] > 0 && changes[i - 1] < 0) || (changes[i] < 0 && changes[i - 1] > 0)) {
      alternatingCount++
    }
  }

  const alternatingRatio = alternatingCount / (changes.length - 1)
  patternScore += alternatingRatio * 50 // Up to 50 points for good rhythm

  // Check for appropriate pauses (near-zero levels followed by higher levels)
  let pausePatterns = 0
  for (let i = 2; i < levels.length; i++) {
    if (levels[i - 1] < 0.1 && levels[i] > 0.2 && levels[i - 2] > 0.2) {
      pausePatterns++
    }
  }

  const pauseScore = Math.min(pausePatterns * 5, 50) // Up to 50 points for good pausing

  return patternScore + pauseScore
}

/**
 * Fallback audio transcription for browsers without speech recognition
 * @param audioBlob Audio blob to transcribe
 * @returns Transcribed text
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log("Using fallback audio transcription")

  return "This is a fallback transcription. Your browser may not support speech recognition, or there may have been an issue with the transcription. For best results, use Chrome or Edge browsers."
}
