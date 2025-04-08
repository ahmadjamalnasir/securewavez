
import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiService';

interface AdBannerProps {
  placementId: string;
  size?: 'small' | 'medium' | 'large' | 'leaderboard';
  refreshInterval?: number; // in milliseconds
}

/**
 * AdBanner component that integrates with AdMob to display ads to free users
 * Premium users will not see ads
 * 
 * @component
 * @example
 * ```tsx
 * <AdBanner placementId="banner_home_screen" size="medium" />
 * ```
 */
export default function AdBanner({ 
  placementId, 
  size = 'medium',
  refreshInterval = 60000 // Default to 1 minute refresh
}: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if user has a subscription
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiService.subscription.getCurrentSubscription(),
    // Don't refetch frequently
    staleTime: 1000 * 60 * 5
  });
  
  // Don't show ads to premium users
  const isPremiumUser = subscription?.status === 'active';
  
  useEffect(() => {
    if (isPremiumUser || dismissed) {
      // Clean up any timers
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
      return;
    }
    
    // Load the AdMob SDK if it's not already loaded
    loadAdMobSdk().then(() => {
      loadAd();
      
      // Set up refresh interval
      refreshTimerRef.current = setInterval(() => {
        if (!dismissed) {
          loadAd();
        }
      }, refreshInterval);
    }).catch((error) => {
      console.error('Failed to load AdMob SDK:', error);
      setAdError('Failed to load advertisement');
    });
    
    // Clean up
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [placementId, size, isPremiumUser, dismissed, refreshInterval]);
  
  const loadAdMobSdk = async (): Promise<void> => {
    // In a real implementation, this would load the AdMob SDK
    // For web apps, this would typically involve adding a script tag
    // or using a dedicated package
    
    return new Promise((resolve) => {
      console.log('Loading AdMob SDK');
      // Simulate loading time
      setTimeout(() => {
        console.log('AdMob SDK loaded');
        resolve();
      }, 500);
    });
  };
  
  const loadAd = async () => {
    try {
      setAdLoaded(false);
      setAdError(null);
      
      console.log(`Loading ad for placement: ${placementId}, size: ${size}`);
      
      // In a real implementation, this would call the AdMob API
      // to request and display an ad in the adContainerRef element
      
      // Simulate ad loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate random failures (20% chance)
      if (Math.random() < 0.2) {
        throw new Error('Failed to load ad');
      }
      
      setAdLoaded(true);
      console.log(`Ad loaded for placement: ${placementId}`);
    } catch (error) {
      console.error('Failed to load ad:', error);
      setAdError('Failed to load advertisement');
    }
  };
  
  if (isPremiumUser || dismissed) {
    return null;
  }
  
  const sizeClasses = {
    small: 'h-16',
    medium: 'h-24',
    large: 'h-40',
    leaderboard: 'h-24 md:h-32'
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
        {adError ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-xs text-muted-foreground">{adError}</p>
          </div>
        ) : !adLoaded ? (
          <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
            <p className="text-xs text-muted-foreground">Loading advertisement...</p>
          </div>
        ) : (
          <div 
            ref={adContainerRef}
            className="w-full h-full flex items-center justify-center bg-primary/5 relative"
          >
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
