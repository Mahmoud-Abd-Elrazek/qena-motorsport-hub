import { useState, useEffect, ChangeEvent } from "react";
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
  Layers, ChevronLeft, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

// --- الواجهات (Interfaces) ---
interface Project {
  id: string;
  title: string;
  description: string;
  image: File | string | null; // يمكن أن تكون ملفاً جديداً أو رابطاً من السيرفر
  year: number;
  category: string;
  status: 'completed' | 'running';
  specs: string[];
  gallery: (File | string)[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const ManageProjects = () => {
  const navigate = useNavigate();

  // --- حالات الصفحة (States) ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // حالات التنظيم الصفحي
  const [pageNumber, setPageNumber] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // بيانات النموذج
  const [formData, setFormData] = useState<Project>({
    id: "", title: "", description: "",
    image: null, year: new Date().getFullYear(), category: "", status: "running", specs: [], gallery: []
  });

  // حالات المعاينة
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [currentSpec, setCurrentSpec] = useState("");

  // --- 1. جلب المشاريع (Read) ---
  const fetchProjects = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://qenaracingteam.runasp.net/Racing/Project/GetAllProjectsList?pageNumber=${page}&pageSize=10`
      );
      const result = await response.json();
      console.log(result.data)

      // ملاحظة: تأكد من مطابقة أسماء الحقول مع الـ API الخاص بك
      setProjects(result.data || []);
      setPagination({
        currentPage: result.currentPage || page,
        totalPages: result.totalPages || 1,
        hasNext: result.hasNext || false,
        hasPrevious: result.hasPrevious || false
      });
    } catch (error) {
      toast.error("فشل في تحميل البيانات من السيرفر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(pageNumber);
  }, [pageNumber]);

  // --- 2. الحذف (Delete) ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;

    try {
      const response = await fetch(`https://qenaracingteam.runasp.net/Racing/Project/DeleteProject?id=${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        toast.success("تم حذف المشروع بنجاح");
        fetchProjects(pageNumber);
      } else {
        toast.error("فشل الحذف، حاول مرة أخرى");
      }
    } catch (error) {
      toast.error("خطأ في الاتصال بالسيرفر");
    }
  };

  // --- 3. الحفظ (Add & Update) ---
  const handleSave = async () => {
    if (!formData.title) return toast.error("يرجى إدخال عنوان المشروع");
    setIsSubmitting(true);

    const data = new FormData();
    if (editingProject) data.append("Id", editingProject.id);
    data.append("Title", formData.title);
    data.append("Description", formData.description);
    data.append("Category", formData.category);
    data.append("Year", `${formData.year}-01-01`);
    data.append("Status", formData.status === 'completed' ? "1" : "0");

    formData.specs.forEach(spec => data.append("Specs", spec));

    if (formData.image instanceof File) {
      data.append("Image", formData.image);
    }

    formData.gallery.forEach((item) => {
      if (item instanceof File) {
        data.append("Gallery", item);
      }
    });

    try {
      const url = editingProject
        ? `https://qenaracingteam.runasp.net/Racing/Project/UpdateProject`
        : `https://qenaracingteam.runasp.net/Racing/Project/AddProject`;

      const response = await fetch(url, {
        method: editingProject ? "PUT" : "POST",
        body: data,
      });

      if (response.ok) {
        toast.success(editingProject ? "تم تحديث المشروع" : "تم إضافة المشروع");
        setIsDialogOpen(false);
        fetchProjects(pageNumber);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      toast.error("خطأ في الشبكة");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. معالجة الصور ---
  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...files] }));
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  // فتح نافذة التعديل
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setMainImagePreview(typeof project.image === 'string' ? project.image : null);
    setGalleryPreviews(project.gallery.filter(img => typeof img === 'string') as string[]);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2">
            <ArrowRight className="h-4 w-4" /> العودة للوحة التحكم
          </Button>
          <h1 className="text-xl font-bold text-slate-900">إدارة مشاريع الفريق</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="border-none shadow-md ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-2xl font-bold">المشاريع الحالية</CardTitle>
            <Button onClick={() => { setEditingProject(null); setIsDialogOpen(true); setMainImagePreview(null); setGalleryPreviews([]); }} className="bg-primary hover:bg-primary/90 shadow-sm">
              <Plus className="ml-2 h-4 w-4" /> إضافة مشروع جديد
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p>جاري جلب المشاريع من السيرفر...</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-right">المشروع</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-center">الحالة</TableHead>
                      <TableHead className="text-right">السنة</TableHead>
                      <TableHead className="text-left px-6">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((p) => (
                      <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-bold flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md border bg-slate-100 overflow-hidden shrink-0">
                            {p.image && <img src={typeof p.image === 'string' ? p.image : ""} className="object-cover h-full w-full" />}
                          </div>
                          <span className="truncate max-w-[200px]">{p.title}</span>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="font-normal">{p.category}</Badge></TableCell>
                        <TableCell className="text-center">
                          <Badge className={p.status === 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>
                            {p.status === 1 ? 'مكتمل' : 'قيد التنفيذ'}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.year}</TableCell>
                        <TableCell className="flex justify-end gap-2 px-6">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(p)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="p-4 border-t flex items-center justify-between bg-slate-50/50">
                  <span className="text-sm text-slate-500 font-medium">
                    الصفحة {pageNumber} من {pagination?.totalPages || 1}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={!pagination?.hasPrevious} onClick={() => setPageNumber(prev => prev - 1)}>
                      <ChevronRight className="h-4 w-4 ml-1" /> السابق
                    </Button>
                    <Button variant="outline" size="sm" disabled={!pagination?.hasNext} onClick={() => setPageNumber(prev => prev + 1)}>
                      التالي <ChevronLeft className="h-4 w-4 mr-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* --- Dialog: Add/Edit --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl">
          <div className="p-6 border-b bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {editingProject ? <Pencil className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-green-600" />}
              {editingProject ? "تعديل بيانات المشروع" : "إضافة مشروع جديد للأسطول"}
            </DialogTitle>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Text Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">عنوان المشروع *</Label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="مثال: سيارة السباق QR-25" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">الفئة</Label>
                  <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="كهربائية / وقود" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">السنة</Label>
                  <Input type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">الحالة</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="running">قيد التنفيذ (Running)</SelectItem>
                    <SelectItem value="completed">مكتمل (Completed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">وصف موجز للمشروع</Label>
                <Textarea rows={5} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="تكلم عن أهداف المشروع وما تم إنجازه..." />
              </div>
            </div>

            {/* Right Column: Images & Specs */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><ImageIcon className="h-4 w-4" /> الصورة الرئيسية</Label>
                <div className="relative aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group hover:border-primary transition-colors">
                  {mainImagePreview ? (
                    <>
                      <img src={mainImagePreview} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="destructive" onClick={() => setMainImagePreview(null)}><Trash2 className="h-4 w-4 ml-2" /> حذف</Button>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer py-10 w-full">
                      <Upload className="h-10 w-10 text-slate-300 mb-2" />
                      <span className="text-sm text-slate-500">انقر لرفع الصورة الرئيسية</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleMainImageChange} />
                    </label>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Layers className="h-4 w-4" /> معرض الصور</Label>
                <div className="grid grid-cols-4 gap-2">
                  {galleryPreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded border bg-white overflow-hidden group">
                      <img src={src} className="object-cover w-full h-full" />
                      <button onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 text-slate-400">
                    <Plus className="h-5 w-5" />
                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryChange} />
                  </label>
                </div>
              </div>

              {/* Specs List */}
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Settings className="h-4 w-4" /> المواصفات التقنية</Label>
                <div className="flex gap-2">
                  <Input value={currentSpec} onChange={e => setCurrentSpec(e.target.value)} placeholder="مثال: محرك بقوة 400 حصان" onKeyDown={(e) => { if (e.key === 'Enter') { setFormData(p => ({ ...p, specs: [...p.specs, currentSpec] })); setCurrentSpec(""); } }} />
                  <Button type="button" onClick={() => { if (currentSpec) { setFormData(p => ({ ...p, specs: [...p.specs, currentSpec] })); setCurrentSpec(""); } }}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specs.map((s, i) => (
                    <Badge key={i} variant="secondary" className="pr-1 pl-2 py-1 flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-100">
                      <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setFormData(p => ({ ...p, specs: p.specs.filter((_, idx) => idx !== i) }))} />
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 border-t sticky bottom-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>إلغاء</Button>
            <Button onClick={handleSave} disabled={isSubmitting} className="min-w-[140px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : editingProject ? "حفظ التغييرات" : "إضافة المشروع"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProjects;