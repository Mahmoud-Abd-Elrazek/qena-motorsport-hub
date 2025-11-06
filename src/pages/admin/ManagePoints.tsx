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
import { ArrowRight, Plus, Trophy } from "lucide-react";
import { toast } from "sonner";
import { teamMembers as initialMembers } from "@/data/mockData";

interface PointTransaction {
  id: string;
  memberId: string;
  memberName: string;
  points: number;
  reason: string;
  date: string;
}

const ManagePoints = () => {
  const navigate = useNavigate();
  const [members] = useState(initialMembers);
  const [transactions, setTransactions] = useState<PointTransaction[]>([
    {
      id: "1",
      memberId: "1",
      memberName: "أحمد محمد علي",
      points: 50,
      reason: "إكمال تصميم المحرك الجديد",
      date: "2024-01-15",
    },
    {
      id: "2",
      memberId: "2",
      memberName: "سارة حسن إبراهيم",
      points: 45,
      reason: "تطوير نظام التحكم الكهربائي",
      date: "2024-01-14",
    },
    {
      id: "3",
      memberId: "3",
      memberName: "محمود خالد عبدالله",
      points: 40,
      reason: "برمجة نظام الملاحة",
      date: "2024-01-13",
    },
    {
      id: "4",
      memberId: "1",
      memberName: "أحمد محمد علي",
      points: 30,
      reason: "قيادة اجتماع الفريق الأسبوعي",
      date: "2024-01-12",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    points: 0,
    reason: "",
  });

  const handleAddPoints = () => {
    setFormData({
      memberId: "",
      points: 0,
      reason: "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.memberId || formData.points === 0 || !formData.reason) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const member = members.find((m) => m.id === formData.memberId);
    if (!member) {
      toast.error("العضو غير موجود");
      return;
    }

    const newTransaction: PointTransaction = {
      id: Date.now().toString(),
      memberId: formData.memberId,
      memberName: member.name,
      points: formData.points,
      reason: formData.reason,
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions([newTransaction, ...transactions]);
    toast.success("تم إضافة النقاط بنجاح");
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
            <h1 className="text-lg font-bold">نظام النقاط</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Top Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              أفضل الأعضاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {members
                .sort((a, b) => b.points - a.points)
                .slice(0, 3)
                .map((member, index) => (
                  <Card key={member.id} className="bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-primary">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {member.role}
                          </p>
                          <p className="text-2xl font-bold text-primary mt-2">
                            {member.points} نقطة
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Points Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>سجل النقاط</CardTitle>
            <Button onClick={handleAddPoints}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة نقاط
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>اسم العضو</TableHead>
                  <TableHead className="text-center">النقاط</TableHead>
                  <TableHead>السبب</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.memberName}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={transaction.points > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                        {transaction.points > 0 ? "+" : ""}{transaction.points}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* All Members Points */}
        <Card>
          <CardHeader>
            <CardTitle>نقاط جميع الأعضاء</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">الترتيب</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead className="text-center">النقاط</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members
                  .sort((a, b) => b.points - a.points)
                  .map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell className="text-center font-bold">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold text-primary">
                          {member.points}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة نقاط</DialogTitle>
            <DialogDescription>
              قم بإضافة أو خصم نقاط من أحد الأعضاء
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="member">اختر العضو *</Label>
              <select
                id="member"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.memberId}
                onChange={(e) =>
                  setFormData({ ...formData, memberId: e.target.value })
                }
              >
                <option value="">-- اختر عضو --</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="points">النقاط (استخدم - للخصم) *</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: parseInt(e.target.value) || 0 })
                }
                placeholder="50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">السبب *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="إكمال المشروع في الموعد المحدد"
                rows={3}
              />
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

export default ManagePoints;
