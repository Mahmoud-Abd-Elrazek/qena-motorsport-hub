import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, Shield, Languages } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext"; // 1. استيراد الـ Context

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 2. استدعاء البيانات
  const { t, toggleLanguage } = useLanguage();
  const { settings } = useSiteSettings(); 

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
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3">
            
            {/* 3. اللوجو الديناميكي */}
            {settings?.data?.logoImageUrl ? (
               <img 
                 src={settings.data.logoImageUrl} 
                 alt="Logo" 
                 className="h-10 w-10 object-contain rounded-md" 
               />
            ) : (
               // Fallback في حال عدم وجود لوجو
               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-racing">
                 <span className="text-xl font-bold text-white">QRT</span>
               </div>
            )}

            {/* 4. النصوص الديناميكية */}
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-foreground leading-none mb-1">
                {settings?.data.siteName || t('header.brand')}
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                {settings?.data.navbarBio || t('header.subbrand')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="transition-smooth font-medium"
                >
                  {item.label}
                </Button>
              </Link>
            ))}

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              title={t('lang.name')}
              className="transition-smooth"
            >
              <Languages className="h-4 w-4" />
            </Button>

            {/* Admin Link */}
            <Link to="/admin">
              <Button
                variant={location.pathname === "/admin" ? "default" : "ghost"}
                className="transition-smooth"
                size="icon"
                title={t('admin.title')}
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

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-border py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
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
            
            <div className="border-t border-border my-2 pt-2 space-y-2">
              {/* Language Switcher Mobile */}
              <Button
                variant="ghost"
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className="w-full justify-start transition-smooth gap-3"
              >
                <Languages className="h-4 w-4" />
                <span>{t('lang.name')}</span>
              </Button>

              {/* Admin Link Mobile */}
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={location.pathname === "/admin" ? "default" : "ghost"}
                  className="w-full justify-start transition-smooth gap-3"
                >
                  <Shield className="h-4 w-4" />
                  <span>{t('admin.title')}</span>
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;