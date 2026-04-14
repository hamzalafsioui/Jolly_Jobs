import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Briefcase, ChevronDown, Check, X } from "lucide-react";
import jobApi from "../api/job.api";

const Hero = ({ onSearch }) => {
  const [contractTypes, setContractTypes] = useState([]);
  const [selectedContract, setSelectedContract] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Location search state
  const [locationQuery, setLocationQuery] = useState("");
  const [citiesSuggestions, setCitiesSuggestions] = useState([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [isRemote, setIsRemote] = useState(false);
  const locationRef = useRef(null);

  // Job Title search state
  const [titleQuery, setTitleQuery] = useState("");
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    jobApi
      .getContractTypes()
      .then((res) => {
        if (res.success) {
          setContractTypes(res.data);
        }
      })
      .catch((err) => console.error("Failed to load contract types", err));
    return () => {};
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
      if (titleRef.current && !titleRef.current.contains(event.target)) {
        setIsTitleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsDropdownOpen, setIsLocationDropdownOpen, setIsTitleDropdownOpen]);

  // Fetch Cities (Autocomplete)
  useEffect(() => {
    if (!locationQuery || locationQuery.length < 1) {
      setCitiesSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      jobApi.getCities(locationQuery).then((res) => {
        if (res.success) {
          setCitiesSuggestions(res.data);
          setIsLocationDropdownOpen(true);
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [locationQuery, setCitiesSuggestions, setIsLocationDropdownOpen]);

  const handleCitySelect = (city) => {
    setSelectedCityId(city.id);
    setLocationQuery(city.name);
    setIsRemote(false);
    setIsLocationDropdownOpen(false);
  };

  const handleRemoteSelect = () => {
    setSelectedCityId(null);
    setIsRemote(true);
    setLocationQuery("Remote");
    setIsLocationDropdownOpen(false);
  };

  // Fetch Job Title Suggestions
  useEffect(() => {
    if (!titleQuery || titleQuery.length < 2) {
      setTitleSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      jobApi.getJobTitleSuggestions(titleQuery).then((res) => {
        if (res.success) {
          setTitleSuggestions(res.data);
          setIsTitleDropdownOpen(true);
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [titleQuery, setTitleSuggestions, setIsTitleDropdownOpen]);

  const handleTitleSelect = (title) => {
    setTitleQuery(title);
    setIsTitleDropdownOpen(false);
  };

  const handleSelect = (type) => {
    setSelectedContract(type === selectedContract ? "" : type);
    setIsDropdownOpen(false);
  };
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
          <div
            ref={titleRef}
            className="w-full h-14 md:h-16 flex items-center px-4 gap-3 md:border-r border-gray-100 group transition-all relative"
          >
            <Search
              className={`${titleQuery ? "text-indigo-500" : "text-gray-400"} group-hover:scale-110 transition-transform`}
              size={20}
            />
            <input
              type="text"
              placeholder="Job title or keyword"
              value={titleQuery}
              onChange={(e) => {
                setTitleQuery(e.target.value);
                setIsTitleDropdownOpen(true);
              }}
              onFocus={() => setIsTitleDropdownOpen(true)}
              className="w-full h-full bg-transparent border-none focus:ring-0 text-jolly-navy font-body text-base placeholder:text-gray-400 outline-hidden"
            />
            {titleQuery && (
              <button
                onClick={() => setTitleQuery("")}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
              >
                <X size={14} />
              </button>
            )}

            {/* Title Suggestions Dropdown */}
            {isTitleDropdownOpen && titleSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-60 overflow-y-auto">
                  {titleSuggestions.map((title, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleTitleSelect(title)}
                      className="px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 transition-colors cursor-pointer group/title"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover/title:bg-indigo-500 group-hover/title:text-white transition-all">
                        <Briefcase size={16} />
                      </div>
                      <span className="text-sm font-medium text-jolly-navy">
                        {title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div
            ref={locationRef}
            className="w-full h-14 md:h-16 flex items-center px-4 gap-3 md:border-r border-gray-100 group transition-all relative"
          >
            <MapPin
              className={`${locationQuery ? "text-jolly-teal" : "text-gray-400"} group-hover:text-jolly-teal transition-colors`}
              size={20}
            />
            <input
              type="text"
              placeholder="City or Remote"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                setSelectedCityId(null);
                setIsRemote(false);
                setIsLocationDropdownOpen(true);
              }}
              onFocus={() => setIsLocationDropdownOpen(true)}
              className="w-full h-full bg-transparent border-none focus:ring-0 text-jolly-navy font-body text-base placeholder:text-gray-400 outline-hidden"
            />
            {locationQuery && (
              <button
                onClick={() => {
                  setLocationQuery("");
                  setSelectedCityId(null);
                  setIsRemote(false);
                }}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
              >
                <X size={14} />
              </button>
            )}

            {/* Suggestions Dropdown */}
            {isLocationDropdownOpen && locationQuery.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-60 overflow-y-auto">
                  {/* Remote Option */}
                  {("remote".includes(locationQuery.toLowerCase()) ||
                    locationQuery.toLowerCase().includes("remote")) && (
                    <div
                      onClick={handleRemoteSelect}
                      className="px-4 py-3 hover:bg-teal-50 flex items-center gap-3 transition-colors cursor-pointer group/remote"
                    >
                      <div className="w-8 h-8 rounded-lg bg-jolly-teal/10 flex items-center justify-center text-jolly-teal">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-jolly-navy font-heading">
                          Remote Jobs
                        </p>
                        <p className="text-xs text-gray-400">
                          Work from anywhere
                        </p>
                      </div>
                      {isRemote && (
                        <Check size={16} className="ml-auto text-jolly-teal" />
                      )}
                    </div>
                  )}

                  {/* City Suggestions */}
                  {citiesSuggestions.map((city) => (
                    <div
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-jolly-teal transition-colors">
                          <MapPin size={16} />
                        </div>
                        <span
                          className={`text-sm font-body capitalize ${selectedCityId === city.id ? "text-jolly-teal font-bold" : "text-jolly-slate"}`}
                        >
                          {city.name}
                        </span>
                      </div>
                      {selectedCityId === city.id && (
                        <Check size={16} className="text-jolly-teal" />
                      )}
                    </div>
                  ))}

                  {citiesSuggestions.length === 0 &&
                    !locationQuery.toLowerCase().includes("remote") && (
                      <div className="px-4 py-3 text-sm text-gray-400 italic font-body">
                        No cities found matching "{locationQuery}"
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Contract Type */}
          <div
            ref={dropdownRef}
            className="w-full h-14 md:h-16 flex items-center px-4 gap-3 group transition-all cursor-pointer relative"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Briefcase
              className={`${selectedContract ? "text-jolly-purple" : "text-gray-400"} group-hover:text-jolly-purple transition-colors`}
              size={20}
            />
            <div className="flex-1 flex justify-between items-center font-body text-base transition-colors overflow-hidden">
              <span
                className={`${selectedContract ? "text-jolly-navy font-semibold" : "text-gray-400"} truncate`}
              >
                {selectedContract || "Contract Type"}
              </span>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {/* Premium Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-60 overflow-y-auto">
                  {contractTypes.length > 0 ? (
                    contractTypes.map((type) => (
                      <div
                        key={type}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(type);
                        }}
                        className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors group/item"
                      >
                        <span
                          className={`text-sm font-body ${selectedContract === type ? "text-jolly-purple font-bold" : "text-jolly-slate"}`}
                        >
                          {type}
                        </span>
                        {selectedContract === type && (
                          <Check size={16} className="text-jolly-purple" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-400 italic font-body">
                      Loading types...
                    </div>
                  )}
                </div>

                {selectedContract && (
                  <div
                    className="border-t border-gray-100 mt-1 px-4 py-2 hover:text-danger flex items-center gap-2 text-xs font-bold text-gray-400 transition-colors uppercase tracking-wider"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedContract("");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <X size={14} /> Clear Selection
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={() =>
              onSearch &&
              onSearch({
                keyword: titleQuery,
                city_id: selectedCityId,
                remote: isRemote,
                contract_type: selectedContract,
              })
            }
            className="w-full md:w-auto px-10 h-14 md:h-16 bg-jolly-purple text-white font-bold text-lg rounded-xl hover:bg-jolly-deep-purple transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-95 flex items-center justify-center"
          >
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
