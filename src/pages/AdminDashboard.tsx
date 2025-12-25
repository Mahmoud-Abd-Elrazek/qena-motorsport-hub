import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, FolderKanban, Trophy, LogOut, Languages } from "lucide-react"; // 1. استيراد الأيقونة
import { useLanguage } from "@/contexts/LanguageContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  // 2. استدعاء toggleLanguage
  const { t, language, toggleLanguage } = useLanguage(); 
  const isRTL = language === 'ar';

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success(t('admin.logout.success'));
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-muted/30" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl font-bold text-white">QRT</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">{t('admin.title')}</h1>
                <p className="text-xs text-muted-foreground">{t('admin.subtitle')}</p>
              </div>
            </div>

            {/* Actions Section (Language + Logout) */}
            <div className="flex items-center gap-2">
              {/* 3. زر تغيير اللغة */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleLanguage}
                title={isRTL ? "Switch to English" : "التحويل للعربية"}
                className="hover:bg-primary/100"
              >
                <Languages className="h-5 w-5" />
                <span className="sr-only">تغيير اللغة</span>
              </Button>

              <div className="h-6 w-px bg-border mx-1 hidden md:block"></div> {/* فاصل بسيط اختياري */}

              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">{t('admin.logout')}</span>
              </Button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* ... (باقي محتوى الصفحة كما هو) ... */}
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title={t('admin.stats.members')} 
            value="25" 
            icon={<Users className="h-6 w-6 text-primary" />} 
          />
          <StatsCard 
            title={t('admin.stats.projects')} 
            value="15" 
            icon={<FolderKanban className="h-6 w-6 text-primary" />} 
          />
          <StatsCard 
            title={t('admin.stats.points')} 
            value="2,310" 
            icon={<Trophy className="h-6 w-6 text-primary" />} 
          />
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavCard 
            title={t('admin.nav.members.title')} 
            desc={t('admin.nav.members.desc')}
            btnText={t('admin.nav.members.btn')}
            icon={<Users className="h-5 w-5" />} 
            onClick={() => navigate("/admin/members")} 
          />
          <NavCard 
            title={t('admin.nav.projects.title')} 
            desc={t('admin.nav.projects.desc')}
            btnText={t('admin.nav.projects.btn')}
            icon={<FolderKanban className="h-5 w-5" />} 
            onClick={() => navigate("/admin/projects")} 
          />
          <NavCard 
            title={t('admin.nav.points.title')} 
            desc={t('admin.nav.points.desc')}
            btnText={t('admin.nav.points.btn')}
            icon={<Trophy className="h-5 w-5" />} 
            onClick={() => navigate("/admin/points")} 
          />
        </div>
      </main>
    </div>
  );
};

// ... Helper Components (كما هي) ...
const StatsCard = ({ title, value, icon }: {title: string, value: string, icon: React.ReactNode}) => (
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

const NavCard = ({ title, desc, btnText, icon, onClick }: {title: string, desc: string, btnText: string, icon: React.ReactNode, onClick: () => void}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground min-h-[40px]">{desc}</p>
      <Button className="w-full" onClick={onClick}>
        {btnText}
      </Button>
    </CardContent>
  </Card>
);

export default AdminDashboard;