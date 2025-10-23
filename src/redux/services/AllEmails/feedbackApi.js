import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonBaseQueryWithoutToken } from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: commonBaseQueryWithoutToken,
  endpoints: (builder) => ({
    createfeedbackEmail: builder.mutation({
      query: (data) => ({
        url: `/feedback/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreatefeedbackEmailMutation } = feedbackApi;
