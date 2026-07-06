# كحيل ماركت | Kohail Market

متجر سوبر ماركت إلكتروني احترافي مبني بـ React + Vite + Tailwind CSS، ومتصل بالكامل بقاعدة بيانات **Supabase** (PostgreSQL + Storage + Auth + RLS).

## التشغيل محليًا

```bash
npm install
cp .env.example .env      # ثم املأ القيم — راجع "متغيرات البيئة" تحت
npm run dev
```

الموقع هيشتغل على `http://localhost:5173`

## البناء للنشر (Production Build)

```bash
npm run build
npm run preview
```

---

## 🗄️ ربط المشروع بـ Supabase (خطوة بخطوة)

### 1) أنشئ مشروع Supabase
1. روح على [supabase.com](https://supabase.com) وسجّل دخول.
2. **New Project** → اختر اسم + باسورد لقاعدة البيانات + المنطقة.
3. بعد ما المشروع يتجهز، من **Project Settings → API** انسخ:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (سري، لسكريبت الـ seed فقط)

### 2) جهّز ملف البيئة
```bash
cp .env.example .env
```
افتح `.env` واملأ القيم الثلاثة اللي نسختها فوق.

### 3) شغّل السكيما (SQL Schema)
في **Supabase Dashboard → SQL Editor → New query**، نفّذ ملفات `supabase/migrations/` **بالترتيب حسب الرقم**:

1. `001_schema.sql` — الجداول الأساسية (categories, products, orders, order_items, admin_users) + دالة `place_order`
2. `002_policies.sql` — سياسات Row Level Security للجداول الأساسية
3. `003_storage.sql` — إنشاء 3 Storage buckets (`products`, `banners`, `website`) + صلاحياتها
4. `004_admin_tables.sql` — جداول لوحة التحكم (`product_images`, `homepage_banners`, `contact_messages`, `website_settings`) + عمود `is_featured`
5. `005_admin_policies.sql` — سياسات RLS لجداول لوحة التحكم

(انسخ محتوى كل ملف والصقه في SQL Editor واضغط Run، ثم انتقل للملف التالي.)

### 4) أنشئ حساب أدمن (مطلوب لتسجيل الدخول في `/admin`)
1. **Authentication → Users → Add user** → أنشئ مستخدم بإيميل وباسورد (هيبقى ده حساب دخولك للوحة التحكم).
2. في **SQL Editor**، اربطه بجدول `admin_users` (خُد الـ UUID من صفحة Authentication → Users):
   ```sql
   insert into public.admin_users (id, full_name, role)
   values ('USER-UUID-FROM-AUTH-USERS-TABLE', 'اسم الأدمن', 'super_admin');
   ```
3. افتح `/admin/login` على الموقع وسجّل الدخول بنفس الإيميل والباسورد. بدون الصف في `admin_users`، تسجيل الدخول لـ Supabase Auth هينجح لكن الداشبورد هتعتبره غير مصرّح له وترجعه لصفحة الدخول (وأي محاولة قراءة/كتابة من لوحة التحكم هترفضها RLS كمان).

### 5) ارفع البيانات والصور الحالية (Seed)
السكريبت ده بياخد كل الأقسام والمنتجات والصور اللي كانت Hardcoded في المشروع، ويرفعها لـ Supabase (الصور → Storage، البيانات → الجداول):

```bash
npm run seed
```

لازم يكون `SUPABASE_SERVICE_ROLE_KEY` موجود في `.env` عشان السكريبت يشتغل (بيتخطى RLS عمدًا لأنه سكريبت ترحيل بيانات لمرة واحدة، ومينفعش يتنفذ من المتصفح).

### 6) شغّل الموقع
```bash
npm run dev
```
الموقع هيقرأ الأقسام والمنتجات مباشرة من Supabase.

---

## 🔑 متغيرات البيئة المطلوبة

| المتغير | أين تجده | يُستخدم في |
|---|---|---|
| `VITE_SUPABASE_URL` | Project Settings → API | الفرونت إند + سكريبت الـ seed |
| `VITE_SUPABASE_ANON_KEY` | Project Settings → API | الفرونت إند (عام وآمن، محكوم بـ RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API | سكريبت `npm run seed` فقط — **سري، لا يُرفع أبدًا للمتصفح أو Git** |

---

## 🧱 السكيما (SQL Schema) — ملخص

جميع التعريفات الكاملة موجودة في `supabase/migrations/001_schema.sql` و `004_admin_tables.sql`. ملخص الجداول:

```
categories
├── id            text PK   (slug, e.g. "dairy")
├── name          text
├── image_path    text      (path inside "products" bucket)
├── gradient      text
├── sort_order    integer
└── created_at    timestamptz

products
├── id            text PK   (e.g. "dairy-1")
├── category_id   text FK → categories.id
├── name          text
├── description   text
├── image_path    text      (path inside "products" bucket)
├── price          numeric
├── old_price      numeric  (nullable — discount % derived from this)
├── in_stock       boolean
├── rating         numeric
├── is_new         boolean
├── best_seller    boolean
├── is_featured    boolean  (added in 004_admin_tables.sql — homepage "Featured" section)
├── created_at     timestamptz
└── updated_at     timestamptz (auto-updated by trigger)

product_images                  -- 004_admin_tables.sql
├── id            uuid PK
├── product_id    text FK → products.id (cascade delete)
├── image_path    text      (path inside "products" bucket)
├── sort_order    integer
└── created_at    timestamptz

homepage_banners                -- 004_admin_tables.sql
├── id            uuid PK
├── title         text
├── subtitle      text
├── image_path    text      (path inside "banners" bucket)
├── link_url      text
├── is_active     boolean
├── sort_order    integer
├── created_at    timestamptz
└── updated_at    timestamptz

contact_messages                -- 004_admin_tables.sql
├── id            uuid PK
├── name          text
├── phone         text
├── email         text
├── message       text
├── is_read       boolean
└── created_at    timestamptz

website_settings                -- 004_admin_tables.sql (صف واحد فقط، id = true)
├── id                       boolean PK (ثابتة true — تفرض صف واحد)
├── store_name_ar/en         text
├── tagline, phone, whatsapp_number, email, address, working_hours  text
├── facebook_url, instagram_url, google_maps_url                    text
├── delivery_fee, free_delivery_threshold                           numeric
├── logo_path                text (path inside "website" bucket)
└── updated_at               timestamptz

orders
├── id                uuid PK
├── customer_name     text
├── customer_phone    text
├── customer_address  text
├── notes             text
├── subtotal          numeric
├── delivery_fee      numeric
├── total             numeric
├── status            text   (pending/confirmed/out_for_delivery/delivered/cancelled)
├── payment_method    text   (default: cash_on_delivery)
└── created_at        timestamptz

order_items
├── id            uuid PK
├── order_id      uuid FK → orders.id      (cascade delete)
├── product_id    text FK → products.id    (nullable, set null on delete)
├── product_name  text    (snapshot)
├── unit_price    numeric (snapshot)
├── quantity      integer
└── line_total    numeric (generated: unit_price * quantity)

admin_users
├── id          uuid PK  FK → auth.users.id (cascade delete)
├── full_name   text
├── role        text  ('admin' | 'super_admin')
└── created_at  timestamptz
```

**العلاقات:** `products.category_id → categories.id` · `product_images.product_id → products.id` · `order_items.order_id → orders.id` · `order_items.product_id → products.id` · `admin_users.id → auth.users.id`.

Checkout بيستخدم دالة `place_order(...)` (موجودة في `001_schema.sql`) بدل الـ INSERT المباشر، عشان تضمن إن الطلب وكل عناصره بيتسجلوا كعملية واحدة atomic.

---

## 🔒 سياسات RLS — ملخص

كل التفاصيل في `supabase/migrations/002_policies.sql` و `005_admin_policies.sql`. الفكرة العامة:

| الجدول | قراءة (SELECT) | كتابة (INSERT/UPDATE/DELETE) |
|---|---|---|
| `categories` | الجميع (anon + authenticated) | أدمن فقط |
| `products` | الجميع (anon + authenticated) | أدمن فقط |
| `product_images` | الجميع | أدمن فقط |
| `homepage_banners` | البانرات المفعّلة للجميع، الكل للأدمن | أدمن فقط |
| `contact_messages` | أدمن فقط | INSERT مفتوح للجميع (نموذج التواصل)، تعديل/حذف أدمن فقط |
| `website_settings` | الجميع (anon + authenticated) | أدمن فقط (UPDATE فقط — صف واحد ثابت) |
| `orders` | أدمن فقط | لا يوجد INSERT مباشر — فقط عبر `place_order()` |
| `order_items` | أدمن فقط | لا يوجد INSERT مباشر — فقط عبر `place_order()` |
| `admin_users` | صاحب الحساب أو أدمن | `super_admin` فقط |

دالة `is_admin()` (SQL) بتتأكد إن `auth.uid()` الحالي موجود في جدول `admin_users` — وهي المستخدمة في كل سياسات الكتابة.

`place_order()` معرّفة كـ `SECURITY DEFINER`، فهي الطريقة الوحيدة المسموح بيها للعملاء الغير مسجلين إنهم ينشئوا طلب — من غير ما يقدروا يقرأوا أو يعدّلوا أي طلب تاني.

---

## 🖼️ إعداد Storage

3 buckets عامة (public) — معرّفة في `supabase/migrations/003_storage.sql`:

```
products/
├── categories/<category-id>.jpg
└── products/<product-id>/<file>.jpg      # صورة الغلاف + صور المعرض (product_images)

banners/
└── banners/<file>.jpg                     # بانرات الصفحة الرئيسية (homepage_banners)

website/
└── brand/<file>.jpg                       # شعار المتجر (website_settings.logo_path)
```

- القراءة عامة للجميع.
- الرفع/التعديل/الحذف مسموح فقط لحسابات الأدمن (`is_admin()`) — عن طريق لوحة التحكم `/admin`.
- الحد الأقصى لحجم الملف: 5MB، الأنواع المسموحة: jpeg/png/webp (و svg/x-icon في bucket الـ `website`).
- كل صورة تُرفع من لوحة التحكم تُضغط في المتصفح أولًا (Canvas API، أقصى بُعد 1600px، جودة 80%) قبل الرفع — انظر `src/utils/imageCompress.js`.

> ⚠️ لو عندك مشروع قديم فيه bucket باسم `product-images`، انقل الصور منه لـ `products` يدويًا (Storage → تحديد الكل → Move) ثم احذفه — التفاصيل في تعليق أعلى `003_storage.sql`.

كل ده معرّف في `supabase/migrations/003_storage.sql`.

---

## 🧩 بنية طبقة البيانات (مهم لو هتضيف صفحات جديدة)

```
src/
├── lib/supabaseClient.js       # عميل Supabase الوحيد بالمشروع
├── services/                   # نداءات Supabase الخام، قابلة لإعادة الاستخدام
│   ├── categoriesService.js
│   ├── productsService.js
│   ├── productImagesService.js # صور المعرض الإضافية للمنتج
│   ├── ordersService.js
│   ├── bannersService.js       # بانرات الصفحة الرئيسية
│   ├── messagesService.js      # رسائل التواصل
│   ├── settingsService.js      # إعدادات المتجر (صف واحد)
│   ├── storageService.js       # رفع/حذف الصور (بعد ضغطها) في أي bucket
│   └── adminService.js         # مصادقة الأدمن (تسجيل دخول/خروج/الجلسة الحالية)
├── data/
│   ├── store.js                # initDataStore() — بيجيب كل حاجة من Supabase مرة واحدة عند فتح الموقع
│   ├── categories.js           # كاش CATEGORIES + getCategoryById() — نفس الاستخدام القديم بالظبط
│   └── products.js             # كاش PRODUCTS + getProductById()... إلخ — نفس الاستخدام القديم بالظبط
├── admin/                       # لوحة التحكم بالكامل، مسار /admin/*
│   ├── AdminApp.jsx             # الراوتر الخاص بلوحة التحكم
│   ├── context/AdminAuthContext.jsx
│   ├── components/{AdminLayout, ProtectedRoute, ImageUploader, ConfirmDialog}.jsx
│   └── pages/{Login, Dashboard, Products, ProductForm, Categories, Banners, Orders, Messages, Settings}.jsx
```

**ليه الشكل ده؟** كل الصفحات كانت مكتوبة بطريقة synchronous (`CATEGORIES.map(...)`, `getProductById(id)`). بدل ما نغيّر كل صفحة عشان تستخدم `async/await` و loading states، بنعمل fetch واحد من Supabase وقت فتح الموقع (`src/main.jsx`)، ونملى بيه الكاش. أي صفحة أو كومبوننت فاضل **بدون أي تغيير** — نفس الاستيراد، نفس الاستدعاء.

لو عايز تضيف صفحة جديدة تجيب بيانات مباشرة (مش من الكاش)، استخدم دوال `src/services/*.js` مباشرة.

---

## 🌱 سكريبت الـ Seed

`npm run seed` (يشغّل `supabase/seed/seed.mjs`):
1. يرفع كل صور المنتجات/الأقسام/اللوجو من `public/assets/images/` إلى Storage.
2. يعمل upsert لكل الأقسام والمنتجات (نفس البيانات اللي كانت Hardcoded) في الجداول.

البيانات المصدر موجودة في `supabase/seed/data.mjs` — عدّل هنا وأعد تشغيل `npm run seed` لو حبيت تضيف/تعدّل منتجات بالجملة.

---

## هيكل المشروع الكامل

```
kohail-market/
├── public/assets/images/       # الصور المحلية المستخدمة كمصدر للـ seed فقط
├── supabase/
│   ├── migrations/
│   │   ├── 001_schema.sql
│   │   ├── 002_policies.sql
│   │   ├── 003_storage.sql
│   │   ├── 004_admin_tables.sql
│   │   └── 005_admin_policies.sql
│   └── seed/{data.mjs, seed.mjs}
├── src/
│   ├── lib/supabaseClient.js
│   ├── services/               # طبقة API القابلة لإعادة الاستخدام
│   ├── data/                   # الكاش + الـ selectors (synchronous)
│   ├── admin/                  # لوحة التحكم (/admin/*)
│   ├── components/{layout,ui,seo}
│   ├── context/CartContext.jsx
│   ├── hooks/{useCart, useToast, useSEO}
│   ├── pages/                  # صفحة لكل route — لم تتغيّر شكليًا في هذه الترحلة
│   ├── utils/{currency.js, imageCompress.js}
│   ├── App.jsx
│   └── main.jsx                # يجهّز بيانات Supabase قبل ما يعرض <App />
├── index.html
└── tailwind.config.js
```

## 🛠️ لوحة التحكم (`/admin`)

بعد تنفيذ خطوات الإعداد فوق وإنشاء حساب أدمن (الخطوة 4)، افتح `/admin/login` وسجّل الدخول. لوحة التحكم بتغطي:

- **المنتجات:** إضافة/تعديل/حذف، بحث، فلترة بالقسم، رفع صورة الغلاف + صور معرض إضافية، المخزون، السعر والسعر قبل الخصم، تمييز المنتج في الصفحة الرئيسية.
- **الأقسام:** إضافة/تعديل/حذف مع صورة وترتيب عرض.
- **الصفحة الرئيسية:** إدارة بانرات (عنوان/صورة/رابط/تفعيل) تظهر تلقائيًا فوق الصفحة الرئيسية.
- **الطلبات:** عرض كل الطلبات، تفاصيل العميل والأصناف، تحديث الحالة (قيد الانتظار/تم التأكيد/جارٍ التوصيل/تم التسليم/ملغي).
- **الرسائل:** رسائل نموذج "تواصل معنا" — عرض وحذف.
- **الإعدادات:** اسم المتجر، الشعار، أرقام التواصل، العنوان، روابط السوشيال ميديا، رسوم التوصيل.

كل الصور المرفوعة من اللوحة تُضغط تلقائيًا في المتصفح قبل الرفع لتقليل حجمها. الوصول للوحة بالكامل محكوم بـ RLS (`is_admin()`) بجانب الحماية في الواجهة نفسها.

---

## SEO / الأداء / الاستجابة
لسه زي ما هي من قبل: meta tags + Open Graph + favicons + robots.txt + sitemap.xml، Lazy loading للصور، Skeleton loading، ودعم كامل لكل أحجام الشاشات.

## قبل النشر الفعلي
- [ ] نفّذ الخطوات 1-6 فوق (بما فيها كل ملفات `supabase/migrations/001` إلى `005`) على مشروع Supabase حقيقي (production project، مش الديمو).
- [ ] أنشئ حساب الأدمن الأول وتأكد إنك قادر تسجّل الدخول على `/admin/login`.
- [ ] عدّل `https://www.kohailmarket.com` في `index.html`, `robots.txt`, `sitemap.xml`.
- [ ] راجع بيانات التواصل في `src/constants/site.js` (أو حدّثها لاحقًا من لوحة التحكم → الإعدادات).
- [ ] في Vercel: **Project Settings → Environment Variables** أضف `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` (لكل البيئات: Production/Preview/Development) — **لا تضع** `SUPABASE_SERVICE_ROLE_KEY` هناك، هو للاستخدام المحلي وقت الـ seed فقط.
- [ ] بعد أول نشر، جرّب: تصفح المتجر، إضافة منتج للسلة، إتمام طلب تجريبي، وتسجيل الدخول للوحة التحكم والتأكد من ظهور الطلب.
