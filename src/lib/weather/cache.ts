export class WeatherCache {
  private ttl: number;
  private prefix = 'vl_cache_';

  constructor(ttlMs: number) {
    this.ttl = ttlMs;
  }

  private isClient() {
    return typeof window !== 'undefined';
  }

  private hasConsent() {
    return this.isClient() && localStorage.getItem('vl_location_consent') === 'true';
  }

  private isExpired(exp: number) {
    return Date.now() > exp;
  }

  get<T>(key: string): T | null {
    if (!this.isClient()) return null;

    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;

      const entry = JSON.parse(raw);
      if (this.isExpired(entry.expires)) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return entry.value as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T) {
    if (!this.isClient()) return;

    // GDPR: Only cache location if user consented
    if (key.includes('location') && !this.hasConsent()) {
      return;
    }

    const entry = {
      value: key.includes('location') ? { ...value, timestamp: Date.now() } : value,
      expires: Date.now() + this.ttl,
    };

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {}
  }

  clear(key: string) {
    if (!this.isClient()) return;
    localStorage.removeItem(this.prefix + key);
  }
}
