
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, CreditCard, DollarSign, RefreshCw, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiService';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import FadeIn from '@/components/animations/FadeIn';
import PaymentOptions from '@/components/subscription/PaymentOptions';

function formatDate(date: string | number | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function Subscription() {
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch subscription details
  const { data: subscription, isLoading, refetch } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiService.subscription.getDetails(),
    // In development mode, use mock data
    ...(import.meta.env.DEV && {
      initialData: {
        status: 'active',
        plan: 'Premium',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancellationDate: null,
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025
        },
        invoices: [
          {
            id: 'inv_1',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 9.99,
            status: 'paid'
          },
          {
            id: 'inv_2',
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 9.99,
            status: 'paid'
          }
        ]
      }
    })
  });
  
  const handleUpdatePayment = async () => {
    setIsUpdating(true);
    
    try {
      const response = await apiService.subscription.updatePaymentMethod();
      
      // Redirect to payment update page
      window.location.href = response.url;
    } catch (error) {
      console.error('Failed to update payment method:', error);
      toast.error('Failed to update payment method. Please try again later.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? Your benefits will continue until the end of your current billing period.')) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      await apiService.subscription.cancelSubscription();
      
      toast.success('Your subscription has been cancelled. Your benefits will continue until the end of your current billing period.');
      refetch();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription. Please try again later.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleReactivateSubscription = async () => {
    setIsUpdating(true);
    
    try {
      await apiService.subscription.reactivateSubscription();
      
      toast.success('Your subscription has been reactivated.');
      refetch();
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      toast.error('Failed to reactivate subscription. Please try again later.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const hasActiveSubscription = subscription?.status === 'active';
  const hasInactiveSubscription = subscription?.status === 'cancelled' || subscription?.status === 'expired';
  const showReactivate = subscription?.status === 'cancelled' && subscription?.cancellationDate;
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <h1 className="text-2xl font-bold mb-1">Subscription</h1>
          <p className="text-gray-500 mb-6">Manage your VPN subscription</p>
        </FadeIn>
        
        <Tabs defaultValue={hasActiveSubscription || hasInactiveSubscription ? "manage" : "subscribe"}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="manage">Manage Subscription</TabsTrigger>
            <TabsTrigger value="subscribe">Get New Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : hasActiveSubscription || hasInactiveSubscription ? (
              <>
                <FadeIn delay={100}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Your Subscription</CardTitle>
                          <CardDescription>Current subscription details</CardDescription>
                        </div>
                        <div className="flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                          {subscription.status === 'active' ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Active
                            </>
                          ) : subscription.status === 'cancelled' ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancelled
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Expired
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-md font-medium mb-2 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                            Plan Details
                          </h3>
                          <p className="text-2xl font-bold">{subscription.plan}</p>
                          
                          {subscription.status === 'active' && (
                            <p className="text-sm text-muted-foreground mt-1 flex items-center">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Renews on {formatDate(subscription.renewalDate)}
                            </p>
                          )}
                          
                          {subscription.status === 'cancelled' && (
                            <p className="text-sm text-muted-foreground mt-1 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Access until {formatDate(subscription.cancellationDate)}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-md font-medium mb-2 flex items-center">
                            <CreditCard className="w-4 h-4 mr-1 text-muted-foreground" />
                            Payment Method
                          </h3>
                          <p className="flex items-center">
                            <span className="capitalize">{subscription.paymentMethod.brand}</span> 
                            <span className="mx-1">••••</span> 
                            {subscription.paymentMethod.last4}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Expires {subscription.paymentMethod.expiryMonth}/
                            {subscription.paymentMethod.expiryYear}
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-md font-medium mb-4">Subscription Actions</h3>
                        <div className="flex flex-wrap gap-3">
                          {subscription.status === 'active' && (
                            <>
                              <Button
                                variant="outline"
                                onClick={handleUpdatePayment}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <>
                                    <span className="animate-spin mr-2">⟳</span>
                                    Updating...
                                  </>
                                ) : (
                                  'Update Payment Method'
                                )}
                              </Button>
                              
                              <Button
                                variant="destructive"
                                onClick={handleCancelSubscription}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <>
                                    <span className="animate-spin mr-2">⟳</span>
                                    Processing...
                                  </>
                                ) : (
                                  'Cancel Subscription'
                                )}
                              </Button>
                            </>
                          )}
                          
                          {showReactivate && (
                            <Button
                              onClick={handleReactivateSubscription}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <>
                                  <span className="animate-spin mr-2">⟳</span>
                                  Reactivating...
                                </>
                              ) : (
                                'Reactivate Subscription'
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
                
                {subscription.invoices && subscription.invoices.length > 0 && (
                  <FadeIn delay={200}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Billing History</CardTitle>
                        <CardDescription>Your recent invoices</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {subscription.invoices.map((invoice: any) => (
                            <div 
                              key={invoice.id} 
                              className="flex justify-between items-center p-3 bg-accent/50 rounded-md"
                            >
                              <div>
                                <p className="font-medium">{formatDate(invoice.date)}</p>
                                <p className="text-sm text-muted-foreground">Invoice #{invoice.id}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                                <p className={`text-sm capitalize ${
                                  invoice.status === 'paid' ? 'text-green-500' : 
                                  invoice.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                                }`}>
                                  {invoice.status}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Active Subscription</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You don't have an active subscription. Subscribe now to enjoy all our VPN features.
                </p>
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => document.querySelector('[value="subscribe"]')?.dispatchEvent(
                    new MouseEvent('click', { bubbles: true })
                  )}
                >
                  View Subscription Options
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="subscribe">
            <FadeIn>
              <PaymentOptions />
            </FadeIn>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
