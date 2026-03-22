# SERVICE_ITEMS CANONIZATION PLAN

## PROBLEMA IDENTIFICATĂ

**43 service_items active** - TOATE, multe duplicate cu naming inconsistent:

- Mix camelCase, kebab-case, snake_case
- Duplicate cu/fără item_group
- Aliasuri multiple pentru același serviciu

---

## DUPLICATE IDENTIFICATE

### 1. **Champagne Moët & Chandon** (4 duplicate!)

```
✅ CANONIC: champagne_moet
❌ ALIASURI:
   - champagne-moet (kebab-case)
   - moet
   - moet_brut
```

### 2. **Dom Pérignon 2015** (3 duplicate!)

```
✅ CANONIC: champagne_dom_perignon_2015
❌ ALIASURI:
   - champagne-dom-perignon (kebab-case)
   - dom_perignon_2015
```

### 3. **Flowers Standard Bouquet** (3 duplicate!)

```
✅ CANONIC: bouquet_standard
❌ ALIASURI:
   - flowers_standard
   - flowers-standard (kebab-case)
```

### 4. **Flowers Exclusive Bouquet** (3 duplicate!)

```
✅ CANONIC: bouquet_exclusive
❌ ALIASURI:
   - flowers_exclusive
   - flowers-exclusive (kebab-case)
```

### 5. **Security Escort** (3 duplicate!)

```
✅ CANONIC: security_escort
❌ ALIASURI:
   - security-escort (kebab-case)
   - securityEscort (camelCase)
```

### 6. **Comfort Ride Mode** (2 duplicate)

```
✅ CANONIC: comfort_ride_mode
❌ ALIASURI:
   - comfort-ride-mode (kebab-case)
   - comfortRideMode (camelCase)
```

### 7. **Front Seat Request** (2 duplicate)

```
✅ CANONIC: front_seat_request
❌ ALIASURI:
   - front-seat-request (kebab-case)
   - frontSeatRequest (camelCase)
```

### 8. **Paparazzi Safe Mode** (2 duplicate)

```
✅ CANONIC: paparazzi_safe_mode
❌ ALIASURI:
   - paparazzi-safe-mode (kebab-case)
   - paparazziSafeMode (camelCase)
```

### 9. **Personal Luggage Privacy** (2 duplicate)

```
✅ CANONIC: personal_luggage_privacy
❌ ALIASURI:
   - personal-luggage-privacy (kebab-case)
   - personalLuggagePrivacy (camelCase)
```

### 10. **Included Services - duplicate cu/fără item_group** (7 duplicate pairs!)

```
✅ CANONIC (cu item_group=included_service):
   - airport_wait_time (rename din airport-wait-time)
   - extra_stops (rename din extra-stops)
   - luggage_assistance (rename din luggage-assistance)
   - meet_greet (rename din meet-greet)
   - onboard_wifi (rename din onboard-wifi)
   - pet_friendly (rename din pet-friendly)
   - phone_chargers (rename din phone-chargers)

❌ ALIASURI (item_group=NULL):
   - waiting_time → airport_wait_time
   - extra_stops (NULL) → extra_stops (included_service)
   - assistance → luggage_assistance
   - greeting → meet_greet
   - wifi → onboard_wifi
   - pet_friendly (NULL) → pet_friendly (included_service)
   - chargers → phone_chargers
```

---

## LISTA CANONICĂ FINALĂ (19 items)

### **included_service** (9 items - £0)

```sql
1. airport_wait_time         -- Waiting Time
2. extra_stops               -- Extra Stops
3. luggage_assistance        -- Assistance
4. meet_greet                -- Greeting
5. onboard_wifi              -- WiFi
6. pet_friendly              -- Pet-Friendly
7. phone_chargers            -- Chargers
8. priority_support          -- Priority Support (deja corect)
9. refreshments              -- Refreshments (deja corect)
```

### **paid_upgrade** (4 items)

```sql
10. champagne_moet                  -- £120.00 - Moët & Chandon
11. champagne_dom_perignon_2015     -- £350.00 - Dom Pérignon
12. bouquet_standard                -- £120.00 - Standard Bouquet
13. bouquet_exclusive               -- £250.00 - Exclusive Bouquet
14. security_escort                 -- £750.00 - Security Escort
```

### **premium_feature** (4 items - £0)

```sql
15. comfort_ride_mode           -- Comfort Ride Mode
16. front_seat_request          -- Front Seat Request
17. paparazzi_safe_mode         -- Paparazzi Safe Mode
18. personal_luggage_privacy    -- Personal Luggage Privacy
```

### **trip_preference** (3 items - £0)

```sql
19. communication               -- Communication Preference (deja corect)
20. music                       -- Music Preference (deja corect)
21. temperature                 -- Temperature Preference (deja corect)
```

---

## ALIAS MAP COMPLET (23 aliasuri → dezactivate)

```json
{
  "champagne-moet": "champagne_moet",
  "moet": "champagne_moet",
  "moet_brut": "champagne_moet",

  "champagne-dom-perignon": "champagne_dom_perignon_2015",
  "dom_perignon_2015": "champagne_dom_perignon_2015",

  "flowers_standard": "bouquet_standard",
  "flowers-standard": "bouquet_standard",

  "flowers_exclusive": "bouquet_exclusive",
  "flowers-exclusive": "bouquet_exclusive",

  "security-escort": "security_escort",
  "securityEscort": "security_escort",

  "comfort-ride-mode": "comfort_ride_mode",
  "comfortRideMode": "comfort_ride_mode",

  "front-seat-request": "front_seat_request",
  "frontSeatRequest": "front_seat_request",

  "paparazzi-safe-mode": "paparazzi_safe_mode",
  "paparazziSafeMode": "paparazzi_safe_mode",

  "personal-luggage-privacy": "personal_luggage_privacy",
  "personalLuggagePrivacy": "personal_luggage_privacy",

  "waiting_time": "airport_wait_time",
  "assistance": "luggage_assistance",
  "greeting": "meet_greet",
  "wifi": "onboard_wifi",
  "chargers": "phone_chargers"
}
```

---

## MIGRATION STRATEGY

### **STEP 1: Rename kebab-case → snake_case (included_service cu item_group)**

```sql
UPDATE service_items SET id = 'airport_wait_time' WHERE id = 'airport-wait-time';
UPDATE service_items SET id = 'extra_stops' WHERE id = 'extra-stops';
UPDATE service_items SET id = 'luggage_assistance' WHERE id = 'luggage-assistance';
UPDATE service_items SET id = 'meet_greet' WHERE id = 'meet-greet';
UPDATE service_items SET id = 'onboard_wifi' WHERE id = 'onboard-wifi';
UPDATE service_items SET id = 'pet_friendly' WHERE id = 'pet-friendly';
UPDATE service_items SET id = 'phone_chargers' WHERE id = 'phone-chargers';
```

### **STEP 2: Rename camelCase/kebab-case → snake_case (premium_feature)**

```sql
UPDATE service_items SET id = 'comfort_ride_mode' WHERE id = 'comfortRideMode';
UPDATE service_items SET id = 'front_seat_request' WHERE id = 'frontSeatRequest';
UPDATE service_items SET id = 'paparazzi_safe_mode' WHERE id = 'paparazziSafeMode';
UPDATE service_items SET id = 'personal_luggage_privacy' WHERE id = 'personalLuggagePrivacy';
```

### **STEP 3: Dezactivează aliasuri (23 items)**

```sql
UPDATE service_items SET is_active = false WHERE id IN (
  -- Champagne duplicates
  'champagne-moet', 'moet', 'moet_brut',
  'champagne-dom-perignon', 'dom_perignon_2015',

  -- Flowers duplicates
  'flowers_standard', 'flowers-standard',
  'flowers_exclusive', 'flowers-exclusive',

  -- Security duplicates
  'security-escort', 'securityEscort',

  -- Premium feature duplicates
  'comfort-ride-mode',
  'front-seat-request',
  'paparazzi-safe-mode',
  'personal-luggage-privacy',

  -- Included service duplicates (NULL item_group)
  'waiting_time', 'extra_stops', 'assistance', 'greeting',
  'wifi', 'pet_friendly', 'chargers'
);
```

### **STEP 4: Migrare booking_line_items (dacă există usage)**

```sql
-- TODO: Check if any booking_line_items reference aliasuri
-- Apoi mapează alias → canonic înainte de dezactivare
```

---

## REZULTAT FINAL

**Înainte:** 43 items active (multe duplicate)  
**După:** 21 items active (canonice, snake_case consistent)  
**Dezactivate:** 22 aliasuri (păstrate în DB pentru istoric)

**Grupuri standardizate:**

- `included_service` (9) - gratis, incluse
- `paid_upgrade` (5) - plătite, champagne/flowers/security
- `premium_feature` (4) - gratis, VIP features
- `trip_preference` (3) - preferințe client

**Naming:** 100% `snake_case`
