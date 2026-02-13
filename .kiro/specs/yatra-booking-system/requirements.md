# Requirements Document: Yatra Booking System

## Introduction

The Yatra Booking System is a comprehensive pilgrimage tour booking platform that enables devotees to discover, book, and manage spiritual journeys. The system extends an existing Next.js application with Supabase authentication to provide role-based access for regular users (devotees) and administrators. Users can browse available yatra packages, make bookings with multiple participants, verify their identity through WhatsApp OTP, and process payments. Administrators can manage yatra packages with draft/publish workflows, configure accommodation options, oversee all bookings, and access analytics dashboards.

## Glossary

- **Yatra**: A pilgrimage or spiritual journey to sacred destinations
- **Devotee**: A regular user who books yatra packages
- **Admin**: An administrator with elevated permissions to manage the system
- **Yatra_Package**: A structured pilgrimage tour offering with specific dates, destinations, and pricing
- **Booking**: A reservation made by a devotee for one or more participants on a specific yatra
- **Participant**: An individual traveling on a yatra (may include the booking user)
- **System**: The Yatra Booking System application
- **Supabase**: The backend-as-a-service platform providing authentication and database
- **Payment_Gateway**: External service (Razorpay/Stripe) handling payment processing
- **Booking_Status**: The current state of a booking (pending, confirmed, cancelled, completed)
- **Package_Status**: The current state of a yatra package (draft, active, inactive, completed)
- **Accommodation_Option**: A room type choice for participants (dormitory, 2-person room, 3-person room, etc.)
- **OTP**: One-Time Password used for phone number verification via WhatsApp

## Requirements

### Requirement 1: User Authentication and Authorization

**User Story:** As a devotee, I want to register and login to the system, so that I can book yatras and manage my bookings.

#### Acceptance Criteria

1. THE System SHALL extend the existing Supabase authentication to support user registration and login
2. WHEN a user registers, THE System SHALL assign them the "devotee" role by default
3. WHEN a user logs in successfully, THE System SHALL grant access to devotee-specific features
4. THE System SHALL maintain user profile information including name, email, phone number, and address
5. WHEN a user updates their profile, THE System SHALL persist the changes to the database immediately
6. WHEN a user registers or updates their phone number, THE System SHALL send an OTP via WhatsApp for verification
7. WHEN a user enters the correct OTP, THE System SHALL mark the phone number as verified
8. THE System SHALL require phone number verification before allowing bookings

### Requirement 2: Admin Role Management

**User Story:** As an admin, I want elevated permissions, so that I can manage yatra packages and oversee all bookings.

#### Acceptance Criteria

1. THE System SHALL support an "admin" role with elevated permissions
2. WHEN an admin logs in, THE System SHALL grant access to admin-specific features including package management and booking oversight
3. WHEN a non-admin user attempts to access admin features, THE System SHALL deny access and return an authorization error
4. THE System SHALL allow admins to view and manage all user bookings across all yatras

### Requirement 3: Yatra Package Creation and Management

**User Story:** As an admin, I want to create and manage yatra packages, so that devotees can browse and book available pilgrimages.

#### Acceptance Criteria

1. WHEN an admin creates a yatra package, THE System SHALL store the package with name, description, destinations, duration, dates, capacity, base price, inclusions, itinerary, images, and status
2. WHEN an admin creates a yatra package, THE System SHALL allow saving it as draft status
3. WHEN a package is in draft status, THE System SHALL NOT display it to devotees
4. WHEN an admin publishes a draft package, THE System SHALL change status to active and make it visible to devotees
5. WHEN an admin edits a yatra package, THE System SHALL update the package information and preserve existing bookings
6. WHEN an admin deletes a yatra package, THE System SHALL mark it as deleted only if no confirmed bookings exist
7. THE System SHALL validate that start date is before end date when creating or updating packages
8. THE System SHALL validate that capacity is a positive integer when creating or updating packages
9. THE System SHALL validate that base price is a positive number when creating or updating packages
10. WHEN an admin uploads images for a package, THE System SHALL store them in Supabase Storage and associate them with the package

### Requirement 4: Accommodation Options Configuration

**User Story:** As an admin, I want to configure accommodation options for yatra packages, so that devotees can choose their preferred room types.

#### Acceptance Criteria

1. WHEN an admin creates a yatra package, THE System SHALL allow configuration of multiple accommodation options
2. THE System SHALL support accommodation types including dormitory, 2-person room, 3-person room, and 4-person room
3. WHEN an admin configures an accommodation option, THE System SHALL store the room type, price per person per night, and availability
4. WHEN an admin specifies accommodation nights, THE System SHALL store the number of nights accommodation is provided
5. THE System SHALL validate that accommodation price is a non-negative number
6. THE System SHALL validate that accommodation nights is a positive integer not exceeding the yatra duration
7. WHEN an admin updates accommodation options, THE System SHALL preserve existing bookings with their selected accommodations

### Requirement 5: Yatra Package Discovery

**User Story:** As a devotee, I want to browse and search available yatra packages, so that I can find pilgrimages that match my preferences.

#### Acceptance Criteria

1. WHEN a devotee views the yatra listing page, THE System SHALL display all active yatra packages
2. WHEN a devotee filters by destination, THE System SHALL return only packages matching that destination
3. WHEN a devotee filters by date range, THE System SHALL return only packages with start dates within that range
4. WHEN a devotee filters by price range, THE System SHALL return only packages with base prices within that range
5. WHEN a devotee searches by keyword, THE System SHALL return packages where the keyword matches name, description, or destination
6. WHEN a devotee views a package detail page, THE System SHALL display complete package information including itinerary, inclusions, available seats, accommodation options, and images

### Requirement 6: Booking Creation with Accommodation Selection

**User Story:** As a devotee, I want to book a yatra for myself and others with accommodation choices, so that I can participate in the pilgrimage with suitable lodging.

#### Acceptance Criteria

1. WHEN a devotee selects a yatra package and number of participants, THE System SHALL verify that sufficient seats are available
2. WHEN a devotee provides participant details, THE System SHALL validate that all required fields are present (name, age, gender, contact, emergency contact)
3. WHEN a devotee selects accommodation for participants, THE System SHALL allow choosing different accommodation types for different participants
4. WHEN a devotee selects a 3-person room for 3 participants, THE System SHALL group them together for accommodation
5. WHEN a devotee selects a 2-person room for 2 participants, THE System SHALL group them together for accommodation
6. WHEN a devotee has 5 participants, THE System SHALL allow selecting combinations such as one 3-person room and one 2-person room
7. WHEN a devotee completes booking details, THE System SHALL calculate the total amount as base price multiplied by number of participants plus accommodation costs
8. WHEN calculating accommodation costs, THE System SHALL multiply accommodation price per person per night by number of nights and number of participants in each room type
9. WHEN a devotee initiates payment, THE System SHALL create a pending booking record with selected accommodations
10. WHEN payment is successful, THE System SHALL update the booking status to confirmed and reduce available seats
11. WHEN payment fails, THE System SHALL maintain the booking as pending and allow retry
12. WHEN a booking is confirmed, THE System SHALL send a confirmation email and WhatsApp message with booking details and receipt

### Requirement 7: Booking Management for Devotees

**User Story:** As a devotee, I want to view and manage my bookings, so that I can track my yatra participation and make necessary changes.

#### Acceptance Criteria

1. WHEN a devotee views their booking history, THE System SHALL display all their bookings with status, dates, package information, and accommodation details
2. WHEN a devotee filters bookings by status, THE System SHALL return only bookings matching that status
3. WHEN a devotee views upcoming yatras, THE System SHALL display confirmed bookings with start dates in the future
4. WHEN a devotee views past yatras, THE System SHALL display bookings with end dates in the past
5. WHEN a devotee cancels a booking, THE System SHALL apply the cancellation policy and update booking status to cancelled
6. WHEN a booking is cancelled, THE System SHALL restore the seats to the yatra package capacity
7. WHEN a devotee downloads a receipt, THE System SHALL generate a PDF with booking details, payment information, participant list, and accommodation breakdown
8. WHEN a devotee modifies booking details before the modification deadline, THE System SHALL update the participant information
9. WHEN a devotee attempts to modify a booking after the deadline, THE System SHALL deny the modification and display an error message

### Requirement 8: Admin Booking Management

**User Story:** As an admin, I want to view and manage all bookings, so that I can oversee yatra operations and handle issues.

#### Acceptance Criteria

1. WHEN an admin views the bookings dashboard, THE System SHALL display all bookings across all yatras
2. WHEN an admin filters bookings by yatra package, THE System SHALL return only bookings for that package
3. WHEN an admin filters bookings by date range, THE System SHALL return only bookings with yatra dates within that range
4. WHEN an admin filters bookings by status, THE System SHALL return only bookings matching that status
5. WHEN an admin views booking details, THE System SHALL display complete participant information, accommodation selections, and payment status
6. WHEN an admin updates a booking status, THE System SHALL persist the change and send notification to the devotee via email and WhatsApp
7. WHEN an admin exports booking data, THE System SHALL generate a CSV file with all booking, participant, and accommodation information
8. WHEN an admin cancels a booking on behalf of a user, THE System SHALL apply the cancellation policy and restore seats

### Requirement 9: Payment Processing

**User Story:** As a devotee, I want to pay for my booking securely, so that I can confirm my yatra participation.

#### Acceptance Criteria

1. WHEN a devotee initiates payment, THE System SHALL integrate with Payment_Gateway to process the transaction
2. THE System SHALL support UPI, credit cards, debit cards, and net banking payment methods
3. WHEN payment is successful, THE System SHALL generate a payment receipt with transaction ID, base amount, accommodation charges, and total amount
4. WHEN payment is successful, THE System SHALL update the booking payment status to paid
5. WHEN payment fails, THE System SHALL maintain the booking as pending and display an error message
6. WHEN a booking is cancelled, THE System SHALL calculate the refund amount based on cancellation policy
7. WHEN a refund is processed, THE System SHALL initiate the refund through Payment_Gateway and update payment status

### Requirement 10: Notification System

**User Story:** As a devotee, I want to receive notifications about my bookings, so that I stay informed about my yatra status.

#### Acceptance Criteria

1. WHEN a booking is confirmed, THE System SHALL send an email notification and WhatsApp message to the devotee with booking details
2. WHEN payment is successful, THE System SHALL send an email notification and WhatsApp message with payment receipt
3. WHEN a yatra start date is 7 days away, THE System SHALL send a reminder email and WhatsApp message to all confirmed participants
4. WHEN a booking is cancelled, THE System SHALL send a cancellation confirmation via email and WhatsApp
5. WHEN an admin updates a booking status, THE System SHALL send a notification via email and WhatsApp to the devotee
6. WHEN a new booking is created, THE System SHALL send a notification email to admins
7. THE System SHALL integrate with WhatsApp Business API for sending WhatsApp notifications

### Requirement 11: Admin Analytics Dashboard

**User Story:** As an admin, I want to view analytics and reports, so that I can understand booking trends and system performance.

#### Acceptance Criteria

1. WHEN an admin views the analytics dashboard, THE System SHALL display total bookings count for the selected period
2. WHEN an admin views the analytics dashboard, THE System SHALL display total revenue including base prices and accommodation charges for the selected period
3. WHEN an admin views the analytics dashboard, THE System SHALL display the most popular destinations based on booking count
4. WHEN an admin views the analytics dashboard, THE System SHALL display booking trends over time as a chart
5. WHEN an admin filters analytics by date range, THE System SHALL recalculate metrics for that period
6. WHEN an admin views package performance, THE System SHALL display occupancy rate for each yatra package
7. WHEN an admin views accommodation analytics, THE System SHALL display the most popular accommodation types

### Requirement 12: Data Validation and Integrity

**User Story:** As a system architect, I want robust data validation, so that the system maintains data integrity and prevents errors.

#### Acceptance Criteria

1. WHEN a booking is created, THE System SHALL verify that the yatra package has sufficient available seats
2. WHEN multiple users book simultaneously, THE System SHALL use database transactions to prevent overbooking
3. WHEN a user provides an email address, THE System SHALL validate the email format
4. WHEN a user provides a phone number, THE System SHALL validate the phone number format for Indian mobile numbers
5. WHEN participant age is provided, THE System SHALL validate that age is between 1 and 120
6. WHEN accommodation selections are made, THE System SHALL validate that participant count matches accommodation capacity
7. WHEN a devotee selects a 3-person room, THE System SHALL validate that exactly 3 participants are assigned to it

### Requirement 13: Cancellation Policy Management

**User Story:** As an admin, I want to define cancellation policies for yatra packages, so that refunds are processed consistently.

#### Acceptance Criteria

1. WHEN an admin creates a yatra package, THE System SHALL allow specification of cancellation policy rules
2. THE System SHALL support tiered refund percentages based on days before yatra start date
3. WHEN a devotee cancels a booking, THE System SHALL calculate the refund amount based on the applicable cancellation policy
4. WHEN a cancellation occurs more than 30 days before start date, THE System SHALL apply the full refund percentage
5. WHEN a cancellation occurs less than 7 days before start date, THE System SHALL apply the minimal refund percentage
6. WHEN displaying cancellation policy, THE System SHALL show the policy clearly before booking confirmation

### Requirement 14: Seat Availability Management

**User Story:** As a system, I want to accurately track seat availability, so that yatras are not overbooked.

#### Acceptance Criteria

1. WHEN a yatra package is created, THE System SHALL initialize available seats equal to the capacity
2. WHEN a booking is confirmed, THE System SHALL decrement available seats by the number of participants
3. WHEN a booking is cancelled, THE System SHALL increment available seats by the number of participants
4. WHEN available seats reach zero, THE System SHALL mark the yatra package as fully booked
5. WHEN a devotee attempts to book more seats than available, THE System SHALL reject the booking and display an error message
6. WHEN displaying a yatra package, THE System SHALL show the current number of available seats

### Requirement 15: User Profile Management

**User Story:** As a devotee, I want to manage my profile information, so that my contact details are current for bookings.

#### Acceptance Criteria

1. WHEN a devotee views their profile, THE System SHALL display their name, email, phone number, and address
2. WHEN a devotee updates their profile, THE System SHALL validate all required fields are present
3. WHEN a devotee changes their email, THE System SHALL send a verification email to the new address
4. WHEN a devotee changes their phone number, THE System SHALL send an OTP via WhatsApp for verification
5. WHEN a devotee changes their password, THE System SHALL require the current password for verification
6. THE System SHALL allow devotees to upload a profile photo stored in Supabase Storage
