# Al Awali Store — متجر العوالي

مشروع بداية لمتجر قيمنق عربي/إنجليزي باستخدام JavaScript وNode.js وExpress.

## قبل التشغيل
- ثبّت نسخة LTS من Node.js من https://nodejs.org/
- افتح مجلد المشروع في VS Code.
- افتح Terminal من القائمة Terminal → New Terminal.

## أوامر Windows PowerShell
نفّذ كل أمر لوحده وانتظر نتيجته:

```powershell
node -v
npm.cmd -v
npm.cmd install
Copy-Item .env.example .env
npm.cmd run check
npm.cmd start
```

ثم افتح `http://localhost:3000` في المتصفح.

إذا كان `Copy-Item` يقول إن `.env` موجود مسبقًا، تابع إلى الأمر التالي.

## ماذا يحتوي؟
- واجهة متجر متجاوبة مع العربية والإنجليزية.
- بحث وتصنيفات منتجات.
- سلة مشتريات محفوظة في المتصفح.
- نموذج طلب تجريبي يتحقق من المدخلات ويحفظ الطلبات في `data/orders.json`.
- واجهة API للمنتجات وفحص تشغيل الخادم (`/api/products`, `/api/health`).

## مهم جدًا قبل البيع الحقيقي
هذه نسخة تجريبية وليست جاهزة لاستقبال أموال حقيقية. لا توجد بوابة دفع مربوطة، ولا يوجد تسجيل دخول/لوحة إدارة آمنة. بيانات الطلب التجريبي تحفظ محليًا في ملف JSON؛ لا تستخدم هذا التخزين في الإنتاج. قبل الإطلاق:
1. اختر مزود دفع يدعم نشاطك وبلدك، وافتح حساب تاجر.
2. نفّذ إنشاء جلسة دفع من الخادم والتحقق من إشعارات الدفع (webhooks) بمفتاح سري محفوظ في `.env`.
3. استخدم قاعدة بيانات فعلية، ومصادقة ولوحة إدارة بصلاحيات.
4. أضف سياسة خصوصية، شروط بيع واسترجاع، بيانات التواصل، وضريبة/فواتير حسب الأنظمة المنطبقة.
5. تحقق من حقوق بيع الأكواد الرقمية ومناطقها وشروط الموردين.
6. انشر الموقع على استضافة تدعم Node.js وHTTPS، واختبر الدفع في وضع الاختبار أولًا.

لا تضع مفاتيح الدفع أو كلمات المرور في `public/app.js` أو أي ملف داخل `public`.


## Gaming categories
This demo includes PC components, accessories, consoles, demo digital listings, chairs/desks, networking, streaming gear, and bundles. Prices and stock are sample data and should be verified before real sales. Digital items are demo listings only.

## Deploy on Render
- Build command: `npm install`
- Start command: `npm start`
- The app binds to `0.0.0.0` and uses `process.env.PORT`.
- Orders are currently saved to a local JSON file. On free hosting, local files may be lost during restarts or redeploys; use a persistent database before accepting real customer orders.
- Checkout is demo-only; no payment is collected.
