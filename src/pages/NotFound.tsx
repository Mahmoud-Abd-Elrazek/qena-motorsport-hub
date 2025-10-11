import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h1 className="text-9xl font-black text-primary">404</h1>
          <h2 className="text-3xl font-bold text-foreground">الصفحة غير موجودة</h2>
          <p className="text-lg text-muted-foreground">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="gradient-hero shadow-racing w-full sm:w-auto">
              <Home className="ml-2 h-5 w-5" />
              العودة للرئيسية
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="ml-2 h-5 w-5" />
            الصفحة السابقة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
