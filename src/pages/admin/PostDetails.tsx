import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, ArrowLeft, Heart, MessageCircle, Share2, 
  Calendar, Globe, Facebook, Linkedin, Twitter, ExternalLink, MoreHorizontal 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// --- Fake Data for Demo (استخدم نفس البيانات أو API) ---
const FAKE_POST = {
  id: "1",
  title: "فريق قنا للسباقات يحصد المركز الأول في رالي الجامعات 🏆",
  content: `بعد منافسة شرسة استمرت لثلاثة أيام متواصلة، وبفضل جهود الفريق الهندسي والفني، تمكنا من تحقيق المركز الأول.
  
  السيارة الجديدة أثبتت كفاءة عالية في المنعطفات واستهلاك الطاقة، مما جعلنا نتفوق على 15 جامعة مشاركة. نشكر كل من دعمنا في هذه الرحلة.`,
  date: "منذ 2 ساعة",
  category: "achievement",
  images: [
    { id: "1", url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200", caption: "لحظة إعلان النتيجة وفرحة الفريق الفارمة" },
    { id: "2", url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200", caption: "السيارة (QR-25) وهي تجتاز خط النهاية محققة رقماً قياسياً جديداً" },
    { id: "3", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200", caption: "جانب من التجهيزات الفنية في الـ Pit Stop قبل بدء السباق بدقائق" }
  ],
  sources: [
    { platform: 'facebook', url: '#' },
    { platform: 'linkedin', url: '#' }
  ],
  likes: 342,
  comments: 56
};

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    // هنا يتم جلب البيانات من الـ API باستخدام الـ id
    setPost(FAKE_POST); 
  }, [id]);

  if (!post) return <div className="p-10 text-center">جاري التحميل...</div>;

  const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'linkedin': return <Linkedin className="h-4 w-4 text-blue-700" />;
      case 'x': return <Twitter className="h-4 w-4 text-black" />;
      default: return <Globe className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10" dir={dir}>
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-4xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-slate-600">
            {language === 'ar' ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            العودة
          </Button>
          <h1 className="text-sm font-bold text-slate-500">تفاصيل المنشور</h1>
          <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5 text-slate-600" /></Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              
              {/* Author & Meta */}
              <div className="p-6 pb-4 flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                   <AvatarImage src="/logo.png" />
                   <AvatarFallback>QR</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                   <h1 className="text-lg font-bold text-slate-900">Qena Racing Team</h1>
                   <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>{post.date}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs font-normal px-2 py-0 h-5">
                         {post.category}
                      </Badge>
                   </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="px-6 pb-6">
                 <h2 className="text-xl font-bold mb-4 leading-snug">{post.title}</h2>
                 <p className="text-slate-700 leading-8 whitespace-pre-line text-lg">
                    {post.content}
                 </p>
              </div>

              {/* Images with Captions (Story Mode) */}
              <div className="bg-slate-50 border-t border-b">
                 {post.images.map((img: any, index: number) => (
                    <div key={img.id} className="mb-0 last:mb-0 group">
                       <div className="relative">
                          <img 
                             src={img.url} 
                             className="w-full h-auto object-cover max-h-[600px]" 
                             alt={img.caption} 
                          />
                       </div>
                       {img.caption && (
                          <div className="p-4 bg-white border-b text-center">
                             <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                <span className="text-primary font-bold mx-2">صورة {index + 1}:</span>
                                {img.caption}
                             </p>
                          </div>
                       )}
                    </div>
                 ))}
              </div>

              {/* Interactions & Sources */}
              <div className="p-6 bg-white">
                 {/* Sources Links */}
                 <div className="flex flex-wrap gap-3 mb-6">
                    {post.sources.map((src: any, i: number) => (
                       <a 
                          key={i} 
                          href={src.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border rounded-lg text-sm text-slate-700 transition-all"
                       >
                          <PlatformIcon platform={src.platform} />
                          <span className="capitalize font-medium">عرض على {src.platform}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400 ms-auto" />
                       </a>
                    ))}
                 </div>

                 <Separator className="mb-4" />

                 <div className="flex justify-between items-center text-slate-500">
                    <div className="flex gap-6">
                       <Button variant="ghost" className="hover:text-red-500 hover:bg-red-50 gap-2 px-2">
                          <Heart className="h-5 w-5" /> 
                          <span className="font-bold">{post.likes}</span>
                       </Button>
                       <Button variant="ghost" className="hover:text-blue-500 hover:bg-blue-50 gap-2 px-2">
                          <MessageCircle className="h-5 w-5" />
                          <span className="font-bold">{post.comments}</span>
                       </Button>
                    </div>
                    <Button variant="ghost" className="gap-2">
                       <Share2 className="h-5 w-5" /> مشاركة
                    </Button>
                 </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Sidebar (More Info / Related) */}
        <div className="hidden lg:block space-y-6">
           <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">منشورات ذات صلة</h3>
              <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 items-center group cursor-pointer hover:bg-slate-50 p-2 rounded-lg -mx-2 transition-colors">
                       <div className="h-16 w-16 bg-slate-200 rounded-md overflow-hidden shrink-0">
                          <img src={`https://source.unsplash.com/random/200x200?car&sig=${i}`} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary">
                             تغطية خاصة لفعاليات اليوم الثاني من المعرض
                          </h4>
                          <span className="text-xs text-slate-400 mt-1 block">منذ يومين</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default PostDetails;