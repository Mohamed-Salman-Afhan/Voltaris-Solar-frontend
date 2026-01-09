import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";

export function InvoiceCard({ invoice }) {
  const amount = invoice.totalEnergyGenerated * 0.05;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-sm w-full mx-auto font-sans">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-800">
          Invoice from Voltaris Solar
        </h3>
      </div>

      {/* Large Amount */}
      <div className="mb-8">
        <h1 className="text-6xl font-extrabold tracking-tighter text-gray-900">
          {amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </h1>
      </div>

      {/* List Items */}
      <div className="space-y-6 mb-8">
        {/* Item 1: Energy Generation */}
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <div className="text-xl font-bold text-gray-900">
              {(amount / 2).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Due on {format(new Date(invoice.billingPeriodEnd), "d MMMM")}
            </div>
          </div>
          <div className="text-gray-300 text-xl font-light">|</div>
          <div>
            <div className="text-lg font-bold text-[#2E7D32]">
              Energy Generation
            </div>
            <div className="text-sm text-gray-400 mt-0.5">
              {invoice.totalEnergyGenerated.toFixed(1)} kWh used
            </div>
          </div>
        </div>

        {/* Item 2: Unit / Details */}
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0">
            <div className="text-xl font-bold text-gray-900">
              {(amount / 2).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <div className="text-xs text-gray-400 mt-1">Unit Fee</div>
          </div>
          <div className="text-gray-300 text-xl font-light">|</div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              Unit {invoice.solarUnitId?.serialNumber || "Unknown"}
            </div>
            <div className="text-sm text-gray-400 mt-0.5 capitalize">
              Status: {invoice.paymentStatus.toLowerCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      {invoice.paymentStatus === "PENDING" ? (
        <Button
          asChild
          className="w-full bg-[#D95D39] hover:bg-[#b04a2c] text-white text-lg font-medium py-6 rounded-xl shadow-none"
        >
          <Link to={`/dashboard/invoices/${invoice._id}/pay`}>+ Pay Now</Link>
        </Button>
      ) : (
        <div className="w-full bg-green-50 text-green-700 text-lg font-medium py-4 rounded-xl text-center border border-green-100">
          Paid on {format(new Date(invoice.paidAt), "PP")}
        </div>
      )}
    </div>
  );
}
