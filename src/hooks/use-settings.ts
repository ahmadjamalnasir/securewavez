
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import settingsApi, { VpnSettings, SplitTunnelingConfig } from '@/api/settingsApi';
import { toast } from 'sonner';

// Default settings
const defaultSettings: VpnSettings = {
  killSwitch: true,
  autoConnect: false,
  notifications: true,
  theme: 'system',
  splitTunneling: false,
  ipv6Protection: true,
  dnsLeakProtection: true,
  excludedApps: []
};

export function useSettings() {
  const queryClient = useQueryClient();
  
  // Fetch settings from API or localStorage
  const { 
    data: settings = defaultSettings, 
    isLoading: isLoadingSettings,
    isError,
    error
  } = useQuery({
    queryKey: ['vpnSettings'],
    queryFn: async () => {
      try {
        // For development/preview, use localStorage
        if (import.meta.env.DEV || !import.meta.env.VITE_API_URL) {
          const savedSettings = localStorage.getItem('vpnSettings');
          if (savedSettings) {
            return JSON.parse(savedSettings) as VpnSettings;
          }
          return defaultSettings;
        }
        
        // In production, fetch from API
        return await settingsApi.getSettings();
      } catch (err) {
        console.error('Error fetching settings:', err);
        // Fallback to localStorage even in production if API fails
        const savedSettings = localStorage.getItem('vpnSettings');
        if (savedSettings) {
          return JSON.parse(savedSettings) as VpnSettings;
        }
        return defaultSettings;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  
  // Update settings mutation
  const { 
    mutate: updateSettings,
    isPending: isUpdating
  } = useMutation({
    mutationFn: async (newSettings: Partial<VpnSettings>) => {
      // Merge with current settings
      const mergedSettings = { ...settings, ...newSettings };
      
      // For development/preview, use localStorage
      if (import.meta.env.DEV || !import.meta.env.VITE_API_URL) {
        localStorage.setItem('vpnSettings', JSON.stringify(mergedSettings));
        return mergedSettings;
      }
      
      // In production, update via API
      return await settingsApi.updateSettings(newSettings);
    },
    onSuccess: (updatedSettings) => {
      // Update cache with new settings
      queryClient.setQueryData(['vpnSettings'], updatedSettings);
      
      // Show success toast
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings. Please try again.');
    }
  });
  
  // Update split tunneling configuration
  const { 
    mutate: updateSplitTunnelingConfig,
    isPending: isUpdatingSplitTunneling
  } = useMutation({
    mutationFn: async (config: SplitTunnelingConfig) => {
      // For development/preview, use localStorage to update settings
      if (import.meta.env.DEV || !import.meta.env.VITE_API_URL) {
        // Get current settings
        const currentSettingsStr = localStorage.getItem('vpnSettings');
        const currentSettings = currentSettingsStr 
          ? JSON.parse(currentSettingsStr) as VpnSettings 
          : defaultSettings;
        
        // Update with new split tunneling config
        const updatedSettings = { 
          ...currentSettings,
          splitTunneling: config.enabled,
          excludedApps: config.excludedApps
        };
        
        localStorage.setItem('vpnSettings', JSON.stringify(updatedSettings));
        
        // Also save excluded apps separately for convenience
        if (config.excludedApps.length > 0) {
          localStorage.setItem('vpnExcludedApps', JSON.stringify(config.excludedApps));
        } else {
          localStorage.removeItem('vpnExcludedApps');
        }
        
        return config;
      }
      
      // In production, update via API
      return await settingsApi.updateSplitTunneling(config);
    },
    onSuccess: (config) => {
      // Update cache with new split tunneling config
      queryClient.setQueryData(['vpnSettings'], (oldSettings: VpnSettings | undefined) => {
        if (!oldSettings) return defaultSettings;
        return {
          ...oldSettings,
          splitTunneling: config.enabled,
          excludedApps: config.excludedApps
        };
      });
      
      // Show success toast
      toast.success('Split tunneling configuration updated');
    },
    onError: (error) => {
      console.error('Error updating split tunneling:', error);
      toast.error('Failed to update split tunneling. Please try again.');
    }
  });
  
  // Handle setting toggle
  const handleToggle = (key: keyof VpnSettings) => {
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: !settings[key as keyof typeof settings] });
    }
  };
  
  // Handle radio change
  const handleRadioChange = (key: keyof VpnSettings, value: string) => {
    updateSettings({ [key]: value });
  };
  
  // Update excluded apps
  const updateExcludedApps = (apps: string[]) => {
    updateSplitTunnelingConfig({
      enabled: settings.splitTunneling,
      excludedApps: apps
    });
  };
  
  // Toggle split tunneling
  const toggleSplitTunneling = () => {
    const newEnabledState = !settings.splitTunneling;
    
    updateSplitTunnelingConfig({
      enabled: newEnabledState,
      excludedApps: settings.excludedApps || []
    });
  };
  
  return {
    settings,
    isLoading: isLoadingSettings,
    isUpdating: isUpdating || isUpdatingSplitTunneling,
    handleToggle,
    handleRadioChange,
    updateSettings,
    updateExcludedApps,
    toggleSplitTunneling,
    error
  };
}
