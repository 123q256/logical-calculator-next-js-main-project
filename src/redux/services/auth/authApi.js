import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { commonBaseQueryWithoutToken } from "../../../utils/api";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: commonBaseQueryWithoutToken,
  endpoints: (builder) => ({
    registerNewUser: builder.mutation({
      query: (data) => ({
        url: `/auth/register`,
        method: "POST",
        body: data,
      }),
    }),
    verifyUserOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/otp-verify`,
        method: "POST",
        body: data,
      }),
    }),
    verifyOtpResetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/otp-reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: "POST",
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterNewUserMutation,
  useVerifyUserOtpMutation,
  useLoginUserMutation,
  useForgetPasswordMutation,
  useChangePasswordMutation,
  useVerifyOtpResetPasswordMutation,
} = authApi;
