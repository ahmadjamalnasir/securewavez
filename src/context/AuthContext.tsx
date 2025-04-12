import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi, { LoginRequest, SignupRequest, OtpVerificationRequest } from '@/api/authApi';
import { toast } from 'sonner';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  verifyOtp: (data: OtpVerificationRequest) => Promise<boolean>;
  forgotPassword: (type: 'email' | 'phone', contact: string) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
  resendOtp: (type: 'email' | 'phone', contact: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check if user is already authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      // In a real app, you would validate the token on the server
      // For now, we'll just check if there's a token and set isAuthenticated
      const userData = localStorage.getItem('user_data');
      
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }
    }
    
    setIsLoading(false);
  }, []);
  
  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    
    try {
      // First try the actual API
      const response = await authApi.login(data);
      
      // Save auth token and user data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
      
      // Redirect to home
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      
      // For demonstration purposes, allow demo login with certain credentials
      if (data.email === 'demo@example.com' && data.password === 'demo123') {
        // Create mock user data for demo
        const mockUser = {
          id: 'demo-user-id',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          isVerified: true
        };
        
        const mockToken = 'demo-token-' + Date.now();
        
        // Save mock auth data
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast.success('Welcome to the demo account!');
        navigate('/home');
      } else {
        // Either show error from API or a network error
        toast.error('Login failed. Try using demo@example.com / demo123 for demo access.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (data: SignupRequest) => {
    setIsLoading(true);
    
    try {
      await authApi.signup(data);
      // Success message is handled by the component or by the axios interceptor
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyOtp = async (data: OtpVerificationRequest): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await authApi.verifyOtp(data);
      
      // If this is a login/signup verification and we got a token
      if ('token' in response) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        setUser(response.user);
      }
      
      return true;
    } catch (error) {
      console.error('OTP verification failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const forgotPassword = async (type: 'email' | 'phone', contact: string) => {
    setIsLoading(true);
    
    try {
      await authApi.forgotPassword(type, contact);
      toast.success(`A verification code has been sent to your ${type}`);
    } catch (error) {
      console.error('Forgot password request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (data: any) => {
    setIsLoading(true);
    
    try {
      await authApi.resetPassword(data);
      toast.success('Password has been reset successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resendOtp = async (type: 'email' | 'phone', contact: string) => {
    try {
      await authApi.resendOtp(type, contact);
      toast.success(`A new verification code has been sent to your ${type}`);
    } catch (error) {
      console.error('Resend OTP failed:', error);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Call logout API endpoint
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Remove local storage items regardless of API success/failure
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      
      // Redirect to auth page
      navigate('/auth');
      setIsLoading(false);
    }
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    verifyOtp,
    forgotPassword,
    resetPassword,
    resendOtp,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
