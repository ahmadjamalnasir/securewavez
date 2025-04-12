
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import GoogleIcon from './GoogleIcon';
import { toast } from 'sonner';

interface LoginFormProps {
  setForgotPasswordOpen: (open: boolean) => void;
}

const LoginForm = ({ setForgotPasswordOpen }: LoginFormProps) => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      // Call the login method from AuthContext
      await login({
        email: loginForm.email,
        password: loginForm.password
      });
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled by the API service, but we can provide a fallback message
      toast.error('Unable to connect to authentication service. Please try again later.');
    }
  };
  
  const handleGoogleSignIn = () => {
    // This would integrate with the Google OAuth API
    // For now, it's just a placeholder
    toast.info('Google Sign In is not implemented yet');
  };

  return (
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
        <GoogleIcon className="mr-2 h-5 w-5" />
        Sign in with Google
      </Button>
    </form>
  );
};

export default LoginForm;
