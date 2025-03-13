
import { useState } from 'react';
import { CheckCircle2, CreditCard, Calendar, Wallet, Shield, Lock, Zap, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import FadeIn from '@/components/animations/FadeIn';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Define subscription plan types
interface Plan {
  id: string;
  name: string;
  price: number;
  billingPeriod: string;
  discount?: number;
  features: string[];
  popular?: boolean;
}

export default function Subscription() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [paymentStep, setPaymentStep] = useState<'plans' | 'payment'>('plans');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const plans: Plan[] = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 9.99,
      billingPeriod: 'month',
      features: [
        'Access to all servers',
        'Unlimited bandwidth',
        'Up to 5 devices',
        'Ad blocking',
        '24/7 support'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 6.99,
      billingPeriod: 'month',
      discount: 30,
      features: [
        'Access to all servers',
        'Unlimited bandwidth',
        'Up to 10 devices',
        'Ad blocking',
        'Malware protection',
        '24/7 priority support'
      ],
      popular: true
    },
    {
      id: 'biennial',
      name: '2-Year Plan',
      price: 4.99,
      billingPeriod: 'month',
      discount: 50,
      features: [
        'Access to all servers',
        'Unlimited bandwidth',
        'Unlimited devices',
        'Ad blocking',
        'Malware protection',
        'Double VPN option',
        '24/7 priority support'
      ]
    }
  ];
  
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    
    toast({
      title: "Plan Selected",
      description: `You've selected the ${plans.find(p => p.id === planId)?.name}`,
    });
  };
  
  const handleContinue = () => {
    setPaymentStep('payment');
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: "Payment Successful",
        description: "Your subscription has been activated",
      });
      
      // Reset to plans view after successful payment
      setPaymentStep('plans');
    }, 2000);
  };
  
  const handleBackToPlan = () => {
    setPaymentStep('plans');
  };
  
  const selectedPlanObj = plans.find(p => p.id === selectedPlan);
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Subscription</h1>
              <p className="text-gray-500">Upgrade your VPN experience</p>
            </div>
            <div className="bg-vpn-blue/10 p-2 rounded-full">
              <CreditCard className="w-6 h-6 text-vpn-blue" />
            </div>
          </div>
        </FadeIn>
        
        {paymentStep === 'plans' ? (
          <>
            <FadeIn delay={200}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan, index) => (
                  <div 
                    key={plan.id}
                    className={cn(
                      "vpn-card relative transition-all duration-300",
                      selectedPlan === plan.id && "ring-2 ring-vpn-blue",
                      plan.popular && "transform md:-translate-y-2"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-vpn-blue text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      
                      <div className="mt-2 flex items-center justify-center">
                        <span className="text-3xl font-bold">${plan.price}</span>
                        <span className="text-gray-500 ml-1">/{plan.billingPeriod}</span>
                      </div>
                      
                      {plan.discount && (
                        <div className="mt-1 text-sm">
                          <span className="text-green-500 font-medium">Save {plan.discount}%</span>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <RadioGroup value={selectedPlan} onValueChange={handlePlanSelect}>
                          <div className="flex items-center justify-center space-x-2">
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <Label htmlFor={plan.id}>Select Plan</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
            
            <FadeIn delay={300}>
              <div className="vpn-card mb-6">
                <h2 className="text-xl font-semibold mb-4">All Plans Include</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Military-grade encryption</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Lock className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <p className="font-medium">No-logs policy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Zap className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <p className="font-medium">WireGuard protocol</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-vpn-blue/10 p-2 rounded-lg">
                      <Gauge className="w-5 h-5 text-vpn-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Unlimited bandwidth</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="flex justify-center mb-20">
                <Button 
                  size="lg" 
                  className="shadow-button"
                  onClick={handleContinue}
                >
                  Continue with {selectedPlanObj?.name}
                </Button>
              </div>
            </FadeIn>
          </>
        ) : (
          <>
            <FadeIn>
              <div className="vpn-card mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                  <Button variant="outline" size="sm" onClick={handleBackToPlan}>
                    Change Plan
                  </Button>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Selected Plan</span>
                    <span className="font-medium">{selectedPlanObj?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-medium">
                      ${selectedPlanObj?.price}/{selectedPlanObj?.billingPeriod}
                      {selectedPlanObj?.discount && (
                        <span className="text-green-500 ml-2">(-{selectedPlanObj.discount}%)</span>
                      )}
                    </span>
                  </div>
                </div>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input 
                      id="card-name" 
                      placeholder="Name on card" 
                      className="vpn-input" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        id="card-number" 
                        placeholder="1234 5678 9012 3456" 
                        className="pl-10 vpn-input" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input 
                          id="expiry" 
                          placeholder="MM/YY" 
                          className="pl-10 vpn-input" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input 
                          id="cvv" 
                          placeholder="123" 
                          className="pl-10 vpn-input" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billing-address">Billing Address</Label>
                    <Input 
                      id="billing-address" 
                      placeholder="Street address" 
                      className="vpn-input" 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        placeholder="City" 
                        className="vpn-input" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input 
                        id="zip" 
                        placeholder="ZIP / Postal code" 
                        className="vpn-input" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full shadow-button"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <div className="flex items-center">
                        <Wallet className="mr-2 h-5 w-5" />
                        Subscribe Now
                      </div>
                    )}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500">
                    <p>Your payment information is secure and encrypted.</p>
                    <p>You can cancel your subscription at any time.</p>
                  </div>
                </form>
              </div>
            </FadeIn>
          </>
        )}
      </div>
    </Layout>
  );
}
