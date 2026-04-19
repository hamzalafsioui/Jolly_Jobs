import React from "react";

const companies = [
  { id: 1, name: "Company 1", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop&q=80" },
  { id: 2, name: "Company 2", img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop&q=80" },
  { id: 3, name: "Company 3", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&h=100&fit=crop&q=80" },
  { id: 4, name: "Company 4", img: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=100&h=100&fit=crop&q=80" },
  { id: 5, name: "Company 5", img: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop&q=80" },
];

export default function TrustedCompanies() {
  return (
    <section className="bg-slate-50 py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-[13px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-8">
          Trusted by leading tech companies
        </h3>
        
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16">
          {companies.map((company) => (
            <div 
              key={company.id}
              className="w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-100/50 
                         grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <img 
                src={company.img} 
                alt={company.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
