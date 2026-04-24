import React from "react";

const Logo = ({ className = "text-2xl", variant = "default" }) => {
  const isWhite = variant === "white";

  return (
    <a
      href="/"
      className={`font-heading font-bold tracking-tight group flex items-center ${className}`}
    >
      <span className="text-jolly-navy group-hover:text-jolly-purple transition-colors duration-300">
        J
      </span>
      <span className={isWhite ? "text-white" : "text-jolly-purple group-hover:text-jolly-navy transition-colors duration-300"}>
        o
      </span>
      <span className="text-jolly-navy group-hover:text-jolly-purple transition-colors duration-300">
        lly J
      </span>
      <span className={isWhite ? "text-white" : "text-jolly-purple group-hover:text-jolly-navy transition-colors duration-300"}>
        o
      </span>
      <span className="text-jolly-navy group-hover:text-jolly-purple transition-colors duration-300">
        bs
      </span>
    </a>
  );
};

export default Logo;
