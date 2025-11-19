import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const services = ['https://ipapi.co/json/', 'https://ipinfo.io/json'];

  for (const url of services) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'VantageLaneBot/1.0' },
      });

      if (!res.ok) continue;

      const data = await res.json();

      let city = '';
      let country = '';
      let lat = 0;
      let lng = 0;

      if (url.includes('ipapi')) {
        city = data.city;
        country = data.country_name;
        lat = data.latitude;
        lng = data.longitude;
      } else if (url.includes('ipinfo')) {
        city = data.city;
        country = data.country;
        const [la, lo] = data.loc.split(',');
        lat = parseFloat(la);
        lng = parseFloat(lo);
      }

      if (lat && lng) {
        return NextResponse.json({
          city,
          country,
          lat,
          lng,
          source: 'ip',
        });
      }
    } catch {}
  }

  // Fallback
  return NextResponse.json({
    city: 'London',
    country: 'UK',
    lat: 51.5074,
    lng: -0.1278,
    source: 'fallback',
  });
}
