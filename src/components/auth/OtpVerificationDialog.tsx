
import { useState, useEffect } from 'react';
import { Check, X, Mail, Phone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type VerificationType = 'email' | 'phone';

interface OtpVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  verificationType: VerificationType;
  contact: string;
  onSuccess: () => void;
  isSignUp?: boolean;
  signUpData?: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  };
}

const OtpVerificationDialog = ({
  isOpen,
  onClose,
  verificationType,
  contact,
  onSuccess,
  isSignUp = false,
  signUpData,
}: OtpVerificationDialogProps) => {
  const { verifyOtp, resendOtp, isLoading } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verificationState, setVerificationState] = useState<'idle' | 'success' | 'error'>('idle');

  // For development: Always use this as fallback for testing
  const DEV_MODE = true;
  const FALLBACK_OTP = '123456';

  // Reset OTP when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setOtp('');
      setError('');
      setVerificationState('idle');
    }
  }, [isOpen]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }
    
    setError('');
    
    // In development mode, allow fallback OTP
    if (DEV_MODE && (otp === FALLBACK_OTP)) {
      console.log('Using fallback OTP code for development');
      setVerificationState('success');
      
      // Wait a bit before calling the success callback
      setTimeout(() => {
        onSuccess();
        // Reset the dialog state
        setVerificationState('idle');
        setOtp('');
        onClose();
      }, 1500);
      return;
    }
    
    try {
      // Call the API to verify the OTP
      const success = await verifyOtp({
        verificationType,
        contact,
        otp,
        isSignUp
      });
      
      if (success) {
        setVerificationState('success');
        
        // Wait a bit before calling the success callback
        setTimeout(() => {
          onSuccess();
          // Reset the dialog state
          setVerificationState('idle');
          setOtp('');
          onClose();
        }, 1500);
      } else {
        setVerificationState('error');
        setError('Invalid verification code');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setVerificationState('error');
      setError('An error occurred while verifying the code. Please try again.');
    }
  };
  
  const handleResendCode = async () => {
    try {
      await resendOtp(verificationType, contact);
      toast.success(`New verification code sent to your ${verificationType}`);
    } catch (err) {
      console.error('Error resending OTP:', err);
      toast.error('Failed to resend verification code. Please try again.');
    }
  };
  
  const resetDialog = () => {
    setVerificationState('idle');
    setOtp('');
    setError('');
  };

  const handleDialogClose = () => {
    resetDialog();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleDialogClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {verificationType === 'email' ? 'Email Verification' : 'Phone Verification'}
          </DialogTitle>
          <DialogDescription>
            We've sent a 6-digit code to {contact}
            {DEV_MODE && (
              <div className="mt-1 text-xs opacity-75">
                Development mode: Use code: {FALLBACK_OTP}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {verificationState === 'idle' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vpn-blue to-vpn-teal flex items-center justify-center">
                {verificationType === 'email' ? (
                  <Mail className="w-8 h-8 text-white" />
                ) : (
                  <Phone className="w-8 h-8 text-white" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={otp} 
                  onChange={setOtp}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              
              {error && (
                <div className="text-center text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 shadow-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>Verify Code</>
              )}
            </Button>
            
            <div className="flex flex-col space-y-4">
              <p className="text-center text-sm">
                Didn't receive a code?{" "}
                <button 
                  type="button" 
                  className="text-vpn-blue hover:underline inline-flex items-center"
                  onClick={handleResendCode}
                >
                  Resend <RefreshCw className="ml-1 w-3 h-3" />
                </button>
              </p>
            </div>
          </form>
        )}

        {verificationState === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold">Verification Successful</h2>
            <p className="text-muted-foreground">
              Your {verificationType} has been verified successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you...
            </p>
          </div>
        )}

        {verificationState === 'error' && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <X className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold">Verification Failed</h2>
            <p className="text-muted-foreground">
              {error}
            </p>
            <div className="pt-4">
              <Button onClick={() => setVerificationState('idle')}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationDialog;
