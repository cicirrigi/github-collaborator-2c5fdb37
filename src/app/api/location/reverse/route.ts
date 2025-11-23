import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const lat = req.nextUrl.searchParams.get('lat');
    const lng = req.nextUrl.searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
    }

    const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${KEY}`;

    const res = await fetch(url);
    const json = await res.json();

    if (!json.results?.length) {
      throw new Error('No results');
    }

    let city = 'Unknown';
    let country = 'Unknown';

    for (const comp of json.results[0].address_components) {
      if (comp.types.includes('locality')) city = comp.long_name;
      if (comp.types.includes('country')) country = comp.long_name;
    }

    return NextResponse.json({ city, country });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Reverse failed', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
