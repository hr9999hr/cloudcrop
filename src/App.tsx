import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import GardenDashboard from "@/pages/GardenDashboard";
import InventoryPage from "@/pages/InventoryPage";
import FertilizerPage from "@/pages/FertilizerPage";
import MarketplacePage from "@/pages/MarketplacePage";
import WalletPage from "@/pages/WalletPage";
import DeliveryPage from "@/pages/DeliveryPage";
import SettingsPage from "@/pages/SettingsPage";
import MissionsPage from "@/pages/MissionsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">🌱</div>
          <p className="text-muted-foreground font-medium">Loading your garden...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/" element={<ProtectedRoute><AppLayout><GardenDashboard /></AppLayout></ProtectedRoute>} />
    <Route path="/missions" element={<ProtectedRoute><AppLayout><MissionsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/inventory" element={<ProtectedRoute><AppLayout><InventoryPage /></AppLayout></ProtectedRoute>} />
    <Route path="/fertilizer" element={<ProtectedRoute><AppLayout><FertilizerPage /></AppLayout></ProtectedRoute>} />
    <Route path="/marketplace" element={<ProtectedRoute><AppLayout><MarketplacePage /></AppLayout></ProtectedRoute>} />
    <Route path="/delivery" element={<ProtectedRoute><AppLayout><DeliveryPage /></AppLayout></ProtectedRoute>} />
    <Route path="/wallet" element={<ProtectedRoute><AppLayout><WalletPage /></AppLayout></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
