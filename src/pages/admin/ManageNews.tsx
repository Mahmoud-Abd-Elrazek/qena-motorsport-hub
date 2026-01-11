import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  ArrowRight, ArrowLeft, Plus, Trash2, Pencil, Image as ImageIcon, 
  Facebook, Linkedin, Twitter, Globe, Save, Eye, X, Trophy, Zap, Newspaper 
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

// --- 1. Data Definitions ---

type CategoryType = 'news' | 'event' | 'achievement';

interface NewsSource {
  platform: 'facebook' | 'x' | 'linkedin' | 'website';
  url: string;
}

interface NewsImage {
  id: string;
  file?: File;
  url: string;
  caption: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  category: CategoryType; // <-- New Field
  date: string;
  images: NewsImage[];
  sources: NewsSource[];
  status: 'published' | 'draft';
}

const INITIAL_DATA: Article[] = [
  {
    id: "1",
    title: "فريق قنا للسباقات يحصد المركز الأول",
    content: "بعد منافسة شرسة، استطاع الفريق تحقيق الفوز...",
    category: 'achievement',
    date: "2025-01-08",
    status: 'published',
    images: [{ id: "1", url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c", caption: "لحظة التتويج" }],
    sources: [{ platform: 'facebook', url: '#' }]
  },
  {
    id: "2",
    title: "انطلاق معسكر التدريب الصيفي",
    content: "يعلن الفريق عن بدء فعاليات المعسكر...",
    category: 'event',
    date: "2025-01-05",
    status: 'published',
    images: [],
    sources: []
  },
  {
    id: "3",
    title: "تحديثات جديدة في الورشة",
    content: "تمت إضافة معدات جديدة...",
    category: 'news',
    date: "2024-12-20",
    status: 'draft',
    images: [],
    sources: []
  }
];

// --- 2. Main Component ---

const AdminNewsManager = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // --- States ---
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [articles, setArticles] = useState<Article[]>(INITIAL_DATA);
  
  // Editor State
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourcePlatform, setNewSourcePlatform] = useState<'facebook' | 'x' | 'linkedin' | 'website'>("facebook");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // --- Actions ---

  const handleAddNew = () => {
    setCurrentArticle({
      id: "",
      title: "",
      content: "",
      category: 'news', // Default
      date: new Date().toISOString().split('T')[0],
      images: [],
      sources: [],
      status: 'draft'
    });
    setViewMode('editor');
  };

  const handleEdit = (article: Article) => {
    setCurrentArticle({ ...article });
    setViewMode('editor');
  };

  const handleSave = () => {
    if (!currentArticle?.title) return toast.error("العنوان مطلوب");

    if (currentArticle.id) {
      setArticles(prev => prev.map(a => a.id === currentArticle.id ? currentArticle : a));
      toast.success("تم التحديث بنجاح");
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      setArticles(prev => [{ ...currentArticle, id: newId, status: 'published' }, ...prev]);
      toast.success("تم النشر بنجاح");
    }
    setViewMode('list');
  };

  const confirmDelete = () => {
    if (deleteId) {
      setArticles(prev => prev.filter(a => a.id !== deleteId));
      setDeleteId(null);
      toast.success("تم الحذف");
    }
  };

  // --- Helpers ---
  
  // Image Handlers (Simulated)
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!currentArticle || files.length === 0) return;
    const newImages: NewsImage[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      caption: ""
    }));
    setCurrentArticle({ ...currentArticle, images: [...currentArticle.images, ...newImages] });
  };

  const updateImageCaption = (id: string, val: string) => {
    if (!currentArticle) return;
    setCurrentArticle({ ...currentArticle, images: currentArticle.images.map(img => img.id === id ? { ...img, caption: val } : img) });
  };

  const removeImage = (id: string) => {
    if (!currentArticle) return;
    setCurrentArticle({ ...currentArticle, images: currentArticle.images.filter(img => img.id !== id) });
  };

  // Source Handlers
  const addSource = () => {
    if (!currentArticle || !newSourceUrl) return;
    setCurrentArticle({ ...currentArticle, sources: [...currentArticle.sources, { platform: newSourcePlatform, url: newSourceUrl }] });
    setNewSourceUrl("");
  };

  const removeSource = (idx: number) => {
    if (!currentArticle) return;
    setCurrentArticle({ ...currentArticle, sources: currentArticle.sources.filter((_, i) => i !== idx) });
  };

  // UI Helpers
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'linkedin': return <Linkedin className="h-4 w-4 text-blue-700" />;
      case 'x': return <Twitter className="h-4 w-4 text-black" />;
      default: return <Globe className="h-4 w-4 text-slate-500" />;
    }
  };

  const getCategoryBadge = (cat: CategoryType) => {
    switch (cat) {
      case 'achievement':
        return <Badge className="bg-amber-500 hover:bg-amber-600 gap-1"><Trophy className="h-3 w-3" /> إنجاز</Badge>;
      case 'event':
        return <Badge className="bg-blue-600 hover:bg-blue-700 gap-1"><Zap className="h-3 w-3" /> فاعلية</Badge>;
      default:
        return <Badge className="bg-slate-600 hover:bg-slate-700 gap-1"><Newspaper className="h-3 w-3" /> خبر</Badge>;
    }
  };

  const getCategoryLabel = (cat: CategoryType) => {
    switch (cat) {
      case 'achievement': return "إنجاز جديد";
      case 'event': return "حدث وفاعلية";
      default: return "أخبار الفريق";
    }
  };

  // --- Views ---

  const renderListView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">إدارة المحتوى</CardTitle>
            <p className="text-slate-500 text-sm mt-1">الأخبار، الفعاليات، والإنجازات</p>
          </div>
          <Button onClick={handleAddNew} className="bg-primary gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> إضافة جديد
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-start w-[35%]">العنوان</TableHead>
                <TableHead className="text-center">التصنيف</TableHead>
                <TableHead className="text-start">التاريخ</TableHead>
                <TableHead className="text-center">الحالة</TableHead>
                <TableHead className="text-start px-6">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-slate-100 overflow-hidden shrink-0 border">
                        {article.images[0] ? (
                          <img src={article.images[0].url} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-300"><ImageIcon className="h-5 w-5"/></div>
                        )}
                      </div>
                      <span className="truncate max-w-[250px]">{article.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">{getCategoryBadge(article.category)}</div>
                  </TableCell>
                  <TableCell>{article.date}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={article.status === 'published' ? 'outline' : 'secondary'} className={article.status === 'published' ? 'border-green-200 text-green-700 bg-green-50' : ''}>
                      {article.status === 'published' ? 'منشور' : 'مسودة'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-start gap-2 px-6">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(article)} className="text-blue-600 hover:bg-blue-50">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(article.id)} className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {articles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">لا توجد بيانات مضافة حالياً</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderEditorView = () => {
    if (!currentArticle) return null;
    return (
      <div className="animate-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- Form Section --- */}
        <div className="space-y-6">
           <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 {currentArticle.id ? <Pencil className="h-5 w-5 text-blue-600"/> : <Plus className="h-5 w-5 text-green-600"/>}
                 {currentArticle.id ? "تعديل المنشور" : "إضافة منشور جديد"}
              </h2>
              <Button variant="ghost" onClick={() => setViewMode('list')} className="text-slate-500 hover:text-slate-900">إلغاء</Button>
           </div>

          <Card className="border-none shadow-md">
            <CardContent className="space-y-5 pt-6">
              
              {/* Title & Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="md:col-span-2 space-y-2">
                    <Label className="font-bold">عنوان المنشور</Label>
                    <Input value={currentArticle.title} onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})} placeholder="اكتب عنواناً جذاباً..." />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold">التصنيف</Label>
                    <Select value={currentArticle.category} onValueChange={(v: CategoryType) => setCurrentArticle({...currentArticle, category: v})}>
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="news"><div className="flex items-center gap-2"><Newspaper className="h-4 w-4"/> خبر</div></SelectItem>
                          <SelectItem value="event"><div className="flex items-center gap-2"><Zap className="h-4 w-4"/> فاعلية</div></SelectItem>
                          <SelectItem value="achievement"><div className="flex items-center gap-2"><Trophy className="h-4 w-4"/> إنجاز</div></SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">المحتوى والتفاصيل</Label>
                <Textarea rows={6} value={currentArticle.content} onChange={e => setCurrentArticle({...currentArticle, content: e.target.value})} placeholder="اكتب تفاصيل الخبر، الحدث أو الإنجاز هنا..." className="leading-relaxed" />
              </div>

              <div className="space-y-2">
                <Label className="font-bold">تاريخ النشر</Label>
                <Input type="date" value={currentArticle.date} onChange={e => setCurrentArticle({...currentArticle, date: e.target.value})} className="w-full md:w-1/2" />
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card className="border-none shadow-md">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><ImageIcon className="h-4 w-4"/> معرض الصور</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {currentArticle.images.map((img) => (
                  <div key={img.id} className="flex gap-3 items-start bg-slate-50 p-2 rounded border group">
                    <img src={img.url} className="w-16 h-16 object-cover rounded bg-slate-200 shrink-0 border" />
                    <Input 
                      value={img.caption} 
                      onChange={(e) => updateImageCaption(img.id, e.target.value)} 
                      placeholder="وصف الصورة (يظهر أسفلها)..." 
                      className="h-9 text-sm mt-1 bg-white"
                    />
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 shrink-0 mt-1" onClick={() => removeImage(img.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <label className="flex items-center justify-center w-full h-14 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 border-slate-300 text-slate-500 gap-2 transition-colors">
                <Plus className="w-5 h-5 bg-slate-200 rounded-full p-0.5" />
                <span className="text-sm font-medium">إضافة صور (يمكن اختيار أكثر من صورة)</span>
                <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </CardContent>
          </Card>

          {/* Sources Section */}
          <Card className="border-none shadow-md">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4"/> الروابط والمصادر</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={newSourcePlatform} onValueChange={(v: any) => setNewSourcePlatform(v)}>
                  <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="x">X (Twitter)</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>
                <Input value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)} placeholder="https://..." className="flex-1" />
                <Button onClick={addSource} variant="secondary" size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentArticle.sources.map((src, idx) => (
                  <Badge key={idx} variant="secondary" className="pl-1 gap-2 bg-slate-100 hover:bg-slate-200 h-8 border text-slate-700">
                    {getPlatformIcon(src.platform)}
                    <span className="max-w-[200px] truncate font-normal">{src.url}</span>
                    <div className="border-l pl-1 ml-1 h-4 flex items-center">
                       <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeSource(idx)} />
                    </div>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 gap-2 h-12 text-lg shadow-lg shadow-primary/20">
             <Save className="h-5 w-5" /> حفظ ونشر المحتوى
          </Button>
        </div>

        {/* --- Live Preview Section --- */}
        <div className="hidden lg:block lg:sticky lg:top-24 h-fit">
          <div className="flex items-center justify-between mb-4 px-1">
             <div className="flex items-center gap-2 text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-bold">معاينة حية (Live Preview)</span>
             </div>
             <span className="text-xs text-slate-400">هذا ما سيراه المستخدم</span>
          </div>
          
          {/* Preview Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden min-h-[600px] relative">
            {/* Category Badge Floating */}
            <div className="absolute top-4 right-4 z-10 shadow-lg">
               {getCategoryBadge(currentArticle.category)}
            </div>

            {/* Cover Image */}
            <div className="w-full h-72 bg-slate-100 overflow-hidden relative group">
              {currentArticle.images.length > 0 ? (
                <img src={currentArticle.images[0].url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                  <ImageIcon className="h-12 w-12 opacity-50" />
                  <span className="text-sm">صورة الغلاف</span>
                </div>
              )}
              {currentArticle.images.length > 0 && currentArticle.images[0].caption && (
                 <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 text-white text-sm font-medium">
                   {currentArticle.images[0].caption}
                 </div>
              )}
            </div>

            <div className="p-8">
              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-5 font-medium uppercase tracking-wide">
                <span>{currentArticle.date || "YYYY-MM-DD"}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-primary">{getCategoryLabel(currentArticle.category)}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-extrabold text-slate-900 mb-6 leading-tight">
                {currentArticle.title || "عنوان المنشور يظهر هنا..."}
              </h1>

              {/* Content */}
              <div className="prose prose-slate max-w-none text-slate-600 leading-8 whitespace-pre-wrap">
                {currentArticle.content || "محتوى وتفاصيل المنشور ستظهر هنا بشكل منسق وجميل..."}
              </div>

              {/* Gallery Preview */}
              {currentArticle.images.length > 1 && (
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                    <ImageIcon className="h-4 w-4 text-primary"/> صور إضافية
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {currentArticle.images.slice(1).map((img, i) => (
                       <div key={i} className="rounded-xl overflow-hidden border bg-slate-50 relative group h-32">
                          <img src={img.url} className="w-full h-full object-cover" />
                          {img.caption && <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] p-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">{img.caption}</div>}
                       </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources Preview */}
              {currentArticle.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex gap-2 flex-wrap">
                    {currentArticle.sources.map((src, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                        {getPlatformIcon(src.platform)}
                        <span>عرض على {src.platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12" dir={dir}>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md mb-8">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Button variant="ghost" onClick={() => viewMode === 'editor' ? setViewMode('list') : navigate("/admin")} className="gap-2 font-medium">
            {language === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {viewMode === 'editor' ? "العودة للقائمة" : "لوحة التحكم الرئيسية"}
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-900">إدارة المركز الإعلامي</h1>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-7xl">
        {viewMode === 'list' ? renderListView() : renderEditorView()}
      </main>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2"><Trash2 className="h-5 w-5"/> حذف المنشور</DialogTitle>
            <DialogDescription className="pt-2">
              هل أنت متأكد من رغبتك في حذف هذا المنشور نهائياً؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button variant="destructive" onClick={confirmDelete}>نعم، حذف</Button>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>تراجع</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNewsManager;