# 🗺️ BOOKING SYSTEM MAP - Vantage Lane Database Analysis

**Generated:** 2025-11-22 07:46 GMT
**Database:** fmeonuvmlopkutbjejlo

## 📊 EXECUTIVE SUMMARY

**CRITICAL FINDING:** Baza de date folosește o arhitectură **SIMPLIFICATĂ** pentru bookings, NU multi-table complex system!

### 🔍 ACTIVE vs EMPTY TABLES

**✅ ACTIVE TABLES (cu date):**

- `bookings` - **12 rânduri** (CORE TABLE)
- `vehicles` - 10 rânduri
- `organizations` - 7 rânduri
- `admin_users` - 5 rânduri
- `billing_entities` - 5 rânduri
- `drivers` - 5 rânduri
- `booking_pricing` - **2 rânduri** (pricing info)

**❌ EMPTY TABLES (0 rânduri):**

- `booking_legs` - 0 rânduri (UNUSED!)
- `booking_segments` - 0 rânduri (UNUSED!)
- `booking_services` - 0 rânduri (UNUSED!)
- `booking_timeline` - 0 rânduri (UNUSED!)
- `booking_assignment` - 0 rânduri (UNUSED!)

## 🎯 BOOKING ARCHITECTURE ANALYSIS

### 🔥 CURRENT REALITY (ce se folosește efectiv):

**SINGLE TABLE APPROACH:** Totul este salvat în tabela `bookings` cu coloane specifice pentru fiecare tip de booking:

```sql
-- MAIN BOOKING TABLE
bookings {
  id (uuid, PK)
  trip_type: 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet'
  category: 'executive' | 'luxury' | 'business' | 'airport-transfer'

  -- Basic Info
  passenger_count (1-8)
  bag_count (0+)
  start_at (timestamp)

  -- Return Trip Fields
  return_date (date, nullable)
  return_time (time, nullable)
  return_flight_number (varchar, nullable)

  -- Hourly Booking
  hours (integer, default: 1)

  -- Fleet Bookings (SEPARATE COLUMNS!)
  fleet_executive (integer, nullable)
  fleet_s_class (integer, nullable)
  fleet_v_class (integer, nullable)
  fleet_suv (integer, nullable)

  -- Assignment
  assigned_driver_id (uuid, nullable)
  assigned_vehicle_id (uuid, nullable)
  organization_id (uuid, nullable)
}
```

### 🚨 TABLES THAT ARE DESIGNED BUT NOT USED:

1. **`booking_legs`** - Pentru multi-leg journeys - **EMPTY!**
2. **`booking_segments`** - Pentru stop points - **EMPTY!**
3. **`booking_services`** - Pentru extra services - **EMPTY!**
4. **`booking_timeline`** - Pentru status tracking - **EMPTY!**
5. **`booking_assignment`** - Pentru driver assignment - **EMPTY!**

## 🎯 BOOKING TYPES MAPPING

### 1. ONE-WAY BOOKING

**Tables Used:**

- ✅ `bookings` (primary)
- ✅ `booking_pricing` (optional - pricing details)
- ✅ `customers` (customer info)
- ✅ `vehicles` (vehicle assignment)
- ✅ `drivers` (driver assignment)

**Required Columns:**

```sql
bookings {
  trip_type: 'oneway'
  category: 'executive'|'luxury'|'business'|'airport-transfer'
  start_at: timestamp
  passenger_count: integer
  bag_count: integer
  status: 'NEW'|'COMPLETED'
  booking_status: 'draft'|'confirmed'
}
```

### 2. RETURN TRIP BOOKING

**Tables Used:**

- ✅ `bookings` (primary - SINGLE RECORD!)
- ✅ `booking_pricing`

**Required Columns:**

```sql
bookings {
  trip_type: 'return'
  category: vehicle category
  start_at: outbound timestamp
  return_date: date
  return_time: time
  return_flight_number: varchar (optional)
  -- Same record holds BOTH legs!
}
```

**🔥 CRITICAL:** Return trips sunt salvate ca **UN SINGUR BOOKING**, nu două separate!

### 3. FLEET BOOKING

**Tables Used:**

- ✅ `bookings` (with fleet columns)

**Required Columns:**

```sql
bookings {
  trip_type: 'fleet'
  fleet_executive: integer (number of vehicles)
  fleet_s_class: integer
  fleet_v_class: integer
  fleet_suv: integer
  -- Multiple vehicle types in SAME booking!
}
```

### 4. HOURLY BOOKING

**Tables Used:**

- ✅ `bookings` (with hours field)

**Required Columns:**

```sql
bookings {
  trip_type: 'hourly'
  hours: integer (duration)
  category: vehicle category
}
```

## 🔧 INTEGRATION STRATEGY

### ✅ WHAT TO USE (Active):

1. **`bookings`** - Main table pentru TOATE booking types
2. **`booking_pricing`** - Pricing breakdown (optional)
3. **`customers`** - Customer management
4. **`vehicles`** - Vehicle fleet
5. **`drivers`** - Driver management
6. **`organizations`** - Operators/companies

### ❌ WHAT TO IGNORE (Empty/Unused):

1. **`booking_legs`** - Multi-leg system not implemented
2. **`booking_segments`** - Stop system not used
3. **`booking_services`** - Extra services not active
4. **`booking_timeline`** - Status tracking not used
5. **`booking_assignment`** - Assignment in main bookings table

## 🎯 RECOMMENDED APPROACH FOR OUR STORE

### 🔄 ADAPT OUR ZUSTAND STORE:

**CURRENT Store Architecture:**

```typescript
// Our modular approach is GOOD but needs mapping adjustment
TripConfiguration {
  selectedVehicle: { category, model }
  // BUT database expects:
  category: string  // direct field
  vehicle_model: string // direct field
}
```

**DATABASE Mapping:**

```typescript
// Map OUR store → DATABASE fields:
const mapToBookingRecord = (tripConfig: TripConfiguration) => ({
  trip_type: bookingType, // 'oneway'|'return'|'hourly'|'daily'|'fleet'
  category: tripConfig.selectedVehicle.category.id,
  vehicle_model: tripConfig.selectedVehicle.model?.name,
  passenger_count: tripConfig.passengers,
  bag_count: tripConfig.luggage,
  start_at: tripConfig.pickupDateTime,

  // Return trip fields
  return_date: bookingType === 'return' ? tripConfig.returnDateTime : null,
  return_time: bookingType === 'return' ? tripConfig.returnDateTime : null,

  // Hourly fields
  hours: bookingType === 'hourly' ? tripConfig.hoursRequested : 1,

  // Fleet fields
  fleet_executive: bookingType === 'fleet' ? getFleetCount('executive') : null,
  fleet_s_class: bookingType === 'fleet' ? getFleetCount('luxury') : null,
  // etc.
});
```

## 🚀 ACTION ITEMS

### 1. UPDATE Vehicle Store Integration

- Map `selectedVehicle.category.id` → `bookings.category`
- Map `selectedVehicle.model.name` → `bookings.vehicle_model`

### 2. CREATE Database Service Layer

```typescript
// services/booking.service.ts
export const createBooking = async (tripConfig: TripConfiguration) => {
  const bookingData = mapToBookingRecord(tripConfig);

  // Single INSERT to bookings table
  const booking = await supabase.from('bookings').insert(bookingData).single();

  // Optional: Add pricing info
  if (pricing) {
    await supabase.from('booking_pricing').insert({ booking_id: booking.id, ...pricing });
  }

  return booking;
};
```

### 3. ABANDON Complex Multi-Table Approach

- **DON'T use** `booking_legs` pentru return trips
- **DON'T use** `booking_segments` pentru stops
- **USE** single `bookings` table approach

## 📋 REQUIRED FIELDS PER BOOKING TYPE

### ONE-WAY:

- `trip_type` = 'oneway'
- `category` = vehicle category
- `start_at` = pickup time
- `passenger_count`, `bag_count`

### RETURN:

- `trip_type` = 'return'
- `category` = vehicle category
- `start_at` = outbound time
- `return_date`, `return_time` = return trip
- `passenger_count`, `bag_count`

### HOURLY:

- `trip_type` = 'hourly'
- `category` = vehicle category
- `start_at` = start time
- `hours` = duration
- `passenger_count`, `bag_count`

### FLEET:

- `trip_type` = 'fleet'
- `fleet_executive`, `fleet_s_class`, `fleet_v_class`, `fleet_suv` = vehicle counts
- `start_at` = pickup time

---

## 🎯 CONCLUSION

**The database uses a SIMPLIFIED single-table approach, NOT the complex multi-table system we initially assumed!**

**Our modular Zustand store is PERFECT** - we just need to map it correctly to the single `bookings` table structure.

**Next Steps:**

1. Create mapping layer between our store and database
2. Implement booking service with single-table inserts
3. Test with all booking types (oneway, return, hourly, fleet)

**✅ READY TO IMPLEMENT STEP 2 UI WITH REAL DATABASE INTEGRATION!**
