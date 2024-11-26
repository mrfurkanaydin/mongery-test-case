import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
  endpoints: (builder) => ({
    calculateProfit: builder.mutation({
      query: (data) => ({
        url: "/profit-calculation",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCalculateProfitMutation } = apiSlice;
