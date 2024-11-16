export class StreamingRateLimit {
  private requestCount: number = 0;
  private lastReset: number = Date.now();
  private readonly LIMIT_WINDOW = 60000; // 1 minute
  private readonly MAX_REQUESTS = 25;

  checkRateLimit(): boolean {
    const now = Date.now();
    if (now - this.lastReset > this.LIMIT_WINDOW) {
      this.requestCount = 0;
      this.lastReset = now;
    }

    if (this.requestCount >= this.MAX_REQUESTS) {
      return false;
    }

    this.requestCount++;
    return true;
  }

  getRemainingRequests(): number {
    return this.MAX_REQUESTS - this.requestCount;
  }
} 