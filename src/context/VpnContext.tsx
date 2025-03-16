
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Define the shape of our VPN state
interface VpnState {
  status: 'disconnected' | 'connecting' | 'connected';
  selectedServer: Server | null;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  dataUsed: number;
  connectionTime: number;
  ipAddress: string;
}

// Define a server object
export interface Server {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  ping: number;
  load: number;
  premium: boolean;
  isSmartServer?: boolean;
}

// Context interface
interface VpnContextType {
  vpnState: VpnState;
  servers: Server[];
  connect: (onSuccess?: () => void) => void;
  disconnect: (onSuccess?: () => void) => void;
  selectServer: (server: Server) => void;
  isLoading: boolean;
  smartServer: Server;
}

// Create context with default values
const VpnContext = createContext<VpnContextType | undefined>(undefined);

// Sample server data
const sampleServers: Server[] = [
  {
    id: '1',
    name: 'US Server 1',
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    ping: 45,
    load: 65,
    premium: false
  },
  {
    id: '2',
    name: 'UK Server 1',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    ping: 78,
    load: 45,
    premium: false
  },
  {
    id: '3',
    name: 'JP Server 1',
    country: 'Japan',
    countryCode: 'JP',
    city: 'Tokyo',
    ping: 112,
    load: 30,
    premium: false
  },
  {
    id: '4',
    name: 'DE Server 1',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Frankfurt',
    ping: 62,
    load: 55,
    premium: false
  },
  {
    id: '5',
    name: 'SG Server 1',
    country: 'Singapore',
    countryCode: 'SG',
    city: 'Singapore',
    ping: 98,
    load: 40,
    premium: true
  },
  {
    id: '6',
    name: 'CA Server 1',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Toronto',
    ping: 52,
    load: 70,
    premium: false
  },
  {
    id: '7',
    name: 'AU Server 1',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Sydney',
    ping: 135,
    load: 25,
    premium: true
  },
  {
    id: '8',
    name: 'FR Server 1',
    country: 'France',
    countryCode: 'FR',
    city: 'Paris',
    ping: 68,
    load: 50,
    premium: false
  },
];

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
    ipAddress: '0.0.0.0'
  });
  const [servers, setServers] = useState<Server[]>(sampleServers);
  const [connectionInterval, setConnectionInterval] = useState<NodeJS.Timeout | null>(null);

  // Check notification settings from localStorage
  const getNotificationSettings = (): boolean => {
    try {
      const settingsStr = localStorage.getItem('vpnSettings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        return settings.notifications === true; // Ensure it's strictly a boolean
      }
      return true; // Default to true if no settings found
    } catch (error) {
      console.error('Error retrieving notification settings:', error);
      return true; // Default to true on error
    }
  };
  
  // Show notification only if enabled in settings
  const showNotification = (title: string, description: string) => {
    if (getNotificationSettings()) {
      toast({
        title,
        description,
      });
    }
  };

  // Create a Smart Server based on the best performing server
  const getBestServer = (): Server => {
    // Create a scoring system (lower is better)
    // Score = ping * 0.7 + load * 0.3
    const scoredServers = servers.map(server => ({
      ...server,
      score: server.ping * 0.7 + server.load * 0.3
    }));
    
    // Sort by score and get the best one
    const bestServer = [...scoredServers].sort((a, b) => a.score - b.score)[0];
    
    return {
      id: 'smart',
      name: 'Smart Server',
      country: 'Auto Select',
      countryCode: 'AUTO',
      city: bestServer.city,
      ping: bestServer.ping,
      load: bestServer.load,
      premium: false,
      isSmartServer: true
    };
  };

  // Initialize the smart server
  const [smartServer, setSmartServer] = useState<Server>(getBestServer());

  // Update the smart server whenever servers data changes
  useEffect(() => {
    setSmartServer(getBestServer());
  }, [servers]);

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
  const connect = (onSuccess?: () => void) => {
    // If no server is selected, use the smart server
    if (!vpnState.selectedServer) {
      selectServer(smartServer);
      return;
    }
    
    // First set status to connecting
    setVpnState(prev => ({ ...prev, status: 'connecting' }));
    
    // Simulate connection delay
    setTimeout(() => {
      setVpnState(prev => ({
        ...prev,
        status: 'connected',
        ping: prev.selectedServer?.ping || 50,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        connectionTime: Date.now()
      }));
      
      // Start interval to update stats while connected
      const interval = setInterval(() => {
        setVpnState(prev => ({
          ...prev,
          downloadSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 Mbps
          uploadSpeed: Math.floor(Math.random() * 5) + 2, // 2-7 Mbps
          dataUsed: prev.dataUsed + (Math.random() * 0.1) // Add 0-0.1 MB
        }));
      }, 3000);
      
      setConnectionInterval(interval);
      
      // Show connection success notification if enabled
      showNotification(
        "Connected", 
        `Successfully connected to ${vpnState.selectedServer?.name || 'VPN'}`
      );
      
      // Call the onSuccess callback only when connection is successful
      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  };
  
  // Function to disconnect from VPN
  const disconnect = (onSuccess?: () => void) => {
    if (connectionInterval) {
      clearInterval(connectionInterval);
      setConnectionInterval(null);
    }
    
    setVpnState(prev => ({
      ...prev,
      status: 'disconnected',
      downloadSpeed: 0,
      uploadSpeed: 0,
      connectionTime: 0
    }));
    
    // Show disconnection notification if enabled
    showNotification(
      "Disconnected", 
      `Successfully disconnected from ${vpnState.selectedServer?.name || 'VPN'}`
    );
    
    // Call the onSuccess callback
    if (onSuccess) {
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
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (connectionInterval) {
        clearInterval(connectionInterval);
      }
    };
  }, [connectionInterval]);
  
  const value = {
    vpnState,
    servers,
    connect,
    disconnect,
    selectServer,
    isLoading,
    smartServer
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
