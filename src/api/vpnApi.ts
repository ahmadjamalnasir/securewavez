
import axiosClient, { handleApiResponse } from './axiosClient';
import { Server } from '@/types/vpn';

export interface ConnectionStatusResponse {
  status: 'disconnected' | 'connecting' | 'connected';
  serverId?: string;
  ipAddress?: string;
  connectionTime?: number;
}

export interface VpnStatsResponse {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  dataUsed: number;
}

const vpnApi = {
  getServers: () => 
    handleApiResponse<Server[]>(axiosClient.get('/vpn/servers')),
  
  connectToServer: (serverId: string) => 
    handleApiResponse<ConnectionStatusResponse>(
      axiosClient.post('/vpn/connect', { serverId })
    ),
  
  disconnectFromServer: () => 
    handleApiResponse<ConnectionStatusResponse>(
      axiosClient.post('/vpn/disconnect')
    ),
  
  getConnectionStatus: () => 
    handleApiResponse<ConnectionStatusResponse>(
      axiosClient.get('/vpn/status')
    ),
  
  getVpnStats: () => 
    handleApiResponse<VpnStatsResponse>(
      axiosClient.get('/vpn/stats')
    ),
};

export default vpnApi;
