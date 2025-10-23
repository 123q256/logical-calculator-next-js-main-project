import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie, removeCookie, setCookie } from "./cookieFunction";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getCookie("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    const refreshToken = getCookie("refresh_token");

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        setCookie("access_token", refreshResult.data.payload.access_token);
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.error("Failed to refresh token.");
        removeCookie("access_token");
        removeCookie("refresh_token");
        removeCookie("user_type");
      }
    }
  }

  return result;
};

export default baseQueryWithReauth;

export const commonBaseQueryWithoutToken = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
});

export const datetimeBaseQueryWithoutToken = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL_DATE,
});
