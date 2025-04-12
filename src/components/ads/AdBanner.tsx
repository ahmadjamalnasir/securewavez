
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiService';
import { Skeleton } from '@/components/ui/skeleton';

type AdSize = 'small' | 'medium' | 'large' | 'leaderboard';

interface AdBannerProps {
  size?: AdSize;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  size = 'medium',
  className = '',
}) => {
  const [showAd, setShowAd] = useState(true);
  
  // Check if user has an active subscription
  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      try {
        // Changed from getCurrentSubscription to getDetails
        return await apiService.subscription.getDetails();
      } catch (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
  
  // Determine if user should see ads based on subscription status
  useEffect(() => {
    if (!isLoading && subscriptionData) {
      const hasActiveSubscription = 
        subscriptionData.status === 'active' || 
        subscriptionData.status === 'trialing';
      
      setShowAd(!hasActiveSubscription);
    }
  }, [subscriptionData, isLoading]);
  
  // If loading or user has a subscription, don't show the ad
  if (isLoading || !showAd) return null;
  
  // Size configuration
  const sizeClasses = {
    small: 'h-16 w-full max-w-sm',
    medium: 'h-24 w-full max-w-xl',
    large: 'h-32 w-full max-w-3xl',
    leaderboard: 'h-24 w-full max-w-6xl',
  };
  
  return (
    <Card className={`${sizeClasses[size]} overflow-hidden bg-muted/30 ${className}`}>
      <CardContent className="p-2 h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-xs">Advertisement</p>
          <Skeleton className={`mx-auto rounded ${size === 'small' ? 'h-8 w-48' : 'h-14 w-full'}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdBanner;
