# PropSisters Booking API Documentation

## Overview

This document provides comprehensive API documentation for the PropSisters booking system with Paymob payment integration.

## Base URL

```
https://api.propsiss.com/api/bookings
```

## Authentication

Most endpoints require authentication. Include the user token in the request headers:

```
Authorization: Bearer <user_token>
```

## Endpoints

### 1. Create Booking

**POST** `/create`

Creates a new booking and initiates Paymob payment.

#### Request Body

```json
{
  "propertyId": "string",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-18",
  "guests": 2,
  "specialRequests": "Late check-in requested",
  "cleaningService": true,
  "airportPickup": false,
  "earlyCheckIn": true,
  "billingData": {
    "first_name": "Ahmed",
    "last_name": "Hassan",
    "email": "ahmed@example.com",
    "phone_number": "+201234567890",
    "apartment": "Apt 5B",
    "floor": "5",
    "street": "Tahrir Square",
    "building": "Building 123",
    "postal_code": "11511",
    "city": "Cairo",
    "country": "EG",
    "state": "Cairo"
  }
}
```

#### Response

```json
{
  "success": true,
  "bookingId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "paymentUrl": "https://accept.paymob.com/api/acceptance/iframes/12345?payment_token=abc123",
  "confirmationCode": "BK001234"
}
```

### 2. Handle Payment Callback

**POST** `/payment/callback`

Handles Paymob payment callbacks and updates booking status.

#### Request Body (from Paymob)

```json
{
  "hmac": "calculated_hmac_hash",
  "transaction_id": "123456789",
  "order_id": "ORD001",
  "success": "true",
  "error_occured": false,
  "data": {
    "amount_cents": 150000,
    "created_at": "2024-01-15T10:30:00Z",
    "currency": "EGP",
    "id": 123456789,
    "success": true
  }
}
```

#### Response

```json
{
  "success": true
}
```

### 3. Get User Bookings

**GET** `/user/:userId`

Retrieves all bookings for a specific user.

#### Query Parameters

- `status` (optional): Filter by booking status (`pending`, `confirmed`, `active`, `completed`, `cancelled`)

#### Response

```json
{
  "success": true,
  "bookings": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "property": {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "title": "Luxury Apartment in Downtown",
        "location": "Cairo, Egypt",
        "images": ["image1.jpg", "image2.jpg"]
      },
      "checkIn": "2024-01-15T00:00:00.000Z",
      "checkOut": "2024-01-18T00:00:00.000Z",
      "guests": 2,
      "totalAmount": 1500,
      "currency": "EGP",
      "bookingStatus": "confirmed",
      "paymentStatus": "paid",
      "confirmationCode": "BK001234",
      "createdAt": "2024-01-10T10:30:00.000Z"
    }
  ]
}
```

### 4. Get Booking Details

**GET** `/:id`

Retrieves detailed information about a specific booking.

#### Response

```json
{
  "success": true,
  "booking": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "property": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Luxury Apartment in Downtown",
      "location": "Cairo, Egypt",
      "address": "123 Tahrir Square, Cairo",
      "images": ["image1.jpg", "image2.jpg"]
    },
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "Ahmed Hassan",
      "email": "ahmed@example.com"
    },
    "checkIn": "2024-01-15T00:00:00.000Z",
    "checkOut": "2024-01-18T00:00:00.000Z",
    "guests": 2,
    "totalAmount": 1500,
    "currency": "EGP",
    "bookingStatus": "confirmed",
    "paymentStatus": "paid",
    "confirmationCode": "BK001234",
    "specialRequests": "Late check-in requested",
    "cleaningService": true,
    "airportPickup": false,
    "earlyCheckIn": true,
    "paymobData": {
      "transactionId": "123456789",
      "orderId": "ORD001"
    },
    "cancellationPolicy": {
      "canCancel": true,
      "refundPercentage": 100
    },
    "createdAt": "2024-01-10T10:30:00.000Z"
  }
}
```

### 5. Cancel Booking

**POST** `/:id/cancel`

Cancels a booking and processes refund if applicable.

#### Request Body

```json
{
  "reason": "Travel plans changed"
}
```

#### Response

```json
{
  "success": true,
  "refundAmount": 1125,
  "refundPercentage": 75
}
```

### 6. Check Availability

**POST** `/check-availability`

Checks if a property is available for the specified dates.

#### Request Body

```json
{
  "propertyId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-18"
}
```

#### Response

```json
{
  "success": true,
  "available": true
}
```

### 7. Calculate Price

**POST** `/calculate-price`

Calculates the total price for a booking including dynamic pricing.

#### Request Body

```json
{
  "propertyId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-18"
}
```

#### Response

```json
{
  "success": true,
  "totalPrice": 1500
}
```

### 8. Get Availability Summary

**POST** `/availability`

Gets detailed availability information for a property date range.

#### Request Body

```json
{
  "propertyId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

#### Response

```json
{
  "success": true,
  "availability": {
    "totalDays": 31,
    "availableDays": 25,
    "blockedDays": 6,
    "dates": [
      {
        "date": "2024-01-01",
        "available": true,
        "price": 500,
        "bookingId": null
      },
      {
        "date": "2024-01-02",
        "available": false,
        "price": 500,
        "bookingId": "64f8a1b2c3d4e5f6a7b8c9d0"
      }
    ]
  }
}
```

## Admin Endpoints

### 9. Get All Bookings (Admin)

**GET** `/admin/all`

Retrieves all bookings with pagination and filtering.

#### Query Parameters

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by booking status

#### Response

```json
{
  "success": true,
  "bookings": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "property": {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "title": "Luxury Apartment in Downtown",
        "location": "Cairo, Egypt"
      },
      "user": {
        "id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "Ahmed Hassan",
        "email": "ahmed@example.com"
      },
      "checkIn": "2024-01-15T00:00:00.000Z",
      "checkOut": "2024-01-18T00:00:00.000Z",
      "guests": 2,
      "totalAmount": 1500,
      "currency": "EGP",
      "bookingStatus": "confirmed",
      "paymentStatus": "paid",
      "confirmationCode": "BK001234",
      "createdAt": "2024-01-10T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50
  }
}
```

### 10. Update Booking Status (Admin)

**PATCH** `/admin/:id/status`

Updates the status of a booking.

#### Request Body

```json
{
  "status": "confirmed",
  "reason": "Payment verified"
}
```

#### Response

```json
{
  "success": true,
  "booking": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "bookingStatus": "confirmed",
    "paymentStatus": "paid",
    "confirmationCode": "BK001234"
  }
}
```

### 11. Get Booking Statistics (Admin)

**GET** `/admin/stats`

Retrieves booking statistics for the admin dashboard.

#### Response

```json
{
  "success": true,
  "stats": {
    "totalBookings": 150,
    "pendingBookings": 5,
    "confirmedBookings": 120,
    "activeBookings": 15,
    "completedBookings": 8,
    "cancelledBookings": 2,
    "totalRevenue": 150000
  }
}
```

### 12. Resend Email (Admin)

**POST** `/admin/:id/resend-email`

Resends booking-related emails.

#### Request Body

```json
{
  "type": "confirmation"
}
```

#### Response

```json
{
  "success": true,
  "message": "confirmation email sent successfully"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Paymob Integration

### Payment Flow

1. **Create Booking**: User creates booking, system generates Paymob order and payment key
2. **Redirect to Payment**: User is redirected to Paymob iframe for payment
3. **Payment Processing**: Paymob processes payment and sends callback
4. **Callback Handling**: System verifies HMAC and updates booking status
5. **Confirmation**: System sends confirmation emails and blocks calendar dates

### Paymob Configuration

Required environment variables:

```env
PAYMOB_API_KEY=your_api_key
PAYMOB_INTEGRATION_ID=your_integration_id
PAYMOB_IFRAME_ID=your_iframe_id
PAYMOB_HMAC_SECRET=your_hmac_secret
```

### Supported Payment Methods

- Credit/Debit Cards (Visa, Mastercard, American Express)
- Mobile Wallets (Vodafone Cash, Orange Money, Etisalat Cash)
- Bank Transfer (Fawry, InstaPay)
- Valu (Buy now, pay later)

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per hour per IP
- **Payment endpoints**: 10 requests per hour per IP
- **Admin endpoints**: 1000 requests per hour per authenticated user

## Webhooks

The system supports Paymob webhooks for payment notifications:

- **Payment Success**: Booking confirmed, emails sent
- **Payment Failure**: Booking cancelled, admin notified
- **Refund Processed**: Booking status updated

## Testing

### Test Data

Use the seed script to create test bookings:

```bash
cd admin-console
node utils/seedBookings.js
```

### Test Scenarios

1. **Successful Booking Flow**
   - Create booking → Paymob payment → Confirmation
2. **Payment Failure**
   - Create booking → Payment fails → Booking cancelled
3. **Cancellation Flow**
   - Cancel booking → Refund processed → Calendar unblocked
4. **Admin Management**
   - View bookings → Update status → Resend emails

## Support

For API support and questions:

- **Email**: support@propsisters.com
- **Documentation**: This file
- **Status Page**: https://status.propsisters.com
