
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, 
  Phone, User, AtSign, Google, ArrowLeft, KeyRound, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import FadeIn from '@/components/animations/FadeIn';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Login state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  // Signup state
  const [signupStep, setSignupStep] = useState(1);
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    includePhone: false
  });
  
  // OTP state
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  
  // Forgot password state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    identifier: '',
    method: 'email', // 'email' or 'phone'
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Helper function for validating email
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Helper function for validating phone
  const isValidPhone = (phone: string) => {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone);
  };

  // Login form handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!loginForm.email || !loginForm.password) {
      setIsLoading(false);
      return toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
    }
    
    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Success, navigate to home
      toast({
        title: "Success",
        description: "You have successfully logged in"
      });
      
      navigate('/home');
    }, 1500);
  };
  
  // Google OAuth handler
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    
    // Simulate OAuth API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Success",
        description: "Google Sign-in successful"
      });
      
      navigate('/home');
    }, 1500);
  };

  // Signup form handlers
  const handleSignupStepOne = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate first step
    if (!signupForm.firstName || !signupForm.lastName || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      return toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      return toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
    }
    
    if (!isValidEmail(signupForm.email)) {
      return toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
    }

    if (signupForm.phone && !isValidPhone(signupForm.phone)) {
      return toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
    }
    
    // Move to next step (email OTP verification)
    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setSignupStep(2);
      
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email"
      });
    }, 1000);
  };
  
  const handleEmailOtpVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailOtp.length !== 6) {
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
      
      // If phone is provided, move to phone verification, otherwise complete signup
      if (signupForm.phone) {
        setSignupStep(3);
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your phone"
        });
      } else {
        // Complete signup
        completeSignup();
      }
    }, 1000);
  };
  
  const handlePhoneOtpVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneOtp.length !== 6) {
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
      completeSignup();
    }, 1000);
  };
  
  const completeSignup = () => {
    toast({
      title: "Success",
      description: "Account created successfully"
    });
    
    navigate('/home');
  };
  
  // Forgot password handlers
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
      setForgotPasswordOpen(false);
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
  
  // Reset all forms when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSignupStep(1);
    setEmailOtp('');
    setPhoneOtp('');
    setSignupForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      includePhone: false
    });
    setLoginForm({
      email: '',
      password: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] bg-[length:20px_20px]">
      <FadeIn>
        <div className="max-w-md w-full p-6 glass-morphism rounded-2xl shadow-elevation-2">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vpn-blue to-vpn-teal flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-8">Welcome to SecureVPN</h1>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10 vpn-input"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <button 
                      type="button" 
                      className="text-xs text-vpn-blue hover:underline"
                      onClick={() => setForgotPasswordOpen(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 vpn-input"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
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
                
                <Button 
                  type="submit" 
                  className="w-full h-12 shadow-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      Login <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">
                      Or continue with
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
                  <Google className="mr-2 h-5 w-5" />
                  Sign in with Google
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              {signupStep === 1 && (
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
                    <Google className="mr-2 h-5 w-5" />
                    Sign up with Google
                  </Button>
                </form>
              )}
              
              {signupStep === 2 && (
                <form onSubmit={handleEmailOtpVerification} className="space-y-4">
                  <div className="text-center mb-4">
                    <AtSign className="mx-auto h-12 w-12 text-vpn-blue mb-2" />
                    <h2 className="text-xl font-bold">Email Verification</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      We've sent a 6-digit code to {signupForm.email}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email-otp" className="text-sm font-medium">
                      Enter verification code
                    </label>
                    <div className="flex justify-center my-4">
                      <InputOTP 
                        maxLength={6} 
                        value={emailOtp} 
                        onChange={setEmailOtp}
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
                          Verify Email <CheckCircle className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full h-12" 
                      onClick={() => setSignupStep(1)}
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
                          description: "A new verification code has been sent to your email"
                        });
                      }}
                    >
                      Resend
                    </button>
                  </p>
                </form>
              )}
              
              {signupStep === 3 && (
                <form onSubmit={handlePhoneOtpVerification} className="space-y-4">
                  <div className="text-center mb-4">
                    <Phone className="mx-auto h-12 w-12 text-vpn-blue mb-2" />
                    <h2 className="text-xl font-bold">Phone Verification</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      We've sent a 6-digit code to {signupForm.phone}
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
                      onClick={() => setSignupStep(2)}
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
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                By continuing, you agree to our 
                <a href="#" className="text-vpn-blue hover:underline mx-1">Terms of Service</a>
                and
                <a href="#" className="text-vpn-blue hover:underline ml-1">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
      
      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          
          {forgotPasswordStep === 1 && (
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
          )}
          
          {forgotPasswordStep === 2 && (
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
          )}
          
          {forgotPasswordStep === 3 && (
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
