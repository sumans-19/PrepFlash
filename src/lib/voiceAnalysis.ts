import * as Tone from 'tone';

export interface VoiceMetrics {
  pitch: number;
  volume: number;
  clarity: number;
  confidence: number;
}

export class VoiceAnalyzer {
  private analyzer: Tone.Analyser;
  private microphone: Tone.UserMedia;
  private meter: Tone.Meter;
  private pitchAnalyzer: Tone.FFT;
  
  constructor() {
    this.analyzer = new Tone.Analyser('waveform', 1024);
    this.microphone = new Tone.UserMedia();
    this.meter = new Tone.Meter();
    this.pitchAnalyzer = new Tone.FFT(1024);
    
    // Connect the audio chain
    this.microphone.connect(this.analyzer);
    this.microphone.connect(this.meter);
    this.microphone.connect(this.pitchAnalyzer);
  }

  async start() {
    await Tone.start();
    await this.microphone.open();
  }

  stop() {
    this.microphone.close();
  }

  analyze(): VoiceMetrics {
    const waveform = this.analyzer.getValue();
    const volume = this.meter.getValue();
    const frequencies = this.pitchAnalyzer.getValue();
    
    // Calculate dominant frequency (pitch)
    const pitchValue = this.calculatePitch(frequencies as Float32Array);
    
    // Calculate clarity based on waveform analysis
    const clarity = this.calculateClarity(waveform as Float32Array);
    
    // Calculate confidence based on multiple factors
    const confidence = this.calculateConfidence(volume as number, clarity);
    
    return {
      pitch: pitchValue,
      volume: volume as number,
      clarity,
      confidence
    };
  }

  private calculatePitch(frequencies: Float32Array): number {
    // Find the frequency bin with maximum amplitude
    let maxAmplitude = -Infinity;
    let maxIndex = 0;
    
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] > maxAmplitude) {
        maxAmplitude = frequencies[i];
        maxIndex = i;
      }
    }
    
    // Convert bin index to frequency (Hz)
    // The FFT size is 1024, and the sampling rate is typically 44100 Hz
    const samplingRate = 44100;
    return (maxIndex * samplingRate) / (2 * frequencies.length);
  }

  private calculateClarity(waveform: Float32Array): number {
    // Calculate signal-to-noise ratio and waveform regularity
    let sumSquares = 0;
    let previousValue = waveform[0];
    let irregularityCount = 0;

    for (let i = 0; i < waveform.length; i++) {
      sumSquares += waveform[i] * waveform[i];
      
      if (i > 0) {
        const delta = Math.abs(waveform[i] - previousValue);
        if (delta > 0.1) irregularityCount++;
      }
      
      previousValue = waveform[i];
    }

    const rms = Math.sqrt(sumSquares / waveform.length);
    const regularityScore = 1 - (irregularityCount / waveform.length);
    
    // Combine metrics into clarity score (0-1)
    return (rms * 0.5 + regularityScore * 0.5);
  }

  private calculateConfidence(volume: number, clarity: number): number {
    // Normalize volume to 0-1 range
    const normalizedVolume = Math.min(Math.max(volume + 60, 0) / 60, 1);
    
    // Weight different factors
    const weights = {
      volume: 0.3,
      clarity: 0.7
    };
    
    // Calculate confidence score (0-1)
    return (
      normalizedVolume * weights.volume +
      clarity * weights.clarity
    );
  }
}