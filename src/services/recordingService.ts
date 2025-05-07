import type { EmotionDataPoint, FaceExpressions } from "../types/index"

interface RecordingOptions {
    video: boolean
    audio: boolean
    onDataAvailable?: (blob: Blob) => void
    onEmotionUpdate?: (emotionData: EmotionDataPoint) => void
    onError?: (error: Error) => void
    onAudioData?: (audioData: Float32Array) => void
    onTranscription?: (text: string) => void
    onAudioLevel?: (level: number) => void
}

// Define the SpeechRecognition interface before using it
interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    maxAlternatives: number
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null
    onend: ((this: SpeechRecognition, ev: Event) => any) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null
    start(): void
    stop(): void
    abort(): void
}

// Define a constructor interface for SpeechRecognition
interface SpeechRecognitionConstructor {
    new(): SpeechRecognition
    prototype: SpeechRecognition
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message: string
}

interface SpeechRecognitionEvent extends Event {
    resultIndex: number
    results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
    length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
    isFinal: boolean
    length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
}

export class RecordingService {
    private mediaRecorder: MediaRecorder | null = null
    private stream: MediaStream | null = null
    private recordedChunks: Blob[] = []
    private startTime = 0
    private emotionInterval: number | null = null
    private videoElement: HTMLVideoElement | null = null
    private emotionCallback: ((emotionData: EmotionDataPoint) => void) | null = null
    private faceApiProcessFunction: ((video: HTMLVideoElement) => Promise<any>) | null = null
    private audioContext: AudioContext | null = null
    private audioAnalyser: AnalyserNode | null = null
    private audioDataArray: Uint8Array | null = null
    private audioRawDataArray: Float32Array | null = null
    private audioProcessor: ScriptProcessorNode | null = null
    private speechRecognition: SpeechRecognition | null = null
    private transcriptionCallback: ((text: string) => void) | null = null
    private audioLevelCallback: ((level: number) => void) | null = null
    private interimTranscript = ""
    private finalTranscript = ""
    private recordingOptions: RecordingOptions | null = null
    private audioLevelHistory: number[] = []
    private emotionHistory: EmotionDataPoint[] = []
    private audioLevelInterval: number | null = null
    private isRecording = false
    private isPaused = false
    private transcriptionWorker: Worker | null = null

    constructor() {
        this.recordedChunks = []
    }

    async requestMediaPermissions(videoElement: HTMLVideoElement): Promise<MediaStream> {
        console.log("Requesting media permissions...")

        try {
            // Always request both video and audio permissions with higher quality
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user",
                    frameRate: { ideal: 30 },
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48000,
                    channelCount: 1,
                },
            })

            console.log("Media permissions granted:", stream)
            console.log(`Audio tracks: ${stream.getAudioTracks().length}, Video tracks: ${stream.getVideoTracks().length}`)

            if (stream.getAudioTracks().length === 0) {
                console.warn("No audio track in stream!")
            } else {
                console.log("Audio settings:", stream.getAudioTracks()[0].getSettings())
            }

            // Connect stream to video element
            videoElement.srcObject = stream
            videoElement.muted = true // Mute to prevent feedback
            videoElement.playsInline = true // Better mobile support
            this.videoElement = videoElement
            this.stream = stream

            // Set up audio analysis if we have audio tracks
            if (stream.getAudioTracks().length > 0) {
                await this.setupAudioAnalysis(stream)
            }

            // Return the stream
            return stream
        } catch (error) {
            console.error("Error getting media permissions:", error)
            throw error
        }
    }

    private async setupAudioAnalysis(stream: MediaStream) {
        try {
            // Create audio context with proper fallbacks
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const source = this.audioContext.createMediaStreamSource(stream)

            // Create analyser node for frequency/time domain analysis
            this.audioAnalyser = this.audioContext.createAnalyser()
            this.audioAnalyser.fftSize = 2048 // More detailed analysis
            this.audioAnalyser.smoothingTimeConstant = 0.6 // Smoother transitions

            source.connect(this.audioAnalyser)

            // Set up arrays for audio data
            const bufferLength = this.audioAnalyser.frequencyBinCount
            this.audioDataArray = new Uint8Array(bufferLength)
            this.audioRawDataArray = new Float32Array(bufferLength)

            // Create a script processor or use AudioWorklet if available
            if (this.audioContext.createScriptProcessor) {
                this.audioProcessor = this.audioContext.createScriptProcessor(4096, 1, 1)
                this.audioAnalyser.connect(this.audioProcessor)
                this.audioProcessor.connect(this.audioContext.destination)
            } else {
                console.warn("ScriptProcessorNode not available, using AnimationFrame for audio processing")
                // We'll use requestAnimationFrame instead
            }

            console.log("Audio analysis setup completed", {
                sampleRate: this.audioContext.sampleRate,
                bufferLength: bufferLength,
            })
        } catch (error) {
            console.error("Error setting up audio analysis:", error)
        }
    }

    async startRecording(options: RecordingOptions): Promise<void> {
        console.log("Starting recording with options:", options)
        this.recordingOptions = options

        if (!this.stream) {
            throw new Error("No media stream available. Call requestMediaPermissions first.")
        }

        try {
            // Reset data
            this.recordedChunks = []
            this.startTime = Date.now()
            this.interimTranscript = ""
            this.finalTranscript = ""
            this.audioLevelHistory = []
            this.emotionHistory = []
            this.isRecording = true

            // Set up MediaRecorder with specified MIME type for better compatibility
            const mimeTypes = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"]

            // Find the first supported MIME type
            const mimeType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || ""

            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: mimeType,
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 2500000,
            })

            console.log("MediaRecorder initialized with settings:", {
                mimeType: this.mediaRecorder.mimeType,
                state: this.mediaRecorder.state,
            })

            // Set up event handlers
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data)
                    if (options.onDataAvailable) {
                        // Create a new blob with all chunks so far
                        const completeBlob = new Blob(this.recordedChunks, { type: this.mediaRecorder!.mimeType })
                        options.onDataAvailable(completeBlob)
                    }
                }
            }

            this.mediaRecorder.onerror = (event) => {
                console.error("MediaRecorder error:", event)
                if (options.onError) {
                    options.onError(new Error("MediaRecorder error"))
                }
            }

            // Start the recorder with smaller timeslices for more frequent updates
            this.mediaRecorder.start(300)
            console.log("MediaRecorder started:", this.mediaRecorder.state)

            // Set up emotion tracking if requested
            if (options.onEmotionUpdate && this.videoElement && this.faceApiProcessFunction) {
                this.emotionCallback = options.onEmotionUpdate
                this.startEmotionTracking()
            }

            // Store the audio level callback
            if (options.onAudioLevel) {
                this.audioLevelCallback = options.onAudioLevel
                this.startAudioLevelTracking()
            }

            // Set up speech recognition if the browser supports it
            if (options.onTranscription) {
                this.transcriptionCallback = options.onTranscription
                this.startSpeechRecognition()
            }

            // Start audio processing
            this.startAudioProcessing(options)
        } catch (error) {
            console.error("Error starting recording:", error)
            throw error
        }
    }

    private startAudioProcessing(options: RecordingOptions) {
        if (this.audioProcessor && this.audioAnalyser && this.audioDataArray) {
            this.audioProcessor.onaudioprocess = (e) => {
                if (!this.isRecording) return

                // Get audio frequency data
                this.audioAnalyser?.getByteFrequencyData(this.audioDataArray!)

                // Get time domain data for raw audio waveform
                if (this.audioRawDataArray) {
                    this.audioAnalyser?.getFloatTimeDomainData(this.audioRawDataArray)

                    // Send raw audio data if callback is provided
                    if (options.onAudioData) {
                        options.onAudioData(this.audioRawDataArray)
                    }
                }

                // Calculate audio levels for emotion correlation
                const audioLevel = this.calculateAudioLevel()

                // Add audio data to emotion data if needed
                if (this.audioLevelCallback) {
                    this.audioLevelCallback(audioLevel)
                }
            }
        } else {
            // Fallback using requestAnimationFrame
            const processAudio = () => {
                if (!this.isRecording) return

                if (this.audioAnalyser && this.audioDataArray) {
                    // Get frequency data
                    this.audioAnalyser.getByteFrequencyData(this.audioDataArray)

                    // Get time domain data
                    if (this.audioRawDataArray) {
                        this.audioAnalyser.getFloatTimeDomainData(this.audioRawDataArray)

                        // Send raw audio data if callback is provided
                        if (options.onAudioData) {
                            options.onAudioData(this.audioRawDataArray)
                        }
                    }

                    // Calculate audio level
                    const audioLevel = this.calculateAudioLevel()

                    // Send to callback if available
                    if (this.audioLevelCallback) {
                        this.audioLevelCallback(audioLevel)
                    }
                }

                // Continue the loop
                if (this.isRecording) {
                    requestAnimationFrame(processAudio)
                }
            }

            // Start the processing loop
            requestAnimationFrame(processAudio)
        }
    }

    private startAudioLevelTracking() {
        if (this.audioLevelInterval) {
            clearInterval(this.audioLevelInterval)
        }

        // Track audio levels at regular intervals
        this.audioLevelInterval = window.setInterval(() => {
            if (!this.isRecording) return

            const audioLevel = this.calculateAudioLevel()
            this.audioLevelHistory.push(audioLevel)

            // Keep history at a reasonable size
            if (this.audioLevelHistory.length > 100) {
                this.audioLevelHistory.shift()
            }
        }, 200)
    }

    private startSpeechRecognition(): void {
        // Check if the browser supports the Web Speech API
        const SpeechRecognitionClass = (window.SpeechRecognition ||
            (window as any).webkitSpeechRecognition) as unknown as SpeechRecognitionConstructor

        if (!SpeechRecognitionClass) {
            console.warn("Speech recognition not supported in this browser")
            return
        }

        try {
            // Stop any existing recognition
            if (this.speechRecognition) {
                try {
                    this.speechRecognition.stop()
                } catch (e) {
                    console.log("Error stopping existing speech recognition:", e)
                }
            }

            this.speechRecognition = new SpeechRecognitionClass()

            // Configure for optimal transcription
            this.speechRecognition.continuous = true
            this.speechRecognition.interimResults = true // Get interim results for live feedback
            this.speechRecognition.lang = "en-US" // Set language to English
            this.speechRecognition.maxAlternatives = 1

            // Handle speech recognition results
            this.speechRecognition.onresult = (event) => {
                let interimTranscript = ""

                // Process the results
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript

                    if (event.results[i].isFinal) {
                        this.finalTranscript += transcript + " "
                    } else {
                        interimTranscript += transcript
                    }
                }

                this.interimTranscript = interimTranscript

                // Combine final and interim for live updates
                const fullTranscript = this.finalTranscript + this.interimTranscript

                // Call the callback if available
                if (this.transcriptionCallback) {
                    this.transcriptionCallback(fullTranscript)
                }
            }

            // Handle errors and restarts
            this.speechRecognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error)
                // Attempt to restart on error after a short delay
                if (this.isRecording) {
                    setTimeout(() => {
                        this.startSpeechRecognition()
                    }, 1000)
                }
            }

            // Auto-restart recognition if it stops
            this.speechRecognition.onend = () => {
                console.log("Speech recognition ended, attempting restart...")
                // Try to restart if we're still in recording mode
                if (this.isRecording && this.transcriptionCallback) {
                    try {
                        setTimeout(() => {
                            this.speechRecognition?.start()
                            console.log("Speech recognition restarted")
                        }, 500)
                    } catch (e) {
                        console.error("Failed to restart speech recognition:", e)
                    }
                }
            }

            // Start the recognition
            this.speechRecognition.start()
            console.log("Speech recognition started")
        } catch (error) {
            console.error("Error starting speech recognition:", error)
        }
    }

    private calculateAudioLevel(): number {
        if (!this.audioDataArray) return 0

        // Calculate average volume level from frequency data
        let sum = 0
        let peak = 0

        for (let i = 0; i < this.audioDataArray.length; i++) {
            const value = this.audioDataArray[i]
            sum += value
            peak = Math.max(peak, value)
        }

        const average = sum / this.audioDataArray.length

        // Use both average and peak for a more natural volume level
        const combinedLevel = (average * 0.7 + peak * 0.3) / 255

        // Apply some smoothing
        return Math.min(1, Math.max(0, combinedLevel))
    }

    // Calculate speech rate based on transcript and time
    calculateSpeechRate(): number {
        const transcript = this.getFullTranscript()
        const words = transcript.trim().split(/\s+/).length
        const durationMinutes = (Date.now() - this.startTime) / 60000

        if (durationMinutes < 0.1) return 0 // Avoid division by near-zero

        return words / durationMinutes // Words per minute
    }

    pauseRecording(): void {
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
            this.mediaRecorder.pause()
            this.isRecording = false
            console.log("Recording paused")

            if (this.emotionInterval) {
                clearInterval(this.emotionInterval)
                this.emotionInterval = null
            }

            if (this.audioLevelInterval) {
                clearInterval(this.audioLevelInterval)
                this.audioLevelInterval = null
            }

            // Pause audio processing
            if (this.audioProcessor) {
                this.audioProcessor.onaudioprocess = null
            }

            // Pause speech recognition
            if (this.speechRecognition) {
                try {
                    this.speechRecognition.stop()
                    console.log("Speech recognition paused")
                } catch (e) {
                    console.log("Error pausing speech recognition:", e)
                }
            }
        }
    }

    resumeRecording(): void {
        if (this.mediaRecorder && this.mediaRecorder.state === "paused") {
            this.mediaRecorder.resume()
            this.isRecording = true
            console.log("Recording resumed")

            if (this.emotionCallback && this.videoElement && this.faceApiProcessFunction) {
                this.startEmotionTracking()
            }

            if (this.audioLevelCallback) {
                this.startAudioLevelTracking()
            }

            // Resume audio processing
            if (this.recordingOptions) {
                this.startAudioProcessing(this.recordingOptions)
            }

            // Resume speech recognition
            if (this.transcriptionCallback) {
                this.startSpeechRecognition()
                console.log("Speech recognition resumed")
            }
        }
    }

    // Modify the stopRecording method to not close the media stream
    async stopRecording(): Promise<Blob | null> {
        if (!this.mediaRecorder) {
            console.error("No active recording to stop")
            return null
        }

        return new Promise((resolve) => {
            this.mediaRecorder!.addEventListener("stop", () => {
                // Create a blob from all recorded chunks
                const recordedBlob = new Blob(this.recordedChunks, {
                    type: this.mediaRecorder!.mimeType || "video/webm",
                })

                // Clear recorded chunks for next recording
                this.recordedChunks = []

                // Important: Do NOT close the media stream here
                // this.closeMediaStream()

                // Stop any ongoing transcription
                if (this.transcriptionWorker) {
                    this.transcriptionWorker.terminate()
                    this.transcriptionWorker = null
                }

                // Reset recording state
                this.isRecording = false
                this.isPaused = false
                this.mediaRecorder = null

                resolve(recordedBlob)
            })

            // Stop the recording
            this.mediaRecorder!.stop()
        })
    }

    // Modify the cleanupResources method to not close the media stream
    private cleanupResources(): void {
        // Clear all intervals
        if (this.emotionInterval) {
            clearInterval(this.emotionInterval)
            this.emotionInterval = null
        }

        if (this.audioLevelInterval) {
            clearInterval(this.audioLevelInterval)
            this.audioLevelInterval = null
        }

        // Clean up audio processing
        if (this.audioProcessor) {
            this.audioProcessor.onaudioprocess = null
        }

        // Stop speech recognition
        if (this.speechRecognition) {
            try {
                this.speechRecognition.stop()
                console.log("Speech recognition stopped")
            } catch (error) {
                console.log("Error stopping speech recognition:", error)
            }
            this.speechRecognition = null
        }

        // We're NOT closing the media stream here anymore
        // This allows the camera to stay active between questions
    }

    getFullTranscript(): string {
        return this.finalTranscript.trim() + " " + this.interimTranscript.trim()
    }

    // Get audio stats for analysis
    getAudioStats(): { average: number; peak: number; variability: number } {
        if (this.audioLevelHistory.length === 0) {
            return { average: 0, peak: 0, variability: 0 }
        }

        // Calculate stats
        const sum = this.audioLevelHistory.reduce((acc, val) => acc + val, 0)
        const average = sum / this.audioLevelHistory.length
        const peak = Math.max(...this.audioLevelHistory)

        // Calculate variability/standard deviation
        const squaredDiffs = this.audioLevelHistory.map((value) => {
            const diff = value - average
            return diff * diff
        })
        const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / squaredDiffs.length
        const variability = Math.sqrt(avgSquaredDiff)

        return { average, peak, variability }
    }

    // Get emotion stats for analysis
    getEmotionStats(): {
        dominant: keyof FaceExpressions
        average: number
        variance: number
        emotionCounts: Record<string, number>
    } {
        if (this.emotionHistory.length === 0) {
            return {
                dominant: "neutral",
                average: 0,
                variance: 0,
                emotionCounts: {},
            }
        }

        // Count occurrences of each emotion
        const emotionCounts: Record<string, number> = {}
        let confidenceSum = 0

        this.emotionHistory.forEach((point) => {
            const emotion = point.dominantEmotion
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
            confidenceSum += point.confidence
        })

        // Find most frequent emotion
        let maxCount = 0
        let dominant: keyof FaceExpressions = "neutral"

        Object.entries(emotionCounts).forEach(([emotion, count]) => {
            if (count > maxCount) {
                maxCount = count
                dominant = emotion as keyof FaceExpressions
            }
        })

        // Calculate average confidence
        const average = confidenceSum / this.emotionHistory.length

        // Calculate variance in emotions (how much they changed)
        const uniqueEmotions = Object.keys(emotionCounts).length
        const totalEmotions = this.emotionHistory.length
        const variance = uniqueEmotions / totalEmotions

        return { dominant, average, variance, emotionCounts }
    }

    setFaceApiProcessor(processor: (video: HTMLVideoElement) => Promise<any>): void {
        this.faceApiProcessFunction = processor
    }

    private startEmotionTracking(): void {
        if (this.emotionInterval) {
            clearInterval(this.emotionInterval)
        }

        this.emotionInterval = window.setInterval(async () => {
            if (!this.isRecording || !this.videoElement || !this.faceApiProcessFunction || !this.emotionCallback) return

            try {
                const result = await this.faceApiProcessFunction(this.videoElement)

                if (result && result.expressions) {
                    const timestamp = Date.now() - this.startTime
                    const expressions = result.expressions as FaceExpressions

                    // Determine dominant emotion
                    let maxVal = 0
                    let dominant: keyof FaceExpressions = "neutral"

                    Object.entries(expressions).forEach(([emotion, value]) => {
                        if (value > maxVal) {
                            maxVal = value
                            dominant = emotion as keyof FaceExpressions
                        }
                    })

                    // Add audio level to emotion data if available
                    const audioLevel = this.audioDataArray ? this.calculateAudioLevel() : 0

                    const emotionData: EmotionDataPoint = {
                        timestamp,
                        expressions,
                        dominantEmotion: dominant,
                        confidence: maxVal,
                        audioLevel: audioLevel,
                    }

                    // Store emotion data for later analysis
                    this.emotionHistory.push(emotionData)

                    // Keep history at a reasonable size
                    if (this.emotionHistory.length > 100) {
                        this.emotionHistory.shift()
                    }

                    this.emotionCallback(emotionData)
                }
            } catch (error) {
                console.error("Error in emotion tracking:", error)
            }
        }, 300) // Track emotions at shorter intervals for more detail
    }

    closeMediaStream(): void {
        this.isRecording = false

        // Clean up all resources
        this.cleanupResources()

        if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
            try {
                this.mediaRecorder.stop()
            } catch (error) {
                console.log("Error stopping media recorder:", error)
            }
        }

        if (this.audioContext && this.audioContext.state !== "closed") {
            this.audioContext.close().catch((err) => console.error("Error closing audio context:", err))
        }

        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop())
            this.stream = null
        }

        if (this.videoElement) {
            this.videoElement.srcObject = null
            this.videoElement = null
        }

        console.log("Media stream closed")
    }

    // Analyze audio characteristics for feedback
    analyzeAudioCharacteristics(): {
        pace: number
        clarity: number
        volume: number
        stability: number
    } {
        const speechRate = this.calculateSpeechRate()
        const audioStats = this.getAudioStats()

        // Calculate pace score (optimal is around 150 wpm)
        let paceScore = 100
        if (speechRate > 0) {
            if (speechRate < 120) paceScore -= (120 - speechRate) * 0.5 // Too slow
            if (speechRate > 160) paceScore -= (speechRate - 160) * 0.5 // Too fast
        }

        // Calculate volume score
        const volumeScore = Math.min(100, Math.max(0, audioStats.average * 150))

        // Calculate clarity based on variability (some variation is good, too much is bad)
        let clarityScore = 100
        if (audioStats.variability < 0.1) clarityScore -= (0.1 - audioStats.variability) * 200 // Too monotone
        if (audioStats.variability > 0.3) clarityScore -= (audioStats.variability - 0.3) * 200 // Too erratic

        // Calculate stability (consistent volume is good)
        const stabilityScore = Math.max(0, 100 - audioStats.variability * 300)

        return {
            pace: Math.min(100, Math.max(0, paceScore)),
            clarity: Math.min(100, Math.max(0, clarityScore)),
            volume: Math.min(100, Math.max(0, volumeScore)),
            stability: Math.min(100, Math.max(0, stabilityScore)),
        }
    }
}

// Add the necessary SpeechRecognition type declarations if they don't exist
declare global {
    interface Window {
        SpeechRecognition : SpeechRecognitionConstructor
        webkitSpeechRecognition : SpeechRecognitionConstructor
    }
}

const recordingService = new RecordingService()
export default recordingService
