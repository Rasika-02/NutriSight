import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import HowItWorksPage from "./pages/HowItWorksPage";
import MealPlansPage from "./pages/MealPlansPage";
import BudgetPage from "./pages/BudgetPage";
import HealthPage from "./pages/HealthPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD
import ScrollToTop from "./components/ScrollToTop";
=======
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
<<<<<<< HEAD
          <ScrollToTop />
          <main className="min-h-screen">
=======
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/meal-plans" element={<MealPlansPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
<<<<<<< HEAD
        </main>
=======
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
