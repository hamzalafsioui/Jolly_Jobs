import React, { useState, useEffect } from "react";
import {
  Building,
  User,
  Mail,
  Globe,
  Camera,
  Briefcase,
  Info,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  GraduationCap,
  Phone,
  MapPin,
} from "lucide-react";
import profileApi from "../api/profile.api";
import jobApi from "../api/job.api";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Unified state for both roles
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: "",
    city_id: "",
    // Recruiter fields
    company_name: "",
    industry: "",
    website: "",
    description: "",
    // Job Seeker fields
    specialty: "",
    experience_level: "",
    skills: [],
  });

  const [cities, setCities] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [file, setFile] = useState(null); // logo for recruiter => CV for job seeker
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null); // only for logo
  const [userPhotoPreview, setUserPhotoPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchCities();
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await jobApi.getSkills();
      if (res.success) {
        setAvailableSkills(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch skills", err);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await jobApi.getCities();
      if (res.success) {
        setCities(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch cities", err);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileApi.getProfile();
      if (res.success) {
        const user = res.data;
        setRole(user.role);

        const storageBase =
          import.meta.env.VITE_STORAGE_URL || "http://localhost:8001/storage";

        const baseData = {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          city_id: user.city_id || "",
        };

        if (user.photo) {
          setUserPhotoPreview(`${storageBase}/${user.photo}`);
        }

        if (user.role === "recruiter") {
          setFormData({
            ...baseData,
            company_name: user.recruiter?.company_name || "",
            industry: user.recruiter?.industry || "",
            website: user.recruiter?.website || "",
            description: user.recruiter?.description || "",
          });
          if (user.recruiter?.logo) {
            setPreview(`${storageBase}/${user.recruiter.logo}`);
          }
        } else if (user.role === "job_seeker") {
          setFormData({
            ...baseData,
            specialty: user.job_seeker?.specialty || "",
            experience_level: user.job_seeker?.experience_level || "",
            skills: user.job_seeker?.skills?.map((s) => s.id) || [],
          });
          if (user.job_seeker?.cv_path) {
            setPreview(`${storageBase}/${user.job_seeker.cv_path}`);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setMessage({ type: "error", text: "Failed to load profile data." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type = "role") => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (type === "user") {
        setUserPhotoFile(selectedFile);
        if (selectedFile.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setUserPhotoPreview(reader.result); // reader.result => base64 image
          };
          reader.readAsDataURL(selectedFile); // convert file to previewable URL
        }
      } else {
        setFile(selectedFile);
        if (role === "recruiter" && selectedFile.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(selectedFile);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    // Client side file size check (2MB limit to match PHP config)
    if (file && file.size > 2 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "File is too large. Maximum size is 2MB.",
      });
      setSaving(false);
      return;
    }

    const submissionData = new FormData();

    // Append basic user data
    const userFields = ["first_name", "last_name", "phone", "city_id", "bio"];
    userFields.forEach((key) => {
      const value = formData[key];
      if (value !== "" && value !== null && value !== undefined) {
        submissionData.append(key, value);
      }
    });

    // Append role-specific data
    if (role === "recruiter") {
      const recruiterFields = [
        "company_name",
        "industry",
        "website",
        "description",
      ];
      recruiterFields.forEach((key) => {
        const value = formData[key];
        if (value !== "" && value !== null && value !== undefined) {
          submissionData.append(key, value);
        }
      });
      if (file) submissionData.append("logo", file);
    } else if (role === "job_seeker") {
      const jobSeekerFields = ["specialty", "experience_level"];
      jobSeekerFields.forEach((key) => {
        const value = formData[key];
        if (value !== "" && value !== null && value !== undefined) {
          submissionData.append(key, value);
        }
      });

      // Handle skills array specifically
      if (Array.isArray(formData.skills)) {
        formData.skills.forEach((skillId) =>
          submissionData.append("skills[]", skillId),
        );
      }

      if (file) submissionData.append("cv", file);
    }

    // Global Fields
    if (role) submissionData.append("role", role);
    if (userPhotoFile) submissionData.append("photo", userPhotoFile);

    try {
      const res = await profileApi.updateProfile(submissionData);
      if (res.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        const storageBase =
          import.meta.env.VITE_STORAGE_URL || "http://localhost:8001/storage";

        if (role === "recruiter" && res.data.recruiter?.logo) {
          setPreview(`${storageBase}/${res.data.recruiter.logo}`);
        } else if (role === "job_seeker" && res.data.job_seeker?.cv_path) {
          setPreview(`${storageBase}/${res.data.job_seeker.cv_path}`);
        }
        // Reset file state after successful upload
        setFile(null);
      }
    } catch (err) {
      console.error("Update failed", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-jolly-purple animate-spin" />
      </div>
    );
  }

  const isRecruiter = role === "recruiter";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            {isRecruiter ? "Company Profile" : "Professional Profile"}
          </h1>
          <p className="text-slate-500 font-medium">
            {isRecruiter
              ? "Manage your personal and company branding information."
              : "Keep your professional details and resume up to date."}
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-3xl flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-red-50 text-red-700 border-red-100"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <p className="text-sm font-bold">{message.text}</p>
          <button
            onClick={() => setMessage({ type: "", text: "" })}
            className="ml-auto opacity-50 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        {/* Section 1: Personal Details */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-800">
              Personal Details
            </h2>
          </div>

          {/* User Photo Upload */}
          <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-50">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 overflow-hidden border-4 border-white shadow-md">
                {userPhotoPreview ? (
                  <img
                    src={userPhotoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User size={40} />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-jolly-purple text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-jolly-deep-purple transition-all scale-90 hover:scale-100">
                <Camera size={18} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "user")}
                />
              </label>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-black text-slate-800">
                Profile Photo
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                Upload a professional photo for your profile.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-jolly-purple/20 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-jolly-purple/20 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Phone Number
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-jolly-purple/20 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Location / City
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                  <MapPin size={18} />
                </div>
                <select
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-jolly-purple/20 outline-none appearance-none"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-slate-100 cursor-not-allowed border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-500 outline-none"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                About / Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                placeholder="Tell us a bit about yourself..."
                className="w-full bg-slate-50 border-none rounded-3xl px-5 py-4 text-sm font-bold text-slate-800 outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </section>

        {/* Section 2: Role Specific Data */}
        {isRecruiter ? (
          /* Recruiter Section */
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-jolly-purple/10 text-jolly-purple rounded-xl flex items-center justify-center">
                <Building size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-800">
                Company Information
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Company Logo
                </label>
                <div className="relative aspect-square w-full rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden group hover:border-jolly-purple transition-all flex flex-col items-center justify-center text-center p-4">
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Logo Preview"
                        className="absolute inset-0 w-full h-full object-contain p-4"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-800">
                          Change Logo
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-3">
                      <Camera size={24} className="text-slate-400" />
                      <p className="text-xs font-bold text-slate-800">
                        Upload Logo
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-slate-50 border-none rounded-3xl px-5 py-4 text-sm font-bold text-slate-800 outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Job Seeker Section */
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-jolly-teal/10 text-jolly-teal rounded-xl flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-800">
                Professional Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Professional Specialty
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Briefcase size={18} />
                  </div>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-jolly-purple/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Experience Level
                </label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-jolly-purple/20 outline-none appearance-none"
                >
                  <option value="">Select Level</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Junior">Junior (1-2 years)</option>
                  <option value="Mid Level">Mid Level (3-5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                  <option value="Expert">Expert / Lead</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          skills: prev.skills.includes(skill.id)
                            ? prev.skills.filter((id) => id !== skill.id)
                            : [...prev.skills, skill.id],
                        }));
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                        formData.skills?.includes(skill.id)
                          ? "bg-jolly-teal text-white border-jolly-teal"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-jolly-teal/50"
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Resume / CV (PDF)
                </label>
                <div className="relative group">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-slate-100 hover:border-jolly-purple transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {file ? (
                        <div className="flex items-center gap-3 text-jolly-purple">
                          <FileText size={40} />
                          <span className="text-sm font-black">
                            {file.name}
                          </span>
                        </div>
                      ) : formData.cv_path || preview ? (
                        <div className="flex items-center gap-3 text-emerald-500">
                          <CheckCircle2 size={40} />
                          <span className="text-sm font-black">
                            CV Uploaded - Click to update
                          </span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud
                            size={40}
                            className="text-slate-400 mb-3 group-hover:scale-110 transition-transform"
                          />
                          <p className="mb-2 text-sm text-slate-800 font-bold">
                            Click to upload your resume
                          </p>
                          <p className="text-xs text-slate-400">
                            PDF, DOC up to 2MB
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 sticky bottom-8 z-50 py-4 px-6 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 shadow-2xl">
          <button
            type="button"
            onClick={fetchProfile}
            className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-jolly-purple text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-jolly-purple/20 hover:bg-jolly-deep-purple transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
