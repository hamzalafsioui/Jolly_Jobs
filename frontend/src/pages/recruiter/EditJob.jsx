import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import recruiterApi from "../../api/recruiter.api";
import jobApi from "../../api/job.api";

export default function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [contractTypes, setContractTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    contract_type: "",
    city_id: "",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    requirements: "",
    is_remote: false,
    skills: [],
    address: "",
    latitude: "",
    longitude: "",
  });

  const [verifying, setVerifying] = useState(false);

  const [availableSkills, setAvailableSkills] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    Promise.all([
      recruiterApi.getContractTypes().catch(() => ({ data: [] })),
      jobApi.getSkills().catch(() => ({ data: [] })),
      jobApi.getCities().catch(() => ({ data: [] })),
      jobApi.getCategories().catch(() => ({ data: [] })),
      jobApi.getOfferDetails(id).catch(() => ({ success: false })),
    ])
      .then(([contractRes, skillRes, cityRes, catRes, offerRes]) => {
        setContractTypes(contractRes?.data || []);
        setAvailableSkills(skillRes?.data || []);
        setCities(cityRes?.data || []);
        setCategories(catRes?.data || []);

        if (offerRes?.success && offerRes?.data) {
          const job = offerRes.data;
          setForm({
            title: job.title || "",
            description: job.description || "",
            category_id: job.category_id || "",
            contract_type: job.contract_type || "",
            city_id: job.city_id || "",
            experience_level: job.experience_level || "",
            salary_min: job.salary_min || "",
            salary_max: job.salary_max || "",
            requirements: job.requirements || "",
            is_remote: !!job.remote,
            skills: job.skills ? job.skills.map((s) => s.name) : [],
            address: job.address || "",
            latitude: job.latitude || "",
            longitude: job.longitude || "",
          });
        } else {
          setError("Failed to fetch job details.");
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVerifyAddress = async () => {
    if (!form.address.trim()) {
      alert("Please enter an address first");
      return;
    }

    setVerifying(true);

    // Safety timeout
    const timeoutId = setTimeout(() => {
      setVerifying(false);
      alert("Verification timed out. Using free OpenStreetMap service...");
    }, 8000);

    try {
      // Using free Nominatim (OpenStreetMap) Geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}&limit=1`,
      );
      const data = await response.json();

      clearTimeout(timeoutId);
      setVerifying(false);

      if (data && data.length > 0) {
        const result = data[0];
        setForm((prev) => ({
          ...prev,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        }));
        alert("Location verified via OpenStreetMap!");
      } else {
        alert(
          "Could not find this address. Please try adding the city name (e.g. 'Street Name, City').",
        );
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setVerifying(false);
      alert("Address verification service error. Please try again.");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
      };
      await recruiterApi.updateJob(id, payload);
      setSuccess(true);
      setTimeout(() => navigate("/recruiter/jobs"), 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to update job. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Job Updated Successfully!
        </h2>
        <p className="text-slate-500 mt-1">Redirecting to My Jobs…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Edit Job Offer</h1>
        <p className="text-slate-500 mt-1">
          Make changes to your existing job offer below.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-3xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Senior React Developer"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Contract Type, Experience & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Contract Type <span className="text-red-500">*</span>
              </label>
              <select
                name="contract_type"
                value={form.contract_type}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select type…</option>
                {contractTypes.length > 0
                  ? contractTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))
                  : [
                      "Full-time",
                      "Part-time",
                      "Contract",
                      "Internship",
                      "Freelance",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Experience <span className="text-red-500">*</span>
              </label>
              <select
                name="experience_level"
                value={form.experience_level}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select level…</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Junior">Junior (1-2 years)</option>
                <option value="Mid Level">Mid Level (3-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
                <option value="Expert">Expert / Lead</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city_id"
                value={form.city_id}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select city…</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Detailed Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Office Address (Optional for Map)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. Gueliz, Marrakech, Morocco"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleVerifyAddress}
                disabled={verifying}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors disabled:opacity-50 text-xs shrink-0"
              >
                {verifying ? "Verifying..." : "Verify on Map"}
              </button>
            </div>
            {form.latitude && form.longitude && (
              <p className="mt-2 text-[10px] text-green-600 font-medium">
                Coordinates captured: {Number(form.latitude).toFixed(4)},{" "}
                {Number(form.longitude).toFixed(4)}
              </p>
            )}
            <p className="mt-1 text-[10px] text-slate-400">
              Specify the street address to show an exact pin on the job map.
            </p>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Min Salary (MAD)
              </label>
              <input
                type="number"
                name="salary_min"
                value={form.salary_min}
                onChange={handleChange}
                placeholder="e.g. 8000"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Max Salary (MAD)
              </label>
              <input
                type="number"
                name="salary_max"
                value={form.salary_max}
                onChange={handleChange}
                placeholder="e.g. 15000"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Remote */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_remote"
              name="is_remote"
              checked={form.is_remote}
              onChange={handleChange}
              className="w-4 h-4 accent-indigo-600"
            />
            <label
              htmlFor="is_remote"
              className="text-sm font-semibold text-slate-700"
            >
              Remote friendly
            </label>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Required Skills
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {form.skills.map((skillName) => (
                <span
                  key={skillName}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100"
                >
                  {skillName}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        skills: prev.skills.filter((s) => s !== skillName),
                      }))
                    }
                    className="hover:text-indigo-900 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = skillInput.trim();
                    if (val && !form.skills.includes(val)) {
                      setForm((prev) => ({
                        ...prev,
                        skills: [...prev.skills, val],
                      }));
                      setSkillInput("");
                    }
                  }
                }}
                placeholder="e.g. React, CSS, HTML (Press Enter or Add)"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => {
                  const val = skillInput.trim();
                  if (val && !form.skills.includes(val)) {
                    setForm((prev) => ({
                      ...prev,
                      skills: [...prev.skills, val],
                    }));
                    setSkillInput("");
                  }
                }}
                className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Add
              </button>
            </div>

            {skillInput.trim().length > 0 &&
              availableSkills.filter(
                (s) =>
                  s.name.toLowerCase().includes(skillInput.toLowerCase()) &&
                  !form.skills.includes(s.name),
              ).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-bold text-slate-400">
                    Suggestions:
                  </span>
                  {availableSkills
                    .filter(
                      (s) =>
                        s.name
                          .toLowerCase()
                          .includes(skillInput.toLowerCase()) &&
                        !form.skills.includes(s.name),
                    )
                    .slice(0, 5)
                    .map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            skills: [...prev.skills, s.name],
                          }));
                          setSkillInput("");
                        }}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                      >
                        + {s.name}
                      </button>
                    ))}
                </div>
              )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe the role, responsibilities, and what success looks like…"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows={4}
              placeholder="List the required skills, experience level, education…"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving changes…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/recruiter/jobs")}
              className="border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
