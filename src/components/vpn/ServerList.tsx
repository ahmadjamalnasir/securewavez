
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVpn } from '@/context/VpnContext';
import type { Server } from '@/types/vpn';
import { Check, Search, Signal, Lock, Zap, Globe, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import FadeIn from '@/components/animations/FadeIn';
import { useAuth } from '@/context/AuthContext';

export default function ServerList() {
  const { servers, selectServer, vpnState, smartServer, connect, isLoading } = useVpn();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [filteredServers, setFilteredServers] = useState<Server[]>([]);
  const navigate = useNavigate();
  
  // Apply filters to servers
  useEffect(() => {
    let result = servers;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(server => 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply country filter
    if (selectedCountry) {
      result = result.filter(server => server.country === selectedCountry);
    }
    
    // Filter premium servers if user doesn't have a premium subscription
    // This is a placeholder - in a real app, you'd check the user's subscription status
    const hasPremiumSubscription = user?.isVerified; // Using isVerified as a placeholder for premium status
    if (!hasPremiumSubscription) {
      result = result.filter(server => !server.premium);
    }
    
    setFilteredServers(result);
  }, [searchQuery, selectedCountry, servers, user]);
  
  // Get unique countries for filter dropdown
  const uniqueCountries = Array.from(new Set(servers.map(server => server.country))).sort();
  
  // Only group regular servers by country (not the smart server or selected server)
  const regularServers = filteredServers.filter(server => 
    server.id !== 'smart' && 
    (!vpnState.selectedServer || server.id !== vpnState.selectedServer.id)
  );
  
  const groupedServers = regularServers.reduce((acc, server) => {
    if (!acc[server.country]) {
      acc[server.country] = [];
    }
    acc[server.country].push(server);
    return acc;
  }, {} as Record<string, Server[]>);
  
  // Should we show the current selected server
  const showSelectedServer = 
    vpnState.selectedServer && 
    (!searchQuery || 
      vpnState.selectedServer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vpnState.selectedServer.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vpnState.selectedServer.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) &&
    (!selectedCountry || vpnState.selectedServer.country === selectedCountry);
  
  // Should we show Smart Server in the list (and it's not already the selected server)
  const showSmartServer = 
    (!vpnState.selectedServer || vpnState.selectedServer.id !== 'smart') && 
    (!searchQuery || 
      'smart server'.includes(searchQuery.toLowerCase()) || 
      'auto select'.includes(searchQuery.toLowerCase())
    ) &&
    !selectedCountry;
  
  // Function to handle server selection and navigation
  const handleServerSelect = (server: Server) => {
    // Check if server is premium and user doesn't have premium subscription
    const hasPremiumSubscription = user?.isVerified; // Using isVerified as a placeholder for premium status
    
    if (server.premium && !hasPremiumSubscription) {
      // If premium server but no premium subscription, show upgrade message
      navigate('/subscription');
      return;
    }
    
    selectServer(server);
    
    // Navigate to home page and initiate connection
    navigate('/home');
    
    // Add a small delay before connecting to allow navigation to complete
    setTimeout(() => {
      connect();
    }, 300);
  };
  
  // Function to get ping indicator color
  const getPingColor = (ping: number) => {
    if (ping < 60) return 'bg-green-500';
    if (ping < 100) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Function to format server load
  const getLoadIndicator = (load: number) => {
    if (load < 30) return { text: 'Low', color: 'text-green-500' };
    if (load < 70) return { text: 'Medium', color: 'text-yellow-500' };
    return { text: 'High', color: 'text-red-500' };
  };

  // Render a server card
  const renderServerCard = (server: Server) => {
    // Check if server is premium and user doesn't have premium subscription
    const hasPremiumSubscription = user?.isVerified; // Using isVerified as a placeholder for premium status
    const isPremiumLocked = server.premium && !hasPremiumSubscription;
    
    return (
      <div 
        key={server.id}
        className={cn(
          "p-3 rounded-xl border transition-all duration-200",
          vpnState.selectedServer?.id === server.id 
            ? "border-vpn-blue bg-vpn-blue/5" 
            : "border-gray-200 dark:border-gray-800 hover:border-vpn-blue/50",
          isPremiumLocked ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
        )}
        onClick={() => !isPremiumLocked && handleServerSelect(server)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg font-medium text-xs">
              {server.isSmartServer ? 
                <Zap className="w-5 h-5 text-vpn-blue" /> : 
                isPremiumLocked ? 
                  <Lock className="w-5 h-5 text-yellow-600" /> :
                  server.countryCode
              }
            </div>
            
            <div>
              <p className="font-medium">
                {server.name}
                {isPremiumLocked && <span className="text-yellow-600 ml-1">(Premium)</span>}
              </p>
              <p className="text-xs text-gray-500">
                {server.isSmartServer 
                  ? 'Automatically selects best server' 
                  : server.city}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {server.premium && (
              <div className={cn(
                "p-1 rounded",
                isPremiumLocked ? "bg-yellow-100" : "bg-green-100"
              )}>
                {isPremiumLocked ? (
                  <Lock className="w-4 h-4 text-yellow-600" />
                ) : (
                  <Shield className="w-4 h-4 text-green-600" />
                )}
              </div>
            )}
            
            {vpnState.selectedServer?.id === server.id && (
              <div className="w-5 h-5 flex items-center justify-center bg-vpn-blue rounded-full">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs">
          <div className="flex items-center space-x-1">
            <Signal className="w-3 h-3 text-gray-500" />
            <span>{server.ping} ms</span>
            <span className={cn("w-2 h-2 rounded-full", getPingColor(server.ping))}></span>
          </div>
          
          <div className={cn(
            "font-medium",
            server.isSmartServer ? "text-vpn-blue" : getLoadIndicator(server.load).color
          )}>
            {server.isSmartServer ? 'Optimized' : `${getLoadIndicator(server.load).text} Load`}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="vpn-card">
      <div className="space-y-4 mb-4">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search servers..."
            className="vpn-input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Country filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            className={cn(
              "flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap",
              selectedCountry === null 
                ? "bg-vpn-blue text-white" 
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            onClick={() => setSelectedCountry(null)}
          >
            <Globe className="w-4 h-4" />
            <span>All Countries</span>
          </button>
          
          {uniqueCountries.map(country => (
            <button
              key={country}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm whitespace-nowrap",
                selectedCountry === country 
                  ? "bg-vpn-blue text-white" 
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
              onClick={() => setSelectedCountry(country === selectedCountry ? null : country)}
            >
              {country}
            </button>
          ))}
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin h-10 w-10 border-4 border-vpn-blue border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2 pb-2">
          {/* Currently Selected Server at the top */}
          {showSelectedServer && (
            <FadeIn delay={0} className="space-y-1.5">
              <h3 className="font-medium text-sm text-gray-500 px-1">Current Selection</h3>
              {renderServerCard(vpnState.selectedServer!)}
            </FadeIn>
          )}
          
          {/* Smart Server below the selected server */}
          {showSmartServer && (
            <FadeIn delay={100} className="space-y-1.5">
              <h3 className="font-medium text-sm text-gray-500 px-1">Recommended</h3>
              {renderServerCard(smartServer)}
            </FadeIn>
          )}
          
          {/* Regular servers grouped by country */}
          {Object.entries(groupedServers).map(([country, countryServers], index) => (
            <FadeIn key={country} delay={(index + 2) * 100} className="space-y-1.5">
              <h3 className="font-medium text-sm text-gray-500 px-1">{country}</h3>
              
              {countryServers.map(renderServerCard)}
            </FadeIn>
          ))}
          
          {filteredServers.length === 0 && !showSelectedServer && !showSmartServer && (
            <div className="text-center py-8">
              <p className="text-gray-500">No servers found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
