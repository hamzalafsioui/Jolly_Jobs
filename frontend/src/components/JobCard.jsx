import { MapPin, Building2, Zap } from "lucide-react";

export default function JobCard({ job, onClick }) {
  const formatTypeBadge = (type) => {
    const t = type?.toLowerCase();
    if (t === "full-time" || t === "fulltime") {
      return "bg-jolly-teal/10 text-jolly-teal";
    } else if (t === "remote" || t === "contract") {
      return "bg-jolly-purple/10 text-jolly-purple";
    }
    return "bg-gray-100 text-gray-600";
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8001';
    return `${baseUrl}/storage/${path}`;
  };

  // logo Source (job.logo from company or from recruiter Photo)
  const logoSrc = getImageUrl(job.logo || job.recruiterPhoto);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 flex flex-col h-full border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all cursor-pointer hover:border-jolly-purple/20 group relative overflow-hidden"
    >
      {/* "NEW" Badge */}
      {job.isNew && (
        <div className="absolute top-4 right-4 animate-pulse">
           <span className="px-2 py-0.5 rounded-md bg-success/10 text-success text-[10px] font-bold tracking-wider">
             NEW
           </span>
        </div>
      )}

      <div className="flex items-start mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-jolly-purple/5 border border-jolly-purple/10 overflow-hidden"
        >
          {logoSrc ? (
            <img src={logoSrc} alt={job.company} className="w-full h-full object-cover" />
          ) : (
            <div className="w-6 h-6 flex items-center justify-center text-jolly-purple/60">
               <Building2 size={20} />
            </div>
          )}
        </div>
        <div className="ml-4 flex-1">
           <h3 className="font-heading font-bold text-jolly-navy text-base mb-0.5 leading-tight group-hover:text-jolly-purple transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-xs text-jolly-slate font-medium font-body truncate">
            {job.company}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center text-jolly-slate text-[13px] font-body bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
          <MapPin size={12} className="mr-1.5 text-jolly-purple" />
          <span className="truncate max-w-[120px]">{job.location}</span>
        </div>
        <div className="text-jolly-navy font-bold text-[13px] font-body">
           {job.salary}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(job.tags || []).map((tag, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-jolly-slate text-[11px] px-2.5 py-1 rounded-full font-medium font-body transition-colors hover:bg-jolly-purple/5 hover:text-jolly-purple"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
         <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold font-body ${formatTypeBadge(job.type)}`}
        >
          {job.type}
        </span>
        <button className="text-jolly-purple font-bold text-[13px] font-heading hover:underline underline-offset-4 transition-all">
          View Details
        </button>
      </div>
    </div>
  );
}

