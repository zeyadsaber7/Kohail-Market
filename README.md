# كحيل ماركت | Kohail Market

متجر سوبر ماركت إلكتروني احترافي مبني بـ React + Vite + Tailwind CSS، جاهز للنشر مباشرة، وجاهز البنية لربطه بقاعدة بيانات (Supabase) لاحقًا بدون إعادة كتابة الموقع.

## التشغيل محليًا

```bash
npm install
npm run dev
```

الموقع هيشتغل على `http://localhost:5173`

## البناء للنشر (Production Build)

```bash
npm run build
npm run preview   # لمعاينة نسخة الإنتاج محليًا
```

الناتج هيكون في مجلد `dist/` جاهز لرفعه على أي استضافة استاتيك (Vercel, Netlify, Cloudflare Pages, إلخ).

## هيكل المشروع

```
kohail-market/
├── public/
│   ├── assets/images/         # صور المنتجات والشعار
│   ├── favicon-*.png, icon-512.png, apple-touch-icon.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── layout/            # Header, Footer, MobileMenu, FloatingButtons, Layout
│   │   └── ui/                 # ProductCard, CategoryCard, ProductGrid, Badge, StarRating...
│   ├── constants/              # site.js — بيانات المتجر (واتساب، فيسبوك، خرائط، التوصيل)
│   ├── context/                # CartContext — حالة السلة على مستوى الموقع كله
│   ├── data/                   # categories.js, products.js — "الجداول" الحالية
│   ├── hooks/                  # useCart, useToast, useSEO
│   ├── pages/                  # كل صفحة في ملف مستقل
│   ├── utils/                  # currency.js, cart.js, validators.js
│   ├── App.jsx                 # تعريف كل الـ Routes
│   ├── main.jsx                # نقطة الدخول
│   └── index.css
├── index.html                  # Meta Tags + Open Graph + Favicons
└── tailwind.config.js          # ألوان الهوية (brand.DEFAULT / dark / light / soft)
```

## الربط بـ Supabase لاحقًا (بدون إعادة بناء الموقع)

المشروع مصمم عمدًا بحيث تكون بيانات المنتجات والأقسام معزولة في `src/data/`، وكل الصفحات والمكونات **لا تستورد بيانات خام أبدًا** — هي بتستورد فقط الدوال (`getAllProducts`, `getProductById`, `getProductsByCategory`...). ده معناه إن الترحيل لقاعدة بيانات حقيقية بيبقى تعديل في مكان واحد فقط:

1. `npm install @supabase/supabase-js`
2. أنشئ `src/lib/supabaseClient.js`:
   ```js
   import { createClient } from "@supabase/supabase-js";
   export const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   );
   ```
3. في `src/data/products.js` و`src/data/categories.js`، استبدل المصفوفات الثابتة بدوال async بنفس الأسماء بالظبط، مثال:
   ```js
   export async function getAllProducts() {
     const { data } = await supabase.from("products").select("*");
     return data;
   }
   ```
4. حوّل الصفحات اللي بتستخدم الدوال دي لاستخدام `useEffect` + `useState` (أو React Query) بدل الاستدعاء المباشر.
5. لعمل نظام طلبات حقيقي: أنشئ جدول `orders` في Supabase، واستبدل التعليق الموجود في `src/pages/Checkout.jsx` (`MIGRATION NOTE`) باستدعاء `supabase.from("orders").insert(...)`.

لوحة التحكم (Admin Dashboard) المستقبلية هتقدر تتعامل مباشرة مع نفس جداول `categories` و`products` و`orders` من غير ما تلمس أي كومبوننت في الواجهة.

## SEO

- Meta Title / Description / Keywords + Open Graph + Twitter Card جاهزين في `index.html`.
- كل صفحة بتحدّث الـ `<title>` والـ description الخاصين بيها عبر `useSEO` (`src/hooks/useSEO.js`).
- `public/robots.txt` و `public/sitemap.xml` جاهزين — لازم تعدّل الدومين الحقيقي فيهم قبل النشر.
- ملحوظة: الموقع Client-Side Rendered (CSR)، فلو حبيت SEO أقوى (خصوصًا لصفحات المنتجات على جوجل) هتحتاج مستقبلًا تفعيل Server-Side Rendering أو Prerendering (مثل Next.js أو vite-plugin-ssr).

## الأداء

- Lazy loading لكل صور المنتجات (`loading="lazy"`).
- ضغط الصور مسبقًا قبل رفعها للمشروع.
- Skeleton loading أثناء تحميل المنتجات (`components/ui/Skeleton.jsx`, `ProductGrid`).
- Animations خفيفة (`fadeIn`, `toastIn`) مع احترام `prefers-reduced-motion`.

## قبل النشر الفعلي

- [ ] استبدل `https://www.kohailmarket.com` بالدومين الحقيقي في `index.html`, `robots.txt`, `sitemap.xml`.
- [ ] راجع بيانات التواصل في `src/constants/site.js`.
- [ ] لو هتضيف بوابة دفع إلكتروني مستقبلًا، الفلوّ الحالي (`Checkout.jsx`) مصمم يسهل إضافة خطوة دفع قبل شاشة النجاح.
