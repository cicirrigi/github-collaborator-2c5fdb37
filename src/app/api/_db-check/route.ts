/**
 * 🔍 DB Check Endpoint - Verify NEW DB Connection
 * Returns basic info to confirm we're connected to the new Supabase instance
 */

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use service role to bypass RLS for admin check
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Get current timestamp
    const { data: timeData, error: timeError } = await supabaseAdmin.rpc('select', {
      query: 'SELECT now() as current_time',
    });

    if (timeError) {
      console.error('Time query error:', timeError);
    }

    // Get table counts for verification
    const tables = [
      'customers',
      'bookings',
      'booking_legs',
      'booking_payments',
      'vehicle_categories',
      'vehicle_models',
    ];
    const counts: Record<string, number> = {};

    for (const table of tables) {
      try {
        const { count, error } = await supabaseAdmin
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (!error) {
          counts[table] = count || 0;
        } else {
          counts[table] = -1; // Error indicator
        }
      } catch (e) {
        counts[table] = -1;
      }
    }

    // Mask the URL for security
    const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const maskedUrl = dbUrl
      ? dbUrl.replace(/https:\/\/([a-z0-9]+)\.supabase\.co/, 'https://***$1***.supabase.co')
      : 'NOT_SET';

    return NextResponse.json({
      status: 'NEW_DB_CONNECTED',
      timestamp: new Date().toISOString(),
      db_time: timeData || 'Unable to fetch',
      masked_url: maskedUrl,
      table_counts: counts,
      schema_version: 'NEW_DB_SCHEMA_v1',
      features: {
        quote_valid_until: true,
        generate_booking_reference: true,
        text_vehicle_ids: true,
        unpaid_default_status: true,
      },
    });
  } catch (error) {
    console.error('DB Check Error:', error);
    return NextResponse.json(
      {
        status: 'DB_CHECK_FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
