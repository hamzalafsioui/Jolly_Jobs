import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  MapPin, 
  Briefcase, 
  Bookmark, 
  BookmarkMinus, 
  Building2, 
  Users, 
  CheckCircle, 
  Loader2, 
  Send, 
  FileText, 
  X 
} from "lucide-react";
import jobApi from "../api/job.api";

const storageBase = import.meta.env.VITE_STORAGE_URL || "http://localhost:8001/storage";

export default function JobDetails({ onBack }) {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobId) {
      setLoading(true);
      jobApi.getOfferDetails(jobId)
        .then(res => {
          if (res.success) {
            setJob(res.data);
            setIsSaved(res.data.is_saved || false);
            setIsApplied(res.data.is_applied || false);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [jobId]);

  const handleToggleSave = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to save jobs");
        return;
    }
    jobApi.toggleSave(jobId).then(res => {
        if (res.success) {
            setIsSaved(res.data.is_saved);
        }
    }).catch(err => {
        console.error("Failed to toggle save", err);
    });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to apply for jobs");
        return;
    }

    setIsApplying(true);
    setError(null);

    try {
        const res = await jobApi.apply(jobId, {
            cover_letter: coverLetter
        });
        
        if (res.success) {
            setIsApplied(true);
            setShowApplyModal(false);
            
            setJob(prev => ({...prev, applications_count: (prev.applications_count || 0) + 1}));
        }
    } catch (err) {
        console.error("Failed to apply", err);
        setError(err.response?.data?.message || "Something went wrong. Please check if you have a CV in your profile.");
    } finally {
        setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-bg-gray py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jolly-purple"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-32 min-h-screen bg-bg-gray">
        <h2 className="text-3xl font-heading font-bold text-jolly-navy">Job not found</h2>
        <p className="text-jolly-slate mt-2">The job offer you're looking for doesn't exist or was removed.</p>
        <button onClick={onBack} className="mt-8 text-jolly-purple font-bold hover:underline">← Back to Jobs</button>
      </div>
    );
  }

  const companyName = job.recruiter?.company_name || 'Anonymous';
  const location = job.remote ? 'Remote' : (job.city?.name || 'Various');
  const employees = job.recruiter?.company_size || '1-10';

  return (
    <div className="bg-bg-gray min-h-screen pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-jolly-slate font-medium mb-6 space-x-2">
           <button onClick={onBack} className="hover:text-jolly-purple transition-colors">Jobs</button>
           <span>›</span>
           <span>{job.category?.name || "Category"}</span>
           <span>›</span>
           <span className="text-jolly-navy font-bold">{job.title}</span>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-[#0f172a] text-white shadow-inner overflow-hidden`}>
              {job.recruiter?.logo ? (
                <img 
                  src={`${storageBase}/${job.recruiter.logo}`} 
                  alt={companyName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 size={32} />
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-heading font-bold text-jolly-navy mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center text-sm font-body text-jolly-slate gap-4">
                <span className="flex items-center"><Building2 size={16} className="mr-1 opacity-70"/> {companyName}</span>
                <span className="flex items-center"><MapPin size={16} className="mr-1 opacity-70"/> {location}</span>
                <span className="flex items-center"><Briefcase size={16} className="mr-1 opacity-70"/> {job.salary_min}k - {job.salary_max}k</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center gap-4">
             {isApplied ? (
               <div className="bg-green-50 text-green-600 px-8 py-3 rounded-xl font-bold font-heading flex items-center border border-green-100">
                 <CheckCircle size={20} className="mr-2" /> Applied
               </div>
             ) : (
               <button 
                 onClick={() => {
                   const token = localStorage.getItem("token");
                   if (!token) {
                       alert("Please log in to apply for jobs");
                       return;
                   }
                   setShowApplyModal(true);
                 }}
                 className="bg-jolly-purple text-white px-8 py-3 rounded-xl font-bold font-heading hover:bg-jolly-deep-purple transition-all shadow-[0_4px_14_rgba(103,58,183,0.39)]"
               >
                 Apply Now
               </button>
             )}
             <button 
               onClick={handleToggleSave}
               className={`p-3 border rounded-xl transition-all ${isSaved ? 'border-jolly-purple bg-jolly-purple/5 text-jolly-purple' : 'border-gray-200 text-jolly-slate hover:bg-gray-50 hover:text-jolly-purple'}`}
             >
               {isSaved ? <BookmarkMinus size={20} /> : <Bookmark size={20} />}
             </button>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Nav Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="flex border-b border-gray-100 px-2 lg:px-6">
                 <button className="px-6 py-4 text-sm font-bold text-jolly-purple border-b-2 border-jolly-purple">
                   Description
                 </button>
               </div>
               
               <div className="p-6 lg:p-8">
                 <h3 className="text-lg font-bold text-jolly-navy mb-4 font-heading">Role Overview</h3>
                 <div className="prose prose-sm font-body text-jolly-slate leading-relaxed whitespace-pre-wrap mb-8">
                   {job.description || "We are looking for a highly skilled professional to join our core team and help shape the future of our platform. You will be responsible for end-to-end delivery of high-quality solutions."}
                 </div>

                 <h3 className="text-lg font-bold text-jolly-navy mb-4 font-heading">Preferred Skills & Expertise</h3>
                 <div className="flex flex-wrap gap-2">
                    {job.skills && job.skills.length > 0 ? (
                       job.skills.map((skill, idx) => (
                         <span key={idx} className="bg-jolly-purple/5 text-jolly-purple border border-jolly-purple/10 text-xs font-bold px-3 py-1.5 rounded-full">
                           {skill.name || skill}
                         </span>
                       ))
                    ) : (
                       // Fallback skills for nice visual
                       ["Leadership", "Communication", "Problem Solving"].map((s, idx) => (
                         <span key={idx} className="bg-jolly-purple/5 text-jolly-purple border border-jolly-purple/10 text-xs font-bold px-3 py-1.5 rounded-full">
                           {s}
                         </span>
                       ))
                    )}
                 </div>
               </div>
            </div>

            {/* Location block */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
               <h3 className="text-lg font-bold text-jolly-navy mb-4 font-heading">Location</h3>
               <div className="bg-gray-100 w-full h-[250px] rounded-xl flex flex-col items-center justify-center text-gray-400 overflow-hidden relative border border-gray-200">
                  {/* Generic map visualization replacement */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-jolly-purple mb-3">
                      <MapPin size={24} />
                    </div>
                    <p className="font-bold text-jolly-navy text-lg">{location}</p>
                  </div>
                  <div className="absolute bottom-4 left-4 right-auto bg-white rounded-lg shadow-md p-3 flex items-start gap-2 z-10">
                     <MapPin size={16} className="text-jolly-purple mt-0.5" />
                     <div>
                       <p className="text-xs font-bold text-jolly-navy">Headquarters</p>
                       <p className="text-[10px] text-jolly-slate truncate max-w-[150px]">{location} Area</p>
                     </div>
                  </div>
               </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="w-full lg:w-1/3 space-y-6">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
               {isApplied ? (
                 <div className="bg-green-50 text-green-600 w-full py-4 rounded-xl font-bold font-heading flex justify-center items-center border border-green-100 shadow-sm">
                   <CheckCircle size={20} className="mr-2" /> You have applied
                 </div>
               ) : (
                 <button 
                   onClick={() => {
                     const token = localStorage.getItem("token");
                     if (!token) {
                         alert("Please log in to apply for jobs");
                         return;
                     }
                     setShowApplyModal(true);
                   }}
                   className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold font-heading transition-all shadow-[0_4px_14px_rgba(99,102,241,0.39)] flex justify-center items-center group"
                 >
                   Apply for this position <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                 </button>
               )}
               <p className="text-xs text-center text-jolly-slate mt-4 font-medium">
                 Posted {new Date(job.created_at).toLocaleDateString()} • {job.applications_count} applicants
               </p>
             </div>

             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-5">About the Company</h4>
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-[#0f172a] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-inner overflow-hidden">
                    {job.recruiter?.logo ? (
                      <img src={`${storageBase}/${job.recruiter.logo}`} alt="" className="w-full h-full object-cover" />
                    ) : job.recruiter?.photo ? (
                      <img src={`${storageBase}/${job.recruiter.photo}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      companyName.charAt(0)
                    )}
                  </div>
                  <div className="ml-4">
                    <h5 className="font-bold text-jolly-navy text-[15px]">{companyName}</h5>
                    <p className="text-xs text-jolly-slate flex items-center mt-1 font-medium">
                      <Users size={12} className="mr-1 opacity-70" /> {employees} employees
                    </p>
                  </div>
                </div>
                <p className="text-[13px] font-body text-jolly-slate leading-relaxed mb-5">
                  {(job.recruiter && job.recruiter.description) || "Building the future of work and career discovery. We're a mission-driven team dedicated to helping everyone find their perfect role."}
                </p>
                <a href={(job.recruiter && job.recruiter.website) || "#"} className="text-[13px] font-bold text-indigo-500 hover:text-indigo-600 hover:underline flex items-center">
                  View company profile |_|
                </a>
             </div>
          </div>
          
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-jolly-navy/40 backdrop-blur-md" onClick={() => !isApplying && setShowApplyModal(false)}></div>
            <div className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-8 duration-300">
                
                {/* Close Button */}
                <button 
                    onClick={() => !isApplying && setShowApplyModal(false)}
                    className="absolute top-6 right-6 p-2 text-jolly-slate hover:bg-gray-100 rounded-full transition-all z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-8 pt-10">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-500 mb-4 shadow-sm border border-indigo-100/50">
                            <Building2 size={36} />
                        </div>
                        <h3 className="text-2xl font-bold text-jolly-navy font-heading">Join the team at {companyName}</h3>
                        <p className="text-jolly-slate mt-2 text-sm font-medium">We're excited to see what you'll bring to the {job.title} role.</p>
                    </div>

                    <form onSubmit={handleApply} className="space-y-6">
                        <div className="bg-gray-50/50 border border-gray-100/80 rounded-2xl p-5 flex items-start gap-4">
                            <div className="mt-1">
                                <FileText size={20} className="text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-jolly-navy mb-1 leading-none">Your profile is ready!</h4>
                                <p className="text-xs text-jolly-slate leading-relaxed">We'll automatically include the CV from your profile so you don't have to upload it again.</p>
                            </div>
                            <div className="ml-auto">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white scale-90">
                                    <CheckCircle size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-jolly-navy ml-1">Write a personal note (Optional)</label>
                            <textarea 
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-2xl p-5 text-sm font-body text-jolly-navy focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all min-h-[160px] placeholder:text-gray-300"
                                placeholder="Hi team, I'm really interested in this position because..."
                            ></textarea>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-medium border border-red-100 animate-in fade-in duration-200">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4 pt-2">
                           <button 
                                type="submit"
                                disabled={isApplying}
                                className="w-full bg-jolly-navy text-white px-8 py-4 rounded-2xl font-bold font-heading hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center disabled:opacity-50 disabled:translate-y-0"
                            >
                                {isApplying ? (
                                    <>
                                        <Loader2 size={20} className="mr-2 animate-spin" /> Sending message...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} className="mr-2" /> Send Application
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-jolly-slate font-medium">By sending, you agree to share your profile data with {companyName}.</p>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

