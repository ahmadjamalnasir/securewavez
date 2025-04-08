
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show a toast when authentication fails
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Please login to access this page');
    }
  }, [isLoading, isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-vpn-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Verify user data is present
  if (!user) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    toast.error('User data is missing. Please login again.');
    return <Navigate to="/auth" replace />;
  }

  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
