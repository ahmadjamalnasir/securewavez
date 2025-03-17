
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Shield, Lock, Globe, Info, Moon, Sun, Zap, AppWindow, Check, Search, Plus, X, ArrowRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import Layout from '@/components/layout/Layout';
import FadeIn from '@/components/animations/FadeIn';
import { useToast } from '@/hooks/use-toast';

// Default settings
const defaultSettings = {
  killSwitch: true,
  autoConnect: false,
  notifications: true,
  theme: 'system',
  splitTunneling: false,
  ipv6Protection: true,
  dnsLeakProtection: true,
};

// Mock apps for split tunneling
const apps = [
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

export default function Settings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [settings, setSettings] = useState(defaultSettings);
  const [excludedApps, setExcludedApps] = useState<string[]>([]);
  const [isAppSelectorOpen, setIsAppSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('vpnSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      const savedExcludedApps = localStorage.getItem('vpnExcludedApps');
      if (savedExcludedApps) {
        setExcludedApps(JSON.parse(savedExcludedApps));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);
  
  const handleToggle = (key: string) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key as keyof typeof prev] };
      
      // If split tunneling is being enabled, open the app selector modal
      if (key === 'splitTunneling' && !prev.splitTunneling) {
        setIsAppSelectorOpen(true);
      }
      
      // Save to localStorage immediately
      localStorage.setItem('vpnSettings', JSON.stringify(newSettings));
      
      toast({
        title: "Setting Updated",
        description: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} is now ${newSettings[key as keyof typeof newSettings] ? 'enabled' : 'disabled'}`,
      });
      
      return newSettings;
    });
  };
  
  const handleRadioChange = (key: string, value: string) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Save to localStorage immediately
      localStorage.setItem('vpnSettings', JSON.stringify(newSettings));
      
      toast({
        title: "Setting Updated",
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} is now set to ${value}`,
      });
      
      return newSettings;
    });
  };

  const handleAppToggle = (appId: string) => {
    setExcludedApps(prev => {
      const newExcludedApps = prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId];
      
      // Save to localStorage immediately
      localStorage.setItem('vpnExcludedApps', JSON.stringify(newExcludedApps));
      
      return newExcludedApps;
    });
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    setExcludedApps([]);
    
    // Clear localStorage
    localStorage.setItem('vpnSettings', JSON.stringify(defaultSettings));
    localStorage.setItem('vpnExcludedApps', JSON.stringify([]));
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values",
    });
    
    // Navigate to home screen after reset
    navigate('/home');
  };

  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem('vpnSettings', JSON.stringify(settings));
    localStorage.setItem('vpnExcludedApps', JSON.stringify(excludedApps));
    
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully",
    });
    
    // Navigate to home screen after save
    navigate('/home');
  };

  const openAppSelector = () => {
    setIsAppSelectorOpen(true);
  };

  // Filter apps based on search term
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <FadeIn>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Settings</h1>
              <p className="text-gray-500">Customize your VPN experience</p>
            </div>
            <div className="bg-vpn-blue/10 p-2 rounded-full">
              <SettingsIcon className="w-6 h-6 text-vpn-blue" />
            </div>
          </div>
        </FadeIn>
        
        <div className="space-y-6">
          <FadeIn delay={100}>
            <div className="vpn-card">
              <h2 className="text-xl font-semibold mb-4">Connection</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Zap className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <Label htmlFor="kill-switch" className="font-medium">Kill Switch</Label>
                      <p className="text-sm text-gray-500">Block internet when VPN disconnects</p>
                    </div>
                  </div>
                  
                  <Switch 
                    id="kill-switch" 
                    checked={settings.killSwitch} 
                    onCheckedChange={() => handleToggle('killSwitch')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <Label htmlFor="auto-connect" className="font-medium">Auto Connect</Label>
                      <p className="text-sm text-gray-500">Connect on system startup</p>
                    </div>
                  </div>
                  
                  <Switch 
                    id="auto-connect" 
                    checked={settings.autoConnect} 
                    onCheckedChange={() => handleToggle('autoConnect')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Globe className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <Label htmlFor="split-tunneling" className="font-medium">Split Tunneling</Label>
                      <p className="text-sm text-gray-500">Choose apps to bypass VPN</p>
                    </div>
                  </div>
                  
                  <Switch 
                    id="split-tunneling" 
                    checked={settings.splitTunneling} 
                    onCheckedChange={() => handleToggle('splitTunneling')}
                  />
                </div>

                {settings.splitTunneling && (
                  <div className="mt-3 pl-10 space-y-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Select apps to exclude from VPN:</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={openAppSelector}
                        className="flex items-center"
                      >
                        <AppWindow className="w-4 h-4 mr-2" />
                        Select Apps
                      </Button>
                    </div>
                    
                    {excludedApps.length > 0 ? (
                      <div className="space-y-2">
                        {excludedApps.map((appId) => {
                          const app = apps.find(a => a.id === appId);
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
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={200}>
            <div className="vpn-card">
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <Label htmlFor="ipv6-protection" className="font-medium">IPv6 Leak Protection</Label>
                      <p className="text-sm text-gray-500">Block IPv6 traffic while connected</p>
                    </div>
                  </div>
                  
                  <Switch 
                    id="ipv6-protection" 
                    checked={settings.ipv6Protection} 
                    onCheckedChange={() => handleToggle('ipv6Protection')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Lock className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <Label htmlFor="dns-protection" className="font-medium">DNS Leak Protection</Label>
                      <p className="text-sm text-gray-500">Ensure DNS requests go through VPN</p>
                    </div>
                  </div>
                  
                  <Switch 
                    id="dns-protection" 
                    checked={settings.dnsLeakProtection} 
                    onCheckedChange={() => handleToggle('dnsLeakProtection')}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={300}>
            <div className="vpn-card">
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Moon className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-gray-500">Choose your preferred theme</p>
                    </div>
                  </div>
                  
                  <RadioGroup 
                    value={settings.theme}
                    onValueChange={(value) => handleRadioChange('theme', value)}
                    className={isMobile ? "flex flex-col space-y-2" : "flex space-x-4"}
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center">
                        <Sun className="w-4 h-4 mr-1" /> Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center">
                        <Moon className="w-4 h-4 mr-1" /> Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system">System</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Bell className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <Label htmlFor="notifications" className="font-medium">Connection Notifications</Label>
                      <p className="text-sm text-gray-500">Show connection notifications</p>
                    </div>
                  </div>
                  
                  <Switch 
                    id="notifications" 
                    checked={settings.notifications} 
                    onCheckedChange={() => handleToggle('notifications')}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={400}>
            <div className="flex justify-between space-x-4 mb-20">
              <Button variant="outline" className="flex-1" onClick={handleResetSettings}>
                Reset Settings
              </Button>
              <Button className="flex-1" onClick={handleSaveSettings}>
                Save Changes
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

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
              {filteredApps.length > 0 ? (
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
    </Layout>
  );
}
