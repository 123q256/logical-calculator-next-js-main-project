import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const authTokenApi = createApi({
  reducerPath: "authTokenApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `/auth/update-profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `/auth/profile`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } =
  authTokenApi;
