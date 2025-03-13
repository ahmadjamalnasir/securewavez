
import { useEffect, useState } from 'react';
import { Power, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVpn } from '@/context/VpnContext';
import ConnectionStats from '@/components/vpn/ConnectionStats';
import Layout from '@/components/layout/Layout';
import FadeIn from '@/components/animations/FadeIn';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Home() {
  const { vpnState, connect, disconnect, isLoading } = useVpn();
  const { toast } = useToast();
  const [showLocationToast, setShowLocationToast] = useState(false);

  // Show toast suggesting to change location if no server is selected
  useEffect(() => {
    if (vpnState.status === 'disconnected' && !vpnState.selectedServer && !isLoading && !showLocationToast) {
      setTimeout(() => {
        toast({
          title: "Select a Server",
          description: "For the best performance, select a server location",
          action: (
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/servers'}>
              Select
            </Button>
          ),
        });
        setShowLocationToast(true);
      }, 1500);
    }
  }, [vpnState.status, vpnState.selectedServer, isLoading, toast, showLocationToast]);

  const handleConnectToggle = () => {
    if (vpnState.status === 'connected') {
      disconnect();
      toast({
        title: "Disconnected",
        description: "VPN connection terminated",
      });
    } else {
      connect();
      toast({
        title: "Connected",
        description: vpnState.selectedServer 
          ? `Connected to ${vpnState.selectedServer.name}` 
          : "Connected to fastest server",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin h-12 w-12 border-4 border-vpn-blue border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-500">Loading your secure connection...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <FadeIn>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500 mb-8">Secure your connection with one click</p>
        </FadeIn>
        
        <FadeIn delay={200}>
          <div className="vpn-card mb-6 flex flex-col items-center text-center py-12">
            <div className="relative">
              <div className={cn(
                "w-40 h-40 rounded-full flex items-center justify-center mb-8 transition-all duration-500",
                vpnState.status === 'connected' 
                  ? "bg-gradient-to-br from-green-400 to-green-500" 
                  : vpnState.status === 'connecting'
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-500 animate-pulse" 
                  : "bg-gradient-to-br from-vpn-blue to-vpn-teal"
              )}>
                <Shield className="w-20 h-20 text-white" />
                
                {/* Animated rings for connected state */}
                {vpnState.status === 'connected' && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-connection-wave"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-green-400/20 animate-connection-wave" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute inset-0 rounded-full border-4 border-green-400/10 animate-connection-wave" style={{ animationDelay: '1s' }}></div>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-1">
                {vpnState.status === 'connected' 
                  ? 'Connected' 
                  : vpnState.status === 'connecting' 
                  ? 'Connecting...' 
                  : 'Not Connected'}
              </h2>
              <p className="text-gray-500">
                {vpnState.status === 'connected' 
                  ? `Secure connection to ${vpnState.selectedServer?.name || 'Fastest Server'}` 
                  : vpnState.status === 'connecting' 
                  ? 'Establishing secure connection...' 
                  : 'Your connection is not protected'}
              </p>
            </div>
            
            <button 
              className="vpn-connect-btn"
              onClick={handleConnectToggle}
              disabled={vpnState.status === 'connecting'}
            >
              <span className="vpn-connect-btn-inner">
                <Power className="w-5 h-5" />
                {vpnState.status === 'connected' ? 'Disconnect' : 'Connect'}
              </span>
            </button>
            
            {vpnState.selectedServer && (
              <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                Server: {vpnState.selectedServer.name}
              </div>
            )}
          </div>
        </FadeIn>
        
        <FadeIn delay={400}>
          <ConnectionStats />
        </FadeIn>
      </div>
    </Layout>
  );
}
