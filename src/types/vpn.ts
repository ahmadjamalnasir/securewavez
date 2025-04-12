
// Define the shape of our VPN state
export interface VpnState {
  status: 'disconnected' | 'connecting' | 'connected';
  selectedServer: Server | null;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  dataUsed: number;
  connectionTime: number;
  ipAddress: string;
  favoriteServers: string[]; // Array of server IDs that are favorites
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
  isFavorite?: boolean; // Flag to indicate if server is a favorite
}

// Define the connection stats interface
export interface ConnectionStats {
  uploadBytes: number;
  downloadBytes: number;
  latency: number;
  uptime: number;
}

// Define the VPN settings interface
export interface VpnSettings {
  autoConnect: boolean;
  killSwitch: boolean;
  dnsLeakProtection: boolean;
  splitTunneling: boolean;
  excludedApps: string[];
  notifications: boolean;
  theme: string;
  ipv6Protection: boolean;
}

// Context interface
export interface VpnContextType {
  vpnState: VpnState;
  servers: Server[];
  connect: (onSuccess?: () => void) => void;
  disconnect: (onSuccess?: () => void) => void;
  selectServer: (server: Server) => void;
  isLoading: boolean;
  smartServer: Server;
  toggleFavorite: (serverId: string) => void; // Toggle favorite status
  
  // Added the missing properties from Home.tsx
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  currentServer: Server | null;
  connectionStats: ConnectionStats | null;
  vpnSettings: VpnSettings | null;
  updateVpnSettings: (settings: Partial<VpnSettings>) => Promise<void>;
}
