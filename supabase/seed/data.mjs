/**
 * supabase/seed/data.mjs
 * -----------------------------------------------------------------------
 * The exact catalog that used to be hardcoded in src/data/*.js before the
 * Supabase migration. seed.mjs reads this file, uploads each image to
 * Storage, and inserts the rows into Postgres. Edit here (and re-run the
 * seed script) to change starter data — the app itself now reads
 * everything from Supabase, not from this file.
 * -----------------------------------------------------------------------
 */

// imageFile is relative to /public/assets/images/ in the project root.
export const CATEGORIES = [
  { id: "dairy", name: "الألبان", imageFile: "products/milk.jpg", gradient: "from-blue-600 to-blue-400", sortOrder: 1 },
  { id: "cheese", name: "الجبن", imageFile: "products/cheese.jpg", gradient: "from-amber-500 to-yellow-400", sortOrder: 2 },
  { id: "bakery", name: "المخبوزات", imageFile: "products/bread.jpg", gradient: "from-orange-600 to-amber-400", sortOrder: 3 },
  { id: "rice_pasta", name: "الأرز والمكرونة", imageFile: "products/rice.jpg", gradient: "from-blue-800 to-blue-500", sortOrder: 4 },
  { id: "legumes", name: "البقوليات", imageFile: "products/corn.jpg", gradient: "from-yellow-500 to-amber-400", sortOrder: 5 },
  { id: "oils", name: "الزيوت والسمن", imageFile: "products/oil.jpg", gradient: "from-yellow-400 to-orange-400", sortOrder: 6 },
  { id: "spices", name: "التوابل", imageFile: "products/seasoning.jpg", gradient: "from-red-500 to-orange-400", sortOrder: 7 },
  { id: "sweets", name: "الحلويات", imageFile: "products/kinderbueno.jpg", gradient: "from-red-600 to-rose-400", sortOrder: 8 },
  { id: "biscuits", name: "البسكويت", imageFile: "products/oreo.jpg", gradient: "from-blue-900 to-blue-600", sortOrder: 9 },
  { id: "chocolate", name: "الشيكولاتة", imageFile: "products/kinderbueno.jpg", gradient: "from-amber-800 to-amber-500", sortOrder: 10 },
  { id: "beverages", name: "المشروبات", imageFile: "products/soda.jpg", gradient: "from-blue-600 to-cyan-400", sortOrder: 11 },
  { id: "tea_coffee", name: "الشاي والقهوة", imageFile: "products/tea.jpg", gradient: "from-green-800 to-green-600", sortOrder: 12 },
  { id: "chips", name: "الشيبسي والتسالي", imageFile: "products/chips.jpg", gradient: "from-yellow-500 to-yellow-300", sortOrder: 13 },
  { id: "canned", name: "المعلبات", imageFile: "products/canned.jpg", gradient: "from-orange-700 to-amber-500", sortOrder: 14 },
  { id: "frozen", name: "المجمدات", imageFile: "products/frozenveg.jpg", gradient: "from-sky-600 to-blue-300", sortOrder: 15 },
  { id: "meat", name: "اللحوم والدواجن والأسماك", imageFile: "products/chicken.jpg", gradient: "from-blue-700 to-sky-500", sortOrder: 16 },
  { id: "eggs", name: "البيض", imageFile: "products/eggs.jpg", gradient: "from-amber-400 to-yellow-300", sortOrder: 17 },
  { id: "cleaning", name: "المنظفات", imageFile: "products/detergent.jpg", gradient: "from-pink-600 to-fuchsia-400", sortOrder: 18 },
  { id: "personal_care", name: "العناية الشخصية", imageFile: "products/shampoo.jpg", gradient: "from-emerald-700 to-emerald-500", sortOrder: 19 },
  { id: "offers", name: "العروض", imageFile: null, gradient: "from-red-600 to-red-400", sortOrder: 20 },
];

export const PRODUCTS = [
  { id: "dairy-1", name: "لبن جهينة كامل الدسم 1 لتر", categoryId: "dairy", imageFile: "products/milk.jpg", price: 55, oldPrice: 65, desc: "منتج طازج 100% طبيعي 3% دسم، غني بالكالسيوم والفيتامينات.", rating: 4.7, bestSeller: true },
  { id: "dairy-2", name: "لبن جهينة خالي الدسم 1 لتر", categoryId: "dairy", imageFile: "products/milk.jpg", price: 52, desc: "لبن خالي الدسم بدون لبن بودرة، مثالي لأنظمة التغذية الصحية.", rating: 4.5 },

  { id: "cheese-1", name: "جبنة رومي مصرية حادة 500 جم", categoryId: "cheese", imageFile: "products/cheese.jpg", price: 180, oldPrice: 210, desc: "جبنة رومي أصلية طعم حاد ومميز، مصنعة من ألبان طبيعية.", rating: 4.8 },
  { id: "cheese-2", name: "جبنة تركية طرية 400 جم", categoryId: "cheese", imageFile: "products/cheese.jpg", price: 140, desc: "جبنة تركية طرية غنية بالطعم، مثالية للفطار.", rating: 4.6 },

  { id: "bakery-1", name: "خبز توست بالردة Rich Bake", categoryId: "bakery", imageFile: "products/bread.jpg", price: 38, oldPrice: 45, desc: "خبز توست بالقمح الكامل، غني بالألياف ومناسب للرجيم.", rating: 4.6, isNew: true },
  { id: "bakery-2", name: "خبز توست أبيض Rich Bake", categoryId: "bakery", imageFile: "products/bread.jpg", price: 32, desc: "خبز توست أبيض طري، مثالي للسندوتشات اليومية.", rating: 4.4 },

  { id: "rice_pasta-1", name: "أرز مصري الضحى 1 كجم", categoryId: "rice_pasta", imageFile: "products/rice.jpg", price: 48, oldPrice: 55, desc: "أرز مصري أبيض فاخر حبة كاملة، ينتفخ وينضج بسهولة.", rating: 4.7, bestSeller: true },
  { id: "rice_pasta-2", name: "أرز مصري الضحى 5 كجم", categoryId: "rice_pasta", imageFile: "products/rice.jpg", price: 225, oldPrice: 250, desc: "عبوة اقتصادية من أرز الضحى الفاخر لجميع أفراد الأسرة.", rating: 4.8 },

  { id: "legumes-1", name: "ذرة صفراء حبوب 500 جم", categoryId: "legumes", imageFile: "products/corn.jpg", price: 35, desc: "حبوب ذرة صفراء نقية عالية الجودة، مثالية للطبخ والتسالي.", rating: 4.3 },
  { id: "legumes-2", name: "عدس أصفر مقشور 1 كجم", categoryId: "legumes", imageFile: "products/corn.jpg", price: 60, oldPrice: 68, desc: "عدس أصفر مقشور فاخر سريع النضج وغني بالبروتين.", rating: 4.6 },

  { id: "oils-1", name: "زيت عافية عباد الشمس 1.5 لتر", categoryId: "oils", imageFile: "products/oil.jpg", price: 130, oldPrice: 150, desc: "زيت عباد الشمس الصافي 100%، يدعم المناعة.", rating: 4.8 },
  { id: "oils-2", name: "سمن نباتي 800 جم", categoryId: "oils", imageFile: "products/oil.jpg", price: 95, desc: "سمن نباتي عالي الجودة مناسب للقلي والخبيز.", rating: 4.4 },

  { id: "spices-1", name: "توابل ميلرز سبرينكل بيتزا 90 جم", categoryId: "spices", imageFile: "products/seasoning.jpg", price: 45, desc: "بهارات جاهزة لرشها على البيتزا والبطاطس والفشار.", rating: 4.5 },
  { id: "spices-2", name: "بهارات مشكلة للطبخ 200 جم", categoryId: "spices", imageFile: "products/seasoning.jpg", price: 40, oldPrice: 48, desc: "خلطة بهارات مشكلة تناسب جميع الأطباق المصرية.", rating: 4.6 },

  { id: "sweets-1", name: "كيندر بوينو 2 قطعة", categoryId: "sweets", imageFile: "products/kinderbueno.jpg", price: 25, oldPrice: 30, desc: "ويفر مقرمش بحشو الحليب والبندق مغطى بالشوكولاتة.", rating: 4.9, isNew: true },
  { id: "sweets-2", name: "كيندر بوينو عائلي 6 قطع", categoryId: "sweets", imageFile: "products/kinderbueno.jpg", price: 140, oldPrice: 160, desc: "عبوة عائلية من كيندر بوينو الأصلي.", rating: 4.8 },

  { id: "biscuits-1", name: "بسكويت أوريو أورجينال 5+1", categoryId: "biscuits", imageFile: "products/oreo.jpg", price: 20, oldPrice: 25, desc: "بسكويت أوريو الأصلي بحشو الكريمة، عرض 5+1 مجانًا.", rating: 4.9, bestSeller: true, isNew: true },
  { id: "biscuits-2", name: "بسكويت أوريو فانيليا", categoryId: "biscuits", imageFile: "products/oreo.jpg", price: 20, inStock: false, desc: "بسكويت أوريو بنكهة الفانيليا اللذيذة.", rating: 4.5 },

  { id: "chocolate-1", name: "شوكولاتة كيندر بوينو كلاسيك", categoryId: "chocolate", imageFile: "products/kinderbueno.jpg", price: 25, desc: "طبقات مقرمشة من الويفر والبندق مغطاة بالشوكولاتة الفاخرة.", rating: 4.8 },
  { id: "chocolate-2", name: "كيندر بوينو ميني عبوة 10 قطع", categoryId: "chocolate", imageFile: "products/kinderbueno.jpg", price: 110, oldPrice: 125, desc: "قطع صغيرة مثالية للمشاركة والهدايا.", rating: 4.7 },

  { id: "beverages-1", name: "مشروب غازي كولا V Super Soda", categoryId: "beverages", imageFile: "products/soda.jpg", price: 15, desc: "مشروب غازي بنكهة الكولا منعش وبدون كافيين.", rating: 4.3 },
  { id: "beverages-2", name: "مياه معدنية طبيعية 1.5 لتر", categoryId: "beverages", imageFile: "products/soda.jpg", price: 10, oldPrice: 12, desc: "مياه معدنية نقية معبأة بمعايير جودة عالية.", rating: 4.6 },

  { id: "tea_coffee-1", name: "شاي أحمد تي إنجليش بريكفاست 100 فردة", categoryId: "tea_coffee", imageFile: "products/tea.jpg", price: 165, oldPrice: 190, desc: "شاي أسود فاخر بنكهة إنجليزية أصيلة، 100 كيس شاي.", rating: 4.9, bestSeller: true },
  { id: "tea_coffee-2", name: "قهوة سريعة الذوبان 200 جم", categoryId: "tea_coffee", imageFile: "products/tea.jpg", price: 220, desc: "قهوة سريعة التحضير بطعم غني ونكهة مميزة.", rating: 4.5 },

  { id: "chips-1", name: "شيبسي جبنة متبلة", categoryId: "chips", imageFile: "products/chips.jpg", price: 10, desc: "رقائق بطاطس مقرمشة بنكهة الجبنة المتبلة.", rating: 4.6, isNew: true },
  { id: "chips-2", name: "شيبسي كاتشب", categoryId: "chips", imageFile: "products/chips.jpg", price: 10, desc: "رقائق بطاطس مقرمشة بنكهة الكاتشب اللذيذة.", rating: 4.4 },

  { id: "canned-1", name: "تونة صن شاين قطعة واحدة", categoryId: "canned", imageFile: "products/canned.jpg", price: 55, oldPrice: 65, desc: "تونة فاخرة قطعة واحدة في زيت نباتي.", rating: 4.7, isNew: true },
  { id: "canned-2", name: "فول مدمس معلب 400 جم", categoryId: "canned", imageFile: "products/canned.jpg", price: 22, desc: "فول مدمس جاهز للأكل، غني بالبروتين والألياف.", rating: 4.3 },

  { id: "frozen-1", name: "خضار مشكل بازلاء وجزر مجمد Basma", categoryId: "frozen", imageFile: "products/frozenveg.jpg", price: 48, oldPrice: 55, desc: "خضار مجمد طازج يحافظ على القيمة الغذائية الكاملة.", rating: 4.6 },
  { id: "frozen-2", name: "ذرة مجمدة 400 جم", categoryId: "frozen", imageFile: "products/frozenveg.jpg", price: 45, desc: "حبات ذرة صفراء مجمدة طازجة جاهزة للطبخ.", rating: 4.4 },

  { id: "meat-1", name: "صدور دجاج بانيه كوكي 40 قطعة", categoryId: "meat", imageFile: "products/chicken.jpg", price: 260, oldPrice: 300, desc: "صدور دجاج مقرمشة بانيه جاهزة للقلي أو الفرن، 40 قطعة.", rating: 4.8, bestSeller: true },
  { id: "meat-2", name: "برجر لحم بقري مجمد 10 قطع", categoryId: "meat", imageFile: "products/chicken.jpg", price: 190, desc: "برجر لحم بقري طازج 100% مجمد، جاهز للشوي.", rating: 4.6 },

  { id: "eggs-1", name: "بيض أحمر بلدي طبق 30 بيضة", categoryId: "eggs", imageFile: "products/eggs.jpg", price: 105, oldPrice: 120, desc: "بيض أحمر طازج يومي، طبق 30 بيضة.", rating: 4.7, bestSeller: true },
  { id: "eggs-2", name: "بيض أبيض طبق 30 بيضة", categoryId: "eggs", imageFile: "products/eggs.jpg", price: 95, desc: "بيض أبيض طازج عالي الجودة، طبق 30 بيضة.", rating: 4.5 },

  { id: "cleaning-1", name: "مسحوق غسيل أوكسي 9 كجم", categoryId: "cleaning", imageFile: "products/detergent.jpg", price: 240, oldPrice: 280, desc: "مسحوق غسيل أوتوماتيك للأبيض والألوان، فعالية قوية ضد البقع.", rating: 4.7, bestSeller: true, isNew: true },
  { id: "cleaning-2", name: "سائل تنظيف أرضيات 1 لتر", categoryId: "cleaning", imageFile: "products/detergent.jpg", price: 40, desc: "سائل منظف معطر يترك رائحة منعشة تدوم طويلًا.", rating: 4.4 },

  { id: "personal_care-1", name: "شامبو تريسمي بوتانيكس 400 مل", categoryId: "personal_care", imageFile: "products/shampoo.jpg", price: 175, oldPrice: 195, desc: "شامبو مغذي بخلاصة جوز الهند والألوفيرا، خالي من البارابين.", rating: 4.8, bestSeller: true },
  { id: "personal_care-2", name: "بلسم تريسمي بوتانيكس 400 مل", categoryId: "personal_care", imageFile: "products/shampoo.jpg", price: 175, desc: "بلسم مرطب ومجدد للشعر التالف، بتركيبة احترافية.", rating: 4.7 },
];

export const BRAND_LOGO_FILE = "brand/logo.jpg";
