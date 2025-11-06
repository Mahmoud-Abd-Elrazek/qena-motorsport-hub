import { useState } from "react";
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
import { ArrowRight, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { teamMembers as initialMembers } from "@/data/mockData";

interface Member {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  image: string;
  points: number;
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const ManageMembers = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<Partial<Member>>({
    name: "",
    role: "",
    specialty: "",
    bio: "",
    image: "/placeholder.svg",
    points: 0,
    socials: {},
  });

  const handleAdd = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      specialty: "",
      bio: "",
      image: "/placeholder.svg",
      points: 0,
      socials: {},
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData(member);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    toast.success("تم حذف العضو بنجاح");
  };

  const handleSave = () => {
    if (!formData.name || !formData.role || !formData.specialty) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (editingMember) {
      setMembers(
        members.map((m) =>
          m.id === editingMember.id ? { ...formData, id: m.id } as Member : m
        )
      );
      toast.success("تم تحديث العضو بنجاح");
    } else {
      const newMember = {
        ...formData,
        id: Date.now().toString(),
      } as Member;
      setMembers([...members, newMember]);
      toast.success("تم إضافة العضو بنجاح");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              العودة للوحة التحكم
            </Button>
            <h1 className="text-lg font-bold">إدارة الأعضاء</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>قائمة الأعضاء</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة عضو جديد
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>التخصص</TableHead>
                  <TableHead className="text-center">النقاط</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.specialty}</TableCell>
                    <TableCell className="text-center">{member.points}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "تعديل عضو" : "إضافة عضو جديد"}
            </DialogTitle>
            <DialogDescription>
              {editingMember
                ? "قم بتعديل بيانات العضو"
                : "قم بإدخال بيانات العضو الجديد"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">الاسم *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="أحمد محمد علي"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">الدور *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="قائد الفريق"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialty">التخصص *</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                placeholder="الهندسة الميكانيكية"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">نبذة تعريفية</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="نبذة مختصرة عن العضو وخبراته"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="points">النقاط</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.socials?.facebook || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/..."
                  dir="ltr"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.socials?.instagram || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/..."
                  dir="ltr"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.socials?.linkedin || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/..."
                  dir="ltr"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.socials?.twitter || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, twitter: e.target.value },
                    })
                  }
                  placeholder="https://twitter.com/..."
                  dir="ltr"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageMembers;
