import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Facebook, Instagram, Twitter, Linkedin, Trophy } from "lucide-react";
import { teamMembers } from "@/data/mockData";

const MemberDetails = () => {
  const { id } = useParams();
  const member = teamMembers.find((m) => m.id === id);

  if (!member) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">العضو غير موجود</h1>
          <Link to="/team">
            <Button>العودة لصفحة الفريق</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Back Button */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <Link to="/team">
            <Button variant="ghost">
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة لصفحة الفريق
            </Button>
          </Link>
        </div>
      </section>

      {/* Member Details */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image & Basic Info */}
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full rounded-2xl shadow-racing"
                />
                {member.points !== undefined && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    <Trophy className="h-4 w-4 inline ml-2" />
                    {member.points} نقطة
                  </div>
                )}
              </div>

              {/* Social Links */}
              {member.socials && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4">تواصل معي</h3>
                    <div className="flex gap-3">
                      {member.socials.facebook && (
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={member.socials.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Facebook className="h-5 w-5" />
                          </a>
                        </Button>
                      )}
                      {member.socials.instagram && (
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={member.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Instagram className="h-5 w-5" />
                          </a>
                        </Button>
                      )}
                      {member.socials.twitter && (
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={member.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Twitter className="h-5 w-5" />
                          </a>
                        </Button>
                      )}
                      {member.socials.linkedin && (
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={member.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3">
                  {member.name}
                </h1>
                <p className="text-xl text-primary font-bold mb-2">{member.role}</p>
                <p className="text-muted-foreground">{member.specialty}</p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-3">نبذة عني</h3>
                  <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">المهارات والخبرات</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-foreground">التصميم الهندسي</span>
                        <span className="text-sm text-muted-foreground">90%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "90%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-foreground">العمل الجماعي</span>
                        <span className="text-sm text-muted-foreground">95%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "95%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-foreground">حل المشكلات</span>
                        <span className="text-sm text-muted-foreground">85%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {member.points !== undefined && (
                <Card className="gradient-hero text-white">
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-12 w-12 mx-auto mb-3" />
                    <h3 className="text-3xl font-black mb-1">{member.points}</h3>
                    <p className="text-white/80">إجمالي النقاط المكتسبة</p>
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
