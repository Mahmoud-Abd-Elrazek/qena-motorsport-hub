import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, Filter, Globe, Facebook, Linkedin, Twitter, 
  MoreHorizontal, Calendar, Share2, MessageCircle, Heart, 
  ExternalLink, Loader2, Trophy, Zap, Newspaper, Image as ImageIcon 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// --- 1. Types & Mock Data Generators ---

type CategoryType = 'news' | 'event' | 'achievement';

interface Source {
  platform: 'facebook' | 'x' | 'linkedin' | 'website';
  url: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: CategoryType;
  date: string;
  images: string[];
  sources: Source[];
  likes: number;
  comments: number;
}

// دالة لتوليد بيانات وهمية عند التمرير
const generateFakePosts = (page: number): Post[] => {
  const baseId = page * 10;
  return Array.from({ length: 5 }).map((_, i) => ({
    id: `${baseId + i}`,
    title: page === 1 && i === 0 ? "فريق قنا للسباقات يحصد المركز الأول 🏆" : `عنوان المنشور التجريبي رقم ${baseId + i}`,
    content: page === 1 && i === 0 
      ? "سعداء جداً بمشاركتكم هذا الإنجاز العظيم! بعد تعب وجهد استمر لشهور، استطاع فريقنا تحقيق المركز الأول في المسابقة الوطنية للسيارات الكهربائية."
      : "هذا نص تجريبي للمحتوى يوضح كيف سيظهر الكلام في الـ Feed. يمكن أن يكون النص طويلاً أو قصيراً، ويحتوي على تفاصيل كثيرة تهم المتابعين.",
    category: i % 3 === 0 ? 'achievement' : i % 2 === 0 ? 'event' : 'news',
    date: "منذ 2 ساعة",
    // تنويع عدد الصور لاختبار الـ Grid
    images: i === 0 
      ? ["https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800"] 
      : i === 1 
      ? ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800", "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800"]
      : i === 2
      ? ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800", "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800", "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"]
      : [],
    sources: [
      { platform: 'facebook', url: '#' },
      { platform: i % 2 === 0 ? 'linkedin' : 'x', url: '#' }
    ],
    likes: Math.floor(Math.random() * 200),
    comments: Math.floor(Math.random() * 50),
  }));
};

// --- 2. Helper Components ---

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
    case 'linkedin': return <Linkedin className="h-4 w-4 text-blue-700" />;
    case 'x': return <Twitter className="h-4 w-4 text-black" />;
    default: return <Globe className="h-4 w-4 text-slate-500" />;
  }
};

const CategoryBadge = ({ category }: { category: CategoryType }) => {
  switch (category) {
    case 'achievement': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 gap-1"><Trophy className="h-3 w-3" /> إنجاز</Badge>;
    case 'event': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 gap-1"><Zap className="h-3 w-3" /> فاعلية</Badge>;
    default: return <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 gap-1"><Newspaper className="h-3 w-3" /> خبر</Badge>;
  }
};

// --- 3. Main Post Card Component ---
const PostCard = ({ post }: { post: Post }) => {
  const { language } = useLanguage();
  
  // Logic to display images like Facebook (1, 2, 3+ grid)
  const renderImages = () => {
    if (post.images.length === 0) return null;

    if (post.images.length === 1) {
      return (
        <div className="mt-3 rounded-xl overflow-hidden border bg-slate-100">
          <img src={post.images[0]} className="w-full h-auto max-h-[500px] object-cover" loading="lazy" />
        </div>
      );
    }

    if (post.images.length === 2) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden border bg-slate-100 h-[300px]">
          <img src={post.images[0]} className="w-full h-full object-cover" loading="lazy" />
          <img src={post.images[1]} className="w-full h-full object-cover" loading="lazy" />
        </div>
      );
    }

    return (
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden border bg-slate-100 h-[300px]">
        <img src={post.images[0]} className="w-full h-full object-cover" loading="lazy" />
        <div className="grid grid-rows-2 gap-1 h-full">
          <img src={post.images[1]} className="w-full h-full object-cover" loading="lazy" />
          <div className="relative h-full">
             <img src={post.images[2]} className="w-full h-full object-cover" loading="lazy" />
             {post.images.length > 3 && (
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
                 +{post.images.length - 3}
               </div>
             )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-none shadow-sm mb-6 overflow-hidden ring-1 ring-slate-200/60">
      <CardHeader className="p-4 pb-2 flex flex-row items-start gap-3 space-y-0">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src="/logo-placeholder.png" />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">QR</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
             <h3 className="font-bold text-slate-900 leading-none">Qena Racing Team</h3>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>{post.date}</span>
            <span>•</span>
            <Globe className="h-3 w-3" />
            <CategoryBadge category={post.category} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <h4 className="font-bold text-lg mb-2">{post.title}</h4>
        <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
          {post.content}
        </p>
        
        {renderImages()}

        {/* Source Links Action Bar */}
        <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t">
          <span className="text-xs font-bold text-slate-400 flex items-center h-8 ml-2">المصادر:</span>
          {post.sources.map((src, i) => (
            <a 
              key={i} 
              href={src.url} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-medium transition-colors text-slate-700"
            >
              <PlatformIcon platform={src.platform} />
              <span className="capitalize">{src.platform}</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          ))}
        </div>

        {/* Social Metrics */}
        <div className="flex items-center justify-between mt-4 text-slate-500 text-sm">
           <div className="flex gap-4">
             <button className="flex items-center gap-1 hover:text-red-500 transition-colors"><Heart className="h-4 w-4" /> {post.likes}</button>
             <button className="flex items-center gap-1 hover:text-blue-500 transition-colors"><MessageCircle className="h-4 w-4" /> {post.comments}</button>
           </div>
           <button className="flex items-center gap-1 hover:text-slate-900 transition-colors"><Share2 className="h-4 w-4" /> مشاركة</button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- 4. Main Page Component ---

const NewsFeed = () => {
  const { language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // State
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Observer for Infinite Scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Fetch Logic
  const loadPosts = async () => {
    setLoading(true);
    // Simulate Network Delay
    setTimeout(() => {
      const newPosts = generateFakePosts(page);
      setPosts(prev => [...prev, ...newPosts]);
      setLoading(false);
      if (page >= 5) setHasMore(false); // Stop after 5 pages for demo
    }, 1000);
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-50/50" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm h-16">
         <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-6xl">
            <div className="flex items-center gap-2">
               <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">QR</div>
               <h1 className="text-lg font-bold hidden md:block">المركز الإعلامي</h1>
            </div>
            
            <div className="flex-1 max-w-md mx-4 relative">
               <Search className="absolute top-2.5 right-3 h-4 w-4 text-slate-400" />
               <Input className="w-full bg-slate-100 border-none rounded-full h-9 pr-10 focus:ring-1 focus:bg-white transition-all" placeholder="بحث في الأخبار..." />
            </div>

            <Button size="icon" variant="ghost" className="rounded-full">
               <Filter className="h-5 w-5 text-slate-600" />
            </Button>
         </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
         
         {/* Left Sidebar (Desktop) - Filters */}
         <aside className="hidden md:block col-span-1 sticky top-24 h-fit space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-4">
               <h3 className="font-bold text-slate-900 mb-4">التصنيفات</h3>
               <div className="space-y-1">
                  {['الكل', 'أخبار', 'فعاليات', 'إنجازات'].map((item, i) => (
                     <Button key={i} variant={i === 0 ? 'secondary' : 'ghost'} className="w-full justify-start font-normal h-10 rounded-lg">
                        {item}
                     </Button>
                  ))}
               </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border p-4 text-xs text-slate-500">
               <p>© 2025 Qena Racing Team.</p>
               <div className="flex gap-2 mt-2">
                  <a href="#" className="hover:underline">عن الفريق</a> • 
                  <a href="#" className="hover:underline">تواصل معنا</a>
               </div>
            </div>
         </aside>

         {/* Middle Column - Feed */}
         <section className="col-span-1 md:col-span-2 md:col-start-2">
            {posts.map((post, index) => {
               if (posts.length === index + 1) {
                  return <div ref={lastPostElementRef} key={post.id}><PostCard post={post} /></div>;
               } else {
                  return <div key={post.id}><PostCard post={post} /></div>;
               }
            })}

            {/* Loading Indicator */}
            <div className="py-6 flex justify-center">
               {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
               {!hasMore && !loading && <p className="text-slate-400 text-sm">وصلت لنهاية الأخبار</p>}
            </div>
         </section>

         {/* Right Sidebar (Desktop) - Trending */}
         <aside className="hidden lg:block col-span-1 sticky top-24 h-fit">
            <div className="bg-white rounded-xl shadow-sm border p-4">
               <h3 className="font-bold text-slate-900 mb-4 text-sm">الأكثر تداولاً</h3>
               <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="flex gap-3 items-start group cursor-pointer">
                        <span className="font-bold text-slate-300 text-lg">0{i}</span>
                        <div>
                           <h4 className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors leading-snug">
                              فريق قنا يطلق النموذج الأولي للسيارة الجديدة
                           </h4>
                           <span className="text-xs text-slate-400 mt-1 block">منذ يومين</span>
                        </div>
                     </div>
                  ))}
               </div>
               <Button variant="link" className="w-full mt-2 text-primary text-xs">عرض المزيد</Button>
            </div>
         </aside>

      </main>
    </div>
  );
};

export default NewsFeed;