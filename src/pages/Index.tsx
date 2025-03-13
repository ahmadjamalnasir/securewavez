
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the splash screen
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-vpn-blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Loading SecureVPN...</p>
      </div>
    </div>
  );
};

export default Index;
