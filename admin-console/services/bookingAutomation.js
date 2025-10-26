const Booking = require('../models/Booking');
const Rental = require('../models/Rental');
const EmailService = require('./emailService');
const CalendarService = require('./calendarService');

class BookingAutomation {
  constructor() {
    this.emailService = new EmailService();
    this.calendarService = new CalendarService();
  }

  /**
   * Update active bookings (check-in day)
   * Runs daily to update bookings from 'confirmed' to 'active'
   */
  async updateActiveBookings() {
    try {
      console.log('Starting updateActiveBookings automation...');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find bookings where check-in date is today
      const bookingsToActivate = await Booking.find({
        checkIn: {
          $gte: today,
          $lt: tomorrow
        },
        bookingStatus: 'confirmed',
        paymentStatus: 'paid'
      }).populate('propertyId').populate('userId');

      console.log(`Found ${bookingsToActivate.length} bookings to activate`);

      for (const booking of bookingsToActivate) {
        try {
          // Update booking status to active
          booking.bookingStatus = 'active';
          await booking.save();

          console.log(`Activated booking ${booking._id} for property ${booking.propertyId.title}`);

          // Send check-in reminder email
          await this.emailService.sendCheckInReminder(booking, booking.userId, booking.propertyId);

          // Send admin notification
          await this.emailService.sendAdminNotification(
            booking, 
            'booking_activated', 
            booking.userId, 
            booking.propertyId
          );

        } catch (error) {
          console.error(`Error processing booking ${booking._id}:`, error);
        }
      }

      console.log('updateActiveBookings automation completed');
      return { success: true, processed: bookingsToActivate.length };

    } catch (error) {
      console.error('Error in updateActiveBookings automation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Complete bookings (check-out day)
   * Runs daily to update bookings from 'active' to 'completed'
   */
  async completeBookings() {
    try {
      console.log('Starting completeBookings automation...');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find bookings where check-out date is today
      const bookingsToComplete = await Booking.find({
        checkOut: {
          $gte: today,
          $lt: tomorrow
        },
        bookingStatus: 'active'
      }).populate('propertyId').populate('userId');

      console.log(`Found ${bookingsToComplete.length} bookings to complete`);

      for (const booking of bookingsToComplete) {
        try {
          // Update booking status to completed
          booking.bookingStatus = 'completed';
          await booking.save();

          console.log(`Completed booking ${booking._id} for property ${booking.propertyId.title}`);

          // Unblock calendar dates
          await this.calendarService.unblockDates(
            booking.propertyId._id,
            booking.checkIn,
            booking.checkOut
          );

          // Send check-out reminder email
          await this.emailService.sendCheckOutReminder(booking, booking.userId, booking.propertyId);

          // Send admin notification
          await this.emailService.sendAdminNotification(
            booking, 
            'booking_completed', 
            booking.userId, 
            booking.propertyId
          );

        } catch (error) {
          console.error(`Error processing booking ${booking._id}:`, error);
        }
      }

      console.log('completeBookings automation completed');
      return { success: true, processed: bookingsToComplete.length };

    } catch (error) {
      console.error('Error in completeBookings automation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send booking reminders
   * Runs daily to send check-in and check-out reminders
   */
  async sendReminders() {
    try {
      console.log('Starting sendReminders automation...');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      // Send check-in reminders (24 hours before)
      const checkInReminders = await Booking.find({
        checkIn: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow
        },
        bookingStatus: 'confirmed',
        paymentStatus: 'paid'
      }).populate('propertyId').populate('userId');

      console.log(`Found ${checkInReminders.length} check-in reminders to send`);

      for (const booking of checkInReminders) {
        try {
          await this.emailService.sendCheckInReminder(booking, booking.userId, booking.propertyId);
          console.log(`Sent check-in reminder for booking ${booking._id}`);
        } catch (error) {
          console.error(`Error sending check-in reminder for booking ${booking._id}:`, error);
        }
      }

      // Send check-out reminders (24 hours before)
      const checkOutReminders = await Booking.find({
        checkOut: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow
        },
        bookingStatus: 'active'
      }).populate('propertyId').populate('userId');

      console.log(`Found ${checkOutReminders.length} check-out reminders to send`);

      for (const booking of checkOutReminders) {
        try {
          await this.emailService.sendCheckOutReminder(booking, booking.userId, booking.propertyId);
          console.log(`Sent check-out reminder for booking ${booking._id}`);
        } catch (error) {
          console.error(`Error sending check-out reminder for booking ${booking._id}:`, error);
        }
      }

      console.log('sendReminders automation completed');
      return { 
        success: true, 
        checkInReminders: checkInReminders.length,
        checkOutReminders: checkOutReminders.length
      };

    } catch (error) {
      console.error('Error in sendReminders automation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Clean up old calendar entries
   * Runs weekly to remove old calendar entries
   */
  async cleanupOldCalendarEntries() {
    try {
      console.log('Starting cleanupOldCalendarEntries automation...');
      
      const properties = await Rental.find({});
      let cleanedCount = 0;

      for (const property of properties) {
        try {
          await this.calendarService.cleanupOldEntries(property._id);
          cleanedCount++;
        } catch (error) {
          console.error(`Error cleaning up calendar for property ${property._id}:`, error);
        }
      }

      console.log(`Cleaned up calendar entries for ${cleanedCount} properties`);
      return { success: true, cleanedProperties: cleanedCount };

    } catch (error) {
      console.error('Error in cleanupOldCalendarEntries automation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process pending payments
   * Runs hourly to check for pending payments that need attention
   */
  async processPendingPayments() {
    try {
      console.log('Starting processPendingPayments automation...');
      
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      // Find bookings with pending payments older than 1 hour
      const pendingPayments = await Booking.find({
        paymentStatus: 'pending',
        createdAt: { $lt: oneHourAgo }
      }).populate('propertyId').populate('userId');

      console.log(`Found ${pendingPayments.length} pending payments to process`);

      for (const booking of pendingPayments) {
        try {
          // Send reminder email to user
          await this.emailService.sendAdminNotification(
            booking, 
            'payment_pending_reminder', 
            booking.userId, 
            booking.propertyId
          );

          console.log(`Sent payment reminder for booking ${booking._id}`);
        } catch (error) {
          console.error(`Error processing pending payment for booking ${booking._id}:`, error);
        }
      }

      console.log('processPendingPayments automation completed');
      return { success: true, processed: pendingPayments.length };

    } catch (error) {
      console.error('Error in processPendingPayments automation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate daily reports
   * Runs daily to generate booking reports
   */
  async generateDailyReports() {
    try {
      console.log('Starting generateDailyReports automation...');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Get yesterday's statistics
      const [
        newBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue
      ] = await Promise.all([
        Booking.countDocuments({
          createdAt: { $gte: yesterday, $lt: today }
        }),
        Booking.countDocuments({
          bookingStatus: 'completed',
          updatedAt: { $gte: yesterday, $lt: today }
        }),
        Booking.countDocuments({
          bookingStatus: 'cancelled',
          updatedAt: { $gte: yesterday, $lt: today }
        }),
        Booking.aggregate([
          {
            $match: {
              paymentStatus: 'paid',
              createdAt: { $gte: yesterday, $lt: today }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$totalAmount' }
            }
          }
        ])
      ]);

      const report = {
        date: yesterday.toISOString().split('T')[0],
        newBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      };

      console.log('Daily report generated:', report);
      return { success: true, report };

    } catch (error) {
      console.error('Error in generateDailyReports automation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Run all automation tasks
   */
  async runAllTasks() {
    try {
      console.log('Starting all booking automation tasks...');
      
      const results = {
        updateActiveBookings: await this.updateActiveBookings(),
        completeBookings: await this.completeBookings(),
        sendReminders: await this.sendReminders(),
        processPendingPayments: await this.processPendingPayments(),
        generateDailyReports: await this.generateDailyReports()
      };

      console.log('All automation tasks completed:', results);
      return { success: true, results };

    } catch (error) {
      console.error('Error running automation tasks:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Run weekly cleanup tasks
   */
  async runWeeklyTasks() {
    try {
      console.log('Starting weekly automation tasks...');
      
      const results = {
        cleanupOldCalendarEntries: await this.cleanupOldCalendarEntries()
      };

      console.log('Weekly automation tasks completed:', results);
      return { success: true, results };

    } catch (error) {
      console.error('Error running weekly automation tasks:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = BookingAutomation;
