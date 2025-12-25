import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, FolderKanban, Trophy, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/login");
  };

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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="الأعضاء" value="25" icon={<Users className="h-6 w-6 text-primary" />} />
          <StatsCard title="المشاريع" value="15" icon={<FolderKanban className="h-6 w-6 text-primary" />} />
          <StatsCard title="النقاط الكلية" value="2,310" icon={<Trophy className="h-6 w-6 text-primary" />} />
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavCard 
            title="إدارة الأعضاء" 
            desc="إضافة، تعديل، أو حذف أعضاء الفريق وإدارة معلوماتهم" 
            icon={<Users className="h-5 w-5" />} 
            onClick={() => navigate("/admin/members")} 
          />
          <NavCard 
            title="إدارة المشاريع" 
            desc="إضافة مشاريع جديدة وتحديث تفاصيل المشاريع الحالية" 
            icon={<FolderKanban className="h-5 w-5" />} 
            onClick={() => navigate("/admin/projects")} 
          />
          <NavCard 
            title="نظام النقاط" 
            desc="إضافة أو تعديل نقاط الأعضاء بناءً على أدائهم الأسبوعي" 
            icon={<Trophy className="h-5 w-5" />} 
            onClick={() => navigate("/admin/points")} 
          />
        </div>
      </main>
    </div>
  );
};

// مكونات صغيرة للتنظيم (Optional Helper Components)
const StatsCard = ({ title, value, icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const NavCard = ({ title, desc, icon, onClick }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">{desc}</p>
      <Button className="w-full" onClick={onClick}>
        {title}
      </Button>
    </CardContent>
  </Card>
);

export default AdminDashboard;