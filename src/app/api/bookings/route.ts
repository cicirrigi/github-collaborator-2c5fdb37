import { resolveBookingServices } from '@/domain/services/resolveBookingServices';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { buildBookingPayload, buildLegsPayload } from '@/services/booking-mapping/dbPayload';
import { buildQuoteLineItems, calculateQuoteTotal } from '@/services/pricing/serviceItems';
import type { BillingSnapshot } from '@/types/billing/billing.types';
import { fetchBillingForBooking } from '@/utils/booking/billing-helper';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createCustomerWithOrganization } from '../../../services/organization/organizationResolver';

export const runtime = 'nodejs';

const createBookingSchema = z.object({
  tripConfiguration: z.any(),
  bookingType: z.enum(['oneway', 'return', 'hourly', 'daily', 'fleet', 'bespoke']),
  billingEntityId: z.string().uuid().optional().nullable(), // Explicit billing ID from UI
  pricingSnapshot: z
    .object({
      finalPricePence: z.number().int().nonnegative(),
      currency: z.string().optional(),
      breakdown: z.any().optional(),
      routeData: z
        .object({
          distance: z.number().nullable(),
          duration: z.number().nullable(),
          isCalculated: z.boolean(),
        })
        .optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
      error: sessionErr,
    } = await supabase.auth.getSession();

    if (sessionErr || !session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { tripConfiguration, bookingType, pricingSnapshot } = parsed.data;
    const requestedBillingEntityId = parsed.data.billingEntityId; // Rename to avoid redeclaration

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const user = session.user;

    // CUSTOMER WITH ORGANIZATION
    let customer, organizationId;
    try {
      const result = await createCustomerWithOrganization(user.id, {
        email: user.email ?? 'unknown@example.com',
        first_name: user.user_metadata?.first_name || 'Guest',
        last_name: user.user_metadata?.last_name || '',
      });
      customer = result.customer;
      organizationId = result.organizationId;
    } catch (customerErr) {
      const errorMessage = customerErr instanceof Error ? customerErr.message : String(customerErr);
      return NextResponse.json(
        { success: false, error: 'Failed to upsert customer', details: errorMessage },
        { status: 500 }
      );
    }

    // 5️⃣ Fetch billing profile (explicit or fallback to default)

    let finalBillingEntityId: string | null = null;
    let finalBillingSnapshot: BillingSnapshot | null = null;

    try {
      const selectedBilling = await fetchBillingForBooking(
        supabaseAdmin,
        customer.id,
        organizationId,
        requestedBillingEntityId
      );
      finalBillingEntityId = selectedBilling.billingEntityId;
      finalBillingSnapshot = selectedBilling.billingSnapshot;
    } catch (billingErr) {
      const errorMessage = billingErr instanceof Error ? billingErr.message : String(billingErr);

      // If explicit billing ID was provided but is invalid, fail the booking (400)
      if (requestedBillingEntityId) {
        return NextResponse.json(
          { error: 'Invalid billing profile', debug: errorMessage },
          { status: 400 }
        );
      }

      // If no explicit ID, check if it's a real infrastructure error vs just "no default"
      if (errorMessage.includes('Failed to fetch')) {
        // Real infrastructure error - return 500
        console.error('[BOOKING_CREATE] Billing infrastructure error:', errorMessage);
        return NextResponse.json(
          { error: 'Billing service error', debug: errorMessage },
          { status: 500 }
        );
      }

      // Otherwise it's just "no default profile" - continue without billing
      console.warn('[BOOKING_CREATE] No default billing profile, continuing without billing');
    }

    const p_booking = buildBookingPayload({
      customerId: customer.id,
      organizationId: organizationId,
      bookingType,
      tripConfiguration,
      billingEntityId: finalBillingEntityId,
      billingSnapshot: finalBillingSnapshot,
      currency: pricingSnapshot?.currency ?? 'GBP',
    });

    const p_legs = buildLegsPayload(
      pricingSnapshot?.routeData
        ? {
            bookingType,
            tripConfiguration,
            pricingState: { routeData: pricingSnapshot.routeData },
          }
        : {
            bookingType,
            tripConfiguration,
          }
    );

    const { data: bookingId, error: rpcErr } = await supabaseAdmin.rpc('create_booking_with_legs', {
      p_booking,
      p_legs,
    });

    if (rpcErr || !bookingId) {
      return NextResponse.json(
        { success: false, error: 'Failed to create booking in database', bookingError: rpcErr },
        { status: 500 }
      );
    }

    // ===========================
    // FLEET VEHICLE REQUESTS & JOBS
    // ===========================

    if (bookingType === 'fleet') {
      const fleetVehicles = tripConfiguration.fleetSelection?.vehicles ?? [];

      if (fleetVehicles.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Fleet vehicles missing' },
          { status: 400 }
        );
      }

      // Insert requests
      const requestsPayload = fleetVehicles.map((v: any) => ({
        booking_id: bookingId,
        vehicle_category_id: v?.category?.id,
        vehicle_model_id: v?.model?.id ?? null,
        quantity: Number(v?.quantity ?? 0),
      }));

      if (requestsPayload.some((r: any) => !r.vehicle_category_id || !r.quantity || r.quantity <= 0)) {
        return NextResponse.json(
          { success: false, error: 'Invalid fleet vehicles payload' },
          { status: 400 }
        );
      }

      const { data: insertedRequests, error: reqErr } = await supabaseAdmin
        .from('booking_vehicle_requests')
        .insert(requestsPayload)
        .select('id, quantity');

      if (reqErr || !insertedRequests) {
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to create fleet vehicle requests',
            details: reqErr?.message,
          },
          { status: 500 }
        );
      }

      // Find leg #1
      const { data: leg1, error: legErr } = await supabaseAdmin
        .from('booking_legs')
        .select('id')
        .eq('booking_id', bookingId)
        .eq('leg_number', 1)
        .maybeSingle();

      if (legErr || !leg1?.id) {
        return NextResponse.json(
          { success: false, error: 'Failed to load leg #1', details: legErr?.message },
          { status: 500 }
        );
      }

      // Create jobs (explode quantity)
      let jobNumber = 1;
      const jobsPayload: any[] = [];

      for (const r of insertedRequests) {
        for (let i = 0; i < (r.quantity ?? 0); i++) {
          jobsPayload.push({
            booking_id: bookingId,
            booking_leg_id: leg1.id,
            vehicle_request_id: r.id,
            job_number: jobNumber++,
            status: 'NEW',
          });
        }
      }

      const { error: jobsErr } = await supabaseAdmin.from('booking_jobs').insert(jobsPayload);

      if (jobsErr) {
        return NextResponse.json(
          { success: false, error: 'Failed to create fleet jobs', details: jobsErr.message },
          { status: 500 }
        );
      }
    }

    // ===========================
    // PRICING + QUOTE SNAPSHOT
    // ===========================

    let finalAmountPence = pricingSnapshot?.finalPricePence ?? 0;

    // Safe vehicle category code for service packages (fleet vs single vehicle)
    const vehicleCategoryCode =
      bookingType === 'fleet'
        ? tripConfiguration.fleetSelection?.vehicles?.[0]?.category?.id
        : tripConfiguration.selectedVehicle?.category?.id;

    if (tripConfiguration.servicePackages && vehicleCategoryCode) {
      try {
        // Query leg #1 for client_leg_quotes.booking_leg_id (NOT NULL constraint)
        const { data: leg1, error: legErr } = await supabaseAdmin
          .from('booking_legs')
          .select('id')
          .eq('booking_id', bookingId)
          .eq('leg_number', 1)
          .maybeSingle();

        if (legErr || !leg1?.id) {
          console.error('[BOOKING_CREATE] Failed to load leg #1 for quotes:', legErr);
          throw new Error(`Leg #1 not found: ${legErr?.message || 'unknown'}`);
        }

        const resolved = resolveBookingServices({
          servicePackages: tripConfiguration.servicePackages,
          vehicleCategoryCode,
        });

        if (resolved.ok && resolved.services.length > 0) {
          const allCodes = resolved.services.map(s => s.code);
          const complimentarySet = new Set(
            resolved.services.filter(s => s.isComplimentary).map(s => s.code)
          );
          const configurations = new Map(
            resolved.services.filter(s => s.configuration).map(s => [s.code, s.configuration!])
          );

          const quoteLineItems = await buildQuoteLineItems(
            allCodes,
            complimentarySet,
            configurations
          );

          const servicesSubtotal = calculateQuoteTotal(quoteLineItems);

          const vatRate = 0.2;
          const vatPence = Math.round(servicesSubtotal * vatRate);
          const totalPence = servicesSubtotal + vatPence;

          await supabaseAdmin.from('client_leg_quotes').insert({
            booking_id: bookingId,
            booking_leg_id: leg1.id,
            organization_id: organizationId,
            version: 1,
            currency: 'GBP',
            subtotal_pence: servicesSubtotal,
            discount_pence: 0,
            vat_rate: vatRate,
            vat_pence: vatPence,
            total_pence: totalPence,
            line_items: quoteLineItems,
            calc_source: 'server',
            calc_version: 'pricing_v1',
            calculated_at: new Date().toISOString(),
          });

          finalAmountPence += totalPence;
        }
      } catch (err) {
        console.error('[BOOKING_CREATE] Pricing failed:', err);
      }
    }

    const { data: created } = await supabaseAdmin
      .from('bookings')
      .select('id, reference, currency')
      .eq('id', bookingId)
      .single();

    return NextResponse.json({
      success: true,
      bookingId,
      reference: created?.reference ?? null,
      amount_total_pence: finalAmountPence,
      currency: created?.currency ?? 'GBP',
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { success: false, error: 'Internal server error', debug: msg },
      { status: 500 }
    );
  }
}

// GET handler - Multi-tenant safe
export async function GET(_req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
      error: sessionErr,
    } = await supabase.auth.getSession();

    if (sessionErr || !session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = session.user;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Resolve customer and organization context (multi-tenant safe)
    const { customer, organizationId } = await createCustomerWithOrganization(user.id, {
      email: user.email || '',
      first_name: user.user_metadata?.first_name,
      last_name: user.user_metadata?.last_name,
    });

    if (!customer?.id || !organizationId) {
      return NextResponse.json({ bookings: [] });
    }

    // Get bookings filtered by BOTH customer_id AND organization_id (multi-tenant defense)
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select(
        `
        id,
        reference,
        customer_id,
        organization_id,
        status,
        booking_type,
        created_at
      `
      )
      .eq('customer_id', customer.id)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      return NextResponse.json(
        { error: 'Failed to fetch bookings', details: bookingsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookings: bookings || [] });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Internal server error', debug: msg }, { status: 500 });
  }
}
