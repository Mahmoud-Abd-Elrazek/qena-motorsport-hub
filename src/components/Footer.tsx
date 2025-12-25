import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-racing">
                <span className="text-2xl font-bold text-white">QRT</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">{t('hero.title')}</h3>
                <p className="text-xs text-muted-foreground">Qena Racing Team</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.aboutDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  {t('nav.team')}
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  {t('nav.projects')}
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  {t('nav.leaderboard')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                   {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-foreground mb-4">{t('footer.contactInfo')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-1 text-primary shrink-0" />
                <span>{language === 'ar' ? 'قنا، مصر' : 'Qena, Egypt'}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mt-1 text-primary shrink-0" />
                {/* dir="ltr" ensures phone numbers display correctly in RTL */}
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-1 text-primary shrink-0" />
                <span dir="ltr">info@qenaracingteam.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-foreground mb-4">{t('footer.social')}</h4>
            <div className="flex gap-3">
              <SocialLink href="https://facebook.com" icon={<Facebook className="h-5 w-5" />} />
              <SocialLink href="https://instagram.com" icon={<Instagram className="h-5 w-5" />} />
              <SocialLink href="https://twitter.com" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="https://youtube.com" icon={<Youtube className="h-5 w-5" />} />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {t('hero.title')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

// Helper component to reduce repetition
const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-white transition-smooth"
  >
    {icon}
  </a>
);

export default Footer;