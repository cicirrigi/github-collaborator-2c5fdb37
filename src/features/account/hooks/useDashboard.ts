/**
 * 📊 useDashboard Hook
 *
 * Fetch customer dashboard data from customer_dashboard_v1 view
 * Includes loyalty tier, bookings stats, spending, and preferences
 */

import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import type { LoyaltyTier } from '../types/account.types';

export interface DashboardData {
  customer_id: string;
  auth_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  profile_photo_url: string | null;
  member_since: string;
  is_active: boolean;

  // Statistics
  total_bookings: number;
  completed_rides: number;
  upcoming_rides: number;
  pending_payment_count: number;
  cancelled_rides: number;

  // Financial
  total_spent_pence: number;
  total_spent_pounds: number;

  // Loyalty
  loyalty_tier: LoyaltyTier;

  // Activity
  last_booking_date: string | null;
  last_completed_ride_date: string | null;

  // Preferences
  temperature_preference: string | null;
  music_preference: string | null;
  communication_style: string | null;
  pet_friendly_default: boolean | null;
}

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data: user } = await supabase.auth.getUser();

      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('customer_dashboard_v1')
        .select('*')
        .eq('auth_user_id', user.user.id)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setDashboard(data as DashboardData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
}
