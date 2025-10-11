// Mock data for the application

export const teamMembers = [
  {
    id: "1",
    name: "أحمد محمد علي",
    role: "قائد الفريق",
    specialty: "الهندسة الميكانيكية",
    bio: "مهندس ميكانيكي متخصص في تصميم وتطوير السيارات الرياضية، يتمتع بخبرة واسعة في مجال السباقات.",
    image: "/placeholder.svg",
    points: 450,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "2",
    name: "سارة حسن إبراهيم",
    role: "مهندسة كهرباء",
    specialty: "الأنظمة الكهربائية",
    bio: "متخصصة في تصميم وتطوير الأنظمة الكهربائية للسيارات الرياضية والتحكم الإلكتروني.",
    image: "/placeholder.svg",
    points: 420,
    socials: {
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "3",
    name: "محمود خالد عبدالله",
    role: "مبرمج رئيسي",
    specialty: "البرمجة والذكاء الاصطناعي",
    bio: "مبرمج محترف متخصص في تطوير أنظمة التحكم الذكية وتحليل البيانات للسيارات.",
    image: "/placeholder.svg",
    points: 390,
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "4",
    name: "نور الدين أحمد",
    role: "مدير المشاريع",
    specialty: "الإدارة والتنظيم",
    bio: "خبير في إدارة المشاريع الهندسية وتنسيق العمل بين الفرق المختلفة.",
    image: "/placeholder.svg",
    points: 380,
    socials: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "5",
    name: "ياسمين محمد",
    role: "مهندسة تصميم",
    specialty: "التصميم الصناعي",
    bio: "مصممة مبدعة متخصصة في تصميم هياكل السيارات والديناميكا الهوائية.",
    image: "/placeholder.svg",
    points: 350,
    socials: {
      instagram: "https://instagram.com",
    },
  },
  {
    id: "6",
    name: "عمر سعيد",
    role: "فني ميكانيكا",
    specialty: "الصيانة والإصلاح",
    bio: "فني ماهر متخصص في صيانة وإصلاح السيارات الرياضية.",
    image: "/placeholder.svg",
    points: 320,
    socials: {
      facebook: "https://facebook.com",
    },
  },
];

export const projects = [
  {
    id: "1",
    title: "سيارة السباق QR-1",
    description: "مشروع تصميم وتصنيع سيارة سباق متطورة بمحرك عالي الأداء ونظام تعليق متقدم.",
    fullDescription: "مشروع طموح يهدف إلى تصميم وتصنيع سيارة سباق متكاملة تجمع بين الأداء العالي والكفاءة. تم تطوير المشروع على مدار عام كامل بمشاركة جميع أعضاء الفريق.",
    image: "/placeholder.svg",
    year: 2024,
    category: "سيارات السباق",
    specs: [
      "محرك: 4 أسطوانات، 2.0 لتر، توربو",
      "القوة: 350 حصان",
      "السرعة القصوى: 280 كم/ساعة",
      "الوزن: 850 كجم",
      "نظام التعليق: مزدوج متقدم",
      "الفرامل: أقراص كربونية",
    ],
    gallery: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: "2",
    title: "نظام التحكم الذكي",
    description: "تطوير نظام تحكم إلكتروني متقدم يستخدم الذكاء الاصطناعي لتحسين الأداء.",
    fullDescription: "نظام متطور يستخدم تقنيات الذكاء الاصطناعي لتحليل بيانات السيارة في الوقت الفعلي وتحسين الأداء تلقائياً.",
    image: "/placeholder.svg",
    year: 2024,
    category: "الأنظمة الإلكترونية",
    specs: [
      "معالج: ARM Cortex-A9",
      "الذاكرة: 4GB RAM",
      "الشاشة: 10 بوصة تعمل باللمس",
      "الاتصال: WiFi, Bluetooth, GPS",
      "الحساسات: 20+ حساس متقدم",
    ],
    gallery: ["/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: "3",
    title: "محرك كهربائي صديق للبيئة",
    description: "تصميم محرك كهربائي عالي الكفاءة للسيارات الرياضية.",
    fullDescription: "مشروع رائد يهدف إلى دمج التكنولوجيا الخضراء مع الأداء العالي من خلال تطوير محرك كهربائي متطور.",
    image: "/placeholder.svg",
    year: 2023,
    category: "الطاقة المتجددة",
    specs: [
      "القوة: 300 كيلووات",
      "العزم: 600 نيوتن متر",
      "البطارية: 75 كيلووات ساعة",
      "المدى: 400 كم",
      "وقت الشحن: 45 دقيقة (شحن سريع)",
    ],
    gallery: ["/placeholder.svg"],
  },
];

export const sponsors = [
  { id: "1", name: "شركة السرعة للسيارات", logo: "/placeholder.svg" },
  { id: "2", name: "مصنع المحركات المتقدمة", logo: "/placeholder.svg" },
  { id: "3", name: "شركة التكنولوجيا الذكية", logo: "/placeholder.svg" },
  { id: "4", name: "معهد الهندسة الرياضية", logo: "/placeholder.svg" },
];
