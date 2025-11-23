export class RateLimiter {
  private prefix = 'vl_rate_';

  private load(key: string) {
    const raw = localStorage.getItem(this.prefix + key);
    return raw ? parseInt(raw) : 0;
  }

  private save(key: string, val: number) {
    localStorage.setItem(this.prefix + key, val.toString());
  }

  canAutoDetect() {
    const count = this.load('auto');
    const isDev = process.env.NODE_ENV === 'development';
    const limit = isDev ? 1000 : 10; // Very high limit in development
    return count < limit;
  }

  canPrecise() {
    const count = this.load('gps');
    const isDev = process.env.NODE_ENV === 'development';
    const limit = isDev ? 100 : 5; // High limit in development
    return count < limit;
  }

  recordAutoDetect() {
    this.save('auto', this.load('auto') + 1);
    // reset in 1 hour
    setTimeout(() => this.save('auto', 0), 3600_000);
  }

  recordPrecise() {
    this.save('gps', this.load('gps') + 1);

    // reset at midnight
    const now = new Date();
    const resetMs =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    setTimeout(() => this.save('gps', 0), resetMs);
  }
}
