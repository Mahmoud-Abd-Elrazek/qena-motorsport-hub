import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { t, toggleLanguage } = useLanguage();

  // إدارة الحالة (State)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error(t('login.error.required'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://qenaracingteam.runasp.net/Racing/Authentication/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(t('login.error.invalid'));
        } else {
          toast.error(`${t('login.error.server')}: ${response.status}`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      const token = data.data;

      if (token) {
        localStorage.setItem("token", token);
        toast.success(t('login.success'));
        navigate("/admin");
      } else {
        toast.error(t('login.error.noData'));
      }

    } catch (error) {
      console.error("Login Error:", error);
      toast.error(t('login.error.network'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative">

      {/* زر تبديل اللغة */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleLanguage}
        className="absolute top-4 right-4 md:top-8 md:right-8 bg-background/50 backdrop-blur-sm hover:bg-background/20"
      >
        <Globe className="h-5 w-5" />
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">{t('login.subtitle')}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('login.email')}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@example.com"
                dir="ltr" // الإيميل دائماً من اليسار لليمين
                className="text-left"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="text-left"
                required
              />
            </div>
            <Button type="submit" className="w-full gradient-hero" disabled={loading}>
              {loading ? t('login.loading') : t('login.btn')}
            </Button>
            <div className="text-center">
              <Button type="button" variant="link" onClick={() => navigate("/")} className="text-sm">
                {t('login.back')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;