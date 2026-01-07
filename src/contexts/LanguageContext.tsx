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


    // Manage Members Page
    'manage.members.title': 'إدارة شؤون الأعضاء',
    'manage.members.back': 'العودة للوحة التحكم',
    'manage.members.list': 'قائمة الفريق',
    'manage.members.add': 'إضافة عضو جديد',
    "form.year": "السنة",


    // Table Headers
    'table.member': 'العضو',
    'table.role': 'الدور',
    'table.points': 'النقاط',
    'table.actions': 'الإجراءات',
    'table.role.default': 'عضو',

    // Pagination / Loading
    'list.loading': 'جاري تحميل المزيد...',
    'list.end': 'وصلت إلى نهاية القائمة',
    'list.error': 'فشل في تحميل الأعضاء',

    // Dialogs (Add/Edit)
    'dialog.edit.title': 'تعديل بيانات العضو',
    'dialog.add.title': 'إضافة عضو جديد للفريق',
    'dialog.desc': 'يرجى التأكد من صحة البيانات، خاصة رابط LinkedIn.',

    // Form Fields
    'form.image': 'الصورة الشخصية',
    'form.image.error': 'حجم الصورة كبير جداً! الحد الأقصى 2 ميجابايت',
    'form.name': 'الاسم الكامل',
    'form.name.placeholder': 'مثال: أحمد محمد',
    'form.role': 'الدور في الفريق',
    'form.role.placeholder': 'مثال: Team Leader',
    'form.specialization': 'التخصص',
    'form.bio': 'نبذة تعريفية',
    'form.linkedin': 'رابط LinkedIn',
    'form.required': 'يرجى ملء الحقول المطلوبة',

    // Actions
    'btn.cancel': 'إلغاء',
    'btn.save': 'حفظ البيانات',
    'btn.saving': 'جاري الحفظ...',
    'btn.delete': 'حذف',
    'btn.edit': 'تعديل',
    'btn.confirm_delete': 'نعم، احذف الآن',

    // Delete Dialog
    'delete.title': 'تأكيد الحذف',
    'delete.desc': 'هل أنت متأكد من حذف',
    'delete.warning': 'هذا الإجراء لا يمكن الرجوع عنه.',

    // Toasts
    'toast.delete.success': 'تم حذف العضو بنجاح',
    'toast.delete.error': 'فشل في عملية الحذف',
    'toast.save.success': 'تم حفظ البيانات بنجاح',
    'toast.save.error': 'حدث خطأ أثناء الحفظ',

    // Points System
    'points.title': 'نظام النقاط',
    'points.top_members': 'أفضل الأعضاء',
    'points.no_role': 'بدون دور',
    'points.unit': 'نقطة',

    // History Section
    'points.history.title': 'سجل النقاط',
    'points.history.add': 'إضافة نقاط',
    'points.history.clear_all': 'مسح السجل بالكامل',
    'points.history.date': 'التاريخ',
    'points.history.reason': 'السبب',
    'points.history.no_data': 'لا توجد عمليات',

    // Full List Section
    'points.list.title': 'قائمة النقاط الكاملة',
    'points.list.rank': 'الترتيب',

    // Dialogs (Add Points)
    'points.dialog.add_title': 'إضافة نقاط للعضو',
    'points.dialog.points_label': 'النقاط',
    'points.dialog.reason_label': 'السبب',
    'points.dialog.btn_save': 'حفظ النقاط',

    // Dialogs (Delete)
    'points.dialog.delete_single_title': 'تأكيد حذف العملية',
    'points.dialog.delete_single_desc': 'هل أنت متأكد من حذف هذه العملية من السجل؟',
    'points.dialog.delete_single_note': 'سيتم تعديل نقاط العضو تلقائياً بعد الحذف.',
    'points.dialog.delete_all_title': 'مسح السجل بالكامل',
    'points.dialog.delete_all_desc': 'هذا الإجراء سيقوم بحذف جميع العمليات نهائياً.',
    'points.dialog.btn_delete': 'نعم، احذف',
    'points.dialog.btn_delete_all': 'احذف الكل',

    // Toasts
    'points.toast.fetch_error': 'حدث خطأ في تحديث بيانات الأعضاء',
    'points.toast.delete_success': 'تم حذف العملية بنجاح',
    'points.toast.delete_fail': 'فشل الحذف',
    'points.toast.clear_success': 'تم مسح السجل بالكامل',
    'points.toast.update_success': 'تم التحديث بنجاح!',
    'points.loading': 'جاري تحميل البيانات...',

    // Member Select Component
    'select.label': 'اختر العضو المسجل *',
    'select.placeholder': 'ابحث عن عضو...',
    'select.search_placeholder': 'اكتب اسم العضو للبحث...',
    'select.not_found': 'العضو غير موجود.',
    'select.add_new': 'إضافة عضو جديد',
    'select.registered_group': 'الأعضاء المسجلين',
    'select.empty_state': 'لم يتم العثور على نتائج',

    // Leaderboard Page
    'leaderboard.hero.title': 'لوحة الصدارة',
    'leaderboard.hero.desc': 'نظام تحفيزي لتقييم أداء أعضاء الفريق بناءً على المساهمات والإنجازات',

    'leaderboard.full_ranking': 'التصنيف الكامل',
    'leaderboard.points': 'نقطة',

    // Info Section
    'leaderboard.info.title': 'كيف يتم حساب النقاط؟',
    'leaderboard.rules.1': 'المشاركة الفعالة في المشاريع: 50 نقطة',
    'leaderboard.rules.2': 'قيادة مشروع ناجح: 100 نقطة',
    'leaderboard.rules.3': 'الحضور المنتظم للاجتماعات: 10 نقاط أسبوعياً',
    'leaderboard.rules.4': 'تقديم أفكار إبداعية: 25 نقطة',
    'leaderboard.rules.5': 'المساهمة في التدريب والتوجيه: 30 نقطة',

    'leaderboard.toast.error': 'فشل في تحميل قائمة المتصدرين',


    // Manage Projects Page
    'projects.manage.title': 'إدارة مشاريع الفريق',
    'projects.list.title': 'المشاريع الحالية',
    'projects.add_new': 'إضافة مشروع جديد',
    'projects.loading': 'جاري جلب المشاريع...',

    // Table
    'projects.table.project': 'المشروع',
    'projects.table.category': 'الفئة',
    'projects.table.status': 'الحالة',
    'projects.table.year': 'السنة',
    'projects.table.actions': 'الإجراءات',
    'projects.status.completed': 'مكتمل',
    'projects.status.running': 'قيد التنفيذ',

    // Pagination
    'pagination.page': 'الصفحة',
    'pagination.of': 'من',
    'pagination.next': 'التالي',
    'pagination.prev': 'السابق',

    // Dialog (Add/Edit)
    'projects.dialog.edit_title': 'تعديل بيانات المشروع',
    'projects.dialog.add_title': 'إضافة مشروع جديد للأسطول',

    'projects.form.title': 'عنوان المشروع *',
    'projects.form.title_ph': 'مثال: سيارة السباق QR-25',
    'projects.form.category': 'الفئة',
    'projects.form.category_ph': 'كهربائية / وقود',
    'projects.form.year': 'السنة',
    'projects.form.status': 'الحالة',
    'projects.form.desc': 'وصف موجز للمشروع',
    'projects.form.desc_ph': 'تكلم عن أهداف المشروع وما تم إنجازه...',

    'projects.form.main_img': 'الصورة الرئيسية',
    'projects.form.upload_hint': 'انقر لرفع الصورة الرئيسية',
    'projects.form.delete_img': 'حذف',

    'projects.form.gallery': 'معرض الصور',
    'projects.form.specs': 'المواصفات التقنية',
    'projects.form.specs_ph': 'مثال: محرك بقوة 400 حصان',

    // Delete Dialog
    'projects.delete.title': 'تأكيد الحذف',
    'projects.delete.desc': 'هل أنت متأكد من حذف المشروع',
    'projects.delete.warning': 'لا يمكن التراجع عن هذا الإجراء وسيتم فقدان جميع البيانات المتعلقة به.',
    'projects.delete.confirm': 'حذف نهائي',

    // Toasts
    'projects.toast.load_error': 'فشل في تحميل البيانات',
    'projects.toast.delete_success': 'تم حذف المشروع بنجاح',
    'projects.toast.delete_error': 'فشل الحذف، حاول مرة أخرى',
    'projects.toast.title_required': 'يرجى إدخال عنوان المشروع',
    'projects.toast.update_success': 'تم تحديث المشروع',
    'projects.toast.add_success': 'تم إضافة المشروع',
    'projects.toast.network_error': 'خطأ في الشبكة',

    'projects.form.main_img_hint': 'تنبيه: إذا تم حذف الصورة الرئيسية، يجب رفع صورة بديلة لإتمام الحفظ.',
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

    // Manage Members Page
    'manage.members.title': 'Manage Members',
    'manage.members.back': 'Back to Dashboard',
    'manage.members.list': 'Team List',
    'manage.members.add': 'Add New Member',
    "form.year": "Year",

    // Table Headers
    'table.member': 'Member',
    'table.role': 'Role',
    'table.points': 'Points',
    'table.actions': 'Actions',
    'table.role.default': 'Member',

    // Pagination / Loading
    'list.loading': 'Loading more...',
    'list.end': 'End of list reached',
    'list.error': 'Failed to load members',

    // Dialogs (Add/Edit)
    'dialog.edit.title': 'Edit Member Details',
    'dialog.add.title': 'Add New Team Member',
    'dialog.desc': 'Please verify the data, especially the LinkedIn URL.',

    // Form Fields
    'form.image': 'Profile Image',
    'form.image.error': 'Image size is too large! Max 2MB',
    'form.name': 'Full Name',
    'form.name.placeholder': 'Ex: John Doe',
    'form.role': 'Team Role',
    'form.role.placeholder': 'Ex: Team Leader',
    'form.specialization': 'Specialization',
    'form.bio': 'Bio',
    'form.linkedin': 'LinkedIn URL',
    'form.required': 'Please fill in required fields',

    // Actions
    'btn.cancel': 'Cancel',
    'btn.save': 'Save Data',
    'btn.saving': 'Saving...',
    'btn.delete': 'Delete',
    'btn.edit': 'Edit',
    'btn.confirm_delete': 'Yes, Delete Now',

    // Delete Dialog
    'delete.title': 'Confirm Delete',
    'delete.desc': 'Are you sure you want to delete',
    'delete.warning': 'This action cannot be undone.',

    // Toasts
    'toast.delete.success': 'Member deleted successfully',
    'toast.delete.error': 'Delete operation failed',
    'toast.save.success': 'Data saved successfully',
    'toast.save.error': 'Error occurred while saving',

    // Points System
    'points.title': 'Points System',
    'points.top_members': 'Top Members',
    'points.no_role': 'No Role',
    'points.unit': 'pts',

    // History Section
    'points.history.title': 'Points History',
    'points.history.add': 'Add Points',
    'points.history.clear_all': 'Clear All History',
    'points.history.date': 'Date',
    'points.history.reason': 'Reason',
    'points.history.no_data': 'No transactions found',

    // Full List Section
    'points.list.title': 'Full Points List',
    'points.list.rank': 'Rank',

    // Dialogs (Add Points)
    'points.dialog.add_title': 'Add Points to Member',
    'points.dialog.points_label': 'Points',
    'points.dialog.reason_label': 'Reason',
    'points.dialog.btn_save': 'Save Points',

    // Dialogs (Delete)
    'points.dialog.delete_single_title': 'Confirm Transaction Delete',
    'points.dialog.delete_single_desc': 'Are you sure you want to delete this transaction?',
    'points.dialog.delete_single_note': 'Member points will be adjusted automatically.',
    'points.dialog.delete_all_title': 'Clear Entire History',
    'points.dialog.delete_all_desc': 'This action will permanently delete all transactions.',
    'points.dialog.btn_delete': 'Yes, Delete',
    'points.dialog.btn_delete_all': 'Delete All',

    // Toasts
    'points.toast.fetch_error': 'Error updating member data',
    'points.toast.delete_success': 'Transaction deleted successfully',
    'points.toast.delete_fail': 'Delete failed',
    'points.toast.clear_success': 'History cleared successfully',
    'points.toast.update_success': 'Updated successfully!',
    'points.loading': 'Loading data...',

    // Member Select Component
    'select.label': 'Select Registered Member *',
    'select.placeholder': 'Search for member...',
    'select.search_placeholder': 'Type member name to search...',
    'select.not_found': 'Member not found.',
    'select.add_new': 'Add New Member',
    'select.registered_group': 'Registered Members',
    'select.empty_state': 'No results found',

    // Leaderboard Page
    'leaderboard.hero.title': 'Leaderboard',
    'leaderboard.hero.desc': 'A motivational system to evaluate team members performance based on contributions and achievements',

    'leaderboard.full_ranking': 'Full Ranking',
    'leaderboard.points': 'pts',

    // Info Section
    'leaderboard.info.title': 'How are points calculated?',
    'leaderboard.rules.1': 'Active participation in projects: 50 points',
    'leaderboard.rules.2': 'Leading a successful project: 100 points',
    'leaderboard.rules.3': 'Regular meeting attendance: 10 points weekly',
    'leaderboard.rules.4': 'Submitting creative ideas: 25 points',
    'leaderboard.rules.5': 'Contribution to training and mentoring: 30 points',

    'leaderboard.toast.error': 'Failed to load leaderboard',

    // Manage Projects Page
    'projects.manage.title': 'Project Management',
    'projects.list.title': 'Current Projects',
    'projects.add_new': 'Add New Project',
    'projects.loading': 'Fetching projects...',

    // Table
    'projects.table.project': 'Project',
    'projects.table.category': 'Category',
    'projects.table.status': 'Status',
    'projects.table.year': 'Year',
    'projects.table.actions': 'Actions',
    'projects.status.completed': 'Completed',
    'projects.status.running': 'Running',

    // Pagination
    'pagination.page': 'Page',
    'pagination.of': 'of',
    'pagination.next': 'Next',
    'pagination.prev': 'Previous',

    // Dialog (Add/Edit)
    'projects.dialog.edit_title': 'Edit Project Details',
    'projects.dialog.add_title': 'Add New Project',

    'projects.form.title': 'Project Title *',
    'projects.form.title_ph': 'Ex: Racing Car QR-25',
    'projects.form.category': 'Category',
    'projects.form.category_ph': 'Electric / Fuel',
    'projects.form.year': 'Year',
    'projects.form.status': 'Status',
    'projects.form.desc': 'Project Description',
    'projects.form.desc_ph': 'Talk about project goals and achievements...',

    'projects.form.main_img': 'Main Image',
    'projects.form.upload_hint': 'Click to upload main image',
    'projects.form.delete_img': 'Remove',

    'projects.form.gallery': 'Gallery',
    'projects.form.specs': 'Technical Specs',
    'projects.form.specs_ph': 'Ex: 400HP Engine',

    // Delete Dialog
    'projects.delete.title': 'Confirm Delete',
    'projects.delete.desc': 'Are you sure you want to delete project',
    'projects.delete.warning': 'This action cannot be undone and all related data will be lost.',
    'projects.delete.confirm': 'Delete Permanently',

    // Toasts
    'projects.toast.load_error': 'Failed to load data',
    'projects.toast.delete_success': 'Project deleted successfully',
    'projects.toast.delete_error': 'Delete failed, try again',
    'projects.toast.title_required': 'Please enter project title',
    'projects.toast.update_success': 'Project updated successfully',
    'projects.toast.add_success': 'Project added successfully',
    'projects.toast.network_error': 'Network error',

    'projects.form.main_img_hint': 'Note: If the main image is deleted, a replacement must be uploaded to save.',
  }
};
