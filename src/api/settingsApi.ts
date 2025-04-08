
import axiosClient, { handleApiResponse } from './axiosClient';

export interface SplitTunnelingConfig {
  enabled: boolean;
  excludedApps: string[];
}

export interface VpnSettings {
  killSwitch: boolean;
  autoConnect: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  splitTunneling: boolean;
  ipv6Protection: boolean;
  dnsLeakProtection: boolean;
  excludedApps?: string[];
}

const settingsApi = {
  // Get user settings
  getSettings: () => 
    handleApiResponse<VpnSettings>(axiosClient.get('/settings')),
  
  // Update user settings
  updateSettings: (settings: Partial<VpnSettings>) => 
    handleApiResponse<VpnSettings>(axiosClient.put('/settings', settings)),

  // Specific API for split tunneling to handle the excluded apps
  updateSplitTunneling: (config: SplitTunnelingConfig) => 
    handleApiResponse<SplitTunnelingConfig>(
      axiosClient.put('/settings/split-tunneling', config)
    ),
  
  // Get the list of installed applications (this would typically be handled by native code)
  getInstalledApps: () => 
    handleApiResponse<{id: string, name: string, icon: string}[]>(
      axiosClient.get('/system/installed-apps')
    ),
};

export default settingsApi;
