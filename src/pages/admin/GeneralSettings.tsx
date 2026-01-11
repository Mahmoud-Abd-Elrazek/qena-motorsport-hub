import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, Loader2, Globe, LayoutTemplate, BookOpen, 
  Phone, Mail, MapPin, Clock, 
  Facebook, Linkedin, Youtube, Instagram, Twitter,
  Upload, ImageIcon, X
} from "lucide-react";
import { toast } from "sonner";

const GeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  // --- State ---
  const [formData, setFormData] = useState({
    // 1. Navbar & Site Info
    siteName: "",
    navbarBio: "",
    
    // 2. Home Page Section
    homeSectionTitle: "",
    homeSectionContent: "",
    aboutImage: null as File | null, // لتخزين ملف الصورة
    aboutImageUrl: "", // لتخزين رابط الصورة (سواء من السيرفر أو Preview)

    // 3. Detailed Story
    ourStory: "",

    // 4. Contact Info
    phone: "",
    email: "",
    address: "",
    workHours: "",

    // 5. Social Media
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
    twitter: "",
  });

  // --- Fetch Fake Data ---
  useEffect(() => {
    // محاكاة جلب البيانات من الـ API
    setFormData(prev => ({
      ...prev,
      siteName: "Qena Racing Team",
      navbarBio: "فريق هندسي لصناعة مستقبل السيارات الكهربائية.",
      homeSectionTitle: "من نحن؟",
      homeSectionContent: "نحن فريق طلابي من جامعة جنوب الوادي، نهدف لتوطين صناعة السيارات الكهربائية وتصميم سيارات سباق تنافس عالمياً.",
      // صورة وهمية للتجربة
      aboutImageUrl: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=1000&auto=format&fit=crop",
      ourStory: "بدأت قصتنا في عام 2023...",
      phone: "+201150000000",
      email: "contact@qenaracing.com",
      address: "كلية الهندسة، جامعة جنوب الوادي، قنا",
      workHours: "السبت - الخميس: 9 ص - 4 م",
      facebook: "https://facebook.com/qenaracing",
      linkedin: "https://linkedin.com/company/qenaracing",
      youtube: "https://youtube.com/@qenaracing",
    }));
  }, []);

  // --- Handlers ---
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        aboutImage: file,
        aboutImageUrl: URL.createObjectURL(file) // عرض فوري للصورة
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, aboutImage: null, aboutImageUrl: "" }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    // هنا تقوم بإنشاء FormData وإرساله للباك إند
    /*
    const data = new FormData();
    data.append("SiteName", formData.siteName);
    if(formData.aboutImage) data.append("AboutImage", formData.aboutImage);
    // ... append rest
    */

    setTimeout(() => {
        setLoading(false);
        toast.success("تم تحديث إعدادات الموقع بنجاح");
    }, 1500);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6" dir="rtl">
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10 p-2 rounded-lg">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">إعدادات الموقع</h1>
            <p className="text-muted-foreground">التحكم في المحتوى، الصور، ومعلومات التواصل.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} size="lg" className="shadow-md">
            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
            حفظ التغييرات
        </Button>
      </div>

      {/* --- Tabs --- */}
      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="content">المحتوى والقصة</TabsTrigger>
          <TabsTrigger value="contact">التواصل</TabsTrigger>
          <TabsTrigger value="social">السوشيال ميديا</TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: CONTENT ================= */}
        <TabsContent value="content" className="space-y-6 mt-6">
          
          {/* 1. Navbar Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-blue-600"/> البيانات الأساسية</CardTitle>
              <CardDescription>اسم الموقع والوصف المختصر في القائمة العلوية.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم الموقع (Site Name)</Label>
                <Input value={formData.siteName} onChange={e => setFormData({...formData, siteName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>الـ Bio (يظهر في الـ Navbar)</Label>
                <Input value={formData.navbarBio} onChange={e => setFormData({...formData, navbarBio: e.target.value})} placeholder="شعار الفريق المختصر" />
              </div>
            </CardContent>
          </Card>

          {/* 2. Home Page Section + Image */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-primary"/> قسم الصفحة الرئيسية (About Section)</CardTitle>
              <CardDescription>هذا الجزء يظهر في واجهة الموقع الرئيسية.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Text Inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>عنوان القسم</Label>
                    <Input value={formData.homeSectionTitle} onChange={e => setFormData({...formData, homeSectionTitle: e.target.value})} placeholder="من نحن؟" />
                  </div>
                  <div className="space-y-2">
                    <Label>المحتوى (نبذة مختصرة)</Label>
                    <Textarea rows={5} value={formData.homeSectionContent} onChange={e => setFormData({...formData, homeSectionContent: e.target.value})} placeholder="نص تعريفي جذاب..." />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <Label>صورة القسم (تظهر بجانب النص)</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] bg-slate-50 relative group">
                        {formData.aboutImageUrl ? (
                            <>
                                <img src={formData.aboutImageUrl} alt="About Preview" className="w-full h-48 object-cover rounded-md" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                    <Button variant="destructive" size="sm" onClick={removeImage}>
                                        <X className="h-4 w-4 mr-1" /> حذف الصورة
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
                                <div className="p-3 bg-white rounded-full shadow-sm">
                                    <Upload className="h-6 w-6 text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-500">اضغط لرفع صورة تعريفية</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Detailed Story */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-green-600"/> القصة الكاملة (Detailed Story)</CardTitle>
              <CardDescription>المحتوى الذي يظهر في صفحة "عن الفريق" المنفصلة.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                className="min-h-[150px]" 
                value={formData.ourStory} 
                onChange={e => setFormData({...formData, ourStory: e.target.value})} 
                placeholder="اكتب هنا القصة الكاملة للفريق..." 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= TAB 2: CONTACT ================= */}
        <TabsContent value="contact" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5 text-orange-600"/> معلومات الاتصال</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400"/> البريد الإلكتروني</Label>
                    <Input dir="ltr" className="text-right" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400"/> رقم الهاتف</Label>
                    <Input dir="ltr" className="text-right" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                 <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400"/> العنوان</Label>
                 <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <Label className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400"/> ساعات العمل</Label>
                 <Input value={formData.workHours} onChange={e => setFormData({...formData, workHours: e.target.value})} placeholder="مثال: 9 ص - 5 م" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= TAB 3: SOCIAL ================= */}
        <TabsContent value="social" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Facebook className="h-5 w-5 text-blue-600"/> روابط التواصل الاجتماعي</CardTitle>
               <CardDescription>اترك الحقل فارغاً إذا لم يوجد حساب.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="absolute right-3 top-2.5 text-blue-600"><Facebook className="h-5 w-5"/></div>
                <Input className="pr-10" dir="ltr" placeholder="Facebook URL" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} />
              </div>
              <div className="relative">
                <div className="absolute right-3 top-2.5 text-blue-700"><Linkedin className="h-5 w-5"/></div>
                <Input className="pr-10" dir="ltr" placeholder="LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
              </div>
              <div className="relative">
                <div className="absolute right-3 top-2.5 text-red-600"><Youtube className="h-5 w-5"/></div>
                <Input className="pr-10" dir="ltr" placeholder="YouTube URL" value={formData.youtube} onChange={e => setFormData({...formData, youtube: e.target.value})} />
              </div>
              <div className="relative">
                <div className="absolute right-3 top-2.5 text-pink-600"><Instagram className="h-5 w-5"/></div>
                <Input className="pr-10" dir="ltr" placeholder="Instagram URL" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
              </div>
              <div className="relative">
                <div className="absolute right-3 top-2.5 text-sky-500"><Twitter className="h-5 w-5"/></div>
                <Input className="pr-10" dir="ltr" placeholder="Twitter (X) URL" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default GeneralSettings;