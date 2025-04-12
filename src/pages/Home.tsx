import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useVpn } from '@/context/VpnContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { CircleDollarSign, ShieldCheck, Settings, Server, Power, AlertTriangle, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ads/AdBanner';
import { formatBytes } from '@/lib/utils';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { 
    isConnected, 
    isConnecting,
    isDisconnecting,
    connect, 
    disconnect, 
    currentServer,
    connectionStats,
    vpnSettings,
    updateVpnSettings
  } = useVpn();
  const { toast } = useToast();
  
  const [isAutoConnect, setIsAutoConnect] = useState(vpnSettings?.autoConnect || false);
  const [dataUsage, setDataUsage] = useState({
    upload: 0,
    download: 0,
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (connectionStats) {
      setDataUsage({
        upload: connectionStats.uploadBytes,
        download: connectionStats.downloadBytes,
      });
    }
  }, [connectionStats]);
  
  const handleConnect = async () => {
    if (!currentServer) {
      toast({
        title: "No server selected",
        description: "Please select a server to connect to."
      });
      navigate('/servers');
      return;
    }
    
    try {
      await connect(currentServer.id);
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect to the VPN server."
      });
    }
  };
  
  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error: any) {
      toast({
        title: "Disconnection Failed",
        description: error?.message || "Failed to disconnect from the VPN server."
      });
    }
  };
  
  const toggleAutoConnect = async () => {
    const newAutoConnectValue = !isAutoConnect;
    setIsAutoConnect(newAutoConnectValue);
    
    try {
      await updateVpnSettings({ autoConnect: newAutoConnectValue });
      toast({
        title: "Auto-Connect Updated",
        description: `Auto-connect is now ${newAutoConnectValue ? 'enabled' : 'disabled'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to Update Settings",
        description: error?.message || "Failed to update auto-connect settings."
      });
      setIsAutoConnect(isAutoConnect); // Revert the local state
    }
  };
  
  if (!isAuthenticated) {
    return null; // or a loading indicator
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-muted-foreground">
            {user?.email}
          </p>
        </div>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
      
      <AdBanner 
        size="medium" // Changed from "md" to "medium"
        className="mt-6 mx-auto"
      />
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Connection Status
          </CardTitle>
          <CardDescription>
            {isConnected ? 'Connected to VPN' : 'Disconnected from VPN'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Current Server
            </p>
            <p className="text-sm text-muted-foreground">
              {currentServer ? currentServer.name : 'Not Selected'}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Data Usage
            </p>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                <Upload className="mr-1 inline-block h-4 w-4" /> Uploaded: {formatBytes(dataUsage.upload)}
              </p>
              <p className="text-sm text-muted-foreground">
                <Download className="mr-1 inline-block h-4 w-4" /> Downloaded: {formatBytes(dataUsage.download)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Auto-Connect
            </p>
            <Switch id="auto-connect" checked={isAutoConnect} onCheckedChange={toggleAutoConnect} />
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            {!isConnected ? (
              <Button 
                className="w-32 shadow-button"
                onClick={handleConnect} 
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    Connect <Power className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                className="w-32"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    Disconnect <Power className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Subscription
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing details.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-muted-foreground">
              View your current plan, payment method, and billing history.
            </p>
            <Button 
              className="mt-4 shadow-button"
              onClick={() => navigate('/subscription')}
            >
              Manage Subscription <CircleDollarSign className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Settings
            </CardTitle>
            <CardDescription>
              Customize your VPN experience.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-muted-foreground">
              Configure your preferences, security settings, and more.
            </p>
            <Button 
              className="mt-4 shadow-button"
              onClick={() => navigate('/settings')}
            >
              Open Settings <Settings className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <AdBanner 
        size="large" // Changed from "lg" to "large"
        className="mt-8 mx-auto"
      />
      
      <Card className="mt-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Security Tips
          </CardTitle>
          <CardDescription>
            Enhance your online security with these tips.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <ShieldCheck className="text-green-500 h-5 w-5" />
            <div>
              <p className="font-medium">
                Use Strong Passwords
              </p>
              <p className="text-sm text-muted-foreground">
                Create unique, complex passwords for all your accounts.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <AlertTriangle className="text-yellow-500 h-5 w-5" />
            <div>
              <p className="font-medium">
                Beware of Phishing
              </p>
              <p className="text-sm text-muted-foreground">
                Be cautious of suspicious emails and links asking for personal information.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Server className="text-blue-500 h-5 w-5" />
            <div>
              <p className="font-medium">
                Connect to Trusted Networks
              </p>
              <p className="text-sm text-muted-foreground">
                Avoid using public Wi-Fi for sensitive transactions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
