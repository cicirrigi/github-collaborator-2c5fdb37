# 🚀 FEATURES DIRECTORY

Each folder in `/features` represents a self-contained module:

- **`booking/`** → Complete booking workflow and management
- **`account/`** → User account, profile, and settings
- **`auth/`** → Authentication, login, signup flows
- **`payments/`** → Payment processing and billing
- **`members/`** → Membership tiers and benefits
- **`corporate/`** → Corporate client features
- **`landing/`** → Landing page components
- **`search/`** → Search and filtering functionality

## 📂 Structure Inside Each Feature

```
feature-name/
├── components/     # UI pieces specific to the feature
├── hooks/          # Custom hooks for logic/state
├── types.ts        # Local TypeScript types
├── constants.ts    # Feature-specific constants
└── index.ts        # Central export
```

### **Example: Booking Feature**

```
booking/
├── components/
│   ├── BookingStatusCard.tsx
│   ├── JourneyDetailsCard.tsx
│   └── ContactDetailsCard.tsx
├── steps/
│   ├── Step1_Trip.tsx
│   ├── Step2_Vehicle.tsx
│   ├── Step3_Options.tsx
│   ├── Step4_Contact.tsx
│   └── Step5_Review.tsx
├── modals/
│   ├── BookingDetailsModal.tsx
│   └── QuickBookingModal.tsx
├── hooks/
│   ├── useBooking.ts
│   ├── useBookingSteps.ts
│   └── useBookingValidation.ts
├── types.ts        # BookingType, StepType, etc.
├── constants.ts    # BOOKING_STEPS, DEFAULT_OPTIONS
└── index.ts        # Export all components
```

## 🎯 Feature Development Rules

### **1. Self-Contained Modules**

- Each feature should work independently
- Should be extractable without breaking other features
- Can be developed by separate team members

### **2. Import Rules**

```typescript
// ✅ Features CAN import from:
import { Button } from '@/components/ui/button';
import { PricingCard } from '@/components/shared/PricingCard';
import { useDebounce } from '@/lib/hooks/useDebounce';
import type { UserType } from '@/types/user';

// ❌ Features CANNOT import from other features:
import { PaymentModal } from '@/components/features/payments'; // ❌
```

### **3. State Management**

- Use React Context for feature-wide state
- Custom hooks for reusable logic
- Keep state close to where it's used

### **4. API Integration**

```typescript
// Use services from /lib/ or /server/
import { bookingService } from '@/server/services/booking';

// Don't call APIs directly in components
const { data } = await supabase.from('bookings'); // ❌
```

## 🆕 Creating a New Feature

### **1. Create Feature Directory**

```bash
mkdir -p src/features/new-feature/{components,hooks}
```

### **2. Define Types**

```typescript
// src/features/new-feature/types.ts
export interface NewFeatureType {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface NewFeatureFormData {
  name: string;
  description: string;
}
```

### **3. Create Constants**

```typescript
// src/features/new-feature/constants.ts
export const NEW_FEATURE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const DEFAULT_FORM_VALUES = {
  name: '',
  description: '',
};
```

### **4. Build Components**

```typescript
// src/features/new-feature/components/NewFeatureCard.tsx
import { Card } from '@/components/ui/card'
import type { NewFeatureType } from '../types'

interface NewFeatureCardProps {
  feature: NewFeatureType
}

export function NewFeatureCard({ feature }: NewFeatureCardProps) {
  return (
    <Card>
      <h3>{feature.name}</h3>
      <p>Status: {feature.status}</p>
    </Card>
  )
}
```

### **5. Create Custom Hooks**

```typescript
// src/features/new-feature/hooks/useNewFeature.ts
import { useState } from 'react';
import type { NewFeatureType } from '../types';

export function useNewFeature() {
  const [features, setFeatures] = useState<NewFeatureType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addFeature = (feature: NewFeatureType) => {
    setFeatures(prev => [...prev, feature]);
  };

  return {
    features,
    isLoading,
    addFeature,
  };
}
```

### **6. Export Everything**

```typescript
// src/features/new-feature/index.ts
export { NewFeatureCard } from './components/NewFeatureCard';
export { useNewFeature } from './hooks/useNewFeature';
export type { NewFeatureType, NewFeatureFormData } from './types';
export { NEW_FEATURE_STATUS, DEFAULT_FORM_VALUES } from './constants';
```

## 📱 Complex Features

For complex features like booking, consider adding:

- **`/providers/`** → React Context for feature state
- **`/utils/`** → Feature-specific utility functions
- **`/services/`** → API integration layer
- **`README.md`** → Feature-specific documentation

## 🔄 Feature Communication

Features should communicate through:

1. **Shared Context** (from `/providers/`)
2. **URL Parameters** (for navigation)
3. **Event System** (custom hooks)
4. **Global State** (if absolutely necessary)

Avoid direct imports between features to maintain modularity.
