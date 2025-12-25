import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext"; // Import hook

const Contact = () => {
  const { t, language } = useLanguage(); // Use the hook
  const isRTL = language === 'ar';

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t('contact.toast.error'));
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    
    toast.success(t('contact.toast.success'));
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            {t('contact.hero.title')}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t('contact.form.title')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.form.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('contact.form.name.placeholder')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.form.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      dir="ltr" // Email is always LTR
                      required
                      className={isRTL ? "text-right" : "text-left"} // Align text based on language if needed, but usually email input aligns LTR
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+20 123 456 7890"
                      dir="ltr" // Phone is always LTR
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.form.message')} *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t('contact.form.message.placeholder')}
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-hero shadow-racing" size="lg">
                    {t('contact.form.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t('contact.info.title')}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {t('contact.info.subtitle')}
                </p>
              </div>

              <div className="space-y-6">
                <Card className="hover:shadow-card transition-smooth">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
                        {t('contact.info.address')}
                      </h3>
                      <p className="text-muted-foreground">
                        {t('contact.info.address.value')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-card transition-smooth">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
                        {t('contact.info.phone')}
                      </h3>
                      <p className="text-muted-foreground" dir="ltr">
                        +20 123 456 7890
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-card transition-smooth">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
                        {t('contact.info.email')}
                      </h3>
                      <p className="text-muted-foreground" dir="ltr">
                        info@qenaracingteam.com
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-3">
                    {t('contact.hours.title')}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>{t('contact.hours.weekdays')}</span>
                      <span dir="ltr">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('contact.hours.weekend')}</span>
                      <span>{t('contact.hours.closed')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;