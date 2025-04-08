
import { useState, useEffect } from 'react';
import { AppWindow, Check, Search, Plus, X, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import settingsApi, { SplitTunnelingConfig } from '@/api/settingsApi';

// Define the apps interface
export interface App {
  id: string;
  name: string;
  icon: string;
}

// Sample apps for the mockup (will be replaced by API call in production)
const sampleApps: App[] = [
  { id: 'chrome', name: 'Google Chrome', icon: '🌐' },
  { id: 'spotify', name: 'Spotify', icon: '🎵' },
  { id: 'netflix', name: 'Netflix', icon: '🎬' },
  { id: 'slack', name: 'Slack', icon: '💬' },
  { id: 'zoom', name: 'Zoom', icon: '📹' },
  { id: 'discord', name: 'Discord', icon: '🎮' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'facebook', name: 'Facebook', icon: '👥' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'telegram', name: 'Telegram', icon: '✈️' },
];

interface SplitTunnelingProps {
  enabled: boolean;
  onToggle: () => void;
  excludedApps: string[];
  onExcludedAppsChange: (apps: string[]) => void;
  isLoading?: boolean;
}

export default function SplitTunneling({
  enabled,
  onToggle,
  excludedApps,
  onExcludedAppsChange,
  isLoading = false
}: SplitTunnelingProps) {
  const [isAppSelectorOpen, setIsAppSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch installed apps with React Query
  const { data: installedApps, isLoading: appsLoading } = useQuery({
    queryKey: ['installedApps'],
    queryFn: async () => {
      try {
        // For development/preview, use sample apps
        if (import.meta.env.DEV || !import.meta.env.VITE_API_URL) {
          return sampleApps;
        }
        // In production, fetch from API
        return await settingsApi.getInstalledApps();
      } catch (error) {
        console.error('Error fetching installed apps:', error);
        return sampleApps; // Fallback to sample apps
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Filter apps based on search term
  const filteredApps = (installedApps || []).filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAppToggle = (appId: string) => {
    onExcludedAppsChange(
      excludedApps.includes(appId)
        ? excludedApps.filter(id => id !== appId)
        : [...excludedApps, appId]
    );
  };

  const openAppSelector = () => {
    setIsAppSelectorOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-vpn-blue/10 p-2 rounded-lg">
            <AppWindow className="w-5 h-5 text-vpn-blue" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="split-tunneling" className="font-medium">Split Tunneling</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Split tunneling allows you to choose which apps use the VPN connection and which apps bypass it.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-gray-500">Choose apps to bypass VPN</p>
          </div>
        </div>
        
        <Switch 
          id="split-tunneling" 
          checked={enabled} 
          onCheckedChange={onToggle}
          disabled={isLoading}
        />
      </div>

      {enabled && (
        <div className="mt-3 pl-10 space-y-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Select apps to exclude from VPN:</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openAppSelector}
              className="flex items-center"
              disabled={isLoading}
            >
              <AppWindow className="w-4 h-4 mr-2" />
              Select Apps
            </Button>
          </div>
          
          {excludedApps.length > 0 ? (
            <div className="space-y-2">
              {excludedApps.map((appId) => {
                const app = (installedApps || sampleApps).find(a => a.id === appId);
                return app ? (
                  <div key={app.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <div className="flex items-center">
                      <span className="mr-2">{app.icon}</span>
                      <span>{app.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAppToggle(app.id)}
                      className="h-8 w-8 p-0"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No apps selected. VPN will be used for all traffic.</p>
          )}
        </div>
      )}

      {/* App Selection Modal */}
      <Dialog open={isAppSelectorOpen} onOpenChange={setIsAppSelectorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Applications</DialogTitle>
            <DialogDescription>
              Choose which apps will bypass the VPN connection
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search applications..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* App List */}
            <div className="h-[300px] overflow-y-auto space-y-2 pr-1">
              {appsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin h-6 w-6 border-2 border-vpn-blue border-t-transparent rounded-full"></div>
                </div>
              ) : filteredApps.length > 0 ? (
                filteredApps.map(app => (
                  <div 
                    key={app.id} 
                    className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer ${
                      excludedApps.includes(app.id) 
                        ? 'bg-primary/10 dark:bg-primary/20' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => handleAppToggle(app.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{app.icon}</span>
                      <span className="font-medium">{app.name}</span>
                    </div>
                    {excludedApps.includes(app.id) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No applications match your search
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {excludedApps.length} app{excludedApps.length !== 1 ? 's' : ''} selected
            </div>
            <Button onClick={() => setIsAppSelectorOpen(false)}>
              Done <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
