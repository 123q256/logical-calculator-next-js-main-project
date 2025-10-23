import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonBaseQueryWithoutToken } from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const userresponseApi = createApi({
  reducerPath: "userresponseApi",
  baseQuery: commonBaseQueryWithoutToken,
  endpoints: (builder) => ({
    createuserresponse: builder.mutation({
      query: (data) => ({
        url: `/userresponse/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});
 
export const { useCreateuserresponseMutation } = userresponseApi;
