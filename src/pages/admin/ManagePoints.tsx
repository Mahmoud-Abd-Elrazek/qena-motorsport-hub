import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MemberSelect from "@/components/MemberSelect";
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
import { ArrowRight, Plus, Trophy, Loader2, TrendingDown, TrendingUp, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Interfaces
interface Member {
  memberId: number;
  memberName: string;
  role: string | null;
  points: number;
}

interface PointHistory {
  memberId: number;
  memberName: string;
  pointsChanged: number;
  reason: string | null;
  changeTime: string;
  pointHistoryId: number;
}

const ManagePoints = () => {
  const navigate = useNavigate();

  // States
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    points: 0,
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<PointHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  
  // States للـ Delete
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // مسح السجل بالكامل
  const [isSingleDeleteDialogOpen, setIsSingleDeleteDialogOpen] = useState(false); // حذف عملية واحدة
  const [idToDelete, setIdToDelete] = useState<number | null>(null); // الـ ID المطلوب حذفه حالياً

  const fetchMembers = async () => {
    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/GetAllMemberPoinsts");
      const result = await response.json();
      if (result.isSuccess) setMembers(result.data);
    } catch (error) {
      toast.error("حدث خطأ في تحديث بيانات الأعضاء");
    }
  };

  const fetchHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/GetMembersPointHistory");
      const result = await response.json();
      if (result.isSuccess) setHistory(result.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchMembers(), fetchHistory()]);
      setIsLoading(false);
    };
    loadAllData();
  }, []);

  function formatToDMY(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  }

  // --- منطق حذف عملية واحدة باستخدام الـ ID ---
  const handleSingleDelete = async () => {
    if (!idToDelete) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `https://qenaracingteam.runasp.net/Racing/Member/DeletePointHistoryById?id=${idToDelete}`,
        { method: "DELETE" }
      );
      const result = await response.json();

      if (result.isSuccess) {
        toast.success("تم حذف العملية بنجاح");
        // تحديث الواجهة فوراً
        setHistory(history.filter(t => t.pointHistoryId !== idToDelete));
        fetchMembers(); // لتحديث النقاط في الكروت
      } else {
        toast.error("فشل الحذف: " + result.message);
      }
    } catch (error) {
      toast.error("خطأ في الاتصال بالسيرفر");
    } finally {
      setIsSubmitting(false);
      setIsSingleDeleteDialogOpen(false);
      setIdToDelete(null);
    }
  };

  // --- مسح السجل بالكامل ---
  const clearAllTransactions = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/ClearAllPointHistory", {
        method: "DELETE",
      });

      if (response.ok) {
        setHistory([]);
        fetchMembers();
        toast.success("تم مسح السجل بالكامل");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء مسح السجل");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSave = async () => {
    if (!formData.memberId || formData.points === 0 || !formData.reason) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/AddPointsToMemeber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: parseInt(formData.memberId),
          pointsToAdd: formData.points,
          reason: formData.reason,
        }),
      });
      const result = await response.json();
      if (result.isSuccess) {
        toast.success("تم التحديث بنجاح!");
        await Promise.all([fetchMembers(), fetchHistory()]);
        setIsDialogOpen(false);
        setFormData({ memberId: "", points: 0, reason: "" });
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2 font-bold">جاري تحميل البيانات...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2">
              <ArrowRight className="h-4 w-4" /> العودة للوحة التحكم
            </Button>
            <h1 className="text-lg font-bold">نظام النقاط</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Top Members Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> أفضل الأعضاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[...members]
                .sort((a, b) => b.points - a.points)
                .slice(0, 3)
                .map((member, index) => (
                  <Card key={member.memberId} className="bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-primary">#{index + 1}</div>
                        <div>
                          <h3 className="font-bold">{member.memberName}</h3>
                          <p className="text-sm text-muted-foreground">{member.role || "بدون دور"}</p>
                          <p className="text-2xl font-bold text-primary mt-2">{member.points} نقطة</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* سجل النقاط */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>سجل النقاط</CardTitle>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="ml-2 h-4 w-4" /> إضافة نقاط
            </Button>
          </CardHeader>
          <CardContent>
            {history.length > 0 && (
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive hover:bg-destructive/10 gap-2"
                >
                  <Trash2 className="h-4 w-4" /> مسح السجل بالكامل
                </Button>
              </div>
            )}
            <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-center">النقاط</TableHead>
                    <TableHead className="text-right">السبب</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isHistoryLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-4"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                  ) : history.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10">لا توجد عمليات</TableCell></TableRow>
                  ) : (
                    history.map((transaction) => (
                      <TableRow key={transaction.pointHistoryId} className="group">
                        <TableCell className="text-xs text-muted-foreground">{formatToDMY(transaction.changeTime)}</TableCell>
                        <TableCell className="font-medium">{transaction.memberName}</TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${transaction.pointsChanged > 0 ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                            {transaction.pointsChanged > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {transaction.pointsChanged > 0 ? `+${transaction.pointsChanged}` : transaction.pointsChanged}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate italic text-sm">{transaction.reason}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setIdToDelete(transaction.pointHistoryId);
                              setIsSingleDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* All Members Table */}
        <Card>
          <CardHeader><CardTitle>قائمة النقاط الكاملة</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">الترتيب</TableHead>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-center">النقاط</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.sort((a, b) => b.points - a.points).map((m, i) => (
                  <TableRow key={m.memberId}>
                    <TableCell className="text-center font-medium">{i + 1}</TableCell>
                    <TableCell className="font-medium">{m.memberName}</TableCell>
                    <TableCell><span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">{m.role || "Member"}</span></TableCell>
                    <TableCell className="text-center font-bold text-primary">{m.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* --- Dialogs --- */}

      {/* 1. إضافة نقاط */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>إضافة نقاط للعضو</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <MemberSelect members={members} formData={formData} setFormData={setFormData} fetchMembers={fetchMembers} />
            <div className="grid gap-2">
              <Label>النقاط</Label>
              <Input type="number" onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="grid gap-2">
              <Label>السبب</Label>
              <Textarea onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "حفظ النقاط"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. تأكيد حذف عملية واحدة */}
      <Dialog open={isSingleDeleteDialogOpen} onOpenChange={setIsSingleDeleteDialogOpen}>
        <DialogContent className="max-w-[400px]">
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center">تأكيد حذف العملية</DialogTitle>
              <DialogDescription className="text-center">
                هل أنت متأكد من حذف هذه العملية من السجل؟<br/>
                <span className="text-xs text-destructive">سيتم تعديل نقاط العضو تلقائياً بعد الحذف.</span>
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button variant="ghost" onClick={() => setIsSingleDeleteDialogOpen(false)} disabled={isSubmitting}>إلغاء</Button>
            <Button variant="destructive" onClick={handleSingleDelete} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "نعم، احذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. تأكيد مسح الكل */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[400px]">
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center">مسح السجل بالكامل</DialogTitle>
              <DialogDescription className="text-center">هذا الإجراء سيقوم بحذف جميع العمليات نهائياً.</DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={clearAllTransactions} disabled={isSubmitting}>
               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "احذف الكل"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePoints;