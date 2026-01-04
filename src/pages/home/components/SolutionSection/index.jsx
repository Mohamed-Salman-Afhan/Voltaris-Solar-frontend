import React from "react";
import imgWindTurbine from "./wind-turbine-large.png";
import { Zap, ChevronRight, Triangle } from "lucide-react";

const SolutionSection = () => {
  const solutions = [
    "Real-time energy tracking",
    "Anomaly alerts",
    "Historical performance reports",
    "Remote diagnostics & support",
  ];

  return (
    <section className="bg-background px-4 py-8 font-[Inter] md:px-6 md:py-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {/* Left Column: Image with Branding Card */}
        <div className="relative h-full w-full min-h-[400px]">
          <img
            src={imgWindTurbine}
            alt="Wind turbines at sea"
            className="h-full w-full rounded-3xl object-cover object-left"
          />
          {/* Floating Brand Card */}
          <div className="absolute bottom-6 left-6 flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl bg-secondary-foreground p-2 text-white shadow-lg md:bottom-12 md:left-12">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Triangle className="h-4 w-4 fill-current" />
            </div>
            <span className="text-sm text-primary font-semibold">Voltaris</span>
          </div>
        </div>

        {/* Right Column: Solution Content */}
        <div className="flex flex-col justify-center rounded-3xl bg-secondary p-8 text-white md:p-12 lg:p-16">
          <div className="mb-6 w-fit rounded-lg bg-secondary-foreground px-4 py-2 text-sm font-bold text-secondary uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Solution</span>
            </div>
          </div>

          <h2 className="mb-8 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            The Solar Home Dashboard empowers you to monitor your solar panels,
            receive instant alerts for anomalies, and optimize your energy usage
            for maximum savings and peace of mind.
          </h2>

          <div className="flex flex-col gap-4">
            {solutions.map((solution, index) => (
              <div key={index} className="flex items-center gap-3">
                <ChevronRight className="h-5 w-5 text-secondary-foreground" />
                <span className="text-lg font-medium">{solution}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
