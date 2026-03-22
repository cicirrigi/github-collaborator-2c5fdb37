# SERVICE_ITEMS PRE-MIGRATION AUDIT REPORT

## ⚠️ ZERO MODIFICĂRI - DOAR VERIFICĂRI

**Data:** 2026-03-16  
**Status:** AUDIT COMPLET - NU RULA MIGRATION ÎNCĂ

---

## 🔍 FINDINGS CRITICE

### **1. FK CONSTRAINT IDENTIFICAT**

```
✅ booking_line_items.service_item_id → service_items.id (FK)
   Constraint: booking_line_items_service_item_fk
```

**IMPLICAȚIE:**  
Orice rename/delete pe `service_items.id` va **FAIL** dacă există referințe în `booking_line_items`.

---

### **2. 🚨 BOOKING_LINE_ITEMS FOLOSEȘTE ALIASURI - PROBLEM MAJOR!**

**USAGE ACTUAL în production (70 bookings):**

#### **Included Services (kebab-case):**

```
phone-chargers         → 70 usage  ❌ ALIAS (canonic: phone_chargers)
onboard-wifi           → 70 usage  ❌ ALIAS (canonic: onboard_wifi)
meet-greet             → 70 usage  ❌ ALIAS (canonic: meet_greet)
luggage-assistance     → 69 usage  ❌ ALIAS (canonic: luggage_assistance)
airport-wait-time      → 69 usage  ❌ ALIAS (canonic: airport_wait_time)
extra-stops            → 69 usage  ❌ ALIAS (canonic: extra_stops)
pet-friendly           → 69 usage  ❌ ALIAS (canonic: pet_friendly)
priority-support       → 69 usage  ✅ CANONIC (există cu acest ID)
refreshments           → 70 usage  ✅ CANONIC
```

#### **Premium Features (camelCase):**

```
securityEscort         → 30 usage  ❌ ALIAS (canonic: security_escort)
frontSeatRequest       → 28 usage  ❌ ALIAS (canonic: front_seat_request)
personalLuggagePrivacy → 27 usage  ❌ ALIAS (canonic: personal_luggage_privacy)
comfortRideMode        → 22 usage  ❌ ALIAS (canonic: comfort_ride_mode)
paparazziSafeMode      → 18 usage  ❌ ALIAS (canonic: paparazzi_safe_mode)
```

#### **Paid Upgrades (snake_case - CORECT):**

```
flowers_exclusive            → 14 usage  ✅ CANONIC
champagne_dom_perignon_2015  → 14 usage  ✅ CANONIC
champagne_moet               → 12 usage  ✅ CANONIC
flowers_standard             → 11 usage  ✅ CANONIC
```

#### **Trip Preferences (snake_case - CORECT):**

```
music          → 36 usage  ✅ CANONIC
communication  → 34 usage  ✅ CANONIC
temperature    → 32 usage  ✅ CANONIC
```

**TOTAL USAGE:** 21 service_item_id diferite, **13 dintre ele sunt ALIASURI!**

---

### **3. CANONICAL TARGETS - STATUS ACTUAL**

**21 items canonice propuse:**

#### **✅ EXISTS DEJA în DB (10 items):**

```sql
bouquet_exclusive            -- paid_upgrade
bouquet_standard             -- paid_upgrade
champagne_dom_perignon_2015  -- paid_upgrade
champagne_moet               -- paid_upgrade
security_escort              -- paid_upgrade
communication                -- trip_preference
music                        -- trip_preference
temperature                  -- trip_preference
refreshments                 -- included_service
extra_stops                  -- NULL item_group (trebuie setat!)
pet_friendly                 -- NULL item_group (trebuie setat!)
```

#### **❌ MISSING din DB (11 items - trebuie CREATE):**

```sql
airport_wait_time            -- trebuie creat
luggage_assistance           -- trebuie creat
meet_greet                   -- trebuie creat
onboard_wifi                 -- trebuie creat
phone_chargers               -- trebuie creat
priority_support             -- trebuie creat (există priority-support kebab!)
comfort_ride_mode            -- trebuie creat
front_seat_request           -- trebuie creat
paparazzi_safe_mode          -- trebuie creat
personal_luggage_privacy     -- trebuie creat
```

---

### **4. TRIP_CONFIGURATION_RAW - CLEAN**

```
✅ Nu conține referințe la service items
   (selectedServices, premiumFeatures = empty)
```

---

## 📋 LISTA CANONICĂ FINALĂ (21 ITEMS)

### **included_service (9 items - £0)**

```sql
1.  airport_wait_time      -- ❌ MISSING (alias: airport-wait-time cu 69 usage)
2.  extra_stops            -- ✅ EXISTS (dar NULL item_group, 69 usage cu extra-stops)
3.  luggage_assistance     -- ❌ MISSING (alias: luggage-assistance cu 69 usage)
4.  meet_greet             -- ❌ MISSING (alias: meet-greet cu 70 usage)
5.  onboard_wifi           -- ❌ MISSING (alias: onboard-wifi cu 70 usage)
6.  pet_friendly           -- ✅ EXISTS (dar NULL item_group, 69 usage cu pet-friendly)
7.  phone_chargers         -- ❌ MISSING (alias: phone-chargers cu 70 usage)
8.  priority_support       -- ❌ MISSING (alias: priority-support cu 69 usage)
9.  refreshments           -- ✅ EXISTS
```

### **paid_upgrade (5 items)**

```sql
10. champagne_moet                 -- ✅ EXISTS (£120, 12 usage)
11. champagne_dom_perignon_2015    -- ✅ EXISTS (£350, 14 usage)
12. bouquet_standard               -- ✅ EXISTS (£120, 11 usage, alias: flowers_standard)
13. bouquet_exclusive              -- ✅ EXISTS (£250, 14 usage, alias: flowers_exclusive)
14. security_escort                -- ✅ EXISTS (£750, 0 usage direct, 30 usage securityEscort)
```

### **premium_feature (4 items - £0)**

```sql
15. comfort_ride_mode          -- ❌ MISSING (alias: comfortRideMode cu 22 usage)
16. front_seat_request         -- ❌ MISSING (alias: frontSeatRequest cu 28 usage)
17. paparazzi_safe_mode        -- ❌ MISSING (alias: paparazziSafeMode cu 18 usage)
18. personal_luggage_privacy   -- ❌ MISSING (alias: personalLuggagePrivacy cu 27 usage)
```

### **trip_preference (3 items - £0)**

```sql
19. communication  -- ✅ EXISTS (34 usage)
20. music          -- ✅ EXISTS (36 usage)
21. temperature    -- ✅ EXISTS (32 usage)
```

---

## 🚨 PROBLEME IDENTIFICATE ÎN PLANUL ORIGINAL

### **PROBLEMA 1: Numărătoarea greșită**

- Plan original: "19 items"
- Realitate: **21 items** (9+5+4+3)
- ✅ CORECTAT

### **PROBLEMA 2: Step 3 dezactivează canonice după rename**

**GREȘIT în plan original:**

```sql
-- Step 1 rename:
UPDATE service_items SET id = 'extra_stops' WHERE id = 'extra-stops';

-- Step 3 dezactivare:
UPDATE service_items SET is_active = false WHERE id IN ('extra_stops', ...);
```

**Rezultat:** Dezactivezi row-ul CANONIC pe care tocmai l-ai redenumit!

**Acest bug afectează:**

- `extra_stops` (69 usage)
- `pet_friendly` (69 usage)

### **PROBLEMA 3: Rename direct pe id fără backfill**

**Risc:** FK constraint va FAIL dacă:

1. Redenumești `airport-wait-time` → `airport_wait_time`
2. Dar `booking_line_items` încă referă `airport-wait-time` (69 referințe!)
3. PostgreSQL va bloca rename-ul sau va șterge referințele

---

## ✅ MIGRATION STRATEGY CORECTĂ

### **FAZA 1: CREATE canonical rows (11 missing)**

```sql
-- Creează row-uri noi cu ID-uri canonice snake_case
INSERT INTO service_items (id, name, item_group, pricing_mode, is_active, price_pence, currency, metadata)
VALUES
  ('airport_wait_time', 'Waiting Time', 'included_service', 'included', true, 0, 'GBP', '{}'),
  ('luggage_assistance', 'Assistance', 'included_service', 'included', true, 0, 'GBP', '{}'),
  ('meet_greet', 'Greeting', 'included_service', 'included', true, 0, 'GBP', '{}'),
  ('onboard_wifi', 'WiFi', 'included_service', 'included', true, 0, 'GBP', '{}'),
  ('phone_chargers', 'Chargers', 'included_service', 'included', true, 0, 'GBP', '{}'),
  ('priority_support', 'Priority Support', 'included_service', 'included', true, 0, 'GBP', '{}'),
  ('comfort_ride_mode', 'Comfort Ride Mode', 'premium_feature', 'included', true, 0, 'GBP', '{}'),
  ('front_seat_request', 'Front Seat Request', 'premium_feature', 'included', true, 0, 'GBP', '{}'),
  ('paparazzi_safe_mode', 'Paparazzi Safe Mode', 'premium_feature', 'included', true, 0, 'GBP', '{}'),
  ('personal_luggage_privacy', 'Personal Luggage Privacy', 'premium_feature', 'included', true, 0, 'GBP', '{}');
```

### **FAZA 2: UPDATE item_group pentru canonice existente**

```sql
-- Fix item_group pentru canonice care există dar au NULL
UPDATE service_items SET item_group = 'included_service', pricing_mode = 'included' WHERE id = 'extra_stops';
UPDATE service_items SET item_group = 'included_service', pricing_mode = 'included' WHERE id = 'pet_friendly';
```

### **FAZA 3: MIGRATE booking_line_items (CRUCIAL!)**

```sql
-- Map aliasuri → canonice în booking_line_items
UPDATE booking_line_items SET service_item_id = 'airport_wait_time' WHERE service_item_id = 'airport-wait-time';
UPDATE booking_line_items SET service_item_id = 'luggage_assistance' WHERE service_item_id = 'luggage-assistance';
UPDATE booking_line_items SET service_item_id = 'meet_greet' WHERE service_item_id = 'meet-greet';
UPDATE booking_line_items SET service_item_id = 'onboard_wifi' WHERE service_item_id = 'onboard-wifi';
UPDATE booking_line_items SET service_item_id = 'phone_chargers' WHERE service_item_id = 'phone-chargers';
UPDATE booking_line_items SET service_item_id = 'priority_support' WHERE service_item_id = 'priority-support';
UPDATE booking_line_items SET service_item_id = 'extra_stops' WHERE service_item_id = 'extra-stops';
UPDATE booking_line_items SET service_item_id = 'pet_friendly' WHERE service_item_id = 'pet-friendly';

UPDATE booking_line_items SET service_item_id = 'security_escort' WHERE service_item_id = 'securityEscort';
UPDATE booking_line_items SET service_item_id = 'comfort_ride_mode' WHERE service_item_id = 'comfortRideMode';
UPDATE booking_line_items SET service_item_id = 'front_seat_request' WHERE service_item_id = 'frontSeatRequest';
UPDATE booking_line_items SET service_item_id = 'paparazzi_safe_mode' WHERE service_item_id = 'paparazziSafeMode';
UPDATE booking_line_items SET service_item_id = 'personal_luggage_privacy' WHERE service_item_id = 'personalLuggagePrivacy';
```

**AFFECTED ROWS:** ~700 booking_line_items (70 bookings × ~10 services/booking)

### **FAZA 4: DEZACTIVARE aliasuri (SAFE acum)**

```sql
-- Acum e safe să dezactivezi aliasurile - FK-urile sunt migrated
UPDATE service_items SET is_active = false WHERE id IN (
  -- Kebab-case included services
  'airport-wait-time', 'luggage-assistance', 'meet-greet', 'onboard-wifi',
  'phone-chargers', 'priority-support', 'extra-stops', 'pet-friendly',

  -- Champagne duplicates
  'champagne-moet', 'moet', 'moet_brut',
  'champagne-dom-perignon', 'dom_perignon_2015',

  -- Flowers duplicates
  'flowers_standard', 'flowers-standard',
  'flowers_exclusive', 'flowers-exclusive',

  -- Security duplicates
  'security-escort', 'securityEscort',

  -- Premium features duplicates
  'comfort-ride-mode', 'comfortRideMode',
  'front-seat-request', 'frontSeatRequest',
  'paparazzi-safe-mode', 'paparazziSafeMode',
  'personal-luggage-privacy', 'personalLuggagePrivacy',

  -- NULL item_group duplicates (dacă există)
  'waiting_time', 'assistance', 'greeting', 'wifi', 'chargers'
);
```

---

## 📊 ALIAS MAP COMPLET (pentru reference)

### **Included Services:**

```
airport-wait-time      → airport_wait_time
extra-stops            → extra_stops
luggage-assistance     → luggage_assistance
meet-greet             → meet_greet
onboard-wifi           → onboard_wifi
pet-friendly           → pet_friendly
phone-chargers         → phone_chargers
priority-support       → priority_support
```

### **Champagne:**

```
champagne-moet         → champagne_moet
moet                   → champagne_moet
moet_brut              → champagne_moet
champagne-dom-perignon → champagne_dom_perignon_2015
dom_perignon_2015      → champagne_dom_perignon_2015
```

### **Flowers:**

```
flowers_standard       → bouquet_standard
flowers-standard       → bouquet_standard
flowers_exclusive      → bouquet_exclusive
flowers-exclusive      → bouquet_exclusive
```

### **Security:**

```
security-escort        → security_escort
securityEscort         → security_escort
```

### **Premium Features:**

```
comfort-ride-mode          → comfort_ride_mode
comfortRideMode            → comfort_ride_mode
front-seat-request         → front_seat_request
frontSeatRequest           → front_seat_request
paparazzi-safe-mode        → paparazzi_safe_mode
paparazziSafeMode          → paparazzi_safe_mode
personal-luggage-privacy   → personal_luggage_privacy
personalLuggagePrivacy     → personal_luggage_privacy
```

---

## ⚠️ CRITICAL WARNINGS

1. **NU rula Step 1-3 din planul original** - va cauza FK violations și data loss
2. **Migrează booking_line_items ÎNAINTE de dezactivare** - altfel pierzi referințe
3. **CREATE missing canonice ÎNAINTE de migrate** - altfel FK va FAIL
4. **Verifică frontend code** - folosește kebab-case/camelCase pentru service IDs?

---

## ✅ SAFE MIGRATION ORDER

1. **CREATE** 11 missing canonical rows
2. **UPDATE** item_group pentru 2 canonice existente (extra_stops, pet_friendly)
3. **MIGRATE** ~700 booking_line_items rows (13 aliasuri → canonice)
4. **VERIFY** FK integrity (0 orphaned booking_line_items)
5. **DEACTIVATE** 30+ aliasuri (safe - no FK references)
6. **VERIFY** final count: 21 active canonice

---

## 📈 IMPACT SUMMARY

**Înainte:**

- 43 active service_items
- 13 aliasuri folosite în production (~700 booking_line_items)
- Mix kebab-case, camelCase, snake_case

**După:**

- 21 active canonice (100% snake_case)
- 22+ inactive aliasuri (păstrate pentru audit)
- ~700 booking_line_items migrated către canonice
- 0 FK violations
- 0 data loss

**Rollback:** Simplu - reactivează aliasurile, rollback booking_line_items UPDATE.
