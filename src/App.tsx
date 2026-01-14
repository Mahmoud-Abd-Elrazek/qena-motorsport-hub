import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Team from "./pages/Team";
import MemberDetails from "./pages/MemberDetails";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Leaderboard from "./pages/Leaderboard";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageMembers from "./pages/admin/ManageMembers";
import ManageProjects from "./pages/admin/ManageProjects";
import ManagePoints from "./pages/admin/ManagePoints";
import ManageMessages from "./pages/admin/ManageMessages";
import NotFound from "./pages/NotFound";

// Auth Component
import ProtectedRoute from "./components/ProtectedRoute";
import ManageAchievements from "./pages/admin/ManageAchievements";
import GeneralSettings from "./pages/admin/GeneralSettings";

import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import { useEffect } from "react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext"; // 1. Import Hook

const queryClient = new QueryClient();


// === المكون المسؤول عن تغيير العنوان ===
const SiteTitleUpdater = () => {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (settings?.data?.siteName) {
      document.title = settings.data.siteName;
    }
  }, [settings]);

  return null;
};
// ======================================

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <SiteSettingsProvider>
        <SiteTitleUpdater />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* ================= Public Routes ================= */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:id" element={<MemberDetails />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />

            {/* ================= Protected Admin Routes ================= */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/members" element={<ManageMembers />} />
              <Route path="/admin/projects" element={<ManageProjects />} />
              <Route path="/admin/points" element={<ManagePoints />} />
              <Route path="/admin/messages" element={<ManageMessages />} />
              <Route path="/admin/achievements" element={<ManageAchievements />} />
              <Route path="/admin/GeneralSettings" element={<GeneralSettings />} />
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </SiteSettingsProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;