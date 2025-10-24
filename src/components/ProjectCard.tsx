import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  year: number;
  category: string;
}

const ProjectCard = ({ id, title, description, image, year, category }: ProjectCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="group overflow-hidden hover:shadow-racing transition-smooth">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-110 transition-smooth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-4 right-4">
          <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold">
            {year}
          </span>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <p className="text-xs text-primary font-medium mb-2">{category}</p>
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <Link to={`/projects/${id}`}>
          <Button variant="outline" className="w-full group/btn">
            <span>{t('projects.details')}</span>
            <ArrowLeft className="mr-2 h-4 w-4 group-hover/btn:-translate-x-1 transition-smooth" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
