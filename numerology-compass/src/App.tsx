import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Eager load - main page
import Index from "./pages/Index";

// Lazy load - secondary pages
const NumerologyGuide = lazy(() => import("./pages/NumerologyGuide"));
const Compatibility = lazy(() => import("./pages/Compatibility"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const Predictions = lazy(() => import("./pages/Predictions"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const Tools = lazy(() => import("./pages/Tools"));
const Courses = lazy(() => import("./pages/Courses"));
const Articles = lazy(() => import("./pages/Articles"));
const Journal = lazy(() => import("./pages/Journal"));
const Premium = lazy(() => import("./pages/Premium"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40" />
      <div className="h-4 w-32 bg-primary/20 rounded" />
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/guide" element={<NumerologyGuide />} />
                  <Route path="/compatibility" element={<Compatibility />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/predictions" element={<Predictions />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/tutorials" element={<Tutorials />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/tools" element={<Tools />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
