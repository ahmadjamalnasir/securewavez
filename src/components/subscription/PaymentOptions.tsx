
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Bitcoin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';

interface PlanOption {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

const plans: PlanOption[] = [
  {
    id: 'basic-monthly',
    name: 'Basic',
    description: 'Perfect for casual users',
    price: 4.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Standard VPN servers',
      'Basic encryption',
      'No logs policy',
      'Connect up to 3 devices'
    ]
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    description: 'Enhanced security and performance',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Premium servers worldwide',
      'Advanced encryption',
      'No logs policy',
      'Connect up to 5 devices',
      'Ad blocking',
      'P2P optimized servers'
    ]
  },
  {
    id: 'unlimited-monthly',
    name: 'Unlimited',
    description: 'Maximum protection and features',
    price: 12.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Premium servers worldwide',
      'Military-grade encryption',
      'No logs policy',
      'Connect unlimited devices',
      'Ad and malware blocking',
      'P2P optimized servers',
      'Dedicated IP option',
      'Priority support'
    ]
  }
];

export default function PaymentOptions() {
  const { isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(plans[1]); // Default to Premium
  const [loading, setLoading] = useState(false);
  
  const handleStripePayment = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to subscribe');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the API to create a Stripe checkout session
      const response = await apiService.payment.stripe.createCheckoutSession(selectedPlan.id);
      
      // Redirect to the Stripe checkout page
      window.location.href = response.url;
    } catch (error) {
      console.error('Failed to create Stripe checkout session:', error);
      toast.error('Payment processing failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCryptoPayment = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to subscribe');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the API to create a crypto payment
      const response = await apiService.payment.crypto.createPayment(
        selectedPlan.price * 100, // Convert to cents
        `${selectedPlan.name} Plan - ${selectedPlan.interval}ly`
      );
      
      // Show crypto payment information
      // In a real implementation, this would display a QR code and crypto address
      toast.success('Crypto payment initiated. Please check your email for payment instructions.');
    } catch (error) {
      console.error('Failed to create crypto payment:', error);
      toast.error('Payment processing failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">Select the plan that works best for you</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <Card 
            key={plan.id}
            className={`cursor-pointer ${selectedPlan.id === plan.id ? 'border-primary' : 'border-border'}`}
            onClick={() => setSelectedPlan(plan)}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground ml-1">/{plan.interval}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-primary mr-2">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedPlan.id === plan.id ? "default" : "outline"} 
                className="w-full"
                onClick={() => setSelectedPlan(plan)}
              >
                {selectedPlan.id === plan.id ? 'Selected' : 'Select'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="pt-6">
        <h3 className="text-xl font-bold mb-4">Choose Payment Method</h3>
        
        <Tabs defaultValue="card">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="card">
              <CreditCard className="w-4 h-4 mr-2" /> Credit Card
            </TabsTrigger>
            <TabsTrigger value="crypto">
              <Bitcoin className="w-4 h-4 mr-2" /> Cryptocurrency
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card" className="space-y-4">
            <div className="bg-muted p-4 rounded-md flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                You'll be redirected to our secure payment provider to complete your purchase.
                Your subscription will start immediately after payment.
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="w-full" 
              onClick={handleStripePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Processing...
                </>
              ) : (
                `Pay $${selectedPlan.price}/${selectedPlan.interval}`
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="crypto" className="space-y-4">
            <div className="bg-muted p-4 rounded-md flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Pay using Bitcoin, Ethereum, or other supported cryptocurrencies.
                The payment instructions will be sent to your email.
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="w-full" 
              onClick={handleCryptoPayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Processing...
                </>
              ) : (
                `Pay with Cryptocurrency`
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
