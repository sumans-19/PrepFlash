
import { useState, useEffect, useCallback } from 'react';
import { transcribeAudio } from '@/services/api';

interface VoiceRecognitionProps {
  onResult?: (result: string) => void;
  onAudioData?: (audioBlob: Blob, duration: number) => void;
  onError?: (error: string) => void;
}

const useVoiceRecognition = ({
  onResult,
  onAudioData,
  onError
}: VoiceRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Start voice recognition
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const duration = startTime ? (Date.now() - startTime) / 1000 : 0;
        
        if (onAudioData) {
          onAudioData(audioBlob, duration);
        }
        
        try {
          const result = await transcribeAudio(audioBlob);
          setTranscript(result);
          if (onResult) {
            onResult(result);
          }
        } catch (error) {
          if (onError) {
            onError('Failed to transcribe audio');
          }
        }
      };
      
      recorder.start();
      setStartTime(Date.now());
      setIsListening(true);
      setAudioChunks([]);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (onError) {
        onError('Error accessing microphone');
      }
    }
  }, [onResult, onAudioData, onError]);

  // Stop voice recognition
  const stopListening = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      
      // Stop all audio tracks
      if (mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      
      setIsListening(false);
    }
  }, [mediaRecorder]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        if (mediaRecorder.stream) {
          mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [mediaRecorder]);

  return {
    transcript,
    isListening,
    startListening,
    stopListening
  };
};

export default useVoiceRecognition;
