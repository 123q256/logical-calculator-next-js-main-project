import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonBaseQueryWithoutToken } from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: commonBaseQueryWithoutToken,
  endpoints: (builder) => ({
    createContactEmail: builder.mutation({
      query: (data) => ({
        url: `/contact/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateContactEmailMutation } = contactApi;
