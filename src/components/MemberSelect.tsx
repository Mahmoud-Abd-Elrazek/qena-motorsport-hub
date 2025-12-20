import * as React from "react";
import { Check, ChevronsUpDown, Linkedin, Loader2, Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

export default function ProfessionalMemberSelect({ members, formData, setFormData, fetchMembers }) {
  const [open, setOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // بيانات نموذج الإضافة فقط
  const [formAddData, setFormAddData] = React.useState({
    name: "",
    role: "",
    specialization: "",
    bio: "",
    points: 0,
    linkedInUrl: "",
    image: null
  });

  const handleSave = async () => {
    if (isLoading) return;

    // التحقق من الحقول المطلوبة
    if (!formAddData.name || !formAddData.role || !formAddData.specialization || !formAddData.bio) {
      toast.error("يرجى ملء كافة الحقول المطلوبة الأساسية");
      return;
    }

    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("Name", formAddData.name);
    data.append("Role", formAddData.role);
    data.append("Specialization", formAddData.specialization);
    data.append("Bio", formAddData.bio);
    data.append("Points", (formAddData.points || 0).toString());
    data.append("LinkedInUrl", formAddData.linkedInUrl || "");
    if (formAddData.image) data.append("Image", formAddData.image);

    try {
      setIsLoading(true);
      const url = "https://qenaracingteam.runasp.net/Racing/Member/AddMember";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: data,
      });

      if (!response.ok) throw new Error("Failed to add member");

      toast.success("تم إضافة العضو الجديد بنجاح");

      if (fetchMembers) fetchMembers();

      setFormAddData({
        name: "", role: "", specialization: "", bio: "", points: 0, linkedInUrl: "", image: null
      });
      setIsDialogOpen(false);

    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة، يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMember = members.find((m) => m.memberId === formData.memberId);

  return (
    <div className="grid gap-2 text-right" dir="rtl">
      <Label className="text-sm font-bold text-slate-700">اختر العضو المسجل *</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between h-12 px-3 border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {selectedMember ? (
                <>
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/100 text-[10px] ">
                      {selectedMember.memberName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{selectedMember.memberName}</span>
                </>
              ) : (
                <span className="text-muted-foreground">ابحث عن اسم العضو...</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[450px] p-0 shadow-xl" align="start">
          <Command>
            <CommandInput placeholder="اكتب اسم العضو للبحث..." className="h-11" />
            <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <CommandEmpty className="py-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">العضو غير موجود.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setOpen(false); setIsDialogOpen(true); }}
                >
                  <UserPlus className="ml-2 h-4 w-4" /> إضافة عضو جديد
                </Button>
              </CommandEmpty>
              <CommandGroup heading="الأعضاء المسجلين">
                {members.map((m) => (
                  <CommandItem
                    key={m.memberId}
                    value={m.memberName}
                    onSelect={() => {
                      setFormData({ ...formData, memberId: m.memberId });
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 py-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-100 text-[10px] text-muted-foreground">
                        {m.memberName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-right">{m.memberName}</span>
                      <span className="text-[11px] text-right">{m.role}</span>
                    </div>
                    <Check className={cn("h-4 w-4 text-primary", formData.memberId === m.memberId ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* نافذة الإضافة المحدثة */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-2xl font-bold">إضافة عضو جديد</DialogTitle>
            <DialogDescription>أدخل بيانات العضو الجديد لإضافته للفريق.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* الصورة */}
            <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
              <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
                <AvatarImage src={formAddData.image ? URL.createObjectURL(formAddData.image) : ""} className="object-cover" />
                <AvatarFallback><UserPlus className="h-8 w-8 text-slate-400" /></AvatarFallback>
              </Avatar>
              <div className="grid gap-1.5 flex-1 text-right">
                <Label>الصورة الشخصية</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFormAddData({ ...formAddData, image: e.target.files?.[0] })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-right">
                <Label>الاسم الكامل *</Label>
                <Input value={formAddData.name} onChange={(e) => setFormAddData({ ...formAddData, name: e.target.value })} placeholder="أحمد علي" />
              </div>
              <div className="grid gap-2 text-right">
                <Label>الدور *</Label>
                <Input value={formAddData.role} onChange={(e) => setFormAddData({ ...formAddData, role: e.target.value })} placeholder="Team Leader" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-right">
                <Label>التخصص *</Label>
                <Input value={formAddData.specialization} onChange={(e) => setFormAddData({ ...formAddData, specialization: e.target.value })} />
              </div>
              <div className="grid gap-2 text-right">
                <Label>النقاط</Label>
                <Input type="number" value={formAddData.points} onChange={(e) => setFormAddData({ ...formAddData, points: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div className="grid gap-2 text-right">
              <Label>نبذة تعريفية *</Label>
              <Textarea rows={3} value={formAddData.bio} onChange={(e) => setFormAddData({ ...formAddData, bio: e.target.value })} />
            </div>

            <div className="grid gap-2 text-right">
              <Label className="flex items-center gap-2 text-blue-700">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </Label>
              <Input dir="ltr" value={formAddData.linkedInUrl} onChange={(e) => setFormAddData({ ...formAddData, linkedInUrl: e.target.value })} />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={isLoading} className="flex-[2]">
              {isLoading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الحفظ...</> : "إضافة العضو"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}