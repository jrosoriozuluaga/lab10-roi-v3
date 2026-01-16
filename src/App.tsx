import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider, useRole } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthGate } from "@/components/AuthGate";
import { RoleGate } from "@/components/RoleGate";
import Dashboard from "./pages/Dashboard";
import StakeholderView from "./pages/StakeholderView";
import ROICalculator from "./pages/ROICalculator";
import AdoptionMetrics from "./pages/AdoptionMetrics";
import ProjectsPortfolio from "./pages/ProjectsPortfolio";
import ActiveAlerts from "./pages/ActiveAlerts";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { role } = useRole();
  
  if (!role) {
    return <RoleGate />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/stakeholder" element={<StakeholderView />} />
      <Route path="/calculator" element={<ROICalculator />} />
      <Route path="/adoption" element={<AdoptionMetrics />} />
      <Route path="/projects" element={<ProjectsPortfolio />} />
      <Route path="/alerts" element={<ActiveAlerts />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function ProtectedApp() {
  return (
    <AuthGate>
      <RoleProvider>
        <AppContent />
      </RoleProvider>
    </AuthGate>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={<ProtectedApp />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
