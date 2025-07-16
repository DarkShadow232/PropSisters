# Environment Variables Setup Guide

## 🔧 إعداد متغيرات البيئة

هذا الدليل يوضح كيفية إعداد متغيرات البيئة للمشروع بشكل صحيح وآمن.

## 📋 الملفات المطلوبة

### 1. للتطوير المحلي
```bash
.env.local
```

### 2. للإنتاج
```bash
.env.production
```

## 🚀 خطوات الإعداد

### الخطوة 1: نسخ ملف القالب
```bash
cp .env.example .env.local
```

### الخطوة 2: تعبئة القيم المطلوبة
افتح ملف `.env.local` وأدخل القيم الفعلية:

```env
# Firebase Configuration (مطلوب)
VITE_FIREBASE_API_KEY=AIzaSyA-OX7rqN_1JUYST3mkm4blsL7cdFB90T0
VITE_FIREBASE_AUTH_DOMAIN=propsisters-7c886.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=propsisters-7c886
# ... باقي المتغيرات
```

## 🔐 المتغيرات المطلوبة

### Firebase (إجباري)
- `VITE_FIREBASE_API_KEY` - مفتاح API الخاص بـ Firebase
- `VITE_FIREBASE_AUTH_DOMAIN` - نطاق المصادقة
- `VITE_FIREBASE_PROJECT_ID` - معرف المشروع
- `VITE_FIREBASE_STORAGE_BUCKET` - حاوية التخزين
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - معرف المرسل
- `VITE_FIREBASE_APP_ID` - معرف التطبيق
- `VITE_FIREBASE_MEASUREMENT_ID` - معرف القياس (اختياري)

### إعدادات التطبيق
- `VITE_APP_NAME` - اسم التطبيق
- `VITE_APP_URL` - رابط التطبيق
- `NODE_ENV` - بيئة التشغيل (development/production)

### الخدمات الخارجية (اختياري)
- `VITE_GOOGLE_MAPS_API_KEY` - مفتاح خرائط جوجل
- `VITE_STRIPE_PUBLIC_KEY` - مفتاح Stripe العام
- `VITE_PAYPAL_CLIENT_ID` - معرف عميل PayPal

## 📁 هيكل ملفات التكوين

```
src/
├── config/
│   └── env.ts          # إدارة متغيرات البيئة
├── lib/
│   └── firebase.ts     # تكوين Firebase
.env.local              # متغيرات التطوير
.env.example            # قالب المتغيرات
.env.production.example # قالب الإنتاج
```

## 🛠️ استخدام المتغيرات في الكود

### الطريقة المفضلة (باستخدام ملف التكوين)
```typescript
import { ENV } from '@/config/env';

// استخدام متغيرات Firebase
const apiKey = ENV.FIREBASE.API_KEY;

// استخدام إعدادات التطبيق
const appName = ENV.APP.NAME;

// استخدام Feature Flags
if (ENV.FEATURES.ANALYTICS) {
  // تفعيل Analytics
}
```

### الطريقة المباشرة (غير مفضلة)
```typescript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
```

## 🔍 التحقق من المتغيرات

يتم التحقق من المتغيرات تلقائياً عند بدء التطبيق:

```typescript
import { validateEnv } from '@/config/env';

// يتم استدعاؤها تلقائياً في firebase.ts
validateEnv();
```

## 🚨 أمان المتغيرات

### ✅ آمن
- جميع المتغيرات التي تبدأ بـ `VITE_` تكون مرئية في المتصفح
- مناسبة للمفاتيح العامة مثل Firebase API Key

### ❌ غير آمن
- لا تضع المفاتيح السرية في متغيرات `VITE_`
- المفاتيح السرية يجب أن تكون في الخادم فقط

## 🌍 بيئات مختلفة

### التطوير المحلي
```bash
NODE_ENV=development
VITE_DEBUG_MODE=true
VITE_APP_URL=http://localhost:8081
```

### الإنتاج
```bash
NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_APP_URL=https://yourdomain.com
```

## 🔧 استكشاف الأخطاء

### خطأ: "Firebase configuration is missing"
```bash
# تأكد من وجود الملف
ls -la .env.local

# تأكد من المتغيرات المطلوبة
grep VITE_FIREBASE .env.local
```

### خطأ: "Environment variables validated successfully" لا يظهر
```bash
# تأكد من تفعيل وضع التطوير
VITE_DEBUG_MODE=true
```

## 📝 ملاحظات مهمة

1. **لا تضع ملف `.env.local` في Git**
2. **استخدم `.env.example` كمرجع للمطورين الآخرين**
3. **تأكد من تحديث المتغيرات عند تغيير إعدادات Firebase**
4. **استخدم Feature Flags للتحكم في الميزات**

## 🆘 الحصول على المساعدة

إذا واجهت مشاكل في إعداد المتغيرات:

1. تأكد من نسخ `.env.example` إلى `.env.local`
2. تحقق من صحة قيم Firebase في وحدة التحكم
3. تأكد من أن جميع المتغيرات المطلوبة موجودة
4. أعد تشغيل خادم التطوير بعد تغيير المتغيرات

```bash
npm run dev
# أو
yarn dev
```