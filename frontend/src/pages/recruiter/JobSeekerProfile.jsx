import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  ChevronLeft,
  Loader2,
  Globe
} from "lucide-react";
import client from "../../api/client";

export default function JobSeekerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storageBase = import.meta.env.VITE_STORAGE_URL || "http://localhost:8001/storage";

  useEffect(() => {
    setLoading(true);
    client.get(`/auth/job-seekers/${id}`)
      .then(res => {
        if (res.data.success) {
          setProfile(res.data.data);
        } else {
          setError("Failed to load profile.");
        }
      })
      .catch(err => {
        setError(err?.response?.data?.message || "Profile not found.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading candidate profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-6 px-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <UserIcon size={40} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Profile Not Available</h1>
          <p className="text-slate-500 mt-2">{error || "We couldn't find the candidate you're looking for."}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} />
          Back to Candidates
        </button>
      </div>
    );
  }

  const seeker = profile.job_seeker || {};
  const experiences = seeker.experiences || [];
  const skills = seeker.skills || [];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Top Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-semibold"
      >
        <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
          <ChevronLeft size={20} />
        </div>
        Back to Candidates
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Brief Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-center p-8">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-[2rem] bg-slate-100 overflow-hidden border-4 border-white shadow-xl mx-auto">
                {profile.photo ? (
                  <img
                    src={`${storageBase}/${profile.photo}`}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500">
                    <UserIcon size={48} />
                  </div>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl font-black text-slate-800 leading-tight">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-indigo-600 font-bold mt-1 uppercase tracking-wider text-xs bg-indigo-50 inline-block px-3 py-1 rounded-lg">
              {seeker.specialty || "Job Seeker"}
            </p>

            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
              <div className="flex items-center gap-3 text-slate-600 group">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <Mail size={14} />
                </div>
                <span className="text-sm font-medium truncate">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-3 text-slate-600 group">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                    <Phone size={14} />
                  </div>
                  <span className="text-sm font-medium">{profile.phone}</span>
                </div>
              )}
              {profile.city && (
                <div className="flex items-center gap-3 text-slate-600 group">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                    <MapPin size={14} />
                  </div>
                  <span className="text-sm font-medium">{profile.city.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <div className="w-2 h-6 bg-jolly-purple rounded-full" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:text-indigo-600 transition-all cursor-default"
                  >
                    {skill.name}
                  </span>
                ))
              ) : (
                <p className="text-slate-400 text-sm italic">No skills listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Experience and Bio */}
        <div className="lg:col-span-2 space-y-8">
          {profile.bio && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <Globe className="text-jolly-purple" size={24} />
                About Candidate
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                {profile.bio}
              </p>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-8">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Briefcase className="text-indigo-600" size={24} />
              Professional Experience
            </h2>

            <div className="relative space-y-8 ml-4">
              {/* Timeline Line */}
              {experiences.length > 0 && (
                <div className="absolute left-[-1.25rem] top-2 bottom-0 w-0.5 bg-slate-100" />
              )}

              {experiences.length > 0 ? (
                experiences.map((exp, index) => (
                  <div key={index} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute left-[-1.5rem] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white shadow-sm" />
                    
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="font-bold text-slate-800 text-lg">{exp.position}</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full w-fit">
                          {new Date(exp.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} 
                          {' - '} 
                          {exp.end_date ? new Date(exp.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                        <p>{exp.company_name}</p>
                        {exp.location && (
                          <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              {exp.location}
                            </div>
                          </>
                        )}
                      </div>
                      {exp.description && (
                         <div className="mt-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100/50 text-slate-600 text-sm leading-relaxed font-medium">
                           {exp.description}
                         </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-[2rem]">
                  <p className="text-slate-400 font-medium">No professional experience listed.</p>
                </div>
              )}
            </div>
          </div>

          {/* Education Timeline */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-8">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Calendar className="text-amber-500" size={24} />
              Education
            </h2>

            <div className="relative space-y-8 ml-4">
              {/* Timeline Line */}
              {seeker.educations?.length > 0 && (
                <div className="absolute left-[-1.25rem] top-2 bottom-0 w-0.5 bg-slate-100" />
              )}

              {seeker.educations?.length > 0 ? (
                seeker.educations.map((edu, index) => (
                  <div key={index} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute left-[-1.5rem] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
                    
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="font-bold text-slate-800 text-lg">{edu.degree} in {edu.field_of_study}</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-3 py-1 rounded-full w-fit">
                          {new Date(edu.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} 
                          {' - '} 
                          {edu.end_date ? new Date(edu.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                        <p>{edu.school}</p>
                      </div>
                      {edu.description && (
                         <div className="mt-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100/50 text-slate-600 text-sm leading-relaxed font-medium">
                           {edu.description}
                         </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-[2rem]">
                  <p className="text-slate-400 font-medium">No education listed.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
