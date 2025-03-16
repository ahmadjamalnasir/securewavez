
import { useState } from 'react';
import { AtSign, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface ForgotPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onClose: () => void;
}

const ForgotPasswordForm = ({ isLoading, setIsLoading, onClose }: ForgotPasswordFormProps) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    identifier: '',
    method: 'email', // 'email' or 'phone'
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Helper functions for validation
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isValidPhone = (phone: string) => {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordForm.identifier) {
      return toast({
        title: "Error",
        description: "Please enter your email or phone number",
        variant: "destructive"
      });
    }
    
    // Determine if identifier is email or phone
    const isEmail = isValidEmail(forgotPasswordForm.identifier);
    const isPhone = isValidPhone(forgotPasswordForm.identifier);
    
    if (!isEmail && !isPhone) {
      return toast({
        title: "Error",
        description: "Please enter a valid email or phone number",
        variant: "destructive"
      });
    }
    
    // Set method based on identifier
    setForgotPasswordForm({
      ...forgotPasswordForm,
      method: isEmail ? 'email' : 'phone'
    });
    
    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setForgotPasswordStep(2);
      
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to your ${isEmail ? 'email' : 'phone'}`
      });
    }, 1000);
  };
  
  const handleForgotPasswordOtpVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (forgotPasswordForm.otp.length !== 6) {
      return toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive"
      });
    }
    
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setForgotPasswordStep(3);
    }, 1000);
  };
  
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordForm.newPassword || !forgotPasswordForm.confirmNewPassword) {
      return toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
    }
    
    if (forgotPasswordForm.newPassword !== forgotPasswordForm.confirmNewPassword) {
      return toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
    }
    
    setIsLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      setForgotPasswordStep(1);
      setForgotPasswordForm({
        identifier: '',
        method: 'email',
        otp: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      toast({
        title: "Success",
        description: "Your password has been reset successfully"
      });
    }, 1000);
  };

  if (forgotPasswordStep === 1) {
    return (
      <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="identifier" className="text-sm font-medium">
            Email or Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AtSign className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="identifier"
              type="text"
              placeholder="your@email.com or +1234567890"
              className="pl-10 vpn-input"
              value={forgotPasswordForm.identifier}
              onChange={(e) => setForgotPasswordForm({ ...forgotPasswordForm, identifier: e.target.value })}
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            "Send verification code"
          )}
        </Button>
      </form>
    );
  }

  if (forgotPasswordStep === 2) {
    return (
      <form onSubmit={handleForgotPasswordOtpVerification} className="space-y-4">
        <div className="text-center mb-4">
          <KeyRound className="mx-auto h-12 w-12 text-vpn-blue mb-2" />
          <p className="text-sm text-muted-foreground">
            We've sent a 6-digit code to your {forgotPasswordForm.method}
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="reset-otp" className="text-sm font-medium">
            Enter verification code
          </label>
          <div className="flex justify-center my-4">
            <InputOTP 
              maxLength={6} 
              value={forgotPasswordForm.otp} 
              onChange={(value) => setForgotPasswordForm({ ...forgotPasswordForm, otp: value })}
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
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              "Verify Code"
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setForgotPasswordStep(1)}
          >
            Back
          </Button>
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          Didn't receive a code? 
          <button 
            type="button" 
            className="text-vpn-blue hover:underline ml-1"
            onClick={() => {
              toast({
                title: "OTP Resent",
                description: `A new verification code has been sent to your ${forgotPasswordForm.method}`
              });
            }}
          >
            Resend
          </button>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="text-center mb-4">
        <Lock className="mx-auto h-12 w-12 text-vpn-blue mb-2" />
        <h2 className="text-lg font-semibold">Set New Password</h2>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="new-password" className="text-sm font-medium">
          New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="new-password"
            type={showPassword ? "text" : "password"}
            className="pl-10 pr-10"
            value={forgotPasswordForm.newPassword}
            onChange={(e) => setForgotPasswordForm({ ...forgotPasswordForm, newPassword: e.target.value })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirm-new-password" className="text-sm font-medium">
          Confirm New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="confirm-new-password"
            type={showPassword ? "text" : "password"}
            className="pl-10"
            value={forgotPasswordForm.confirmNewPassword}
            onChange={(e) => setForgotPasswordForm({ ...forgotPasswordForm, confirmNewPassword: e.target.value })}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
