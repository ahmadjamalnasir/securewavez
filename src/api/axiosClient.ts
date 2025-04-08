
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// API base URL - in a real environment, this would come from env variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.yourvpnservice.com';

// Log the API URL during development
if (import.meta.env.DEV) {
  console.log('API URL:', API_BASE_URL);
}

// Create axios instance
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor for adding auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Define an interface for the error response structure
interface ApiErrorResponse {
  errors?: Record<string, string[]>;
  message?: string;
}

// Response interceptor for handling errors globally
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const statusCode = error.response?.status;
    
    // Handle authentication errors
    if (statusCode === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      
      // If we're not already on the auth page, redirect there
      if (window.location.pathname !== '/auth') {
        toast.error('Your session has expired. Please log in again.');
        window.location.href = '/auth';
      }
    }
    
    // Handle server errors
    if (statusCode && statusCode >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    // Handle not found errors
    if (statusCode === 404) {
      toast.error('Resource not found.');
    }
    
    // Handle validation errors
    if (statusCode === 422) {
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        // Display the first validation error
        const firstError = Object.values(validationErrors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          toast.error(firstError[0]);
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Validation error. Please check your input.');
      }
    }
    
    // For other error types, show a generic message if no specific handling
    if (!statusCode || ![401, 404, 422].includes(statusCode) && statusCode < 500) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// Utility function for handling API responses with proper types
export function handleApiResponse<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
  return promise
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export default axiosClient;
