// TEMPORARY DEBUG FILE - to check generated TypeScript types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          organization_id: string | null;
          auth_user_id: string | null;
          trip_type: string | null;
          category: string | null;
          booking_source: string | null; // THIS SHOULD EXIST
          status: string | null;
          booking_status: string | null;
          payment_status: string | null;
          created_at: string | null;
          updated_at: string | null;
          reference: string | null;
          start_at: string | null;
          passenger_count: number | null;
          bag_count: number | null;
          currency: string | null;
          flight_number: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          customer_id: string;
          organization_id?: string | null;
          auth_user_id?: string | null;
          trip_type?: string | null;
          category?: string | null;
          booking_source?: string | null; // THIS SHOULD EXIST
          status?: string | null;
          booking_status?: string | null;
          payment_status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          reference?: string | null;
          start_at?: string | null;
          passenger_count?: number | null;
          bag_count?: number | null;
          currency?: string | null;
          flight_number?: string | null;
          notes?: string | null;
        };
        Update: { // same as Insert but all optional };
        Relationships: [];
      };
    };
  };
};
