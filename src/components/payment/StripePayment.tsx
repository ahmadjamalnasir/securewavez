
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

/**
 * Component for handling credit/debit card payments via Stripe
 */
export default function StripePayment({ 
  onSuccess, 
  planId 
}: { 
  onSuccess?: () => void; 
  planId: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  // Get plan details
  const { data: plan, isLoading } = useQuery({
    queryKey: ['subscription', 'plan', planId],
    queryFn: () => apiService.subscription.getPlan(planId),
    enabled: !!planId,
  });
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsProcessing(true);
      
      // In a real implementation, this would:
      // 1. Create a Stripe checkout session via your API
      // 2. Redirect the user to the Stripe checkout page
      
      // Mock implementation
      const response = await apiService.payment.stripe.createCheckoutSession(planId);
      
      // Redirect to Stripe's checkout page
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Invalid response from payment service');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Payment processing failed:', error);
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Failed to process payment',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Credit / Debit Card</CardTitle>
        <CardDescription>
          Subscribe to {plan?.name || 'Premium'} plan securely with Stripe
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="flex">
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                required
                disabled={isProcessing}
                className="rounded-r-none"
              />
              <div className="flex items-center justify-center border border-l-0 rounded-r-md px-3 bg-muted">
                <Icons.creditCard className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                required
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                required
                disabled={isProcessing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Cardholder Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              required
              disabled={isProcessing}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Subscribe for ${plan?.price ? `$${plan.price}/month` : 'Premium'}`
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
