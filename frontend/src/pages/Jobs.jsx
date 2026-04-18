import React, { useState, useEffect } from "react";
import FilterSidebar from "../components/FilterSidebar";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";
import { X, ChevronDown, ListFilter, Search } from "lucide-react";
import jobApi from "../api/job.api";

const Jobs = ({ user, initialFilters, onJobClick }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filters, setFilters] = useState(initialFilters || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const activeFilters = [];
  if (filters.keyword) activeFilters.push({ id: 'kw', label: filters.keyword, key: 'keyword' });
  if (filters.contract_type) activeFilters.push({ id: 'ct', label: filters.contract_type, key: 'contract_type' });
  if (filters.remote) activeFilters.push({ id: 'rm', label: 'Remote', key: 'remote' });

  useEffect(() => {
    setIsLoading(true);
    jobApi.search({ ...filters, page: currentPage })
      .then(res => {
        if (res.success) {
          setJobs(res.data);
          setTotalJobs(res.meta?.total || 0);
          setCurrentPage(res.meta?.current_page || 1);
          setLastPage(res.meta?.last_page || 1);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const removeFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <div className="bg-bg-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4">
             <FilterSidebar 
               filters={filters} 
               onFilterChange={handleFilterChange} 
               onClearAll={clearAllFilters}
             />
          </aside>

          {/* Main Content */}
          <main className="w-full lg:w-3/4">
            {/* Active Filters & Sorting */}
            <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-3">
                 {activeFilters.map((filter) => (
                   <button
                     key={filter.id}
                     onClick={() => removeFilter(filter.key)}
                     className="group flex items-center space-x-2 px-3 py-1.5 bg-jolly-purple/10 text-jolly-purple rounded-lg text-sm font-bold border border-jolly-purple/10 hover:bg-jolly-purple hover:text-white transition-all shadow-sm"
                   >
                     <span>{filter.label}</span>
                     <X size={14} className="text-jolly-purple group-hover:text-white transition-colors" />
                   </button>
                 ))}
                 {activeFilters.length > 0 && (
                   <button 
                     onClick={clearAllFilters}
                     className="text-xs font-bold text-gray-400 hover:text-jolly-purple transition-colors ml-2 py-1 px-2 hover:bg-white rounded-md border border-transparent hover:border-gray-100"
                   >
                     Clear all filters
                   </button>
                 )}
              </div>

               <div className="flex items-center space-x-4">
                  <span className="text-sm font-bold text-jolly-navy">
                    {isLoading ? "Searching..." : `${totalJobs} jobs found`}
                  </span>
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm cursor-pointer group hover:border-jolly-purple/30 transition-all">
                     <ListFilter size={16} className="text-gray-400 group-hover:text-jolly-purple" />
                     <span className="text-sm font-bold text-jolly-navy">Sort by:</span>
                     <span className="text-sm font-medium text-jolly-slate group-hover:text-jolly-purple">Most Recent</span>
                     <ChevronDown size={14} className="text-gray-400 group-hover:text-jolly-purple" />
                  </div>
               </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                // Skeleton Loader
                Array(4).fill(0).map((_, idx) => (
                  <div key={idx} className="h-64 bg-white rounded-2xl animate-pulse delay-75 shadow-sm border border-gray-100"></div>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard key={job.id} job={{
                    id: job.id,
                    title: job.title,
                    company: job.recruiter?.company_name || 'Anonymous',
                    location: job.remote ? 'Remote' : (job.city?.name || 'Various'),
                    salary: job.salary_min && job.salary_max ? `${job.salary_min}k - ${job.salary_max}k` : 'Competitive',
                    type: job.contract_type,
                    tags: job.skills?.map(s => s.name) || [],
                    logo: job.recruiter?.logo,
                    recruiterPhoto: job.recruiter?.user?.photo,
                    isNew: new Date(job.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  }} onClick={() => onJobClick && onJobClick(job.id)} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <Search size={32} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-jolly-navy mb-2">No jobs found</h3>
                  <p className="text-jolly-slate font-body max-w-sm mx-auto">
                    We couldn't find any jobs matching your current search criteria. Try adjusting your filters.
                  </p>
                  <button 
                    onClick={clearAllFilters}
                    className="mt-8 text-jolly-purple font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <Pagination 
                currentPage={currentPage} 
                lastPage={lastPage} 
                onPageChange={(page) => setCurrentPage(page)} 
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
