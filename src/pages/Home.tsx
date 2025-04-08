
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Shield, Server, Globe, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FadeIn from '@/components/animations/FadeIn';
import ConnectionStats from '@/components/vpn/ConnectionStats';
import { useVpn } from '@/context/VpnContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiService';
import AdBanner from '@/components/ads/AdBanner';

export default function Home() {
  const { 
    vpnState: { status, selectedServer }, 
    connect, 
    disconnect,
    isLoading 
  } = useVpn();
  const navigate = useNavigate();
  
  // Check if user has a subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiService.subscription.getDetails(),
    // In development mode, use mock data
    ...(import.meta.env.DEV && {
      initialData: {
        status: 'active', // Change to 'active' to simulate premium, or null/expired for free
        plan: 'Premium',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
  });
  
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';
  const isPremiumUser = subscription?.status === 'active';
  
  const handleConnectClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };
  
  const handleServerSelection = () => {
    navigate('/servers');
  };
  
  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4">
        {/* Show ads to free users */}
        {!isPremiumUser && !subscriptionLoading && (
          <AdBanner placementId="home-top" size="md" />
        )}
        
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Secure VPN Service</h1>
            <p className="text-muted-foreground">
              Protecting your privacy with military-grade encryption
            </p>
          </div>
        </FadeIn>
        
        <FadeIn delay={100}>
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>
                {isConnected 
                  ? `Connected to ${selectedServer?.name}` 
                  : isConnecting 
                    ? "Establishing connection..." 
                    : "Not connected"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center p-4">
                <div className={`
                  rounded-full p-6 mb-6
                  ${isConnected ? 'bg-green-100 dark:bg-green-900/30' : 
                    isConnecting ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                    'bg-red-100 dark:bg-red-900/30'}
                `}>
                  <Shield className={`
                    w-16 h-16 
                    ${isConnected ? 'text-green-500' : 
                      isConnecting ? 'text-yellow-500' : 
                      'text-red-500'}
                  `} />
                </div>
                
                <Button 
                  size="lg"
                  className="w-full mb-4 h-14 text-lg shadow-button"
                  onClick={handleConnectClick}
                  disabled={isLoading || isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      Connecting...
                    </>
                  ) : isConnected ? (
                    "Disconnect"
                  ) : (
                    "Connect"
                  )}
                </Button>
                
                <div className="flex items-center justify-between w-full">
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={handleServerSelection}
                  >
                    <Server className="w-4 h-4 mr-2" />
                    Change Server
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={() => navigate('/settings')}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Button>
                </div>
              </div>
              
              {isConnected && <ConnectionStats />}
            </CardContent>
          </Card>
        </FadeIn>
        
        {/* Subscription banner for free users */}
        {!isPremiumUser && !subscriptionLoading && (
          <FadeIn delay={200}>
            <Card className="mb-8 bg-vpn-blue/5 border-vpn-blue/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="bg-vpn-blue/10 p-3 rounded-full">
                    <Globe className="h-8 w-8 text-vpn-blue" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold text-lg mb-1">Upgrade to Premium</h3>
                    <p className="text-muted-foreground mb-4 md:mb-0">
                      Get access to 200+ premium servers and advanced features
                    </p>
                  </div>
                  <Button
                    className="whitespace-nowrap"
                    onClick={() => navigate('/subscription')}
                  >
                    View Plans <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}
        
        <FadeIn delay={300}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-vpn-blue/10 p-3 rounded-full mb-4">
                    <Shield className="h-6 w-6 text-vpn-blue" />
                  </div>
                  <h3 className="font-bold mb-2">Secure Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    End-to-end encryption keeps your data private and secure
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-vpn-blue/10 p-3 rounded-full mb-4">
                    <Globe className="h-6 w-6 text-vpn-blue" />
                  </div>
                  <h3 className="font-bold mb-2">Global Network</h3>
                  <p className="text-sm text-muted-foreground">
                    {isPremiumUser ? "200+ servers in 90+ countries worldwide" : "Access to servers across the globe"}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-vpn-blue/10 p-3 rounded-full mb-4">
                    <Server className="h-6 w-6 text-vpn-blue" />
                  </div>
                  <h3 className="font-bold mb-2">No Logs Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    We don't track or store any of your online activities
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
        
        {/* Show more ads to free users */}
        {!isPremiumUser && !subscriptionLoading && (
          <AdBanner placementId="home-bottom" size="lg" />
        )}
      </div>
    </Layout>
  );
}
