import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Save, Loader2, Globe, LayoutTemplate, BookOpen,
  Phone, Mail, MapPin, Clock, Facebook, Linkedin, Youtube, Instagram, Twitter,
  Upload, X, Plus, Trash2, ImageIcon, Eye, Target, Heart, Star, Shield, Zap, Lightbulb, Users, Trophy, Flag, CheckCircle, Flame
} from "lucide-react";
import { toast } from "sonner";
import imageCompression from 'browser-image-compression';

// 1. استدعاء الـ Context والـ Types
import { useSiteSettings, IdentityCard } from "@/contexts/SiteSettingsContext";
import { useLanguage } from "@/contexts/LanguageContext"; // استيراد الكونتكست

const ICON_MAP: Record<string, any> = {
  "Eye": Eye, "Target": Target, "Heart": Heart, "Star": Star, "Shield": Shield,
  "Zap": Zap, "Lightbulb": Lightbulb, "Users": Users, "Trophy": Trophy,
  "Flag": Flag, "Flame": Flame, "Check": CheckCircle
};

// --- مكون داخلي لرفع الصور (محدث لدعم النصوص) ---
const ImageUploadBox = ({ imageUrl, onUpload, onRemove, label, heightClass = "min-h-[220px]", isCompressing = false, texts }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center ${heightClass} bg-slate-50 relative group transition-colors hover:bg-slate-100`}>
      {isCompressing ? (
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs">{texts.compressing}</span>
        </div>
      ) : imageUrl ? (
        <>
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-md shadow-sm" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg z-10">
            <Button variant="destructive" size="sm" onClick={onRemove} type="button">
              <X className="h-4 w-4 me-1" /> {texts.remove}
            </Button>
          </div>
        </>
      ) : (
        <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center z-0">
          <div className="p-3 bg-white rounded-full shadow-sm"><Upload className="h-6 w-6 text-slate-400" /></div>
          <span className="text-sm text-slate-500 font-medium">{texts.upload}</span>
          <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
        </label>
      )}
    </div>
  </div>
);

const GeneralSettings = () => {
  const { settings, loading: contextLoading, refreshSettings } = useSiteSettings();
  const { t, language } = useLanguage(); 
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [compressingImg, setCompressingImg] = useState<string | null>(null);

  // 3. الحالة المحلية للفورم (Form State)
  const [formData, setFormData] = useState({
    // Basic Info
    siteName: "",
    navbarBio: "",
    logoImage: null as File | null,
    logoImageUrl: "",

    // Hero Section
    heroTitle: "",
    heroSubtitle: "",
    heroImage: null as File | null,
    heroImageUrl: "",

    // About Section
    homeSectionTitle: "",
    homeSectionContent: "",
    aboutImage: null as File | null,
    aboutImageUrl: "",

    // Dynamic Cards
    identityCards: [] as IdentityCard[],

    // Story
    ourStory: "",

    // Contact Info
    phone: "",
    email: "",
    address: "",
    workHours: "",

    // Social Links
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
    twitter: "",
  });

  // 4. ملء الفورم بالبيانات
  useEffect(() => {
    if (settings && settings.data) {
      const data = settings.data;

      setFormData(prev => ({
        ...prev,
        siteName: data.siteName || "",
        navbarBio: data.navbarBio || "",
        logoImageUrl: data.logoImageUrl || "",
        heroImageUrl: data.heroImageUrl || "",
        aboutImageUrl: data.aboutImageUrl || "",
        heroTitle: data.heroTitle || "",
        heroSubtitle: data.heroSubtitle || "",
        homeSectionTitle: data.homeSectionTitle || "",
        homeSectionContent: data.homeSectionContent || "",
        ourStory: data.ourStory || "",
        identityCards: data.identityCards || [],
        phone: data.contact?.phone || data.phone || "",
        email: data.contact?.email || data.email || "",
        address: data.contact?.address || data.address || "",
        workHours: data.contact?.workHours || data.workHours || "",
        facebook: data.social?.facebook || data.facebook || "",
        linkedin: data.social?.linkedin || data.linkedin || "",
        youtube: data.social?.youtube || data.youtube || "",
        instagram: data.social?.instagram || data.instagram || "",
        twitter: data.social?.twitter || data.twitter || "",
      }));
    }
  }, [settings]);


  // --- دوال التعامل مع الصور ---
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, fileKey: string, urlKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressingImg(fileKey);
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);

      setFormData(prev => ({
        ...prev,
        [fileKey]: compressedFile,
        [urlKey]: URL.createObjectURL(compressedFile)
      }));
      toast.success(t('settings.toast.img_ready'));
    } catch (error) {
      toast.error(t('settings.toast.img_error'));
    } finally {
      setCompressingImg(null);
    }
  };

  const handleRemoveFile = (fileKey: string, urlKey: string) => {
    setFormData(prev => ({ ...prev, [fileKey]: null, [urlKey]: "" }));
  };

  // --- دوال الكروت الديناميكية ---
  const handleAddCard = () => {
    setFormData(prev => ({ ...prev, identityCards: [...prev.identityCards, { id: Date.now(), title: "", content: "", iconName: "Star" }] }));
  };
  const handleRemoveCard = (id: number) => {
    setFormData(prev => ({ ...prev, identityCards: prev.identityCards.filter(card => card.id !== id) }));
  };
  const handleCardChange = (id: number, field: keyof IdentityCard, value: string) => {
    setFormData(prev => ({
      ...prev, identityCards: prev.identityCards.map(card => card.id === id ? { ...card, [field]: value } : card)
    }));
  };
  const getIconComponent = (iconName: string) => { const Icon = ICON_MAP[iconName] || Star; return <Icon className="h-5 w-5" />; };

  // --- Save Function ---
  const handleSave = async () => {
    setIsSaving(true);
    const dataToSend = new FormData();

    // 1. Text Data
    dataToSend.append("SiteName", formData.siteName);
    dataToSend.append("NavbarBio", formData.navbarBio);
    dataToSend.append("HeroTitle", formData.heroTitle);
    dataToSend.append("HeroSubtitle", formData.heroSubtitle);
    dataToSend.append("HomeSectionTitle", formData.homeSectionTitle);
    dataToSend.append("HomeSectionContent", formData.homeSectionContent);
    dataToSend.append("OurStory", formData.ourStory);

    // 2. Contact
    dataToSend.append("Phone", formData.phone);
    dataToSend.append("Email", formData.email);
    dataToSend.append("Address", formData.address);
    dataToSend.append("WorkHours", formData.workHours);

    // 3. Social
    dataToSend.append("Facebook", formData.facebook);
    dataToSend.append("Linkedin", formData.linkedin);
    dataToSend.append("Youtube", formData.youtube);
    dataToSend.append("Instagram", formData.instagram);
    dataToSend.append("Twitter", formData.twitter);

    
    // 4. Images
    if (formData.logoImage instanceof File || formData.logoImage instanceof Blob) {
      dataToSend.append("LogoImage", formData.logoImage, "logo.jpg");
    }
    if (formData.heroImage instanceof File || formData.heroImage instanceof Blob) {
      dataToSend.append("HeroImage", formData.heroImage, "hero.jpg");
    }
    if (formData.aboutImage instanceof File || formData.aboutImage instanceof Blob) {
      dataToSend.append("AboutImage", formData.aboutImage, "about.jpg");
    }

    // 5. Cards Array
    formData.identityCards.forEach((card, index) => {
      dataToSend.append(`IdentityCards[${index}].Title`, card.title);
      dataToSend.append(`IdentityCards[${index}].Content`, card.content);
      dataToSend.append(`IdentityCards[${index}].IconName`, card.iconName);
    });

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t('settings.toast.login_req'));
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/TeamInfo/UpdateSettings", {
        method: "PUT",
        body: dataToSend,
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        toast.success(t('settings.toast.save_success'));
        await refreshSettings();
      } else {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        toast.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error(t('settings.toast.save_error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (contextLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading settings...</p>
      </div>
    );
  }

  // نصوص ImageUploadBox المترجمة
  const uploadTexts = {
      upload: t('settings.upload_hint'),
      remove: t('settings.remove_img'),
      compressing: t('settings.compressing')
  };

  return (
    // استخدام dir للتحكم في الاتجاه
    <div className="container mx-auto p-6 max-w-5xl space-y-6" dir={dir}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 p-2 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.desc')}</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="shadow-md min-w-[140px]">
          {isSaving ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <Save className="ms-2 h-4 w-4" />} {t('settings.save_btn')}
        </Button>
      </div>

      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="content">{t('settings.tab.content')}</TabsTrigger>
          <TabsTrigger value="contact">{t('settings.tab.contact')}</TabsTrigger>
          <TabsTrigger value="social">{t('settings.tab.social')}</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-8 mt-6">
          {/* Logo Section */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-blue-600" /> {t('settings.section.basic')}</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2"><Label>{t('settings.label.site_name')}</Label><Input value={formData.siteName} onChange={e => setFormData({ ...formData, siteName: e.target.value })} /></div>
                <div className="space-y-2"><Label>{t('settings.label.bio')}</Label><Textarea rows={3} value={formData.navbarBio} onChange={e => setFormData({ ...formData, navbarBio: e.target.value })} /></div>
              </div>
              <ImageUploadBox label={t('settings.label.logo')} imageUrl={formData.logoImageUrl} onUpload={(e: any) => handleFileChange(e, 'logoImage', 'logoImageUrl')} onRemove={() => handleRemoveFile('logoImage', 'logoImageUrl')} isCompressing={compressingImg === 'logoImage'} heightClass="h-[180px]" texts={uploadTexts} />
            </CardContent>
          </Card>

          {/* Hero Section */}
          <Card className="border-2 border-primary/20 shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10"><CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary" /> {t('settings.section.hero')}</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2"><Label>{t('settings.label.hero_title')}</Label><Input className="font-bold text-lg" value={formData.heroTitle} onChange={e => setFormData({ ...formData, heroTitle: e.target.value })} /></div>
                  <div className="space-y-2"><Label>{t('settings.label.hero_subtitle')}</Label><Textarea rows={4} value={formData.heroSubtitle} onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })} /></div>
                </div>
                <ImageUploadBox label={t('settings.label.hero_img')} imageUrl={formData.heroImageUrl} onUpload={(e: any) => handleFileChange(e, 'heroImage', 'heroImageUrl')} onRemove={() => handleRemoveFile('heroImage', 'heroImageUrl')} isCompressing={compressingImg === 'heroImage'} heightClass="min-h-[250px]" texts={uploadTexts} />
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-slate-600" /> {t('settings.section.about')}</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2"><Label>{t('settings.label.about_title')}</Label><Input value={formData.homeSectionTitle} onChange={e => setFormData({ ...formData, homeSectionTitle: e.target.value })} /></div>
                  <div className="space-y-2"><Label>{t('settings.label.about_content')}</Label><Textarea rows={6} value={formData.homeSectionContent} onChange={e => setFormData({ ...formData, homeSectionContent: e.target.value })} /></div>
                </div>
                <ImageUploadBox label={t('settings.label.about_img')} imageUrl={formData.aboutImageUrl} onUpload={(e: any) => handleFileChange(e, 'aboutImage', 'aboutImageUrl')} onRemove={() => handleRemoveFile('aboutImage', 'aboutImageUrl')} isCompressing={compressingImg === 'aboutImage'} texts={uploadTexts} />
              </div>
            </CardContent>
          </Card>

          {/* Identity Cards */}
          <Card className="bg-slate-50/80 border-dashed border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-600" /> {t('settings.section.cards')}</CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddCard} className="gap-2 bg-white text-primary border-primary/20"><Plus className="h-4 w-4" /> {t('settings.cards.add')}</Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {formData.identityCards.map((card) => (
                  <div key={card.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4 relative group hover:shadow-md transition-all">
                    {/* تعديل مكان زر الحذف ليتناسب مع الاتجاه */}
                    <Button variant="destructive" size="icon" className={`absolute top-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm ${language === 'ar' ? 'left-3' : 'right-3'}`} onClick={() => handleRemoveCard(card.id)}><Trash2 className="h-3 w-3" /></Button>
                    <div className="flex flex-col items-center gap-3">
                      <DropdownMenu dir={dir}>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-14 w-14 rounded-full p-0 border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 transition-all"><div className="text-slate-600">{getIconComponent(card.iconName)}</div></Button></DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 grid grid-cols-4 gap-2 p-3 max-h-[300px] overflow-y-auto" align="center">
                          {Object.keys(ICON_MAP).map((iconKey) => { const IconComp = ICON_MAP[iconKey]; return (<DropdownMenuItem key={iconKey} onClick={() => handleCardChange(card.id, 'iconName', iconKey)} className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer h-16 hover:bg-slate-100 transition-colors ${card.iconName === iconKey ? 'bg-primary/10 text-primary border border-primary/20' : ''}`}><IconComp className="h-6 w-6 mb-1" /><span className="text-[10px] text-muted-foreground">{iconKey}</span></DropdownMenuItem>) })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Input className="text-center font-bold text-lg border-transparent hover:border-input focus:border-input h-9 px-1 transition-all" placeholder={t('settings.cards.title_ph')} value={card.title} onChange={(e) => handleCardChange(card.id, 'title', e.target.value)} />
                    </div>
                    <Textarea className="text-center min-h-[110px] resize-none border-0 shadow-none focus-visible:ring-1 bg-slate-50/50 rounded-lg text-sm" value={card.content} onChange={(e) => handleCardChange(card.id, 'content', e.target.value)} placeholder={t('settings.cards.content_ph')} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Story */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-green-600" /> {t('settings.section.story')}</CardTitle></CardHeader>
            <CardContent><Textarea className="min-h-[150px]" value={formData.ourStory} onChange={e => setFormData({ ...formData, ourStory: e.target.value })} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6 mt-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5 text-orange-600" /> {t('settings.section.contact')}</CardTitle></CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* حقول الايميل والهاتف دائما LTR لسهولة القراءة، لكن النص محاذى لليسار */}
                <div className="space-y-2"><Label>{t('settings.label.email')}</Label><Input dir="ltr" className="text-start" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>{t('settings.label.phone')}</Label><Input dir="ltr" className="text-start" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>{t('settings.label.address')}</Label><Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} /></div>
              <div className="space-y-2"><Label>{t('settings.label.work_hours')}</Label><Input value={formData.workHours} onChange={e => setFormData({ ...formData, workHours: e.target.value })} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6 mt-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Facebook className="h-5 w-5 text-blue-600" /> {t('settings.section.social')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[{ icon: Facebook, color: "text-blue-600", key: "facebook" }, { icon: Linkedin, color: "text-blue-700", key: "linkedin" }, { icon: Youtube, color: "text-red-600", key: "youtube" }, { icon: Instagram, color: "text-pink-600", key: "instagram" }, { icon: Twitter, color: "text-sky-500", key: "twitter" }].map((s, i) => (
                <div key={i} className="relative group">
                  {/* تغيير مكان الأيقونة بناءً على الاتجاه */}
                  <div className={`absolute top-2.5 ${s.color} ${language === 'ar' ? 'right-3' : 'left-3'}`}>
                      <s.icon className="h-5 w-5" />
                  </div>
                  {/* تعديل الـ padding بناءً على الاتجاه لتجنب التداخل مع الأيقونة */}
                  <Input 
                    className={`${language === 'ar' ? 'pr-10' : 'pl-10'}`} 
                    dir="ltr" 
                    value={formData[s.key as keyof typeof formData] as string} 
                    onChange={e => setFormData({ ...formData, [s.key]: e.target.value })} 
                    placeholder={`${s.key.charAt(0).toUpperCase() + s.key.slice(1)} URL`} 
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneralSettings;