import { toast } from "sonner";

// Payment gateway configurations
export interface PaymentGateway {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  supportedCurrencies: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
  isActive: boolean;
  region: 'egypt' | 'mena' | 'global';
}

// Available payment gateways for Egyptian/MENA market
export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'paymob',
    name: 'paymob',
    displayName: 'Paymob',
    icon: '💳',
    supportedCurrencies: ['EGP', 'USD', 'EUR'],
    fees: { percentage: 2.9, fixed: 0 },
    isActive: true,
    region: 'egypt'
  },
  {
    id: 'fawry',
    name: 'fawry',
    displayName: 'Fawry',
    icon: '🏪',
    supportedCurrencies: ['EGP'],
    fees: { percentage: 1.5, fixed: 2 },
    isActive: true,
    region: 'egypt'
  },
  {
    id: 'kashier',
    name: 'kashier',
    displayName: 'Kashier',
    icon: '💰',
    supportedCurrencies: ['EGP', 'USD', 'SAR', 'AED'],
    fees: { percentage: 2.75, fixed: 0 },
    isActive: true,
    region: 'mena'
  },
  {
    id: 'paytabs',
    name: 'paytabs',
    displayName: 'PayTabs',
    icon: '🔒',
    supportedCurrencies: ['EGP', 'USD', 'SAR', 'AED', 'KWD'],
    fees: { percentage: 2.85, fixed: 0 },
    isActive: true,
    region: 'mena'
  },
  {
    id: 'paypal',
    name: 'paypal',
    displayName: 'PayPal',
    icon: '🅿️',
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    fees: { percentage: 3.4, fixed: 0.35 },
    isActive: true,
    region: 'global'
  },
  {
    id: 'credit-card',
    name: 'credit-card',
    displayName: 'Credit/Debit Card',
    icon: '💳',
    supportedCurrencies: ['EGP', 'USD', 'EUR'],
    fees: { percentage: 2.9, fixed: 0 },
    isActive: true,
    region: 'global'
  }
];

// Payment methods specific to Egyptian market
export const EGYPTIAN_PAYMENT_METHODS = [
  {
    id: 'vodafone-cash',
    name: 'Vodafone Cash',
    icon: '📱',
    description: 'دفع عبر فودافون كاش'
  },
  {
    id: 'orange-money',
    name: 'Orange Money',
    icon: '🍊',
    description: 'دفع عبر أورانج موني'
  },
  {
    id: 'etisalat-cash',
    name: 'Etisalat Cash',
    icon: '📞',
    description: 'دفع عبر اتصالات كاش'
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    icon: '🏦',
    description: 'تحويل بنكي'
  },
  {
    id: 'installments',
    name: 'Installments',
    icon: '📊',
    description: 'دفع بالتقسيط'
  }
];

// Payment processing interface
export interface PaymentRequest {
  amount: number;
  currency: string;
  gateway: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  bookingInfo: {
    propertyId: string;
    checkIn: Date;
    checkOut: Date;
    nights: number;
  };
  paymentMethod?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
  gateway: string;
}

// Calculate payment fees
export const calculatePaymentFees = (amount: number, gateway: string): number => {
  const paymentGateway = PAYMENT_GATEWAYS.find(g => g.id === gateway);
  if (!paymentGateway) return 0;
  
  const percentageFee = (amount * paymentGateway.fees.percentage) / 100;
  const totalFees = percentageFee + paymentGateway.fees.fixed;
  
  return Math.round(totalFees * 100) / 100; // Round to 2 decimal places
};

// Get available payment gateways for a specific region
export const getAvailableGateways = (region: 'egypt' | 'mena' | 'global' = 'egypt'): PaymentGateway[] => {
  return PAYMENT_GATEWAYS.filter(gateway => 
    gateway.isActive && (gateway.region === region || gateway.region === 'global')
  );
};

// Process payment through selected gateway
export const processPayment = async (paymentRequest: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const gateway = PAYMENT_GATEWAYS.find(g => g.id === paymentRequest.gateway);
    
    if (!gateway) {
      throw new Error('Payment gateway not found');
    }

    // Simulate payment processing based on gateway
    switch (paymentRequest.gateway) {
      case 'paymob':
        return await processPaymobPayment(paymentRequest);
      
      case 'fawry':
        return await processFawryPayment(paymentRequest);
      
      case 'kashier':
        return await processKashierPayment(paymentRequest);
      
      case 'paytabs':
        return await processPayTabsPayment(paymentRequest);
      
      case 'paypal':
        return await processPayPalPayment(paymentRequest);
      
      case 'credit-card':
        return await processCreditCardPayment(paymentRequest);
      
      default:
        throw new Error('Unsupported payment gateway');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed',
      gateway: paymentRequest.gateway
    };
  }
};

// Paymob payment processing
const processPaymobPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    console.log('🔗 PaymentService: Making Paymob payment request to:', `${apiUrl}/paymob/create-payment`);
    
    // Call backend API to create Paymob payment
    const response = await fetch(`${apiUrl}/paymob/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: request.amount,
        currency: request.currency,
        customerInfo: request.customerInfo,
        bookingInfo: request.bookingInfo,
        paymentMethod: request.paymentMethod
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        transactionId: data.transactionId,
        redirectUrl: data.paymentUrl,
        gateway: 'paymob'
      };
    } else {
      throw new Error(data.error || 'Payment creation failed');
    }
  } catch (error) {
    console.error('Paymob payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed',
      gateway: 'paymob'
    };
  }
};

// Fawry payment processing
const processFawryPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  // In production, integrate with Fawry API
  // https://developer.fawry.com/
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    transactionId: `fawry_${Date.now()}`,
    redirectUrl: `https://www.fawry.com/ECommerceWeb/Fawry/payments/charge?merchant=sample&referenceNumber=${Date.now()}`,
    gateway: 'fawry'
  };
};

// Kashier payment processing
const processKashierPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  // In production, integrate with Kashier API
  // https://docs.kashier.io/
  
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  return {
    success: true,
    transactionId: `kashier_${Date.now()}`,
    redirectUrl: `https://checkout.kashier.io/?merchantId=sample&amount=${request.amount}&currency=${request.currency}`,
    gateway: 'kashier'
  };
};

// PayTabs payment processing
const processPayTabsPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  // In production, integrate with PayTabs API
  // https://site.paytabs.com/en/developer/
  
  await new Promise(resolve => setTimeout(resolve, 2200));
  
  return {
    success: true,
    transactionId: `paytabs_${Date.now()}`,
    redirectUrl: `https://secure.paytabs.com/payment/page/sample`,
    gateway: 'paytabs'
  };
};

// PayPal payment processing
const processPayPalPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  // In production, integrate with PayPal API
  // https://developer.paypal.com/
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    transactionId: `paypal_${Date.now()}`,
    redirectUrl: `https://www.paypal.com/checkoutnow?token=sample_token`,
    gateway: 'paypal'
  };
};

// Credit card payment processing
const processCreditCardPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  // In production, integrate with a payment processor like Stripe
  
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return {
    success: true,
    transactionId: `card_${Date.now()}`,
    gateway: 'credit-card'
  };
};

// Validate payment gateway availability
export const validatePaymentGateway = (gateway: string, currency: string): boolean => {
  const paymentGateway = PAYMENT_GATEWAYS.find(g => g.id === gateway);
  
  if (!paymentGateway || !paymentGateway.isActive) {
    return false;
  }
  
  return paymentGateway.supportedCurrencies.includes(currency);
};

// Get recommended payment gateway based on user location and currency
export const getRecommendedGateway = (currency: string = 'EGP', userLocation: string = 'egypt'): PaymentGateway | null => {
  const availableGateways = getAvailableGateways(userLocation as any);
  
  // Filter by currency support
  const supportedGateways = availableGateways.filter(gateway => 
    gateway.supportedCurrencies.includes(currency)
  );
  
  if (supportedGateways.length === 0) return null;
  
  // For Egyptian market, prioritize local gateways
  if (currency === 'EGP') {
    const localGateway = supportedGateways.find(g => g.region === 'egypt');
    if (localGateway) return localGateway;
  }
  
  // Return gateway with lowest fees
  return supportedGateways.reduce((best, current) => {
    const bestTotalFee = best.fees.percentage + best.fees.fixed;
    const currentTotalFee = current.fees.percentage + current.fees.fixed;
    return currentTotalFee < bestTotalFee ? current : best;
  });
};

// Format currency for display
export const formatCurrency = (amount: number, currency: string = 'EGP'): string => {
  const currencySymbols: { [key: string]: string } = {
    'EGP': 'ج.م',
    'USD': '$',
    'EUR': '€',
    'SAR': 'ر.س',
    'AED': 'د.إ',
    'KWD': 'د.ك'
  };
  
  const symbol = currencySymbols[currency] || currency;
  return `${amount.toFixed(2)} ${symbol}`;
};

// Payment status tracking
export interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  gateway: string;
  createdAt: Date;
  updatedAt: Date;
}

// Check payment status
export const checkPaymentStatus = async (transactionId: string): Promise<PaymentStatus | null> => {
  try {
    // In production, this would query the payment gateway's API
    // For demo purposes, return a mock status
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      transactionId,
      status: 'completed',
      amount: 2500,
      currency: 'EGP',
      gateway: 'paymob',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return null;
  }
};

// Payment analytics
export const getPaymentAnalytics = () => {
  return {
    popularGateways: ['paymob', 'fawry', 'kashier'],
    averageTransactionValue: 2850,
    successRate: 94.5,
    preferredCurrency: 'EGP',
    mobilePaymentPercentage: 68
  };
};