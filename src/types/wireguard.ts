
/**
 * WireGuard configuration interface
 */
export interface WireGuardConfig {
  /** Private key for WireGuard interface */
  privateKey: string;
  /** Public key for the server */
  publicKey: string;
  /** Server endpoint in format IP:Port */
  endpoint: string;
  /** Allowed IPs for routing through the tunnel */
  allowedIPs: string[];
  /** DNS servers to use when connected */
  dns: string[];
  /** Pre-shared key for additional security (optional) */
  presharedKey?: string;
  /** Keep-alive interval in seconds */
  persistentKeepalive?: number;
}

/**
 * Status of the VPN connection
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'failed';

/**
 * Connection error types
 */
export type ConnectionErrorType = 
  | 'auth_failed'
  | 'network_unavailable' 
  | 'server_unreachable'
  | 'config_invalid'
  | 'permission_denied'
  | 'unknown';

/**
 * Connection error details
 */
export interface ConnectionError {
  type: ConnectionErrorType;
  message: string;
  details?: string;
  retryable: boolean;
}

/**
 * Connection statistics
 */
export interface ConnectionStats {
  bytesReceived: number;
  bytesSent: number;
  packetsReceived: number;
  packetsSent: number;
  lastHandshake?: Date;
  latency: number;
}
