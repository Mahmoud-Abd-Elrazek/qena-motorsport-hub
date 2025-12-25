import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ArrowRight, Plus, Pencil, Trash2, Loader2, Linkedin, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext"; // استيراد الكونتكست

interface Member {
  id: number;
  name: string;
  role: string;
  specialization: string;
  bio: string;
  points: number;
  linkedInUrl: string;
  currentImageUrl?: string;
  image?: File;
}

const ManageMembers = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const [members, setMembers] = useState<Member[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<Partial<Member>>({
    name: "", role: "", specialization: "", bio: "", points: 0, linkedInUrl: ""
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const confirmDelete = async () => {
    if (!memberToDelete || isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://qenaracingteam.runasp.net/Racing/Member/DeleteMember/${memberToDelete.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();

      setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
      toast.success(t('toast.delete.success'));
    } catch {
      toast.error(t('toast.delete.error'));
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const fetchMembers = useCallback(async (pageNumber: number) => {
    if (isLoading || (!hasMore && pageNumber !== 1)) return;

    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/GetAllMembers", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageNumber, pageSize: 10 }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/admin");
        return;
      }

      const data = await response.json();
      const list = Array.isArray(data.data) ? data.data : [];
      const mappedMembers: Member[] = list.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        specialization: m.specialization,
        bio: m.bio,
        points: m.points,
        linkedInUrl: m.linkedInUrl || "",
        currentImageUrl: m.currentImageUrl,
      }));

      setMembers(prev => (pageNumber === 1 ? mappedMembers : [...prev, ...mappedMembers]));
      setHasMore(mappedMembers.length === 10);
    } catch (error) {
      toast.error(t('list.error'));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, navigate, t]);

  const lastMemberRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    fetchMembers(page);
  }, [page]);

  const handleSave = async () => {
    if (isLoading) return;

    if (!formData.name || !formData.role || formData.points === undefined || !formData.specialization || !formData.bio) {
      toast.error(t('form.required'));
      return;
    }

    const token = localStorage.getItem("token");
    const data = new FormData();

    if (editingMember) data.append("Id", editingMember.id.toString());
    data.append("Name", formData.name || "");
    data.append("Role", formData.role || "");
    data.append("Specialization", formData.specialization || "");
    data.append("Bio", formData.bio || "");
    data.append("Points", (formData.points || 0).toString());
    data.append("LinkedInUrl", formData.linkedInUrl || "");
    if (formData.image) data.append("Image", formData.image);

    try {
      setIsLoading(true);

      const url = editingMember
        ? "https://qenaracingteam.runasp.net/Racing/Member/UpdateMember"
        : "https://qenaracingteam.runasp.net/Racing/Member/AddMember";

      const response = await fetch(url, {
        method: editingMember ? "PUT" : "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: data,
      });

      if (!response.ok) throw new Error();

      if (editingMember) {
        setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...formData, currentImageUrl: formData.image ? URL.createObjectURL(formData.image) : m.currentImageUrl } as Member : m));
      } else {
        setPage(1);
        fetchMembers(1);
      }

      setIsDialogOpen(false);
      toast.success(t('toast.save.success'));
    } catch (error) {
      toast.error(t('toast.save.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // استخدام dir من الكونتكست لضبط اتجاه الصفحة بالكامل
    <div className="min-h-screen bg-muted/30 pb-10 font-sans" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2">
            {/* تغيير أيقونة السهم بناءً على الاتجاه */}
            {language === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t('manage.members.back')}
          </Button>
          <h1 className="text-xl font-bold">{t('manage.members.title')}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="shadow-lg border-none">
          <CardHeader className="flex flex-row items-center justify-between border-b mb-4">
            <CardTitle className="text-2xl">
              {t('manage.members.list')} <span className="text-muted-foreground text-lg">({members.length})</span>
            </CardTitle>
            <Button onClick={() => { setEditingMember(null); setFormData({}); setIsDialogOpen(true); }}>
              <Plus className="ms-2 h-5 w-5" /> {/* استخدمنا ms-2 بدلاً من ml-2 */}
              {t('manage.members.add')}
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  {/* استخدام text-start لضبط المحاذاة تلقائياً */}
                  <TableHead className="text-start">{t('table.member')}</TableHead>
                  <TableHead className="text-start">{t('table.role')}</TableHead>
                  <TableHead className="text-center">{t('table.points')}</TableHead>
                  <TableHead className="text-start font-bold">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                          <AvatarImage src={member.currentImageUrl} alt={member.name} className="object-cover" />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">
                            {member.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-base">{member.name}</span>
                          <span className="text-xs text-muted-foreground">{member.specialization}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {member.role || t('table.role.default')}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono font-bold text-emerald-600">{member.points}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600" 
                          title={t('btn.edit')}
                          onClick={() => { setEditingMember(member); setFormData(member); setIsDialogOpen(true); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title={t('btn.delete')}
                          className="h-8 w-8 text-destructive hover:bg-destructive/100"
                          onClick={() => {
                            setMemberToDelete(member);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Infinite Scroll Trigger Area */}
            <div ref={lastMemberRef} className="py-8 flex justify-center">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" /> {t('list.loading')}
                </div>
              ) : !hasMore && (
                <p className="text-sm text-muted-foreground">{t('list.end')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialog: Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingMember ? t('dialog.edit.title') : t('dialog.add.title')}</DialogTitle>
            <DialogDescription>{t('dialog.desc')}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="flex items-center gap-6 bg-muted/30 p-4 rounded-lg">
              <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
                <AvatarImage src={formData.image ? URL.createObjectURL(formData.image) : formData.currentImageUrl} className="object-cover" />
                <AvatarFallback>IMG</AvatarFallback>
              </Avatar>
              <div className="grid gap-1.5 flex-1">
                <Label>{t('form.image')}</Label>
                <Input type="file" accept="image/*" className="cursor-pointer" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.size > 2 * 1024 * 1024) {
                    toast.error(t('form.image.error'));
                    return;
                  }
                  setFormData({ ...formData, image: file });
                }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t('form.name')}</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder={t('form.name.placeholder')} 
                />
              </div>
              <div className="grid gap-2">
                <Label>{t('form.role')}</Label>
                <Input 
                  value={formData.role} 
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
                  placeholder={t('form.role.placeholder')} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t('form.specialization')}</Label>
                <Input value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>{t('table.points')}</Label>
                <Input type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>{t('form.bio')}</Label>
              <Textarea rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2 text-blue-700">
                <Linkedin className="h-4 w-4" /> {t('form.linkedin')}
              </Label>
              <Input dir="ltr" placeholder="https://linkedin.com/in/username" value={formData.linkedInUrl} onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })} />
            </div>

          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              {t('btn.cancel')}
            </Button>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="px-8 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="ms-2 h-4 w-4 animate-spin" />
                  {t('btn.saving')}
                </>
              ) : (
                t('btn.save')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(v) => !isLoading && setIsDeleteDialogOpen(v)}>
        <DialogContent className="max-w-[400px] border-none shadow-2xl p-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>

            <DialogHeader>
              <DialogTitle className="text-xl text-center font-bold">{t('delete.title')}</DialogTitle>
              <DialogDescription className="text-center pt-2 text-base">
                {t('delete.desc')} <span className="font-bold text-foreground">"{memberToDelete?.name}"</span>؟
                <br />
                <span className="text-sm text-destructive mt-2 block">{t('delete.warning')}</span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter className="flex flex-row gap-3 sm:justify-center mt-6">
            <Button
              variant="ghost"
              className="flex-1 hover:bg-muted"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              {t('btn.cancel')}
            </Button>
            <Button
              variant="destructive"
              className="flex-1 shadow-sm"
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin ms-2" /> : t('btn.confirm_delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageMembers;