import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL, // Use the local development URL here
  credentials: "include",

  prepareHeaders: (headers, { endpoint }) => {
    const token =
      (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null) ||
      getCookie("token") ||
      getCookie("accessToken");

    // Endpoints that do not require an authorization token
    const noAuthEndpoints = [
      "login",
      "register",
      "resendOTP",
      "forgotPassword",
      "verifyEmail",
      "verifyOTP",
      "resetPassword",
      "googleLogin",
      "facebookLogin",
      "refreshAccessToken",
    ];

    if (token && !noAuthEndpoints.includes(endpoint as string)) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const data = result.error.data as any;

    // Check if the error matches the token_not_valid structure
    if (data?.error?.code === "token_not_valid" || data?.error?.details?.code === "token_not_valid") {
      // Remove token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }

      // Remove token from cookies (matching authService token cookie)
      if (typeof document !== "undefined") {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }

      // Optionally redirect to login page
      // window.location.href = '/login';
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: [
    "User",
    "InvitationReview",
    "Blog",
  ],
  endpoints: () => ({}),
});

export default baseApi;