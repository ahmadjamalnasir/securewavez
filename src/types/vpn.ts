
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
export interface VpnContextType {
  vpnState: VpnState;
  servers: Server[];
  connect: (onSuccess?: () => void) => void;
  disconnect: (onSuccess?: () => void) => void;
  selectServer: (server: Server) => void;
  isLoading: boolean;
  smartServer: Server;
}
