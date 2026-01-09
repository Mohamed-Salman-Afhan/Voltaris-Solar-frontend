import { Link } from "react-router-dom";
import {
  useGetInvoicesQuery,
  useGetSolarUnitForUserQuery,
} from "../../lib/redux/query";
import { format } from "date-fns";
import { InvoiceCard } from "./components/InvoiceCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function InvoicesPage() {
  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    error: errorInvoices,
  } = useGetInvoicesQuery();
  const { data: solarUnits = [] } = useGetSolarUnitForUserQuery();

  const [selectedUnitId, setSelectedUnitId] = useState(null);

  // Set default selected unit
  useEffect(() => {
    if (solarUnits.length > 0 && !selectedUnitId) {
      setSelectedUnitId(solarUnits[0]._id);
    }
  }, [solarUnits, selectedUnitId]);

  // Filter invoices based on selected unit
  const filteredInvoices = invoices?.filter((invoice) => {
    // Handle both populated object and string ID cases just to be safe
    const invoiceUnitId =
      typeof invoice.solarUnitId === "object"
        ? invoice.solarUnitId?._id
        : invoice.solarUnitId;

    return invoiceUnitId === selectedUnitId;
  });

  if (isLoadingInvoices) return <div className="p-8">Loading invoices...</div>;
  if (errorInvoices)
    return <div className="p-8 text-red-500">Error loading invoices</div>;

  return (
    <div className="container mx-auto p-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          Billing & Invoices
        </h1>

        {/* Unit Selector */}
        {solarUnits.length > 0 && (
          <div className="w-full md:w-[250px]">
            <Select
              value={selectedUnitId || ""}
              onValueChange={(value) => setSelectedUnitId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Solar Unit" />
              </SelectTrigger>
              <SelectContent>
                {solarUnits.map((unit) => (
                  <SelectItem key={unit._id} value={unit._id}>
                    {unit.serialNumber} ({unit.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {!filteredInvoices || filteredInvoices.length === 0 ? (
        <div className="border border-gray-200 shadow-sm rounded-xl bg-white">
          <div className="py-10 text-center">
            <p className="text-gray-500">
              {selectedUnitId
                ? "No invoices found for this unit."
                : "No invoices found."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice._id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
}
