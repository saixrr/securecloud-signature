
import React from 'react';
import { Shield, LockKeyhole } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'full' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', variant = 'full' }) => {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const iconSizes = {
    small: 16,
    medium: 24,
    large: 36
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${variant === 'icon' ? '' : 'mr-2'}`}>
        <Shield 
          size={iconSizes[size]} 
          className="text-ntru-primary animate-pulse-gentle" 
        />
        <LockKeyhole 
          size={iconSizes[size] * 0.5} 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" 
        />
      </div>
      
      {variant === 'full' && (
        <span className={`font-bold ${sizeClasses[size]} bg-clip-text text-transparent bg-gradient-to-r from-ntru-primary to-ntru-secondary`}>
          SecureCloud
        </span>
      )}
    </div>
  );
};

export default Logo;
