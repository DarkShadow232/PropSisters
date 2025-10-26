import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, DollarSign, CheckCircle } from 'lucide-react';

interface Property {
  _id: string;
  title: string;
  location: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
}

interface BookingFormProps {
  property: Property;
  onBookingSuccess: (bookingData: any) => void;
}

interface BookingData {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string;
  cleaningService: boolean;
  airportPickup: boolean;
  earlyCheckIn: boolean;
  billingData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    apartment: string;
    floor: string;
    street: string;
    building: string;
    postal_code: string;
    city: string;
    country: string;
    state: string;
  };
}

const BookingForm: React.FC<BookingFormProps> = ({ property, onBookingSuccess }) => {
  const [formData, setFormData] = useState<BookingData>({
    propertyId: property._id,
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
    cleaningService: false,
    airportPickup: false,
    earlyCheckIn: false,
    billingData: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      apartment: '',
      floor: '',
      street: '',
      building: '',
      postal_code: '',
      city: 'Cairo',
      country: 'EG',
      state: 'Cairo'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  // Calculate total price when dates change
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      calculatePrice();
      checkAvailability();
    }
  }, [formData.checkIn, formData.checkOut]);

  const calculatePrice = async () => {
    try {
      const response = await fetch('/api/bookings/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property._id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTotalPrice(data.totalPrice);
      }
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  const checkAvailability = async () => {
    try {
      const response = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property._id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsAvailable(data.available);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('billingData.')) {
      const billingField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingData: {
          ...prev.billingData,
          [billingField]: value
        }
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onBookingSuccess(data);
      } else {
        setError(data.error || 'Failed to create booking');
      }
    } catch (error) {
      setError('An error occurred while creating the booking');
    } finally {
      setIsLoading(false);
    }
  };

  const getNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Book Your Stay</h2>
          <div className="flex items-center space-x-4 text-blue-100">
            <MapPin className="w-4 h-4" />
            <span>{property.location}</span>
            <Users className="w-4 h-4 ml-4" />
            <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Date
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out Date
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Availability Status */}
          {formData.checkIn && formData.checkOut && (
            <div className={`p-4 rounded-md ${isAvailable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center">
                <CheckCircle className={`w-5 h-5 mr-2 ${isAvailable ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`font-medium ${isAvailable ? 'text-green-800' : 'text-red-800'}`}>
                  {isAvailable ? 'Available for booking' : 'Selected dates are not available'}
                </span>
              </div>
            </div>
          )}

          {/* Guest Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          {/* Billing Information */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="billingData.first_name"
                  value={formData.billingData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="billingData.last_name"
                  value={formData.billingData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="billingData.email"
                  value={formData.billingData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="billingData.phone_number"
                  value={formData.billingData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special requests or notes..."
            />
          </div>

          {/* Additional Services */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Additional Services</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="cleaningService"
                  checked={formData.cleaningService}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span>Cleaning Service (+50 EGP)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="airportPickup"
                  checked={formData.airportPickup}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span>Airport Pickup (+100 EGP)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="earlyCheckIn"
                  checked={formData.earlyCheckIn}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span>Early Check-in (+25 EGP)</span>
              </label>
            </div>
          </div>

          {/* Price Summary */}
          {totalPrice > 0 && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Price Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Price ({getNights()} nights)</span>
                  <span>{totalPrice} EGP</span>
                </div>
                {formData.cleaningService && (
                  <div className="flex justify-between">
                    <span>Cleaning Service</span>
                    <span>50 EGP</span>
                  </div>
                )}
                {formData.airportPickup && (
                  <div className="flex justify-between">
                    <span>Airport Pickup</span>
                    <span>100 EGP</span>
                  </div>
                )}
                {formData.earlyCheckIn && (
                  <div className="flex justify-between">
                    <span>Early Check-in</span>
                    <span>25 EGP</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{totalPrice + (formData.cleaningService ? 50 : 0) + (formData.airportPickup ? 100 : 0) + (formData.earlyCheckIn ? 25 : 0)} EGP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isAvailable || isLoading}
            className={`w-full py-3 px-4 rounded-md font-medium ${
              !isAvailable || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
