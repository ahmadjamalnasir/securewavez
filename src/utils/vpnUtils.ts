
import { Server } from '@/types/vpn';
import { toast } from '@/hooks/use-toast';

/**
 * Get notification settings from localStorage
 * 
 * @returns {boolean} Whether notifications are enabled
 */
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

/**
 * Show notification only if enabled in settings - specifically for connection events
 * 
 * @param {string} title - The notification title
 * @param {string} description - The notification description
 */
export const showNotification = (title: string, description: string) => {
  if (getNotificationSettings()) {
    toast({
      title,
      description,
    });
  }
};

/**
 * Create a smart server based on the best performing server
 * 
 * Uses a weighted score system based on ping and server load
 * to determine the optimal server.
 * 
 * @param {Server[]} servers - Array of available servers
 * @returns {Server} The best server as a Smart Server
 */
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

/**
 * Filter servers based on advanced criteria
 * 
 * @param {Server[]} servers - Array of servers to filter
 * @param {object} filters - Filter criteria
 * @param {string} filters.searchQuery - Text to search for in server name/location
 * @param {string|null} filters.country - Country to filter by
 * @param {string} filters.loadFilter - Filter by server load ('all', 'low', 'medium', 'high')
 * @param {string} filters.pingFilter - Filter by ping ('all', 'excellent', 'good', 'fair')
 * @param {boolean} filters.favoritesOnly - Show only favorited servers
 * @param {string[]} filters.favoriteServers - Array of favorite server IDs
 * @returns {Server[]} Filtered array of servers
 */
export const filterServers = (
  servers: Server[],
  filters: {
    searchQuery: string;
    country: string | null;
    loadFilter: string;
    pingFilter: string;
    favoritesOnly: boolean;
    favoriteServers: string[];
  }
): Server[] => {
  let result = [...servers];
  
  // Apply text search filter
  if (filters.searchQuery) {
    result = result.filter(server => 
      server.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      server.country.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      server.city.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );
  }
  
  // Apply country filter
  if (filters.country) {
    result = result.filter(server => server.country === filters.country);
  }
  
  // Apply favorites filter
  if (filters.favoritesOnly) {
    result = result.filter(server => filters.favoriteServers.includes(server.id));
  }
  
  // Apply load filter
  if (filters.loadFilter !== 'all') {
    result = result.filter(server => {
      if (filters.loadFilter === 'low') return server.load < 30;
      if (filters.loadFilter === 'medium') return server.load >= 30 && server.load < 70;
      if (filters.loadFilter === 'high') return server.load >= 70;
      return true;
    });
  }
  
  // Apply ping filter
  if (filters.pingFilter !== 'all') {
    result = result.filter(server => {
      if (filters.pingFilter === 'excellent') return server.ping < 50;
      if (filters.pingFilter === 'good') return server.ping < 100;
      return true; // 'fair' includes all
    });
  }
  
  return result;
};
