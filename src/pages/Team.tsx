import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemberCard from "@/components/MemberCard";
import { Button } from "@/components/ui/button";
import { teamMembers } from "@/data/mockData";

const Team = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("الكل");

  const specialties = [
    "الكل",
    "الهندسة الميكانيكية",
    "الأنظمة الكهربائية",
    "البرمجة والذكاء الاصطناعي",
    "الإدارة والتنظيم",
    "التصميم الصناعي",
    "الصيانة والإصلاح",
  ];

  const filteredMembers =
    selectedSpecialty === "الكل"
      ? teamMembers
      : teamMembers.filter((member) => member.specialty === selectedSpecialty);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">فريق العمل</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            تعرف على الأعضاء المتميزين الذين يشكلون عائلة فريق سباقات قنا
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-card border-b border-border sticky top-16 z-40 backdrop-blur bg-card/95">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                onClick={() => setSelectedSpecialty(specialty)}
                className="transition-smooth"
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredMembers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} {...member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                لا يوجد أعضاء في هذا التخصص حالياً
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
