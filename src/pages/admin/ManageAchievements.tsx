import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, ArrowLeft, Plus, Pencil, Trash2, Loader2, Trophy, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

// --- Interfaces ---
interface Achievement {
  id: string; 
  description: string;
  year: number;
}

const ManageAchievements = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // --- States ---
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog States (Add/Edit)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Delete States
  const [itemToDelete, setItemToDelete] = useState<Achievement | null>(null); 
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    description: "",
    year: new Date().getFullYear()
  });

  // --- 1. Fetch Achievements (Real API) ---
  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Achievements/GetAll");
      
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const result = await response.json();
      const data = Array.isArray(result) ? result : (result.data || []);
      setAchievements(data);
    } catch (error) {
      console.error(error);
      toast.error(t('achievements.toast.load_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // --- 2. Handle Save (Create / Update) ---
  const handleSave = async () => {
    if (!formData.description) return toast.error(t('achievements.toast.desc_req'));
    if (!formData.year) return toast.error(t('achievements.toast.year_req'));

    setIsSubmitting(true);

    try {
      let url = "https://qenaracingteam.runasp.net/Racing/Achievements/Create";
      let method = "POST";

      if (editingId) {
        url = `https://qenaracingteam.runasp.net/Racing/Achievements/Update/${editingId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: formData.description,
          year: formData.year
        }),
      });

      if (response.ok) {
        toast.success(editingId ? t('achievements.toast.update_success') : t('achievements.toast.add_success'));
        setIsDialogOpen(false);
        fetchAchievements(); // Refresh list
      } else {
        const errorText = await response.text();
        toast.error(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(t('achievements.toast.server_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. Handle Delete (Real API) ---
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`https://qenaracingteam.runasp.net/Racing/Achievements/Delete/${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(t('achievements.toast.delete_success'));
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
        fetchAchievements(); // Refresh list
      } else {
        toast.error(t('achievements.toast.delete_error'));
      }
    } catch (error) {
      console.error(error);
      toast.error(t('achievements.toast.server_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Helpers ---
  const openAddDialog = () => {
    setEditingId(null);
    setFormData({ description: "", year: new Date().getFullYear() });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Achievement) => {
    setEditingId(item.id);
    setFormData({ description: item.description, year: item.year });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (item: Achievement) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  return (
    // استخدام dir لضبط الاتجاه تلقائياً
    <div className="min-h-screen bg-slate-50/50 pb-10" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2">
            {/* عكس اتجاه السهم بناءً على اللغة */}
            {language === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t('achievements.back')}
          </Button>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" /> {t('achievements.title')}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-none shadow-md ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-2xl font-bold">{t('achievements.list.title')}</CardTitle>
            <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
              <Plus className="ms-2 h-4 w-4" /> {t('achievements.add_new')}
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p>{t('achievements.loading')}</p>
              </div>
            ) : achievements.length === 0 ? (
                <div className="py-10 text-center text-slate-500">
                    {t('achievements.empty')}
                </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    {/* استخدام text-start لضبط المحاذاة */}
                    <TableHead className="text-start w-[100px]">{t('achievements.table.year')}</TableHead>
                    <TableHead className="text-start">{t('achievements.table.desc')}</TableHead>
                    <TableHead className="text-end px-6">{t('achievements.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {achievements.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold font-mono text-primary">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {item.year}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate" title={item.description}>
                        {item.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2 px-4">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)} className="text-blue-600 hover:bg-blue-50">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(item)} className="text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* --- Add/Edit Dialog --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* استخدام dir للنافذة المنبثقة */}
        <DialogContent className="sm:max-w-[500px]" dir={dir}>
          <DialogHeader>
            <DialogTitle>{editingId ? t('achievements.dialog.edit_title') : t('achievements.dialog.add_title')}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="year">{t('achievements.form.year')}</Label>
              <Input 
                id="year" 
                type="number" 
                value={formData.year} 
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">{t('achievements.form.desc')}</Label>
              <Textarea 
                id="desc" 
                placeholder={t('achievements.form.desc_ph')}
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('btn.cancel')}</Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {t('btn.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Custom Delete Confirmation Dialog --- */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(v) => !isSubmitting && setIsDeleteDialogOpen(v)}>
        <DialogContent className="max-w-[400px] border-none shadow-2xl p-6" dir={dir}>
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>

            <DialogHeader>
              <DialogTitle className="text-xl text-center font-bold">
                {t('achievements.delete.title')}
              </DialogTitle>
              <DialogDescription className="text-center pt-2 text-base">
                {t('achievements.delete.desc')} <br/>
                <span className="font-bold text-foreground block mt-2 truncate max-w-[300px] mx-auto">
                    "{itemToDelete?.description}"
                </span>
                <span className="text-sm text-destructive mt-3 block">
                    {t('achievements.delete.warning')}
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter className="flex flex-row gap-3 sm:justify-center mt-6">
            <Button
              variant="ghost"
              className="flex-1 hover:bg-muted"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              {t('btn.cancel')}
            </Button>
            <Button
              variant="destructive"
              className="flex-1 shadow-sm"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('achievements.delete.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageAchievements;