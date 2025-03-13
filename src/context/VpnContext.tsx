
import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

// Context interface
interface VpnContextType {
  vpnState: VpnState;
  servers: Server[];
  connect: () => void;
  disconnect: () => void;
  selectServer: (server: Server) => void;
  isLoading: boolean;
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

  // Simulate loading initial data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to connect to VPN
  const connect = () => {
    // If no server is selected, use the first one or the fastest one
    if (!vpnState.selectedServer) {
      // Sort by ping and select the lowest ping server
      const sortedServers = [...servers].sort((a, b) => a.ping - b.ping);
      selectServer(sortedServers[0]);
      return;
    }
    
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
    }, 2000);
  };
  
  // Function to disconnect from VPN
  const disconnect = () => {
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
  };
  
  // Function to select a server
  const selectServer = (server: Server) => {
    setVpnState(prev => ({ ...prev, selectedServer: server }));
    
    // If already connected, reconnect to new server
    if (vpnState.status === 'connected') {
      disconnect();
      setTimeout(connect, 500);
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
    isLoading
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
