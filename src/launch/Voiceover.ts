/**
 * Voiceover for the launch film.
 *
 * Plays the pre-generated clips in /launch/vo/ (one per line in VOICE_LINES, made by
 * scripts/generate-voiceover.py). If a clip is missing, that line falls back to the
 * browser's built-in speech voice so the film never goes silent.
 */

const clipUrl = (index: number) => `/launch/vo/${String(index).padStart(2, '0')}.mp3`;

export class Voiceover {
  private clips: Array<HTMLAudioElement | null>;
  private synth: SpeechSynthesis | null = 'speechSynthesis' in window ? window.speechSynthesis : null;
  private enabled = true;

  constructor(count: number) {
    // Preload every clip so each starts the instant its card appears.
    this.clips = Array.from({ length: count }, (_, i) => {
      const audio = new Audio(clipUrl(i));
      audio.preload = 'auto';
      audio.addEventListener('error', () => {
        this.clips[i] = null;
      });
      return audio;
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) this.stop();
  }

  speak(index: number, text: string) {
    if (!this.enabled) return;
    const clip = this.clips[index];
    if (clip) {
      clip.currentTime = 0;
      clip.volume = 1;
      void clip.play().catch(() => this.speakWithBrowser(text));
      return;
    }
    this.speakWithBrowser(text);
  }

  private speakWithBrowser(text: string) {
    if (!this.synth) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 0.9;
    this.synth.speak(u);
  }

  stop() {
    this.clips.forEach((clip) => clip?.pause());
    this.synth?.cancel();
  }

  dispose() {
    this.stop();
  }
}
