import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Zap, Target, Trophy, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import heroImage from "@/assets/hero-racing.jpg";
import workshopImage from "@/assets/team-workshop.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

// --- تعريف أنواع البيانات ---
interface ProjectDTO {
  id: number;
  name: string;
  projectCategory: string;
  year: string;
  description: string | null;
  imageUrl: string | null;
  status: number;
}

interface ProjectsResponse {
  data: {
    data: ProjectDTO[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

// 1. تعريف واجهة لنوع بيانات الإحصائيات
interface DashboardStats {
  membersCount: number;
  projectsCount: number;
  totalPoints: number;
  awards: number;
}

const Index = () => {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();
  const isRTL = language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [latestProjects, setLatestProjects] = useState<ProjectDTO[]>([]);
  
  // 2. State لتخزين الإحصائيات مع قيم مبدئية 0
  const [stats, setStats] = useState<DashboardStats>({
    membersCount: 0,
    projectsCount: 0,
    totalPoints: 0,
    awards: 0
  });

  useEffect(() => {
    // دالة جلب المشاريع (موجودة سابقاً)
    const fetchLatestProjects = async () => {
      try {
        const response = await fetch("https://qenaracingteam.runasp.net/Racing/Project/GetProjectsWithCursor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cursor: null,
            yearFilter: null,
            category: null,
            pageSize: 3
          }),
        });
        const json: ProjectsResponse = await response.json();
        if (json.data && json.data.data) {
          setLatestProjects(json.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch home projects", error);
      }
    };

    // 3. دالة جلب الإحصائيات (الجديدة)
    const fetchStats = async () => {
      try {
        const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/GetDashboardStatistics");
        const json = await response.json();
        
        if (json.isSuccess) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchLatestProjects();
    fetchStats(); // استدعاء الدالة
  }, []);

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={settings?.data?.heroImageUrl || heroImage}
            alt={settings?.data?.siteName || "Racing Team image"}
            className="h-full w-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${isRTL ? 'from-black/80 via-black/50 to-transparent' : 'from-black/80 via-black/50 to-transparent'}`} />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className={`max-w-2xl space-y-6 animate-in fade-in duration-1000 ${isRTL ? 'slide-in-from-right-10' : 'slide-in-from-left-10'}`}>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              {settings?.data?.heroTitle || t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {settings?.data?.heroSubtitle || t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about">
                <Button size="lg" className="gradient-hero shadow-racing text-lg gap-2">
                  {t('hero.discover')}
                  <ArrowIcon className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 text-lg">
                  {t('hero.projects')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - تم التحديث لعرض البيانات الحقيقية */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Members Count */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              {/* عرض رقم الأعضاء من الـ API */}
              <h3 className="text-4xl font-bold text-primary">{stats.membersCount}</h3>
              <p className="text-muted-foreground">{t('stats.members')}</p>
            </div>

            {/* Projects Count */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FolderKanbanIcon className="h-8 w-8 text-primary" /> {/* يمكنك استخدام Trophy أو FolderKanban */}
                </div>
              </div>
              {/* عرض رقم المشاريع من الـ API */}
              <h3 className="text-4xl font-bold text-primary">{stats.projectsCount}</h3>
              <p className="text-muted-foreground">{t('stats.projects')}</p>
            </div>

            {/* Total Points (بدلاً من Years لأن الـ API يعيد النقاط) */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </div>
              {/* عرض النقاط بتنسيق مريح للقراءة */}
              <h3 className="text-4xl font-bold text-primary">
                 {stats.totalPoints > 1000 ? (stats.totalPoints / 1000).toFixed(1) + 'k' : stats.totalPoints}
              </h3>
              {/* تأكد من وجود ترجمة للنقاط أو استخدم نص ثابت */}
              <p className="text-muted-foreground">{t('admin.stats.points') || "Total Points"}</p>
            </div>

            {/* Awards Count */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              {/* عرض الجوائز من الـ API */}
              <h3 className="text-4xl font-bold text-primary">{stats.awards}</h3>
              <p className="text-muted-foreground">{t('stats.awards')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* باقي الأقسام كما هي... */}
      <section className="py-20">
         {/* ... (About Section) ... */}
         {/* ... (Projects Section) ... */}
         {/* ... (CTA Section) ... */}
         {/* ... (Footer) ... */}
         {/* سأختصر الكود هنا لعدم التكرار، باقي الكود يبقى كما هو تماماً */}
         <div className="container mx-auto px-4">
             {/* ... محتوى About Preview ... */}
             <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div>
                        <p className="text-primary font-bold mb-2">{settings?.data?.homeSectionTitle || t('about.title')}</p>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                        {settings?.data?.homeSectionContent || t('about.desc1')}
                    </p>
                     {!settings?.data?.homeSectionContent && (
                        <p className="text-lg text-muted-foreground leading-relaxed">
                           {t('about.desc2')}
                        </p>
                     )}
                    <Link to="/about">
                        <Button size="lg" className="gradient-hero shadow-racing gap-2">
                            {t('about.readMore')}
                            <ArrowIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
                <div className="relative">
                    <img src={settings?.data?.aboutImageUrl || workshopImage} alt="Team Workshop" className="rounded-2xl shadow-racing w-full h-[400px] object-cover" />
                </div>
             </div>
         </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-bold mb-2">{t('projects.tag')}</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-4">
              {t('projects.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestProjects.length > 0 ? (
              latestProjects.map((project) => {
                const displayYear = new Date(project.year).getFullYear();
                return (
                  <ProjectCard 
                    key={project.id} 
                    id={String(project.id)}
                    title={project.name}
                    description={project.description || t('projects.card.no_desc')}
                    image={project.imageUrl || "/placeholder-image.jpg"}
                    year={displayYear}
                    category={project.projectCategory}
                  />
                );
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                <p>{t('projects.status.no_results')}</p> 
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/projects">
              <Button size="lg" variant="outline" className="gap-2">
                {t('projects.viewAll')}
                <ArrowIcon className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{t('cta.subtitle')}</p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="text-lg gap-2">
              {t('cta.contact')}
              <ArrowIcon className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function FolderKanbanIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      </svg>
    )
  }

export default Index;