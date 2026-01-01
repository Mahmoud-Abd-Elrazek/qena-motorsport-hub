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
import { ArrowLeft, ArrowRight, Plus, Trophy, Loader2, TrendingDown, TrendingUp, Trash2, AlertTriangle, Medal, Award } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext"; // استيراد الكونتكست

// Interfaces
interface Member {
  memberId: number;
  memberName: string;
  role: string | null;
  points: number;
  image: string;
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
  const { t, language } = useLanguage(); // استخدام اللغة
  const dir = language === 'ar' ? 'rtl' : 'ltr';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSingleDeleteDialogOpen, setIsSingleDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const fetchMembers = async () => {
    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/GetAllMemberPoinsts");
      const result = await response.json();
      if (result.isSuccess) setMembers(result.data);
    } catch (error) {
      toast.error(t('points.toast.fetch_error'));
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
        toast.success(t('points.toast.delete_success'));
        setHistory(history.filter(t => t.pointHistoryId !== idToDelete));
        fetchMembers();
      } else {
        toast.error(`${t('points.toast.delete_fail')}: ${result.message}`);
      }
    } catch (error) {
      toast.error(t('login.error.network')); // إعادة استخدام رسالة خطأ الشبكة
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
        toast.success(t('points.toast.clear_success'));
      }
    } catch (error) {
      toast.error(t('points.toast.delete_fail'));
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSave = async () => {
    if (!formData.memberId || formData.points === 0 || !formData.reason) {
      toast.error(t('form.required'));
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
        toast.success(t('points.toast.update_success'));
        await Promise.all([fetchMembers(), fetchHistory()]);
        setIsDialogOpen(false);
        setFormData({ memberId: "", points: 0, reason: "" });
      }
    } catch (error) {
      toast.error(t('login.error.network'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500 to-yellow-600";
    if (index === 1) return "bg-gradient-to-r from-gray-400 to-gray-500";
    if (index === 2) return "bg-gradient-to-r from-orange-500 to-orange-600";
    return "bg-muted";
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ms-2 font-bold">{t('points.loading')}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30" dir={dir}>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2">
              {language === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {t('manage.members.back')}
            </Button>
            <h1 className="text-lg font-bold">{t('points.title')}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Top Members Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> {t('points.top_members')}
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
                        <div className="relative">
                          <img
                            src={member.image}
                            alt={member.memberName}
                            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary"
                          />
                          <div
                            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${getRankBadge(
                              index
                            )} text-white px-3 py-1 rounded-full text-sm font-bold`}
                          >
                            #{index + 1}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold">{member.memberName}</h3>
                          <p className="text-sm text-muted-foreground">{member.role || t('points.no_role')}</p>
                          <p className="text-2xl font-bold text-primary mt-2">{member.points} {t('points.unit')}</p>
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
            <CardTitle>{t('points.history.title')}</CardTitle>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="ms-2 h-4 w-4" /> {t('points.history.add')}
            </Button>
          </CardHeader>
          <CardContent>
            {history.length > 0 && (
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive hover:bg-destructive/100 gap-2"
                >
                  <Trash2 className="h-4 w-4" /> {t('points.history.clear_all')}
                </Button>
              </div>
            )}
            <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* استخدام text-start لضبط المحاذاة */}
                    <TableHead className="text-start">{t('points.history.date')}</TableHead>
                    <TableHead className="text-start">{t('table.member')}</TableHead>
                    <TableHead className="text-center">{t('table.points')}</TableHead>
                    <TableHead className="text-start">{t('points.history.reason')}</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isHistoryLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-4"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                  ) : history.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10">{t('points.history.no_data')}</TableCell></TableRow>
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
                            className="h-8 w-8 hover:bg-destructive/100 text-muted-foreground"
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
          <CardHeader><CardTitle>{t('points.list.title')}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">{t('points.list.rank')}</TableHead>
                  <TableHead className="text-start">{t('table.member')}</TableHead>
                  <TableHead className="text-start">{t('table.role')}</TableHead>
                  <TableHead className="text-center">{t('table.points')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.sort((a, b) => b.points - a.points).map((m, i) => (
                  <TableRow key={m.memberId}>
                    <TableCell className="text-center font-medium">{i + 1}</TableCell>
                    <TableCell className="font-medium">{m.memberName}</TableCell>
                    <TableCell><span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">{m.role || t('table.role.default')}</span></TableCell>
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
          <DialogHeader><DialogTitle>{t('points.dialog.add_title')}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <MemberSelect members={members} formData={formData} setFormData={setFormData} fetchMembers={fetchMembers} />
            <div className="grid gap-2">
              <Label>{t('points.dialog.points_label')}</Label>
              <Input type="number" onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="grid gap-2">
              <Label>{t('points.dialog.reason_label')}</Label>
              <Textarea onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('btn.cancel')}</Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : t('points.dialog.btn_save')}
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
              <DialogTitle className="text-center">{t('points.dialog.delete_single_title')}</DialogTitle>
              <DialogDescription className="text-center">
                {t('points.dialog.delete_single_desc')}<br />
                <span className="text-xs text-destructive">{t('points.dialog.delete_single_note')}</span>
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button variant="ghost" onClick={() => setIsSingleDeleteDialogOpen(false)} disabled={isSubmitting}>{t('btn.cancel')}</Button>
            <Button variant="destructive" onClick={handleSingleDelete} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('points.dialog.btn_delete')}
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
              <DialogTitle className="text-center">{t('points.dialog.delete_all_title')}</DialogTitle>
              <DialogDescription className="text-center">{t('points.dialog.delete_all_desc')}</DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>{t('btn.cancel')}</Button>
            <Button variant="destructive" onClick={clearAllTransactions} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('points.dialog.btn_delete_all')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePoints;