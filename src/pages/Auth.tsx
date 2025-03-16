
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthContainer from '@/components/auth/AuthContainer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  // Reset all forms when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
