
import { Shield } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] bg-[length:20px_20px]">
      <FadeIn>
        <div className="max-w-md w-full p-6 glass-morphism rounded-2xl shadow-elevation-2">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vpn-blue to-vpn-teal flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-8">Welcome to SecureVPN</h1>
          
          {children}
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                By continuing, you agree to our 
                <a href="#" className="text-vpn-blue hover:underline mx-1">Terms of Service</a>
                and
                <a href="#" className="text-vpn-blue hover:underline ml-1">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default AuthContainer;
