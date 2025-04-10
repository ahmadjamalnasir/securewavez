import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import GoogleIcon from './GoogleIcon';

interface SignupFormProps {
  onVerificationNeeded?: (type: 'email' | 'phone', contact: string, userData?: any) => void;
}

const SignupForm = ({ onVerificationNeeded }: SignupFormProps) => {
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup form state
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
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

  const handleSignupStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate first step
    if (!signupForm.firstName || !signupForm.lastName || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      return;
    }
    
    if (!isValidEmail(signupForm.email)) {
      return;
    }

    if (signupForm.phone && !isValidPhone(signupForm.phone)) {
      return;
    }
    
    // Call the signup API
    await signup({
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      email: signupForm.email,
      password: signupForm.password,
      phone: signupForm.phone || undefined
    });
    
    // Check if we should use the onVerificationNeeded callback
    if (onVerificationNeeded) {
      // Call the verification needed callback
      onVerificationNeeded('email', signupForm.email, {
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        email: signupForm.email,
        password: signupForm.password,
        phone: signupForm.phone
      });
    }
  };

  const handleGoogleSignIn = () => {
    // This would integrate with the Google OAuth API
    // For now, it's just a placeholder
    alert('Google Sign Up is not implemented yet');
  };

  return (
    <form onSubmit={handleSignupStepOne} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="firstName" className="text-sm font-medium">
          First Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            className="pl-10 vpn-input"
            value={signupForm.firstName}
            onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="lastName" className="text-sm font-medium">
          Last Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            className="pl-10 vpn-input"
            value={signupForm.lastName}
            onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="signup-email" className="text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="signup-email"
            type="email"
            placeholder="your@email.com"
            className="pl-10 vpn-input"
            value={signupForm.email}
            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="signup-password" className="text-sm font-medium">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 vpn-input"
            value={signupForm.password}
            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
            required
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
        <label htmlFor="confirm-password" className="text-sm font-medium">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 vpn-input"
            value={signupForm.confirmPassword}
            onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone Number (Optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="+1234567890"
            className="pl-10 vpn-input"
            value={signupForm.phone}
            onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          If provided, we'll verify your phone for account recovery
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 shadow-button"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <>
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </>
        )}
      </Button>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Or sign up with
          </span>
        </div>
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-gray-300 dark:border-gray-600"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <GoogleIcon className="mr-2 h-5 w-5" />
        Sign up with Google
      </Button>
    </form>
  );
};

export default SignupForm;
