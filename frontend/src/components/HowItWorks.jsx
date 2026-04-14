import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      number: "1",
      title: "Create an Account",
      description:
        "Sign up in seconds and build your professional profile to showcase your skills.",
      color: "bg-jolly-purple",
      shadow: "shadow-jolly-purple/20",
    },
    {
      id: 2,
      number: "2",
      title: "Search & Apply",
      description:
        "Use our smart filters to find jobs that match your preferences and apply with one click.",
      color: "bg-jolly-teal",
      shadow: "shadow-jolly-teal/20",
    },
    {
      id: 3,
      number: "3",
      title: "Get Hired",
      description:
        "Communicate directly with hiring managers and land your dream tech role.",
      color: "bg-jolly-purple",
      shadow: "shadow-jolly-purple/20",
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-jolly-navy mb-4 relative inline-block">
            How Jolly Jobs Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* steps */}
          {steps.map((step) => (
            <div
              key={step.id}
              className="group flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className={`
                relative mb-8 w-16 h-16 ${step.color} ${step.shadow} 
                rounded-2xl flex items-center justify-center text-white text-2xl font-bold
                shadow-xl group-hover:scale-110 transition-transform duration-500
              `}
              >
                {step.number}

                {/* Decorative glow */}
                <div
                  className={`absolute -inset-2 ${step.color} opacity-20 blur-xl rounded-full -z-10 group-hover:opacity-40 transition-opacity`}
                ></div>
              </div>

              <h3 className="text-xl font-heading font-bold text-jolly-navy mb-4 group-hover:text-jolly-purple transition-colors">
                {step.title}
              </h3>

              <p className="text-jolly-slate leading-relaxed max-w-xs font-body">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
