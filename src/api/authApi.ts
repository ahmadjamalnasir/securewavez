
import axiosClient, { handleApiResponse } from './axiosClient';

// Types for auth requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ResetPasswordRequest {
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface OtpVerificationRequest {
  verificationType: 'email' | 'phone';
  contact: string;
  otp: string;
  isSignUp?: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    isVerified: boolean;
  };
}

const authApi = {
  login: (data: LoginRequest) => 
    handleApiResponse<AuthResponse>(axiosClient.post('/auth/login', data)),

  signup: (data: SignupRequest) => 
    handleApiResponse<{ message: string }>(axiosClient.post('/auth/signup', data)),

  verifyOtp: (data: OtpVerificationRequest) => 
    handleApiResponse<AuthResponse | { message: string }>(
      axiosClient.post('/auth/verify-otp', data)
    ),

  resendOtp: (type: 'email' | 'phone', contact: string) => 
    handleApiResponse<{ message: string }>(
      axiosClient.post('/auth/resend-otp', { type, contact })
    ),

  forgotPassword: (type: 'email' | 'phone', contact: string) => 
    handleApiResponse<{ message: string }>(
      axiosClient.post('/auth/forgot-password', { type, contact })
    ),

  resetPassword: (data: ResetPasswordRequest) => 
    handleApiResponse<{ message: string }>(
      axiosClient.post('/auth/reset-password', data)
    ),

  logout: () => 
    handleApiResponse<{ message: string }>(axiosClient.post('/auth/logout')),
};

export default authApi;
