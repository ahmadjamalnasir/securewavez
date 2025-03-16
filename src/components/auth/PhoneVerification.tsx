
import { Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface PhoneVerificationProps {
  phone: string;
  phoneOtp: string;
  setPhoneOtp: (otp: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const PhoneVerification = ({ 
  phone, 
  phoneOtp, 
  setPhoneOtp, 
  isLoading, 
  onSubmit, 
  onBack 
}: PhoneVerificationProps) => {
  const { toast } = useToast();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <Phone className="mx-auto h-12 w-12 text-vpn-blue mb-2" />
        <h2 className="text-xl font-bold">Phone Verification</h2>
        <p className="text-sm text-muted-foreground mt-1">
          We've sent a 6-digit code to {phone}
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone-otp" className="text-sm font-medium">
          Enter verification code
        </label>
        <div className="flex justify-center my-4">
          <InputOTP 
            maxLength={6} 
            value={phoneOtp} 
            onChange={setPhoneOtp}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} index={index} className="w-12 h-12" />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Button 
          type="submit" 
          className="w-full h-12 shadow-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <>
              Verify Phone <CheckCircle className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          className="w-full h-12" 
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        Didn't receive a code? 
        <button 
          type="button" 
          className="text-vpn-blue hover:underline ml-1"
          onClick={() => {
            toast({
              title: "OTP Resent",
              description: "A new verification code has been sent to your phone"
            });
          }}
        >
          Resend
        </button>
      </p>
    </form>
  );
};

export default PhoneVerification;
