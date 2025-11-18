import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Try multiple IP services for better reliability
  const ipServices = [
    'https://ipapi.co/json/',
    'https://ipinfo.io/json',
    // Note: ipify.org only returns IP, not location data
  ];

  for (const serviceUrl of ipServices) {
    try {
      const res = await fetch(serviceUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LocationBot/1.0)',
        },
      });

      if (!res.ok) {
        continue;
      }

      const data = await res.json();

      // Parse different API responses
      let city = 'Unknown';
      let country = 'Unknown';
      let lat = 0;
      let lng = 0;

      if (serviceUrl.includes('ipapi.co')) {
        city = data.city || 'Unknown';
        country = data.country_name || 'Unknown';
        lat = data.latitude || 0;
        lng = data.longitude || 0;
      } else if (serviceUrl.includes('ipinfo.io')) {
        const [latStr, lngStr] = (data.loc || '0,0').split(',');
        city = data.city || 'Unknown';
        country = data.country || 'Unknown';
        lat = parseFloat(latStr) || 0;
        lng = parseFloat(lngStr) || 0;
      }

      // Validate we got real data
      if (lat !== 0 && lng !== 0 && city !== 'Unknown') {
        const location = {
          city,
          country,
          lat,
          lng,
          source: 'ip' as const,
        };

        return NextResponse.json(location);
      }
    } catch {
      continue;
    }
  }

  // All services failed, return fallback
  const fallback = {
    city: 'London',
    country: 'UK',
    lat: 51.5074,
    lng: -0.1278,
    source: 'fallback' as const,
  };

  return NextResponse.json(fallback);
}
