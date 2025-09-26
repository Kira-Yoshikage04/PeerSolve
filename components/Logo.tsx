import React from 'react';
import { LOGO_BASE64_URL } from '../constants';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <img 
      src={LOGO_BASE64_URL} 
      alt="PeerSolve Logo" 
      className={className} 
    />
  );
};

export default Logo;
