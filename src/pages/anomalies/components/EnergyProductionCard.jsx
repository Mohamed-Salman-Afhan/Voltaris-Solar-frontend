import { useState } from "react";

const EnergyProductionCard = ({
  day,
  date,
  production,
  hasAnomaly,
  anomalyType,
  anomalyReason,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <button
      onClick={handleClick}
      title={hasAnomaly ? anomalyReason : "Normal operation"}
      className={`relative w-full rounded-xl border transition-all duration-200 ease-in-out 
        ${
          hasAnomaly ? "border-[var(--destructive)]" : "border-[var(--border)]"
        } 
        bg-[var(--card)]/70 backdrop-blur-sm hover:shadow-lg 
        ${
          isSelected
            ? "outline outline-2 outline-offset-2 outline-[var(--primary)]"
            : ""
        }`}
    >
      {/* Anomaly badge */}
      {hasAnomaly && (
        <div className="absolute -top-2 -right-2 z-10 bg-[var(--destructive)] text-white px-2 py-1 text-xs font-medium rounded-md shadow-md">
          Anomaly
        </div>
      )}

      {/* Date section */}
      <div className="flex flex-col items-center gap-1 p-5 pb-2">
        <span className="text-sm font-medium text-[var(--muted-foreground)]">
          {day}
        </span>
        <span className="text-xs text-[var(--muted-foreground)]">{date}</span>
      </div>

      {/* Production section */}
      <div className="flex flex-col items-center p-5 pt-2">
        <span
          className={`text-3xl font-bold mb-1 ${
            hasAnomaly ? "text-[var(--destructive)]" : "text-[var(--primary)]"
          }`}
        >
          {production}
        </span>
        <span className="text-sm font-medium text-[var(--muted-foreground)]">
          kWh
        </span>

        {/* Anomaly type */}
        {hasAnomaly && anomalyType && (
          <div className="mt-2 px-2 py-1 bg-[var(--destructive)]/10 rounded-md text-xs font-medium text-[var(--destructive)]">
            {anomalyType}
          </div>
        )}
      </div>

      {/* Detailed anomaly reason (popover) */}
      {isSelected && hasAnomaly && anomalyReason && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-[var(--foreground)] text-[var(--card)] text-xs rounded-lg shadow-xl z-10">
          <div className="font-semibold mb-1">Why is this an anomaly?</div>
          <div>{anomalyReason}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--foreground)]"></div>
        </div>
      )}
    </button>
  );
};

export default EnergyProductionCard;
