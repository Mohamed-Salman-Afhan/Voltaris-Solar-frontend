import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : "http://localhost:8000/api";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: async (headers) => {
      const clerk = window.Clerk;
      if (clerk) {
        const token = await clerk.session.getToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Anomalies", "SolarUnits", "Invoices"],
  endpoints: (build) => ({
    getEnergyGenerationRecordsBySolarUnit: build.query({
      query: ({ id, groupBy, limit }) =>
        `/energy-generation-records/solar-unit/${id}?groupBy=${groupBy}&limit=${limit}`,
    }),
    getSolarUnitForUser: build.query({
      query: () => `/solar-units/me`,
    }),
    getSolarUnits: build.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/solar-units?page=${page}&limit=${limit}`,
      providesTags: ["SolarUnits"],
    }),
    getSolarUnitById: build.query({
      query: (id) => `/solar-units/${id}`,
      providesTags: (result, error, id) => [{ type: "SolarUnits", id }],
    }),
    createSolarUnit: build.mutation({
      query: (data) => ({
        url: `/solar-units`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SolarUnits"],
    }),
    editSolarUnit: build.mutation({
      query: ({ id, data }) => ({
        url: `/solar-units/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "SolarUnits",
        { type: "SolarUnits", id },
      ],
    }),
    deleteSolarUnit: build.mutation({
      query: (id) => ({
        url: `/solar-units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SolarUnits"],
    }),
    getAllUsers: build.query({
      query: () => `/users`,
    }),
    getWeather: build.query({
      query: (solarUnitId) => `/weather/${solarUnitId}`,
    }),
    getCapacityFactor: build.query({
      query: ({ solarUnitId, days }) =>
        `/capacity-factor/${solarUnitId}?days=${days}`,
    }),
    getAnomalies: build.query({
      query: ({ unitId, status, severity }) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (severity) params.append("severity", severity);
        return `/anomalies/unit/${unitId}?${params.toString()}`;
      },
      providesTags: ["Anomalies"],
    }),
    updateAnomaly: build.mutation({
      query: ({ anomalyId, status, resolutionNotes }) => ({
        url: `/anomalies/${anomalyId}`,
        method: "PATCH",
        body: { status, resolutionNotes },
      }),
      invalidatesTags: ["Anomalies"],
    }),
    getAdminAnomalies: build.query({
      query: (params) => {
        const qs = new URLSearchParams(params).toString();
        return `/anomalies/admin?${qs}`;
      },
      providesTags: ["Anomalies"],
    }),
    getInvoices: build.query({
      query: () => "/invoices",
      providesTags: ["Invoices"],
    }),
    getInvoiceById: build.query({
      query: (id) => `/invoices/${id}`,
      providesTags: (result, error, id) => [{ type: "Invoices", id }],
    }),
    createPaymentSession: build.mutation({
      query: (data) => ({
        url: "/payments/create-checkout-session",
        method: "POST",
        body: data,
      }),
    }),
    getSessionStatus: build.query({
      query: (sessionId) => `/payments/session-status?session_id=${sessionId}`,
    }),
    getAnalyticsDashboard: build.query({
      query: ({ solarUnitId, days }) =>
        `/analytics/${solarUnitId}?days=${days || 30}`,
    }),
    getAdminInvoices: build.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/admin/invoices?${queryString}`;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllUsersQuery,
  useGetEnergyGenerationRecordsBySolarUnitQuery,
  useGetSolarUnitForUserQuery,
  useGetSolarUnitsQuery,
  useGetSolarUnitByIdQuery,
  useCreateSolarUnitMutation,
  useEditSolarUnitMutation,
  useGetWeatherQuery,
  useGetCapacityFactorQuery,
  useGetAnomaliesQuery,
  useUpdateAnomalyMutation,
  useGetAdminAnomaliesQuery,
  useDeleteSolarUnitMutation,
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreatePaymentSessionMutation,
  useGetSessionStatusQuery,
  useGetAnalyticsDashboardQuery,
  useGetAdminInvoicesQuery,
} = api;
