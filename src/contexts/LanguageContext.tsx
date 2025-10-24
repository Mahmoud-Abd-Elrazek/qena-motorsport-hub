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
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.team': 'Team',
    'nav.projects': 'Projects',
    'nav.leaderboard': 'Leaderboard',
    'nav.contact': 'Contact',
    
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
  }
};
