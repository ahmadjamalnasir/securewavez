
import { useState, useEffect, useCallback } from 'react';
import { WireGuardConfig, ConnectionStatus, ConnectionError, ConnectionStats } from '@/types/wireguard';
import wireguardService from '@/services/wireguardService';
import { Server } from '@/types/vpn';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';

/**
 * Hook for managing WireGuard VPN connection
 */
export function useWireGuard() {
  const [status, setStatus] = useState<ConnectionStatus>(wireguardService.getStatus());
  const [error, setError] = useState<ConnectionError | null>(wireguardService.getError());
  const [stats, setStats] = useState<ConnectionStats | null>(null);
  const { settings } = useSettings();

  // Listen for status changes
  useEffect(() => {
    const removeStatusListener = wireguardService.onStatusChange(setStatus);
    const removeErrorListener = wireguardService.onError(setError);
    const removeStatsListener = wireguardService.onStatsUpdate(setStats);
    
    return () => {
      removeStatusListener();
      removeErrorListener();
      removeStatsListener();
    };
  }, []);

  // Apply settings when they change
  useEffect(() => {
    // Apply kill switch setting
    wireguardService.setKillSwitch(settings.killSwitch);
    
    // Apply DNS leak protection setting
    wireguardService.setDnsLeakProtection(settings.dnsLeakProtection);
  }, [settings.killSwitch, settings.dnsLeakProtection]);

  /**
   * Connect to a server
   */
  const connect = useCallback(async (server: Server) => {
    try {
      // Generate configuration for the selected server
      const config = await wireguardService.generateConfig(server);
      
      // Connect using the generated configuration
      await wireguardService.connect(config);
      
      // Show success notification if enabled
      if (settings.notifications) {
        toast.success(`Connected to ${server.name}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to connect:', error);
      
      // Show error notification
      toast.error('Failed to connect to VPN');
      
      return false;
    }
  }, [settings.notifications]);

  /**
   * Disconnect from the current server
   */
  const disconnect = useCallback(async () => {
    try {
      await wireguardService.disconnect();
      
      // Show success notification if enabled
      if (settings.notifications) {
        toast.success('Disconnected from VPN');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to disconnect:', error);
      
      // Show error notification
      toast.error('Failed to disconnect from VPN');
      
      return false;
    }
  }, [settings.notifications]);

  /**
   * Check if connected to VPN
   */
  const isConnected = useCallback(() => {
    return wireguardService.isConnected();
  }, []);

  return {
    status,
    error,
    stats,
    connect,
    disconnect,
    isConnected,
  };
}
