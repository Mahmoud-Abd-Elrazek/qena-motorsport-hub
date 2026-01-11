import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemberCard from "@/components/MemberCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

interface Member {
  id: number;
  name: string;
  specialization: string;
  bio: string;
  currentImageUrl: string;
  linkedInUrl: string;
  points: number;
  role: string;
  year: number;
}

const Team = () => {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  // --- States ---
  const [members, setMembers] = useState<Member[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([]);

  // Filters
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Pagination States
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // *** Configuration: Number of items to load per scroll ***
  const PAGE_SIZE = 20; 

  // Ref for Infinite Scroll Trigger
  const loaderRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Filters (Run once)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/GetMemberFilters");
        const json = await response.json();
        if (json.isSuccess) {
          setAvailableYears(json.data.availableYears);
          setAvailableSpecialties(json.data.availableSpecializations);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, []);

  // Main Fetch Function (Wrapped in useCallback to be stable)
  const fetchMembers = useCallback(async (cursor: string | null) => {
    setIsLoading(true);

    const requestBody = {
      cursor: cursor,
      yearFilter: selectedYear,
      specialization: selectedSpecialty,
      pageSize: PAGE_SIZE // Dynamic manual size (not 10)
    };

    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Member/GetAllMembersWithCursor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const json = await response.json();

      if (json.isSuccess) {
        const newMembers = json.data.data;

        if (cursor === null) {
          setMembers(newMembers); // Reset list if new filter
        } else {
          setMembers((prev) => [...prev, ...newMembers]); // Append if scrolling
        }

        setNextCursor(json.data.nextCursor);
        setHasMore(json.data.hasMore);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedSpecialty]); // Re-create function only when filters change

  // 2. Initial Load / Filter Change
  useEffect(() => {
    fetchMembers(null);
  }, [fetchMembers]); 

  // 3. Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        // If the loader is visible, and we have more data, and we aren't currently loading...
        if (target.isIntersecting && hasMore && !isLoading && nextCursor) {
          fetchMembers(nextCursor);
        }
      },
      {
        root: null, // Viewport
        rootMargin: "100px", // Trigger loading 100px before reaching the bottom
        threshold: 0.1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading, nextCursor, fetchMembers]);

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />

      {/* Hero Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">{t('team.hero.title')}</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('team.hero.desc')}
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 bg-card border-b border-border sticky top-16 z-40 shadow-sm backdrop-blur bg-card/95">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            
            {/* Year Dropdown */}
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium mb-1 text-muted-foreground">{t('team.filter.year')}</label>
              <select
                className="w-full p-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                value={selectedYear ?? ""}
                onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">{t('team.filter.year_latest')}</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {t('team.filter.year_prefix')} {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialization Dropdown */}
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium mb-1 text-muted-foreground">{t('team.filter.spec')}</label>
              <select
                className="w-full p-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="All">{t('team.filter.spec_all')}</option>
                {availableSpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {members.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {members.map((member) => (
                  <MemberCard
                    key={`${member.id}-${member.year}`} 
                    {...member}
                    id={String(member.id)}
                    specialty={member.specialization}
                    image={member.currentImageUrl}
                    linkedInUrl={member.linkedInUrl}
                  />
                ))}
              </div>

              {/* Infinite Scroll Trigger & Loading Indicator */}
              {hasMore && (
                <div ref={loaderRef} className="mt-12 flex justify-center py-4">
                  {isLoading && (
                    <div className="flex items-center gap-2 text-primary">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="font-medium animate-pulse">{t('team.loading_more')}...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // Empty State
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-muted">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
                   <p className="text-xl text-muted-foreground animate-pulse">{t('team.loading_data')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-muted-foreground">{t('team.empty.title')}</p>
                  <p className="text-muted-foreground">{t('team.empty.desc')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;