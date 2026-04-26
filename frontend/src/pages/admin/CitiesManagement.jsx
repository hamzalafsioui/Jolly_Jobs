import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, MapPin, Loader2, X } from "lucide-react";
import adminApi from "../../api/admin.api";
import swal from "../../utils/swal";

export default function CitiesManagement() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({ name: "", region: "", country: "Morocco" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCities();
      if (res.success) {
        setCities(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (city = null) => {
    setError(null);
    if (city) {
      setEditingCity(city);
      setFormData({ 
        name: city.name, 
        region: city.region || "", 
        country: city.country || "Morocco" 
      });
    } else {
      setEditingCity(null);
      setFormData({ name: "", region: "", country: "Morocco" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCity(null);
    setFormData({ name: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingCity) {
        const res = await adminApi.updateCity(editingCity.id, formData);
        if (res.success) {
          setCities(cities.map(c => c.id === editingCity.id ? res.data : c));
          handleCloseModal();
        }
      } else {
        const res = await adminApi.createCity(formData);
        if (res.success) {
          setCities([res.data, ...cities]);
          handleCloseModal();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await swal.confirm("Delete City", "Are you sure you want to delete this city?");
    if (!result.isConfirmed) return;
    
    try {
      const res = await adminApi.deleteCity(id);
      if (res.success) {
        setCities(cities.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete city:", err);
      swal.error("Error", "Failed to delete city. It might be linked to existing job offers or users.");
    }
  };

  if (loading && cities.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-jolly-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="text-jolly-purple" /> Cities Management
          </h1>
          <p className="text-slate-500 mt-1">Manage locations available in the system.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-jolly-purple text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-jolly-deep-purple transition-all shadow-[0_4px_14_rgba(103,58,183,0.39)]"
        >
          <Plus size={18} /> Add New City
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search cities by name..." 
          className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-800"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCities.map((city) => (
          <div key={city.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin size={18} />
              </div>
              <h3 className="font-bold text-slate-800">{city.name}</h3>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleOpenModal(city)}
                className="p-2 text-slate-400 hover:text-jolly-purple hover:bg-jolly-purple/10 rounded-lg transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(city.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
          <MapPin size={40} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No cities found</h3>
          <p className="text-slate-500">Try adjusting your search or add a new city.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                {editingCity ? <Edit2 size={20} className="text-jolly-purple"/> : <Plus size={20} className="text-jolly-purple"/>}
                {editingCity ? "Edit City" : "Add New City"}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">City Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-jolly-purple/20 outline-none"
                    placeholder="e.g. Casablanca"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Region</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-jolly-purple/20 outline-none"
                    placeholder="e.g. Casablanca-Settat"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-jolly-purple/20 outline-none"
                    placeholder="e.g. Morocco"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !formData.name.trim()}
                  className="flex-1 bg-jolly-purple text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-jolly-deep-purple transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save City"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
