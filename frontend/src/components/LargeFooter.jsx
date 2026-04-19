import React from "react";
import Logo from "./Logo";
import { Twitter, Linkedin, Facebook, Send } from "lucide-react";

const LargeFooter = () => {
  return (
    <footer className="bg-jolly-navy text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Logo & About */}
          <div className="space-y-8">
            <Logo className="text-2xl brightness-0 invert" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Making the tech job search joyful again. Connecting the best
              talent with the world's most innovative companies.
            </p>
            <div className="flex space-x-5">
              {[Twitter, Linkedin, Facebook].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-jolly-purple hover:bg-white/10 transition-all border border-white/5 hover:border-jolly-purple/20"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-8">
              For Candidates
            </h3>
            <ul className="space-y-4">
              {[
                "Browse Jobs",
                "Candidate Dashboard",
                "Job Alerts",
                "Career Advice",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-8">
              For Employers
            </h3>
            <ul className="space-y-4">
              {[
                "Post a Job",
                "Hiring Solutions",
                "Pricing Plans",
                "Customer Stories",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-8">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-6">
              Get the latest tech jobs delivered to your inbox.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-jolly-purple/30 focus:border-jolly-purple transition-all"
              />
              <button className="absolute right-2 top-2 p-1.5 bg-jolly-purple rounded-lg text-white hover:bg-jolly-deep-purple transition-colors shadow-lg shadow-jolly-purple/20">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-gray-500 text-xs">
            &copy; 2026 Jolly Jobs Platform. All rights reserved.
          </div>
          <div className="flex space-x-8">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-gray-500 hover:text-white transition-colors text-xs"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LargeFooter;
