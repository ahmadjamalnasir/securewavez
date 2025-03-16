
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X, Mail, Phone, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import FadeIn from '@/components/animations/FadeIn';

type VerificationType = 'email' | 'phone';

interface LocationState {
  verificationType: VerificationType;
  contact: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
}

const OtpConfirmation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verificationState, setVerificationState] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Extract state from location
  const state = location.state as LocationState | null;
  
  useEffect(() => {
    // If no state provided, redirect back to auth page
    if (!state) {
      toast({
        title: "Navigation Error",
        description: "Missing verification details",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [state, navigate, toast]);

  if (!state) {
    return null;
  }

  const { verificationType, contact } = state;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, any code except "000000" is considered valid
      if (otp === '000000') {
        setVerificationState('error');
        setError('Invalid verification code');
      } else {
        setVerificationState('success');
        
        // Show success toast
        toast({
          title: "Verification Successful",
          description: `Your ${verificationType} has been verified successfully.`
        });
        
        // Redirect to home after showing success for a moment
        setTimeout(() => {
          // If we came from sign up with complete data, create the account first
          if (state.firstName && state.lastName && state.email && state.password) {
            // In a real app, you would create the account here
            toast({
              title: "Account Created",
              description: "Your account has been created successfully."
            });
            navigate('/home');
          } else {
            navigate('/auth');
          }
        }, 1500);
      }
    }, 1500);
  };
  
  const handleResendCode = () => {
    toast({
      title: "Code Resent",
      description: `A new verification code has been sent to your ${verificationType}.`
    });
  };
  
  const handleGoBack = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] bg-[length:20px_20px]">
      <FadeIn>
        <div className="max-w-md w-full p-6 glass-morphism rounded-2xl shadow-elevation-2">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vpn-blue to-vpn-teal flex items-center justify-center">
              {verificationType === 'email' ? (
                <Mail className="w-8 h-8 text-white" />
              ) : (
                <Phone className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-4">
            {verificationType === 'email' ? 'Email Verification' : 'Phone Verification'}
          </h1>
          
          <p className="text-center text-muted-foreground mb-8">
            We've sent a 6-digit code to {contact}
          </p>

          {verificationState === 'idle' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={6} 
                    value={otp} 
                    onChange={setOtp}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, index) => (
                          <InputOTPSlot key={index} index={index} className="w-12 h-12" />
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
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={handleGoBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                </Button>
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
        </div>
      </FadeIn>
    </div>
  );
};

export default OtpConfirmation;
