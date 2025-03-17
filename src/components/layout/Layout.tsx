
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, Map, Settings, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const navItems = [
    { 
      name: 'Home', 
      path: '/home',
      icon: <Shield className="w-5 h-5" /> 
    },
    { 
      name: 'Servers', 
      path: '/servers',
      icon: <Map className="w-5 h-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/settings',
      icon: <Settings className="w-5 h-5" /> 
    },
    { 
      name: 'Subscription', 
      path: '/subscription',
      icon: <CreditCard className="w-5 h-5" /> 
    }
  ];

  // Don't render navigation on splash or auth pages
  const hideNavPaths = ['/', '/auth'];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      {shouldShowNav && (
        <>
          {/* Mobile Header */}
          <header className="flex items-center justify-between p-4 glass-morphism sticky top-0 z-50">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-vpn-blue mr-2" />
              <span className="font-semibold text-xl">SecureVPN</span>
            </div>
          </header>
        </>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300", 
        shouldShowNav ? "pt-4 px-4 pb-20" : ""
      )}>
        {children}
      </main>

      {/* Bottom Navigation - Always Visible When Navigation Should Show */}
      {shouldShowNav && (
        <div className="fixed bottom-0 left-0 right-0 glass-morphism flex justify-around py-3 z-50">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-xl",
                location.pathname === item.path 
                  ? "text-vpn-blue" 
                  : "text-gray-500"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
