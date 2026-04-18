import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, Check } from "lucide-react";
import jobApi from "../api/job.api";

const FilterSidebar = ({ filters, onFilterChange, onClearAll }) => {
  const [cities, setCities] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [titleInput, setTitleInput] = useState(filters.keyword || "");

  // Sync titleInput with filters.keyword
  useEffect(() => {
    setTitleInput(filters.keyword || "");
  }, [filters.keyword]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        jobApi.getCities("")
          .then(res => { if (res.success) setCities(res.data); })
          .catch(err => console.error("Error fetching cities:", err));

        jobApi.getContractTypes()
          .then(res => { if (res.success) setContractTypes(res.data); })
          .catch(err => console.error("Error fetching contract types:", err));
      } catch (error) {
        console.error("Error fetching sidebar metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  // Debounced title update
  useEffect(() => {
    if (titleInput === (filters.keyword || "")) return;
    const timer = setTimeout(() => {
      onFilterChange({ keyword: titleInput });
    }, 500);
    return () => clearTimeout(timer);
  }, [titleInput]);

  const handleContractToggle = (type) => {
    onFilterChange({ contract_type: filters.contract_type === type ? "" : type });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-heading font-bold text-jolly-navy">Filters</h2>
        <button 
          onClick={onClearAll}
          className="text-xs font-bold text-jolly-purple hover:underline underline-offset-4"
        >
          Clear all
        </button>
      </div>

      {/* Job Title / Keywords */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-jolly-navy mb-3">
          Job Title or Keyword
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className={`transition-colors ${titleInput ? 'text-jolly-purple' : 'text-gray-400'}`} />
          </div>
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="e.g. Designer"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-jolly-purple/20 focus:border-jolly-purple transition-all"
          />
        </div>
      </div>

      {/* City */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-jolly-navy mb-3">
          City
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin size={16} className={`transition-colors ${filters.city_id ? 'text-jolly-purple' : 'text-gray-400'}`} />
          </div>
          <select 
            value={filters.city_id || ""}
            onChange={(e) => onFilterChange({ city_id: e.target.value || null })}
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-jolly-purple/20 focus:border-jolly-purple transition-all cursor-pointer capitalize"
          >
            <option value="">All Locations</option>
            {cities.map(city => (
              <option key={city.id} value={city.id} className="capitalize">
                {city.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Contract Type */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-jolly-navy mb-4">
          Contract Type
        </label>
        <div className="space-y-3">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-5 bg-gray-100 rounded w-3/4"></div>)}
            </div>
          ) : (
            contractTypes.map((type) => (
              <label 
                key={type} 
                className="flex items-center group cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleContractToggle(type);
                }}
              >
                <div className="relative flex items-center">
                  <div className={`h-5 w-5 rounded-md border transition-all flex items-center justify-center ${filters.contract_type === type ? 'bg-jolly-purple border-jolly-purple shadow-sm shadow-jolly-purple/30' : 'border-gray-200 bg-gray-50 group-hover:border-jolly-purple/50'}`}>
                    {filters.contract_type === type && <Check size={12} className="text-white" />}
                  </div>
                </div>
                <span className={`ml-3 text-sm font-medium transition-colors ${filters.contract_type === type ? 'text-jolly-navy font-bold' : 'text-jolly-slate group-hover:text-jolly-navy'}`}>
                  {type}
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Remote Only */}
      <div 
        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${filters.remote ? 'bg-indigo-50/50 border-jolly-purple/20' : 'bg-gray-50 border-gray-100'}`}
        onClick={() => onFilterChange({ remote: !filters.remote })}
      >
        <div className="flex items-center space-x-3">
           <MapPin size={18} className={filters.remote ? 'text-jolly-purple' : 'text-gray-400'} />
           <span className={`text-sm font-bold ${filters.remote ? 'text-jolly-navy' : 'text-gray-400'}`}>Remote Only</span>
        </div>
        <div className="relative inline-flex items-center cursor-pointer">
          <div className={`w-10 h-5 rounded-full transition-all relative ${filters.remote ? 'bg-jolly-purple' : 'bg-gray-200'}`}>
            <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 after:w-4 transition-all ${filters.remote ? 'translate-x-5' : 'translate-x-0'}`} style={{ width: '16px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
