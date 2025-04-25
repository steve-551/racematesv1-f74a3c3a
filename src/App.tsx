
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/providers/AuthProvider";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import SetupVault from "./pages/SetupVault";
import EventBrowser from "./pages/EventBrowser";
import StintPlanner from "./pages/StintPlanner";
import NotFound from "./pages/NotFound";
import FindRacers from "./pages/FindRacers";
import RacerProfile from "./pages/RacerProfile";
import MyRacerProfile from "./pages/MyRacerProfile";
import Onboarding from "./pages/Onboarding";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/setups" element={<SetupVault />} />
                <Route path="/events" element={<EventBrowser />} />
                <Route path="/stints" element={<StintPlanner />} />
                <Route path="/find-racers" element={<FindRacers />} />
                <Route path="/racers/:id" element={<RacerProfile />} />
                <Route path="/profile" element={<MyRacerProfile />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
