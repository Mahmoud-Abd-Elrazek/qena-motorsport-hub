import { useState, useEffect } from "react"; // أضفنا useEffect
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
import { ArrowRight, Plus, Trophy, Loader2, TrendingDown, TrendingUp, Trash2, RefreshCw } from "lucide-react"; // أضفنا Loader2 للتحميل
import { toast } from "sonner";
import { resourceUsage } from "process";

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

interface PointHistory {
  memberId: number;
  memberName: string;
  pointsChanged: number;
  reason: string | null;
  changeTime: string;
  pointHistoryId: number
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
  const [history, setHistory] = useState<PointHistory[]>([]); // السجل من الـ API
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

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

  const fetchHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const response = await fetch("http://qenaracingteam.runasp.net/Racing/Member/GetMembersPointHistory");
      const result = await response.json();
      if (result.isSuccess) {
        setHistory(result.data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  function formatToDMY(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day} / ${month} / ${year}`;
  }


  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchMembers(), fetchHistory()]);
      setIsLoading(false);
    };
    loadAllData();
  }, []);

  // حذف عملية واحدة
  const deleteTransaction = (id: number) => {
    const updatedTransactions = history.filter((t) => t.pointHistoryId !== id);
    setHistory(updatedTransactions);
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
    if (!formData.memberId || formData.points === 0 || !formData.reason) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

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

      if (result.isSuccess) {
        toast.success(
          <div className="flex flex-col">
            <span className="font-bold text-right">تم التحديث بنجاح!</span>
            <span className={`text-sm text-right ${formData.points > 0 ? "text-green-600" : "text-red-600"}`}>
              تم {formData.points > 0 ? "إضافة" : "خصم"} {Math.abs(formData.points)} نقطة لـ {member.memberName}
            </span>
          </div>
        );

        // await Promise.all([fetchMembers(), fetchHistory()]);

        const updatedMembers = members.map((m) =>
          m.memberId === member.memberId ? { ...m, points: m.points + formData.points } : m
        );
        setMembers(updatedMembers);

        // إضافة للعمليات المحلية
        const newHistory: PointHistory = {
          memberId: member.memberId,
          memberName: member.memberName,
          pointsChanged: formData.points,
          reason: formData.reason || null,
          changeTime: new Date().toISOString(),
          pointHistoryId: Date.now(),
        };
        setHistory([newHistory, ...history]);

        setIsDialogOpen(false);
        setFormData({ memberId: "", points: 0, reason: "" });
      } else {
        toast.error(formData.points > 2147483647 || formData.points < -2147483648 ? "Points Overflow" : result.message);
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
            <div className="flex flex-row items-center justify-between gap-2">
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="ml-2 h-4 w-4" /> إضافة نقاط
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* زر مسح الكل يظهر فوق الجدول */}
            {history.length > 0 && (
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
            <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">اسم العضو</TableHead>
                      <TableHead className="text-center">النقاط</TableHead>
                      <TableHead className="text-right">السبب</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          لا توجد عمليات مسجلة حالياً
                        </TableCell>
                      </TableRow>
                    ) : (
                      history.map((transaction, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/30 transition-colors group">
                          <TableCell className="text-muted-foreground font-medium text-sm">
                            {formatToDMY(transaction.changeTime)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.memberName}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black border ${transaction.pointsChanged > 0
                              ? "bg-green-50 text-green-600 border-green-200"
                              : "bg-red-50 text-red-600 border-red-200"
                              }`}>
                              {transaction.pointsChanged > 0 ? (
                                <>
                                  <TrendingUp className="w-3.5 h-3.5" />
                                  <span className="font-medium">+{transaction.pointsChanged}</span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="w-3.5 h-3.5" />
                                  <span className="font-medium">{transaction.pointsChanged}</span>
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
                              onClick={() => deleteTransaction(transaction.pointHistoryId)}
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
                    <TableCell className="text-center font-medium">{i + 1}</TableCell>
                    <TableCell className="font-medium">{m.memberName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {m.role || "Member"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium text-primary">{m.points}</TableCell>
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
            {/* <div className="grid gap-2">
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
            </div> */}
            <MemberSelect members={members} formData={formData} setFormData={setFormData} />
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">النقاط<span className="text-destructive">*</span>
              </label>
              <Input type="number" onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                ذكر السبب <span className="text-destructive">*</span>
              </label>              <Textarea onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
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