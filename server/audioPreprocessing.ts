/**
 * Audio preprocessing utilities to improve emotion detection accuracy
 * Includes normalization, noise reduction, and feature extraction
 */

export async function preprocessAudioForAnalysis(audioBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  // This function is primarily for client-side preprocessing
  // Server-side, we just return the buffer as-is
  try {
    if (typeof window === 'undefined') {
      // Server-side: return buffer as-is
      return audioBuffer;
    }

    const audioContext = new (window as any).AudioContext();
    const audioData = await audioContext.decodeAudioData(audioBuffer.slice(0));
  const rawData = audioData.getChannelData(0);

  // Step 1: Normalize audio to prevent clipping
  const normalized = normalizeAudio(rawData);

  // Step 2: Apply noise gate to remove silence
  const gated = applyNoiseGate(normalized, 0.02);

  // Step 3: Pre-emphasis filter to enhance high frequencies
  const emphasized = applyPreEmphasis(gated);

  // Step 4: Trim silence from start and end
  const trimmed = trimSilence(emphasized, 0.01);

    // Convert back to AudioBuffer
    const offlineContext = new (window as any).OfflineAudioContext(
      1,
      trimmed.length,
      audioData.sampleRate
    );

    const processedBuffer = offlineContext.createBuffer(1, trimmed.length, audioData.sampleRate);
    processedBuffer.getChannelData(0).set(trimmed);
    return processedBuffer.getChannelData(0).buffer;
  } catch (error) {
    console.warn('Audio preprocessing failed, returning original buffer:', error);
    return audioBuffer;
  }
}

/**
 * Normalize audio to [-1, 1] range
 */
function normalizeAudio(data: Float32Array): Float32Array {
  const normalized = new Float32Array(data.length);
  let max = 0;

  // Find maximum absolute value
  for (let i = 0; i < data.length; i++) {
    const abs = Math.abs(data[i]);
    if (abs > max) max = abs;
  }

  // Normalize to prevent clipping
  const scale = max > 0 ? 0.95 / max : 1;
  for (let i = 0; i < data.length; i++) {
    normalized[i] = data[i] * scale;
  }

  return normalized;
}

/**
 * Apply noise gate to remove low-amplitude noise
 */
function applyNoiseGate(data: Float32Array, threshold: number): Float32Array {
  const gated = new Float32Array(data.length);
  const windowSize = 512;
  const hopSize = 256;

  for (let i = 0; i < data.length; i++) {
    const windowStart = Math.max(0, i - windowSize / 2);
    const windowEnd = Math.min(data.length, i + windowSize / 2);
    
    let energy = 0;
    for (let j = windowStart; j < windowEnd; j++) {
      energy += data[j] * data[j];
    }
    
    const rms = Math.sqrt(energy / (windowEnd - windowStart));
    gated[i] = rms > threshold ? data[i] : 0;
  }

  return gated;
}

/**
 * Apply pre-emphasis filter to enhance high frequencies
 * This helps with emotion detection by emphasizing vocal characteristics
 */
function applyPreEmphasis(data: Float32Array, coefficient: number = 0.97): Float32Array {
  const emphasized = new Float32Array(data.length);
  
  emphasized[0] = data[0];
  for (let i = 1; i < data.length; i++) {
    emphasized[i] = data[i] - coefficient * data[i - 1];
  }

  return emphasized;
}

/**
 * Trim silence from the beginning and end of audio
 */
function trimSilence(data: Float32Array, threshold: number): Float32Array {
  let start = 0;
  let end = data.length - 1;

  // Find start of non-silent audio
  for (let i = 0; i < data.length; i++) {
    if (Math.abs(data[i]) > threshold) {
      start = i;
      break;
    }
  }

  // Find end of non-silent audio
  for (let i = data.length - 1; i >= 0; i--) {
    if (Math.abs(data[i]) > threshold) {
      end = i;
      break;
    }
  }

  return data.slice(start, end + 1);
}

/**
 * Extract MFCC (Mel-Frequency Cepstral Coefficients) features
 * These are commonly used for emotion detection
 */
export function extractMFCCFeatures(data: Float32Array, sampleRate: number = 16000): number[] {
  const frameSize = 512;
  const hopSize = 256;
  const numMFCC = 13;
  const features: number[] = [];

  // Process audio in frames
  for (let i = 0; i < data.length - frameSize; i += hopSize) {
    const frame = data.slice(i, i + frameSize);
    
    // Apply Hamming window
    const windowed = applyHammingWindow(frame);
    
    // Compute power spectrum
    const spectrum = computePowerSpectrum(windowed);
    
    // Apply mel-scale filterbank
    const melSpectrum = applyMelFilterbank(spectrum, sampleRate);
    
    // Compute log and DCT
    const mfcc = computeMFCC(melSpectrum, numMFCC);
    features.push(...mfcc);
  }

  return features;
}

function applyHammingWindow(frame: Float32Array): Float32Array {
  const windowed = new Float32Array(frame.length);
  for (let i = 0; i < frame.length; i++) {
    windowed[i] = frame[i] * (0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (frame.length - 1)));
  }
  return windowed;
}

function computePowerSpectrum(frame: Float32Array): number[] {
  // Simple FFT approximation using DFT
  const spectrum: number[] = [];
  const N = frame.length;

  for (let k = 0; k < N / 2; k++) {
    let real = 0;
    let imag = 0;

    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / N;
      real += frame[n] * Math.cos(angle);
      imag += frame[n] * Math.sin(angle);
    }

    spectrum[k] = (real * real + imag * imag) / (N * N);
  }

  return spectrum;
}

function applyMelFilterbank(spectrum: number[], sampleRate: number): number[] {
  const numFilters = 40;
  const melSpectrum: number[] = [];

  for (let i = 0; i < numFilters; i++) {
    let sum = 0;
    for (let j = 0; j < spectrum.length; j++) {
      const weight = getMelFilterWeight(i, j, numFilters, spectrum.length, sampleRate);
      sum += spectrum[j] * weight;
    }
    melSpectrum.push(Math.max(sum, 1e-10));
  }

  return melSpectrum;
}

function getMelFilterWeight(
  filterIndex: number,
  spectrumIndex: number,
  numFilters: number,
  spectrumSize: number,
  sampleRate: number
): number {
  const melMin = 0;
  const melMax = 2595 * Math.log10(1 + sampleRate / 2 / 700);
  const melCenter = melMin + ((melMax - melMin) / (numFilters + 1)) * (filterIndex + 1);
  const melLeft = melMin + ((melMax - melMin) / (numFilters + 1)) * filterIndex;
  const melRight = melMin + ((melMax - melMin) / (numFilters + 1)) * (filterIndex + 2);

  const freqCenter = 700 * (Math.pow(10, melCenter / 2595) - 1);
  const freqLeft = 700 * (Math.pow(10, melLeft / 2595) - 1);
  const freqRight = 700 * (Math.pow(10, melRight / 2595) - 1);

  const spectrumFreq = (spectrumIndex * sampleRate) / (2 * spectrumSize);

  if (spectrumFreq < freqLeft || spectrumFreq > freqRight) {
    return 0;
  }

  if (spectrumFreq <= freqCenter) {
    return (spectrumFreq - freqLeft) / (freqCenter - freqLeft);
  }

  return (freqRight - spectrumFreq) / (freqRight - freqCenter);
}

function computeMFCC(melSpectrum: number[], numMFCC: number): number[] {
  const mfcc: number[] = [];

  // Log scale
  const logMel = melSpectrum.map((x) => Math.log(x));

  // DCT (simplified)
  for (let i = 0; i < numMFCC; i++) {
    let sum = 0;
    for (let j = 0; j < logMel.length; j++) {
      sum += logMel[j] * Math.cos((Math.PI * i * (j + 0.5)) / logMel.length);
    }
    mfcc.push(sum);
  }

  return mfcc;
}
