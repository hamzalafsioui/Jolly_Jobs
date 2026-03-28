import React, { useState } from "react";
import { Menu, X } from "lucide-react";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Find Jobs", href: "#" },
    { name: "Companies", href: "#" },
    { name: "Salaries", href: "#" },
    { name: "Resources", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a
              href="/"
              className="text-2xl font-heading font-bold text-jolly-navy tracking-tight"
            >
              Jolly Jobs
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[15px] font-medium text-jolly-slate hover:text-jolly-purple transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/login"
              className="text-[15px] font-medium text-jolly-slate hover:text-jolly-purple transition-colors"
            >
              Log In
            </a>
            <button className="bg-jolly-purple text-white px-6 py-2.5 rounded-button font-medium hover:bg-jolly-deep-purple transition-all shadow-sm hover:shadow-md active:scale-95">
              Post a Job
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-jolly-slate hover:text-jolly-purple p-2 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-3 py-2 text-base font-medium text-jolly-slate hover:text-jolly-purple hover:bg-gray-50 rounded-md transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
            <a
              href="/login"
              className="block px-3 py-2 text-base font-medium text-jolly-slate hover:text-jolly-purple transition-colors"
            >
              Log In
            </a>
            <button className="w-full bg-jolly-purple text-white px-6 py-3 rounded-button font-medium hover:bg-jolly-deep-purple transition-colors">
              Post a Job
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
