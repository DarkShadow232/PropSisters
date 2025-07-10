
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "small" | "medium" | "large";
  withTagline?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = "medium", 
  withTagline = true,
  className = ""
}) => {
  const sizeClasses = {
    small: "h-10",
    medium: "h-14",
    large: "h-20"
  };

  return (
    <Link 
      to="/" 
      className={`flex flex-col items-center group ${className}`}
      aria-label="Property Sisters Home"
    >
      <div className="flex flex-col items-center">
        <div className="logo-image relative mb-1 transition-transform duration-300 group-hover:scale-105">
          <img 
            src="/logo.png" 
            alt="Property Sisters Logo" 
            className={`mb-2 ${sizeClasses[size]}`}
          />
        </div>
        <div className="logo-text text-center">
          <div className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-[#b94a3b] group-hover:text-[#9a3f33] transition-colors duration-300">
            Property Sisters
          </div>
          {withTagline && (
            <div className="text-[#b94a3b] text-sm md:text-base font-light tracking-wider uppercase transition-opacity duration-300">
              Leading You Home
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Logo;
