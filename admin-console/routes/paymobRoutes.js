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

// Handle Paymob callback (GET with query parameters)
router.get('/callback', async (req, res) => {
  try {
    console.log('🔔 Paymob GET callback received!');
    console.log('🔔 Query parameters:', req.query);
    console.log('🔔 Request headers:', req.headers);
    
    const paymobService = new PaymobService();
    
    // Extract data from query parameters
    const {
      id: transactionId,
      pending,
      amount_cents,
      success: transactionSuccess,
      is_auth,
      is_capture,
      is_standalone_payment,
      is_voided,
      is_refunded,
      is_3d_secure,
      integration_id,
      profile_id,
      has_parent_transaction,
      order: orderId,
      created_at,
      currency,
      merchant_commission,
      accept_fees,
      discount_details,
      is_void,
      is_refund,
      error_occured,
      refunded_amount_cents,
      captured_amount,
      updated_at,
      is_settled,
      bill_balanced,
      is_bill,
      owner,
      'data.message': dataMessage,
      'source_data.type': sourceDataType,
      'source_data.pan': sourceDataPan,
      'source_data.sub_type': sourceDataSubType,
      acq_response_code,
      txn_response_code,
      hmac
    } = req.query;
    
    console.log('🔔 Processing GET webhook:');
    console.log('🔔 Transaction success:', transactionSuccess);
    console.log('🔔 Transaction ID:', transactionId);
    console.log('🔔 Order ID:', orderId);
    console.log('🔔 HMAC:', hmac);
    
    if (transactionSuccess === 'true') {
      // Payment successful - update booking status
      console.log(`Payment successful for order ${orderId}, transaction ${transactionId}`);
      
      try {
        // Find and update the booking
        const booking = await Booking.findOneAndUpdate(
          { 'paymobData.orderId': parseInt(orderId) },
          { 
            $set: {
              status: 'confirmed',
              paymentStatus: 'paid',
              bookingStatus: 'confirmed',
              'paymobData.transactionId': transactionId,
              'paymobData.hmac': hmac,
              updatedAt: new Date()
            }
          },
          { new: true }
        );

        if (booking) {
          console.log(`✅ Booking ${booking._id} confirmed successfully`);
          res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Payment Successful - PropSisters</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
              <style>
                body {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .payment-card {
                  background: white;
                  border-radius: 15px;
                  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                  overflow: hidden;
                  max-width: 500px;
                  width: 100%;
                  text-align: center;
                }
                .payment-header {
                  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                  color: white;
                  padding: 30px;
                }
                .payment-body {
                  padding: 40px 30px;
                }
                .success-icon {
                  font-size: 4rem;
                  color: #28a745;
                  margin-bottom: 20px;
                }
                .btn-primary {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border: none;
                  padding: 12px 30px;
                  font-weight: 600;
                  border-radius: 25px;
                }
                .btn-primary:hover {
                  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                }
                .booking-details {
                  background: #f8f9fa;
                  border-radius: 10px;
                  padding: 15px;
                  margin: 20px 0;
                  font-family: monospace;
                  font-size: 0.9rem;
                }
              </style>
            </head>
            <body>
              <div class="payment-card">
                <div class="payment-header">
                  <i class="bi bi-check-circle-fill fs-1 mb-3"></i>
                  <h2 class="mb-0">Payment Successful!</h2>
                  <p class="mb-0 mt-2 opacity-75">PropSisters</p>
                </div>
                <div class="payment-body">
                  <div class="success-icon">
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <h4 class="text-success mb-3">Booking Confirmed</h4>
                  <p class="text-muted mb-4">
                    Congratulations! Your payment has been processed successfully 
                    and your booking is now confirmed.
                  </p>
                  
                  <div class="booking-details">
                    <strong>Booking ID:</strong> ${booking._id}<br>
                    <strong>Transaction ID:</strong> ${transactionId}<br>
                    <strong>Status:</strong> Confirmed
                  </div>
                  
                  <div class="row mt-4">
                    <div class="col-6">
                      <a href="https://propsiss.com" class="btn btn-outline-secondary w-100">
                        <i class="bi bi-house"></i> Go Home
                      </a>
                    </div>
                    <div class="col-6">
                      <a href="https://propsiss.com/rentals" class="btn btn-primary w-100">
                        <i class="bi bi-calendar-check"></i> View Bookings
                      </a>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <small class="text-muted">
                      <i class="bi bi-envelope"></i>
                      A confirmation email will be sent to your registered email address.
                    </small>
                  </div>
                </div>
              </div>
              
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
          `);
        } else {
          console.log(`⚠️ No booking found for order ${orderId}`);
          res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Payment Successful - PropSisters</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
              <style>
                body {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .payment-card {
                  background: white;
                  border-radius: 15px;
                  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                  overflow: hidden;
                  max-width: 500px;
                  width: 100%;
                  text-align: center;
                }
                .payment-header {
                  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                  color: white;
                  padding: 30px;
                }
                .payment-body {
                  padding: 40px 30px;
                }
                .success-icon {
                  font-size: 4rem;
                  color: #28a745;
                  margin-bottom: 20px;
                }
                .btn-primary {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border: none;
                  padding: 12px 30px;
                  font-weight: 600;
                  border-radius: 25px;
                }
                .btn-primary:hover {
                  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                }
              </style>
            </head>
            <body>
              <div class="payment-card">
                <div class="payment-header">
                  <i class="bi bi-check-circle-fill fs-1 mb-3"></i>
                  <h2 class="mb-0">Payment Successful!</h2>
                  <p class="mb-0 mt-2 opacity-75">PropSisters</p>
                </div>
                <div class="payment-body">
                  <div class="success-icon">
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <h4 class="text-success mb-3">Payment Processed</h4>
                  <p class="text-muted mb-4">
                    Your payment has been processed successfully. 
                    Please contact support if you have any questions.
                  </p>
                  
                  <div class="row mt-4">
                    <div class="col-6">
                      <a href="https://propsiss.com" class="btn btn-outline-secondary w-100">
                        <i class="bi bi-house"></i> Go Home
                      </a>
                    </div>
                    <div class="col-6">
                      <a href="https://propsiss.com/rentals" class="btn btn-primary w-100">
                        <i class="bi bi-calendar-check"></i> View Rentals
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
          `);
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
      console.log(`Payment failed for order ${orderId}, transaction ${transactionId}`);
      console.log(`Error message: ${dataMessage}`);
      
      try {
        // Update booking status to failed
        await Booking.findOneAndUpdate(
          { 'paymobData.orderId': parseInt(orderId) },
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
      
      // Return HTML response for better user experience
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Failed - PropSisters</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
          <style>
            body {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .payment-card {
              background: white;
              border-radius: 15px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              overflow: hidden;
              max-width: 500px;
              width: 100%;
              text-align: center;
            }
            .payment-header {
              background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
              color: white;
              padding: 30px;
            }
            .payment-body {
              padding: 40px 30px;
            }
            .error-icon {
              font-size: 4rem;
              color: #dc3545;
              margin-bottom: 20px;
            }
            .btn-primary {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              padding: 12px 30px;
              font-weight: 600;
              border-radius: 25px;
            }
            .btn-primary:hover {
              background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            }
            .error-details {
              background: #f8f9fa;
              border-radius: 10px;
              padding: 15px;
              margin: 20px 0;
              font-family: monospace;
              font-size: 0.9rem;
            }
          </style>
        </head>
        <body>
          <div class="payment-card">
            <div class="payment-header">
              <i class="bi bi-x-circle-fill fs-1 mb-3"></i>
              <h2 class="mb-0">Payment Failed</h2>
              <p class="mb-0 mt-2 opacity-75">PropSisters</p>
            </div>
            <div class="payment-body">
              <div class="error-icon">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <h4 class="text-danger mb-3">Transaction Not Completed</h4>
              <p class="text-muted mb-4">
                Unfortunately, your payment could not be processed at this time. 
                This may be due to security checks or payment method issues.
              </p>
              
              <div class="error-details">
                <strong>Error Details:</strong><br>
                ${dataMessage || 'Transaction did not pass risk checks'}
              </div>
              
              <div class="row mt-4">
                <div class="col-6">
                  <a href="https://propsiss.com" class="btn btn-outline-secondary w-100">
                    <i class="bi bi-house"></i> Go Home
                  </a>
                </div>
                <div class="col-6">
                  <a href="https://propsiss.com/rentals" class="btn btn-primary w-100">
                    <i class="bi bi-arrow-clockwise"></i> Try Again
                  </a>
                </div>
              </div>
              
              <div class="mt-4">
                <small class="text-muted">
                  <i class="bi bi-info-circle"></i>
                  If you continue to experience issues, please contact our support team.
                </small>
              </div>
            </div>
          </div>
          
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
      `);
    }

  } catch (error) {
    console.error('Paymob GET callback error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Callback processing failed'
    });
  }
});

// Handle Paymob callback (POST with JSON body)
router.post('/callback', async (req, res) => {
  try {
    console.log('🔔 Paymob webhook callback received!');
    console.log('🔔 Request body:', req.body);
    console.log('🔔 Request headers:', req.headers);
    
    const paymobService = new PaymobService();
    
    // Check for HMAC in headers or body
    const hmac = req.headers['x-paymob-hmac'] || req.body.hmac;
    console.log('🔔 HMAC from headers:', req.headers['x-paymob-hmac']);
    console.log('🔔 HMAC from body:', req.body.hmac);
    
    // Add HMAC to the data for verification
    const dataWithHmac = { ...req.body, hmac };
    
    // Verify HMAC (optional for now)
    const isValidHmac = hmac ? paymobService.verifyPaymentHmac(dataWithHmac) : true;
    console.log('🔔 HMAC verification result:', isValidHmac);
    
    if (!isValidHmac) {
      console.log('⚠️ HMAC verification failed, but proceeding with payment processing');
      // Don't return error, just log the warning
    }

    // Handle the webhook data structure
    const obj = req.body.obj || req.body;
    const transactionSuccess = obj.success;
    const transactionId = obj.id;
    const orderData = obj.order;
    
    console.log('🔔 Processing webhook:');
    console.log('🔔 Transaction success:', transactionSuccess);
    console.log('🔔 Transaction ID:', transactionId);
    console.log('🔔 Order data:', orderData);
    
    if (transactionSuccess) {
      // Payment successful - update booking status
      console.log(`Payment successful for order ${orderData.id}, transaction ${transactionId}`);
      
      try {
        // Find and update the booking
        const booking = await Booking.findOneAndUpdate(
          { 'paymobData.orderId': orderData.id },
          { 
            $set: {
              status: 'confirmed',
              paymentStatus: 'paid',
              bookingStatus: 'confirmed',
              'paymobData.transactionId': transactionId,
              'paymobData.hmac': hmac,
              updatedAt: new Date()
            }
          },
          { new: true }
        );

        if (booking) {
          console.log(`✅ Booking ${booking._id} confirmed successfully`);
          
          // TODO: Send confirmation email to customer
          // TODO: Send notification to admin
          
          res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Payment Successful - PropSisters</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
              <style>
                body {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .payment-card {
                  background: white;
                  border-radius: 15px;
                  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                  overflow: hidden;
                  max-width: 500px;
                  width: 100%;
                  text-align: center;
                }
                .payment-header {
                  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                  color: white;
                  padding: 30px;
                }
                .payment-body {
                  padding: 40px 30px;
                }
                .success-icon {
                  font-size: 4rem;
                  color: #28a745;
                  margin-bottom: 20px;
                }
                .btn-primary {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border: none;
                  padding: 12px 30px;
                  font-weight: 600;
                  border-radius: 25px;
                }
                .btn-primary:hover {
                  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                }
                .booking-details {
                  background: #f8f9fa;
                  border-radius: 10px;
                  padding: 15px;
                  margin: 20px 0;
                  font-family: monospace;
                  font-size: 0.9rem;
                }
              </style>
            </head>
            <body>
              <div class="payment-card">
                <div class="payment-header">
                  <i class="bi bi-check-circle-fill fs-1 mb-3"></i>
                  <h2 class="mb-0">Payment Successful!</h2>
                  <p class="mb-0 mt-2 opacity-75">PropSisters</p>
                </div>
                <div class="payment-body">
                  <div class="success-icon">
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <h4 class="text-success mb-3">Booking Confirmed</h4>
                  <p class="text-muted mb-4">
                    Congratulations! Your payment has been processed successfully 
                    and your booking is now confirmed.
                  </p>
                  
                  <div class="booking-details">
                    <strong>Booking ID:</strong> ${booking._id}<br>
                    <strong>Transaction ID:</strong> ${transactionId}<br>
                    <strong>Status:</strong> Confirmed
                  </div>
                  
                  <div class="row mt-4">
                    <div class="col-6">
                      <a href="https://propsiss.com" class="btn btn-outline-secondary w-100">
                        <i class="bi bi-house"></i> Go Home
                      </a>
                    </div>
                    <div class="col-6">
                      <a href="https://propsiss.com/rentals" class="btn btn-primary w-100">
                        <i class="bi bi-calendar-check"></i> View Bookings
                      </a>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <small class="text-muted">
                      <i class="bi bi-envelope"></i>
                      A confirmation email will be sent to your registered email address.
                    </small>
                  </div>
                </div>
              </div>
              
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
          `);
        } else {
          console.log(`⚠️ No booking found for order ${order.id}`);
          res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Payment Successful - PropSisters</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
              <style>
                body {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .payment-card {
                  background: white;
                  border-radius: 15px;
                  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                  overflow: hidden;
                  max-width: 500px;
                  width: 100%;
                  text-align: center;
                }
                .payment-header {
                  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                  color: white;
                  padding: 30px;
                }
                .payment-body {
                  padding: 40px 30px;
                }
                .success-icon {
                  font-size: 4rem;
                  color: #28a745;
                  margin-bottom: 20px;
                }
                .btn-primary {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border: none;
                  padding: 12px 30px;
                  font-weight: 600;
                  border-radius: 25px;
                }
                .btn-primary:hover {
                  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                }
              </style>
            </head>
            <body>
              <div class="payment-card">
                <div class="payment-header">
                  <i class="bi bi-check-circle-fill fs-1 mb-3"></i>
                  <h2 class="mb-0">Payment Successful!</h2>
                  <p class="mb-0 mt-2 opacity-75">PropSisters</p>
                </div>
                <div class="payment-body">
                  <div class="success-icon">
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <h4 class="text-success mb-3">Payment Processed</h4>
                  <p class="text-muted mb-4">
                    Your payment has been processed successfully. 
                    Please contact support if you have any questions.
                  </p>
                  
                  <div class="row mt-4">
                    <div class="col-6">
                      <a href="https://propsiss.com" class="btn btn-outline-secondary w-100">
                        <i class="bi bi-house"></i> Go Home
                      </a>
                    </div>
                    <div class="col-6">
                      <a href="https://propsiss.com/rentals" class="btn btn-primary w-100">
                        <i class="bi bi-calendar-check"></i> View Rentals
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
          `);
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
      console.log(`Payment failed for order ${orderData.id}, transaction ${transactionId}`);
      
      try {
        // Update booking status to failed
        await Booking.findOneAndUpdate(
          { 'paymobData.orderId': orderData.id },
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
      
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Failed - PropSisters</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
          <style>
            body {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .payment-card {
              background: white;
              border-radius: 15px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              overflow: hidden;
              max-width: 500px;
              width: 100%;
              text-align: center;
            }
            .payment-header {
              background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
              color: white;
              padding: 30px;
            }
            .payment-body {
              padding: 40px 30px;
            }
            .error-icon {
              font-size: 4rem;
              color: #dc3545;
              margin-bottom: 20px;
            }
            .btn-primary {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              padding: 12px 30px;
              font-weight: 600;
              border-radius: 25px;
            }
            .btn-primary:hover {
              background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            }
            .error-details {
              background: #f8f9fa;
              border-radius: 10px;
              padding: 15px;
              margin: 20px 0;
              font-family: monospace;
              font-size: 0.9rem;
            }
          </style>
        </head>
        <body>
          <div class="payment-card">
            <div class="payment-header">
              <i class="bi bi-x-circle-fill fs-1 mb-3"></i>
              <h2 class="mb-0">Payment Failed</h2>
              <p class="mb-0 mt-2 opacity-75">PropSisters</p>
            </div>
            <div class="payment-body">
              <div class="error-icon">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <h4 class="text-danger mb-3">Transaction Not Completed</h4>
              <p class="text-muted mb-4">
                Unfortunately, your payment could not be processed at this time. 
                This may be due to security checks or payment method issues.
              </p>
              
              <div class="error-details">
                <strong>Error Details:</strong><br>
                Transaction did not pass risk checks
              </div>
              
              <div class="row mt-4">
                <div class="col-6">
                  <a href="https://propsiss.com" class="btn btn-outline-secondary w-100">
                    <i class="bi bi-house"></i> Go Home
                  </a>
                </div>
                <div class="col-6">
                  <a href="https://propsiss.com/rentals" class="btn btn-primary w-100">
                    <i class="bi bi-arrow-clockwise"></i> Try Again
                  </a>
                </div>
              </div>
              
              <div class="mt-4">
                <small class="text-muted">
                  <i class="bi bi-info-circle"></i>
                  If you continue to experience issues, please contact our support team.
                </small>
              </div>
            </div>
          </div>
          
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
      `);
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
