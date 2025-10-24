import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, Shield, Languages } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navItems = [
    { path: "/", label: t('nav.home') },
    { path: "/about", label: t('nav.about') },
    { path: "/team", label: t('nav.team') },
    { path: "/projects", label: t('nav.projects') },
    { path: "/leaderboard", label: t('nav.leaderboard') },
    { path: "/contact", label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-racing">
              <span className="text-xl font-bold text-white">QRT</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-foreground">فريق سباقات قنا</h1>
              <p className="text-xs text-muted-foreground">Qena Racing Team</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="transition-smooth"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              title={language === 'ar' ? 'English' : 'العربية'}
              className="transition-smooth"
            >
              <Languages className="h-4 w-4" />
            </Button>
            <Link to="/admin">
              <Button
                variant={location.pathname === "/admin" ? "default" : "ghost"}
                className="transition-smooth"
                size="icon"
                title="لوحة التحكم"
              >
                <Shield className="h-4 w-4" />
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-border py-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start transition-smooth"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="w-full justify-start transition-smooth"
            >
              <Languages className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant={location.pathname === "/admin" ? "default" : "ghost"}
                className="w-full justify-start transition-smooth"
              >
                <Shield className="ml-2 h-4 w-4" />
                لوحة التحكم
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
