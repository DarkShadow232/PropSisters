import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CreditCard, Eye, X, Filter } from 'lucide-react';

interface Booking {
  id: string;
  property: {
    id: string;
    title: string;
    location: string;
    images: string[];
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  currency: string;
  bookingStatus: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  confirmationCode: string;
  createdAt: string;
}

interface BookingHistoryProps {
  userId: string;
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [userId, filter]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const url = filter === 'all' 
        ? `/api/bookings/user/${userId}`
        : `/api/bookings/user/${userId}?status=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      } else {
        setError(data.error || 'Failed to load bookings');
      }
    } catch (error) {
      setError('An error occurred while loading bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string, reason: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Booking cancelled successfully. Refund amount: ${data.refundAmount} EGP`);
        fetchBookings(); // Refresh the list
      } else {
        alert(data.error || 'Failed to cancel booking');
      }
    } catch (error) {
      alert('An error occurred while cancelling the booking');
    }
  };

  const getStatusBadge = (status: string, type: 'booking' | 'payment') => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    
    if (type === 'booking') {
      switch (status) {
        case 'pending':
          return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'confirmed':
          return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'active':
          return `${baseClasses} bg-green-100 text-green-800`;
        case 'completed':
          return `${baseClasses} bg-gray-100 text-gray-800`;
        case 'cancelled':
          return `${baseClasses} bg-red-100 text-red-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else {
      switch (status) {
        case 'pending':
          return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'paid':
          return `${baseClasses} bg-green-100 text-green-800`;
        case 'failed':
          return `${baseClasses} bg-red-100 text-red-800`;
        case 'refunded':
          return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'cancelled':
          return `${baseClasses} bg-gray-100 text-gray-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const canCancel = (booking: Booking) => {
    const checkInDate = new Date(booking.checkIn);
    const today = new Date();
    const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return booking.bookingStatus === 'confirmed' && daysUntilCheckIn > 1;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage and view your property bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filter by status:</span>
          <div className="flex space-x-2">
            {['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? "You haven't made any bookings yet."
              : `No ${filter} bookings found.`
            }
          </p>
          <a
            href="/properties"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Properties
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Property Image */}
                      <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        {booking.property.images && booking.property.images.length > 0 ? (
                          <img
                            src={booking.property.images[0]}
                            alt={booking.property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <MapPin className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.property.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{booking.property.location}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(booking.checkIn)}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(booking.checkOut)}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-1" />
                            <span>{booking.totalAmount} {booking.currency}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      <span className={getStatusBadge(booking.bookingStatus, 'booking')}>
                        {booking.bookingStatus}
                      </span>
                      <span className={getStatusBadge(booking.paymentStatus, 'payment')}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      
                      {canCancel(booking) && (
                        <button
                          onClick={() => {
                            const reason = prompt('Please provide a reason for cancellation:');
                            if (reason) {
                              cancelBooking(booking.id, reason);
                            }
                          }}
                          className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedBooking.property.title}</h3>
                  <p className="text-gray-600">{selectedBooking.property.location}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Check-in:</span>
                    <p>{formatDate(selectedBooking.checkIn)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Check-out:</span>
                    <p>{formatDate(selectedBooking.checkOut)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Nights:</span>
                    <p>{getNights(selectedBooking.checkIn, selectedBooking.checkOut)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Guests:</span>
                    <p>{selectedBooking.guests}</p>
                  </div>
                  <div>
                    <span className="font-medium">Total Amount:</span>
                    <p>{selectedBooking.totalAmount} {selectedBooking.currency}</p>
                  </div>
                  <div>
                    <span className="font-medium">Confirmation Code:</span>
                    <p className="font-mono">{selectedBooking.confirmationCode}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <span className={getStatusBadge(selectedBooking.bookingStatus, 'booking')}>
                    {selectedBooking.bookingStatus}
                  </span>
                  <span className={getStatusBadge(selectedBooking.paymentStatus, 'payment')}>
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
