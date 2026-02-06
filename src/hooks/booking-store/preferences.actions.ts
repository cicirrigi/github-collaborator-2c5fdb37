// 🟩 TRIP PREFERENCES ACTIONS - Step 2 Universal Preferences (ALL classes)
import type { BookingState, ServicePackages } from '../useBookingState/booking.types';

export const createPreferencesActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  _get: () => BookingState
) => ({
  // 🎵 SET MUSIC PREFERENCE
  setMusicPreference: (music: ServicePackages['tripPreferences']['music']) => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        servicePackages: {
          ...state.tripConfiguration.servicePackages,
          tripPreferences: {
            ...state.tripConfiguration.servicePackages.tripPreferences,
            music,
          },
        },
      },
    }));
  },

  // 🌡️ SET TEMPERATURE PREFERENCE
  setTemperaturePreference: (temperature: ServicePackages['tripPreferences']['temperature']) => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        servicePackages: {
          ...state.tripConfiguration.servicePackages,
          tripPreferences: {
            ...state.tripConfiguration.servicePackages.tripPreferences,
            temperature,
          },
        },
      },
    }));
  },

  // 🗣️ SET COMMUNICATION STYLE
  setCommunicationStyle: (communication: ServicePackages['tripPreferences']['communication']) => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        servicePackages: {
          ...state.tripConfiguration.servicePackages,
          tripPreferences: {
            ...state.tripConfiguration.servicePackages.tripPreferences,
            communication,
          },
        },
      },
    }));
  },

  // 🔄 RESET ALL PREFERENCES TO DEFAULTS
  resetTripPreferences: () => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        servicePackages: {
          ...state.tripConfiguration.servicePackages,
          tripPreferences: {
            music: 'no-preference',
            temperature: 'comfortable',
            communication: 'professional',
          },
        },
      },
    }));
  },
});

// 🔧 TYPE DEFINITION
export interface PreferencesActions {
  setMusicPreference: (music: ServicePackages['tripPreferences']['music']) => void;
  setTemperaturePreference: (
    temperature: ServicePackages['tripPreferences']['temperature']
  ) => void;
  setCommunicationStyle: (
    communication: ServicePackages['tripPreferences']['communication']
  ) => void;
  resetTripPreferences: () => void;
}
