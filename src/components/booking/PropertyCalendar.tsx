import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, X } from 'lucide-react';

interface PropertyCalendarProps {
  propertyId: string;
  onDateSelect?: (startDate: Date, endDate: Date) => void;
  selectedDates?: { start: Date | null; end: Date | null };
}

interface CalendarEntry {
  date: string;
  available: boolean;
  price: number;
  bookingId?: string;
}

interface AvailabilitySummary {
  totalDays: number;
  availableDays: number;
  blockedDays: number;
  dates: CalendarEntry[];
}

const PropertyCalendar: React.FC<PropertyCalendarProps> = ({
  propertyId,
  onDateSelect,
  selectedDates
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, [propertyId, currentMonth]);

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const response = await fetch('/api/bookings/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
      });

      const data = await response.json();

      if (data.success) {
        setAvailability(data.availability);
      } else {
        setError(data.error || 'Failed to load availability');
      }
    } catch (error) {
      setError('An error occurred while loading availability');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDates?.start) return false;
    if (!selectedDates?.end) {
      return date.toDateString() === selectedDates.start.toDateString();
    }
    return date >= selectedDates.start && date <= selectedDates.end;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedDates?.start || !selectedDates?.end) return false;
    return date > selectedDates.start && date < selectedDates.end;
  };

  const getDateAvailability = (date: Date) => {
    if (!availability) return { available: true, price: 0 };
    
    const dateString = date.toISOString().split('T')[0];
    const entry = availability.dates.find(d => d.date === dateString);
    
    return entry || { available: true, price: 0 };
  };

  const handleDateClick = (date: Date) => {
    if (!onDateSelect) return;
    
    const dateAvailability = getDateAvailability(date);
    if (!dateAvailability.available) return;

    if (!selectedDates?.start || (selectedDates.start && selectedDates.end)) {
      // Start new selection
      onDateSelect(date, date);
    } else if (selectedDates.start && !selectedDates.end) {
      // Complete selection
      if (date >= selectedDates.start) {
        onDateSelect(selectedDates.start, date);
      } else {
        onDateSelect(date, selectedDates.start);
      }
    }
  };

  const clearSelection = () => {
    if (onDateSelect) {
      onDateSelect(new Date(), new Date());
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDateClasses = (date: Date) => {
    const dateAvailability = getDateAvailability(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = isDateSelected(date);
    const isInRange = isDateInRange(date);
    const isHovered = hoveredDate === date.toISOString().split('T')[0];

    let classes = 'w-10 h-10 flex items-center justify-center text-sm rounded-md cursor-pointer transition-colors ';

    if (isToday) {
      classes += 'bg-blue-100 text-blue-800 font-semibold ';
    }

    if (isSelected) {
      classes += 'bg-blue-600 text-white ';
    } else if (isInRange) {
      classes += 'bg-blue-200 text-blue-800 ';
    } else if (!dateAvailability.available) {
      classes += 'bg-red-100 text-red-600 cursor-not-allowed ';
    } else if (isHovered) {
      classes += 'bg-gray-100 ';
    } else {
      classes += 'hover:bg-gray-100 ';
    }

    if (!dateAvailability.available) {
      classes += 'cursor-not-allowed ';
    }

    return classes;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Calendar</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Availability Calendar</h3>
          {selectedDates?.start && (
            <button
              onClick={clearSelection}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Month Navigation */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-semibold">
            {formatMonthYear(currentMonth)}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="w-10 h-10" />;
            }

            const dateAvailability = getDateAvailability(date);
            const isPastDate = date < new Date().setHours(0, 0, 0, 0);

            return (
              <div
                key={date.toISOString()}
                className="relative"
                onMouseEnter={() => setHoveredDate(date.toISOString().split('T')[0])}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <button
                  onClick={() => handleDateClick(date)}
                  disabled={!dateAvailability.available || isPastDate}
                  className={getDateClasses(date)}
                >
                  {date.getDate()}
                </button>
                
                {/* Price Tooltip */}
                {hoveredDate === date.toISOString().split('T')[0] && dateAvailability.price > 0 && (
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-10">
                    <DollarSign className="w-3 h-3 inline mr-1" />
                    {dateAvailability.price} EGP
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* Availability Summary */}
      {availability && (
        <div className="p-4 border-t bg-blue-50">
          <div className="text-center text-sm text-blue-800">
            <span className="font-medium">{availability.availableDays}</span> available days, 
            <span className="font-medium"> {availability.blockedDays}</span> blocked days
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCalendar;
