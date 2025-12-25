import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// قمنا باستيراد ArrowRight لدعم اللغة الإنجليزية
import { ArrowLeft, ArrowRight, Zap, Target, Trophy, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { projects, sponsors } from "@/data/mockData";
import heroImage from "@/assets/hero-racing.jpg";
import workshopImage from "@/assets/team-workshop.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t, language } = useLanguage();
  
  // متغير لتحديد ما إذا كانت اللغة عربية
  const isRTL = language === 'ar';

  // تحديد أيقونة السهم بناءً على اللغة
  // في العربية نستخدم السهم لليسار (للأمام)، وفي الإنجليزية لليمين
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Qena Racing Team"
            className="h-full w-full object-cover"
          />
          {/* تعديل التدرج اللوني ليتناسب مع الاتجاه */}
          <div className={`absolute inset-0 bg-gradient-to-r ${isRTL ? 'from-black/80 via-black/50 to-transparent' : 'from-black/80 via-black/50 to-transparent'}`} />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          {/* تعديل الأنيميشن:
            في العربية (RTL): slide-in-from-right منطقي (يأتي من "الخلف" للأمام)
            أو يمكنك عكسه بـ slide-in-from-left إذا أردت أن يدخل من بداية السطر
            هنا جعلناها ديناميكية لتدخل دائماً من جهة بداية النص
          */}
          <div className={`max-w-2xl space-y-6 animate-in fade-in duration-1000 ${isRTL ? 'slide-in-from-right-10' : 'slide-in-from-left-10'}`}>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about">
                <Button size="lg" className="gradient-hero shadow-racing text-lg gap-2">
                  {t('hero.discover')}
                  {/* استخدام ms-2 بدلاً من mr-2 لضبط المسافة تلقائياً */}
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

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          {/* الاتجاه RTL سيقوم بقلب الـ Grid تلقائياً */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-primary">25+</h3>
              <p className="text-muted-foreground">{t('stats.members')}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-primary">15+</h3>
              <p className="text-muted-foreground">{t('stats.projects')}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-primary">5</h3>
              <p className="text-muted-foreground">{t('stats.years')}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-primary">10+</h3>
              <p className="text-muted-foreground">{t('stats.awards')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <p className="text-primary font-bold mb-2">{t('about.tag')}</p>
                <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                  {t('about.title')}
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.desc1')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.desc2')}
              </p>
              <Link to="/about">
                <Button size="lg" className="gradient-hero shadow-racing gap-2">
                  {t('about.readMore')}
                  <ArrowIcon className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={workshopImage}
                alt="Team Workshop"
                className="rounded-2xl shadow-racing w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
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
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
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

      {/* Sponsors Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-bold mb-2">{t('sponsors.tag')}</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
              {t('sponsors.title')}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {sponsors.map((sponsor) => (
              <Card key={sponsor.id} className="group hover:shadow-card transition-smooth">
                <CardContent className="p-8 flex items-center justify-center h-32">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-smooth"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
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

export default Index;