import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Zap, Target, Trophy, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { projects, sponsors } from "@/data/mockData";
import heroImage from "@/assets/hero-racing.jpg";
import workshopImage from "@/assets/team-workshop.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Qena Racing Team"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-right-10 duration-1000">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              فريق سباقات قنا
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              نحن فريق رياضي متميز نسعى للتميز والابتكار في عالم السباقات والهندسة الميكانيكية
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about">
                <Button size="lg" className="gradient-hero shadow-racing text-lg">
                  اكتشف المزيد
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 text-lg">
                  شاهد المشاريع
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-primary">25+</h3>
              <p className="text-muted-foreground">عضو نشط</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-primary">15+</h3>
              <p className="text-muted-foreground">مشروع مكتمل</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-primary">5</h3>
              <p className="text-muted-foreground">سنوات خبرة</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-primary">10+</h3>
              <p className="text-muted-foreground">جائزة وإنجاز</p>
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
                <p className="text-primary font-bold mb-2">من نحن</p>
                <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                  فريق متميز في عالم السباقات
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نحن فريق من المهندسين والمبتكرين الشغوفين بعالم السباقات والهندسة الميكانيكية. نسعى لتصميم وتطوير سيارات سباق متطورة تجمع بين الأداء العالي والكفاءة.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                رؤيتنا هي أن نصبح فريقاً رائداً في مجال السباقات على المستوى الإقليمي والدولي، من خلال الابتكار المستمر والعمل الجماعي المتميز.
              </p>
              <Link to="/about">
                <Button size="lg" className="gradient-hero shadow-racing">
                  اقرأ المزيد عنا
                  <ArrowLeft className="mr-2 h-5 w-5" />
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
            <p className="text-primary font-bold mb-2">المشاريع</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-4">
              أحدث مشاريعنا
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              استكشف أحدث المشاريع والابتكارات التي قام بها فريقنا
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/projects">
              <Button size="lg" variant="outline">
                عرض جميع المشاريع
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-bold mb-2">شركاؤنا</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
              شركاء النجاح
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
            هل أنت مستعد للانضمام لفريقنا؟
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            نحن نبحث دائماً عن مواهب جديدة ومتحمسة للانضمام إلى فريقنا
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="text-lg">
              تواصل معنا الآن
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
