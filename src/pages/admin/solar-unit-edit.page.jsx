import { useGetSolarUnitByIdQuery } from "@/lib/redux/query";
import { useNavigate, useParams } from "react-router";
import { EditSolarUnitForm } from "./components/EditSolarUnitForm";

export default function SolarUnitEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: solarUnit,
    isLoading: isLoadingSolarUnit,
    isError: isErrorSolarUnit,
    error: errorSolarUnit,
  } = useGetSolarUnitByIdQuery(id);

  console.log(solarUnit);

  if (isLoadingSolarUnit) {
    return <div>Loading...</div>;
  }

  if (isErrorSolarUnit) {
    return <div>Error: {errorSolarUnit.message}</div>;
  }

  return (
    <main className="mt-6">
      {/* Primary Heading */}
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
        Edit Solar Unit
      </h1>

      {/* Subheading with Serial */}
      <h2 className="mt-3 text-xl font-semibold text-muted-foreground">
        Unit ID: {solarUnit.serialNumber}
      </h2>

      <div className="mt-10">
        <EditSolarUnitForm solarUnit={solarUnit} />
      </div>
    </main>
  );
}
