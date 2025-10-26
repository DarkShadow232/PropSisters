import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentComponentProps {
  paymentUrl: string;
  bookingId: string;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({
  paymentUrl,
  bookingId,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'processing' | 'success' | 'failed'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for payment completion messages
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'PAYMENT_SUCCESS') {
        setPaymentStatus('success');
        onPaymentSuccess(event.data);
      } else if (event.data.type === 'PAYMENT_ERROR') {
        setPaymentStatus('failed');
        setError(event.data.error);
        onPaymentError(event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onPaymentSuccess, onPaymentError]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setPaymentStatus('processing');
  };

  const handleRetry = () => {
    setPaymentStatus('loading');
    setError('');
    window.location.reload();
  };

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
          <p className="text-green-600 mb-4">
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => window.location.href = '/bookings'}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">Payment Failed</h2>
          <p className="text-red-600 mb-4">
            {error || 'There was an error processing your payment. Please try again.'}
          </p>
          <div className="space-x-3">
            <button
              onClick={handleRetry}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/properties'}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Secure Payment</h2>
              <p className="text-green-100">Complete your booking with Paymob</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6" />
              <span className="text-sm">SSL Secured</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Info */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Accepted Payment Methods</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-md border">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium">Credit/Debit Cards</span>
            </div>
            <div className="text-center p-3 bg-white rounded-md border">
              <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-green-600">VC</span>
              </div>
              <span className="text-sm font-medium">Vodafone Cash</span>
            </div>
            <div className="text-center p-3 bg-white rounded-md border">
              <div className="w-8 h-8 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-orange-600">OM</span>
              </div>
              <span className="text-sm font-medium">Orange Money</span>
            </div>
            <div className="text-center p-3 bg-white rounded-md border">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">F</span>
              </div>
              <span className="text-sm font-medium">Fawry</span>
            </div>
          </div>
        </div>

        {/* Payment Iframe */}
        <div className="p-6">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading payment form...</p>
            </div>
          )}
          
          <div className="relative">
            <iframe
              src={paymentUrl}
              width="100%"
              height="600"
              frameBorder="0"
              onLoad={handleIframeLoad}
              className="rounded-md border"
              title="Payment Form"
            />
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Secure Payment</h4>
                <p className="text-sm text-blue-700">
                  Your payment is processed securely by Paymob. We do not store your payment information. 
                  All transactions are encrypted and protected by industry-standard security measures.
                </p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">
              If you're having trouble with the payment, please contact our support team.
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="mailto:support@propsisters.com" className="text-blue-600 hover:text-blue-800">
                Email Support
              </a>
              <a href="tel:+201234567890" className="text-blue-600 hover:text-blue-800">
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
