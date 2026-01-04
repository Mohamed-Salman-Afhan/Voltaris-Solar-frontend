import React from "react";
import imgSolarConstruction from "./solar-construction.png";
import imgUserAvatar from "./user-avatar.jpg";
import { ChevronRight, User } from "lucide-react";

const UserProfileSection = () => {
  const goals = [
    "Maximize solar energy savings.",
    "Detect and resolve issues early.",
    "Track daily, weekly, and monthly output.",
    "Get notified of anomalies instantly.",
  ];

  const needs = [
    "A simple dashboard for real-time monitoring.",
    "Instant alerts for system anomalies.",
    "Easy access to historical performance data.",
    "Clear, actionable insights for better energy management.",
  ];

  return (
    <section className="bg-background px-4 py-8 font-[Inter] md:px-6 md:py-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center lg:gap-12">
        {/* Left Column: Text Content */}
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Goals */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-foreground">Goals:</h3>
            <div className="flex flex-col gap-3">
              {goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-foreground" />
                  <span className="text-lg">{goal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Needs */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-foreground">Needs:</h3>
            <div className="flex flex-col gap-3">
              {needs.map((need, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-foreground" />
                  <span className="text-lg">{need}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Profile Card */}
          <div className="flex w-full max-w-md items-center gap-4 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground overflow-hidden">
              <img
                src={imgUserAvatar}
                alt="Alex P."
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Alex P.</span>
                <span className="text-sm text-muted-foreground">42 y.o.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Homeowner</span>
                <span className="font-semibold text-foreground">
                  Solar User
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="relative h-full w-full min-h-[400px]">
          <img
            src={imgSolarConstruction}
            alt="Workers installing solar panels"
            className="h-full w-full rounded-3xl object-cover"
          />
          {/* Floating User Profile Badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-white shadow-lg md:top-8 md:left-8">
            <User className="h-5 w-5" />
            <span className="font-medium">User Profile</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfileSection;
