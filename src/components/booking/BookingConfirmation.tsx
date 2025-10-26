import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, Mail, Phone, MapPin, Calendar, Users, CreditCard } from 'lucide-react';

interface BookingConfirmationProps {
  bookingId: string;
}

interface BookingDetails {
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
  bookingStatus: string;
  paymentStatus: string;
  confirmationCode: string;
  specialRequests: string;
  cleaningService: boolean;
  airportPickup: boolean;
  earlyCheckIn: boolean;
  paymobData: {
    transactionId: string;
    orderId: string;
  };
  createdAt: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ bookingId }) => {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();

      if (data.success) {
        setBooking(data.booking);
      } else {
        setError(data.error || 'Failed to load booking details');
      }
    } catch (error) {
      setError('An error occurred while loading booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReceipt = () => {
    // Generate and download PDF receipt
    const receiptData = {
      booking,
      downloadDate: new Date().toLocaleDateString()
    };
    
    // This would typically generate a PDF using a library like jsPDF
    console.log('Downloading receipt:', receiptData);
    alert('Receipt download functionality would be implemented here');
  };

  const sendEmailConfirmation = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'confirmation' })
      });

      if (response.ok) {
        alert('Confirmation email sent successfully!');
      } else {
        alert('Failed to send confirmation email');
      }
    } catch (error) {
      alert('Error sending confirmation email');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error || 'Booking not found'}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getNights = () => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Success Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <CheckCircle className="w-12 h-12 text-green-500 mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-green-800">Booking Confirmed!</h1>
            <p className="text-green-600">Your reservation has been successfully confirmed</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Check-in</p>
                  <p className="text-gray-600">{formatDate(booking.checkIn)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Check-out</p>
                  <p className="text-gray-600">{formatDate(booking.checkOut)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Guests</p>
                  <p className="text-gray-600">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Confirmation Code</p>
                  <p className="text-gray-600 font-mono">{booking.confirmationCode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Property Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{booking.property.title}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{booking.property.location}</span>
                </div>
                <p className="text-gray-600 mt-2">{booking.property.address}</p>
              </div>
              
              {booking.property.images && booking.property.images.length > 0 && (
                <div className="mt-4">
                  <img
                    src={booking.property.images[0]}
                    alt={booking.property.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Services */}
          {(booking.cleaningService || booking.airportPickup || booking.earlyCheckIn) && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Additional Services</h2>
              <div className="space-y-2">
                {booking.cleaningService && (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Cleaning Service</span>
                  </div>
                )}
                {booking.airportPickup && (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Airport Pickup</span>
                  </div>
                )}
                {booking.earlyCheckIn && (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Early Check-in</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Special Requests</h2>
              <p className="text-gray-600">{booking.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Base Price ({getNights()} nights)</span>
                <span>{booking.totalAmount} {booking.currency}</span>
              </div>
              
              {booking.cleaningService && (
                <div className="flex justify-between">
                  <span>Cleaning Service</span>
                  <span>50 {booking.currency}</span>
                </div>
              )}
              
              {booking.airportPickup && (
                <div className="flex justify-between">
                  <span>Airport Pickup</span>
                  <span>100 {booking.currency}</span>
                </div>
              )}
              
              {booking.earlyCheckIn && (
                <div className="flex justify-between">
                  <span>Early Check-in</span>
                  <span>25 {booking.currency}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span>{booking.totalAmount} {booking.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            
            <div className="space-y-3">
              <button
                onClick={downloadReceipt}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </button>
              
              <button
                onClick={sendEmailConfirmation}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Resend Email
              </button>
              
              <a
                href="/bookings"
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                View All Bookings
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Need Help?</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <a href="mailto:support@propsisters.com" className="text-blue-600 hover:text-blue-800">
                    support@propsisters.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <a href="tel:+201234567890" className="text-blue-600 hover:text-blue-800">
                    +20 123 456 7890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
