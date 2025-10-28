const crypto = require('crypto');

class PaymobService {
  constructor() {
    this.apiKey = process.env.PAYMOB_API_KEY;
    this.integrationId = process.env.PAYMOB_INTEGRATION_ID;
    this.iframeId = process.env.PAYMOB_IFRAME_ID;
    this.hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    this.baseUrl = 'https://accept.paymob.com/api';
  }

  /**
   * Step 1: Authentication with Paymob
   * @returns {Promise<Object>} Authentication response with token
   */
  async authenticate() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: this.apiKey
        })
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Paymob authentication error:', error);
      throw error;
    }
  }

  /**
   * Step 2: Create Order
   * @param {number} amount - Amount in EGP
   * @param {string} currency - Currency code (default: EGP)
   * @param {Object} items - Order items
   * @returns {Promise<Object>} Order response
   */
  async createOrder(amount, currency = 'EGP', items = []) {
    try {
      const authToken = await this.authenticate();
      
      const orderData = {
        auth_token: authToken.token,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100), // Convert to cents
        currency: currency,
        items: items
      };

      const response = await fetch(`${this.baseUrl}/ecommerce/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Paymob order creation error:', error);
      throw error;
    }
  }

  /**
   * Step 3: Create Payment Key
   * @param {string} orderId - Order ID from createOrder
   * @param {number} amount - Amount in EGP
   * @param {Object} userData - User information
   * @param {Object} billingData - Billing information
   * @returns {Promise<Object>} Payment key response
   */
  async createPaymentKey(orderId, amount, userData, billingData) {
    try {
      console.log('🔐 Paymob: Starting payment key creation...');
      console.log('🔐 Paymob: Order ID:', orderId);
      console.log('🔐 Paymob: Amount:', amount);
      console.log('🔐 Paymob: Billing data:', billingData);
      
      const authToken = await this.authenticate();
      console.log('✅ Paymob: Authentication successful, token received');
      
      const paymentKeyData = {
        auth_token: authToken.token,
        amount_cents: Math.round(amount * 100),
        expiration: 3600, // 1 hour
        order_id: orderId,
        billing_data: {
          apartment: billingData.apartment || 'N/A',
          email: billingData.email,
          floor: billingData.floor || 'N/A',
          first_name: billingData.first_name,
          street: billingData.street || 'N/A',
          building: billingData.building || 'N/A',
          phone_number: billingData.phone_number,
          shipping_method: 'PKG',
          postal_code: billingData.postal_code || 'N/A',
          city: billingData.city || 'Cairo',
          country: billingData.country || 'EG',
          last_name: billingData.last_name,
          state: billingData.state || 'Cairo'
        },
        currency: 'EGP',
        integration_id: this.integrationId
      };

      console.log('🔗 Paymob: Creating payment key with data:', JSON.stringify(paymentKeyData, null, 2));
      console.log('🔗 Paymob: Request URL:', `${this.baseUrl}/accept/payment_keys`);
      
      const response = await fetch(`${this.baseUrl}/accept/payment_keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentKeyData)
      });

      console.log('📡 Paymob: Response status:', response.status);
      console.log('📡 Paymob: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Paymob: Error response body:', errorText);
        throw new Error(`Payment key creation failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Paymob payment key creation error:', error);
      throw error;
    }
  }

  /**
   * Verify Payment HMAC
   * @param {Object} data - Payment callback data
   * @returns {boolean} - Whether HMAC is valid
   */
  verifyPaymentHmac(data) {
    try {
      const {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order: { id: order_id },
        owner,
        pending,
        source_data: { pan, sub_type, type },
        success,
        txn_response_code
      } = data;

      const stringToHash = 
        amount_cents +
        created_at +
        currency +
        error_occured +
        has_parent_transaction +
        id +
        integration_id +
        is_3d_secure +
        is_auth +
        is_capture +
        is_refunded +
        is_standalone_payment +
        is_voided +
        order_id +
        owner +
        pending +
        pan +
        sub_type +
        type +
        success +
        txn_response_code;

      const calculatedHmac = crypto
        .createHmac('sha256', this.hmacSecret)
        .update(stringToHash)
        .digest('hex');

      return calculatedHmac === data.hmac;
    } catch (error) {
      console.error('HMAC verification error:', error);
      return false;
    }
  }

  /**
   * Process Refund
   * @param {string} transactionId - Transaction ID to refund
   * @param {number} amount - Refund amount in EGP
   * @returns {Promise<Object>} Refund response
   */
  async processRefund(transactionId, amount) {
    try {
      const authToken = await this.authenticate();
      
      const refundData = {
        auth_token: authToken.token,
        transaction_id: transactionId,
        amount_cents: Math.round(amount * 100)
      };

      const response = await fetch(`${this.baseUrl}/accept/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(refundData)
      });

      if (!response.ok) {
        throw new Error(`Refund failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Paymob refund error:', error);
      throw error;
    }
  }

  /**
   * Get Transaction Details
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction details
   */
  async getTransactionDetails(transactionId) {
    try {
      const authToken = await this.authenticate();
      
      const response = await fetch(`${this.baseUrl}/accept/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get transaction details: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Paymob transaction details error:', error);
      throw error;
    }
  }

  /**
   * Generate Payment URL
   * @param {string} paymentToken - Payment token
   * @returns {string} Payment URL
   */
  generatePaymentUrl(paymentToken) {
    return `https://accept.paymob.com/api/acceptance/iframes/${this.iframeId}?payment_token=${paymentToken}`;
  }
}

module.exports = PaymobService;
