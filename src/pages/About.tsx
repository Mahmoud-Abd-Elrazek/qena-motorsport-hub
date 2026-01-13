import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import {
  Eye, Target, Heart, Star, Shield, Zap, Lightbulb,
  Users, Trophy, Flag, CheckCircle, Flame, Award, Loader2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext"; // استيراد الكونتكست

// 1. Define Interface based on your API Response
interface Achievement {
  id: number;
  description: string;
  year: number;
}

const About = () => {
  const { t, language } = useLanguage(); // استخدام اللغة والاتجاه
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const { settings } = useSiteSettings();

  // State for Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);

  const ICON_MAP: Record<string, any> = {
    "Eye": Eye, "Target": Target, "Heart": Heart, "Star": Star,
    "Shield": Shield, "Zap": Zap, "Lightbulb": Lightbulb, "Users": Users,
    "Trophy": Trophy, "Flag": Flag, "Flame": Flame, "Check": CheckCircle,
    "Award": Award
  };

  // تأكد من وجود قيمة افتراضية للمصفوفة لتجنب الأخطاء
  const cards = settings?.data?.identityCards || [];

  const getIcon = (name: string) => {
    const IconComp = ICON_MAP[name] || Star;
    return <IconComp className="h-8 w-8 text-primary" />;
  };

  // 2. Fetch Achievements Data
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch("https://qenaracingteam.runasp.net/Racing/Achievements/GetAll");
        const json = await response.json();
        
        if (json.isSuccess && json.data) {
          setAchievements(json.data);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoadingAchievements(false);
      }
    };

    fetchAchievements();
  }, []);

  return (
    // استخدام dir لضبط الاتجاه تلقائياً
    <div className="min-h-screen" dir={dir}>
      <Header />

      {/* Hero Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            {t('about.page.hero.title')}
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-start">
                {t('about.story.title')}
              </h2>
              {/* استخدام text-start لمحاذاة النص الطويل حسب اللغة */}
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed text-start whitespace-pre-line">
                <p>{settings?.data?.ourStory || t('about.story.fallback')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values (Identity Cards) */}
      {/* يتم عرض هذه البطاقات بناءً على البيانات القادمة من السيرفر (settings) */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {cards.map((card: any, index: number) => (
              <Card key={index} className="group hover:shadow-racing transition-smooth border-t-4 border-t-transparent hover:border-t-primary">
                <CardContent className="p-8 space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-smooth">
                      {getIcon(card.iconName)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground text-center">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-center whitespace-pre-line">
                    {card.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              {t('about.achievements.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.achievements.subtitle')}
            </p>
          </div>

          {/* 3. Handle Loading and Data Mapping */}
          {loadingAchievements ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <span className="mx-2">{t('achievements.loading')}</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {achievements
                // Sort by year descending (newest first)
                .sort((a, b) => b.year - a.year) 
                .map((item) => (
                  <Card key={item.id} className="group hover:shadow-racing transition-smooth">
                    {/* text-start يضمن أن اتجاه النص داخل الكارت صحيح */}
                    <CardContent className="p-6 flex items-start gap-4 text-start">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <p className="text-primary font-bold mb-1">{item.year}</p>
                        <p className="text-foreground">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          )}
          
          {/* Empty State Fallback */}
          {!loadingAchievements && achievements.length === 0 && (
             <p className="text-center text-muted-foreground">{t('achievements.empty')}</p>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;