# Implementation Plan: Yatra Booking System

## Overview

This implementation plan breaks down the yatra booking system into incremental coding tasks. The system extends an existing Next.js application with Supabase authentication. Tasks are organized to build core functionality first, then layer on features progressively. Each task includes specific requirements references for traceability.

## Tasks

- [x] 1. Set up database schema and migrations
  - Create Supabase migration files for all tables (profiles, otp_verifications, yatra_packages, accommodation_options, bookings, participants, booking_accommodations, payments, refunds, notifications)
  - Define table structures with constraints, indexes, and foreign keys
  - Implement Row Level Security (RLS) policies for each table
  - Create database functions for common operations (e.g., update_updated_at_column)
  - _Requirements: 1.1, 1.2, 3.1, 4.1, 6.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 14.1, 15.1_

- [x] 2. Implement authentication and authorization module
  - [x] 2.1 Create user profile management API routes
    - Implement POST /api/auth/register endpoint with role assignment
    - Implement GET /api/auth/profile endpoint
    - Implement PUT /api/auth/profile endpoint with validation
    - Create profile update utilities
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 15.1, 15.2_
  
  - [ ]* 2.2 Write property test for profile management
    - **Property 6: Profile update round-trip**
    - **Validates: Requirements 1.4, 1.5, 15.1**
  
  - [x] 2.3 Implement WhatsApp OTP verification system
    - Create OTP generation and storage logic
    - Implement POST /api/auth/send-otp endpoint with WhatsApp integration
    - Implement POST /api/auth/verify-otp endpoint
    - Add OTP expiration and attempt limiting
    - _Requirements: 1.6, 1.7, 1.8_
  
  - [ ]* 2.4 Write property tests for OTP verification
    - **Property 3: OTP verification state transition**
    - **Validates: Requirements 1.7**
  
  - [x] 2.5 Create authorization middleware
    - Implement requireAuth middleware for role checking
    - Implement checkRole utility function
    - Add phone verification check middleware
    - _Requirements: 1.3, 1.8, 2.1, 2.2, 2.3_
  
  - [ ]* 2.6 Write property tests for authorization
    - **Property 1: Default role assignment**
    - **Property 2: Phone verification requirement**
    - **Property 4: Role-based access control**
    - **Validates: Requirements 1.2, 1.8, 1.3, 2.2, 2.3**

- [ ] 3. Checkpoint - Verify authentication system
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement yatra package management module
  - [ ] 4.1 Create package CRUD API routes for admins
    - Implement POST /api/admin/packages endpoint with draft/active status
    - Implement PUT /api/admin/packages/[id] endpoint
    - Implement POST /api/admin/packages/[id]/publish endpoint
    - Implement DELETE /api/admin/packages/[id] endpoint with booking check
    - Implement GET /api/admin/packages endpoint (all packages including drafts)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 4.2 Write property tests for package management
    - **Property 7: Package data round-trip**
    - **Property 9: Draft package visibility**
    - **Property 10: Draft to active transition**
    - **Property 11: Package deletion with bookings**
    - **Property 12: Package update preserves bookings**
    - **Validates: Requirements 3.1, 3.3, 3.4, 3.6, 3.5**
  
  - [ ] 4.3 Implement package validation logic
    - Create validation functions for dates, capacity, and pricing
    - Add image upload handling with Supabase Storage
    - Implement cancellation policy validation
    - _Requirements: 3.7, 3.8, 3.9, 3.10, 13.1, 13.2_
  
  - [ ]* 4.4 Write property tests for package validation
    - **Property 13: Date range validation**
    - **Property 14: Positive numeric validation**
    - **Validates: Requirements 3.7, 3.8, 3.9**
  
  - [ ] 4.5 Create package discovery API routes for devotees
    - Implement GET /api/packages endpoint with filtering (destination, date, price, keyword)
    - Implement GET /api/packages/[id] endpoint with accommodation options
    - Add search functionality
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 4.6 Write property tests for package discovery
    - **Property 20: Query filtering correctness**
    - **Property 21: Keyword search matching**
    - **Property 22: Active package filtering**
    - **Property 40: Package detail completeness**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5, 5.1, 5.6**

- [ ] 5. Implement accommodation management module
  - [ ] 5.1 Create accommodation CRUD API routes for admins
    - Implement POST /api/admin/packages/[id]/accommodations endpoint
    - Implement PUT /api/admin/accommodations/[id] endpoint
    - Implement DELETE /api/admin/accommodations/[id] endpoint
    - Add accommodation validation logic
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [ ]* 5.2 Write property tests for accommodation management
    - **Property 8: Accommodation data round-trip**
    - **Property 15: Accommodation nights validation**
    - **Validates: Requirements 4.3, 4.4, 4.6**

- [ ] 6. Checkpoint - Verify package and accommodation systems
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement booking management module
  - [ ] 7.1 Create booking creation logic
    - Implement POST /api/bookings endpoint
    - Add participant validation (required fields, age range)
    - Implement accommodation selection validation
    - Add seat availability checking with transaction locking
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 12.1, 12.2, 12.5, 12.6, 12.7_
  
  - [ ]* 7.2 Write property tests for booking validation
    - **Property 19: Participant details completeness**
    - **Property 18: Age range validation**
    - **Property 23: Accommodation capacity matching**
    - **Property 24: Room type capacity validation**
    - **Property 25: Mixed accommodation support**
    - **Property 31: Overbooking prevention**
    - **Validates: Requirements 6.2, 12.5, 12.6, 12.7, 6.3, 6.6, 6.1**
  
  - [ ] 7.3 Implement booking pricing calculation
    - Create calculateTotalAmount function
    - Implement base price calculation
    - Implement accommodation cost calculation
    - Add pricing breakdown to booking record
    - _Requirements: 6.7, 6.8_
  
  - [ ]* 7.4 Write property tests for pricing calculations
    - **Property 26: Total amount calculation**
    - **Property 27: Accommodation cost calculation**
    - **Validates: Requirements 6.7, 6.8**
  
  - [ ] 7.5 Create booking retrieval and management API routes
    - Implement GET /api/bookings endpoint with filtering (status, upcoming, past)
    - Implement GET /api/bookings/[id] endpoint
    - Implement POST /api/bookings/[id]/cancel endpoint
    - Implement PUT /api/bookings/[id] endpoint for modifications
    - Add modification deadline checking
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.8, 7.9_
  
  - [ ]* 7.6 Write property tests for booking management
    - **Property 20: Query filtering correctness** (for booking filters)
    - **Property 35: Cancellation state transition**
    - **Property 36: Booking modification deadline enforcement**
    - **Property 41: Booking detail completeness**
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.5, 7.8, 7.9, 7.1**

- [ ] 8. Implement payment processing module
  - [ ] 8.1 Integrate payment gateway (Razorpay or Stripe)
    - Set up payment gateway SDK
    - Implement POST /api/payments/initiate endpoint
    - Implement POST /api/payments/verify endpoint
    - Implement POST /api/payments/webhook endpoint
    - _Requirements: 9.1, 9.2_
  
  - [ ] 8.2 Create payment state management
    - Implement payment success handler (update booking, reduce seats, create notifications)
    - Implement payment failure handler
    - Add transaction management for atomic operations
    - _Requirements: 6.9, 6.10, 6.11, 9.3, 9.4, 9.5_
  
  - [ ]* 8.3 Write property tests for payment state transitions
    - **Property 33: Payment success state transition**
    - **Property 34: Payment failure state preservation**
    - **Property 42: Receipt completeness**
    - **Validates: Requirements 6.10, 9.4, 6.11, 9.5, 9.3**
  
  - [ ] 8.4 Implement refund processing
    - Create refund calculation logic based on cancellation policy
    - Implement refund initiation through payment gateway
    - Add refund record creation
    - _Requirements: 9.6, 9.7, 13.3, 13.4, 13.5_
  
  - [ ]* 8.5 Write property tests for refund calculations
    - **Property 28: Cancellation refund calculation**
    - **Validates: Requirements 9.6, 13.3**

- [ ] 9. Checkpoint - Verify booking and payment systems
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement seat availability management
  - [ ] 10.1 Create seat tracking utilities
    - Implement seat initialization on package creation
    - Implement seat decrement on booking confirmation
    - Implement seat increment on booking cancellation
    - Add fully booked status management
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_
  
  - [ ]* 10.2 Write property tests for seat management
    - **Property 29: Initial seat availability**
    - **Property 30: Seat availability invariant**
    - **Property 32: Concurrent booking safety**
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.5**

- [ ] 11. Implement notification module
  - [ ] 11.1 Set up notification infrastructure
    - Integrate WhatsApp Business API (Twilio/MessageBird)
    - Integrate email service (Resend/SendGrid)
    - Create notification record creation utilities
    - _Requirements: 10.7_
  
  - [ ] 11.2 Implement notification triggers
    - Create sendBookingConfirmation function
    - Create sendPaymentReceipt function
    - Create sendCancellationNotice function
    - Create sendStatusUpdate function
    - Create notifyAdmin function
    - Add notification to booking confirmation flow
    - Add notification to payment success flow
    - Add notification to cancellation flow
    - _Requirements: 6.12, 10.1, 10.2, 10.4, 10.5, 10.6_
  
  - [ ]* 11.3 Write property tests for notifications
    - **Property 37: Event-triggered notifications**
    - **Property 38: Admin notification on booking creation**
    - **Validates: Requirements 6.12, 10.1, 10.2, 10.4, 10.5, 10.6**
  
  - [ ] 11.4 Implement scheduled reminder system
    - Create cron job or scheduled function for 7-day reminders
    - Implement reminder query logic
    - Add reminder notification sending
    - _Requirements: 10.3_
  
  - [ ]* 11.5 Write property test for reminder scheduling
    - **Property 39: Reminder notification scheduling**
    - **Validates: Requirements 10.3**

- [ ] 12. Implement admin booking management
  - [ ] 12.1 Create admin booking API routes
    - Implement GET /api/admin/bookings endpoint with filters
    - Implement PUT /api/admin/bookings/[id]/status endpoint
    - Implement GET /api/admin/bookings/export endpoint (CSV generation)
    - Add admin cancellation logic
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_
  
  - [ ]* 12.2 Write property tests for admin booking management
    - **Property 5: Admin data access scope**
    - **Property 43: Export data completeness**
    - **Validates: Requirements 2.4, 8.1, 8.7**

- [ ] 13. Implement analytics module
  - [ ] 13.1 Create analytics calculation functions
    - Implement getTotalBookings function
    - Implement getTotalRevenue function
    - Implement getPopularDestinations function
    - Implement getBookingTrends function
    - Implement getOccupancyRate function
    - Implement getAccommodationPopularity function
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_
  
  - [ ] 13.2 Create analytics API routes
    - Implement GET /api/admin/analytics/summary endpoint
    - Implement GET /api/admin/analytics/trends endpoint
    - Implement GET /api/admin/analytics/packages endpoint
    - Add date range filtering
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_
  
  - [ ]* 13.3 Write property tests for analytics
    - **Property 44: Booking count accuracy**
    - **Property 45: Revenue calculation accuracy**
    - **Property 46: Destination ranking correctness**
    - **Property 47: Occupancy rate calculation**
    - **Property 48: Accommodation popularity ranking**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.6, 11.7**

- [ ] 14. Implement receipt generation
  - [ ] 14.1 Create PDF receipt generator
    - Set up PDF generation library (e.g., PDFKit, jsPDF)
    - Implement generateReceipt function
    - Create receipt template with all required fields
    - Implement GET /api/bookings/[id]/receipt endpoint
    - _Requirements: 7.7, 9.3_
  
  - [ ]* 14.2 Write unit tests for receipt generation
    - Test receipt contains all required fields
    - Test PDF generation for various booking scenarios
    - _Requirements: 7.7, 9.3_

- [ ] 15. Checkpoint - Verify all backend systems
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Implement frontend components for devotees
  - [ ] 16.1 Create package browsing UI
    - Build package listing page with filters
    - Build package detail page
    - Add search functionality
    - Display accommodation options
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ] 16.2 Create booking flow UI
    - Build participant details form
    - Build accommodation selection interface
    - Add pricing breakdown display
    - Implement payment integration UI
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_
  
  - [ ] 16.3 Create booking management UI
    - Build booking history page
    - Build booking detail page
    - Add cancellation interface
    - Add receipt download button
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_
  
  - [ ] 16.4 Create profile management UI
    - Build profile view/edit page
    - Add phone verification UI with OTP input
    - Add profile photo upload
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [ ] 17. Implement frontend components for admins
  - [ ] 17.1 Create package management UI
    - Build package creation form with draft/publish options
    - Build package editing interface
    - Add image upload interface
    - Build accommodation configuration UI
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [ ] 17.2 Create admin booking management UI
    - Build bookings dashboard with filters
    - Build booking detail view
    - Add status update interface
    - Add export functionality
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_
  
  - [ ] 17.3 Create analytics dashboard UI
    - Build analytics summary view
    - Add booking trends chart
    - Add popular destinations display
    - Add package performance table
    - Add date range selector
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [ ] 18. Implement input validation on frontend
  - [ ] 18.1 Add form validation
    - Implement email format validation
    - Implement phone number format validation
    - Implement date validation
    - Implement numeric validation (age, price, capacity)
    - Add real-time validation feedback
    - _Requirements: 3.7, 3.8, 3.9, 4.5, 4.6, 12.3, 12.4, 12.5_
  
  - [ ]* 18.2 Write unit tests for validation functions
    - Test email validation with valid/invalid inputs
    - Test phone validation with valid/invalid inputs
    - Test date range validation
    - Test numeric range validation
    - _Requirements: 3.7, 3.8, 3.9, 12.3, 12.4, 12.5_

- [ ] 19. Implement error handling and user feedback
  - [ ] 19.1 Create error handling utilities
    - Implement error response parser
    - Create toast/notification system for errors
    - Add loading states for async operations
    - Implement retry logic for failed requests
    - _Requirements: All error handling scenarios_
  
  - [ ] 19.2 Add user feedback mechanisms
    - Implement success notifications
    - Add confirmation dialogs for destructive actions
    - Create loading indicators
    - Add empty states for lists
    - _Requirements: All user interaction scenarios_

- [ ] 20. Final checkpoint - End-to-end testing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 21. Integration and deployment preparation
  - [ ] 21.1 Configure environment variables
    - Set up Supabase connection strings
    - Configure payment gateway credentials
    - Set up WhatsApp API credentials
    - Configure email service credentials
    - Add production environment variables
  
  - [ ] 21.2 Set up monitoring and logging
    - Implement error logging
    - Add performance monitoring
    - Set up payment webhook logging
    - Configure notification delivery tracking
  
  - [ ] 21.3 Create deployment documentation
    - Document environment setup
    - Document database migration process
    - Document external service configuration
    - Create admin user setup guide

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- Frontend tasks can be parallelized with backend tasks once APIs are stable
- All property tests should use fast-check library for TypeScript
- Each property test must include a comment tag: `Feature: yatra-booking-system, Property {number}: {property_text}`
