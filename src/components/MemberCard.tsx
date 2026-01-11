import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext"; // استيراد الكونتكست

interface MemberCardProps {
  id: number | string;
  name: string;
  role: string;
  specialty: string; 
  image: string;
  points?: number;
  linkedInUrl?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const MemberCard = ({ 
  id, 
  name, 
  role, 
  specialty, 
  image, 
  points, 
  socials, 
  linkedInUrl 
}: MemberCardProps) => {
  const { t, language } = useLanguage(); // استخدام اللغة والاتجاه
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // التحقق من صلاحية رابط لينكد إن
  const validLinkedIn = (linkedInUrl && linkedInUrl.length > 5 && linkedInUrl !== "string") 
                        ? linkedInUrl 
                        : socials?.linkedin;

  return (
    // إضافة dir للكارد لضمان اتساق النصوص داخله
    <Card className="group overflow-hidden hover:shadow-racing transition-smooth cursor-pointer h-full flex flex-col" dir={dir}>
      <Link to={`/team/${id}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover group-hover:scale-110 transition-smooth"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {points !== undefined && (
            // استخدام start-4 بدلاً من left-4 ليعمل تلقائياً مع RTL/LTR
            <div className="absolute top-4 start-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
              {points} {t('member.points')}
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-6 space-y-3 flex flex-col flex-grow text-start">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
          <p className="text-sm text-primary font-medium">{role}</p>
          <p className="text-xs text-muted-foreground mt-1">{specialty}</p>
        </div>

        {/* Social Media Section */}
        {/* استخدام gap-2 وتوجيه العناصر يعمل تلقائياً مع flex */}
        <div className="flex gap-2 pt-2 mt-auto">
          
          {/* LinkedIn Button */}
          {validLinkedIn && (
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[#0077b5] hover:bg-[#0077b5]/10" asChild>
              <a href={validLinkedIn} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          )}

          {/* Other Socials if they exist */}
          {socials?.facebook && (
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[#1877F2] hover:bg-[#1877F2]/10" asChild>
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
              </a>
            </Button>
          )}
          
          {socials?.instagram && (
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[#E4405F] hover:bg-[#E4405F]/10" asChild>
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
          )}
          
          {socials?.twitter && (
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10" asChild>
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;