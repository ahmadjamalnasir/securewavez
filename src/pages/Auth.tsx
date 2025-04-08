
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthContainer from '@/components/auth/AuthContainer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import OtpVerificationDialog from '@/components/auth/OtpVerificationDialog';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Auth() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState<{
    email?: string;
    phone?: string;
  }>({});
  const [resetFormLoading, setResetFormLoading] = useState(false);
  
  // For OTP verification dialog
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [verificationType, setVerificationType] = useState<'email' | 'phone'>('email');
  const [contactValue, setContactValue] = useState('');
  const [signUpData, setSignUpData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  } | null>(null);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast.success('You are logged in!');
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Reset all forms when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // This function will be passed down to SignupForm and LoginForm components
  const handleVerificationNeeded = (type: 'email' | 'phone', contact: string, userData?: any) => {
    setVerificationType(type);
    setContactValue(contact);
    if (userData) {
      setSignUpData(userData);
    } else {
      setSignUpData(null);
    }
    setOtpDialogOpen(true);
  };

  const handleVerificationSuccess = () => {
    if (signUpData) {
      // This was from signup, navigate to home
      toast.success('Account created successfully!');
      setTimeout(() => {
        navigate('/home');
      }, 500);
    } else if (isPasswordReset) {
      // This was from forgot password, open reset password dialog
      setForgotPasswordOpen(false);
      setOtpDialogOpen(false);
      
      // Show the reset password form
      setResetPasswordData({
        [verificationType]: contactValue
      });
      setResetPasswordOpen(true);
      setIsPasswordReset(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-vpn-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <AuthContainer>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm 
              setForgotPasswordOpen={setForgotPasswordOpen} 
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm 
              onVerificationNeeded={handleVerificationNeeded}
            />
          </TabsContent>
        </Tabs>
      </AuthContainer>
      
      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          
          <ForgotPasswordForm
            onClose={() => setForgotPasswordOpen(false)}
            onVerificationNeeded={(type, contact) => {
              setIsPasswordReset(true);
              handleVerificationNeeded(type, contact);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Password</DialogTitle>
          </DialogHeader>
          
          <ResetPasswordForm
            isLoading={resetFormLoading}
            setIsLoading={setResetFormLoading}
            email={resetPasswordData.email}
            phone={resetPasswordData.phone}
            onClose={() => setResetPasswordOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <OtpVerificationDialog
        isOpen={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        verificationType={verificationType}
        contact={contactValue}
        onSuccess={handleVerificationSuccess}
        isSignUp={!!signUpData}
        signUpData={signUpData || undefined}
      />
    </>
  );
}
