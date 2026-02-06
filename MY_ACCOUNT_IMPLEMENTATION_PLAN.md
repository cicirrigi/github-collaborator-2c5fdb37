# MY ACCOUNT - PLAN DE IMPLEMENTARE COMPLET

**Vantage Lane 2.0 - User Account Dashboard**

---

## 📊 SITUAȚIA ACTUALĂ (DATABASE SCHEMA)

### ✅ CE AVEM DEJA - INFRASTRUCTURĂ DB (95% COMPLET)

#### 🔐 AUTH SYSTEM (FUNCȚIONAL)

```sql
-- auth.users (37 utilizatori activi, RLS activat)
- id (uuid, PK)
- email (varchar)
- phone (text, unique)
- raw_user_meta_data (jsonb) -- first_name, last_name, marketing_consent
- raw_app_meta_data (jsonb)  -- roles, permissions
- email_confirmed_at, phone_confirmed_at
- created_at, updated_at, last_sign_in_at
```

#### 👤 CUSTOMER TABLES (STRUCTURĂ MODULARĂ)

**1. `customers` (2 rânduri, RLS activat)**

```sql
- id (uuid, PK)
- auth_user_id (uuid, FK → auth.users.id) ⚡ LEGĂTURA PRINCIPALĂ
- email (varchar)
- phone (varchar)
- status (varchar, default: 'active')
- operator_id (uuid)
- created_at, updated_at
- full_name (computed din customer_metadata.name)
```

**2. `customer_preferences` (1 rând, RLS activat)**

```sql
- customer_id (uuid, FK → customers.id)
- preferred_language (varchar, default: 'en')
- notification_settings (jsonb, default: '{}')
- ride_preferences (jsonb, default: '{}')
- accessibility_needs (jsonb, default: '{}')
- two_factor_enabled (boolean, default: false)
- login_notifications (boolean, default: true)
- created_at, updated_at
```

**3. `customer_metadata` (1 rând, RLS activat)**

```sql
- customer_id (uuid, FK → customers.id)
- name (varchar)
- avatar_url (text) ✅ AVATAR SUPPORT
- date_of_birth (date)
- addresses (jsonb, default: '[]') ✅ MULTIPLE ADDRESSES
- emergency_contact (jsonb)
- emergency_contacts (jsonb, default: '[]') ✅ MULTIPLE CONTACTS
- medical_info (jsonb)
- loyalty_tier (varchar) ✅ LOYALTY PROGRAM: bronze, silver, gold, platinum
- member_since (timestamptz)
- total_rides (integer, default: 0) ✅ STATISTICS
- total_spent (numeric, default: 0) ✅ STATISTICS
- deleted_at (timestamptz) ✅ SOFT DELETE
- created_at, updated_at
```

#### 📋 BOOKING SYSTEM (PENTRU ISTORIC)

```sql
-- bookings (RLS activat)
- id, customer_id (FK), operator_id
- trip_type, category, start_at
- passenger_count, bag_count
- status, booking_status
- vehicle_model, flight_number
- total_cost, currency
- created_at, updated_at

-- booking_legs (pentru detalii călători)
-- billing (pentru facturare)
-- reviews (pentru feedback)
```

---

## ❌ CE LIPSEȘTE (5% - IMPLEMENTARE NECESARĂ)

### 🔧 1. API ENDPOINTS (0% implementat)

```typescript
❌ GET  /api/user/profile           // Get complete profile
❌ PUT  /api/user/profile           // Update profile info
❌ POST /api/user/avatar            // Upload avatar image
❌ PUT  /api/user/preferences       // Update preferences
❌ GET  /api/user/booking-history   // Get booking history with pagination
❌ PUT  /api/user/password          // Change password (Supabase Auth)
❌ POST /api/user/addresses         // Add/update addresses
❌ PUT  /api/user/emergency-contact // Update emergency contacts
```

### 🎨 2. FRONTEND COMPONENTS (0% implementat)

```typescript
❌ /src/features/account/           // Account management feature
❌ /src/app/account/                // Account pages
❌ ProfileForm component            // Edit profile form
❌ AvatarUpload component           // Avatar upload with preview
❌ PreferencesSettings component    // Notifications, language, etc.
❌ PasswordChangeForm component     // Change password form
❌ BookingHistoryList component     // Booking history with filters
❌ AddressManager component         // Manage saved addresses
❌ EmergencyContactForm component   // Emergency contacts
❌ AccountSidebar component         // Navigation sidebar
```

### 📁 3. FILE STORAGE SETUP (0% implementat)

```sql
-- Supabase Storage
❌ Create 'avatars' bucket
❌ Setup RLS policies for avatars
❌ Image upload & resize logic
❌ File validation & security
```

---

## 🔄 DATABASE POPULATION STRATEGY

### PROBLEMA: SINCRONIZAREA AUTH.USERS ↔ CUSTOMER TABLES

**Situația actuală:**

- `auth.users` = 37 utilizatori
- `customers` = 2 rânduri
- `customer_preferences` = 1 rând
- `customer_metadata` = 1 rând

**⚠️ LIPSESC 35 de customer records pentru utilizatorii existenți!**

### 📋 SOLUȚIA: DATABASE SYNC MECHANISM

#### OPȚIUNEA 1: Trigger automat la signup

```sql
-- Database trigger pentru crearea automată customer records
CREATE OR REPLACE FUNCTION create_customer_profile()
RETURNS trigger AS $$
BEGIN
  -- Insert în customers
  INSERT INTO customers (auth_user_id, email, phone, operator_id)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    (SELECT id FROM organizations WHERE is_default = true LIMIT 1)
  );

  -- Insert în customer_preferences (defaults)
  INSERT INTO customer_preferences (customer_id)
  VALUES ((SELECT id FROM customers WHERE auth_user_id = NEW.id));

  -- Insert în customer_metadata cu date din signup
  INSERT INTO customer_metadata (
    customer_id,
    name,
    member_since
  ) VALUES (
    (SELECT id FROM customers WHERE auth_user_id = NEW.id),
    CONCAT(NEW.raw_user_meta_data->>'first_name', ' ', NEW.raw_user_meta_data->>'last_name'),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger
CREATE TRIGGER create_customer_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_customer_profile();
```

#### OPȚIUNEA 2: Migration script pentru utilizatori existenți

```sql
-- Script pentru popularea retroactivă
INSERT INTO customers (auth_user_id, email, phone, operator_id, created_at)
SELECT
  u.id,
  u.email,
  u.phone,
  (SELECT id FROM organizations WHERE is_default = true LIMIT 1),
  u.created_at
FROM auth.users u
WHERE u.id NOT IN (SELECT auth_user_id FROM customers WHERE auth_user_id IS NOT NULL);

-- Populare customer_preferences
INSERT INTO customer_preferences (customer_id, created_at)
SELECT c.id, c.created_at
FROM customers c
WHERE c.id NOT IN (SELECT customer_id FROM customer_preferences);

-- Populare customer_metadata
INSERT INTO customer_metadata (customer_id, name, member_since, created_at)
SELECT
  c.id,
  CASE
    WHEN u.raw_user_meta_data->>'first_name' IS NOT NULL
    THEN CONCAT(u.raw_user_meta_data->>'first_name', ' ', u.raw_user_meta_data->>'last_name')
    ELSE u.email
  END,
  c.created_at,
  c.created_at
FROM customers c
JOIN auth.users u ON u.id = c.auth_user_id
WHERE c.id NOT IN (SELECT customer_id FROM customer_metadata);
```

---

## 🚀 PLANUL DE IMPLEMENTARE

### PRIORITATEA 1: DATABASE SYNC (URGENT)

**Status:** 🔴 Critic - 35 utilizatori fără customer records

1. **Rulează migration script** pentru utilizatori existenți
2. **Implementează trigger** pentru utilizatori noi
3. **Testează sincronizarea** cu cont de test

### PRIORITATEA 2: PROFILE API ENDPOINTS (CORE)

**Status:** 🟡 Necesar pentru funcționalitate de bază

1. **GET /api/user/profile** - Citire profil complet
2. **PUT /api/user/profile** - Update profil
3. **POST /api/user/avatar** - Upload avatar
4. **PUT /api/user/preferences** - Update preferințe

### PRIORITATEA 3: FRONTEND MY ACCOUNT (UI/UX)

**Status:** 🟡 Interfața utilizator

1. **Account Layout** cu sidebar navigation
2. **Profile Form** pentru editare date
3. **Avatar Upload** cu preview
4. **Settings Panel** pentru preferințe

### PRIORITATEA 4: BOOKING HISTORY (EXTENDED)

**Status:** 🟢 Nice-to-have, nu urgent

1. **GET /api/user/booking-history** cu paginare
2. **BookingHistoryList** component
3. **Booking details** modal
4. **Export/download** receipts

### PRIORITATEA 5: ADVANCED FEATURES (LUXURY)

**Status:** 🟢 Future sprints

1. **Loyalty program** dashboard
2. **Statistics & analytics**
3. **Emergency contacts** management
4. **Saved addresses** management

---

## 🎯 DECISION POINT - CU CE ÎNCEPEM?

### OPȚIUNEA A: DATABASE-FIRST APPROACH

1. ✅ Fix database sync (migration + trigger)
2. ✅ Implementare Profile API endpoints
3. ✅ Frontend pentru profile management
4. ✅ Booking history integration

### OPȚIUNEA B: MVP-FIRST APPROACH

1. ✅ Database sync + Profile API
2. ✅ Minimal frontend (edit name, email, phone)
3. ✅ Avatar upload
4. ✅ Extend gradual cu features

### OPȚIUNEA C: FULL-FEATURE APPROACH

1. ✅ Database sync complet
2. ✅ Toate API endpoints
3. ✅ Frontend complet cu toate features
4. ✅ Lansare cu everything

---

## 📂 STRUCTURA FIȘIERELOR PROPUSĂ

```
src/
├── features/account/
│   ├── components/
│   │   ├── ProfileForm.tsx
│   │   ├── AvatarUpload.tsx
│   │   ├── PreferencesSettings.tsx
│   │   ├── PasswordChangeForm.tsx
│   │   ├── BookingHistoryList.tsx
│   │   └── AccountSidebar.tsx
│   ├── hooks/
│   │   ├── useProfile.ts
│   │   ├── useBookingHistory.ts
│   │   └── useAvatarUpload.ts
│   ├── services/
│   │   ├── profileService.ts
│   │   └── bookingHistoryService.ts
│   └── types/
│       └── account.types.ts
├── app/
│   └── account/
│       ├── page.tsx              // Dashboard overview
│       ├── profile/page.tsx      // Edit profile
│       ├── settings/page.tsx     // Preferences & settings
│       ├── bookings/page.tsx     // Booking history
│       └── layout.tsx            // Account layout cu sidebar
└── app/api/user/
    ├── profile/route.ts          // Profile CRUD
    ├── avatar/route.ts           // Avatar upload
    ├── preferences/route.ts      // Preferences
    ├── password/route.ts         // Password change
    └── booking-history/route.ts  // Booking history
```

---

## ❓ ÎNTREBĂRI PENTRU DECIZIE

1. **Cu ce prioritate începem?** Database sync → API → Frontend?
2. **Approach-ul preferat?** MVP minimal sau full-feature?
3. **Avatar storage?** Supabase Storage sau external service?
4. **Booking management?** Doar istoric sau și modify/cancel?
5. **Timeline?** Când vrem să fie gata MVP-ul?

---

**STATUS:** 📋 Plan complet - Waiting for direction
**NEXT STEP:** 🎯 Choose implementation approach și start cu database sync
