import axiosClient from '@/api/axiosClient';
import { Server } from '@/types/vpn';
import { LoginRequest, SignupRequest, OtpVerificationRequest, ResetPasswordRequest } from '@/api/authApi';

/**
 * Comprehensive API service layer for the VPN application
 * This service handles all API calls and provides caching, error handling, and request interception
 */
class ApiService {
  // Cache storage
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private defaultCacheTime = 5 * 60 * 1000; // 5 minutes
  
  /**
   * Make a cached API request
   * @param key Cache key
   * @param apiFn Function that makes the API request
   * @param ttl Time to live in milliseconds
   * @returns Promise that resolves to the API response
   */
  private async cachedRequest<T>(
    key: string,
    apiFn: () => Promise<T>,
    ttl: number = this.defaultCacheTime
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    // Return cached data if it exists and hasn't expired
    if (cached && cached.expiry > now) {
      console.log(`Using cached data for ${key}`);
      return cached.data as T;
    }
    
    // Make the API request
    const data = await apiFn();
    
    // Cache the response
    this.cache.set(key, { data, expiry: now + ttl });
    
    return data;
  }
  
  /**
   * Clear the entire cache or a specific key
   * @param key Optional cache key to clear
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
  
  // Authentication Services
  auth = {
    /**
     * Log in a user
     * @param data Login request data
     */
    login: async (data: LoginRequest) => {
      try {
        const response = await axiosClient.post('/auth/login', data);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Login failed');
        throw error;
      }
    },
    
    /**
     * Register a new user
     * @param data Signup request data
     */
    signup: async (data: SignupRequest) => {
      try {
        const response = await axiosClient.post('/auth/signup', data);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Signup failed');
        throw error;
      }
    },
    
    /**
     * Verify an OTP (one-time password)
     * @param data OTP verification data
     */
    verifyOtp: async (data: OtpVerificationRequest) => {
      try {
        const response = await axiosClient.post('/auth/verify-otp', data);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'OTP verification failed');
        throw error;
      }
    },
    
    /**
     * Request a password reset
     * @param type Type of contact (email or phone)
     * @param contact Contact value
     */
    forgotPassword: async (type: 'email' | 'phone', contact: string) => {
      try {
        const response = await axiosClient.post('/auth/forgot-password', { type, contact });
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Password reset request failed');
        throw error;
      }
    },
    
    /**
     * Reset a password
     * @param data Reset password data
     */
    resetPassword: async (data: ResetPasswordRequest) => {
      try {
        const response = await axiosClient.post('/auth/reset-password', data);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Password reset failed');
        throw error;
      }
    },
    
    /**
     * Resend an OTP
     * @param type Type of contact (email or phone)
     * @param contact Contact value
     */
    resendOtp: async (type: 'email' | 'phone', contact: string) => {
      try {
        const response = await axiosClient.post('/auth/resend-otp', { type, contact });
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to resend OTP');
        throw error;
      }
    },
    
    /**
     * Log out a user
     */
    logout: async () => {
      try {
        const response = await axiosClient.post('/auth/logout');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Logout failed');
        throw error;
      }
    }
  };
  
  // VPN Server Services
  servers = {
    /**
     * Get all available servers
     * @param forceRefresh Force a refresh of the cache
     * @returns List of servers
     */
    getAll: async (forceRefresh = false): Promise<Server[]> => {
      const cacheKey = 'servers:all';
      
      if (forceRefresh) {
        this.clearCache(cacheKey);
      }
      
      return this.cachedRequest(
        cacheKey,
        async () => {
          const response = await axiosClient.get('/vpn/servers');
          return response.data;
        }
      );
    },
    
    /**
     * Get a specific server by ID
     * @param id Server ID
     * @returns Server details
     */
    getById: async (id: string): Promise<Server> => {
      const cacheKey = `server:${id}`;
      
      return this.cachedRequest(
        cacheKey,
        async () => {
          const response = await axiosClient.get(`/vpn/servers/${id}`);
          return response.data;
        }
      );
    },
    
    /**
     * Get the recommended server based on load and latency
     * @param forceRefresh Force a refresh of the cache
     * @returns Recommended server
     */
    getRecommended: async (forceRefresh = false): Promise<Server> => {
      const cacheKey = 'server:recommended';
      
      if (forceRefresh) {
        this.clearCache(cacheKey);
      }
      
      return this.cachedRequest(
        cacheKey,
        async () => {
          const response = await axiosClient.get('/vpn/servers/recommended');
          return response.data;
        },
        60 * 1000 // 1 minute cache for recommended server
      );
    }
  };
  
  // Connection Services
  connection = {
    /**
     * Connect to a server
     * @param serverId Server ID
     * @returns Connection status
     */
    connect: async (serverId: string) => {
      try {
        const response = await axiosClient.post('/vpn/connect', { serverId });
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Connection failed');
        throw error;
      }
    },
    
    /**
     * Disconnect from the current server
     * @returns Connection status
     */
    disconnect: async () => {
      try {
        const response = await axiosClient.post('/vpn/disconnect');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Disconnection failed');
        throw error;
      }
    },
    
    /**
     * Get the current connection status
     * @returns Connection status
     */
    getStatus: async () => {
      try {
        const response = await axiosClient.get('/vpn/status');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to get connection status');
        throw error;
      }
    },
    
    /**
     * Get connection statistics
     * @returns Connection statistics
     */
    getStats: async () => {
      try {
        const response = await axiosClient.get('/vpn/stats');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to get connection stats');
        throw error;
      }
    }
  };
  
  // Subscription Services
  subscription = {
    /**
     * Get the current user's subscription details
     * @returns Subscription details
     */
    getDetails: async () => {
      try {
        const response = await axiosClient.get('/subscription');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to get subscription details');
        throw error;
      }
    },
    
    /**
     * Create a new subscription
     * @param planId Plan ID
     * @returns Checkout URL
     */
    createSubscription: async (planId: string) => {
      try {
        const response = await axiosClient.post('/subscription/create', { planId });
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to create subscription');
        throw error;
      }
    },
    
    /**
     * Cancel the current subscription
     * @returns Cancellation confirmation
     */
    cancelSubscription: async () => {
      try {
        const response = await axiosClient.post('/subscription/cancel');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to cancel subscription');
        throw error;
      }
    },
    
    /**
     * Update payment method
     * @returns Update payment method URL
     */
    updatePaymentMethod: async () => {
      try {
        const response = await axiosClient.post('/subscription/update-payment');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to update payment method');
        throw error;
      }
    },
    
    /**
     * Reactivate a cancelled subscription
     * @returns Reactivation confirmation
     */
    reactivateSubscription: async () => {
      try {
        const response = await axiosClient.post('/subscription/reactivate');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to reactivate subscription');
        throw error;
      }
    },
    
    /**
     * Get a subscription plan by ID
     * @param planId Plan ID
     * @returns Subscription plan details
     */
    getPlan: async (planId: string) => {
      try {
        const response = await axiosClient.get(`/subscription/plans/${planId}`);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to get subscription plan');
        throw error;
      }
    }
  };
  
  // Payment Services
  payment = {
    // Stripe payment methods
    stripe: {
      /**
       * Create a checkout session for a subscription
       * @param planId Plan ID
       * @returns Checkout URL
       */
      createCheckoutSession: async (planId: string) => {
        try {
          const response = await axiosClient.post('/payments/stripe/create-checkout', { planId });
          return response.data;
        } catch (error) {
          this.handleApiError(error, 'Failed to create Stripe checkout session');
          throw error;
        }
      },
      
      /**
       * Create a one-time payment session
       * @param amount Amount in cents
       * @param description Payment description
       * @returns Checkout URL
       */
      createOneTimePayment: async (amount: number, description: string) => {
        try {
          const response = await axiosClient.post('/payments/stripe/one-time', { 
            amount, 
            description 
          });
          return response.data;
        } catch (error) {
          this.handleApiError(error, 'Failed to create Stripe one-time payment');
          throw error;
        }
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
        try {
          const response = await axiosClient.post('/payments/crypto/create', { 
            amount, 
            description 
          });
          return response.data;
        } catch (error) {
          this.handleApiError(error, 'Failed to create crypto payment');
          throw error;
        }
      },
      
      /**
       * Check the status of a cryptocurrency payment
       * @param paymentId Payment ID
       * @returns Payment status
       */
      checkPaymentStatus: async (paymentId: string) => {
        try {
          const response = await axiosClient.get(`/payments/crypto/status/${paymentId}`);
          return response.data;
        } catch (error) {
          this.handleApiError(error, 'Failed to check crypto payment status');
          throw error;
        }
      }
    }
  };
  
  // User Services
  user = {
    /**
     * Get the current user's profile
     * @returns User profile
     */
    getProfile: async () => {
      try {
        const response = await axiosClient.get('/user/profile');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to get user profile');
        throw error;
      }
    },
    
    /**
     * Update the current user's profile
     * @param data Updated profile data
     * @returns Updated profile
     */
    updateProfile: async (data: any) => {
      try {
        const response = await axiosClient.put('/user/profile', data);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to update user profile');
        throw error;
      }
    },
    
    /**
     * Change the user's password
     * @param currentPassword Current password
     * @param newPassword New password
     * @returns Success message
     */
    changePassword: async (currentPassword: string, newPassword: string) => {
      try {
        const response = await axiosClient.post('/user/change-password', {
          currentPassword,
          newPassword
        });
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to change password');
        throw error;
      }
    },
    
    /**
     * Get the user's activity history
     * @returns Activity history
     */
    getActivityHistory: async () => {
      try {
        const response = await axiosClient.get('/user/activity');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to get activity history');
        throw error;
      }
    },
    
    /**
     * Delete the user's account
     * @param password Password confirmation
     * @returns Success message
     */
    deleteAccount: async (password: string) => {
      try {
        const response = await axiosClient.post('/user/delete-account', { password });
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to delete account');
        throw error;
      }
    }
  };
  
  // Settings Services
  settings = {
    /**
     * Get VPN settings
     * @returns VPN settings
     */
    getVpnSettings: async () => {
      try {
        const response = await axiosClient.get('/settings/vpn');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to get VPN settings');
        throw error;
      }
    },
    
    /**
     * Update VPN settings
     * @param settings Updated settings
     * @returns Updated settings
     */
    updateVpnSettings: async (settings: any) => {
      try {
        const response = await axiosClient.put('/settings/vpn', settings);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to update VPN settings');
        throw error;
      }
    },
    
    /**
     * Get app settings
     * @returns App settings
     */
    getAppSettings: async () => {
      try {
        const response = await axiosClient.get('/settings/app');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to get app settings');
        throw error;
      }
    },
    
    /**
     * Update app settings
     * @param settings Updated settings
     * @returns Updated settings
     */
    updateAppSettings: async (settings: any) => {
      try {
        const response = await axiosClient.put('/settings/app', settings);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'Failed to update app settings');
        throw error;
      }
    }
  };
  
  /**
   * Handle API errors with improved error messages
   * @param error The error object
   * @param defaultMessage Default error message
   * @private
   */
  private handleApiError(error: any, defaultMessage: string): void {
    // Extract error message from the response
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        defaultMessage;
    
    // Log detailed error information for debugging
    console.error('API Error:', {
      message: errorMessage,
      status: error?.response?.status,
      url: error?.config?.url,
      method: error?.config?.method,
      data: error?.response?.data
    });
    
    // Include additional context for specific error types
    const enhancedMessage = this.getEnhancedErrorMessage(
      error?.response?.status,
      errorMessage
    );
    
    // We don't throw here to allow the caller to handle the error
    // and potentially display a more specific message
  }
  
  /**
   * Get an enhanced error message based on the status code
   * @param status HTTP status code
   * @param baseMessage Basic error message
   * @returns Enhanced error message with additional context
   * @private
   */
  private getEnhancedErrorMessage(status: number, baseMessage: string): string {
    switch (status) {
      case 401:
        return `${baseMessage} - Please log in again`;
      case 403:
        return `${baseMessage} - You don't have permission to perform this action`;
      case 404:
        return `${baseMessage} - The requested resource was not found`;
      case 429:
        return `${baseMessage} - Too many requests, please try again later`;
      case 500:
      case 502:
      case 503:
      case 504:
        return `${baseMessage} - Server error, please try again later`;
      default:
        return baseMessage;
    }
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService;
