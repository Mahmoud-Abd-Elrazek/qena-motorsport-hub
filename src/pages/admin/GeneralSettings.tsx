import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"; 
import { 
  Save, Loader2, Globe, LayoutTemplate, BookOpen, 
  Phone, Mail, MapPin, Clock, 
  Facebook, Linkedin, Youtube, Instagram, Twitter,
  Upload, X, Plus, Trash2, ImageIcon,
  // أيقونات الأقسام
  Eye, Target, Heart, Star, Shield, Zap, Lightbulb, Users, Trophy, Flag, CheckCircle, Flame
} from "lucide-react";
import { toast } from "sonner";
// استيراد مكتبة الضغط
import imageCompression from 'browser-image-compression';

// --- 1. خريطة الأيقونات ---
const ICON_MAP: Record<string, any> = {
  "Eye": Eye, "Target": Target, "Heart": Heart, "Star": Star, "Shield": Shield,
  "Zap": Zap, "Lightbulb": Lightbulb, "Users": Users, "Trophy": Trophy,
  "Flag": Flag, "Flame": Flame, "Check": CheckCircle
};

// --- 2. Interfaces ---
interface IdentityCard {
  id: number;
  title: string;
  content: string;
  iconName: string;
}

// --- 3. مكون داخلي لرفع الصور (Reusable) ---
const ImageUploadBox = ({ 
    imageUrl, 
    onUpload, 
    onRemove, 
    label, 
    heightClass = "min-h-[220px]",
    isCompressing = false
}: {
    imageUrl: string;
    onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    label: string;
    heightClass?: string;
    isCompressing?: boolean;
}) => (
  <div className="space-y-2">
      <Label>{label}</Label>
      <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center ${heightClass} bg-slate-50 relative group transition-colors hover:bg-slate-100`}>
          {isCompressing ? (
             // حالة الضغط
             <div className="flex flex-col items-center gap-2 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-xs">جاري ضغط الصورة...</span>
             </div>
          ) : imageUrl ? (
              <>
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-md shadow-sm" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg z-10">
                      <Button variant="destructive" size="sm" onClick={onRemove}>
                          <X className="h-4 w-4 mr-1" /> حذف الصورة
                      </Button>
                  </div>
              </>
          ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center z-0">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                      <Upload className="h-6 w-6 text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-500 font-medium">اضغط لرفع صورة</span>
                  <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
              </label>
          )}
      </div>
  </div>
);

// ================== المكون الرئيسي ==================
const GeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  
  // حالة خاصة لمعرفة هل يتم ضغط صورة حالياً أم لا
  const [compressingImg, setCompressingImg] = useState<string | null>(null);

  // --- 4. State ---
  const [formData, setFormData] = useState({
    siteName: "", navbarBio: "",
    
    // Logo
    logoImage: null as File | null,
    logoImageUrl: "",
    
    // Hero
    heroTitle: "", heroSubtitle: "",
    heroImage: null as File | null,
    heroImageUrl: "",

    // About
    homeSectionTitle: "", homeSectionContent: "",
    aboutImage: null as File | null,
    aboutImageUrl: "",

    identityCards: [] as IdentityCard[],
    ourStory: "",
    
    phone: "", email: "", address: "", workHours: "",
    facebook: "", linkedin: "", youtube: "", instagram: "", twitter: "",
  });

  // --- 5. Fetch Data ---
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      siteName: "Qena Racing Team",
      navbarBio: "فريق هندسي لصناعة مستقبل السيارات الكهربائية.",
      logoImageUrl: "https://via.placeholder.com/150x50/eee/999?text=TEAM+LOGO",
      heroTitle: "نصنع المستقبل، سباقاً تلو الآخر",
      heroSubtitle: "فريق جامعي يهدف للريادة في تكنولوجيا المركبات الكهربائية.",
      heroImageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop",
      homeSectionTitle: "من نحن؟",
      homeSectionContent: "نحن فريق طلابي من جامعة جنوب الوادي...",
      aboutImageUrl: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=1000&auto=format&fit=crop",
      ourStory: "بدأت قصتنا في عام 2023...",
      identityCards: [
        { id: 1, title: "رؤيتنا", content: "الريادة الإقليمية...", iconName: "Eye" },
        { id: 2, title: "رسالتنا", content: "تطوير حلول مبتكرة...", iconName: "Target" },
      ],
      phone: "+201150000000", email: "contact@qenaracing.com", address: "قنا، مصر", workHours: "9 ص - 4 م",
      facebook: "https://facebook.com", youtube: "https://youtube.com",
    }));
  }, []);

  // --- 6. التعامل مع الملفات وضغط الصور ---
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, fileKey: string, urlKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // إعدادات الضغط
    const options = {
      maxSizeMB: 0.8,          // أقصى حجم 0.8 ميجا
      maxWidthOrHeight: 1920,  // أقصى أبعاد 1920 بكسل
      useWebWorker: true,      // استخدام WebWorker لعدم تجميد المتصفح
    };

    try {
      // تفعيل حالة التحميل الخاصة بالصورة
      setCompressingImg(fileKey);
      
      // بدء الضغط
      const compressedFile = await imageCompression(file, options);
      
      // التحديث في الـ State بالملف المضغوط
      setFormData(prev => ({
        ...prev,
        [fileKey]: compressedFile,
        [urlKey]: URL.createObjectURL(compressedFile)
      }));
      
      toast.success("تم ضغط الصورة ورفعها بنجاح");

    } catch (error) {
      console.error("Image compression error:", error);
      toast.error("حدث خطأ أثناء معالجة الصورة");
    } finally {
      setCompressingImg(null);
    }
  };

  const handleRemoveFile = (fileKey: string, urlKey: string) => {
    setFormData(prev => ({ ...prev, [fileKey]: null, [urlKey]: "" }));
  };

  // --- 7. دوال الكروت الديناميكية ---
  const handleAddCard = () => {
    const newCard: IdentityCard = { id: Date.now(), title: "", content: "", iconName: "Star" };
    setFormData(prev => ({ ...prev, identityCards: [...prev.identityCards, newCard] }));
  };
  const handleRemoveCard = (id: number) => {
    setFormData(prev => ({ ...prev, identityCards: prev.identityCards.filter(card => card.id !== id) }));
  };
  const handleCardChange = (id: number, field: keyof IdentityCard, value: string) => {
    setFormData(prev => ({
        ...prev,
        identityCards: prev.identityCards.map(card => card.id === id ? { ...card, [field]: value } : card)
    }));
  };
  const getIconComponent = (iconName: string) => {
    const Icon = ICON_MAP[iconName] || Star;
    return <Icon className="h-5 w-5" />;
  };

  // --- 8. Save ---
  const handleSave = async () => {
    setLoading(true);
    console.log("FormData with Compressed Images:", formData);
    setTimeout(() => { setLoading(false); toast.success("تم التحديث بنجاح"); }, 1500);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 p-2 rounded-lg shadow-sm mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">إعدادات الموقع</h1>
            <p className="text-muted-foreground">التحكم في المحتوى والصور (مع ضغط تلقائي).</p>
        </div>
        <Button onClick={handleSave} disabled={loading} size="lg" className="shadow-md min-w-[140px]">
            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />} حفظ التغييرات
        </Button>
      </div>

      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="content">المحتوى والهوية</TabsTrigger>
          <TabsTrigger value="contact">التواصل</TabsTrigger>
          <TabsTrigger value="social">السوشيال ميديا</TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: CONTENT ================= */}
        <TabsContent value="content" className="space-y-8 mt-6">
          
          {/* 1. Basic Info & Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-blue-600"/> البيانات الأساسية والشعار</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2"><Label>اسم الموقع</Label><Input value={formData.siteName} onChange={e => setFormData({...formData, siteName: e.target.value})} /></div>
                <div className="space-y-2"><Label>الوصف المختصر</Label><Textarea rows={3} value={formData.navbarBio} onChange={e => setFormData({...formData, navbarBio: e.target.value})} /></div>
              </div>
              <ImageUploadBox 
                  label="شعار الموقع (Logo)"
                  imageUrl={formData.logoImageUrl}
                  onUpload={(e) => handleFileChange(e, 'logoImage', 'logoImageUrl')}
                  onRemove={() => handleRemoveFile('logoImage', 'logoImageUrl')}
                  isCompressing={compressingImg === 'logoImage'}
                  heightClass="h-[180px]"
              />
            </CardContent>
          </Card>

           {/* 2. Hero Section */}
           <Card className="border-2 border-primary/20 shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary"/> واجهة الهبوط (Hero Section)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <div className="space-y-2"><Label>العنوان الرئيسي</Label><Input className="font-bold text-lg" value={formData.heroTitle} onChange={e => setFormData({...formData, heroTitle: e.target.value})} /></div>
                    <div className="space-y-2"><Label>العنوان الفرعي</Label><Textarea rows={4} value={formData.heroSubtitle} onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} /></div>
                 </div>
                 <ImageUploadBox 
                    label="صورة الخلفية (Hero)"
                    imageUrl={formData.heroImageUrl}
                    onUpload={(e) => handleFileChange(e, 'heroImage', 'heroImageUrl')}
                    onRemove={() => handleRemoveFile('heroImage', 'heroImageUrl')}
                    isCompressing={compressingImg === 'heroImage'}
                    heightClass="min-h-[250px]"
                 />
              </div>
            </CardContent>
          </Card>

          {/* 3. About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-slate-600"/> قسم "من نحن"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2"><Label>العنوان</Label><Input value={formData.homeSectionTitle} onChange={e => setFormData({...formData, homeSectionTitle: e.target.value})} /></div>
                  <div className="space-y-2"><Label>المحتوى</Label><Textarea rows={6} value={formData.homeSectionContent} onChange={e => setFormData({...formData, homeSectionContent: e.target.value})} /></div>
                </div>
                <ImageUploadBox 
                    label="صورة القسم"
                    imageUrl={formData.aboutImageUrl}
                    onUpload={(e) => handleFileChange(e, 'aboutImage', 'aboutImageUrl')}
                    onRemove={() => handleRemoveFile('aboutImage', 'aboutImageUrl')}
                    isCompressing={compressingImg === 'aboutImage'}
                 />
              </div>
            </CardContent>
          </Card>

          {/* 4. Identity Cards */}
          <Card className="bg-slate-50/80 border-dashed border-2">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-600"/> بطاقات الهوية</CardTitle>
               <Button variant="outline" size="sm" onClick={handleAddCard} className="gap-2 bg-white text-primary border-primary/20"><Plus className="h-4 w-4" /> إضافة</Button>
             </CardHeader>
             <CardContent>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                 {formData.identityCards.map((card) => (
                     <div key={card.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4 relative group hover:shadow-md transition-all">
                        <Button variant="destructive" size="icon" className="absolute left-3 top-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm" onClick={() => handleRemoveCard(card.id)}><Trash2 className="h-3 w-3" /></Button>
                        <div className="flex flex-col items-center gap-3">
                            <DropdownMenu dir="rtl">
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-14 w-14 rounded-full p-0 border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 transition-all">
                                        <div className="text-slate-600">{getIconComponent(card.iconName)}</div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 grid grid-cols-4 gap-2 p-3 max-h-[300px] overflow-y-auto" align="center">
                                    {Object.keys(ICON_MAP).map((iconKey) => {
                                        const IconComp = ICON_MAP[iconKey];
                                        return (<DropdownMenuItem key={iconKey} onClick={() => handleCardChange(card.id, 'iconName', iconKey)} className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer h-16 hover:bg-slate-100 transition-colors ${card.iconName === iconKey ? 'bg-primary/10 text-primary border border-primary/20' : ''}`}><IconComp className="h-6 w-6 mb-1" /><span className="text-[10px] text-muted-foreground">{iconKey}</span></DropdownMenuItem>)
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Input className="text-center font-bold text-lg border-transparent hover:border-input focus:border-input h-9 px-1 transition-all" placeholder="العنوان" value={card.title} onChange={(e) => handleCardChange(card.id, 'title', e.target.value)} />
                        </div>
                        <Textarea className="text-center min-h-[110px] resize-none border-0 shadow-none focus-visible:ring-1 bg-slate-50/50 rounded-lg text-sm" value={card.content} onChange={(e) => handleCardChange(card.id, 'content', e.target.value)} placeholder="المحتوى..." />
                     </div>
                 ))}
                 {formData.identityCards.length === 0 && (
                    <div onClick={handleAddCard} className="col-span-full border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100 h-[250px]">
                        <Plus className="h-8 w-8 opacity-50 mb-2" /><span>اضغط لإضافة بطاقة</span>
                    </div>
                 )}
               </div>
             </CardContent>
          </Card>

          {/* 5. Story */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-green-600"/> القصة الكاملة</CardTitle></CardHeader>
            <CardContent><Textarea className="min-h-[150px]" value={formData.ourStory} onChange={e => setFormData({...formData, ourStory: e.target.value})} /></CardContent>
          </Card>
        </TabsContent>

        {/* Contact & Social */}
        <TabsContent value="contact" className="space-y-6 mt-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5 text-orange-600"/> معلومات الاتصال</CardTitle></CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input dir="ltr" className="text-right" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                <div className="space-y-2"><Label>رقم الهاتف</Label><Input dir="ltr" className="text-right" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>العنوان</Label><Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
              <div className="space-y-2"><Label>ساعات العمل</Label><Input value={formData.workHours} onChange={e => setFormData({...formData, workHours: e.target.value})} /></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="social" className="space-y-6 mt-6">
          <Card>
             <CardHeader><CardTitle className="flex items-center gap-2"><Facebook className="h-5 w-5 text-blue-600"/> السوشيال ميديا</CardTitle></CardHeader>
             <CardContent className="space-y-4">
                {[
                  { icon: Facebook, color: "text-blue-600", key: "facebook" },
                  { icon: Linkedin, color: "text-blue-700", key: "linkedin" },
                  { icon: Youtube, color: "text-red-600", key: "youtube" },
                  { icon: Instagram, color: "text-pink-600", key: "instagram" },
                  { icon: Twitter, color: "text-sky-500", key: "twitter" },
                ].map((s, i) => (
                    <div key={i} className="relative group">
                        <div className={`absolute right-3 top-2.5 ${s.color}`}><s.icon className="h-5 w-5"/></div>
                        <Input className="pr-10" dir="ltr" value={formData[s.key as keyof typeof formData] as string} onChange={e => setFormData({...formData, [s.key]: e.target.value})} placeholder={`${s.key} URL`} />
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