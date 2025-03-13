
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

export default function Splash() {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    // Automatically navigate to auth page after animation
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      
      // Small delay before navigation
      setTimeout(() => {
        navigate('/auth');
      }, 500);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-white dark:to-gray-900">
      <div className="flex flex-col items-center">
        <FadeIn delay={300} duration={800} className="mb-6">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full opacity-30 animate-pulse bg-vpn-blue blur-md"></div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-vpn-blue to-vpn-teal flex items-center justify-center relative">
              <Shield className="w-12 h-12 text-white" />
            </div>
            
            {/* Connection wave animations */}
            <div className="absolute inset-0 rounded-full border-2 border-vpn-blue/30 animate-connection-wave"></div>
            <div className="absolute inset-0 rounded-full border-2 border-vpn-blue/20 animate-connection-wave" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-0 rounded-full border-2 border-vpn-blue/10 animate-connection-wave" style={{ animationDelay: '1s' }}></div>
          </div>
        </FadeIn>
        
        <FadeIn delay={600} duration={800}>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-vpn-blue to-vpn-teal">
            SecureVPN
          </h1>
        </FadeIn>
        
        <FadeIn delay={900} duration={800}>
          <p className="text-gray-500 text-center max-w-xs">
            Secure, private browsing from anywhere in the world
          </p>
        </FadeIn>
        
        <FadeIn delay={1200} duration={800} className="mt-8">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${animationComplete ? 'bg-vpn-teal' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full ${animationComplete ? 'bg-vpn-blue' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full ${animationComplete ? 'bg-vpn-indigo' : 'bg-gray-300'}`}></div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
