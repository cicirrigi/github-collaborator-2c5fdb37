export class WeatherCache {
  private ttl: number;
  private keyPrefix = 'vl_weather_';

  constructor(ttlMs: number) {
    this.ttl = ttlMs;
  }

  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private hasConsent(): boolean {
    return this.isClient() && localStorage.getItem('vl_location_consent') === 'true';
  }

  /** GET */
  get<T>(key: string): T | null {
    if (!this.isClient()) return null;

    try {
      const raw = localStorage.getItem(this.keyPrefix + key);
      if (!raw) return null;

      const entry = JSON.parse(raw);

      if (Date.now() > entry.expires) {
        localStorage.removeItem(this.keyPrefix + key);
        return null;
      }

      return entry.value as T;
    } catch {
      return null;
    }
  }

  /** SET */
  set<T>(key: string, value: T) {
    if (!this.isClient()) return;

    // Location data requires user consent (GDPR)
    if (key.includes('location') && !this.hasConsent()) {
      // eslint-disable-next-line no-console
      console.warn('⚠ Location caching blocked (no GDPR consent)');
      return;
    }

    try {
      const entry = {
        value,
        expires: Date.now() + this.ttl,
      };

      localStorage.setItem(this.keyPrefix + key, JSON.stringify(entry));
    } catch {}
  }

  /** CLEAR */
  clear(key: string) {
    if (!this.isClient()) return;
    try {
      localStorage.removeItem(this.keyPrefix + key);
    } catch {}
  }
}
