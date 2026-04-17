import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
  Tag,
} from "lucide-react";
import adminApi from "../../api/admin.api";

export default function SkillsManagement() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [formData, setFormData] = useState({ name: "", category_id: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchSkills();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminApi.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getSkills();
      setSkills(response.data);
    } catch (err) {
      setError("Failed to load skills.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setCurrentSkill(skill);
      setFormData({ name: skill.name, category_id: skill.category_id || "" });
    } else {
      setCurrentSkill(null);
      setFormData({ name: "", category_id: "" });
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", category_id: "" });
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      if (currentSkill) {
        await adminApi.updateSkill(currentSkill.id, formData);
      } else {
        await adminApi.createSkill(formData);
      }
      fetchSkills();
      handleCloseModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await adminApi.deleteSkill(id);
        setSkills(skills.filter((s) => s.id !== id));
      } catch (err) {
        alert("Failed to delete skill.");
      }
    }
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (skill.category?.name &&
        skill.category.name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Skills</h1>
          <p className="text-slate-500 mt-1">
            Add || edit || remove platform skills.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-jolly-purple text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-jolly-deep-purple transition-all shadow-lg shadow-jolly-purple/20 active:scale-95 text-sm"
        >
          <Plus size={18} />
          Add New Skill
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-slate-50">
          <div className="relative max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search skills by name or category..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-jolly-purple/20 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-jolly-purple" size={40} />
            <p className="text-slate-400 font-bold text-sm">
              Fetching skills...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <AlertCircle size={32} />
            </div>
            <p className="text-red-500 font-bold">{error}</p>
            <button
              onClick={fetchSkills}
              className="text-jolly-purple font-bold hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Tag size={40} />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">
              No skills found
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              {searchQuery
                ? "Try a different search term."
                : "Get started by adding your first skill."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Skill Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {filteredSkills.map((skill) => (
                  <tr
                    key={skill.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {skill.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">
                          {skill.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          skill.category
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {skill.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(skill.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(skill)}
                          className="p-2 text-slate-400 hover:text-jolly-purple hover:bg-jolly-purple/5 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in"
            onClick={handleCloseModal}
          ></div>
          <div className="bg-white rounded-[32px] w-full max-w-md relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-8 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {currentSkill ? "Edit Skill" : "Add New Skill"}
                </h2>
                <p className="text-slate-500 text-sm">
                  Skills are used for job categorization.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
              {formError && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold">
                  <AlertCircle size={18} />
                  {formError}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js, Project Management"
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-jolly-purple/20 transition-all font-bold placeholder:text-slate-300"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Category (Optional)
                </label>
                <select
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-jolly-purple/20 transition-all font-bold text-slate-900 appearance-none"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-jolly-purple text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-jolly-deep-purple transition-all shadow-lg shadow-jolly-purple/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}
                  {currentSkill ? "Save Changes" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
