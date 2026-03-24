import React from "react";
import { Search, MapPin, Briefcase, ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
    
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6">
          <span className="">Find Your Next </span>
          <span className="text-jolly-purple">Tech Adventure </span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl text-center mx-auto text-lg md:text-xl text-jolly-slate font-body leading-relaxed mb-28">
          Explore thousands of opportunities in the most innovative tech
          companies across the globe. Your dream role is just a search away.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-0">
          {/* Job Title */}
          <div className="w-full h-14 md:h-16 flex items-center px-4 gap-3 md:border-r border-gray-100 group transition-all">
            <Search
              className="text-indigo-500 group-hover:scale-110 transition-transform"
              size={20}
            />
            <input
              type="text"
              placeholder="Job title or keyword"
              className="w-full h-full bg-transparent border-none focus:ring-0 text-jolly-navy font-body text-base placeholder:text-gray-400 outline-hidden"
            />
          </div>

          {/* Location */}
          <div className="w-full h-14 md:h-16 flex items-center px-4 gap-3 md:border-r border-gray-100 group transition-all">
            <MapPin
              className="text-gray-400 group-hover:text-jolly-teal transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="City or Remote"
              className="w-full h-full bg-transparent border-none focus:ring-0 text-jolly-navy font-body text-base placeholder:text-gray-400 outline-hidden"
            />
          </div>

          {/* Contract Type */}
          <div className="w-full h-14 md:h-16 flex items-center px-4 gap-3 group transition-all cursor-pointer">
            <Briefcase
              className="text-gray-400 group-hover:text-jolly-purple transition-colors"
              size={20}
            />
            <div className="flex-1 flex justify-between items-center text-gray-400 font-body text-base group-hover:text-jolly-navy transition-colors">
              <span>Contract Type</span>
              <ChevronDown size={18} />
            </div>
          </div>

          {/* Search Button */}
          <button className="w-full md:w-auto px-10 h-14 md:h-16 bg-jolly-purple text-white font-bold text-lg rounded-xl hover:bg-jolly-deep-purple transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-95 flex items-center justify-center">
            Search
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-heading font-bold text-jolly-navy">
              1,247
            </span>
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2">
              Jobs Available
            </span>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-heading font-bold text-jolly-navy">
              523
            </span>
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2">
              Partner Companies
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
