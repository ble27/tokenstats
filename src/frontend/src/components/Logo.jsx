import React from 'react';

const Logo = ({ className = '' }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="logo-mark" aria-hidden="true">
        <span className="logo-square square-1" />
        <span className="logo-square square-2" />
        <span className="logo-square square-3" />
      </span>
      <span className={`font-semibold tracking-tight text-[color:var(--text)] ${className}`}>Tokenstats</span>
    </div>
  );
};

export default Logo;
