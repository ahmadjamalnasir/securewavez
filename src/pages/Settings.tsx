
import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Lock, Globe, Info, Moon, Sun, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import FadeIn from '@/components/animations/FadeIn';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    killSwitch: true,
    autoConnect: false,
    notifications: true,
    analytics: false,
    theme: 'system',
    protocol: 'wireguard',
    splitTunneling: false,
    ipv6Protection: true,
    dnsLeakProtection: true,
  });
  
  const handleToggle = (key: string) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key as keyof typeof prev] };
      
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
      
      toast({
        title: "Setting Updated",
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} is now set to ${value}`,
      });
      
      return newSettings;
    });
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
                      <Lock className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Protocol</p>
                      <p className="text-sm text-gray-500">Choose connection protocol</p>
                    </div>
                  </div>
                  
                  <RadioGroup 
                    value={settings.protocol}
                    onValueChange={(value) => handleRadioChange('protocol', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="wireguard" id="wireguard" />
                      <Label htmlFor="wireguard">WireGuard</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="openvpn" id="openvpn" />
                      <Label htmlFor="openvpn">OpenVPN</Label>
                    </div>
                  </RadioGroup>
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
                <div className="flex items-center justify-between">
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
                    className="flex space-x-4"
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
                      <Label htmlFor="notifications" className="font-medium">Notifications</Label>
                      <p className="text-sm text-gray-500">Show connection notifications</p>
                    </div>
                  </div>
                  
                  <Switch 
                    id="notifications" 
                    checked={settings.notifications} 
                    onCheckedChange={() => handleToggle('notifications')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Info className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <Label htmlFor="analytics" className="font-medium">Usage Analytics</Label>
                      <p className="text-sm text-gray-500">Share anonymous usage data</p>
                    </div>
                  </div>
                  
                  <Switch 
                    id="analytics" 
                    checked={settings.analytics} 
                    onCheckedChange={() => handleToggle('analytics')}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={400}>
            <div className="flex justify-between space-x-4 mb-20">
              <Button variant="outline" className="flex-1">
                Reset Settings
              </Button>
              <Button className="flex-1">
                Save Changes
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}
