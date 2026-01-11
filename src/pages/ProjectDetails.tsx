import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Tag,
  Loader2,
  X,
  Maximize2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext"; // استيراد الكونتكست

// --- Interfaces ---

interface ProjectDetailDTO {
  id: number;
  name: string;
  projectCategory: string;
  year: string; // "YYYY-MM-DD"
  description: string;
  images: Array<{ url: string; imageType?: number }> | string[];
  specs: string[];
  status: number;
}

interface ProjectListDTO {
  id: number;
  name: string;
  projectCategory: string;
  year: string;
  imageUrl: string | null;
}

const ProjectDetails = () => {
  const { id } = useParams();
  const { t, language } = useLanguage(); // استخدام اللغة والاتجاه
  const dir = language === "ar" ? "rtl" : "ltr";
  // --- State ---
  const [project, setProject] = useState<ProjectDetailDTO | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<ProjectListDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        // 1. Fetch Current Project Details
        const response = await fetch(`https://qenaracingteam.runasp.net/Racing/Project/GetProjectDetails/${id}`);

        if (!response.ok) throw new Error("Network response was not ok");

        const json = await response.json();

        if (json.isSuccess && json.data) {
          const currentProject = json.data;
          setProject(currentProject);

          // 2. Smart Related Projects Strategy
          let relatedRes = await fetch("https://qenaracingteam.runasp.net/Racing/Project/GetProjectsWithCursor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pageSize: 4,
              category: currentProject.projectCategory
            })
          });

          let relatedJson = await relatedRes.json();
          let candidates = relatedJson.data?.data || [];

          let finalRelated = candidates.filter((p: any) => p.id !== currentProject.id);

          // 3. Fallback Strategy
          if (finalRelated.length === 0) {
            relatedRes = await fetch("https://qenaracingteam.runasp.net/Racing/Project/GetProjectsWithCursor", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ pageSize: 4 })
            });

            relatedJson = await relatedRes.json();
            candidates = relatedJson.data?.data || [];
            finalRelated = candidates.filter((p: any) => p.id !== currentProject.id);
          }

          setRelatedProjects(finalRelated);

        } else {
          setError(true);
        }

      } catch (err) {
        console.error("Failed to fetch data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
      window.scrollTo(0, 0);
    }
  }, [id]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir={dir}>
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  // --- Error State ---
  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col" dir={dir}>
        <Header />
        <div className="flex-1 container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t('project.details.not_found')}</h1>
          <Link to="/projects">
            <Button>{t('project.details.back_to_list')}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Helper Logic for Display ---
  const displayYear = new Date(project.year).getFullYear();

  const allImages = Array.isArray(project.images)
    ? project.images.map((img: any) => typeof img === 'string' ? img : img.url)
    : [];

  const heroImage = allImages.length > 0 ? allImages[0] : "/placeholder-image.jpg";
  const galleryImages = allImages.length > 1 ? allImages.slice(1) : [];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />

      {/* 1. Back Button */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <Link to="/projects">
            <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary gap-2">
              {/* عكس اتجاه السهم حسب اللغة */}
              {language === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {t('project.details.back')}
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Hero Image (Clickable) */}
      <section
        className="relative h-[400px] md:h-[500px] overflow-hidden group cursor-pointer"
        onClick={() => setSelectedImage(heroImage)}
      >
        <img
          src={heroImage}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Zoom Hint Icon - Positioning based on language */}
        <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          <Maximize2 className="text-white h-5 w-5" />
        </div>

        {/* Text Positioning */}
        <div className={`absolute bottom-0 ${language === 'ar' ? 'left-0 right-0' : 'left-0 right-0'} p-8 pointer-events-none`}>
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {displayYear}
              </span>
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {project.projectCategory}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2">{project.name}</h1>
          </div>
        </div>
      </section>

      {/* 3. Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Left Column: Description & Gallery */}
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t('project.details.overview')}</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              {/* Specs */}
              {project.specs && project.specs.length > 0 && (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      {t('project.details.specs')}
                    </h2>
                    <ul className="space-y-3">
                      {project.specs.map((spec, index) => (
                        <li key={index} className="flex items-start gap-3 text-muted-foreground">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Gallery Grid (Clickable) */}
              {galleryImages.length > 0 && (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      {t('project.details.gallery')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {galleryImages.map((image, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-lg h-48 group/img cursor-pointer relative"
                          onClick={() => setSelectedImage(image)}
                        >
                          <img
                            src={image}
                            alt={`${project.name} - ${index + 1}`}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-smooth"
                          />
                          {/* Overlay icon */}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="text-white h-6 w-6 drop-shadow-md" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-foreground text-xl">{t('project.details.info_title')}</h3>
                  <div className="space-y-4 divide-y">
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-1">{t('project.details.year')}</p>
                      <p className="text-foreground font-medium">{displayYear}</p>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs text-muted-foreground mb-1">{t('project.details.category')}</p>
                      <p className="text-foreground font-medium">{project.projectCategory}</p>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs text-muted-foreground mb-1">{t('project.details.status')}</p>
                      <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${project.status === 1
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {project.status === 1 ? t('project.status.active') : t('project.status.completed')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-hero text-white border-none shadow-racing">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-bold text-lg">{t('project.cta.title')}</h3>
                  <p className="text-sm text-white/90">
                    {t('project.cta.desc')}
                  </p>
                  <Link to="/contact">
                    <Button variant="secondary" className="w-full font-bold">
                      {t('project.cta.btn')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              {relatedProjects.some(p => p.projectCategory === project.projectCategory)
                ? t('project.related.similar')
                : t('project.related.latest')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedProjects
                .slice(0, 3)
                .map((relatedProject) => (
                  <Card key={relatedProject.id} className="group hover:shadow-racing transition-smooth border-border/50">
                    <Link to={`/projects/${relatedProject.id}`}>
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={relatedProject.imageUrl || "/placeholder-image.jpg"}
                          alt={relatedProject.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-smooth" />
                      </div>
                    </Link>
                    <CardContent className="p-4 text-start">
                      <Link to={`/projects/${relatedProject.id}`}>
                        <h3 className="font-bold text-foreground hover:text-primary transition-colors mb-1 line-clamp-1">
                          {relatedProject.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {relatedProject.projectCategory} • {new Date(relatedProject.year).getFullYear()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* 5. Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-[101]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="h-8 w-8" />
          </button>

          <img
            src={selectedImage}
            alt="Fullscreen view"
            className="max-h-[90vh] max-w-[95vw] object-contain rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
};

export default ProjectDetails;