import React from 'react';
import { Quote } from 'lucide-react';

const stories = [
  {
    id: 1,
    quote: "I found my current role as a Senior Dev at a top startup within two weeks of joining Jolly Jobs. The interface is amazing!",
    name: "Alex Chen",
    role: "Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
    quoteColor: "text-indigo-100"
  },
  {
    id: 2,
    quote: "The job recommendations are actually relevant. It's the first platform where I didn't feel like I was shouting into a void.",
    name: "Sarah Miller",
    role: "Data Scientist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
    quoteColor: "text-teal-100"
  },
  {
    id: 3,
    quote: "As a hiring manager, the quality of candidates we get from Jolly Jobs is significantly higher than other platforms.",
    name: "David Rodriguez",
    role: "VP of Engineering",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
    quoteColor: "text-indigo-100"
  }
];

export default function SuccessStories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
            Success Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div 
              key={story.id} 
              className="bg-[#f8fafc] rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              {/* Large background quote icon */}
              <div className={`absolute top-4 right-4 ${story.quoteColor} opacity-50`}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <p className="text-slate-600 text-[15px] leading-relaxed mb-8 flex-grow">
                  "{story.quote}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <img 
                    src={story.avatar} 
                    alt={story.name} 
                    className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-white"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{story.name}</h4>
                    <p className="text-[12px] text-slate-500 font-medium">{story.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
