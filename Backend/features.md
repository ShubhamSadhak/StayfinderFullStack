# Stayfinder Backend Features

This project is a Node.js and Express backend for a PG (paying guest) discovery and booking platform. It uses MongoDB with Mongoose, JWT-based authentication, cookie support, and Twilio OTP verification.

## Core Platform Features

- REST API organized under `/api/v1`
- MongoDB persistence with Mongoose models
- Express 5 server with JSON, URL-encoded, cookie, CORS, and static file middleware
- Health check endpoint for basic uptime monitoring

## Authentication And User Account Features

- User registration for two roles:
  - `Customer`
  - `PG_Owner`
- Login with email and password
- Logout that clears stored refresh token and auth cookies
- JWT access token and refresh token generation
- Protected routes using auth middleware
- Current user profile fetch
- Profile update for name, phone, email, and location
- Password change flow for authenticated users

## Phone Verification Features

- OTP sending through Twilio Verify
- OTP verification before account registration
- Verified phone numbers tracked in the database
- Registration is blocked until the phone number is verified

## PG Listing Features

- PG owners can create PG listings
- Authenticated users can fetch all PG listings
- Authenticated users can fetch a single PG by ID
- PG owners can update only their own listings
- PG owners can delete only their own listings

### PG listing data supported

- PG name
- Location:
  - state
  - city
  - pincode
- Price
- Food availability
- Wi-Fi availability
- Gender preference:
  - `Male`
  - `Female`
  - `Unisex`
- Room sharing type:
  - `Single`
  - `Double`
  - `Triple`
- Availability status:
  - `Available`
  - `Not Available`

## Booking Features

- Customers can book a PG
- Bookings are linked to both the customer and the PG
- Customers can view their own bookings
- Customers can cancel their own bookings

### Booking data supported

- PG reference
- Customer reference
- From date
- To date
- Room type:
  - `Single`
  - `Double`
  - `Triple`
- Food preference
- Booking status:
  - `Pending`
  - `Confirmed`
  - `Cancelled`

## Review Features

- Customers can submit reviews for PGs
- One customer can submit only one review per PG
- Customers can update their own reviews
- Customers can delete their own reviews
- Reviews store text feedback and numeric rating

## Authorization Rules

- Only `PG_Owner` users can create PG listings
- Only the owner of a PG can update or delete that PG
- Only `Customer` users can create bookings
- Only `Customer` users can create reviews
- Users can only cancel their own bookings
- Users can only update or delete their own reviews

## API Route Groups

### User routes

- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `POST /api/v1/users/logout`
- `POST /api/v1/users/change-password`
- `PATCH /api/v1/users/update-account`
- `GET /api/v1/users/current-user`
- `POST /api/v1/users/review`
- `PUT /api/v1/users/updatereview`
- `DELETE /api/v1/users/deletereview`

### PG routes

- `POST /api/v1/pg/addpg`
- `GET /api/v1/pg/getpg`
- `GET /api/v1/pg/getpg/:pgId`
- `PUT /api/v1/pg/updatepg/:pgId`
- `DELETE /api/v1/pg/deletepg/:pgId`

### Booking routes

- `POST /api/v1/booking/bookpg`
- `GET /api/v1/booking/getbookings`
- `PATCH /api/v1/booking/cancelbooking/:bookingId`

### OTP routes

- `POST /api/v1/otp/send-otp`
- `POST /api/v1/otp/verify-otp`

### Health route

- `GET /api/v1/health/healthCheck`

## Data Models Present

- `User`
- `PG`
- `Booking`
- `Review`
- `VerifiedPhone`

## Utilities And Infrastructure

- Async error wrapper utility
- Standard API response utility
- Standard API error utility
- Environment-variable-driven configuration
- Database name configured as `stayfinder`
