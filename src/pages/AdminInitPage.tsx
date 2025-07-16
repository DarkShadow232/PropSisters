import React, { useState } from 'react';
import { initializeFirestore, isDatabaseEmpty, resetDatabase } from '@/utils/initializeFirestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminInitPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [dbEmpty, setDbEmpty] = useState<boolean | null>(null);

  const checkDatabaseStatus = async () => {
    setLoading(true);
    try {
      const isEmpty = await isDatabaseEmpty();
      setDbEmpty(isEmpty);
      setMessage(isEmpty ? 'قاعدة البيانات فارغة وجاهزة للتهيئة' : 'قاعدة البيانات تحتوي على بيانات');
      setMessageType(isEmpty ? 'info' : 'success');
    } catch (error) {
      setMessage('خطأ في فحص قاعدة البيانات');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeDatabase = async () => {
    setLoading(true);
    setMessage('جاري تهيئة قاعدة البيانات...');
    setMessageType('info');
    
    try {
      const result = await initializeFirestore();
      
      if (result.success) {
        setMessage('✅ تم تهيئة قاعدة البيانات بنجاح! تم إضافة جميع البيانات الأولية.');
        setMessageType('success');
        setDbEmpty(false);
      } else {
        setMessage(`❌ فشل في تهيئة قاعدة البيانات: ${result.message}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`❌ خطأ غير متوقع: ${error}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين قاعدة البيانات؟ سيتم حذف جميع البيانات!')) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await resetDatabase();
      setMessage(result.message);
      setMessageType(result.success ? 'success' : 'error');
    } catch (error) {
      setMessage(`خطأ في إعادة التعيين: ${error}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    checkDatabaseStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 لوحة تحكم قاعدة البيانات
          </h1>
          <p className="text-gray-600">
            إدارة وتهيئة قاعدة بيانات Firebase Firestore
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${
            messageType === 'success' ? 'border-green-200 bg-green-50' :
            messageType === 'error' ? 'border-red-200 bg-red-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            {messageType === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {messageType === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            {messageType === 'info' && <Database className="h-4 w-4 text-blue-600" />}
            <AlertDescription className={`${
              messageType === 'success' ? 'text-green-800' :
              messageType === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Database Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                حالة قاعدة البيانات
              </CardTitle>
              <CardDescription>
                فحص حالة قاعدة البيانات الحالية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>حالة قاعدة البيانات:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  dbEmpty === null ? 'bg-gray-100 text-gray-600' :
                  dbEmpty ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {dbEmpty === null ? 'جاري الفحص...' :
                   dbEmpty ? 'فارغة' : 'تحتوي على بيانات'}
                </span>
              </div>
              
              <Button 
                onClick={checkDatabaseStatus}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 ml-2" />
                )}
                إعادة فحص
              </Button>
            </CardContent>
          </Card>

          {/* Initialize Database Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                تهيئة قاعدة البيانات
              </CardTitle>
              <CardDescription>
                إضافة البيانات الأولية للمشروع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p>• إضافة العقارات النموذجية</p>
                <p>• إضافة الحجوزات التجريبية</p>
                <p>• إضافة المراجعات والتقييمات</p>
                <p>• إضافة طلبات التصميم</p>
                <p>• إضافة إعدادات التطبيق</p>
              </div>
              
              <Button 
                onClick={handleInitializeDatabase}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : (
                  <Database className="h-4 w-4 ml-2" />
                )}
                تهيئة قاعدة البيانات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Options */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              خيارات متقدمة
            </CardTitle>
            <CardDescription>
              استخدم هذه الخيارات بحذر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">
                ⚠️ تحذير: إعادة تعيين قاعدة البيانات سيحذف جميع البيانات الموجودة!
              </p>
            </div>
            
            <Button 
              onClick={handleResetDatabase}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 ml-2" />
              )}
              إعادة تعيين قاعدة البيانات
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 التعليمات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div>
              <strong>1. فحص قاعدة البيانات:</strong>
              <p>تحقق من حالة قاعدة البيانات لمعرفة ما إذا كانت فارغة أم تحتوي على بيانات.</p>
            </div>
            
            <div>
              <strong>2. تهيئة قاعدة البيانات:</strong>
              <p>إضافة البيانات الأولية المطلوبة لتشغيل التطبيق بما في ذلك العقارات والحجوزات والمراجعات.</p>
            </div>
            
            <div>
              <strong>3. مراقبة العملية:</strong>
              <p>تابع الرسائل أعلاه لمعرفة حالة العمليات ونتائجها.</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
              <p className="text-blue-800">
                💡 نصيحة: بعد تهيئة قاعدة البيانات، يمكنك العودة إلى الصفحة الرئيسية لرؤية البيانات الجديدة.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminInitPage;