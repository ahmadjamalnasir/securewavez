
import { Server } from '@/types/vpn';
import { toast } from '@/hooks/use-toast';

// Get notification settings from localStorage
export const getNotificationSettings = (): boolean => {
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
export const showNotification = (title: string, description: string) => {
  if (getNotificationSettings()) {
    toast({
      title,
      description,
    });
  }
};

// Create a smart server based on the best performing server
export const getBestServer = (servers: Server[]): Server => {
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
