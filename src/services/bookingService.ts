// Types
export interface BookingData {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  cleaningService?: boolean;
  airportPickup?: boolean;
  earlyCheckIn?: boolean;
  billingData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    apartment?: string;
    floor?: string;
    street?: string;
    building?: string;
    postal_code?: string;
    city?: string;
    country?: string;
    state?: string;
  };
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  paymentUrl: string;
  confirmationCode: string;
  error?: string;
}

export interface Booking {
  id: string;
  property: {
    id: string;
    title: string;
    location: string;
    address: string;
    images: string[];
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  currency: string;
  bookingStatus: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  confirmationCode: string;
  specialRequests?: string;
  cleaningService?: boolean;
  airportPickup?: boolean;
  earlyCheckIn?: boolean;
  paymobData?: {
    transactionId: string;
    orderId: string;
  };
  cancellationPolicy?: {
    canCancel: boolean;
    refundPercentage: number;
    cancelledAt?: string;
    cancellationReason?: string;
  };
  createdAt: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AvailabilityResponse {
  success: boolean;
  available: boolean;
  error?: string;
}

export interface PriceResponse {
  success: boolean;
  totalPrice: number;
  error?: string;
}

export interface CancelResponse {
  success: boolean;
  refundAmount: number;
  refundPercentage: number;
  error?: string;
}

export interface AvailabilitySummary {
  totalDays: number;
  availableDays: number;
  blockedDays: number;
  dates: Array<{
    date: string;
    available: boolean;
    price: number;
    bookingId?: string;
  }>;
}

class BookingService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    console.log('🔗 BookingService: Initializing with base URL:', this.baseUrl);
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData: BookingData): Promise<BookingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        bookingId: '',
        paymentUrl: '',
        confirmationCode: '',
        error: 'An error occurred while creating the booking'
      };
    }
  }

  /**
   * Get user bookings
   */
  async getUserBookings(userId: string, status?: string): Promise<Booking[]> {
    try {
      const url = status && status !== 'all' 
        ? `${this.baseUrl}/user/${userId}?status=${status}`
        : `${this.baseUrl}/user/${userId}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        return data.bookings;
      } else {
        throw new Error(data.error || 'Failed to get user bookings');
      }
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  }

  /**
   * Get booking details
   */
  async getBookingDetails(bookingId: string): Promise<Booking | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${bookingId}`);
      const data = await response.json();

      if (data.success) {
        return data.booking;
      } else {
        throw new Error(data.error || 'Failed to get booking details');
      }
    } catch (error) {
      console.error('Error getting booking details:', error);
      return null;
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string, reason: string): Promise<CancelResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        refundAmount: 0,
        refundPercentage: 0,
        error: 'An error occurred while cancelling the booking'
      };
    }
  }

  /**
   * Check availability for a date range
   */
  async checkAvailability(propertyId: string, dates: DateRange): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          checkIn: dates.startDate,
          checkOut: dates.endDate
        })
      });

      const data = await response.json();
      return data.success ? data.available : false;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }

  /**
   * Calculate price for a date range
   */
  async calculatePrice(propertyId: string, dates: DateRange): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/calculate-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          checkIn: dates.startDate,
          checkOut: dates.endDate
        })
      });

      const data = await response.json();
      return data.success ? data.totalPrice : 0;
    } catch (error) {
      console.error('Error calculating price:', error);
      return 0;
    }
  }

  /**
   * Get property availability summary
   */
  async getAvailabilitySummary(propertyId: string, startDate: string, endDate: string): Promise<AvailabilitySummary | null> {
    try {
      const response = await fetch(`${this.baseUrl}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          startDate,
          endDate
        })
      });

      const data = await response.json();
      return data.success ? data.availability : null;
    } catch (error) {
      console.error('Error getting availability summary:', error);
      return null;
    }
  }

  /**
   * Resend confirmation email
   */
  async resendConfirmationEmail(bookingId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${bookingId}/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'confirmation' })
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      return false;
    }
  }

  /**
   * Get booking statistics (admin only)
   */
  async getBookingStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/stats`);
      const data = await response.json();
      return data.success ? data.stats : null;
    } catch (error) {
      console.error('Error getting booking stats:', error);
      return null;
    }
  }

  /**
   * Get all bookings (admin only)
   */
  async getAllBookings(page: number = 1, limit: number = 10, status?: string): Promise<any> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status && status !== 'all') {
        params.append('status', status);
      }

      const response = await fetch(`${this.baseUrl}/admin/all?${params}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting all bookings:', error);
      return { success: false, bookings: [], pagination: {} };
    }
  }

  /**
   * Update booking status (admin only)
   */
  async updateBookingStatus(bookingId: string, status: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  }

  /**
   * Resend email (admin only)
   */
  async resendEmail(bookingId: string, type: 'confirmation' | 'receipt' | 'cancellation'): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/${bookingId}/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type })
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error resending email:', error);
      return false;
    }
  }

  /**
   * Validate booking data
   */
  validateBookingData(data: BookingData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.propertyId) {
      errors.push('Property ID is required');
    }

    if (!data.checkIn) {
      errors.push('Check-in date is required');
    }

    if (!data.checkOut) {
      errors.push('Check-out date is required');
    }

    if (data.checkIn && data.checkOut) {
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        errors.push('Check-in date cannot be in the past');
      }

      if (checkOutDate <= checkInDate) {
        errors.push('Check-out date must be after check-in date');
      }
    }

    if (!data.guests || data.guests < 1) {
      errors.push('Number of guests must be at least 1');
    }

    if (!data.billingData.first_name) {
      errors.push('First name is required');
    }

    if (!data.billingData.last_name) {
      errors.push('Last name is required');
    }

    if (!data.billingData.email) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(data.billingData.email)) {
      errors.push('Email format is invalid');
    }

    if (!data.billingData.phone_number) {
      errors.push('Phone number is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format booking dates for display
   */
  formatBookingDates(checkIn: string, checkOut: string): string {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return `${checkInDate.toLocaleDateString('en-US', options)} - ${checkOutDate.toLocaleDateString('en-US', options)}`;
  }

  /**
   * Calculate number of nights
   */
  calculateNights(checkIn: string, checkOut: string): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get booking status color
   */
  getBookingStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'text-yellow-800 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-800 bg-blue-100';
      case 'active':
        return 'text-green-800 bg-green-100';
      case 'completed':
        return 'text-gray-800 bg-gray-100';
      case 'cancelled':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  }

  /**
   * Get payment status color
   */
  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'text-yellow-800 bg-yellow-100';
      case 'paid':
        return 'text-green-800 bg-green-100';
      case 'failed':
        return 'text-red-800 bg-red-100';
      case 'refunded':
        return 'text-blue-800 bg-blue-100';
      case 'cancelled':
        return 'text-gray-800 bg-gray-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  }

  /**
   * Get bookings for a specific property
   */
  async getBookingsByPropertyId(propertyId: string): Promise<Booking[]> {
    try {
      const response = await fetch(`${this.baseUrl}/bookings/property/${propertyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching bookings by property ID:', error);
      throw new Error(error.message || 'Failed to fetch bookings');
    }
  }
}

// Create and export a singleton instance
const bookingService = new BookingService();
export default bookingService;