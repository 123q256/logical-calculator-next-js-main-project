import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonBaseQueryWithoutToken } from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: commonBaseQueryWithoutToken,
  endpoints: (builder) => ({
    getSingleCategoryByCategoryName: builder.query({
      query: (category_name) => ({
        url: `/${category_name}`,
        method: "GET",
      }),
    }),
    getAllCategoryCalculator: builder.query({
      query: () => ({
        url: `/category/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetSingleCategoryByCategoryNameQuery,
  useGetAllCategoryCalculatorQuery,
} = categoryApi;
