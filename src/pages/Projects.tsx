import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext"; // استيراد الكونتكست

// --- 1. Define Types based on your Backend DTOs ---
interface ProjectDTO {
  id: number;
  name: string;
  projectCategory: string;
  year: string; // DateOnly comes as string "YYYY-MM-DD" in JSON
  description: string | null;
  imageUrl: string | null;
  status: number;
}

interface FilterResponse {
  data: {
    availableYears: number[];
    availableCategories: string[];
  };
}

interface ProjectsResponse {
  data: {
    data: ProjectDTO[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

const Projects = () => {
  const { t, language } = useLanguage(); // استخدام اللغة والاتجاه
  const dir = language === "ar" ? "rtl" : "ltr";
  // --- State ---
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  // Filters State
  const [selectedYear, setSelectedYear] = useState<number | 0>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter Options State (populated from API)
  const [years, setYears] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Observer for scrolling
  const observer = useRef<IntersectionObserver | null>(null);

  // --- 2. Fetch Filters on Mount ---
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("https://qenaracingteam.runasp.net/Racing/Project/GetProjectFilters");
        const json: FilterResponse = await response.json();
        if (json.data) {
          setYears(json.data.availableYears);
          setCategories(json.data.availableCategories);
        }
      } catch (error) {
        console.error("Failed to load filters", error);
      }
    };
    fetchFilters();
  }, []);

  // --- 3. Reset List when Filters Change ---
  useEffect(() => {
    setProjects([]);
    setCursor(null);
    setHasMore(true);
  }, [selectedYear, selectedCategory]);

  // --- 4. Main Data Fetching Function ---
  const fetchProjects = async (currentCursor: string | null) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Project/GetProjectsWithCursor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cursor: currentCursor,
          yearFilter: selectedYear === 0 ? null : selectedYear,
          category: selectedCategory === "All" ? null : selectedCategory,
          pageSize: 6
        }),
      });

      const json: ProjectsResponse = await response.json();

      if (json.data) {
        setProjects((prev) => {
          if (currentCursor === null) return json.data.data;
          return [...prev, ...json.data.data];
        });
        setCursor(json.data.nextCursor);
        setHasMore(json.data.hasMore);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 5. Infinite Scroll Observer Logic ---
  const lastProjectElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchProjects(cursor);
      }
    });

    if (node) observer.current.observe(node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore, cursor, selectedYear, selectedCategory]);

  // Initial load trigger
  useEffect(() => {
    if (projects.length === 0 && hasMore && !loading) {
      fetchProjects(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length, hasMore, selectedYear, selectedCategory]);


  return (
    // ضبط الاتجاه للصفحة بالكامل
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />

      {/* Hero Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">{t('projects.page.title')}</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('projects.page.desc')}
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container mx-auto px-4 flex flex-wrap gap-4 justify-center">
          <select
            // text-start يضمن محاذاة النص داخل القائمة حسب اللغة
            className="p-2 rounded border bg-background min-w-[200px] text-start cursor-pointer focus:ring-2 focus:ring-primary outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">{t('projects.filter.all_categories')}</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select
            className="p-2 rounded border bg-background min-w-[150px] text-start cursor-pointer focus:ring-2 focus:ring-primary outline-none"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option value={0}>{t('projects.filter.all_years')}</option>
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const displayYear = new Date(project.year).getFullYear();

              return (
                <div
                  key={`${project.id}-${index}`}
                  ref={index === projects.length - 1 ? lastProjectElementRef : null}
                >
                  <ProjectCard
                    id={String(project.id)}
                    title={project.name}
                    description={project.description || t('projects.card.no_desc')}
                    image={project.imageUrl || "/placeholder-image.jpg"}
                    year={displayYear}
                    category={project.projectCategory}
                  />
                </div>
              );
            })}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* End of List Message */}
          {!hasMore && projects.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('projects.status.end')}
            </div>
          )}

          {/* No Results Message */}
          {!loading && projects.length === 0 && (
            <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
              <p className="text-lg">{t('projects.status.no_results')}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;