/**
 * 💳 Step 4 Types - Payment
 * Detalii plată și facturare
 */

// Payment - Pasul 4
export interface PaymentDetails {
  method: 'card' | 'paypal' | 'bank_transfer';
  cardToken?: string; // Stripe token
  billingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
}
