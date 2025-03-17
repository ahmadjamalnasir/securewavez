
import { useState } from 'react';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ForgotPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onClose: () => void;
  onVerificationNeeded: (type: 'email' | 'phone', contact: string) => void;
}

const ForgotPasswordForm = ({ 
  isLoading, 
  setIsLoading, 
  onClose,
  onVerificationNeeded 
}: ForgotPasswordFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [activeTab, setActiveTab] = useState('email');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'email' && !email) {
      return toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
    }
    
    if (activeTab === 'phone' && !phone) {
      return toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive"
      });
    }
    
    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to your ${activeTab === 'email' ? 'email' : 'phone'}`,
      });
      
      // Call the onVerificationNeeded callback
      onVerificationNeeded(
        activeTab as 'email' | 'phone',
        activeTab === 'email' ? email : phone
      );
    }, 1000);
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="phone">Phone</TabsTrigger>
      </TabsList>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <TabsContent value="email" className="mt-0">
          <div className="space-y-2">
            <label htmlFor="reset-email" className="text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                className="pl-10 vpn-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="phone" className="mt-0">
          <div className="space-y-2">
            <label htmlFor="reset-phone" className="text-sm font-medium">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="reset-phone"
                type="tel"
                placeholder="+1234567890"
                className="pl-10 vpn-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full h-12 shadow-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                Send Verification Code <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Tabs>
  );
};

export default ForgotPasswordForm;
