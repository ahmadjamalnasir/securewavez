
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VpnState, Server, VpnContextType } from '@/types/vpn';
import { sampleServers } from '@/data/servers';
import { showNotification, getBestServer } from '@/utils/vpnUtils';
import { toast } from 'sonner';
import { useWireGuard } from '@/hooks/use-wireguard';
import { ConnectionStats } from '@/types/wireguard';
import vpnApi from '@/api/vpnApi';
import { useQuery } from '@tanstack/react-query';

// Create context with default values
const VpnContext = createContext<VpnContextType | undefined>(undefined);

export const VpnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [vpnState, setVpnState] = useState<VpnState>({
    status: 'disconnected',
    selectedServer: null,
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    dataUsed: 0,
    connectionTime: 0,
    ipAddress: '0.0.0.0',
    favoriteServers: []
  });
  
  // Fetch servers using React Query
  const { data: serversData, isLoading: serversLoading } = useQuery({
    queryKey: ['vpnServers'],
    queryFn: () => vpnApi.getServers(),
    onError: (error) => {
      console.error('Failed to fetch servers:', error);
      toast.error('Failed to load VPN servers');
    },
    // Use sample data in development mode
    initialData: import.meta.env.DEV ? sampleServers : undefined,
  });
  
  const servers = serversData ?? sampleServers;

  // Use the WireGuard hook
  const {
    status: wireguardStatus,
    stats: wireguardStats,
    connect: connectWireGuard,
    disconnect: disconnectWireGuard,
  } = useWireGuard();

  // Initialize the smart server
  const [smartServer, setSmartServer] = useState<Server>(getBestServer(servers));

  // Load favorite servers from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('vpnFavoriteServers');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setVpnState(prev => ({
          ...prev,
          favoriteServers: parsedFavorites
        }));
      }
    } catch (error) {
      console.error('Error loading favorite servers:', error);
    }
  }, []);

  // Update the smart server whenever servers data changes
  useEffect(() => {
    setSmartServer(getBestServer(servers));
  }, [servers]);

  // Update the VPN state based on WireGuard status and stats
  useEffect(() => {
    setVpnState(prev => ({
      ...prev,
      status: wireguardStatus === 'connected' ? 'connected' : 
             wireguardStatus === 'connecting' || wireguardStatus === 'reconnecting' ? 'connecting' : 
             'disconnected'
    }));
    
    // Update connection time when connected
    if (wireguardStatus === 'connected' && prev.status !== 'connected') {
      setVpnState(prev => ({
        ...prev,
        connectionTime: Date.now()
      }));
    }
  }, [wireguardStatus]);

  // Update VPN stats when WireGuard stats change
  useEffect(() => {
    if (wireguardStats) {
      setVpnState(prev => ({
        ...prev,
        downloadSpeed: calculateSpeed(wireguardStats.bytesReceived, 'download'),
        uploadSpeed: calculateSpeed(wireguardStats.bytesSent, 'upload'),
        ping: wireguardStats.latency,
        dataUsed: calculateDataUsed(wireguardStats)
      }));
    }
  }, [wireguardStats]);

  // Simulate loading initial data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Set Smart Server as default selected server
      setVpnState(prev => ({
        ...prev,
        selectedServer: smartServer
      }));
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [smartServer]);

  // Function to connect to VPN
  const connect = async (onSuccess?: () => void) => {
    // If no server is selected, use the smart server
    if (!vpnState.selectedServer) {
      selectServer(smartServer);
      return;
    }
    
    // First set status to connecting
    setVpnState(prev => ({ ...prev, status: 'connecting' }));
    
    // Connect using WireGuard
    const success = await connectWireGuard(vpnState.selectedServer);
    
    if (success && onSuccess) {
      onSuccess();
    }
  };
  
  // Function to disconnect from VPN
  const disconnect = async (onSuccess?: () => void) => {
    const success = await disconnectWireGuard();
    
    if (success && onSuccess) {
      onSuccess();
    }
  };
  
  // Function to select a server
  const selectServer = (server: Server) => {
    setVpnState(prev => ({ ...prev, selectedServer: server }));
    
    // If already connected, reconnect to new server
    if (vpnState.status === 'connected') {
      disconnect();
      setTimeout(() => {
        connect();
      }, 500);
    }
  };
  
  // Function to toggle a server as favorite
  const toggleFavorite = (serverId: string) => {
    setVpnState(prev => {
      const isFavorite = prev.favoriteServers.includes(serverId);
      const updatedFavorites = isFavorite
        ? prev.favoriteServers.filter(id => id !== serverId)
        : [...prev.favoriteServers, serverId];
      
      // Save to localStorage for persistence
      localStorage.setItem('vpnFavoriteServers', JSON.stringify(updatedFavorites));
      
      // Show toast notification
      if (isFavorite) {
        toast.info('Removed from favorites');
      } else {
        toast.success('Added to favorites');
      }
      
      return {
        ...prev,
        favoriteServers: updatedFavorites
      };
    });
  };
  
  // Helper function to calculate download/upload speed
  const calculateSpeed = (bytes: number, type: 'download' | 'upload'): number => {
    // In a real implementation, this would calculate the speed based on
    // the change in bytes over time
    return type === 'download' 
      ? Math.floor(Math.random() * 10) + 5 // 5-15 Mbps
      : Math.floor(Math.random() * 5) + 2; // 2-7 Mbps
  };
  
  // Helper function to calculate total data used
  const calculateDataUsed = (stats: ConnectionStats): number => {
    // Convert bytes to MB
    return (stats.bytesReceived + stats.bytesSent) / (1024 * 1024);
  };
  
  const value = {
    vpnState,
    servers,
    connect,
    disconnect,
    selectServer,
    isLoading: isLoading || serversLoading,
    smartServer,
    toggleFavorite
  };
  
  return <VpnContext.Provider value={value}>{children}</VpnContext.Provider>;
};

// Custom hook to use the VPN context
export const useVpn = () => {
  const context = useContext(VpnContext);
  if (context === undefined) {
    throw new Error('useVpn must be used within a VpnProvider');
  }
  return context;
};

export type { Server };
