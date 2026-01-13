import { useState, useEffect } from "react"; // 1. استيراد الهوكس
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, FolderKanban, Trophy, LogOut, Languages, Settings, Award } from "lucide-react"; // أضفت أيقونة Award
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext"; // 1. Import Hook


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  const isRTL = language === 'ar';
  const { settings } = useSiteSettings();


  // 2. تعريف State لتخزين الإحصائيات بقيم مبدئية 0
  const [stats, setStats] = useState({
    membersCount: 0,
    projectsCount: 0,
    totalPoints: 0,
    awards: 0
  });

  const [loading, setLoading] = useState(true);

  // 3. دالة لجلب البيانات من الـ API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/GetDashboardStatistics");
        const result = await response.json();

        if (result.isSuccess) {
          setStats(result.data);
        } else {
          toast.error("Failed to load statistics");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Network error while fetching statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

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
                {/* <span className="text-xl font-bold text-white">QRT</span> */}
                {settings?.data?.logoImageUrl ? (
                  <img
                    src={settings.data.logoImageUrl}
                    alt="Logo"
                    className="h-10 w-10 object-contain rounded-md"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-racing">
                    <span className="text-xl font-bold text-white">QRT</span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold">{t('admin.title')}</h1>
                <p className="text-xs text-muted-foreground">{settings?.data?.siteName || "Qena Racing Team"}</p>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2">
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

              <div className="h-6 w-px bg-border mx-1 hidden md:block"></div>

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

        {/* 4. Stats Overview - تم التحديث لربط البيانات وتعديل الشبكة لتقبل 4 عناصر */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title={t('admin.stats.members')}
            value={stats.membersCount} // ربط القيمة
            loading={loading}
            icon={<Users className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title={t('admin.stats.projects')}
            value={stats.projectsCount} // ربط القيمة
            loading={loading}
            icon={<FolderKanban className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title={t('admin.stats.points')}
            // استخدام toLocaleString لتنسيق الرقم الكبير (201,021,400)
            value={stats.totalPoints.toLocaleString()}
            loading={loading}
            icon={<Trophy className="h-6 w-6 text-primary" />}
          />
          {/* تمت إضافة كارت الجوائز لأنه موجود في الـ API */}
          <StatsCard
            title={t('admin.stats.awards') || "Awards"}
            value={stats.awards}
            loading={loading}
            icon={<Award className="h-6 w-6 text-primary" />}
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

          <NavCard
            title={t('admin.nav.achievements.title')}
            desc={t('admin.nav.achievements.desc')}
            btnText={t('admin.nav.achievements.btn')}
            icon={<Trophy className="h-5 w-5" />}
            onClick={() => navigate("/admin/achievements")}
          />

          <NavCard
            title={t('admin.nav.generalSettings.title')}
            desc={t('admin.nav.generalSettings.desc')}
            btnText={t('admin.nav.generalSettings.btn')}
            icon={<Settings className="h-5 w-5" />}
            onClick={() => navigate("/admin/generalSettings")}
          />
        </div>
      </main>
    </div>
  );
};

// Helper Components
// قمت بتعديل المكون ليقبل prop للتحميل ورقم بدلاً من نص فقط
const StatsCard = ({ title, value, icon, loading }: { title: string, value: string | number, icon: React.ReactNode, loading?: boolean }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          {loading ? (
            // Skeleton loader بسيط
            <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1"></div>
          ) : (
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const NavCard = ({ title, desc, btnText, icon, onClick }: { title: string, desc: string, btnText: string, icon: React.ReactNode, onClick: () => void }) => (
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