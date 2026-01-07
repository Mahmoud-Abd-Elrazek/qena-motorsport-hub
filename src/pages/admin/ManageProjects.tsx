import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, ArrowLeft, Plus, Pencil, Trash2, Loader2,
  Upload, X, Image as ImageIcon, Settings, Layers, ChevronLeft, ChevronRight,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

// --- Interfaces ---
interface Project {
  id: string;
  title: string;
  description: string;
  image: File | string | null;
  mainImageId?: string;
  year: number;
  category: string;
  status: 'completed' | 'running';
  specs: string[];
  gallery: (File | string)[];
  imagePublicId?: string[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const ManageProjects = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr'; // تحديد الاتجاه بناءً على اللغة
  // --- States ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Save/Edit States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Delete States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Form Data
  const [formData, setFormData] = useState<Project>({
    id: "", title: "", description: "",
    image: null, year: new Date().getFullYear(), category: "", status: "running", specs: [], gallery: [],
    imagePublicId: [],
    mainImageId: ""
  });

  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [currentSpec, setCurrentSpec] = useState("");

  // --- 1. Fetch Projects ---
  const fetchProjects = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://qenaracingteam.runasp.net/Racing/Project/GetAllProjectsList?pageNumber=${page}&pageSize=10`
      );
      const result = await response.json();

      const mappedProjects = (result.data || []).map((p: any) => ({
        ...p,
        mainImageId: p.mainImageId || p.MainImageId || p.bgImageId || null,
        imagePublicId: p.imagePublicId || p.ImagePublicId || p.imagePublicIds || p.ImagePublicIds || []
      }));

      setProjects(mappedProjects);

      setPagination({
        currentPage: result.currentPage || page,
        totalPages: result.totalPages || 1,
        hasNext: result.hasNext || false,
        hasPrevious: result.hasPrevious || false
      });
    } catch (error) {
      console.error(error);
      toast.error(t('projects.toast.load_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(pageNumber);
  }, [pageNumber]);

  // --- 2. Delete Logic ---
  const initiateDelete = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`https://qenaracingteam.runasp.net/Racing/Project/DeleteProject?id=${projectToDelete.id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        toast.success(t('projects.toast.delete_success'));
        setIsDeleteDialogOpen(false);
        setProjectToDelete(null);
        fetchProjects(pageNumber);
      } else {
        toast.error(t('projects.toast.delete_error'));
      }
    } catch (error) {
      toast.error(t('login.error.network'));
    } finally {
      setIsDeleting(false);
    }
  };

  // --- 3. Save (Add / Update) ---
  const handleSave = async () => {
    if (!formData.title) return toast.error(t('projects.toast.title_required'));
    setIsSubmitting(true);

    const data = new FormData();
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

    if (editingProject) {
      imagesToDelete.forEach((publicId) => {
        data.append("ImagesToDelete", publicId);
      });
    }

    try {
      const url = editingProject
        ? `https://qenaracingteam.runasp.net/Racing/Project/UpdateProject/${editingProject.id}`
        : `https://qenaracingteam.runasp.net/Racing/Project/AddProject`;

      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: data,
      });

      const jsonResult = await response.json();
      if (response.ok && jsonResult.isSuccess) {
        toast.success(editingProject ? t('projects.toast.update_success') : t('projects.toast.add_success'));
        setIsDialogOpen(false);
        fetchProjects(pageNumber);
      } else {
        toast.error(jsonResult.message || t('projects.toast.load_error'));
      }
    } catch (error) {
      console.error(error);
      toast.error(t('projects.toast.network_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. Image Handling ---
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
    const itemToRemove = formData.gallery[index];
    if (typeof itemToRemove === 'string') {
      const idToDelete = formData.imagePublicId?.[index];
      if (idToDelete) {
        setImagesToDelete(prev => [...prev, idToDelete]);
      }
    }

    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => {
      const newGallery = prev.gallery.filter((_, i) => i !== index);
      let newPublicIds = prev.imagePublicId || [];
      if (typeof itemToRemove === 'string') {
        newPublicIds = newPublicIds.filter((_, i) => i !== index);
      }
      return { ...prev, gallery: newGallery, imagePublicId: newPublicIds };
    });
  };

  const handleEditClick = (project: Project) => {
    let yearValue = new Date().getFullYear();
    if (project.year) {
      const yearString = String(project.year);
      const extracted = parseInt(yearString.split('-')[0]);
      if (!isNaN(extracted)) yearValue = extracted;
    }

    setFormData({
      ...project,
      year: yearValue,
      imagePublicId: project.imagePublicId || [],
      mainImageId: project.mainImageId
    });

    setEditingProject(project);
    setImagesToDelete([]);

    setMainImagePreview(typeof project.image === 'string' ? project.image : null);
    const validGalleryPreviews = project.gallery.filter(img => typeof img === 'string') as string[];
    setGalleryPreviews(validGalleryPreviews);

    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingProject(null);
    setFormData({
      id: "", title: "", description: "",
      image: null, year: new Date().getFullYear(), category: "", status: "running", specs: [], gallery: [],
      mainImageId: ""
    });
    setMainImagePreview(null);
    setGalleryPreviews([]);
    setImagesToDelete([]);
    setIsDialogOpen(true);
  }

  return (
    // ضبط الاتجاه بناءً على اللغة
    <div className="min-h-screen bg-slate-50/50 pb-10" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2">
            {language === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t('manage.members.back')}
          </Button>
          <h1 className="text-xl font-bold text-slate-900">{t('projects.title')}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="border-none shadow-md ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-2xl font-bold">{t('projects.list.title')}</CardTitle>
            <Button onClick={handleAddClick} className="bg-primary hover:bg-primary/90 shadow-sm">
              <Plus className="ms-2 h-4 w-4" /> {t('projects.add_new')}
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p>{t('projects.loading')}</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      {/* استخدام text-start لضبط المحاذاة */}
                      <TableHead className="text-start">{t('projects.table.project')}</TableHead>
                      <TableHead className="text-start">{t('projects.table.category')}</TableHead>
                      <TableHead className="text-center">{t('projects.table.status')}</TableHead>
                      <TableHead className="text-start">{t('projects.table.year')}</TableHead>
                      <TableHead className="text-start px-6">{t('projects.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((p) => (
                      <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-bold">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md border bg-slate-100 overflow-hidden shrink-0">
                              {p.image && <img src={typeof p.image === 'string' ? p.image : ""} className="object-cover h-full w-full" />}
                            </div>
                            <span className="truncate max-w-[200px]">{p.title}</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="font-normal">{p.category}</Badge></TableCell>
                        <TableCell className="text-center">
                          <Badge className={p.status === 'completed' || p.status === 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>
                            {p.status === 'completed' || p.status === 1 ? t('projects.status.completed') : t('projects.status.running')}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.year}</TableCell>
                        <TableCell>
                          <div className="flex justify-start gap-2 px-6">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(p)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => initiateDelete(p)} className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="p-4 border-t flex items-center justify-between bg-slate-50/50">
                  <span className="text-sm text-slate-500 font-medium">
                    {t('pagination.page')} {pageNumber} {t('pagination.of')} {pagination?.totalPages || 1}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={!pagination?.hasPrevious} onClick={() => setPageNumber(prev => prev - 1)}>
                      {/* تبديل اتجاه الأسهم في الباجينيشن */}
                      {language === 'ar' ? <ChevronRight className="h-4 w-4 ml-1" /> : <ChevronLeft className="h-4 w-4 mr-1" />}
                      {t('pagination.prev')}
                    </Button>
                    <Button variant="outline" size="sm" disabled={!pagination?.hasNext} onClick={() => setPageNumber(prev => prev + 1)}>
                      {t('pagination.next')}
                      {language === 'ar' ? <ChevronLeft className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
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
        {/* ضبط الاتجاه للديالوج */}
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl" dir={dir}>
          <div className="p-6 border-b bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {editingProject ? <Pencil className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-green-600" />}
              {editingProject ? t('projects.dialog.edit_title') : t('projects.dialog.add_title')}
            </DialogTitle>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">{t('projects.form.title')}</Label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder={t('projects.form.title_ph')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">{t('projects.form.category')}</Label>
                  <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder={t('projects.form.category_ph')} />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">{t('projects.form.year')}</Label>
                  <Input type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">{t('projects.form.status')}</Label>
                <Select value={formData.status === 1 || formData.status === 'completed' ? "completed" : "running"} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="running">{t('projects.status.running')}</SelectItem>
                    <SelectItem value="completed">{t('projects.status.completed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">{t('projects.form.desc')}</Label>
                <Textarea rows={5} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder={t('projects.form.desc_ph')} />
              </div>
            </div>

            <div className="space-y-6">
              {/* Main Image */}
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><ImageIcon className="h-4 w-4" /> {t('projects.form.main_img')}</Label>
                <div className="relative aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group hover:border-primary transition-colors">
                  {mainImagePreview ? (
                    <>
                      <img src={mainImagePreview} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="destructive" onClick={() => {
                          if (typeof formData.image === 'string' && formData.mainImageId) {
                            setImagesToDelete(prev => [...prev, formData.mainImageId!]);
                          }
                          setMainImagePreview(null);
                          setFormData(p => ({ ...p, image: null }));
                        }}><Trash2 className="h-4 w-4 ms-2" /> {t('projects.form.delete_img')}</Button>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer py-10 w-full">
                      <Upload className="h-10 w-10 text-slate-300 mb-2" />
                      <span className="text-sm text-slate-500">{t('projects.form.upload_hint')}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleMainImageChange} />
                    </label>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Layers className="h-4 w-4" /> {t('projects.form.gallery')}</Label>
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

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Settings className="h-4 w-4" /> {t('projects.form.specs')}</Label>
                <div className="flex gap-2">
                  <Input value={currentSpec} onChange={e => setCurrentSpec(e.target.value)} placeholder={t('projects.form.specs_ph')} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (currentSpec) { setFormData(p => ({ ...p, specs: [...p.specs, currentSpec] })); setCurrentSpec(""); } } }} />
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>{t('btn.cancel')}</Button>
            <Button onClick={handleSave} disabled={isSubmitting} className="min-w-[140px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin ms-2" /> : editingProject ? t('btn.save') : t('projects.add_new')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Delete Confirmation Dialog --- */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(v) => !isDeleting && setIsDeleteDialogOpen(v)}>
        <DialogContent className="max-w-[400px] border-none shadow-2xl p-6" dir={dir}>
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>

            <DialogHeader>
              <DialogTitle className="text-xl text-center font-bold">{t('projects.delete.title')}</DialogTitle>
              <DialogDescription className="text-center pt-2 text-base">
                {t('projects.delete.desc')} <span className="font-bold text-foreground">"{projectToDelete?.title}"</span>؟
                <br />
                <span className="text-sm text-destructive mt-2 block">{t('projects.delete.warning')}</span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter className="flex flex-row gap-3 sm:justify-center mt-6">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t('btn.cancel')}
            </Button>
            <Button
              variant="destructive"
              className="flex-1 shadow-sm"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin ms-2" /> : t('projects.delete.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProjects;