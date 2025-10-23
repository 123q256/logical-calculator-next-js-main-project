import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonBaseQueryWithoutToken } from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: commonBaseQueryWithoutToken,
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: (searchParams) => ({
        url: `/blog?${searchParams}`,
        method: "GET",
      }),
    }),
    getSingleBlogByUrl: builder.query({
      query: (url) => ({
        url: `/blog/${url}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllBlogsQuery, useGetSingleBlogByUrlQuery } = blogApi;
