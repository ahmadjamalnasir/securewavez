
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VpnState, Server, VpnContextType, ConnectionStats, VpnSettings } from '@/types/vpn';
import { sampleServers } from '@/data/servers';
import { showNotification, getBestServer } from '@/utils/vpnUtils';
import { toast } from 'sonner';
import { useWireGuard } from '@/hooks/use-wireguard';
import vpnApi from '@/api/vpnApi';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '@/hooks/use-settings';

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
  
  const { settings, updateSettings } = useSettings();
  
  // Fetch servers using React Query - fixed the useQuery configuration
  const { data: serversData, isLoading: serversLoading } = useQuery({
    queryKey: ['vpnServers'],
    queryFn: () => vpnApi.getServers(),
    initialData: import.meta.env.DEV ? sampleServers : undefined,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch servers:', error);
        toast.error('Failed to load VPN servers');
      }
    }
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

  // Add state for connection stats
  const [connectionStats, setConnectionStats] = useState<ConnectionStats | null>(null);

  // Load favorite servers from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('vpnFavoriteServers');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setVpnState(prevState => ({
          ...prevState,
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
    setVpnState(prevState => ({
      ...prevState,
      status: wireguardStatus === 'connected' ? 'connected' : 
             wireguardStatus === 'connecting' || wireguardStatus === 'reconnecting' ? 'connecting' : 
             'disconnected'
    }));
    
    // Update connection time when connected
    if (wireguardStatus === 'connected' && vpnState.status !== 'connected') {
      setVpnState(prevState => ({
        ...prevState,
        connectionTime: Date.now()
      }));
    }
  }, [wireguardStatus, vpnState.status]);

  // Update VPN stats when WireGuard stats change
  useEffect(() => {
    if (wireguardStats) {
      setVpnState(prevState => ({
        ...prevState,
        downloadSpeed: calculateSpeed(wireguardStats.bytesReceived, 'download'),
        uploadSpeed: calculateSpeed(wireguardStats.bytesSent, 'upload'),
        ping: wireguardStats.latency,
        dataUsed: calculateDataUsed(wireguardStats)
      }));
      
      // Update connection stats
      setConnectionStats({
        uploadBytes: wireguardStats.bytesSent,
        downloadBytes: wireguardStats.bytesReceived,
        latency: wireguardStats.latency,
        uptime: Date.now() - vpnState.connectionTime
      });
    }
  }, [wireguardStats, vpnState.connectionTime]);

  // Simulate loading initial data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Set Smart Server as default selected server
      setVpnState(prevState => ({
        ...prevState,
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
    setVpnState(prevState => ({ ...prevState, status: 'connecting' }));
    
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
    setVpnState(prevState => ({ ...prevState, selectedServer: server }));
    
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
    setVpnState(prevState => {
      const isFavorite = prevState.favoriteServers.includes(serverId);
      const updatedFavorites = isFavorite
        ? prevState.favoriteServers.filter(id => id !== serverId)
        : [...prevState.favoriteServers, serverId];
      
      // Save to localStorage for persistence
      localStorage.setItem('vpnFavoriteServers', JSON.stringify(updatedFavorites));
      
      // Show toast notification
      if (isFavorite) {
        toast.info('Removed from favorites');
      } else {
        toast.success('Added to favorites');
      }
      
      return {
        ...prevState,
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
  const calculateDataUsed = (stats: any): number => {
    // Convert bytes to MB
    return (stats.bytesReceived + stats.bytesSent) / (1024 * 1024);
  };
  
  // Function to update VPN settings
  const updateVpnSettings = async (newSettings: Partial<VpnSettings>): Promise<void> => {
    try {
      // In a real implementation, this would call an API to update settings
      await updateSettings(newSettings);
    } catch (error) {
      console.error('Failed to update VPN settings:', error);
      toast.error('Failed to update VPN settings');
      throw error;
    }
  };
  
  // Derived properties for the context
  const isConnected = vpnState.status === 'connected';
  const isConnecting = vpnState.status === 'connecting';
  const isDisconnecting = wireguardStatus === 'disconnecting';
  const currentServer = vpnState.selectedServer;
  
  const value = {
    vpnState,
    servers,
    connect,
    disconnect,
    selectServer,
    isLoading: isLoading || serversLoading,
    smartServer,
    toggleFavorite,
    // Add the new derived properties to the context value
    isConnected,
    isConnecting,
    isDisconnecting,
    currentServer,
    connectionStats,
    vpnSettings: settings, // Use settings from useSettings hook
    updateVpnSettings
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
