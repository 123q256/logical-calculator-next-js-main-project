import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonBaseQueryWithoutToken } from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const converterApi = createApi({
  reducerPath: "converterApi",
  baseQuery: commonBaseQueryWithoutToken,
  endpoints: (builder) => ({
    getSingleConverterData: builder.mutation({
      query: (data) => ({
        url: "/calculator_detail/converter",
        method: "POST",
        body: data,
      }),
    }),
    getSearchSubConverter: builder.query({
        query: (search) => ({
          url: `/calculator_detail/sub-converter?q=${search}`,
          method: "GET",
        }),
      }),
    getAllConverter: builder.query({
        query: () => ({
          url: `/calculator_detail/converter`,
          method: "GET",
        }),
      }),
  }),
});

export const { useGetSearchSubConverterQuery, useGetAllConverterQuery, useGetSingleConverterDataMutation } = converterApi;