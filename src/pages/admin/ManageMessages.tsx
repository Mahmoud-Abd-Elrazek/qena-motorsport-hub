import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Mail, Eye, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  status: "new" | "read" | "replied";
}

const ManageMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      name: "محمد أحمد السيد",
      email: "mohamed@example.com",
      phone: "01012345678",
      subject: "استفسار عن الانضمام للفريق",
      message:
        "السلام عليكم، أنا طالب في كلية الهندسة وأرغب في الانضمام إلى فريق قنا للسباق. لدي خبرة في البرمجة والتصميم ثلاثي الأبعاد. كيف يمكنني التقديم؟",
      date: "2024-01-15 10:30 AM",
      status: "new",
    },
    {
      id: "2",
      name: "سارة حسن محمود",
      email: "sarah@example.com",
      phone: "01123456789",
      subject: "طلب رعاية للفريق",
      message:
        "نحن شركة متخصصة في قطع غيار السيارات ونود التواصل معكم لمناقشة فرصة رعاية الفريق. نرى أن لديكم مشاريع مميزة ونود المساهمة في دعمكم.",
      date: "2024-01-14 03:15 PM",
      status: "read",
    },
    {
      id: "3",
      name: "أحمد عبدالله إبراهيم",
      email: "ahmed.abdullah@example.com",
      subject: "تقديم اقتراح لمشروع جديد",
      message:
        "لدي فكرة لمشروع جديد يتعلق بتطوير نظام تبريد متطور للمحرك. أود مشاركتها معكم ومناقشة إمكانية تنفيذها ضمن مشاريع الفريق.",
      date: "2024-01-13 08:45 AM",
      status: "replied",
    },
    {
      id: "4",
      name: "فاطمة عمر حسين",
      email: "fatma@example.com",
      phone: "01234567890",
      subject: "دعوة للمشاركة في معرض",
      message:
        "نحن ننظم معرض للهندسة والتكنولوجيا الشهر القادم ونود دعوة فريقكم للمشاركة وعرض مشاريعكم. سيكون حدث كبير مع حضور العديد من الجهات المهتمة.",
      date: "2024-01-12 02:20 PM",
      status: "new",
    },
    {
      id: "5",
      name: "خالد محمد علي",
      email: "khaled@example.com",
      subject: "استفسار عن تفاصيل مشروع QR-1",
      message:
        "مرحبا، أنا صحفي أعمل في مجلة متخصصة في السيارات. قرأت عن مشروع سيارة السباق QR-1 وأود إجراء مقابلة مع الفريق ونشر تقرير عن المشروع.",
      date: "2024-01-11 11:00 AM",
      status: "read",
    },
  ]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    if (message.status === "new") {
      setMessages(
        messages.map((m) =>
          m.id === message.id ? { ...m, status: "read" as const } : m
        )
      );
    }
  };

  const handleDelete = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    toast.success("تم حذف الرسالة بنجاح");
  };

  const handleMarkAsReplied = (id: string) => {
    setMessages(
      messages.map((m) =>
        m.id === id ? { ...m, status: "replied" as const } : m
      )
    );
    toast.success("تم تحديث حالة الرسالة");
  };

  const getStatusBadge = (status: Message["status"]) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">رسالة جديدة</Badge>
        );
      case "read":
        return <Badge variant="secondary">مقروءة</Badge>;
      case "replied":
        return <Badge className="bg-blue-500 hover:bg-blue-600">تم الرد</Badge>;
    }
  };

  const newMessagesCount = messages.filter((m) => m.status === "new").length;

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
            <h1 className="text-lg font-bold">الرسائل الواردة</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              جميع الرسائل
              {newMessagesCount > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600">
                  {newMessagesCount} جديدة
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الموضوع</TableHead>
                  <TableHead className="text-center">الحالة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {message.date}
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {message.subject}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(message.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {message.status !== "replied" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsReplied(message.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(message.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>تفاصيل الرسالة</span>
              {selectedMessage && getStatusBadge(selectedMessage.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedMessage?.date}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    الاسم
                  </h4>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    البريد الإلكتروني
                  </h4>
                  <p className="font-medium" dir="ltr">
                    {selectedMessage.email}
                  </p>
                </div>
              </div>
              {selectedMessage.phone && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    رقم الهاتف
                  </h4>
                  <p className="font-medium" dir="ltr">
                    {selectedMessage.phone}
                  </p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  الموضوع
                </h4>
                <p className="font-medium">{selectedMessage.subject}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  الرسالة
                </h4>
                <p className="text-sm leading-relaxed bg-muted p-4 rounded-lg">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                  }}
                >
                  <Mail className="ml-2 h-4 w-4" />
                  الرد عبر البريد
                </Button>
                {selectedMessage.status !== "replied" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleMarkAsReplied(selectedMessage.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                    تحديد كـ"تم الرد"
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageMessages;
