import { useState, useEffect } from "react";
import JobCard from "./JobCard";
import jobApi from "../api/job.api";

export default function FeaturedJobs({ onJobClick }) {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setIsLoading(true);
        const response = await jobApi.getLatest(6);
        if (response.success) {
          setJobs(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestJobs();
  }, []);

  const mapApiJobToCard = (job) => ({
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
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <h2 className="text-[2rem] font-heading font-bold text-jolly-navy mb-2">
            Featured Jobs
          </h2>
          <p className="text-text-secondary font-body">
            Hand-picked opportunities from top tech companies.
          </p>
        </div>
        <a
          href="/jobs"
          className="font-heading font-bold text-jolly-purple hover:text-jolly-deep-purple transition-colors mt-4 md:mt-0 flex items-center text-[15px]"
        >
          View all jobs &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, idx) => (
            <div key={idx} className="h-64 bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm"></div>
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={mapApiJobToCard(job)} 
              onClick={() => onJobClick && onJobClick(job.id)} 
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-jolly-slate font-body">
            No featured jobs available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}
