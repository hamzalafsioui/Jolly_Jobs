import {
  Code,
  Smartphone,
  Database,
  Palette,
  Cloud,
  Megaphone,
} from "lucide-react";

const categories = [
  {
    name: "Web Dev",
    jobs: 420,
    icon: Code,
    colorClass: "text-jolly-purple bg-jolly-purple/10",
  },
  {
    name: "Mobile",
    jobs: 185,
    icon: Smartphone,
    colorClass: "text-jolly-teal bg-jolly-teal/10",
  },
  {
    name: "Data Science",
    jobs: 98,
    icon: Database,
    colorClass: "text-jolly-purple bg-jolly-purple/10",
  },
  {
    name: "Design",
    jobs: 112,
    icon: Palette,
    colorClass: "text-jolly-teal bg-jolly-teal/10",
  },
  {
    name: "DevOps",
    jobs: 76,
    icon: Cloud,
    colorClass: "text-jolly-purple bg-jolly-purple/10",
  },
  {
    name: "Marketing",
    jobs: 54,
    icon: Megaphone,
    colorClass: "text-jolly-teal bg-jolly-teal/10",
  },
];

export default function BrowseCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-heading font-bold text-center text-jolly-navy mb-10">
        Browse by Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-16">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all cursor-pointer border border-gray-50 hover:border-jolly-purple/20 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${category.colorClass}`}
              >
                <Icon size={24} strokeWidth={2} />
              </div>
              <h3 className="font-heading font-bold text-jolly-navy text-sm mb-1">
                {category.name}
              </h3>
              <p className="text-xs text-text-secondary font-body">
                {category.jobs} Jobs
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
