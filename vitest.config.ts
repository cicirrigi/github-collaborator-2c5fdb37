import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.ts'],
    env: {
      // Load environment variables for integration tests
      NEXT_PUBLIC_SUPABASE_URL: 'https://fmeonuvmlopkutbjejlo.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZW9udXZtbG9wa3V0YmplamxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDUxMjgsImV4cCI6MjA3NTc4MTEyOH0.F-tnfRXp-8TyMa56uRjdCwvbY1bSVVVO2IcMrN-3OC4',
      NEXT_PUBLIC_APP_URL: 'https://vantage-lane.com',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
