import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8000/api";

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
  tagTypes: ["Anomalies"],
  endpoints: (build) => ({
    getEnergyGenerationRecordsBySolarUnit: build.query({
      query: ({ id, groupBy, limit }) =>
        `/energy-generation-records/solar-unit/${id}?groupBy=${groupBy}&limit=${limit}`,
    }),
    getSolarUnitForUser: build.query({
      query: () => `/solar-units/me`,
    }),
    getSolarUnits: build.query({
      query: () => `/solar-units`,
    }),
    getSolarUnitById: build.query({
      query: (id) => `/solar-units/${id}`,
    }),
    createSolarUnit: build.mutation({
      query: (data) => ({
        url: `/solar-units`,
        method: "POST",
        body: data,
      }),
    }),
    editSolarUnit: build.mutation({
      query: ({ id, data }) => ({
        url: `/solar-units/${id}`,
        method: "PUT",
        body: data,
      }),
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
} = api;
