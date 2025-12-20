import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Plus, Pencil, Trash2, Loader2, 
  Upload, X, Image as ImageIcon, Settings, Info, 
  Layers
} from "lucide-react";
import { toast } from "sonner";

// بيانات تجريبية عشان نجرب التعديل
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "سيارة السباق QR-1",
    description: "مشروع تصميم وتصنيع سيارة سباق متطورة.",
    fullDescription: "وصف تفصيلي للمشروع...",
    // هنا نضع رابط صورة حقيقي أو placeholder للتجربة
    image: "https://placehold.co/600x400/png?text=Main+Image", 
    year: 2024,
    category: "سيارات السباق",
    status: 'running',
    specs: ["محرك توربو 2.0", "350 حصان"],
    gallery: [
      "https://placehold.co/400x400/png?text=Gallery+1",
      "https://placehold.co/400x400/png?text=Gallery+2"
    ]
  }
];

interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  // الصورة يمكن أن تكون ملف جديد (File) أو رابط قديم (string) أو لا شيء
  image: File | string | null; 
  year: number;
  category: string;
  status: 'completed' | 'running';
  specs: string[];
  // المعرض مصفوفة خليط من ملفات جديدة وروابط قديمة
  gallery: (File | string)[]; 
}

const ManageProjects = () => {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState<Project>({
    id: "", title: "", description: "", fullDescription: "",
    image: null, year: new Date().getFullYear(), category: "", status: "running", specs: [], gallery: []
  });

  // حالات المعاينة: نخزن فيها الروابط (سواء كانت URLs حقيقية أو Blob URLs مؤقتة)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [currentSpec, setCurrentSpec] = useState("");

  // --- الوظائف الأساسية ---

  // 1. فتح نافذة التعديل وتجهيز الصور القديمة
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    
    // هام جداً: إذا كانت الصورة القديمة عبارة عن رابط نصي، نضعه في المعاينة
    if (typeof project.image === 'string') {
      setMainImagePreview(project.image);
    } else {
      setMainImagePreview(null);
    }

    // هام جداً: تصفية معرض الصور لأخذ الروابط النصية فقط وعرضها في المعاينة
    const existingGalleryUrls = project.gallery.filter(img => typeof img === 'string') as string[];
    setGalleryPreviews(existingGalleryUrls);
    
    setIsDialogOpen(true);
  };

  // فتح نافذة إضافة جديد
  const handleOpenAdd = () => {
    setEditingProject(null);
    // تصفير النموذج والمعاينات
    setFormData({
      id: Math.random().toString(36).substr(2, 9),
      title: "", description: "", fullDescription: "",
      image: null, year: new Date().getFullYear(), category: "", status: "running", specs: [], gallery: []
    });
    setMainImagePreview(null);
    setGalleryPreviews([]);
    setIsDialogOpen(true);
  };

  // --- وظائف التعامل مع الصور (إضافة وحذف) ---

  // رفع صورة رئيسية جديدة
  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // تحديث البيانات بالملف الجديد
      setFormData(prev => ({ ...prev, image: file }));
      // إنشاء رابط مؤقت للمعاينة
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // حذف الصورة الرئيسية (سواء كانت قديمة أو جديدة)
  const removeMainImage = () => {
    setMainImagePreview(null);
    // هام: نحذفها من البيانات الأساسية أيضاً
    setFormData(prev => ({ ...prev, image: null }));
  };

  // رفع صور معرض جديدة
  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      // نضيف الملفات الجديدة للمصفوفة الموجودة
      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...filesArray] }));
      
      // ننشئ روابط معاينة للملفات الجديدة ونضيفها للمعاينات
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // حذف صورة من المعرض
  const removeGalleryImage = (indexToRemove: number) => {
    // حذف من المعاينة
    setGalleryPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    
    // هام: حذف من البيانات الأساسية بناءً على الـ index
    // هذا يحذف الصورة سواء كانت رابط قديم أو ملف جديد تم رفعه للتو
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  // --- وظائف الحفظ والحذف ---
  
  const handleSave = async () => {
    if (!formData.title) return toast.error("يرجى إدخال عنوان المشروع");
    setIsSubmitting(true);
    
    // هنا سنقوم لاحقاً باستخدام FormData لإرسال الملفات
    console.log("البيانات الجاهزة للإرسال (بما في ذلك الملفات):", formData);

    setTimeout(() => {
      if (editingProject) {
        setProjects(prev => prev.map(p => p.id === editingProject.id ? formData : p));
        toast.success("تم تحديث المشروع بنجاح");
      } else {
        setProjects(prev => [...prev, formData]);
        toast.success("تم إضافة المشروع بنجاح");
      }
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }, 800);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success("تم الحذف");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-10" dir="rtl">
       <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2">
            <ArrowRight className="h-4 w-4" /> العودة
          </Button>
          <h1 className="text-xl font-bold">إدارة المشاريع</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="border-none shadow-sm ring-1 ring-gray-200">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-2xl">المشاريع الحالية</CardTitle>
            <Button onClick={handleOpenAdd} className="shadow-md"><Plus className="ml-2 h-4 w-4" /> مشروع جديد</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="text-right">المشروع</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-center">الحالة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-bold flex items-center gap-2">
                        {typeof project.image === 'string' && <img src={project.image} className="w-8 h-8 rounded-md object-cover border" />}
                        {project.title}
                      </TableCell>
                      <TableCell><Badge variant="outline">{project.category}</Badge></TableCell>
                      <TableCell className="text-center">
                        <Badge className={project.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}>
                          {project.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(project)} className="h-8 w-8 text-blue-600"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="h-8 w-8 text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl">
          <DialogHeader className="p-6 bg-gray-50 border-b">
            <DialogTitle className="text-2xl flex items-center gap-2">
              {editingProject ? "تعديل بيانات المشروع" : "إنشاء مشروع جديد"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-6">
               <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2"><Info className="h-4 w-4" /> المعلومات الأساسية</div>
                <div className="grid gap-2">
                  <Label>اسم المشروع *</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>الفئة</Label>
                    <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>الحالة</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v as 'running' | 'completed'})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="running">قيد التنفيذ (Running)</SelectItem>
                        <SelectItem value="completed">مكتمل (Completed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>وصف مختصر</Label>
                  <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2"><Settings className="h-4 w-4" /> المواصفات التقنية</div>
                <div className="flex gap-2">
                  <Input placeholder="إضافة مواصفة جديدة..." value={currentSpec} onChange={e => setCurrentSpec(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), setCurrentSpec(""), setFormData(prev => ({...prev, specs: [...prev.specs, currentSpec]})))} />
                  <Button type="button" onClick={() => { setFormData(prev => ({...prev, specs: [...prev.specs, currentSpec]})); setCurrentSpec(""); }}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specs.map((spec, i) => (
                    <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 py-1 px-3 flex gap-2 items-center">
                      {spec} <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setFormData(prev => ({...prev, specs: prev.specs.filter((_, idx) => idx !== i)}))} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-6 bg-gray-50/50 p-5 rounded-xl border border-dashed">
              
              <div className="space-y-4">
                <Label className="flex items-center gap-2 font-bold"><ImageIcon className="h-5 w-5 text-primary" /> الصورة الرئيسية</Label>
                
                <div className="relative aspect-video rounded-xl border-2 border-gray-300 bg-white overflow-hidden group hover:border-primary transition-colors">
                  {mainImagePreview ? (
                    <>
                      <img src={mainImagePreview} className="w-full h-full object-cover" alt="Main preview" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="sm" onClick={removeMainImage} className="gap-2">
                          <Trash2 className="h-4 w-4" /> حذف الصورة
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                      <Upload className="h-10 w-10 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">اضغط هنا لرفع صورة</span>
                      <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                      <Input type="file" className="hidden" accept="image/*" onChange={handleMainImageChange} />
                    </Label>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 font-bold"><Layers className="h-5 w-5 text-primary" /> معرض الصور</Label>
                  <Label className="text-xs bg-white border px-2 py-1 rounded-md cursor-pointer hover:bg-gray-50 flex items-center gap-1">
                    <Plus className="h-3 w-3" /> إضافة صور
                    <Input type="file" className="hidden" multiple accept="image/*" onChange={handleGalleryChange} />
                  </Label>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* عرض الصور الموجودة في المعاينة */}
                  {galleryPreviews.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                      <img src={url} className="w-full h-full object-cover" alt={`gallery-${index}`} />

                      <button 
                        onClick={() => removeGalleryImage(index)}
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  <Label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-white cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                    <Plus className="h-6 w-6 text-gray-400" />
                    <Input type="file" className="hidden" multiple accept="image/*" onChange={handleGalleryChange} />
                  </Label>
                </div>
              </div>

            </div>
          </div>

          <DialogFooter className="p-6 bg-white border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={isSubmitting} className="min-w-[150px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : editingProject ? "حفظ التغييرات" : "إضافة المشروع"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProjects;