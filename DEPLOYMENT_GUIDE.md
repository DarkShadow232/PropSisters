# 🚀 دليل الـ Deployment على VPS هوستينجر

## المتطلبات الأولية

### 1. معلومات VPS المطلوبة:
- **IP Address** الخاص بـ VPS
- **Username & Password** للوصول
- **Domain Name** (اختياري لكن مُفضل)

### 2. على جهازك المحلي:
- Git مُثبت
- SSH client (متوفر في ويندوز 10/11)

---

## 🛠️ المرحلة الأولى: إعداد VPS

### الخطوة 1: الاتصال بـ VPS

```bash
# افتح Command Prompt أو PowerShell وقم بالاتصال
ssh root@YOUR_VPS_IP

# أو إذا كان لديك مستخدم آخر
ssh username@YOUR_VPS_IP
```

### الخطوة 2: تشغيل سكريبت الإعداد

```bash
# تحميل سكريبت الإعداد
wget https://raw.githubusercontent.com/yourusername/sisterhood-style-rentals/main/deployment-setup.sh

# إعطاء صلاحيات التشغيل
chmod +x deployment-setup.sh

# تشغيل السكريبت
./deployment-setup.sh
```

---

## 📁 المرحلة الثانية: رفع المشروع

### الخطوة 1: رفع الكود على GitHub

**على جهازك المحلي:**

```bash
# إنشاء repository جديد على GitHub أولاً، ثم:
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sisterhood-style-rentals.git
git push -u origin main
```

### الخطوة 2: استنساخ المشروع على VPS

**على VPS:**

```bash
# الانتقال لمجلد التطبيق
cd /var/www/sisterhood-rentals

# استنساخ المشروع
git clone https://github.com/YOUR_USERNAME/sisterhood-style-rentals.git .

# تثبيت المكتبات
npm install

# إنشاء ملف البيئة للإنتاج
cp env.production.example .env.production

# تعديل الإعدادات (استبدل your-domain.com بالدومين الخاص بك)
nano .env.production
```

### الخطوة 3: بناء المشروع

```bash
# بناء المشروع للإنتاج
npm run build

# التحقق من وجود مجلد dist
ls -la dist/
```

---

## 🌐 المرحلة الثالثة: إعداد Nginx

### الخطوة 1: إنشاء ملف إعدادات Nginx

```bash
# إنشاء ملف الإعدادات
sudo nano /etc/nginx/sites-available/sisterhood-rentals
```

**انسخ محتوى ملف `nginx.conf` الذي أنشأناه وعدّل:**
- `your-domain.com` -> الدومين الخاص بك
- `your-vps-ip` -> IP الخاص بـ VPS

### الخطوة 2: تفعيل الموقع

```bash
# إنشاء رابط رمزي لتفعيل الموقع
sudo ln -s /etc/nginx/sites-available/sisterhood-rentals /etc/nginx/sites-enabled/

# حذف الموقع الافتراضي (اختياري)
sudo rm /etc/nginx/sites-enabled/default

# اختبار إعدادات Nginx
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

---

## 🔧 المرحلة الرابعة: التحقق والاختبار

### الخطوة 1: التحقق من حالة الخدمات

```bash
# التحقق من حالة Nginx
sudo systemctl status nginx

# التحقق من الموقع محلياً
curl http://localhost

# التحقق من المنافذ المفتوحة
sudo netstat -tlnp | grep :80
```

### الخطوة 2: اختبار من المتصفح

- اذهب إلى `http://YOUR_VPS_IP`
- أو `http://your-domain.com` إذا قمت بربط الدومين

---

## 🔄 المرحلة الخامسة: التحديثات المستقبلية

### استخدام سكريبت Deploy التلقائي:

```bash
# إعطاء صلاحيات لسكريبت التحديث
chmod +x deploy.sh

# تشغيل التحديث
./deploy.sh
```

### التحديث اليدوي:

```bash
cd /var/www/sisterhood-rentals
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

---

## 🔒 المرحلة السادسة: إعداد SSL (مُستحسن)

### تثبيت Let's Encrypt:

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx -y

# الحصول على شهادة SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# اختبار التجديد التلقائي
sudo certbot renew --dry-run
```

---

## 🔍 مشاكل شائعة وحلولها

### المشكلة: الموقع لا يعمل

```bash
# فحص لوجات Nginx
sudo tail -f /var/log/nginx/error.log

# فحص حالة Nginx
sudo systemctl status nginx

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

### المشكلة: Build يفشل

```bash
# تحقق من وجود Node.js
node --version
npm --version

# نظف الكاش
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### المشكلة: مشاكل الصلاحيات

```bash
# إعطاء الصلاحيات الصحيحة
sudo chown -R www-data:www-data /var/www/sisterhood-rentals
sudo chmod -R 755 /var/www/sisterhood-rentals
```

---

## 📊 معلومات مهمة

### المسارات المهمة:
- **مجلد التطبيق:** `/var/www/sisterhood-rentals`
- **ملفات Build:** `/var/www/sisterhood-rentals/dist`
- **إعدادات Nginx:** `/etc/nginx/sites-available/sisterhood-rentals`
- **لوجات Nginx:** `/var/log/nginx/`

### الأوامر المفيدة:
```bash
# مراقبة لوجات Nginx
sudo tail -f /var/log/nginx/access.log

# فحص استخدام المساحة
df -h

# فحص استخدام الذاكرة
free -h

# فحص العمليات النشطة
htop
```

---

## 🎯 خطوات ما بعد التنصيب

1. **ربط الدومين:** قم بتوجيه DNS للدومين الخاص بك إلى IP الـ VPS
2. **إعداد SSL:** استخدم Let's Encrypt للحصول على شهادة مجانية
3. **المراقبة:** راقب أداء الموقع ولوجات Nginx
4. **النسخ الاحتياطي:** قم بعمل backup منتظم للمشروع وقاعدة البيانات
5. **التحديثات:** قم بتحديث النظام والمكتبات بانتظام

---

## 🆘 الدعم

إذا واجهت أي مشاكل:

1. تحقق من لوجات Nginx
2. تأكد من صحة إعدادات Firebase
3. تحقق من صلاحيات الملفات
4. راجع إعدادات الفايرول (UFW)

**للتواصل:** راجع الأخطاء في Terminal وابحث عن الحلول أو اسأل في مجتمعات البرمجة.

---

**✨ نصائح للأداء الأفضل:**

- استخدم CDN لتسريع تحميل الصور
- فعّل Gzip compression (مُفعل في إعدادات Nginx)
- راقب استخدام الموارد بانتظام
- قم بتحسين حجم الصور قبل الرفع
- استخدم lazy loading للصور 