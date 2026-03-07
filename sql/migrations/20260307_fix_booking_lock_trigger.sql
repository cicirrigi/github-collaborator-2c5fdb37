-- Fix: Allow legitimate payment confirmation transitions in booking lock trigger
-- Wave 1B: Unblock PENDING_PAYMENT -> CONFIRMED after payment succeeds
-- 
-- ROOT CAUSE: Trigger block_booking_updates_when_locked() was blocking the legitimate
-- transition from PENDING_PAYMENT to CONFIRMED after payment_intent.succeeded webhook
-- updated booking_payments.status to 'succeeded'. At that point, booking_is_paid(old.id)
-- becomes true, triggering the lock protection even though the status transition is valid.
--
-- FIX: Allow specific legitimate transitions BEFORE checking the lock condition.

CREATE OR REPLACE FUNCTION public.block_booking_updates_when_locked()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Best-effort bypass for trusted backend/service-role flows
  IF public.is_service_role() THEN
    RETURN NEW;
  END IF;

  -- Allow legitimate payment confirmation after webhook/RPC marks payment as succeeded.
  -- At this point booking_is_paid(OLD.id) may already be true, so this allowlist
  -- must run BEFORE the generic lock check.
  IF OLD.status = 'PENDING_PAYMENT'::public.booking_status
     AND NEW.status = 'CONFIRMED'::public.booking_status THEN
    RETURN NEW;
  END IF;

  -- Allow successful retry after a previous failed payment.
  IF OLD.status = 'PAYMENT_FAILED'::public.booking_status
     AND NEW.status = 'CONFIRMED'::public.booking_status THEN
    RETURN NEW;
  END IF;

  -- Block all other updates once booking is paid or operationally locked.
  IF public.booking_is_paid(OLD.id)
     OR OLD.status IN (
       'CONFIRMED'::public.booking_status,
       'IN_PROGRESS'::public.booking_status,
       'COMPLETED'::public.booking_status
     )
  THEN
    RAISE EXCEPTION 'Booking is locked (paid/confirmed). Updates are not allowed.';
  END IF;

  RETURN NEW;
END;
$function$;
