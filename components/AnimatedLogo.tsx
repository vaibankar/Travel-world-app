import React from 'react';
import { Globe2 } from 'lucide-react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 'md' }) => {
  const iconSize = size === 'sm' ? 24 : size === 'md' ? 32 : 48;
  const textSize = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-4xl';

  return (
    <div className="flex items-center gap-2 font-black tracking-tighter cursor-pointer select-none group">
      <Globe2 size={iconSize} className="text-emerald-400 animate-spin-slow group-hover:text-emerald-300 transition-colors" />
      <span className={`${textSize} bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent text-gradient-animate`}>
        Travel World
      </span>
    </div>
  );
};