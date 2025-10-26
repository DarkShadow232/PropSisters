const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@propsisters.com';
  }

  /**
   * Send booking confirmation email to user
   * @param {Object} booking - Booking object
   * @param {Object} user - User object
   * @param {Object} property - Property object
   * @returns {Promise<Object>} Email send result
   */
  async sendBookingConfirmation(booking, user, property) {
    try {
      const templatePath = path.join(__dirname, '../views/emails/booking-confirmation.ejs');
      const template = fs.readFileSync(templatePath, 'utf8');
      
      const html = ejs.render(template, {
        booking,
        user,
        property,
        confirmationCode: booking.confirmationCode,
        checkInDate: new Date(booking.checkIn).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        checkOutDate: new Date(booking.checkOut).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        totalAmount: booking.totalAmount,
        currency: booking.currency
      });

      const mailOptions = {
        from: `"PropSisters" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Booking Confirmation - ${property.title}`,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Update booking email status
      booking.emailSent = true;
      booking.emailSentAt = new Date();
      await booking.save();

      return result;
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send payment receipt email
   * @param {Object} booking - Booking object
   * @param {Object} payment - Payment object
   * @param {Object} user - User object
   * @param {Object} property - Property object
   * @returns {Promise<Object>} Email send result
   */
  async sendPaymentReceipt(booking, payment, user, property) {
    try {
      const templatePath = path.join(__dirname, '../views/emails/payment-receipt.ejs');
      const template = fs.readFileSync(templatePath, 'utf8');
      
      const html = ejs.render(template, {
        booking,
        payment,
        user,
        property,
        paymentDate: new Date(payment.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        amount: payment.amount,
        currency: payment.currency,
        transactionId: payment.paymobTransactionId
      });

      const mailOptions = {
        from: `"PropSisters" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Payment Receipt - ${property.title}`,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending payment receipt email:', error);
      throw error;
    }
  }

  /**
   * Send cancellation confirmation email
   * @param {Object} booking - Booking object
   * @param {number} refundAmount - Refund amount
   * @param {Object} user - User object
   * @param {Object} property - Property object
   * @returns {Promise<Object>} Email send result
   */
  async sendCancellationEmail(booking, refundAmount, user, property) {
    try {
      const templatePath = path.join(__dirname, '../views/emails/cancellation-confirmation.ejs');
      const template = fs.readFileSync(templatePath, 'utf8');
      
      const html = ejs.render(template, {
        booking,
        user,
        property,
        refundAmount,
        currency: booking.currency,
        cancellationDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        reason: booking.cancellationPolicy.cancellationReason
      });

      const mailOptions = {
        from: `"PropSisters" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Booking Cancellation - ${property.title}`,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      throw error;
    }
  }

  /**
   * Send admin notification email
   * @param {Object} booking - Booking object
   * @param {string} type - Notification type (new_booking, cancellation, payment_failed)
   * @param {Object} user - User object
   * @param {Object} property - Property object
   * @returns {Promise<Object>} Email send result
   */
  async sendAdminNotification(booking, type, user, property) {
    try {
      const templatePath = path.join(__dirname, '../views/emails/admin-notification.ejs');
      const template = fs.readFileSync(templatePath, 'utf8');
      
      const html = ejs.render(template, {
        booking,
        user,
        property,
        type,
        notificationDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });

      const mailOptions = {
        from: `"PropSisters" <${process.env.EMAIL_USER}>`,
        to: this.adminEmail,
        subject: `Admin Notification: ${type.replace('_', ' ').toUpperCase()} - ${property.title}`,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      throw error;
    }
  }

  /**
   * Send check-in reminder email
   * @param {Object} booking - Booking object
   * @param {Object} user - User object
   * @param {Object} property - Property object
   * @returns {Promise<Object>} Email send result
   */
  async sendCheckInReminder(booking, user, property) {
    try {
      const templatePath = path.join(__dirname, '../views/emails/checkin-reminder.ejs');
      const template = fs.readFileSync(templatePath, 'utf8');
      
      const html = ejs.render(template, {
        booking,
        user,
        property,
        checkInDate: new Date(booking.checkIn).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        propertyAddress: property.address,
        ownerPhone: property.ownerPhone,
        ownerEmail: property.ownerEmail
      });

      const mailOptions = {
        from: `"PropSisters" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Check-in Reminder - ${property.title}`,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending check-in reminder email:', error);
      throw error;
    }
  }

  /**
   * Send check-out reminder email
   * @param {Object} booking - Booking object
   * @param {Object} user - User object
   * @param {Object} property - Property object
   * @returns {Promise<Object>} Email send result
   */
  async sendCheckOutReminder(booking, user, property) {
    try {
      const templatePath = path.join(__dirname, '../views/emails/checkout-reminder.ejs');
      const template = fs.readFileSync(templatePath, 'utf8');
      
      const html = ejs.render(template, {
        booking,
        user,
        property,
        checkOutDate: new Date(booking.checkOut).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        propertyAddress: property.address
      });

      const mailOptions = {
        from: `"PropSisters" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Check-out Reminder - ${property.title}`,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending check-out reminder email:', error);
      throw error;
    }
  }

  /**
   * Test email configuration
   * @returns {Promise<boolean>} Whether email configuration is working
   */
  async testEmailConfiguration() {
    try {
      await this.transporter.verify();
      console.log('Email configuration is valid');
      return true;
    } catch (error) {
      console.error('Email configuration error:', error);
      return false;
    }
  }
}

module.exports = EmailService;
