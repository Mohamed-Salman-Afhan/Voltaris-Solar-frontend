import React from 'react';
import imgWindTurbine from './wind-turbine-3.png';
import { ChevronRight, AlertTriangle } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    "Panel shading or dirt",
    "Unexpected drop in output",
    "Inverter errors",
    "Missed maintenance reminders"
  ];

  return (
    <section className="bg-background px-4 py-8 font-[Inter] md:px-6 md:py-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        {/* Left Column: Text Content */}
        <div className="flex flex-col gap-6">
          <div className="flex w-fit items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
            <AlertTriangle className="h-4 w-4" />
            <span>Problem</span>
          </div>
          
          <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
            Home solar systems can face reduced efficiency and missed savings due to panel shading, dirt, unexpected drops in output, or inverter issues. Stay ahead with instant anomaly alerts.
          </h2>

          <div className="mt-4 flex flex-col gap-4">
            {problems.map((problem, index) => (
              <div key={index} className="flex items-center gap-3 text-lg text-muted-foreground">
                <ChevronRight className="h-5 w-5 text-red-500" />
                <span>{problem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="relative h-full w-full">
          <img
            src={imgWindTurbine}
            alt="Wind turbines model"
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
