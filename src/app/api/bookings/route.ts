/**
 * 📋 Bookings API Route – Vantage Lane 2.0
 *
 * Example implementation using auth guards
 * - requireUser for authenticated access
 * - Input validation with Zod
 * - Full TypeScript safety
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/features/auth/guards/auth.guard';

/* --------------------------------------------------
 * 📝 Request/Response Schemas
 * -------------------------------------------------- */

const createBookingSchema = z.object({
  pickup: z.string().min(1, 'Pickup location is required'),
  dropoff: z.string().min(1, 'Dropoff location is required'),
  datetime: z.string().min(1, 'Date and time is required'),
  carClass: z.enum(['EXECUTIVE', 'BUSINESS', 'FIRST'], {
    errorMap: () => ({ message: 'Invalid car class' }),
  }),
  passengerCount: z.number().min(1).max(8).optional().default(1),
  notes: z.string().optional(),
});

type CreateBookingInput = z.infer<typeof createBookingSchema>;

/* --------------------------------------------------
 * 📋 GET /api/bookings - List user bookings
 * -------------------------------------------------- */

export async function GET() {
  try {
    const { supabase, user } = await requireUser();

    const { data, error } = await supabase
      .from('bookings')
      .select(
        `
        id,
        pickup,
        dropoff,
        datetime,
        car_class,
        passenger_count,
        status,
        created_at
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch bookings:', error);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    return NextResponse.json({
      bookings: data ?? [],
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Bookings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* --------------------------------------------------
 * 📋 POST /api/bookings - Create new booking
 * -------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const { supabase, user } = await requireUser();

    // Parse and validate request body
    const json = await req.json();
    const parsed = createBookingSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { pickup, dropoff, datetime, carClass, passengerCount, notes } = parsed.data;

    // Create booking in database
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        pickup,
        dropoff,
        datetime,
        car_class: carClass,
        passenger_count: passengerCount,
        notes: notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create booking:', error);
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    return NextResponse.json(
      {
        booking: data,
        message: 'Booking created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Bookings POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
