import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Zap, 
  Shield, 
  Info,
  CheckCircle,
  Clock,
  Percent
} from 'lucide-react';
import { 
  PAYMENT_GATEWAYS, 
  EGYPTIAN_PAYMENT_METHODS,
  PaymentGateway,
  calculatePaymentFees,
  getAvailableGateways,
  getRecommendedGateway,
  formatCurrency
} from '@/services/paymentService';

interface PaymentGatewaySelectorProps {
  amount: number;
  currency?: string;
  onGatewaySelect: (gateway: string, method?: string) => void;
  selectedGateway?: string;
  userLocation?: string;
}

const PaymentGatewaySelector: React.FC<PaymentGatewaySelectorProps> = ({
  amount,
  currency = 'EGP',
  onGatewaySelect,
  selectedGateway,
  userLocation = 'egypt'
}) => {
  const [availableGateways, setAvailableGateways] = useState<PaymentGateway[]>([]);
  const [recommendedGateway, setRecommendedGateway] = useState<PaymentGateway | null>(null);
  const [showAllMethods, setShowAllMethods] = useState(false);

  useEffect(() => {
    const gateways = getAvailableGateways(userLocation as any);
    const recommended = getRecommendedGateway(currency, userLocation);
    
    setAvailableGateways(gateways);
    setRecommendedGateway(recommended);
  }, [currency, userLocation]);

  const getGatewayIcon = (gatewayId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'paymob': <CreditCard className="h-6 w-6" />,
      'fawry': <Building className="h-6 w-6" />,
      'kashier': <Zap className="h-6 w-6" />,
      'paytabs': <Shield className="h-6 w-6" />,
      'paypal': <CreditCard className="h-6 w-6" />,
      'credit-card': <CreditCard className="h-6 w-6" />
    };
    return iconMap[gatewayId] || <CreditCard className="h-6 w-6" />;
  };

  const getMethodIcon = (methodId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'vodafone-cash': <Smartphone className="h-5 w-5" />,
      'orange-money': <Smartphone className="h-5 w-5" />,
      'etisalat-cash': <Smartphone className="h-5 w-5" />,
      'bank-transfer': <Building className="h-5 w-5" />,
      'installments': <Clock className="h-5 w-5" />
    };
    return iconMap[methodId] || <CreditCard className="h-5 w-5" />;
  };

  const getGatewayBadgeColor = (gateway: PaymentGateway) => {
    if (gateway.region === 'egypt') return 'bg-green-100 text-green-800';
    if (gateway.region === 'mena') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getGatewayDescription = (gatewayId: string) => {
    const descriptions: { [key: string]: string } = {
      'paymob': 'بوابة الدفع الرائدة في مصر - دعم جميع البطاقات والمحافظ الإلكترونية',
      'fawry': 'ادفع نقداً في أكثر من 180,000 نقطة فوري في جميع أنحاء مصر',
      'kashier': 'حلول دفع متقدمة للشرق الأوسط مع أمان عالي',
      'paytabs': 'بوابة دفع معتمدة في دول الخليج مع دعم العملات المتعددة',
      'paypal': 'الدفع الآمن عالمياً مع حماية المشتري',
      'credit-card': 'ادفع مباشرة بالبطاقة الائتمانية أو المدينة'
    };
    return descriptions[gatewayId] || 'طريقة دفع آمنة وموثوقة';
  };

  return (
    <div className="space-y-6">
      {/* Recommended Gateway */}
      {recommendedGateway && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>الطريقة المُوصى بها:</strong> {recommendedGateway.displayName} - 
            أقل رسوم ({recommendedGateway.fees.percentage}%) ومناسبة لموقعك
          </AlertDescription>
        </Alert>
      )}

      {/* Main Payment Gateways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableGateways.map((gateway) => {
          const fees = calculatePaymentFees(amount, gateway.id);
          const totalAmount = amount + fees;
          const isSelected = selectedGateway === gateway.id;
          const isRecommended = recommendedGateway?.id === gateway.id;

          return (
            <Card 
              key={gateway.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary border-primary' : ''
              } ${isRecommended ? 'border-green-300' : ''}`}
              onClick={() => onGatewaySelect(gateway.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getGatewayIcon(gateway.id)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{gateway.displayName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getGatewayBadgeColor(gateway)}>
                          {gateway.region === 'egypt' ? 'مصري' : 
                           gateway.region === 'mena' ? 'عربي' : 'عالمي'}
                        </Badge>
                        {isRecommended && (
                          <Badge className="bg-green-100 text-green-800">مُوصى به</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-6 w-6 text-primary" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {getGatewayDescription(gateway.id)}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">المبلغ الأساسي:</span>
                    <span>{formatCurrency(amount, currency)}</span>
                  </div>
                  
                  {fees > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Percent className="h-3 w-3 mr-1" />
                        رسوم المعالجة:
                      </span>
                      <span className="text-orange-600">
                        +{formatCurrency(fees, currency)}
                      </span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-semibold">
                    <span>المجموع الكلي:</span>
                    <span className="text-lg text-primary">
                      {formatCurrency(totalAmount, currency)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {gateway.supportedCurrencies.map((curr) => (
                    <Badge key={curr} variant="outline" className="text-xs">
                      {curr}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Egyptian Mobile Payment Methods */}
      {currency === 'EGP' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Smartphone className="h-5 w-5 mr-2 text-primary" />
              طرق الدفع المحلية
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAllMethods(!showAllMethods)}
            >
              {showAllMethods ? 'إخفاء' : 'عرض الكل'}
            </Button>
          </div>

          {showAllMethods && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {EGYPTIAN_PAYMENT_METHODS.map((method) => (
                <Card 
                  key={method.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => onGatewaySelect('paymob', method.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {getMethodIcon(method.id)}
                      </div>
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-xs text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Security Info */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>الأمان والحماية:</strong> جميع المعاملات محمية بتشفير SSL 256-bit ومعتمدة من PCI DSS. 
          بياناتك المالية آمنة ولا يتم حفظها على خوادمنا.
        </AlertDescription>
      </Alert>

      {/* Payment Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">نصائح للدفع:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• استخدم Paymob أو Fawry للدفع المحلي بأقل رسوم</li>
                <li>• فوري يتيح الدفع نقداً في أي فرع قريب منك</li>
                <li>• PayPal آمن للمدفوعات الدولية مع حماية المشتري</li>
                <li>• تأكد من صحة بياناتك قبل إتمام الدفع</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGatewaySelector;