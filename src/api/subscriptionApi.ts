
import axiosClient, { handleApiResponse } from './axiosClient';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface SubscriptionResponse {
  subscriptionId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
}

const subscriptionApi = {
  getPlans: () => 
    handleApiResponse<SubscriptionPlan[]>(axiosClient.get('/subscription/plans')),
  
  subscribe: (planId: string, paymentDetails: PaymentDetails) => 
    handleApiResponse<SubscriptionResponse>(
      axiosClient.post('/subscription/subscribe', { planId, paymentDetails })
    ),
  
  getCurrentSubscription: () => 
    handleApiResponse<SubscriptionResponse | null>(
      axiosClient.get('/subscription/current')
    ),
  
  cancelSubscription: (subscriptionId: string) => 
    handleApiResponse<{ message: string }>(
      axiosClient.post('/subscription/cancel', { subscriptionId })
    ),
};

export default subscriptionApi;
