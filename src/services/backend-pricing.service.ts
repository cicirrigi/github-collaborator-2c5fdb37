// 🆕 BACKEND PRICING SERVICE - Integration with new backend
// This service runs in PARALLEL with the old render-pricing.service.ts
// We keep both until we confirm the new backend works correctly

import type {
  QuoteRequest,
  QuoteResponse,
  BookingConversionResponse,
  PaymentIntentResponse,
} from '@/types/backend-integration.types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3003';

export class BackendPricingService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_URL;
    console.log('🔗 Backend Pricing Service initialized with URL:', this.baseUrl);
  }

  /**
   * Calculate pricing and create quote in backend
   */
  async calculateAndQuote(params: QuoteRequest): Promise<QuoteResponse> {
    console.log('📊 Calling calculate-and-quote with params:', params);
    console.log('📊 Distance being sent:', params.distance, 'miles');

    try {
      const response = await fetch(`${this.baseUrl}/api/pricing/calculate-and-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Backend error:', errorData);
        console.error('❌ HTTP Status:', response.status);
        console.error('❌ Validation errors:', errorData.details);
        console.error('❌ Request params:', params);
        throw new Error(
          errorData.error || errorData.message || `Quote calculation failed: ${response.status}`
        );
      }

      const result = await response.json();
      console.log('✅ Quote created successfully:', result);
      console.log('💰 Backend finalPrice:', result?.data?.pricing?.finalPrice);

      // Backend returns {success: true, data: {...}} - extract data
      if (result.success && result.data) {
        console.log('💰 Returning finalPrice:', result.data.pricing.finalPrice);
        return result.data;
      }

      // Fallback if response structure is different
      return result;
    } catch (error) {
      console.error('❌ Calculate and quote failed:', error);
      throw error;
    }
  }

  /**
   * Convert quote to booking
   */
  async convertQuoteToBooking(
    quoteId: string,
    customerData: {
      customerId?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
    }
  ): Promise<BookingConversionResponse> {
    console.log('🔄 Converting quote to booking:', { quoteId, customerData });

    try {
      const response = await fetch(`${this.baseUrl}/api/pricing/convert-quote-to-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quoteId, customerData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Booking conversion error - FULL RESPONSE:', errorData);
        console.error('❌ HTTP Status:', response.status);
        console.error('❌ Error message:', errorData.error || errorData.message);
        console.error('❌ Validation errors:', errorData.details);
        console.error('❌ Request data:', { quoteId, customerData });
        throw new Error(
          errorData.error || errorData.message || `Booking conversion failed: ${response.status}`
        );
      }

      const result = await response.json();
      console.log('✅ Booking created from quote:', result);

      // Backend returns {success: true, data: {...}} - extract data
      if (result.success && result.data) {
        return result.data;
      }

      return result;
    } catch (error) {
      console.error('❌ Convert quote to booking failed:', error);
      throw error;
    }
  }

  /**
   * Create payment intent for booking
   */
  async createPaymentIntent(
    bookingId: string,
    options?: {
      quoteId?: string;
      customerData?: {
        customerId: string;
        email: string;
      };
      idempotencyKey?: string;
    }
  ): Promise<PaymentIntentResponse> {
    console.log('💳 Creating payment intent for booking:', { bookingId, options });

    try {
      const response = await fetch(`${this.baseUrl}/api/pricing/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(options?.idempotencyKey && { 'Idempotency-Key': options.idempotencyKey }),
        },
        body: JSON.stringify({
          bookingId,
          ...(options?.quoteId && { quoteId: options.quoteId }),
          ...(options?.customerData && { customerData: options.customerData }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Payment intent FULL backend error:', errorData);
        console.error('❌ Payment intent HTTP status:', response.status);
        console.error('❌ Request payload:', { bookingId, quoteId: options?.quoteId });
        throw new Error(
          errorData.error ||
            errorData.message ||
            errorData.details ||
            `Payment intent creation failed: ${response.status}`
        );
      }

      const result = await response.json();
      console.log('✅ Payment intent created:', result);

      // Backend returns {success: true, data: {...}} - extract data
      if (result.success && result.data) {
        return result.data;
      }

      return result;
    } catch (error) {
      console.error('❌ Create payment intent failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const backendPricingService = new BackendPricingService();
