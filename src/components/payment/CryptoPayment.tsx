
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

/**
 * Component for handling cryptocurrency payments
 */
export default function CryptoPayment({ 
  onSuccess, 
  planId 
}: { 
  onSuccess?: () => void; 
  planId: string;
}) {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const { toast } = useToast();
  
  // Get plan details
  const { data: plan } = useQuery({
    queryKey: ['subscription', 'plan', planId],
    queryFn: () => apiService.subscription.getPlan(planId),
    enabled: !!planId,
  });
  
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)' },
    { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'usdt', label: 'Tether (USDT)' },
    { value: 'usdc', label: 'USD Coin (USDC)' },
  ];
  
  const handleGeneratePayment = async () => {
    try {
      setIsProcessing(true);
      
      // In a real implementation, this would:
      // 1. Call your backend API to generate a crypto payment address
      // 2. Calculate the equivalent amount in the selected cryptocurrency
      // 3. Return the payment address and amount to display to the user
      
      // Mock implementation
      const response = await apiService.payment.crypto.createPayment(
        plan?.price || 9.99,
        `${plan?.name || 'Premium'} Subscription - ${selectedCrypto.toUpperCase()}`
      );
      
      // Set the payment details
      setPaymentAddress(response.address || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      setPaymentAmount(response.amount || '0.00042');
      setShowQR(true);
      
      // Set up a payment status check
      checkPaymentStatus(response.paymentId);
    } catch (error) {
      console.error('Failed to generate crypto payment:', error);
      toast({
        variant: 'destructive',
        title: 'Payment Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate crypto payment',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const checkPaymentStatus = async (paymentId: string) => {
    // In a real implementation, this would:
    // 1. Poll your backend API to check if the payment has been received
    // 2. Update the UI accordingly
    
    // Mock implementation - simulate a successful payment after 5 seconds
    setTimeout(() => {
      if (Math.random() > 0.3) { // 70% chance of success for demo
        toast({
          title: 'Payment Received',
          description: 'Your cryptocurrency payment has been confirmed.',
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Payment Not Detected',
          description: 'We have not detected your payment yet. Please try again or contact support.',
        });
      }
    }, 5000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cryptocurrency</CardTitle>
        <CardDescription>
          Pay with your preferred cryptocurrency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showQR ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crypto">Select Cryptocurrency</Label>
              <Select
                value={selectedCrypto}
                onValueChange={setSelectedCrypto}
                disabled={isProcessing}
              >
                <SelectTrigger id="crypto">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium mb-1">Subscription Details</p>
              <p className="text-sm">{plan?.name || 'Premium'} Plan - ${plan?.price || '9.99'}/month</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-md">
                <QrCode className="w-32 h-32" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Send exactly this amount:</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-center break-all">
                {paymentAmount} {selectedCrypto.toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>To this address:</Label>
              <div className="p-3 bg-muted rounded-md font-mono text-xs text-center break-all">
                {paymentAddress}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Waiting for payment confirmation... This may take a few minutes.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!showQR ? (
          <Button
            className="w-full"
            onClick={handleGeneratePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Generating Payment...' : 'Generate Payment Address'}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowQR(false)}
          >
            Cancel and Choose Different Currency
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
