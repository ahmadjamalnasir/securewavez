
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 300,
  className = '',
  direction = 'up',
  distance = 20
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getDirectionStyles = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return { transform: `translateY(${distance}px)` };
        case 'down':
          return { transform: `translateY(-${distance}px)` };
        case 'left':
          return { transform: `translateX(${distance}px)` };
        case 'right':
          return { transform: `translateX(-${distance}px)` };
        default:
          return {};
      }
    }
    return {};
  };

  return (
    <div
      className={cn(className)}
      style={{
        ...getDirectionStyles(),
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}
