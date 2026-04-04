import { MapPin } from "lucide-react";

export default function JobCard({ job }) {
  const formatTypeBadge = (type) => {
    if (type === "Full-time") {
      return "bg-jolly-teal/10 text-jolly-teal";
    } else if (type === "Remote" || type === "Contract") {
      return "bg-jolly-purple/10 text-jolly-purple";
    }
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col h-full border border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all cursor-pointer hover:border-jolly-purple/20 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-5">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${job.logoColor}`}
        >
          <div className="w-5 h-5 opacity-60 flex items-center justify-center">
            {/* logo placeholder */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full stroke-current text-white/80"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold font-body ${formatTypeBadge(job.type)}`}
        >
          {job.type}
        </span>
      </div>

      <h3 className="font-heading font-bold text-jolly-navy text-lg mb-1 leading-tight line-clamp-1">
        {job.title}
      </h3>
      <p className="text-sm text-text-secondary font-body mb-5">
        {job.company}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {job.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-jolly-slate text-xs px-2.5 py-1 rounded font-medium font-body bg-opacity-70"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-end justify-between pt-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center text-text-secondary text-[13px] font-body">
            <MapPin size={14} className="mr-1.5 stroke-[2.5]" />
            {job.location}
          </div>
          <span className="font-heading font-bold text-jolly-navy text-base">
            {job.salary}
          </span>
        </div>
        <button className="text-jolly-purple font-bold text-sm font-heading hover:text-jolly-deep-purple transition-colors mb-0.5">
          Apply
        </button>
      </div>
    </div>
  );
}
