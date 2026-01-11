import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Linkedin, Trophy, Loader2, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext"; // استيراد الكونتكست

// 1. واجهة البيانات
interface MemberDetailsDTO {
  id: number;
  name: string;
  role: string;
  specialization: string;
  bio: string;
  imageUrl: string;
  linkedInUrl?: string;
  points: number;
  year: number;
}

const MemberDetails = () => {
  const { id } = useParams();
  const { t, language } = useLanguage(); // استخدام اللغة والاتجاه
  const dir = language === "ar" ? "rtl" : "ltr";

  const [member, setMember] = useState<MemberDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const response = await fetch(`https://qenaracingteam.runasp.net/Racing/Member/GetMemberDetails/${id}`);
        const json = await response.json();

        if (json.isSuccess) {
          setMember(json.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch member details:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMemberDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" dir={dir}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex flex-col" dir={dir}>
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t('member.not_found')}</h1>
          <Link to="/team">
            <Button>{t('member.back')}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // التحقق من صحة رابط لينكد إن
  const hasLinkedIn = member.linkedInUrl && member.linkedInUrl.length > 5 && member.linkedInUrl !== "string";

  return (
    // ضبط الاتجاه للصفحة بالكامل
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />

      {/* زر العودة */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <Link to="/team">
            <Button variant="ghost" className="hover:bg-primary/100 gap-2">
              {/* عكس السهم بناءً على اللغة */}
              {language === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {t('member.back')}
            </Button>
          </Link>
        </div>
      </section>

      {/* تفاصيل العضو */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* العمود: الصورة وزر لينكد إن */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="relative w-full rounded-2xl shadow-racing object-cover aspect-[4/5]"
                />
                {member.points > 0 && (
                  // استخدام left-4 في LTR و right-4 في RTL (أو استخدام start-4 للتلقائية إذا كان مدعوماً في Tailwind config، هنا نستخدم التخصيص اليدوي)
                  <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} bg-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2`}>
                    <Trophy className="h-4 w-4" />
                    {member.points} {t('member.points')}
                  </div>
                )}
              </div>

              {/* كارت لينكد إن */}
              {hasLinkedIn && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4">{t('member.connect')}</h3>
                    <Button
                      className="w-full gap-2 bg-[#0077b5] hover:bg-[#006097] text-white"
                      size="lg"
                      asChild
                    >
                      <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5" />
                        <span>{t('member.linkedin_btn')}</span>
                        {/* ms-auto لدفع الأيقونة للجهة المقابلة تلقائياً */}
                        <ExternalLink className="h-4 w-4 ms-auto" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* العمود: البيانات النصية */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 leading-tight">
                  {member.name}
                </h1>
                <p className="text-xl text-primary font-bold mb-2">{member.role}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium border">
                    {member.specialization}
                  </span>
                  {member.year > 0 && (
                    <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium border">
                      {t('member.year_prefix')} {member.year}
                    </span>
                  )}
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    {t('member.about_title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {member.bio || t('member.no_bio')}
                  </p>
                </CardContent>
              </Card>

              {member.points > 0 && (
                <Card className="gradient-hero text-white">
                  <CardContent className="p-8 text-center">
                    <Trophy className="h-12 w-12 mx-auto mb-3" />
                    <h3 className="text-4xl font-black mb-1">{member.points}</h3>
                    <p className="text-white/80 font-medium">{t('member.total_points')}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MemberDetails;