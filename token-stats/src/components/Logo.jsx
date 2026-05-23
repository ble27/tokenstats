import React from 'react';

const Logo = ({ className = '' }) => {
  return (
    <div className="flex items-center justify-center">
      <span className={`font-semibold tracking-tight text-[color:var(--text)] ${className}`}>Token Stats</span>
    </div>
  );
};

export default Logo;
