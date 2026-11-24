import { TelemetryMetric } from './types';

export class TelemetryTracker {
  private totalKeystrokes = 0;
  private pasteEvents = 0;
  private pastedCharCount = 0;
  private backspaceCount = 0;
  private startTime: number = Date.now();
  private lastActivityTime: number = Date.now();
  private activeTypingTimeMs = 0;
  private burstAnomalyDetected = false;

  public recordKeystroke(key: string) {
    const now = Date.now();
    const delta = now - this.lastActivityTime;
    if (delta < 5000) {
      this.activeTypingTimeMs += delta;
    }
    this.lastActivityTime = now;
    this.totalKeystrokes++;

    if (key === 'Backspace' || key === 'Delete') {
      this.backspaceCount++;
    }
  }

  public recordPaste(pastedText: string) {
    this.pasteEvents++;
    this.pastedCharCount += pastedText.length;
    this.lastActivityTime = Date.now();

    // If more than 300 characters pasted in a single burst
    if (pastedText.length > 300) {
      this.burstAnomalyDetected = true;
    }
  }

  public getMetrics(currentCodeLength: number): TelemetryMetric {
    const totalChars = Math.max(1, currentCodeLength);
    const pasteRatio = Math.min(1.0, this.pastedCharCount / totalChars);

    return {
      totalKeystrokes: this.totalKeystrokes,
      pasteEvents: this.pasteEvents,
      pastedCharCount: this.pastedCharCount,
      activeTypingTimeSeconds: Math.round(this.activeTypingTimeMs / 1000),
      backspaceCount: this.backspaceCount,
      pasteRatio,
      burstAnomalyDetected: this.burstAnomalyDetected || (this.pasteEvents > 0 && pasteRatio > 0.8),
    };
  }
}
