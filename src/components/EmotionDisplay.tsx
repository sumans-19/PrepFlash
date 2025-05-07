import type React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts"
import type { EmotionDataPoint, FaceExpressions } from "../types/index"
import { getEmotionColor } from "../services/faceDetectionService"

interface EmotionDisplayProps {
  emotionData: EmotionDataPoint[]
  height?: number | string
  showLegend?: boolean
  showAxis?: boolean
  className?: string
  showAudio?: boolean
}

export const EmotionDisplay: React.FC<EmotionDisplayProps> = ({
  emotionData,
  height = 200,
  showLegend = true,
  showAxis = true,
  className = "",
  showAudio = true,
}) => {
  if (!emotionData || emotionData.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-muted-foreground">No emotion data available yet</p>
      </div>
    )
  }

  // Filter out any invalid data points and ensure we're always showing the latest data
  const validEmotionData = emotionData.filter((point) => point && point.expressions && point.dominantEmotion)

  // Add this check to ensure we're displaying data even if it's minimal
  if (validEmotionData.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-muted-foreground">Waiting for valid emotion data...</p>
      </div>
    )
  }

  // Prepare chart data
  const chartData = validEmotionData.map((point) => ({
    time: Math.round(point.timestamp / 1000), // convert to seconds
    ...point.expressions,
    audioLevel: point.audioLevel || 0,
  }))

  // Define emotions and their colors
  const emotions: Array<keyof FaceExpressions> = [
    "happy",
    "sad",
    "angry",
    "fearful",
    "disgusted",
    "surprised",
    "neutral",
  ]

  // Check if we have audio data
  const hasAudioData = validEmotionData.some((point) => point.audioLevel !== undefined)

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        {hasAudioData && showAudio ? (
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {showAxis && (
              <>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="time" label={{ value: "Time (seconds)", position: "insideBottom", offset: -8 }} />
                <YAxis
                  yAxisId="left"
                  label={{ value: "Emotion", angle: -90, position: "insideLeft" }}
                  domain={[0, 1]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: "Voice Level", angle: 90, position: "insideRight" }}
                  domain={[0, 1]}
                />
              </>
            )}

            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "audioLevel") {
                  return [`${(value * 100).toFixed(0)}%`, "Voice Level"]
                }
                return [`${(value * 100).toFixed(0)}%`, name]
              }}
              labelFormatter={(label) => `Time: ${label}s`}
            />

            {showLegend && <Legend />}

            {emotions.map((emotion) => (
              <Area
                key={emotion}
                type="monotone"
                dataKey={emotion}
                yAxisId="left"
                stackId="1"
                stroke={getEmotionColor(emotion)}
                fill={getEmotionColor(emotion)}
                fillOpacity={0.6}
              />
            ))}

            <Line type="monotone" dataKey="audioLevel" yAxisId="right" stroke="#8884d8" strokeWidth={2} dot={false} />
          </ComposedChart>
        ) : (
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {showAxis && (
              <>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="time" label={{ value: "Time (seconds)", position: "insideBottomRight", offset: -10 }} />
                <YAxis label={{ value: "Intensity", angle: -90, position: "insideLeft" }} domain={[0, 1]} />
              </>
            )}

            <Tooltip
              formatter={(value: number) => [`${(value * 100).toFixed(0)}%`, ""]}
              labelFormatter={(label) => `Time: ${label}s`}
            />

            {showLegend && <Legend />}

            {emotions.map((emotion) => (
              <Area
                key={emotion}
                type="monotone"
                dataKey={emotion}
                stackId="1"
                stroke={getEmotionColor(emotion)}
                fill={getEmotionColor(emotion)}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default EmotionDisplay
