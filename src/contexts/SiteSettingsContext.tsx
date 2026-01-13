import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { toast } from "sonner";

// رابط الـ API الأساسي
const API_BASE_URL = "https://qenaracingteam.runasp.net/Racing/TeamInfo";

export interface IdentityCard {
   id: number;
   title: string;
   content: string;
   iconName: string;
}

export interface SiteSettingsData {
   data: any;
   siteName: string;
   navbarBio: string;
   logoImageUrl: string;

   heroTitle: string;
   heroSubtitle: string;
   heroImageUrl: string;

   homeSectionTitle: string;
   homeSectionContent: string;
   aboutImageUrl: string;

   identityCards: IdentityCard[];
   ourStory: string;

   contact: {
      email: string;
      phone: string;
      address: string;
      workHours: string;
   };

   social: {
      facebook: string;
      linkedin: string;
      youtube: string;
      instagram: string;
      twitter: string;
   };
}

interface SiteSettingsContextType {
   settings: SiteSettingsData | null;
   loading: boolean;
   refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
   const [settings, setSettings] = useState<SiteSettingsData | null>(null);
   const [loading, setLoading] = useState(true);

   const fetchSettings = async () => {
      setLoading(true);
      try {
         const response = await axios.get(`${API_BASE_URL}/GetSettings`);
         const data = response.data;

         setSettings(data);

      } catch (error) {
         console.error("Failed to fetch site settings:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchSettings();
   }, []);

   return (
      <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
         {children}
      </SiteSettingsContext.Provider>
   );
};

export const useSiteSettings = () => {
   const context = useContext(SiteSettingsContext);
   if (!context) throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
   return context;
};