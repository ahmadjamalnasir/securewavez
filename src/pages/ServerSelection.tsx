
import { Globe, MapPin, Zap } from 'lucide-react';
import { lazy, Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import FadeIn from '@/components/animations/FadeIn';
import { useVpn } from '@/context/VpnContext';

// Lazy load ServerList component for code splitting
const ServerList = lazy(() => import('@/components/vpn/ServerList'));

export default function ServerSelection() {
  const { vpnState } = useVpn();
  
  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <FadeIn>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Server Selection</h1>
              <p className="text-gray-500">Choose a server location for optimal performance</p>
            </div>
            <div className="bg-vpn-blue/10 p-2 rounded-full">
              <Globe className="w-6 h-6 text-vpn-blue" />
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={200}>
          <div className="vpn-card mb-6 p-0 overflow-hidden">
            <div className="aspect-[2/1] bg-gray-100 dark:bg-gray-800 relative">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                alt="World Map"
                className="w-full h-full object-cover opacity-70"
              />
              
              {/* Display selected server pin on map */}
              {vpnState.selectedServer && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute animate-pulse">
                    <div className="relative">
                      {vpnState.selectedServer.isSmartServer ? (
                        <div className="flex flex-col items-center">
                          <Zap className="w-8 h-8 text-vpn-blue" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-vpn-blue text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            Smart Server
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <MapPin className="w-8 h-8 text-vpn-blue" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-vpn-blue text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {vpnState.selectedServer.name}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold">Global Server Network</h3>
                <p className="text-sm text-gray-500">Connect to servers in multiple countries</p>
              </div>
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={300}>
          <Suspense fallback={
            <div className="vpn-card flex justify-center items-center py-16">
              <div className="animate-spin h-10 w-10 border-4 border-vpn-blue border-t-transparent rounded-full"></div>
            </div>
          }>
            <ServerList />
          </Suspense>
        </FadeIn>
      </div>
    </Layout>
  );
}
