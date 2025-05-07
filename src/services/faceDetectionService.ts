import * as faceapi from "face-api.js"
import type { FaceExpressions } from "../types/index"

// Configuration constants
const MODEL_URL = "/models"
const CDN_URL = "https://justadudewhohacks.github.io/face-api.js/models"
const DETECTION_OPTIONS = { inputSize: 224 }

// Model loading state management
interface ModelState {
  loaded: boolean
  error: boolean
  attempted: boolean
  lastAttempt?: Date
}

const modelState: ModelState = {
  loaded: false,
  error: false,
  attempted: false,
}

/**
 * Loads face-api.js models with local and CDN fallback
 * @returns Promise resolving to true if models loaded successfully
 */
export async function loadModels(): Promise<boolean> {
  // Return early if models already loaded or failed recently
  if (modelState.loaded) return true
  if (modelState.error && modelState.attempted) {
    // Retry after 5 minutes if previously failed
    const now = new Date()
    if (modelState.lastAttempt && now.getTime() - modelState.lastAttempt.getTime() < 5 * 60 * 1000) {
      return false
    }
  }

  modelState.attempted = true
  modelState.lastAttempt = new Date()

  try {
    console.log("Loading face-api.js models...")

    // Required models for face detection and expression recognition
    const requiredModels = [
      faceapi.nets.tinyFaceDetector,
      faceapi.nets.faceLandmark68Net,
      faceapi.nets.faceRecognitionNet,
      faceapi.nets.faceExpressionNet,
    ]

    // Try to load from local first
    try {
      await Promise.all(requiredModels.map((model) => model.load(MODEL_URL)))
      console.log("Models loaded from local path successfully")
    } catch (localError) {
      console.warn("Could not load models from local path, trying CDN...", localError)

      // Fallback to CDN
      await Promise.all(requiredModels.map((model) => model.load(CDN_URL)))
      console.log("Models loaded from CDN successfully")
    }

    modelState.loaded = true
    modelState.error = false
    return true
  } catch (error) {
    console.error("Error loading face-api.js models:", error)
    modelState.error = true
    return false
  }
}

/**
 * Detection result type for better type safety
 */
export type FaceDetectionResult = faceapi.WithFaceExpressions<
  faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>
> | null

/**
 * Detects a single face in a video element with expressions
 * @param video The video element to analyze
 * @returns Promise resolving to detection result or null
 */
export async function detectFace(video: HTMLVideoElement): Promise<FaceDetectionResult> {
  // Ensure models are loaded
  if (!modelState.loaded) {
    const success = await loadModels()
    if (!success) return null
  }

  // Validate video input
  if (!isVideoValid(video)) {
    return null
  }

  try {
    const options = new faceapi.TinyFaceDetectorOptions(DETECTION_OPTIONS)

    const result = await faceapi.detectSingleFace(video, options).withFaceLandmarks().withFaceExpressions()

    return result
  } catch (error) {
    console.error("Error detecting face:", error)
    return null
  }
}

/**
 * Checks if a video element is valid for processing
 */
function isVideoValid(video: HTMLVideoElement): boolean {
  return !(
    !video ||
    video.paused ||
    video.ended ||
    !video.videoWidth ||
    video.videoWidth === 0 ||
    video.videoHeight === 0 ||
    video.readyState < 2
  )
}

/**
 * Gets the dominant emotion from face expressions
 * @param expressions The detected face expressions
 * @returns Object containing dominant emotion and confidence
 */
export function getDominantEmotion(expressions: FaceExpressions): {
  emotion: keyof FaceExpressions
  confidence: number
} {
  let maxVal = 0
  let dominant: keyof FaceExpressions = "neutral"

  Object.entries(expressions).forEach(([emotion, value]) => {
    if (value > maxVal) {
      maxVal = value
      dominant = emotion as keyof FaceExpressions
    }
  })

  return {
    emotion: dominant,
    confidence: maxVal,
  }
}

/**
 * Emotion color mapping with semantic meanings
 */
const EMOTION_COLORS: Record<keyof FaceExpressions, string> = {
  happy: "#22C55E", // Green
  sad: "#64748B", // Slate
  angry: "#EF4444", // Red
  fearful: "#A855F7", // Purple
  disgusted: "#84CC16", // Lime
  surprised: "#F59E0B", // Amber
  neutral: "#6B7280", // Gray
}

/**
 * Returns the color associated with an emotion
 * @param emotion The emotion to get color for
 * @returns Hex color string
 */
export function getEmotionColor(emotion: keyof FaceExpressions): string {
  return EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral
}

/**
 * Configuration options for drawing face detections
 */
export interface DrawOptions {
  drawBox?: boolean
  drawLandmarks?: boolean
  drawLabels?: boolean
  labelOptions?: {
    fontSize?: string
    fontFamily?: string
    fontColor?: string
  }
}

const DEFAULT_DRAW_OPTIONS: DrawOptions = {
  drawBox: true,
  drawLandmarks: true,
  drawLabels: true,
  labelOptions: {
    fontSize: "16px",
    fontFamily: "Arial",
    fontColor: "", // Will use emotion color if empty
  },
}

/**
 * Draws face detection results on a canvas
 * @param canvas Canvas element to draw on
 * @param video Video source element
 * @param detections Face detection results
 * @param options Drawing options
 */
export function drawFaceDetections(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  detections: FaceDetectionResult,
  options: DrawOptions = DEFAULT_DRAW_OPTIONS,
): void {
  // Early return if any required parameter is null or invalid
  if (!detections || !canvas || !video || !video.videoWidth || !video.videoHeight) return

  // Resize canvas to match video dimensions
  const displaySize = { width: video.videoWidth, height: video.videoHeight }
  faceapi.matchDimensions(canvas, displaySize)

  // Resize detections to match display size
  const resizedDetections = faceapi.resizeResults(detections, displaySize)

  // Get canvas context
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw face detection box
  if (options.drawBox) {
    faceapi.draw.drawDetections(canvas, resizedDetections)
  }

  // Draw face landmarks
  if (options.drawLandmarks) {
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
  }

  // Draw expression label
  if (options.drawLabels && resizedDetections.expressions) {
    const dominant = getDominantEmotion(resizedDetections.expressions)

    // Configure font
    const fontSize = options.labelOptions?.fontSize || "16px"
    const fontFamily = options.labelOptions?.fontFamily || "Arial"
    ctx.font = `${fontSize} ${fontFamily}`

    // Set text color
    const fontColor = options.labelOptions?.fontColor || getEmotionColor(dominant.emotion)
    ctx.fillStyle = fontColor

    // Draw the text
    const text = `${dominant.emotion}: ${(dominant.confidence * 100).toFixed(0)}%`
    const x = resizedDetections.detection.box.x
    const y = resizedDetections.detection.box.y - 10

    ctx.fillText(text, x, y)
  }
}

/**
 * Gets all available emotions from an expression result
 * @param expressions Face expressions object
 * @returns Array of emotions with confidence values, sorted by confidence
 */
export function getAllEmotions(expressions: FaceExpressions): Array<{
  emotion: keyof FaceExpressions
  confidence: number
}> {
  return Object.entries(expressions)
    .map(([emotion, confidence]) => ({
      emotion: emotion as keyof FaceExpressions,
      confidence,
    }))
    .sort((a, b) => b.confidence - a.confidence)
}

/**
 * Checks if the face-api models are currently loaded
 * @returns Boolean indicating if models are loaded
 */
export function areModelsLoaded(): boolean {
  return modelState.loaded
}

/**
 * Takes a snapshot from video to a canvas element
 * @param video Source video element
 * @param canvas Target canvas element
 */
export function takeSnapshot(video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
  if (!isVideoValid(video)) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // Draw the current video frame to the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
}
