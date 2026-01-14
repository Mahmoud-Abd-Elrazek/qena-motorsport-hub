import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom"; // 1. استيراد useNavigate

// Interfaces
interface Member {
  memberId: number;
  memberName: string;
  role: string | null;
  points: number;
  image: string;
}

const Leaderboard = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  // 2. تعريف المتغير navigate
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/GetAllMemberPoinsts");
      const result = await response.json();
      if (result.isSuccess) setMembers(result.data);
    } catch (error) {
      toast.error(t('leaderboard.toast.error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMemberClick = (memberId: number) => {
    navigate(`/team/${memberId}`);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-8 w-8 text-yellow-500" />;
    if (index === 1) return <Medal className="h-8 w-8 text-gray-400" />;
    if (index === 2) return <Award className="h-8 w-8 text-orange-600" />;
    return null;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500 to-yellow-600";
    if (index === 1) return "bg-gradient-to-r from-gray-400 to-gray-500";
    if (index === 2) return "bg-gradient-to-r from-orange-500 to-orange-600";
    return "bg-muted";
  };

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <Trophy className="h-16 w-16 text-white mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">{t('leaderboard.hero.title')}</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('leaderboard.hero.desc')}
          </p>
        </div>
      </section>

      {/* Top 3 Podium */}
      <section className="py-12 -mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {members.slice(0, 3).map((member, index) => (
              <Card
                key={member.memberId}
                // إضافة حدث الضغط وتغيير شكل المؤشر
                onClick={() => handleMemberClick(member.memberId)}
                className={`${index === 0 ? "md:order-2 md:scale-110" : index === 1 ? "md:order-1" : "md:order-3"
                  } shadow-racing cursor-pointer transition-transform hover:-translate-y-2`}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">{getRankIcon(index)}</div>
                  <div className="relative">
                    <img
                      src={member.image}
                      alt={member.memberName}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary"
                    />
                    <div
                      className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${getRankBadge(
                        index
                      )} text-white px-3 py-1 rounded-full text-sm font-bold`}
                    >
                      #{index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{member.memberName}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-3xl font-black text-primary">{member.points}</p>
                    <p className="text-xs text-muted-foreground">{t('leaderboard.points')}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Full Leaderboard */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t('leaderboard.full_ranking')}</h2>
          <div className="space-y-3">
            {members.map((member, index) => (
              <Card
                key={member.memberId}
                // إضافة حدث الضغط هنا أيضاً
                onClick={() => handleMemberClick(member.memberId)}
                className="hover:shadow-card transition-smooth cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 text-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                    </div>
                    <img
                      src={member.image}
                      alt={member.memberName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{member.memberName}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    {/* استخدام text-end لضبط المحاذاة في اللغتين */}
                    <div className="text-end">
                      <p className="text-2xl font-bold text-primary">{member.points}</p>
                      <p className="text-xs text-muted-foreground">{t('leaderboard.points')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      {/* <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">{t('leaderboard.info.title')}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{t('leaderboard.rules.1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{t('leaderboard.rules.2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{t('leaderboard.rules.3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{t('leaderboard.rules.4')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{t('leaderboard.rules.5')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section> */}

      <Footer />
    </div>
  );
};

export default Leaderboard;