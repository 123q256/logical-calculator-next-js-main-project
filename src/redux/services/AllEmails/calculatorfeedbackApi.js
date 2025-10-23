import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonBaseQueryWithoutToken } from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const calculatorfeedbackApi = createApi({
  reducerPath: "calculatorfeedbackApi",
  baseQuery: commonBaseQueryWithoutToken,
  endpoints: (builder) => ({
    createcalculatorFeedbackEmail: builder.mutation({
      query: (data) => ({
        url: `/calculatorfeedback/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreatecalculatorFeedbackEmailMutation } = calculatorfeedbackApi;



