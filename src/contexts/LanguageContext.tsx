import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.team': 'الفريق',
    'nav.projects': 'المشاريع',
    'nav.leaderboard': 'المتصدرين',
    'nav.contact': 'تواصل معنا',

    'header.brand': 'فريق سباقات قنا',
    'header.subbrand': 'Qena Racing Team', // غالباً الاسم الإنجليزي يكتب كشعار فرعي
    'lang.name': 'English', // الاسم الذي سيظهر للتحويل

    // Hero
    'hero.title': 'فريق سباقات قنا',
    'hero.subtitle': 'نحن فريق رياضي متميز نسعى للتميز والابتكار في عالم السباقات والهندسة الميكانيكية',
    'hero.discover': 'اكتشف المزيد',
    'hero.projects': 'شاهد المشاريع',

    // Stats
    'stats.members': 'عضو نشط',
    'stats.projects': 'مشروع مكتمل',
    'stats.years': 'سنوات خبرة',
    'stats.awards': 'جائزة وإنجاز',

    // About
    'about.tag': 'من نحن',
    'about.title': 'فريق متميز في عالم السباقات',
    'about.desc1': 'نحن فريق من المهندسين والمبتكرين الشغوفين بعالم السباقات والهندسة الميكانيكية. نسعى لتصميم وتطوير سيارات سباق متطورة تجمع بين الأداء العالي والكفاءة.',
    'about.desc2': 'رؤيتنا هي أن نصبح فريقاً رائداً في مجال السباقات على المستوى الإقليمي والدولي، من خلال الابتكار المستمر والعمل الجماعي المتميز.',
    'about.readMore': 'اقرأ المزيد عنا',

    // Projects
    'projects.tag': 'المشاريع',
    'projects.title': 'أحدث مشاريعنا',
    'projects.subtitle': 'استكشف أحدث المشاريع والابتكارات التي قام بها فريقنا',
    'projects.viewAll': 'عرض جميع المشاريع',
    'projects.details': 'التفاصيل',

    // Sponsors
    'sponsors.tag': 'شركاؤنا',
    'sponsors.title': 'شركاء النجاح',

    // CTA
    'cta.title': 'هل أنت مستعد للانضمام لفريقنا؟',
    'cta.subtitle': 'نحن نبحث دائماً عن مواهب جديدة ومتحمسة للانضمام إلى فريقنا',
    'cta.contact': 'تواصل معنا الآن',

    // Footer
    'footer.aboutTitle': 'عن الفريق',
    'footer.aboutDesc': 'فريق سباقات قنا هو فريق رياضي متميز يسعى للتميز في عالم السباقات والهندسة الميكانيكية.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.home': 'الرئيسية',
    'footer.about': 'من نحن',
    'footer.team': 'الفريق',
    'footer.projects': 'المشاريع',
    'footer.contact': 'تواصل معنا',
    'footer.contactInfo': 'معلومات التواصل',
    'footer.social': 'وسائل التواصل',
    'footer.rights': 'جميع الحقوق محفوظة',

    // Contact Page
    'contact.hero.title': 'اتصل بنا',
    'contact.hero.subtitle': 'نحن هنا للإجابة على استفساراتك والترحيب بأفكارك',

    'contact.form.title': 'أرسل لنا رسالة',
    'contact.form.name': 'الاسم',
    'contact.form.name.placeholder': 'أدخل اسمك الكامل',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.phone': 'رقم الهاتف',
    'contact.form.message': 'الرسالة',
    'contact.form.message.placeholder': 'اكتب رسالتك هنا...',
    'contact.form.submit': 'إرسال الرسالة',

    'contact.info.title': 'معلومات التواصل',
    'contact.info.subtitle': 'يمكنك التواصل معنا من خلال النموذج أو عبر وسائل الاتصال التالية',
    'contact.info.address': 'العنوان',
    'contact.info.address.value': 'جامعة جنوب الوادي، قنا، مصر',
    'contact.info.phone': 'الهاتف',
    'contact.info.email': 'البريد الإلكتروني',

    'contact.hours.title': 'ساعات العمل',
    'contact.hours.weekdays': 'السبت - الخميس',
    'contact.hours.weekend': 'الجمعة',
    'contact.hours.closed': 'مغلق',

    'contact.toast.error': 'الرجاء ملء جميع الحقول المطلوبة',
    'contact.toast.success': 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً',

    // Admin Dashboard
    'admin.title': 'لوحة التحكم',
    'admin.subtitle': 'Qena Racing Team',
    'admin.logout': 'تسجيل الخروج',
    'admin.logout.success': 'تم تسجيل الخروج بنجاح',

    'admin.stats.members': 'الأعضاء',
    'admin.stats.projects': 'المشاريع',
    'admin.stats.points': 'النقاط الكلية',

    'admin.nav.members.title': 'إدارة الأعضاء',
    'admin.nav.members.desc': 'إضافة، تعديل، أو حذف أعضاء الفريق وإدارة معلوماتهم',
    'admin.nav.members.btn': 'إدارة الأعضاء',

    'admin.nav.projects.title': 'إدارة المشاريع',
    'admin.nav.projects.desc': 'إضافة مشاريع جديدة وتحديث تفاصيل المشاريع الحالية',
    'admin.nav.projects.btn': 'إدارة المشاريع',

    'admin.nav.points.title': 'نظام النقاط',
    'admin.nav.points.desc': 'إضافة أو تعديل نقاط الأعضاء بناءً على أدائهم الأسبوعي',
    'admin.nav.points.btn': 'إدارة النقاط',


    // Login Page
    'login.title': 'لوحة التحكم',
    'login.subtitle': 'تسجيل الدخول للمسؤولين فقط',
    'login.email': 'البريد الإلكتروني',
    'login.password': 'كلمة المرور',
    'login.btn': 'تسجيل الدخول',
    'login.loading': 'جاري التحقق...',
    'login.back': 'العودة للصفحة الرئيسية',
    'login.success': 'تم تسجيل الدخول بنجاح',
    'login.error.required': 'يرجى إدخال البيانات كاملة',
    'login.error.invalid': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'login.error.server': 'حدث خطأ أثناء الاتصال بالسيرفر',
    'login.error.noData': 'فشل تسجيل الدخول: لم يتم استلام بيانات صالحة',
    'login.error.network': 'تعذر الاتصال بالسيرفر، تأكد من اتصال الإنترنت',

  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.team': 'Team',
    'nav.projects': 'Projects',
    'nav.leaderboard': 'Leaderboard',
    'nav.contact': 'Contact',

    'header.brand': 'Qena Racing Team',
    'header.subbrand': 'SVU University Team',
    'lang.name': 'العربية',

    // Hero
    'hero.title': 'Qena Racing Team',
    'hero.subtitle': 'We are a distinguished sports team striving for excellence and innovation in the world of racing and mechanical engineering',
    'hero.discover': 'Discover More',
    'hero.projects': 'View Projects',

    // Stats
    'stats.members': 'Active Members',
    'stats.projects': 'Completed Projects',
    'stats.years': 'Years of Experience',
    'stats.awards': 'Awards & Achievements',

    // About
    'about.tag': 'About Us',
    'about.title': 'Distinguished Team in Racing World',
    'about.desc1': 'We are a team of engineers and innovators passionate about racing and mechanical engineering. We strive to design and develop advanced racing cars that combine high performance and efficiency.',
    'about.desc2': 'Our vision is to become a leading team in racing at the regional and international level, through continuous innovation and outstanding teamwork.',
    'about.readMore': 'Read More About Us',

    // Projects
    'projects.tag': 'Projects',
    'projects.title': 'Our Latest Projects',
    'projects.subtitle': 'Explore the latest projects and innovations by our team',
    'projects.viewAll': 'View All Projects',
    'projects.details': 'Details',

    // Sponsors
    'sponsors.tag': 'Our Partners',
    'sponsors.title': 'Success Partners',

    // CTA
    'cta.title': 'Ready to Join Our Team?',
    'cta.subtitle': 'We are always looking for new and enthusiastic talents to join our team',
    'cta.contact': 'Contact Us Now',

    // Footer
    'footer.aboutTitle': 'About Team',
    'footer.aboutDesc': 'Qena Racing Team is a distinguished sports team striving for excellence in racing and mechanical engineering.',
    'footer.quickLinks': 'Quick Links',
    'footer.home': 'Home',
    'footer.about': 'About',
    'footer.team': 'Team',
    'footer.projects': 'Projects',
    'footer.contact': 'Contact',
    'footer.contactInfo': 'Contact Info',
    'footer.social': 'Social Media',
    'footer.rights': 'All Rights Reserved',

    // Contact Page
    'contact.hero.title': 'Contact Us',
    'contact.hero.subtitle': 'We are here to answer your questions and welcome your ideas',

    'contact.form.title': 'Send Us a Message',
    'contact.form.name': 'Name',
    'contact.form.name.placeholder': 'Enter your full name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'Type your message here...',
    'contact.form.submit': 'Send Message',

    'contact.info.title': 'Contact Information',
    'contact.info.subtitle': 'You can reach us via the form or through the following contact channels',
    'contact.info.address': 'Address',
    'contact.info.address.value': 'South Valley University, Qena, Egypt',
    'contact.info.phone': 'Phone',
    'contact.info.email': 'Email',

    'contact.hours.title': 'Working Hours',
    'contact.hours.weekdays': 'Saturday - Thursday',
    'contact.hours.weekend': 'Friday',
    'contact.hours.closed': 'Closed',

    'contact.toast.error': 'Please fill in all required fields',
    'contact.toast.success': 'Your message has been sent successfully! We will contact you shortly',

    // Admin Dashboard
    'admin.title': 'Dashboard',
    'admin.subtitle': 'Qena Racing Team',
    'admin.logout': 'Logout',
    'admin.logout.success': 'Logged out successfully',

    'admin.stats.members': 'Members',
    'admin.stats.projects': 'Projects',
    'admin.stats.points': 'Total Points',

    'admin.nav.members.title': 'Manage Members',
    'admin.nav.members.desc': 'Add, edit, or delete team members and manage their info',
    'admin.nav.members.btn': 'Manage Members',

    'admin.nav.projects.title': 'Manage Projects',
    'admin.nav.projects.desc': 'Add new projects and update current project details',
    'admin.nav.projects.btn': 'Manage Projects',

    'admin.nav.points.title': 'Points System',
    'admin.nav.points.desc': 'Add or edit member points based on weekly performance',
    'admin.nav.points.btn': 'Manage Points',

    // Login Page
    'login.title': 'Admin Dashboard',
    'login.subtitle': 'Admin Login Only',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.btn': 'Login',
    'login.loading': 'Verifying...',
    'login.back': 'Back to Home',
    'login.success': 'Login Successful',
    'login.error.required': 'Please fill in all fields',
    'login.error.invalid': 'Invalid email or password',
    'login.error.server': 'Server connection error',
    'login.error.noData': 'Login failed: Invalid data received',
    'login.error.network': 'Connection failed, check your internet',
  }
};
