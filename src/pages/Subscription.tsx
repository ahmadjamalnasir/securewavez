
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
    }
  ];
  
  // Key premium features to highlight
  const keyFeatures = [
    { icon: <Shield className="w-5 h-5 text-vpn-blue" />, title: "Military-grade encryption" },
    { icon: <Lock className="w-5 h-5 text-vpn-blue" />, title: "No-logs policy" },
    { icon: <Zap className="w-5 h-5 text-vpn-blue" />, title: "WireGuard protocol" },
    { icon: <Gauge className="w-5 h-5 text-vpn-blue" />, title: "Unlimited bandwidth" }
  ];
  
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleContinue = (planId: string) => {
    setSelectedPlan(planId);
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
      <div className="max-w-3xl mx-auto px-4">
        <FadeIn>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-1">Subscription</h1>
              <p className="text-sm md:text-base text-gray-500">Upgrade your VPN experience</p>
            </div>
            <div className="bg-vpn-blue/10 p-2 rounded-full">
              <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-vpn-blue" />
            </div>
          </div>
        </FadeIn>
        
        {paymentStep === 'plans' ? (
          <>
            {/* Compact Premium Features Section */}
            <FadeIn delay={100}>
              <div className="vpn-card mb-6 p-4">
                <h2 className="text-lg md:text-xl font-semibold mb-3">Premium Features</h2>
                
                <div className="grid grid-cols-2 gap-2">
                  {keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="bg-vpn-blue/10 p-1.5 rounded-md">
                        {feature.icon}
                      </div>
                      <p className="text-xs md:text-sm font-medium">{feature.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className={`grid grid-cols-1 ${plans.length > 1 ? 'md:grid-cols-2' : ''} gap-4 mb-4`}>
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={cn(
                      "vpn-card relative transition-all duration-300 flex flex-col h-auto",
                      selectedPlan === plan.id && "ring-2 ring-vpn-blue",
                      plan.popular && !isMobile && "transform md:-translate-y-2"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-vpn-blue text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="text-center mb-3 md:mb-4">
                      <h3 className="text-lg md:text-xl font-bold">{plan.name}</h3>
                      
                      <div className="mt-2 flex items-center justify-center">
                        <span className="text-2xl md:text-3xl font-bold">${plan.price}</span>
                        <span className="text-gray-500 ml-1">/{plan.billingPeriod}</span>
                      </div>
                      
                      {plan.discount && (
                        <div className="mt-1 text-sm">
                          <span className="text-green-500 font-medium">Save {plan.discount}%</span>
                        </div>
                      )}
                      
                      <div className="mt-3">
                        <RadioGroup value={selectedPlan} onValueChange={handlePlanSelect}>
                          <div className="flex items-center justify-center space-x-2">
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <Label htmlFor={plan.id}>Select Plan</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-4 flex-1">
                      {plan.features.slice(0, isMobile ? 4 : undefined).map((feature, i) => (
                        <div key={i} className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-xs md:text-sm">{feature}</span>
                        </div>
                      ))}
                      {isMobile && plan.features.length > 4 && (
                        <div className="text-xs text-vpn-blue">+{plan.features.length - 4} more features</div>
                      )}
                    </div>
                    
                    <div>
                      <Button 
                        className="w-full shadow-button text-sm"
                        onClick={() => handleContinue(plan.id)}
                        size={isMobile ? "sm" : "default"}
                      >
                        Continue with Plan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </>
        ) : (
          <>
            <FadeIn>
              <div className="vpn-card mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-semibold">Payment Information</h2>
                  <Button variant="outline" size="sm" onClick={handleBackToPlan}>
                    Change Plan
                  </Button>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 text-sm">Selected Plan</span>
                    <span className="font-medium text-sm">{selectedPlanObj?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Amount</span>
                    <span className="font-medium text-sm">
                      ${selectedPlanObj?.price}/{selectedPlanObj?.billingPeriod}
                      {selectedPlanObj?.discount && (
                        <span className="text-green-500 ml-2 text-xs">(-{selectedPlanObj.discount}%)</span>
                      )}
                    </span>
                  </div>
                </div>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-3 md:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-name" className="text-sm">Cardholder Name</Label>
                    <Input 
                      id="card-name" 
                      placeholder="Name on card" 
                      className="vpn-input text-sm" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-number" className="text-sm">Card Number</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input 
                        id="card-number" 
                        placeholder="1234 5678 9012 3456" 
                        className="pl-10 vpn-input text-sm" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-sm">Expiry Date</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input 
                          id="expiry" 
                          placeholder="MM/YY" 
                          className="pl-10 vpn-input text-sm" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm">CVV</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input 
                          id="cvv" 
                          placeholder="123" 
                          className="pl-10 vpn-input text-sm" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billing-address" className="text-sm">Billing Address</Label>
                    <Input 
                      id="billing-address" 
                      placeholder="Street address" 
                      className="vpn-input text-sm" 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm">City</Label>
                      <Input 
                        id="city" 
                        placeholder="City" 
                        className="vpn-input text-sm" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-sm">ZIP Code</Label>
                      <Input 
                        id="zip" 
                        placeholder="ZIP / Postal code" 
                        className="vpn-input text-sm" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size={isMobile ? "default" : "lg"}
                    className="w-full shadow-button mt-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <div className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4" />
                        Subscribe Now
                      </div>
                    )}
                  </Button>
                  
                  <div className="text-center text-xs md:text-sm text-gray-500 mt-2">
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
