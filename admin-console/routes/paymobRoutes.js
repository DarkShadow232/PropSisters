const express = require('express');
const router = express.Router();
const PaymobService = require('../services/paymobService');
const Booking = require('../models/Booking');

// Create Paymob payment
router.post('/create-payment', async (req, res) => {
  try {
    const { amount, currency, customerInfo, bookingInfo, paymentMethod } = req.body;
    
    // Validate required fields
    if (!amount || !currency || !customerInfo || !bookingInfo) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const paymobService = new PaymobService();
    
    // Create order
    const orderItems = [{
      name: `Booking for ${bookingInfo.propertyId}`,
      amount_cents: Math.round(amount * 100),
      description: `Property booking from ${bookingInfo.checkIn} to ${bookingInfo.checkOut}`,
      quantity: 1
    }];

    const order = await paymobService.createOrder(amount, currency, orderItems);
    
    // Create payment key
    const billingData = {
      first_name: customerInfo.name.split(' ')[0] || customerInfo.name,
      last_name: customerInfo.name.split(' ').slice(1).join(' ') || '',
      email: customerInfo.email,
      phone_number: customerInfo.phone,
      city: 'Cairo',
      country: 'EG',
      state: 'Cairo'
    };

    const paymentKey = await paymobService.createPaymentKey(
      order.id,
      amount,
      customerInfo,
      billingData
    );

    // Generate payment URL
    const paymentUrl = paymobService.generatePaymentUrl(paymentKey.token);

    // Store Paymob data in booking if bookingId is provided
    if (bookingInfo.bookingId) {
      try {
        await Booking.findByIdAndUpdate(bookingInfo.bookingId, {
          $set: {
            'paymobData.paymentKey': paymentKey.token,
            'paymobData.orderId': order.id,
            'paymobData.paymentToken': paymentKey.token,
            paymentMethod: paymentMethod || 'card',
            updatedAt: new Date()
          }
        });
        console.log(`✅ Paymob data stored for booking ${bookingInfo.bookingId}`);
      } catch (dbError) {
        console.error('Error storing Paymob data:', dbError);
        // Continue with payment even if database update fails
      }
    }

    res.json({
      success: true,
      transactionId: paymentKey.token,
      orderId: order.id,
      paymentUrl: paymentUrl,
      message: 'Payment URL generated successfully'
    });

  } catch (error) {
    console.error('Paymob payment creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment'
    });
  }
});

// Handle Paymob callback
router.post('/callback', async (req, res) => {
  try {
    const paymobService = new PaymobService();
    
    // Verify HMAC
    const isValidHmac = paymobService.verifyPaymentHmac(req.body);
    
    if (!isValidHmac) {
      return res.status(400).json({
        success: false,
        error: 'Invalid HMAC signature'
      });
    }

    const { success, id, order } = req.body;
    
    if (success) {
      // Payment successful - update booking status
      console.log(`Payment successful for order ${order.id}, transaction ${id}`);
      
      try {
        // Find and update the booking
        const booking = await Booking.findOneAndUpdate(
          { 'paymobData.orderId': order.id },
          { 
            $set: {
              status: 'confirmed',
              paymentStatus: 'paid',
              bookingStatus: 'confirmed',
              'paymobData.transactionId': id,
              'paymobData.hmac': req.body.hmac,
              updatedAt: new Date()
            }
          },
          { new: true }
        );

        if (booking) {
          console.log(`✅ Booking ${booking._id} confirmed successfully`);
          
          // TODO: Send confirmation email to customer
          // TODO: Send notification to admin
          
          res.json({
            success: true,
            message: 'Payment processed successfully',
            bookingId: booking._id
          });
        } else {
          console.log(`⚠️ No booking found for order ${order.id}`);
          res.json({
            success: true,
            message: 'Payment processed successfully (booking not found)'
          });
        }
      } catch (dbError) {
        console.error('Database update error:', dbError);
        res.json({
          success: true,
          message: 'Payment processed successfully (database update failed)'
        });
      }
    } else {
      // Payment failed
      console.log(`Payment failed for order ${order.id}, transaction ${id}`);
      
      try {
        // Update booking status to failed
        await Booking.findOneAndUpdate(
          { 'paymobData.orderId': order.id },
          { 
            $set: {
              paymentStatus: 'failed',
              updatedAt: new Date()
            }
          }
        );
      } catch (dbError) {
        console.error('Database update error for failed payment:', dbError);
      }
      
      res.json({
        success: false,
        message: 'Payment failed'
      });
    }

  } catch (error) {
    console.error('Paymob callback error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Callback processing failed'
    });
  }
});

// Get payment status
router.get('/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const paymobService = new PaymobService();
    
    const transactionDetails = await paymobService.getTransactionDetails(transactionId);
    
    res.json({
      success: true,
      transaction: transactionDetails
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get payment status'
    });
  }
});

module.exports = router;
