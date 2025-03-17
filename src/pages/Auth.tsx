
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthContainer from '@/components/auth/AuthContainer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import OtpVerificationDialog from '@/components/auth/OtpVerificationDialog';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState<{
    email?: string;
    phone?: string;
  }>({});
  
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
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
              setForgotPasswordOpen={setForgotPasswordOpen} 
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm 
              isLoading={isLoading} 
              setIsLoading={setIsLoading}
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
            isLoading={isLoading}
            setIsLoading={setIsLoading}
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
            isLoading={isLoading}
            setIsLoading={setIsLoading}
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
