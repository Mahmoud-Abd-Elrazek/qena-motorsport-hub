import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { projects } from "@/data/mockData";

const ProjectDetails = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">المشروع غير موجود</h1>
          <Link to="/projects">
            <Button>العودة لصفحة المشاريع</Button>
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
          <Link to="/projects">
            <Button variant="ghost">
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة لصفحة المشاريع
            </Button>
          </Link>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {project.year}
              </span>
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {project.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white">{project.title}</h1>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">نظرة عامة</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {project.fullDescription}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              {project.specs && (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      المواصفات التقنية
                    </h2>
                    <ul className="space-y-3">
                      {project.specs.map((spec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      معرض الصور
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {project.gallery.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${project.title} - صورة ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-smooth cursor-pointer"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-foreground">معلومات المشروع</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">السنة</p>
                      <p className="text-foreground font-medium">{project.year}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">الفئة</p>
                      <p className="text-foreground font-medium">{project.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">الحالة</p>
                      <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-sm font-medium">
                        مكتمل
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-hero text-white">
                <CardContent className="p-6 text-center space-y-3">
                  <h3 className="font-bold">هل أعجبك المشروع؟</h3>
                  <p className="text-sm text-white/80">
                    شارك أفكارك معنا أو اطرح أسئلتك
                  </p>
                  <Link to="/contact">
                    <Button variant="secondary" className="w-full">
                      تواصل معنا
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            مشاريع مشابهة
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {projects
              .filter((p) => p.id !== id)
              .slice(0, 3)
              .map((relatedProject) => (
                <Card key={relatedProject.id} className="group hover:shadow-racing transition-smooth">
                  <Link to={`/projects/${relatedProject.id}`}>
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/projects/${relatedProject.id}`}>
                      <h3 className="font-bold text-foreground hover:text-primary transition-smooth">
                        {relatedProject.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {relatedProject.category} • {relatedProject.year}
                    </p>
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

export default ProjectDetails;
