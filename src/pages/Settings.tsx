
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, Bell, Shield, Lock, Globe, 
  Moon, Sun, Zap, ArrowRight
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import Layout from '@/components/layout/Layout';
import FadeIn from '@/components/animations/FadeIn';
import SplitTunneling from '@/components/vpn/SplitTunneling';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';

export default function Settings() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    settings, 
    isLoading, 
    isUpdating,
    handleToggle, 
    handleRadioChange, 
    updateExcludedApps,
    toggleSplitTunneling
  } = useSettings();
  
  // Track initial settings to detect changes
  const [initialSettings, setInitialSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Update initial settings when settings are loaded
  useEffect(() => {
    if (!isLoading) {
      setInitialSettings({...settings});
    }
  }, [isLoading, settings]);
  
  // Check if settings have changed
  useEffect(() => {
    if (!isLoading) {
      const settingsChanged = JSON.stringify(settings) !== JSON.stringify(initialSettings);
      setHasChanges(settingsChanged);
    }
  }, [settings, initialSettings, isLoading]);
  
  const handleResetSettings = () => {
    // Reset to default settings
    const defaultSettings = {
      killSwitch: true,
      autoConnect: false,
      notifications: true,
      theme: 'system',
      splitTunneling: false,
      ipv6Protection: true,
      dnsLeakProtection: true,
      excludedApps: []
    };
    
    localStorage.setItem('vpnSettings', JSON.stringify(defaultSettings));
    localStorage.removeItem('vpnExcludedApps');
    
    // Update initial settings
    setInitialSettings(defaultSettings);
    
    // Navigate to home screen
    toast.success('Settings reset to defaults');
    navigate('/home');
  };

  const handleSaveSettings = () => {
    // Save settings in localStorage for persistence
    setInitialSettings({...settings});
    setHasChanges(false);
    
    // Navigate to home screen
    toast.success('Settings saved successfully');
    navigate('/home');
  };

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
                    disabled={isLoading || isUpdating}
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
                    disabled={isLoading || isUpdating}
                  />
                </div>
                
                <Separator />
                
                <SplitTunneling
                  enabled={settings.splitTunneling}
                  onToggle={toggleSplitTunneling}
                  excludedApps={settings.excludedApps || []}
                  onExcludedAppsChange={updateExcludedApps}
                  isLoading={isLoading || isUpdating}
                />
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
                    disabled={isLoading || isUpdating}
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
                    disabled={isLoading || isUpdating}
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
                    disabled={isLoading || isUpdating}
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
                    disabled={isLoading || isUpdating}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={400}>
            <div className="flex justify-between space-x-4 mb-20">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleResetSettings}
                disabled={isLoading || isUpdating}
              >
                Reset Settings
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSaveSettings}
                disabled={!hasChanges || isLoading || isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}
