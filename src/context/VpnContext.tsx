
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VpnState, Server, VpnContextType } from '@/types/vpn';
import { sampleServers } from '@/data/servers';
import { showNotification, getBestServer } from '@/utils/vpnUtils';

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
    ipAddress: '0.0.0.0'
  });
  const [servers, setServers] = useState<Server[]>(sampleServers);
  const [connectionInterval, setConnectionInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize the smart server
  const [smartServer, setSmartServer] = useState<Server>(getBestServer(servers));

  // Update the smart server whenever servers data changes
  useEffect(() => {
    setSmartServer(getBestServer(servers));
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

export type { Server };

