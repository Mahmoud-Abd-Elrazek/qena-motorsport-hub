import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Button } from "./ui/button";

interface MemberCardProps {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  points?: number;
  socials?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const MemberCard = ({ id, name, role, specialty, image, points, socials }: MemberCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-racing transition-smooth cursor-pointer">
      <Link to={`/team/${id}`}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover group-hover:scale-110 transition-smooth"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {points !== undefined && (
            <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
              {points} نقطة
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-6 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
          <p className="text-sm text-primary font-medium">{role}</p>
          <p className="text-xs text-muted-foreground mt-1">{specialty}</p>
        </div>

        {socials && (
          <div className="flex gap-2 pt-2">
            {socials.facebook && (
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            )}
            {socials.instagram && (
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
            )}
            {socials.twitter && (
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            )}
            {socials.linkedin && (
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberCard;
