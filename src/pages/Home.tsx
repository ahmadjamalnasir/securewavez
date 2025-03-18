import { useEffect, useState } from 'react';
import { Power, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVpn } from '@/context/VpnContext';
import ConnectionStats from '@/components/vpn/ConnectionStats';
import Layout from '@/components/layout/Layout';
import FadeIn from '@/components/animations/FadeIn';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { showNotification } from '@/utils/vpnUtils';

export default function Home() {
  const { vpnState, connect, disconnect, isLoading } = useVpn();
  const { toast } = useToast();
  const [showLocationToast, setShowLocationToast] = useState(false);
  const [isFirstConnectionAttempt, setIsFirstConnectionAttempt] = useState(true);

  // Show toast suggesting to change location if no server is selected
  useEffect(() => {
    if (vpnState.status === 'disconnected' && !vpnState.selectedServer && !isLoading && !showLocationToast) {
      setTimeout(() => {
        showNotification(
          "Select a Server",
          "For the best performance, select a server location"
        );
        setShowLocationToast(true);
      }, 1500);
    }
  }, [vpnState.status, vpnState.selectedServer, isLoading, showLocationToast]);

  // Reset first connection attempt flag when disconnected
  useEffect(() => {
    if (vpnState.status === 'disconnected') {
      setIsFirstConnectionAttempt(true);
    }
  }, [vpnState.status]);

  // Handle the connection/disconnection and show appropriate toast messages
  const handleConnectToggle = () => {
    if (vpnState.status === 'connected') {
      disconnect(() => {
        toast({
          title: "Disconnected",
          description: "VPN connection terminated",
        });
      });
    } else if (vpnState.status === 'disconnected') {
      // Show connecting toast immediately
      showNotification(
        "Connecting...",
        vpnState.selectedServer 
          ? vpnState.selectedServer.isSmartServer
            ? "Connecting to the best available server"
            : `Connecting to ${vpnState.selectedServer.name}` 
          : "Connecting to fastest server"
      );
      
      // Connect and show connected toast on success
      connect(() => {
        // Nothing to do here - the notification is shown in the connect function
        
        // Set first connection attempt to false to prevent UI sync issues
        setIsFirstConnectionAttempt(false);
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
                  ? vpnState.selectedServer?.isSmartServer
                    ? 'Secure connection to Smart Server'
                    : `Secure connection to ${vpnState.selectedServer?.name || 'Fastest Server'}`
                  : vpnState.status === 'connecting' 
                  ? 'Establishing secure connection...' 
                  : 'Your connection is not protected'}
              </p>
            </div>
            
            <button 
              className={cn(
                "vpn-connect-btn",
                vpnState.status === 'connecting' && "opacity-50 cursor-not-allowed"
              )}
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
                <div className={cn(
                  "w-3 h-3 rounded-full mr-2",
                  vpnState.status === 'connected' ? "bg-green-500" : 
                  vpnState.status === 'connecting' ? "bg-yellow-500 animate-pulse" : "bg-gray-300"
                )}></div>
                Server: {
                  vpnState.selectedServer.isSmartServer 
                    ? 'Smart Server (Auto-Optimized)' 
                    : vpnState.selectedServer.name
                }
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
