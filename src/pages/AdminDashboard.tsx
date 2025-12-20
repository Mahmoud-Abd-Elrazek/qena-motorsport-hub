import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, FolderKanban, Trophy, Mail, LogOut, Shield } from "lucide-react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Authentication/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } else {
          toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
        }
        return;
      }

      const data = await response.json();
      console.log("data: ", data)
      const token = data.data;
      if (token) {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        toast.success("تم تسجيل الدخول بنجاح");

        navigate("/admin");
      } else {
        toast.error("لم يتم العثور على بيانات صالحة في الاستجابة");
      }
    } catch (error) {
      toast.error("تعذر الاتصال بالسيرفر");
    }
  };

  // ========================== Todo ==========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      toast.error("انتهت صلاحية الجلسة");
      navigate("/admin");
    } else {
      setIsAuthenticated(true);
    }
  }, []);
  // ========================== Todo ==========================

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    localStorage.removeItem("token");
    toast.success("تم تسجيل الخروج بنجاح");
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">لوحة التحكم</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                تسجيل الدخول للمسؤولين فقط
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">البريد الإلكتروني</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@example.com"
                  dir="ltr"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full gradient-hero">
                تسجيل الدخول
              </Button>
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate("/")}
                  className="text-sm"
                >
                  العودة للصفحة الرئيسية
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl font-bold text-white">QRT</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">لوحة التحكم</h1>
                <p className="text-xs text-muted-foreground">Qena Racing Team</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="ml-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الأعضاء</p>
                  <h3 className="text-3xl font-bold text-foreground">25</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">المشاريع</p>
                  <h3 className="text-3xl font-bold text-foreground">15</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">النقاط الكلية</p>
                  <h3 className="text-3xl font-bold text-foreground">2,310</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الرسائل</p>
                  <h3 className="text-3xl font-bold text-foreground">12</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                إدارة الأعضاء
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                إضافة، تعديل، أو حذف أعضاء الفريق وإدارة معلوماتهم
              </p>
              <Button className="w-full" onClick={() => navigate("/admin/members")}>
                إدارة الأعضاء
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                إدارة المشاريع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                إضافة مشاريع جديدة وتحديث تفاصيل المشاريع الحالية
              </p>
              <Button className="w-full" onClick={() => navigate("/admin/projects")}>
                إدارة المشاريع
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                نظام النقاط
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                إضافة أو تعديل نقاط الأعضاء بناءً على أدائهم الأسبوعي
              </p>
              <Button className="w-full" onClick={() => navigate("/admin/points")}>
                إدارة النقاط
              </Button>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                الرسائل الواردة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                عرض والرد على الرسائل الواردة من صفحة اتصل بنا
              </p>
              <Button className="w-full" onClick={() => navigate("/admin/messages")}>
                عرض الرسائل
              </Button>
            </CardContent>
          </Card> */}
        </div>

        {/* Demo Note */}
        <Card className="mt-8 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <h3 className="font-bold text-foreground mb-2">ملاحظة مهمة للتطوير</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              هذه النسخة التجريبية من لوحة التحكم. للحصول على نظام إدارة كامل مع backend API، يمكنك:
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
