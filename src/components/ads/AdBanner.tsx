
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiService';

interface AdBannerProps {
  placementId: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AdBanner({ placementId, size = 'md' }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  
  // Check if user has a subscription
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiService.subscription.getDetails(),
    // Don't refetch frequently
    staleTime: 1000 * 60 * 5
  });
  
  // Don't show ads to premium users
  const isPremiumUser = subscription?.status === 'active';
  
  useEffect(() => {
    // In a real implementation, this would load an ad SDK (e.g. Google AdMob)
    if (!isPremiumUser && !dismissed) {
      console.log(`Loading ad for placement: ${placementId}`);
      
      // Simulate ad loading
      const timer = setTimeout(() => {
        setAdLoaded(true);
        console.log(`Ad loaded for placement: ${placementId}`);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [placementId, isPremiumUser, dismissed]);
  
  if (isPremiumUser || dismissed) {
    return null;
  }
  
  const sizeClasses = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-40'
  };
  
  return (
    <Card className="relative mb-6 overflow-hidden border-dashed">
      <div className="absolute top-2 right-2 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full bg-background/80 hover:bg-background" 
          onClick={() => setDismissed(true)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <CardContent className={`p-0 ${sizeClasses[size]}`}>
        {!adLoaded ? (
          <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
            <p className="text-xs text-muted-foreground">Loading advertisement...</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5 relative">
            <div className="absolute top-1 left-1 text-[9px] text-muted-foreground bg-background/80 px-1 rounded">
              Ad
            </div>
            <div className="text-center p-4">
              <p className="font-bold mb-1">Upgrade to Premium</p>
              <p className="text-sm text-muted-foreground mb-2">
                Remove ads and get access to premium servers
              </p>
              <Button size="sm" onClick={() => window.location.href = '/subscription'}>
                Go Premium
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
