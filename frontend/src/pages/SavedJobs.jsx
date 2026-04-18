import React, { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";
import { BookmarkMinus, Search, Bookmark } from "lucide-react";
import jobApi from "../api/job.api";
import { useNavigate } from "react-router-dom";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const fetchSavedJobs = (page) => {
    setIsLoading(true);
    jobApi.getSavedJobs(page, 15)
      .then(res => {
        if (res.success) {
          setJobs(res.data);
          setTotalJobs(res.meta?.total || 0);
          setCurrentPage(res.meta?.current_page || 1);
          setLastPage(res.meta?.last_page || 1);
        }
      })
      .catch(err => console.error("Could not fetch saved jobs", err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSavedJobs(currentPage);
  }, [currentPage]);

  const handleUnsave = (id) => {
    jobApi.toggleSave(id).then(res => {
      if (res.success && !res.data.is_saved) {
        // Optimistically remove
        setJobs(jobs.filter(job => job.id !== id));
        setTotalJobs(prev => prev - 1);
      }
    });
  };

  return (
    <div className="bg-bg-gray min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-jolly-purple/10 flex items-center justify-center text-jolly-purple">
            <Bookmark size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-jolly-navy">Saved Jobs</h1>
            <p className="text-jolly-slate text-sm font-body mt-1">
              {isLoading ? "Loading..." : `You have saved ${totalJobs} job offers`}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="h-48 bg-white rounded-2xl animate-pulse delay-75 shadow-sm border border-gray-100"></div>
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="relative group">
                <JobCard 
                  job={{
                    id: job.id,
                    title: job.title,
                    company: job.recruiter?.company_name || 'Anonymous',
                    location: job.remote ? 'Remote' : (job.city?.name || 'Various'),
                    salary: job.salary_min && job.salary_max ? `${job.salary_min}k - ${job.salary_max}k` : 'Competitive',
                    type: job.contract_type,
                    tags: job.skills?.map(s => s.name) || [],
                    logo: job.recruiter?.logo,
                    recruiterPhoto: job.recruiter?.user?.photo,
                    isNew: false
                  }} 
                  onClick={() => navigate(`/job/${job.id}`)} 
                />
                {/* Unsave Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnsave(job.id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm text-jolly-purple border border-gray-100 hover:bg-jolly-purple hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  title="Remove from saved"
                >
                  <BookmarkMinus size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-jolly-purple/5 rounded-full flex items-center justify-center mx-auto mb-6 text-jolly-purple">
                <Bookmark size={32} />
              </div>
              <h3 className="text-xl font-heading font-bold text-jolly-navy mb-2">No saved jobs</h3>
              <p className="text-jolly-slate font-body max-w-sm mx-auto">
                You haven't saved any job offers yet. Browse our job listings and save the ones you like!
              </p>
              <button 
                onClick={() => navigate('/jobs')}
                className="mt-8 bg-jolly-purple text-white px-6 py-3 rounded-button font-medium hover:bg-jolly-deep-purple transition-all shadow-sm"
              >
                Find Jobs
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="mt-8">
            <Pagination 
              currentPage={currentPage} 
              lastPage={lastPage} 
              onPageChange={(page) => setCurrentPage(page)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
