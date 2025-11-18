import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const lat = req.nextUrl.searchParams.get('lat');
    const lng = req.nextUrl.searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 });
    }

    const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${KEY}`;

    const res = await fetch(url);
    const json = await res.json();

    const components = json.results?.[0]?.address_components ?? [];

    let city = 'Unknown';
    let country = 'Unknown';

    for (const comp of components) {
      if (comp.types.includes('locality')) city = comp.long_name;
      if (comp.types.includes('country')) country = comp.long_name;
    }

    return NextResponse.json({
      city,
      country,
      lat: Number(lat),
      lng: Number(lng),
      source: 'gps',
    });
  } catch (err) {
    console.error('Reverse geocoding failed:', err);

    return NextResponse.json(
      {
        city: 'Unknown',
        country: 'Unknown',
        lat: Number(req.nextUrl.searchParams.get('lat')),
        lng: Number(req.nextUrl.searchParams.get('lng')),
        source: 'gps',
      },
      { status: 200 }
    );
  }
}
