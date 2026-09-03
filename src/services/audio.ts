// Web Audio API procedural sound engine
import { PetId, SpotOutcome } from '../types/game';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isBgmPlaying) {
      this.stopBgm();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Soft tactile UI click
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Clattering dice roll
  public playDiceRoll() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 7; i++) {
      const delay = i * 0.08 + Math.random() * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const freq = 300 + Math.random() * 400;
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(150, now + delay + 0.05);

      gain.gain.setValueAtTime(0.25 - i * 0.02, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.05);
    }
  }

  // Suspense heartbeat when hovering or preparing to pet
  public playTension() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Safe spot: cheerful sigh of relief and harmonic ding-dong
  public playSafe() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.3);
    });
  }

  // Elimination: comedic cartoon slide whistle down & bonk
  public playElimination() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.45);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);

    // Bonk impact
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const bonkOsc = this.ctx.createOscillator();
      const bonkGain = this.ctx.createGain();
      bonkOsc.type = 'triangle';
      bonkOsc.frequency.setValueAtTime(140, this.ctx.currentTime);
      bonkOsc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);
      bonkGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      bonkGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      bonkOsc.connect(bonkGain);
      bonkGain.connect(this.ctx.destination);
      bonkOsc.start();
      bonkOsc.stop(this.ctx.currentTime + 0.15);
    }, 450);
  }

  // Sudden Death Sweet Spot: Triumphant brass-like fanfare arpeggio with celebratory bells
  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const chords = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.12 }, // E5
      { freq: 783.99, time: 0.24 }, // G5
      { freq: 1046.50, time: 0.38 },// C6
      { freq: 1318.51, time: 0.52 },// E6
      { freq: 1567.98, time: 0.70 } // G6 (Held triumphant)
    ];

    chords.forEach(({ freq, time }) => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime + time;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (time === 0.7 ? 1.0 : 0.4));

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + (time === 0.7 ? 1.1 : 0.45));
    });
  }

  // Pet-specific vocalization synthesis
  public playPetVoice(petId: PetId, outcome: SpotOutcome) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (outcome === 'sweet') {
      this.playVictory();
      return;
    }

    if (outcome === 'safe') {
      this.playSafe();
      return;
    }

    // Danger / Anger / Swat
    this.playElimination();

    // Secondary comedic animal reaction
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (petId === 'garfield_cat') {
        // Cat hiss (filtered white noise burst)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      } else if (petId === 'pomeranian') {
        // Yappy sharp bark
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      } else if (petId === 'snake') {
        // Prolonged snake hiss
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
      } else if (petId === 'capybara') {
        // Low dissatisfied grumpy snort
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      } else {
        // Beetle chitin pinch click
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    }, 150);
  }

  // Cheerful background music synthesizer (soft marimba melody)
  public startBgm() {
    if (this.isBgmPlaying || this.isMuted) return;
    this.isBgmPlaying = true;
    this.initContext();

    const notes = [
      261.63, 329.63, 392.00, 523.25,
      392.00, 329.63, 293.66, 349.23,
      440.00, 349.23, 293.66, 261.63
    ];
    let noteIndex = 0;

    this.bgmInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted || !this.isBgmPlaying) return;
      const freq = notes[noteIndex];
      noteIndex = (noteIndex + 1) % notes.length;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    }, 380);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundEngine();
