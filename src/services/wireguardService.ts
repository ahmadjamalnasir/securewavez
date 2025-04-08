import { 
  WireGuardConfig, 
  ConnectionError, 
  ConnectionStatus, 
  ConnectionStats, 
  ConnectionErrorType 
} from '@/types/wireguard';
import { Server } from '@/types/vpn';
import { encryptData, decryptData } from '@/utils/cryptoUtils';
import { toast } from 'sonner';
import dnsService from './dnsService';
import killSwitchService from './killSwitchService';

/**
 * Service for managing WireGuard configurations and connections
 * @class WireGuardService
 */
class WireGuardService {
  private currentConfig: WireGuardConfig | null = null;
  private status: ConnectionStatus = 'disconnected';
  private connectionError: ConnectionError | null = null;
  private statusListeners: ((status: ConnectionStatus) => void)[] = [];
  private errorListeners: ((error: ConnectionError | null) => void)[] = [];
  private statsListeners: ((stats: ConnectionStats) => void)[] = [];
  private statsInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private secureStorageKey = 'encrypted_wg_config';
  private connectionStartTime: number | null = null;

  /**
   * Generate WireGuard configuration for a server
   * @param server The server to generate configuration for
   * @returns Generated WireGuard configuration
   */
  async generateConfig(server: Server): Promise<WireGuardConfig> {
    try {
      console.log('Generating WireGuard config for server:', server.name);
      
      // In a production environment, this would make an API call to get the configuration
      // using proper authentication
      
      // This is a placeholder that would be replaced with actual implementation
      const config: WireGuardConfig = {
        privateKey: this.generatePrivateKey(),
        publicKey: this.generatePublicKey(server),
        endpoint: `${server.id}.${server.country.toLowerCase()}.vpnprovider.com:51820`,
        allowedIPs: ['0.0.0.0/0', '::/0'], // Route all traffic through VPN
        dns: ['1.1.1.1', '1.0.0.1'], // Cloudflare DNS
        persistentKeepalive: 25
      };
      
      return config;
    } catch (error) {
      console.error('Failed to generate WireGuard config:', error);
      throw this.createError(
        'config_invalid', 
        'Failed to generate WireGuard configuration', 
        error instanceof Error ? error.message : 'Unknown error',
        true
      );
    }
  }

  /**
   * Generate a secure private key (placeholder implementation)
   * @returns A private key for WireGuard
   * @private
   */
  private generatePrivateKey(): string {
    // In a real implementation, this would use the WireGuard API
    // or a cryptographically secure random number generator
    return 'placeholder_private_key_' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate a public key based on server information (placeholder implementation)
   * @param server The server to generate a public key for
   * @returns A public key for WireGuard
   * @private
   */
  private generatePublicKey(server: Server): string {
    // In a real implementation, this would use the WireGuard API
    // or retrieve the public key from the server's configuration
    return `placeholder_public_key_${server.id}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Securely store a WireGuard configuration
   * @param config The configuration to store
   */
  async saveConfig(config: WireGuardConfig): Promise<void> {
    try {
      console.log('Securely saving WireGuard config');
      
      // Encrypt the configuration before storing
      // In a real implementation, this would use platform-specific secure storage
      // such as Keychain on iOS or Keystore on Android
      const configString = JSON.stringify(config);
      const encryptedConfig = await encryptData(configString);
      
      // In a web app, we would use a more secure storage mechanism
      // but for demonstration, we're using localStorage with encryption
      localStorage.setItem(this.secureStorageKey, encryptedConfig);
      
      this.currentConfig = config;
    } catch (error) {
      console.error('Failed to save WireGuard config securely:', error);
      throw this.createError(
        'unknown', 
        'Failed to securely store VPN configuration', 
        error instanceof Error ? error.message : 'Unknown error',
        false
      );
    }
  }

  /**
   * Retrieve a stored WireGuard configuration
   * @returns The stored configuration or null if none exists
   */
  async loadConfig(): Promise<WireGuardConfig | null> {
    try {
      console.log('Loading WireGuard config from secure storage');
      
      // In a real implementation, this would use platform-specific secure storage
      const encryptedConfig = localStorage.getItem(this.secureStorageKey);
      
      if (!encryptedConfig) {
        return null;
      }
      
      // Decrypt the configuration
      const decryptedConfig = await decryptData(encryptedConfig);
      const config = JSON.parse(decryptedConfig) as WireGuardConfig;
      
      this.currentConfig = config;
      return config;
    } catch (error) {
      console.error('Failed to load WireGuard config:', error);
      // Don't throw here, just return null and let the caller handle it
      return null;
    }
  }

  /**
   * Connect to VPN using the provided or stored configuration
   * @param config Optional configuration to use for connection
   * @returns Promise that resolves when connected
   */
  async connect(config?: WireGuardConfig): Promise<boolean> {
    try {
      this.updateStatus('connecting');
      
      // Enable kill switch before attempting to connect
      await killSwitchService.enable();
      
      const configToUse = config || await this.loadConfig();
      if (!configToUse) {
        throw this.createError('config_invalid', 'No VPN configuration found');
      }
      
      // In a real implementation, this would interact with the system's 
      // WireGuard interface using platform-specific APIs
      console.log('Connecting to VPN with config:', configToUse);
      
      // Enable DNS leak protection
      await dnsService.configureDns(configToUse.dns);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store the configuration if it was provided
      if (config) {
        await this.saveConfig(config);
      }
      
      // Start monitoring connection stats
      this.startStatsMonitoring();
      
      this.updateStatus('connected');
      this.resetError();
      this.reconnectAttempts = 0;
      this.connectionStartTime = Date.now();
      
      return true;
    } catch (error) {
      console.error('Failed to connect to VPN:', error);
      
      // Disable kill switch if connection failed
      await killSwitchService.disable();
      
      if (error instanceof Error) {
        this.updateError(this.createError('unknown', error.message));
      } else if ((error as ConnectionError).type) {
        this.updateError(error as ConnectionError);
      } else {
        this.updateError(this.createError('unknown', 'Unknown connection error'));
      }
      
      this.updateStatus('disconnected');
      return false;
    }
  }

  /**
   * Disconnect from the VPN
   * @returns Promise that resolves when disconnected
   */
  async disconnect(): Promise<boolean> {
    try {
      // In a real implementation, this would interact with the system's
      // WireGuard interface to tear down the connection
      console.log('Disconnecting from VPN');
      
      // Stop monitoring connection stats
      this.stopStatsMonitoring();
      
      // Reset DNS to system defaults
      await dnsService.resetDns();
      
      // Disable kill switch after disconnecting
      await killSwitchService.disable();
      
      // Simulate disconnection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.updateStatus('disconnected');
      this.resetError();
      this.connectionStartTime = null;
      
      return true;
    } catch (error) {
      console.error('Failed to disconnect from VPN:', error);
      
      // Even if disconnection fails, consider the client as disconnected
      this.updateStatus('disconnected');
      return false;
    }
  }

  /**
   * Get the current connection status
   * @returns Current connection status
   */
  getStatus(): ConnectionStatus {
    return this.status;
  }

  /**
   * Get the current connection error if any
   * @returns Current connection error or null
   */
  getError(): ConnectionError | null {
    return this.connectionError;
  }

  /**
   * Register a listener for connection status changes
   * @param listener Function to call when status changes
   * @returns Function to remove the listener
   */
  onStatusChange(listener: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  /**
   * Register a listener for connection errors
   * @param listener Function to call when an error occurs
   * @returns Function to remove the listener
   */
  onError(listener: (error: ConnectionError | null) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter(l => l !== listener);
    };
  }

  /**
   * Register a listener for connection stats updates
   * @param listener Function to call when stats are updated
   * @returns Function to remove the listener
   */
  onStatsUpdate(listener: (stats: ConnectionStats) => void): () => void {
    this.statsListeners.push(listener);
    return () => {
      this.statsListeners = this.statsListeners.filter(l => l !== listener);
    };
  }

  /**
   * Check if the connection is active
   * @returns True if connected
   */
  isConnected(): boolean {
    return this.status === 'connected';
  }

  /**
   * Get the current connection uptime in seconds
   * @returns Current connection uptime or 0 if not connected
   */
  getUptime(): number {
    if (!this.connectionStartTime || !this.isConnected()) {
      return 0;
    }
    
    return Math.floor((Date.now() - this.connectionStartTime) / 1000);
  }

  /**
   * Enable or disable the kill switch
   * @param enabled Whether to enable the kill switch
   */
  async setKillSwitch(enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        await killSwitchService.enable();
      } else {
        await killSwitchService.disable();
      }
    } catch (error) {
      console.error(`Failed to ${enabled ? 'enable' : 'disable'} kill switch:`, error);
      toast.error(`Failed to ${enabled ? 'enable' : 'disable'} kill switch`);
    }
  }

  /**
   * Enable or disable DNS leak protection
   * @param enabled Whether to enable DNS leak protection
   */
  async setDnsLeakProtection(enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        // Use default DNS servers if not connected
        const config = await this.loadConfig();
        const dnsServers = config?.dns || ['1.1.1.1', '1.0.0.1'];
        await dnsService.configureDns(dnsServers);
      } else {
        await dnsService.resetDns();
      }
    } catch (error) {
      console.error(`Failed to ${enabled ? 'enable' : 'disable'} DNS leak protection:`, error);
      toast.error(`Failed to ${enabled ? 'enable' : 'disable'} DNS leak protection`);
    }
  }

  /**
   * Update the connection status and notify listeners
   * @param status New connection status
   * @private
   */
  private updateStatus(status: ConnectionStatus): void {
    this.status = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  /**
   * Update the connection error and notify listeners
   * @param error New connection error
   * @private
   */
  private updateError(error: ConnectionError): void {
    this.connectionError = error;
    this.errorListeners.forEach(listener => listener(error));
  }

  /**
   * Reset the connection error and notify listeners
   * @private
   */
  private resetError(): void {
    this.connectionError = null;
    this.errorListeners.forEach(listener => listener(null));
  }

  /**
   * Create a connection error object
   * @param type Error type
   * @param message Error message
   * @param details Additional error details
   * @param retryable Whether the error is retryable
   * @returns Connection error object
   * @private
   */
  private createError(
    type: ConnectionErrorType,
    message: string,
    details?: string,
    retryable = false
  ): ConnectionError {
    return { type, message, details, retryable };
  }

  /**
   * Start monitoring connection stats
   * @private
   */
  private startStatsMonitoring(): void {
    // Stop any existing monitoring
    this.stopStatsMonitoring();
    
    // Start a new interval to monitor stats
    // In a real implementation, this would poll the WireGuard interface for stats
    this.statsInterval = setInterval(() => {
      // Simulate random stats for demonstration
      const stats: ConnectionStats = {
        bytesReceived: Math.floor(Math.random() * 1000000),
        bytesSent: Math.floor(Math.random() * 500000),
        packetsReceived: Math.floor(Math.random() * 10000),
        packetsSent: Math.floor(Math.random() * 5000),
        lastHandshake: new Date(),
        latency: Math.floor(Math.random() * 100) + 10
      };
      
      // Notify listeners
      this.statsListeners.forEach(listener => listener(stats));
      
      // Randomly simulate a connection drop (1% chance)
      if (Math.random() < 0.01 && this.status === 'connected') {
        this.handleConnectionDrop();
      }
    }, 1000);
  }

  /**
   * Stop monitoring connection stats
   * @private
   */
  private stopStatsMonitoring(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  /**
   * Handle a connection drop
   * @private
   */
  private async handleConnectionDrop(): Promise<void> {
    console.log('VPN connection dropped, attempting to reconnect');
    
    this.updateStatus('reconnecting');
    this.updateError(this.createError(
      'network_unavailable',
      'VPN connection dropped',
      'Attempting to reconnect automatically',
      true
    ));
    
    // Increment reconnect attempts
    this.reconnectAttempts++;
    
    // Check if max reconnect attempts reached
    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached, giving up');
      
      this.updateStatus('failed');
      this.updateError(this.createError(
        'network_unavailable',
        'Failed to reconnect to VPN',
        `Maximum reconnection attempts (${this.maxReconnectAttempts}) reached`,
        false
      ));
      
      return;
    }
    
    // Wait before attempting to reconnect
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Attempt to reconnect
    try {
      await this.connect();
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
      
      // Try again
      this.handleConnectionDrop();
    }
  }
}

// Create a singleton instance
const wireguardService = new WireGuardService();

export default wireguardService;
