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
import { ArrowRight, Plus, Pencil, Trash2, Loader2, Linkedin, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null); // لتخزين بيانات العضو المراد حذفه


  const confirmDelete = async () => {
    if (!memberToDelete || isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://qenaracingteam.runasp.net/Racing/Member/DeleteMember/${memberToDelete.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();

      setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
      toast.success(`تم حذف العضو ${memberToDelete.name} بنجاح`);
    } catch {
      toast.error("فشل في عملية الحذف");
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
      const response = await fetch("http://qenaracingteam.runasp.net/Racing/Member/GetAllMembers", {
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
      const mappedMembers: Member[] = data.data.map((m) => ({
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
      setHasMore(mappedMembers.length === 10); // افترضنا أن pageSize هو 10
    } catch (error) {
      toast.error("فشل في تحميل الأعضاء");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, navigate]);

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

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا العضو؟")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://qenaracingteam.runasp.net/Racing/Member/DeleteMember/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      setMembers(prev => prev.filter(m => m.id !== id));
      toast.success("تم الحذف بنجاح");
    } catch {
      toast.error("فشل الحذف");
    }
  };

  const handleSave = async () => {
    if (isLoading) return;

    if (!formData.name || !formData.role) {
      toast.error("يرجى ملء الحقول المطلوبة");
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
        ? "http://qenaracingteam.runasp.net/Racing/Member/UpdateMember"
        : "http://qenaracingteam.runasp.net/Racing/Member/AddMember";

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
      toast.success("تم حفظ البيانات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ، يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-muted/30 pb-10 font-sans" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2">
            <ArrowRight className="h-4 w-4" /> العودة للوحة التحكم
          </Button>
          <h1 className="text-xl font-bold">إدارة شؤون الأعضاء</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="shadow-lg border-none">
          <CardHeader className="flex flex-row items-center justify-between border-b mb-4">
            <CardTitle className="text-2xl">قائمة الفريق ({members.length})</CardTitle>
            <Button onClick={() => { setEditingMember(null); setFormData({}); setIsDialogOpen(true); }}>
              <Plus className="ml-2 h-5 w-5" /> إضافة عضو جديد
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right">العضو</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-center">النقاط</TableHead>
                  <TableHead className="text-left font-bold">الإجراءات</TableHead>
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
                        {member.role || "عضو"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono font-bold text-emerald-600">{member.points}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" onClick={() => { setEditingMember(member); setFormData(member); setIsDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
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
                  <Loader2 className="h-5 w-5 animate-spin" /> جاري تحميل المزيد...
                </div>
              ) : !hasMore && (
                <p className="text-sm text-muted-foreground">وصلت إلى نهاية القائمة</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialog: Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingMember ? "تعديل بيانات العضو" : "إضافة عضو جديد للفريق"}</DialogTitle>
            <DialogDescription>يرجى التأكد من صحة البيانات، خاصة رابط LinkedIn.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="flex items-center gap-6 bg-muted/30 p-4 rounded-lg">
              <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
                <AvatarImage src={formData.image ? URL.createObjectURL(formData.image) : formData.currentImageUrl} className="object-cover" />
                <AvatarFallback>IMG</AvatarFallback>
              </Avatar>
              <div className="grid gap-1.5 flex-1">
                <Label>الصورة الشخصية</Label>
                <Input type="file" accept="image/*" className="cursor-pointer" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>الاسم الكامل</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="مثال: أحمد محمد" />
              </div>
              <div className="grid gap-2">
                <Label>الدور في الفريق</Label>
                <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="مثال: Team Leader" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>التخصص</Label>
                <Input value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>النقاط</Label>
                <Input type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2 text-blue-700">
                <Linkedin className="h-4 w-4" /> رابط LinkedIn
              </Label>
              <Input dir="ltr" placeholder="https://linkedin.com/in/username" value={formData.linkedInUrl} onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })} />
            </div>

            <div className="grid gap-2">
              <Label>نبذة تعريفية</Label>
              <Textarea rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading} // تعطيل زر الإلغاء أيضاً أثناء التحميل لزيادة الأمان
            >
              إلغاء
            </Button>

            <Button
              onClick={handleSave}
              disabled={isLoading} // هذا هو السطر الأهم لمنع الضغط المتكرر
              className="px-8 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ البيانات"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف الاحترافية */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(v) => !isLoading && setIsDeleteDialogOpen(v)}>
        <DialogContent className="max-w-[400px] border-none shadow-2xl p-6">
          <div className="flex flex-col items-center text-center">
            {/* أيقونة تحذير */}
            <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>

            <DialogHeader>
              <DialogTitle className="text-xl text-center font-bold">تأكيد الحذف</DialogTitle>
              <DialogDescription className="text-center pt-2 text-base">
                هل أنت متأكد من حذف <span className="font-bold text-foreground">"{memberToDelete?.name}"</span>؟
                <br />
                <span className="text-sm text-destructive mt-2 block">هذا الإجراء لا يمكن الرجوع عنه.</span>
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
              إلغاء
            </Button>
            <Button
              variant="destructive"
              className="flex-1 shadow-sm"
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : "نعم، احذف الآن"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageMembers;