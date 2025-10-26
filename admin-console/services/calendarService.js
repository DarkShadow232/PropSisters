const Rental = require('../models/Rental');
const Booking = require('../models/Booking');

class CalendarService {
  /**
   * Block dates for a property (mark as unavailable)
   * @param {string} propertyId - Property ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Object>} Updated property
   */
  async blockDates(propertyId, startDate, endDate, bookingId) {
    try {
      const property = await Rental.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Generate array of dates between start and end
      const datesToBlock = this.generateDateRange(startDate, endDate);
      
      // Update calendar array
      for (const date of datesToBlock) {
        const existingDateIndex = property.calendar.findIndex(
          cal => cal.date.toDateString() === date.toDateString()
        );

        if (existingDateIndex >= 0) {
          // Update existing date
          property.calendar[existingDateIndex].available = false;
          property.calendar[existingDateIndex].bookingId = bookingId;
        } else {
          // Add new date
          property.calendar.push({
            date: date,
            available: false,
            bookingId: bookingId
          });
        }
      }

      await property.save();
      return property;
    } catch (error) {
      console.error('Error blocking dates:', error);
      throw error;
    }
  }

  /**
   * Unblock dates for a property (mark as available)
   * @param {string} propertyId - Property ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} Updated property
   */
  async unblockDates(propertyId, startDate, endDate) {
    try {
      const property = await Rental.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Generate array of dates between start and end
      const datesToUnblock = this.generateDateRange(startDate, endDate);
      
      // Update calendar array
      for (const date of datesToUnblock) {
        const existingDateIndex = property.calendar.findIndex(
          cal => cal.date.toDateString() === date.toDateString()
        );

        if (existingDateIndex >= 0) {
          // Update existing date
          property.calendar[existingDateIndex].available = true;
          property.calendar[existingDateIndex].bookingId = null;
        }
      }

      await property.save();
      return property;
    } catch (error) {
      console.error('Error unblocking dates:', error);
      throw error;
    }
  }

  /**
   * Check availability for a date range
   * @param {string} propertyId - Property ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<boolean>} Whether dates are available
   */
  async checkAvailability(propertyId, startDate, endDate) {
    try {
      const property = await Rental.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Check if property is generally available
      if (!property.availability || property.status !== 'active') {
        return false;
      }

      // Generate array of dates to check
      const datesToCheck = this.generateDateRange(startDate, endDate);
      
      // Check each date
      for (const date of datesToCheck) {
        const calendarEntry = property.calendar.find(
          cal => cal.date.toDateString() === date.toDateString()
        );

        // If date exists in calendar and is not available
        if (calendarEntry && !calendarEntry.available) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }

  /**
   * Get price for a date range with dynamic pricing
   * @param {string} propertyId - Property ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<number>} Total price for the date range
   */
  async getPriceForDateRange(propertyId, startDate, endDate) {
    try {
      const property = await Rental.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Generate array of dates
      const dates = this.generateDateRange(startDate, endDate);
      let totalPrice = 0;

      // Calculate price for each date
      for (const date of dates) {
        let datePrice = property.basePrice || property.price;

        // Check if there's a specific price for this date
        const dateString = date.toISOString().split('T')[0];
        if (property.pricePerDate && property.pricePerDate.has(dateString)) {
          datePrice = property.pricePerDate.get(dateString);
        }

        // Check if there's a price in the calendar entry
        const calendarEntry = property.calendar.find(
          cal => cal.date.toDateString() === date.toDateString()
        );
        if (calendarEntry && calendarEntry.price) {
          datePrice = calendarEntry.price;
        }

        totalPrice += datePrice;
      }

      return totalPrice;
    } catch (error) {
      console.error('Error calculating price:', error);
      throw error;
    }
  }

  /**
   * Update dynamic pricing for a property
   * @param {string} propertyId - Property ID
   * @param {Array} dateRanges - Array of date ranges with prices
   * @returns {Promise<Object>} Updated property
   */
  async updateDynamicPricing(propertyId, dateRanges) {
    try {
      const property = await Rental.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Initialize pricePerDate if it doesn't exist
      if (!property.pricePerDate) {
        property.pricePerDate = new Map();
      }

      // Update pricing for each date range
      for (const range of dateRanges) {
        const dates = this.generateDateRange(range.startDate, range.endDate);
        
        for (const date of dates) {
          const dateString = date.toISOString().split('T')[0];
          property.pricePerDate.set(dateString, range.price);
        }
      }

      await property.save();
      return property;
    } catch (error) {
      console.error('Error updating dynamic pricing:', error);
      throw error;
    }
  }

  /**
   * Get property calendar for a specific month
   * @param {string} propertyId - Property ID
   * @param {number} year - Year
   * @param {number} month - Month (0-11)
   * @returns {Promise<Array>} Calendar entries for the month
   */
  async getPropertyCalendar(propertyId, year, month) {
    try {
      const property = await Rental.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Filter calendar entries for the specified month
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);

      const monthCalendar = property.calendar.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= monthStart && entryDate <= monthEnd;
      });

      return monthCalendar;
    } catch (error) {
      console.error('Error getting property calendar:', error);
      throw error;
    }
  }

  /**
   * Get all blocked dates for a property
   * @param {string} propertyId - Property ID
   * @returns {Promise<Array>} Array of blocked dates
   */
  async getBlockedDates(propertyId) {
    try {
      const property = await Rental.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      const blockedDates = property.calendar
        .filter(entry => !entry.available)
        .map(entry => ({
          date: entry.date,
          bookingId: entry.bookingId,
          price: entry.price
        }));

      return blockedDates;
    } catch (error) {
      console.error('Error getting blocked dates:', error);
      throw error;
    }
  }

  /**
   * Clean up old calendar entries (older than 1 year)
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Updated property
   */
  async cleanupOldEntries(propertyId) {
    try {
      const property = await Rental.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // Remove old calendar entries
      property.calendar = property.calendar.filter(entry => {
        return new Date(entry.date) > oneYearAgo;
      });

      await property.save();
      return property;
    } catch (error) {
      console.error('Error cleaning up old entries:', error);
      throw error;
    }
  }

  /**
   * Generate array of dates between start and end date
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array<Date>} Array of dates
   */
  generateDateRange(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  /**
   * Get availability summary for a property
   * @param {string} propertyId - Property ID
   * @param {Date} startDate - Start date for summary
   * @param {Date} endDate - End date for summary
   * @returns {Promise<Object>} Availability summary
   */
  async getAvailabilitySummary(propertyId, startDate, endDate) {
    try {
      const property = await Rental.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      const dates = this.generateDateRange(startDate, endDate);
      const summary = {
        totalDays: dates.length,
        availableDays: 0,
        blockedDays: 0,
        dates: []
      };

      for (const date of dates) {
        const calendarEntry = property.calendar.find(
          cal => cal.date.toDateString() === date.toDateString()
        );

        const isAvailable = !calendarEntry || calendarEntry.available;
        
        summary.dates.push({
          date: date,
          available: isAvailable,
          price: calendarEntry?.price || property.basePrice || property.price,
          bookingId: calendarEntry?.bookingId || null
        });

        if (isAvailable) {
          summary.availableDays++;
        } else {
          summary.blockedDays++;
        }
      }

      return summary;
    } catch (error) {
      console.error('Error getting availability summary:', error);
      throw error;
    }
  }
}

module.exports = CalendarService;
