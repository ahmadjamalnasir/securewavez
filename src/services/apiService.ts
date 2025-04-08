
import axiosClient from '@/api/axiosClient';
import { Server } from '@/types/vpn';
import { LoginRequest, SignupRequest, OtpVerificationRequest, ResetPasswordRequest } from '@/api/authApi';

/**
 * Comprehensive API service layer for the VPN application
 */
const apiService = {
  // Authentication Services
  auth: {
    /**
     * Log in a user
     * @param data Login request data
     */
    login: async (data: LoginRequest) => {
      const response = await axiosClient.post('/auth/login', data);
      return response.data;
    },
    
    /**
     * Register a new user
     * @param data Signup request data
     */
    signup: async (data: SignupRequest) => {
      const response = await axiosClient.post('/auth/signup', data);
      return response.data;
    },
    
    /**
     * Verify an OTP (one-time password)
     * @param data OTP verification data
     */
    verifyOtp: async (data: OtpVerificationRequest) => {
      const response = await axiosClient.post('/auth/verify-otp', data);
      return response.data;
    },
    
    /**
     * Request a password reset
     * @param type Type of contact (email or phone)
     * @param contact Contact value
     */
    forgotPassword: async (type: 'email' | 'phone', contact: string) => {
      const response = await axiosClient.post('/auth/forgot-password', { type, contact });
      return response.data;
    },
    
    /**
     * Reset a password
     * @param data Reset password data
     */
    resetPassword: async (data: ResetPasswordRequest) => {
      const response = await axiosClient.post('/auth/reset-password', data);
      return response.data;
    },
    
    /**
     * Resend an OTP
     * @param type Type of contact (email or phone)
     * @param contact Contact value
     */
    resendOtp: async (type: 'email' | 'phone', contact: string) => {
      const response = await axiosClient.post('/auth/resend-otp', { type, contact });
      return response.data;
    },
    
    /**
     * Log out a user
     */
    logout: async () => {
      const response = await axiosClient.post('/auth/logout');
      return response.data;
    }
  },
  
  // VPN Server Services
  servers: {
    /**
     * Get all available servers
     * @returns List of servers
     */
    getAll: async (): Promise<Server[]> => {
      const response = await axiosClient.get('/vpn/servers');
      return response.data;
    },
    
    /**
     * Get a specific server by ID
     * @param id Server ID
     * @returns Server details
     */
    getById: async (id: string): Promise<Server> => {
      const response = await axiosClient.get(`/vpn/servers/${id}`);
      return response.data;
    },
    
    /**
     * Get the recommended server based on load and latency
     * @returns Recommended server
     */
    getRecommended: async (): Promise<Server> => {
      const response = await axiosClient.get('/vpn/servers/recommended');
      return response.data;
    }
  },
  
  // Connection Services
  connection: {
    /**
     * Connect to a server
     * @param serverId Server ID
     * @returns Connection status
     */
    connect: async (serverId: string) => {
      const response = await axiosClient.post('/vpn/connect', { serverId });
      return response.data;
    },
    
    /**
     * Disconnect from the current server
     * @returns Connection status
     */
    disconnect: async () => {
      const response = await axiosClient.post('/vpn/disconnect');
      return response.data;
    },
    
    /**
     * Get the current connection status
     * @returns Connection status
     */
    getStatus: async () => {
      const response = await axiosClient.get('/vpn/status');
      return response.data;
    },
    
    /**
     * Get connection statistics
     * @returns Connection statistics
     */
    getStats: async () => {
      const response = await axiosClient.get('/vpn/stats');
      return response.data;
    }
  },
  
  // Subscription Services
  subscription: {
    /**
     * Get the current user's subscription details
     * @returns Subscription details
     */
    getDetails: async () => {
      const response = await axiosClient.get('/subscription');
      return response.data;
    },
    
    /**
     * Create a new subscription
     * @param planId Plan ID
     * @returns Checkout URL
     */
    createSubscription: async (planId: string) => {
      const response = await axiosClient.post('/subscription/create', { planId });
      return response.data;
    },
    
    /**
     * Cancel the current subscription
     * @returns Cancellation confirmation
     */
    cancelSubscription: async () => {
      const response = await axiosClient.post('/subscription/cancel');
      return response.data;
    },
    
    /**
     * Update payment method
     * @returns Update payment method URL
     */
    updatePaymentMethod: async () => {
      const response = await axiosClient.post('/subscription/update-payment');
      return response.data;
    },
    
    /**
     * Reactivate a cancelled subscription
     * @returns Reactivation confirmation
     */
    reactivateSubscription: async () => {
      const response = await axiosClient.post('/subscription/reactivate');
      return response.data;
    }
  },
  
  // Payment Services
  payment: {
    // Stripe payment methods
    stripe: {
      /**
       * Create a checkout session for a subscription
       * @param planId Plan ID
       * @returns Checkout URL
       */
      createCheckoutSession: async (planId: string) => {
        const response = await axiosClient.post('/payments/stripe/create-checkout', { planId });
        return response.data;
      },
      
      /**
       * Create a one-time payment session
       * @param amount Amount in cents
       * @param description Payment description
       * @returns Checkout URL
       */
      createOneTimePayment: async (amount: number, description: string) => {
        const response = await axiosClient.post('/payments/stripe/one-time', { 
          amount, 
          description 
        });
        return response.data;
      }
    },
    
    // Cryptocurrency payment methods
    crypto: {
      /**
       * Create a cryptocurrency payment
       * @param amount Amount in USD
       * @param description Payment description
       * @returns Payment details including crypto address
       */
      createPayment: async (amount: number, description: string) => {
        const response = await axiosClient.post('/payments/crypto/create', { 
          amount, 
          description 
        });
        return response.data;
      },
      
      /**
       * Check the status of a cryptocurrency payment
       * @param paymentId Payment ID
       * @returns Payment status
       */
      checkPaymentStatus: async (paymentId: string) => {
        const response = await axiosClient.get(`/payments/crypto/status/${paymentId}`);
        return response.data;
      }
    }
  },
  
  // User Services
  user: {
    /**
     * Get the current user's profile
     * @returns User profile
     */
    getProfile: async () => {
      const response = await axiosClient.get('/user/profile');
      return response.data;
    },
    
    /**
     * Update the current user's profile
     * @param data Updated profile data
     * @returns Updated profile
     */
    updateProfile: async (data: any) => {
      const response = await axiosClient.put('/user/profile', data);
      return response.data;
    },
    
    /**
     * Change the user's password
     * @param currentPassword Current password
     * @param newPassword New password
     * @returns Success message
     */
    changePassword: async (currentPassword: string, newPassword: string) => {
      const response = await axiosClient.post('/user/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    },
    
    /**
     * Get the user's activity history
     * @returns Activity history
     */
    getActivityHistory: async () => {
      const response = await axiosClient.get('/user/activity');
      return response.data;
    },
    
    /**
     * Delete the user's account
     * @param password Password confirmation
     * @returns Success message
     */
    deleteAccount: async (password: string) => {
      const response = await axiosClient.post('/user/delete-account', { password });
      return response.data;
    }
  },
  
  // Settings Services
  settings: {
    /**
     * Get VPN settings
     * @returns VPN settings
     */
    getVpnSettings: async () => {
      const response = await axiosClient.get('/settings/vpn');
      return response.data;
    },
    
    /**
     * Update VPN settings
     * @param settings Updated settings
     * @returns Updated settings
     */
    updateVpnSettings: async (settings: any) => {
      const response = await axiosClient.put('/settings/vpn', settings);
      return response.data;
    },
    
    /**
     * Get app settings
     * @returns App settings
     */
    getAppSettings: async () => {
      const response = await axiosClient.get('/settings/app');
      return response.data;
    },
    
    /**
     * Update app settings
     * @param settings Updated settings
     * @returns Updated settings
     */
    updateAppSettings: async (settings: any) => {
      const response = await axiosClient.put('/settings/app', settings);
      return response.data;
    }
  }
};

export default apiService;
