export type AmbientSoundType = 'rain' | 'fireplace' | 'library' | 'pages';

class AmbientAudioService {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentType: AmbientSoundType = 'rain';
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private timerId: number | null = null;
  private volume = 0.4;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(type: AmbientSoundType = this.currentType) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.currentType = type;
    this.isPlaying = true;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (type === 'rain') {
      this.playRain();
    } else if (type === 'fireplace') {
      this.playFireplace();
    } else if (type === 'library') {
      this.playLibrary();
    } else if (type === 'pages') {
      this.playPages();
    }
  }

  private playRain() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.2;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(800, this.ctx.currentTime);

    whiteNoise.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  private playFireplace() {
    if (!this.ctx || !this.gainNode) return;
    // Low rumble
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(45, this.ctx.currentTime);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    osc.connect(oscGain);
    oscGain.connect(this.gainNode);
    osc.start();
    this.noiseNode = osc;

    // Crackle effect
    this.timerId = window.setInterval(() => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      if (Math.random() > 0.4) {
        const crackle = this.ctx.createBuffer(1, 400, this.ctx.sampleRate);
        const data = crackle.getChannelData(0);
        for (let i = 0; i < 400; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 80);
        }
        const burst = this.ctx.createBufferSource();
        burst.buffer = crackle;
        const bGain = this.ctx.createGain();
        bGain.gain.setValueAtTime((Math.random() * 0.4 + 0.1) * this.volume, this.ctx.currentTime);
        burst.connect(bGain);
        bGain.connect(this.ctx.destination);
        burst.start();
      }
    }, 120);
  }

  private playLibrary() {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(250, this.ctx.currentTime);

    osc.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    osc.start();
    this.noiseNode = osc;
  }

  private playPages() {
    if (!this.ctx || !this.gainNode) return;
    // Gentle recurring rustle
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(70, this.ctx.currentTime);

    const pGain = this.ctx.createGain();
    pGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    osc.connect(pGain);
    pGain.connect(this.gainNode);
    osc.start();
    this.noiseNode = osc;
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioScheduledSourceNode).stop();
      } catch (e) {
        // ignore
      }
      this.noiseNode = null;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentType: this.currentType,
      volume: this.volume,
    };
  }
}

export const ambientAudio = new AmbientAudioService();
