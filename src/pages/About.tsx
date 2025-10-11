import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">من نحن</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            فريق سباقات قنا - رحلة من الشغف إلى التميز في عالم السباقات
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">قصتنا</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  بدأت قصة فريق سباقات قنا في عام 2019، عندما التقى مجموعة من المهندسين والطلاب
                  الشغوفين بعالم السباقات والهندسة الميكانيكية. كان الحلم بسيطاً: تصميم وتصنيع سيارة
                  سباق تنافسية بأيدٍ مصرية.
                </p>
                <p>
                  على مدار السنوات، نما الفريق من 5 أعضاء إلى أكثر من 25 عضواً نشطاً، وتطورت
                  مشاريعنا من تصميمات بسيطة إلى سيارات سباق متطورة تنافس على المستوى الإقليمي.
                </p>
                <p>
                  اليوم، نفخر بأننا أصبحنا واحداً من أبرز فرق السباقات الجامعية في مصر، مع سجل حافل
                  بالإنجازات والجوائز.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Vision */}
            <Card className="group hover:shadow-racing transition-smooth">
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground text-center">رؤيتنا</h3>
                <p className="text-muted-foreground leading-relaxed text-center">
                  أن نصبح فريقاً رائداً في مجال السباقات على المستوى الإقليمي والدولي، ومنصة لتطوير
                  المواهب الهندسية الشابة.
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="group hover:shadow-racing transition-smooth">
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground text-center">رسالتنا</h3>
                <p className="text-muted-foreground leading-relaxed text-center">
                  تصميم وتطوير سيارات سباق مبتكرة من خلال الجمع بين المعرفة الأكاديمية والخبرة العملية،
                  مع تعزيز روح العمل الجماعي والابتكار.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <Card className="group hover:shadow-racing transition-smooth">
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground text-center">قيمنا</h3>
                <p className="text-muted-foreground leading-relaxed text-center">
                  الشغف، التميز، الابتكار، العمل الجماعي، والالتزام بالجودة في كل ما نقوم به.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">إنجازاتنا</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              سجل حافل بالنجاحات والجوائز على مدار السنوات
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { year: "2024", achievement: "المركز الأول - مسابقة التصميم الإبداعي" },
              { year: "2023", achievement: "جائزة أفضل فريق - بطولة السباقات الإقليمية" },
              { year: "2023", achievement: "المركز الثاني - مسابقة الكفاءة الهندسية" },
              { year: "2022", achievement: "جائزة الابتكار التقني" },
              { year: "2022", achievement: "المركز الثالث - مسابقة السرعة والأداء" },
              { year: "2021", achievement: "جائزة أفضل مشروع طلابي" },
            ].map((item, index) => (
              <Card key={index} className="group hover:shadow-racing transition-smooth">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-primary font-bold mb-1">{item.year}</p>
                    <p className="text-foreground">{item.achievement}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
