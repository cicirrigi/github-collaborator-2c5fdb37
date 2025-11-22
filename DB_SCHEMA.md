# DATABASE SCHEMA - Vantage Lane Supabase

**Project ID:** fmeonuvmlopkutbjejlo
**Database Version:** PostgreSQL 17.6.1.016
**Region:** eu-west-2
**Status:** ACTIVE_HEALTHY

## 1. LISTA TABELOR (54+ TABELE TOTALE)

### 🏢 BUSINESS LOGIC TABLES (Schema: public)

1. **organizations** - Organizații/operatori (7 rânduri)
2. **user_organization_roles** - Roluri utilizatori în organizații (2 rânduri)
3. **customers** - Clienți (2 rânduri, RLS activat)
4. **customer_ride_stats** - Statistici călătorii clienți (0 rânduri)
5. **notification_settings** - Setări notificări (0 rânduri, RLS activat)
6. **preferences** - Preferințe utilizatori (0 rânduri, RLS activat)
7. **customer_payment_methods** - Metode de plată clienți (0 rânduri, RLS activat)
8. **reviews** - Recenzii (0 rânduri, RLS activat)
9. **drivers** - Șoferi (1 rând, RLS activat)
10. **driver_reviews** - Recenzii șoferi (0 rânduri, RLS activat)
11. **vehicles** - Vehicule (1 rând, RLS activat)
12. **bookings** - Rezervări (1 rând, RLS activat)
13. **booking_assignment** - Atribuire rezervări (0 rânduri)
14. **billing** - Facturare (1 rând, RLS activat)
15. **billing_entities** - Entități de facturare (0 rânduri, RLS activat)
16. **admin_users** - Utilizatori admin (2 rânduri, RLS activat)
17. **corporate_accounts** - Conturi corporative (0 rânduri, RLS activat)
18. **support_tickets** - Tichete suport (4 rânduri, RLS activat)
19. **notifications** - Notificări (4 rânduri, RLS activat)
20. **job_categories** - Categorii job-uri (13 rânduri, RLS activat)
21. **driver_job_types** - Tipuri job-uri șoferi (0 rânduri, RLS activat)
22. **driver_earnings** - Câștiguri șoferi (0 rânduri)
23. **support_ticket_messages** - Mesaje tichete suport (12 rânduri, RLS activat)
24. **feedback_templates** - Template-uri feedback (35 rânduri, RLS activat)
25. **safety_incidents** - Incidente siguranță (0 rânduri, RLS activat)
26. **rating_statistics** - Statistici rating-uri (1 rând, RLS activat)

### 🗄️ STORAGE TABLES (Schema: storage)

27. **buckets_vectors** - Storage buckets pentru vectori (0 rânduri, RLS activat)
28. **vector_indexes** - Indexuri pentru vectori (0 rânduri, RLS activat)

### 🔄 REALTIME TABLES (Schema: realtime)

29. **messages_2025_11_21** - Mesaje realtime 21 Nov (0 rânduri)
30. **messages_2025_11_22** - Mesaje realtime 22 Nov (0 rânduri)
31. **messages_2025_11_23** - Mesaje realtime 23 Nov (0 rânduri)
32. **messages_2025_11_24** - Mesaje realtime 24 Nov (0 rânduri)
33. **messages_2025_11_25** - Mesaje realtime 25 Nov (0 rânduri)

### 🏗️ POSTGRESQL SYSTEM TABLES (Schema: pg_catalog)

34. **pg_default_acl** - Default ACL (0 rânduri)
35. **pg_tablespace** - Tablespaces (2 rânduri)
36. **pg_shdepend** - Shared dependencies (1065 rânduri)
37. **pg_type** - Data types (843 rânduri)
38. **pg_attribute** - Table attributes (6247 rânduri)
39. **pg_proc** - Functions/procedures (3501 rânduri)
40. **pg_class** - Relations/tables (1027 rânduri)
41. **pg_auth_members** - Role memberships (4 rânduri)
42. **pg_database** - Databases (4 rânduri)
43. **pg_db_role_setting** - Role settings (0 rânduri)
44. **pg_largeobject** - Large objects (0 rânduri)
45. **pg_largeobject_metadata** - Large object metadata (0 rânduri)
46. **pg_pltemplate** - Language templates (0 rânduri)
47. **pg_replication_origin** - Replication origins (0 rânduri)
48. **pg_shdescription** - Shared object descriptions (23 rânduri)
49. **pg_shseclabel** - Shared security labels (0 rânduri)
50. **pg_subscription** - Subscriptions (0 rânduri)
51. **pg_user_mapping** - User mappings (0 rânduri)
52. **pg_foreign_data_wrapper** - Foreign data wrappers (0 rânduri)
53. **pg_foreign_server** - Foreign servers (0 rânduri)
54. **pg_foreign_table** - Foreign tables (0 rânduri)

**TOTAL: 54+ TABELE ACROSSE MULTIPLE SCHEMES**

## 2. COLOANE PER TABEL CU TIPURI

### organizations

- **id** (uuid, PK) - gen_random_uuid()
- **code** (varchar, unique, updatable)
- **org_type** (varchar, nullable, updatable) - default: 'operator'
- **name** (varchar, updatable)
- **description** (text, nullable, updatable)
- **contact_email** (varchar, nullable, updatable)
- **contact_phone** (varchar, nullable, updatable)
- **city** (varchar, nullable, updatable)
- **is_active** (boolean, nullable, updatable) - default: true
- **rating_average** (numeric, nullable, updatable) - default: 0.00
- **review_count** (integer, nullable, updatable) - default: 0
- **operating_hours_json** (jsonb, nullable, updatable)
- **pricing_json** (jsonb, nullable, updatable)
- **driver_commission_pct** (numeric, nullable, updatable) - default: 20.00
- **created_at** (timestamp, nullable, updatable) - default: now()
- **updated_at** (timestamp, nullable, updatable) - default: now()
- **deleted_at** (timestamptz, nullable, updatable)
- **auth_user_id** (uuid, nullable, updatable, FK → auth.users.id)

### user_organization_roles

- **id** (uuid, PK) - gen_random_uuid()
- **user_id** (uuid, updatable, FK → auth.users.id)
- **organization_id** (uuid, updatable, FK → organizations.id)
- **role** (varchar, nullable, updatable) - default: 'admin'
- **is_active** (boolean, nullable, updatable) - default: true
- **created_at** (timestamp, nullable, updatable) - default: now()

### customers [RLS ENABLED]

- **id** (uuid, PK) - gen_random_uuid()
- **auth_user_id** (uuid, nullable, updatable, unique, FK → auth.users.id)
- **email** (varchar, updatable)
- **first_name** (varchar, nullable, updatable)
- **last_name** (varchar, nullable, updatable)
- **phone** (varchar, nullable, updatable)
- **date_of_birth** (date, nullable, updatable)
- **avatar_url** (text, nullable, updatable)
- **addresses** (jsonb, nullable, updatable) - default: '[]'
- **ride_preferences** (jsonb, nullable, updatable) - default: '{}'
- **notification_settings** (jsonb, nullable, updatable) - default: '{"sms": false, "push": true, "email": true}'
- **emergency_contact** (jsonb, nullable, updatable)
- **is_active** (boolean, nullable, updatable) - default: true
- **preferred_language** (varchar, nullable, updatable) - default: 'en'
- **created_at** (timestamp, nullable, updatable) - default: now()
- **updated_at** (timestamp, nullable, updatable) - default: now()
- **emergency_contacts** (jsonb, nullable, updatable)
- **medical_info** (jsonb, nullable, updatable)
- **accessibility_needs** (jsonb, nullable, updatable)
- **name** (varchar, nullable, updatable)
- **total_spent** (numeric, nullable, updatable) - default: 0.00
- **total_rides** (integer, nullable, updatable) - default: 0
- **member_since** (timestamp, nullable, updatable) - default: now()
- **loyalty_tier** (varchar, nullable, updatable) - default: 'bronze'
- **status** (varchar, nullable, updatable) - default: 'active'
- **two_factor_enabled** (boolean, nullable, updatable) - default: false
- **login_notifications** (boolean, nullable, updatable) - default: true
- **deleted_at** (timestamptz, nullable, updatable)
- **rating_average** (numeric, nullable, updatable) - default: 5.0
- **rating_count** (integer, nullable, updatable) - default: 0

### drivers [RLS ENABLED]

- **id** (uuid, PK) - gen_random_uuid()
- **auth_user_id** (uuid, nullable, updatable, unique, FK → auth.users.id)
- **organization_id** (uuid, updatable, FK → organizations.id)
- **email** (varchar, updatable)
- **first_name** (varchar, nullable, updatable)
- **last_name** (varchar, nullable, updatable)
- **phone** (varchar, nullable, updatable)
- **date_of_birth** (date, nullable, updatable)
- **avatar_url** (text, nullable, updatable)
- **addresses** (jsonb, nullable, updatable) - default: '[]'
- **license_number** (varchar, nullable, updatable)
- **license_expiry** (date, nullable, updatable)
- **license_class** (varchar, nullable, updatable)
- **national_insurance_number** (varchar, nullable, updatable)
- **bank_details** (jsonb, nullable, updatable)
- **emergency_contact** (jsonb, nullable, updatable)
- **medical_info** (jsonb, nullable, updatable)
- **is_active** (boolean, nullable, updatable) - default: true
- **is_available** (boolean, nullable, updatable) - default: false
- **last_location** (jsonb, nullable, updatable)
- **last_seen** (timestamp, nullable, updatable)
- **preferred_language** (varchar, nullable, updatable) - default: 'en'
- **hire_date** (date, nullable, updatable) - default: CURRENT_DATE
- **employment_type** (varchar, nullable, updatable) - default: 'employee'
- **hourly_rate** (numeric, nullable, updatable)
- **commission_rate** (numeric, nullable, updatable) - default: 20.00
- **created_at** (timestamp, nullable, updatable) - default: now()
- **updated_at** (timestamp, nullable, updatable) - default: now()
- **emergency_contacts** (jsonb, nullable, updatable)
- **total_earnings** (numeric, nullable, updatable) - default: 0.00
- **rating_average** (numeric, nullable, updatable) - default: 5.0
- **rating_count** (integer, nullable, updatable) - default: 0
- **completed_jobs** (integer, nullable, updatable) - default: 0
- **status** (varchar, nullable, updatable) - default: 'active'
- **two_factor_enabled** (boolean, nullable, updatable) - default: false
- **login_notifications** (boolean, nullable, updatable) - default: true
- **deleted_at** (timestamptz, nullable, updatable)

### vehicles [RLS ENABLED]

- **id** (uuid, PK) - gen_random_uuid()
- **organization_id** (uuid, updatable, FK → organizations.id)
- **driver_id** (uuid, nullable, updatable, FK → drivers.id)
- **make** (varchar, updatable)
- **model** (varchar, updatable)
- **year** (integer, updatable)
- **color** (varchar, nullable, updatable)
- **license_plate** (varchar, unique, updatable)
- **vin** (varchar, nullable, updatable, unique)
- **fuel_type** (varchar, nullable, updatable) - default: 'petrol'
- **transmission** (varchar, nullable, updatable) - default: 'manual'
- **seating_capacity** (integer, nullable, updatable) - default: 4
- **wheelchair_accessible** (boolean, nullable, updatable) - default: false
- **air_conditioning** (boolean, nullable, updatable) - default: true
- **gps_enabled** (boolean, nullable, updatable) - default: true
- **insurance_policy_number** (varchar, nullable, updatable)
- **insurance_expiry** (date, nullable, updatable)
- **mot_expiry** (date, nullable, updatable)
- **road_tax_expiry** (date, nullable, updatable)
- **is_active** (boolean, nullable, updatable) - default: true
- **maintenance_schedule** (jsonb, nullable, updatable)
- **created_at** (timestamp, nullable, updatable) - default: now()
- **updated_at** (timestamp, nullable, updatable) - default: now()
- **vehicle_class** (varchar, nullable, updatable) - default: 'standard'
- **features** (jsonb, nullable, updatable) - default: '[]'
- **pco_license_number** (varchar, nullable, updatable)
- **pco_license_expiry** (date, nullable, updatable)
- **deleted_at** (timestamptz, nullable, updatable)

### bookings [RLS ENABLED]

- **id** (uuid, PK) - gen_random_uuid()
- **customer_id** (uuid, updatable, FK → customers.id)
- **organization_id** (uuid, updatable, FK → organizations.id)
- **booking_type** (varchar, updatable) - default: 'immediate'
- **pickup_location** (jsonb, updatable)
- **dropoff_location** (jsonb, nullable, updatable)
- **pickup_datetime** (timestamptz, updatable)
- **dropoff_datetime** (timestamptz, nullable, updatable)
- **passenger_count** (integer, nullable, updatable) - default: 1
- **luggage_count** (integer, nullable, updatable) - default: 0
- **special_requirements** (text, nullable, updatable)
- **flight_number** (varchar, nullable, updatable)
- **estimated_duration** (interval, nullable, updatable)
- **estimated_distance** (numeric, nullable, updatable)
- **estimated_price** (numeric, nullable, updatable)
- **actual_price** (numeric, nullable, updatable)
- **currency** (varchar, nullable, updatable) - default: 'GBP'
- **status** (varchar, updatable) - default: 'pending'
- **payment_status** (varchar, nullable, updatable) - default: 'pending'
- **payment_method** (varchar, nullable, updatable)
- **created_at** (timestamp, nullable, updatable) - default: now()
- **updated_at** (timestamp, nullable, updatable) - default: now()
- **notes** (text, nullable, updatable)
- **corporate_account_id** (uuid, nullable, updatable, FK → corporate_accounts.id)
- **vehicle_class_requested** (varchar, nullable, updatable)
- **is_return_trip** (boolean, nullable, updatable) - default: false
- **return_pickup_datetime** (timestamptz, nullable, updatable)
- **parent_booking_id** (uuid, nullable, updatable)
- **pricing_breakdown** (jsonb, nullable, updatable)
- **booking_reference** (varchar, nullable, updatable, unique)
- **cancelled_at** (timestamptz, nullable, updatable)
- **cancelled_by** (uuid, nullable, updatable)
- **cancellation_reason** (text, nullable, updatable)

### billing [RLS ENABLED]

- **id** (uuid, PK) - gen_random_uuid()
- **booking_id** (uuid, updatable, unique, FK → bookings.id)
- **customer_id** (uuid, updatable, FK → customers.id)
- **organization_id** (uuid, updatable, FK → organizations.id)
- **amount** (numeric, updatable)
- **currency** (varchar, nullable, updatable) - default: 'GBP'
- **billing_date** (timestamp, nullable, updatable) - default: now()
- **due_date** (timestamp, nullable, updatable)
- **payment_status** (varchar, nullable, updatable) - default: 'pending'
- **payment_date** (timestamp, nullable, updatable)
- **payment_method** (varchar, nullable, updatable)
- **payment_reference** (varchar, nullable, updatable)
- **invoice_number** (varchar, nullable, updatable, unique)
- **tax_amount** (numeric, nullable, updatable) - default: 0.00
- **discount_amount** (numeric, nullable, updatable) - default: 0.00
- **created_at** (timestamp, nullable, updatable) - default: now()
- **updated_at** (timestamp, nullable, updatable) - default: now()

### support_tickets [RLS ENABLED]

- **id** (uuid, PK) - gen_random_uuid()
- **ticket_number** (varchar, updatable, unique)
- **customer_id** (uuid, nullable, updatable, FK → customers.id)
- **driver_id** (uuid, nullable, updatable, FK → drivers.id)
- **organization_id** (uuid, nullable, updatable, FK → organizations.id)
- **booking_id** (uuid, nullable, updatable, FK → bookings.id)
- **subject** (varchar, updatable)
- **description** (text, nullable, updatable)
- **priority** (varchar, nullable, updatable) - default: 'medium'
- **status** (varchar, nullable, updatable) - default: 'open'
- **category** (varchar, nullable, updatable) - default: 'general'
- **assigned_to** (uuid, nullable, updatable, FK → admin_users.id)
- **created_at** (timestamp, nullable, updatable) - default: now()
- **updated_at** (timestamp, nullable, updatable) - default: now()
- **resolved_at** (timestamp, nullable, updatable)

### admin_users [RLS ENABLED]

- **id** (uuid, PK) - gen_random_uuid()
- **auth_user_id** (uuid, nullable, updatable, unique, FK → auth.users.id)
- **email** (varchar, updatable, unique)
- **first_name** (varchar, nullable, updatable)
- **last_name** (varchar, nullable, updatable)
- **role** (varchar, nullable, updatable) - default: 'admin'
- **permissions** (jsonb, nullable, updatable) - default: '[]'
- **is_active** (boolean, nullable, updatable) - default: true
- **default_operator_id** (uuid, nullable, updatable, FK → organizations.id)
- **two_factor_enabled** (boolean, nullable, updatable) - default: false
- **last_login** (timestamp, nullable, updatable)
- **created_at** (timestamp, nullable, updatable) - default: now()
- **updated_at** (timestamp, nullable, updatable) - default: now()

### job_categories [RLS ENABLED]

- **id** (uuid, PK) - gen_random_uuid()
- **name** (varchar, updatable, unique)
- **description** (text, nullable, updatable)
- **is_active** (boolean, nullable, updatable) - default: true
- **requires_special_license** (boolean, nullable, updatable) - default: false
- **min_vehicle_class** (varchar, nullable, updatable)
- **created_at** (timestamp, nullable, updatable) - default: now()
- **updated_at** (timestamp, nullable, updatable) - default: now()

### notifications [RLS ENABLED]

- **id** (uuid, PK) - gen_random_uuid()
- **recipient_id** (uuid, updatable)
- **recipient_type** (varchar, updatable)
- **organization_id** (uuid, nullable, updatable, FK → organizations.id)
- **title** (varchar, updatable)
- **message** (text, nullable, updatable)
- **notification_type** (varchar, nullable, updatable) - default: 'info'
- **priority** (varchar, nullable, updatable) - default: 'medium'
- **is_read** (boolean, nullable, updatable) - default: false
- **read_at** (timestamp, nullable, updatable)
- **data** (jsonb, nullable, updatable) - default: '{}'
- **created_at** (timestamp, nullable, updatable) - default: now()
- **expires_at** (timestamp, nullable, updatable)

## 3. RELAȚII DINTRE TABELE

### organizations → Multiple Relations

- **auth_user_id** → auth.users.id (One-to-One)
- Referenced by: booking_assignment, admin_users, corporate_accounts, vehicles, drivers, user_organization_roles, bookings, support_tickets, notifications

### customers → Multiple Relations

- **auth_user_id** → auth.users.id (One-to-One)
- Referenced by: bookings, customer_ride_stats, notification_settings, preferences, customer_payment_methods, reviews, driver_reviews, billing, support_tickets, billing_entities

### drivers → Multiple Relations

- **auth_user_id** → auth.users.id (One-to-One)
- **organization_id** → organizations.id (Many-to-One)
- Referenced by: vehicles, booking_assignment, driver_reviews, driver_job_types, driver_earnings, support_tickets

### vehicles → Relations

- **organization_id** → organizations.id (Many-to-One)
- **driver_id** → drivers.id (Many-to-One)
- Referenced by: booking_assignment

### bookings → Relations

- **customer_id** → customers.id (Many-to-One)
- **organization_id** → organizations.id (Many-to-One)
- **corporate_account_id** → corporate_accounts.id (Many-to-One)
- Referenced by: booking_assignment, billing, driver_earnings, support_tickets, safety_incidents

## 4. CHEI PRIMARE / CHEI STRĂINE

### Primary Keys (toate UUID gen_random_uuid())

- organizations.id
- user_organization_roles.id
- customers.id
- drivers.id
- vehicles.id
- bookings.id
- billing.id
- admin_users.id
- support_tickets.id
- notifications.id
- job_categories.id
- Etc. (toate tabelele au cheia primară `id` de tip UUID)

### Foreign Key Constraints (Principale)

- organizations.auth_user_id → auth.users.id
- customers.auth_user_id → auth.users.id
- drivers.auth_user_id → auth.users.id
- drivers.organization_id → organizations.id
- vehicles.organization_id → organizations.id
- vehicles.driver_id → drivers.id
- bookings.customer_id → customers.id
- bookings.organization_id → organizations.id
- billing.booking_id → bookings.id
- billing.customer_id → customers.id

## 5. CONSTRÂNGERI NOT NULL, UNIQUE

### NOT NULL Constraints (Câmpuri obligatorii)

- organizations: id, code, name
- customers: id, email
- drivers: id, email, organization_id
- vehicles: id, organization_id, make, model, year, license_plate
- bookings: id, customer_id, organization_id, booking_type, pickup_location, pickup_datetime, status
- billing: id, booking_id, customer_id, organization_id, amount

### UNIQUE Constraints

- organizations.code
- customers.auth_user_id
- drivers.auth_user_id
- vehicles.license_plate
- vehicles.vin
- bookings.booking_reference
- billing.booking_id
- billing.invoice_number
- support_tickets.ticket_number
- admin_users.auth_user_id
- admin_users.email
- job_categories.name

## 6. INDEXURI

Schema nu include indexuri explicite în datele returnate, dar se presupun indexuri automate pe:

- Primary Keys (id columns)
- Foreign Keys
- UNIQUE constraints
- Timestampurile pentru sortare/filtrare

## 7. POLITICI RLS (Row Level Security)

### Tabele cu RLS ACTIVAT:

- **customers** - RLS enabled
- **notification_settings** - RLS enabled
- **preferences** - RLS enabled
- **customer_payment_methods** - RLS enabled
- **reviews** - RLS enabled
- **drivers** - RLS enabled
- **driver_reviews** - RLS enabled
- **vehicles** - RLS enabled
- **bookings** - RLS enabled
- **billing** - RLS enabled
- **billing_entities** - RLS enabled
- **admin_users** - RLS enabled
- **corporate_accounts** - RLS enabled
- **support_tickets** - RLS enabled
- **notifications** - RLS enabled
- **job_categories** - RLS enabled
- **driver_job_types** - RLS enabled
- **support_ticket_messages** - RLS enabled
- **feedback_templates** - RLS enabled
- **safety_incidents** - RLS enabled
- **rating_statistics** - RLS enabled

### Tabele fără RLS:

- **organizations**
- **user_organization_roles**
- **customer_ride_stats**
- **booking_assignment**
- **driver_earnings**

**Note:** Politicile RLS specifice nu sunt vizibile prin schema query - acestea ar trebui interrogate separat pentru detalii complete.

## 8. ENUM VALUES & CHECK CONSTRAINTS

### booking_type Values (din bookings):

- 'immediate' (default)

### status Values (din bookings):

- 'pending' (default)

### payment_status Values:

- 'pending' (default)

### org_type Values (din organizations):

- 'operator' (default)

### role Values (din admin_users):

- 'admin' (default)

### sender_type Values (din support_ticket_messages):

- CHECK: ('admin', 'driver', 'operator', 'customer')

### template_type Values (din feedback_templates):

- CHECK: ('driver_to_client', 'client_to_driver', 'safety_report')

### reported_by_type / reported_against_type (din safety_incidents):

- CHECK: ('driver', 'customer', 'admin')

### user_type Values (din rating_statistics):

- CHECK: ('driver', 'customer')

---

**Generated:** 2025-11-22 07:39 GMT
**Total Tables:** 26
**Active Rows:** ~86 total across all tables
