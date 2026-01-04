import React, { useMemo } from 'react';
import imgWindTurbine from './wind-turbine-large.png';
import imgSolarConstruction from './solar-construction.png';
import { useGetSolarUnitForUserQuery, useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";

const EnergySection = () => {
  const { data: solarUnit } = useGetSolarUnitForUserQuery();
  const solarUnitId = solarUnit?._id;

  // Fetch records for the last 60 days to ensure we cover the current month
  const { data: energyData } = useGetEnergyGenerationRecordsBySolarUnitQuery(
    {
      id: solarUnitId,
      groupBy: "date",
      limit: 60,
    },
    { skip: !solarUnitId }
  );

  const currentMonthEnergy = useMemo(() => {
    if (!energyData) return 0;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return energyData.reduce((acc, curr) => {
      // usage in DataChart implies curr._id.date is the date field
      const date = new Date(curr._id.date);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        return acc + (curr.totalEnergy || 0);
      }
      return acc;
    }, 0);
  }, [energyData]);

  return (
    <section className="px-4 py-8 md:px-6 md:py-16 bg-background font-[Inter]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        {/* Left Column: Large Image */}
        <div className="relative h-full w-full">
          <img
            src={imgWindTurbine}
            alt="Offshore wind turbines"
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>

        {/* Right Column: Text and Small Image */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
              Your Solar Energy <br className="hidden md:block" />
              Generation
            </h2>
            <p className="max-w-prose text-lg text-muted-foreground">
              This month, your solar panels generated <span className="font-semibold text-primary">{currentMonthEnergy > 0 ? currentMonthEnergy.toFixed(2) : "0"} kWh</span> of clean energy,
              helping you save on electricity bills and reduce your carbon
              footprint. Track your energy production trends and see how
              much power you contribute back to the grid.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl">
            <img
              src={imgSolarConstruction}
              alt="Workers installing solar panels"
              className="h-64 w-full object-cover sm:h-72 md:h-80 lg:w-3/4"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnergySection;
