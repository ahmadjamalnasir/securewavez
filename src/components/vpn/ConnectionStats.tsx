
import { useVpn } from '@/context/VpnContext';
import { ArrowDownIcon, ArrowUpIcon, Activity, Clock, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import FadeIn from '@/components/animations/FadeIn';

export default function ConnectionStats() {
  const { vpnState } = useVpn();
  const { status, downloadSpeed, uploadSpeed, ping, dataUsed, connectionTime, ipAddress } = vpnState;
  
  const isConnected = status === 'connected';
  
  // Calculate connection duration
  const getConnectionDuration = () => {
    if (!connectionTime) return '00:00:00';
    
    const seconds = Math.floor((Date.now() - connectionTime) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Format data used
  const formatDataUsed = () => {
    if (dataUsed < 1) {
      return `${(dataUsed * 1000).toFixed(0)} KB`;
    }
    return `${dataUsed.toFixed(2)} MB`;
  };

  return (
    <div className={cn(
      "vpn-card transition-all duration-500",
      isConnected ? "opacity-100" : "opacity-50"
    )}>
      <h3 className="text-lg font-semibold mb-4">Connection Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <FadeIn delay={100} className="flex items-center space-x-2">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
            <ArrowDownIcon className="w-5 h-5 text-vpn-blue" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Download</p>
            <p className="font-medium">{isConnected ? `${downloadSpeed} Mbps` : '-'}</p>
          </div>
        </FadeIn>
        
        <FadeIn delay={200} className="flex items-center space-x-2">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
            <ArrowUpIcon className="w-5 h-5 text-vpn-teal" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Upload</p>
            <p className="font-medium">{isConnected ? `${uploadSpeed} Mbps` : '-'}</p>
          </div>
        </FadeIn>
        
        <FadeIn delay={300} className="flex items-center space-x-2">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-vpn-purple" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Ping</p>
            <p className="font-medium">{isConnected ? `${ping} ms` : '-'}</p>
          </div>
        </FadeIn>
        
        <FadeIn delay={400} className="flex items-center space-x-2">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
            <Database className="w-5 h-5 text-vpn-indigo" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Data Used</p>
            <p className="font-medium">{isConnected ? formatDataUsed() : '-'}</p>
          </div>
        </FadeIn>
      </div>
      
      {isConnected && (
        <>
          <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Duration:</span>
              <span className="text-sm font-medium">{getConnectionDuration()}</span>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-500 mr-1">IP:</span>
              <span className="font-medium">{ipAddress}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
