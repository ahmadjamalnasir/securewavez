
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, Map, Settings, CreditCard, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMenuOpen(false);
  }, [location.pathname]);

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
          <header className="lg:hidden flex items-center justify-between p-4 glass-morphism sticky top-0 z-50">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-vpn-blue mr-2" />
              <span className="font-semibold text-xl">SecureVPN</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </header>

          {/* Mobile Navigation Menu */}
          <div 
            className={cn(
              "lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out",
              menuOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex flex-col h-full pt-20 p-6 space-y-6">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl transition-all duration-200",
                    location.pathname === item.path 
                      ? "bg-vpn-blue text-white" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {item.icon}
                  <span className="ml-3 font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:flex fixed inset-y-0 left-0 z-50">
            <div className="h-full w-64 glass-morphism flex flex-col p-5">
              <div className="flex items-center mb-10 px-4">
                <Shield className="w-6 h-6 text-vpn-blue mr-2" />
                <span className="font-semibold text-xl">SecureVPN</span>
              </div>
              
              <nav className="flex-1 space-y-3 px-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl transition-all duration-200",
                      location.pathname === item.path 
                        ? "bg-vpn-blue text-white" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3 font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="mt-auto py-4 px-4">
                <div className="vpn-card flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium">US</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Premium Plan</p>
                    <p className="text-xs text-gray-500">Connected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300", 
        shouldShowNav ? "lg:ml-64 pt-4 px-4 pb-20" : ""
      )}>
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      {shouldShowNav && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 glass-morphism flex justify-around py-3 z-50">
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
