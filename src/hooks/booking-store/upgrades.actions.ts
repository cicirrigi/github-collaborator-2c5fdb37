// 🟥 PAID UPGRADES ACTIONS - Step 2 Premium Paid Services (ALL classes)
import type { BookingState, ServicePackages } from '../useBookingState/booking.types';

// 💰 UPGRADE PRICING (in GBP)
const UPGRADE_PRICES = {
  flowers: {
    standard: 120,
    exclusive: 250,
  },
  champagne: {
    moet: 120,
    'dom-perignon': 350,
  },
  securityEscort: 750,
};

export const createUpgradesActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  get: () => BookingState
) => ({
  // 🌹 SET FLOWERS UPGRADE
  setFlowersUpgrade: (flowers: ServicePackages['paidUpgrades']['flowers']) => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        servicePackages: {
          ...state.tripConfiguration.servicePackages,
          paidUpgrades: {
            ...state.tripConfiguration.servicePackages.paidUpgrades,
            flowers,
          },
        },
      },
    }));
  },

  // 🍾 SET CHAMPAGNE UPGRADE
  setChampagneUpgrade: (champagne: ServicePackages['paidUpgrades']['champagne']) => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        servicePackages: {
          ...state.tripConfiguration.servicePackages,
          paidUpgrades: {
            ...state.tripConfiguration.servicePackages.paidUpgrades,
            champagne,
          },
        },
      },
    }));
  },

  // 🛡️ TOGGLE SECURITY ESCORT
  toggleSecurityEscort: () => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        servicePackages: {
          ...state.tripConfiguration.servicePackages,
          paidUpgrades: {
            ...state.tripConfiguration.servicePackages.paidUpgrades,
            securityEscort: !state.tripConfiguration.servicePackages.paidUpgrades.securityEscort,
          },
        },
      },
    }));
  },

  // 💰 CALCULATE TOTAL UPGRADES COST
  calculateUpgradesCost: () => {
    const { tripConfiguration } = get();
    const { paidUpgrades } = tripConfiguration.servicePackages;
    let total = 0;

    // Add flowers cost
    if (paidUpgrades.flowers) {
      total += UPGRADE_PRICES.flowers[paidUpgrades.flowers];
    }

    // Add champagne cost
    if (paidUpgrades.champagne) {
      total += UPGRADE_PRICES.champagne[paidUpgrades.champagne];
    }

    // Add security escort cost
    if (paidUpgrades.securityEscort) {
      total += UPGRADE_PRICES.securityEscort;
    }

    return total;
  },

  // 🔄 CLEAR ALL UPGRADES
  clearAllUpgrades: () => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        servicePackages: {
          ...state.tripConfiguration.servicePackages,
          paidUpgrades: {
            flowers: null,
            champagne: null,
            securityEscort: false,
          },
        },
      },
    }));
  },
});

// 🔧 TYPE DEFINITION
export interface UpgradesActions {
  setFlowersUpgrade: (flowers: ServicePackages['paidUpgrades']['flowers']) => void;
  setChampagneUpgrade: (champagne: ServicePackages['paidUpgrades']['champagne']) => void;
  toggleSecurityEscort: () => void;
  calculateUpgradesCost: () => number;
  clearAllUpgrades: () => void;
}
