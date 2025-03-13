
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { VpnProvider } from "@/context/VpnContext";
import NotFound from "./pages/NotFound";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ServerSelection from "./pages/ServerSelection";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VpnProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/servers" element={<ServerSelection />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/subscription" element={<Subscription />} />
            {/* Redirect /index to home */}
            <Route path="/index" element={<Navigate to="/home" replace />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VpnProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
