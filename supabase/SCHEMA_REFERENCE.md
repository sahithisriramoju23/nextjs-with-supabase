# Database Schema Reference

Quick reference guide for the Yatra Booking System database schema.

## Table Relationships

```
auth.users (Supabase Auth)
    ↓
profiles (1:1)
    ↓
bookings (1:N)
    ↓
    ├── participants (1:N)
    ├── booking_accommodations (1:N)
    ├── payments (1:N)
    │   └── refunds (1:N)
    └── notifications (1:N)

yatra_packages (1:N)
    ↓
    ├── accommodation_options (1:N)
    └── bookings (1:N)
```

## Tables Overview

### 1. profiles
Extends Supabase auth.users with additional user information.

**Key Fields:**
- `id` (UUID, PK, FK to auth.users)
- `role` (TEXT) - 'devotee' or 'admin'
- `phone_verified` (BOOLEAN)

**Relationships:**
- References: `auth.users(id)`
- Referenced by: `yatra_packages.created_by`, `bookings.user_id`

### 2. otp_verifications
Stores OTP codes for phone verification.

**Key Fields:**
- `phone` (TEXT)
- `otp` (TEXT)
- `expires_at` (TIMESTAMPTZ)
- `attempts` (INTEGER)

**Indexes:**
- `idx_otp_phone`
- `idx_otp_expires_at`

### 3. yatra_packages
Pilgrimage tour packages with draft/publish workflow.

**Key Fields:**
- `status` (TEXT) - 'draft', 'active', 'inactive', 'completed'
- `capacity` (INTEGER)
- `available_seats` (INTEGER)
- `base_price` (DECIMAL)
- `cancellation_policy` (JSONB)

**Constraints:**
- `start_date < end_date`
- `capacity > 0`
- `available_seats >= 0`

**Relationships:**
- References: `profiles(id)` via `created_by`
- Referenced by: `accommodation_options`, `bookings`

### 4. accommodation_options
Room types available for each yatra package.

**Key Fields:**
- `room_type` (TEXT) - 'dormitory', '2-person', '3-person', '4-person'
- `price_per_person_per_night` (DECIMAL)
- `nights` (INTEGER)

**Relationships:**
- References: `yatra_packages(id)`
- Referenced by: `booking_accommodations`

### 5. bookings
Booking records for yatra packages.

**Key Fields:**
- `status` (TEXT) - 'pending', 'confirmed', 'cancelled', 'completed'
- `payment_status` (TEXT) - 'pending', 'paid', 'refunded', 'partially_refunded'
- `total_amount` (DECIMAL)
- `base_amount` (DECIMAL)
- `accommodation_amount` (DECIMAL)

**Relationships:**
- References: `profiles(id)`, `yatra_packages(id)`
- Referenced by: `participants`, `booking_accommodations`, `payments`

### 6. participants
Individual travelers in a booking.

**Key Fields:**
- `name` (TEXT)
- `age` (INTEGER) - CHECK: 1-120
- `gender` (TEXT) - 'male', 'female', 'other'
- `contact` (TEXT)
- `emergency_contact` (TEXT)

**Relationships:**
- References: `bookings(id)` with CASCADE delete

### 7. booking_accommodations
Accommodation selections for bookings.

**Key Fields:**
- `room_type` (TEXT)
- `participant_count` (INTEGER)
- `participant_ids` (UUID[])
- `total_cost` (DECIMAL)

**Relationships:**
- References: `bookings(id)`, `accommodation_options(id)` with CASCADE delete

### 8. payments
Payment transaction records.

**Key Fields:**
- `gateway` (TEXT) - 'razorpay', 'stripe'
- `status` (TEXT) - 'created', 'pending', 'success', 'failed'
- `gateway_order_id` (TEXT)
- `gateway_payment_id` (TEXT)

**Relationships:**
- References: `bookings(id)`
- Referenced by: `refunds`

### 9. refunds
Refund records for cancelled bookings.

**Key Fields:**
- `amount` (DECIMAL)
- `status` (TEXT) - 'pending', 'processed', 'failed'
- `gateway_refund_id` (TEXT)

**Relationships:**
- References: `payments(id)`, `bookings(id)`

### 10. notifications
Email and WhatsApp notification records.

**Key Fields:**
- `type` (TEXT) - 'booking_confirmation', 'payment_receipt', 'reminder', 'cancellation', 'status_update'
- `channel` (TEXT) - 'email', 'whatsapp'
- `status` (TEXT) - 'pending', 'sent', 'failed'

**Relationships:**
- References: `profiles(id)`

## Row Level Security (RLS) Policies

### Access Patterns

**Devotees (regular users):**
- Can view their own profile
- Can view active yatra packages
- Can create and view their own bookings
- Can view their own participants, accommodations, payments, refunds
- Can view their own notifications

**Admins:**
- Can view all profiles
- Can view all yatra packages (including drafts)
- Can create, update, delete yatra packages
- Can view and manage all bookings
- Can view all payments, refunds, notifications

**System (service role):**
- Can insert/update payments, refunds, notifications

## Common Queries

### Get active packages with accommodation options
```sql
SELECT 
  yp.*,
  json_agg(ao.*) as accommodations
FROM yatra_packages yp
LEFT JOIN accommodation_options ao ON ao.package_id = yp.id
WHERE yp.status = 'active' AND yp.deleted_at IS NULL
GROUP BY yp.id;
```

### Get user bookings with details
```sql
SELECT 
  b.*,
  yp.name as package_name,
  yp.start_date,
  yp.end_date,
  json_agg(DISTINCT p.*) as participants,
  json_agg(DISTINCT ba.*) as accommodations
FROM bookings b
JOIN yatra_packages yp ON b.package_id = yp.id
LEFT JOIN participants p ON p.booking_id = b.id
LEFT JOIN booking_accommodations ba ON ba.booking_id = b.id
WHERE b.user_id = 'USER_ID'
GROUP BY b.id, yp.id;
```

### Calculate total revenue
```sql
SELECT 
  SUM(total_amount) as total_revenue,
  COUNT(*) as total_bookings
FROM bookings
WHERE status = 'confirmed'
AND payment_status = 'paid';
```

### Check seat availability
```sql
SELECT 
  id,
  name,
  capacity,
  available_seats,
  (capacity - available_seats) as booked_seats,
  ROUND((capacity - available_seats)::numeric / capacity * 100, 2) as occupancy_rate
FROM yatra_packages
WHERE status = 'active';
```

## Triggers

### update_updated_at_column()
Automatically updates the `updated_at` timestamp on row updates.

**Applied to:**
- profiles
- yatra_packages
- accommodation_options
- bookings
- payments

## Indexes

All tables have appropriate indexes for:
- Foreign keys
- Status fields
- Date fields
- Frequently queried fields

See migration file for complete index list.

## Data Validation

### Constraints
- Date ranges: `start_date < end_date`
- Positive values: capacity, price, age
- Age range: 1-120
- Enum values: status, role, gender, room_type, etc.

### Application-Level Validation
Additional validation should be implemented in the application layer:
- Email format validation
- Phone number format validation (Indian mobile: 10 digits)
- Accommodation capacity matching participant count
- Seat availability before booking
- Cancellation policy calculation

## Security Considerations

1. **RLS Enabled**: All tables have RLS enabled
2. **Service Role**: Use service role for system operations (payments, notifications)
3. **User Context**: Always use `auth.uid()` for user-specific queries
4. **Admin Checks**: Admin role checks in policies prevent unauthorized access
5. **Cascade Deletes**: Properly configured to maintain referential integrity

## Maintenance

### Regular Tasks
1. Clean up expired OTP verifications
2. Archive completed yatras
3. Monitor notification delivery status
4. Review failed payments and refunds

### Monitoring Queries
```sql
-- Expired OTPs
SELECT COUNT(*) FROM otp_verifications 
WHERE expires_at < NOW() AND verified = false;

-- Pending notifications
SELECT COUNT(*) FROM notifications 
WHERE status = 'pending' AND created_at < NOW() - INTERVAL '1 hour';

-- Failed payments
SELECT COUNT(*) FROM payments 
WHERE status = 'failed' AND created_at > NOW() - INTERVAL '24 hours';
```
