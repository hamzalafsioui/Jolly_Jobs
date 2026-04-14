import JobCard from "./JobCard";

const JOBS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Vortex Labs",
    tags: ["React", "TypeScript", "Tailwind"],
    location: "San Francisco",
    salary: "$140k - $180k",
    type: "Full-time",
    logoColor: "bg-[#0f172a]",
  },
  {
    id: 2,
    title: "Backend Developer (Node.js)",
    company: "Skyline Systems",
    tags: ["Node.js", "PostgreSQL"],
    location: "New York",
    salary: "$120k - $160k",
    type: "Remote",
    logoColor: "bg-[#1e293b]",
  },
  {
    id: 3,
    title: "AI Machine Learning Engineer",
    company: "Neural Path",
    tags: ["Python", "PyTorch"],
    location: "London, UK",
    salary: "£90k - £120k",
    type: "Full-time",
    logoColor: "bg-[#e2e8f0]",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "Minty Finance",
    tags: ["Figma", "Prototyping"],
    location: "Remote",
    salary: "$80 - $110 / hr",
    type: "Contract",
    logoColor: "bg-[#0f172a]",
  },
  {
    id: 5,
    title: "Security Analyst",
    company: "Shield Secure",
    tags: ["Security", "AWS"],
    location: "Berlin, DE",
    salary: "€75k - €95k",
    type: "Full-time",
    logoColor: "bg-[#f1f5f9]",
  },
  {
    id: 6,
    title: "Product Manager",
    company: "CartFlow",
    tags: ["Agile", "SQL"],
    location: "Austin, TX",
    salary: "$130k - $170k",
    type: "Full-time",
    logoColor: "bg-[#334155]",
  },
];

export default function FeaturedJobs() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <h2 className="text-[2rem] font-heading font-bold text-jolly-navy mb-2">
            Featured Jobs
          </h2>
          <p className="text-text-secondary font-body">
            Hand-picked opportunities from top tech companies.
          </p>
        </div>
        <a
          href="#"
          className="font-heading font-bold text-jolly-purple hover:text-jolly-deep-purple transition-colors mt-4 md:mt-0 flex items-center text-[15px]"
        >
          View all jobs &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {JOBS.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
