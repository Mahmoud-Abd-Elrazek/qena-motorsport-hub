import { useState, useEffect } from "react"; // أضفنا useEffect
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
import { ArrowRight, Plus, Trophy, Loader2, TrendingDown, TrendingUp, Trash2 } from "lucide-react"; // أضفنا Loader2 للتحميل
import { toast } from "sonner";

// تعريف شكل العضو من الـ API
interface Member {
  memberId: number;
  memberName: string;
  role: string | null;
  points: number;
}

interface PointTransaction {
  id: string;
  memberId: number;
  memberName: string;
  points: number;
  reason: string;
  date: string;
}

const ManagePoints = () => {
  const navigate = useNavigate();

  // States الجديدة
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    points: 0,
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://qenaracingteam.runasp.net/Racing/Member/GetAllMemberPoinsts");
      const result = await response.json();

      if (result.isSuccess) {
        setMembers(result.data);
      } else {
        toast.error("فشل في تحميل البيانات: " + result.message);
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // const handleSave = () => {
  //   if (!formData.memberId || formData.points === 0 || !formData.reason) {
  //     toast.error("يرجى ملء جميع الحقول");
  //     return;
  //   }

  //   const member = members.find((m) => m.memberId === parseInt(formData.memberId));
  //   if (!member) {
  //     toast.error("العضو غير موجود");
  //     return;
  //   }

  //   const newTransaction: PointTransaction = {
  //     id: Date.now().toString(),
  //     memberId: member.memberId,
  //     memberName: member.memberName,
  //     points: formData.points,
  //     reason: formData.reason,
  //     date: new Date().toISOString().split("T")[0],
  //   };

  //   setTransactions([newTransaction, ...transactions]);

  //   // ملاحظة: هنا المفروض تبعت الـ Transaction للباك اند بـ POST Request
  //   // حالياً هنحدث الـ UI فقط
  //   const updatedMembers = members.map(m => 
  //     m.memberId === member.memberId ? { ...m, points: m.points + formData.points } : m
  //   );
  //   setMembers(updatedMembers);

  //   toast.success("تم إضافة النقاط بنجاح");
  //   setIsDialogOpen(false);
  // };
  // حذف عملية واحدة
  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem("racing_transactions", JSON.stringify(updatedTransactions));
    toast.success("تم حذف العملية من السجل المحلي");
  };

  // مسح السجل بالكامل
  const clearAllTransactions = () => {
    if (window.confirm("هل أنت متأكد من مسح سجل العمليات بالكامل؟")) {
      setTransactions([]);
      localStorage.removeItem("racing_transactions");
      toast.success("تم مسح السجل بالكامل");
    }
  };

  const handleSave = async () => {
    // التحقق من البيانات (زي ما عملنا قبل كدة)
    if (!formData.memberId || formData.points === 0 || !formData.reason) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    // إيجاد العضو المختار عشان نستخدم اسمه في الـ Toast
    const member = members.find((m) => m.memberId === parseInt(formData.memberId));
    if (!member) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("http://qenaracingteam.runasp.net/Racing/Member/AddPointsToMemeber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: parseInt(formData.memberId),
          pointsToAdd: formData.points,
          reason: formData.reason,
        }),
      });

      const result = await response.json();

      // هناااااا تحط الكود بتاعك 👇
      if (result.isSuccess) {
        toast.success(
          <div className="flex flex-col">
            <span className="font-bold text-right">تم التحديث بنجاح!</span>
            <span className={`text-sm text-right ${formData.points > 0 ? "text-green-600" : "text-red-600"}`}>
              تم {formData.points > 0 ? "إضافة" : "خصم"} {Math.abs(formData.points)} نقطة لـ {member.memberName}
            </span>
          </div>
        );

        // بقية العمليات (تحديث الـ state وإغلاق الديالوج)
        const updatedMembers = members.map((m) =>
          m.memberId === member.memberId ? { ...m, points: m.points + formData.points } : m
        );
        setMembers(updatedMembers);

        // إضافة للعمليات المحلية
        const newTransaction = {
          id: Date.now().toString(),
          memberId: member.memberId,
          memberName: member.memberName,
          points: formData.points,
          reason: formData.reason,
          date: new Date().toLocaleDateString(),
        };
        setTransactions([newTransaction, ...transactions]);

        setIsDialogOpen(false);
        setFormData({ memberId: "", points: 0, reason: "" });
      } else {
        toast.error(result.message);
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
        <span className="mr-2">جاري تحميل البيانات...</span>
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
        {/* Top Members */}
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

        {/* سجل النقاط و جدول الأعضاء بنفس الطريقة السابقة مع تغيير المسميات */}
        {/* ... بقية الـ Table Components باستخدام member.memberName و member.memberId ... */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>سجل النقاط </CardTitle>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="ml-2 h-4 w-4" /> إضافة نقاط
            </Button>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20">
              <div className="space-y-4">
                {/* زر مسح الكل يظهر فوق الجدول */}
                {transactions.length > 0 && (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllTransactions}
                      className="text-destructive hover:bg-destructive/100 gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      مسح السجل بالكامل
                    </Button>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">اسم العضو</TableHead>
                      <TableHead className="text-center">النقاط</TableHead>
                      <TableHead className="text-right">السبب</TableHead>
                      <TableHead className="w-[50px]"></TableHead> {/* عمود الحذف */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        {/* تم تعديل colSpan إلى 5 ليناسب الأعمدة الجديدة */}
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          لا توجد عمليات مسجلة حالياً
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-muted/30 transition-colors group">
                          <TableCell className="text-muted-foreground font-medium text-sm">
                            {transaction.date}
                          </TableCell>
                          <TableCell className="font-bold">
                            {transaction.memberName}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black border ${transaction.points > 0
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-red-50 text-red-600 border-red-200"
                              }`}>
                              {transaction.points > 0 ? (
                                <>
                                  <TrendingUp className="w-3.5 h-3.5" />
                                  <span>+{transaction.points}</span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="w-3.5 h-3.5" />
                                  <span>{transaction.points}</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-muted-foreground italic">
                            {transaction.reason}
                          </TableCell>
                          <TableCell>
                            {/* زر حذف عنصر واحد - يظهر بشكل أوضح عند عمل Hover على الصف */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTransaction(transaction.id)}
                              className="h-8 w-8 text-muted-foreground hover:bg-destructive/100 transition-opacity"
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
                {[...members].sort((a, b) => b.points - a.points).map((m, i) => (
                  <TableRow key={m.memberId}>
                    <TableCell className="text-center">{i + 1}</TableCell>
                    <TableCell>{m.memberName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {m.role || "Member"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary">{m.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة نقاط</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>اختر العضو *</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              >
                <option value="">-- اختر عضو --</option>
                {members.map((m) => (
                  <option key={m.memberId} value={m.memberId}>{m.memberName}</option>
                ))}
              </select>
            </div>
            {/* باقي الـ inputs (النقاط والسبب) زي ما هي */}
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
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>

            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ النقاط"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePoints;