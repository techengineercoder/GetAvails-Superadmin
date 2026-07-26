import baseApi from "../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => {
        return {
          url: '/auth/register/',
          method: "POST",
          body: data,
        };
      },
    }),

    resendOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/register/resend/",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/password-reset/request/",
        method: "POST",
        body: data,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/password-reset/verify/",
        method: "POST",
        body: data,
      }),
    }),

    // /auth/refresh/
    refreshAccessToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh/",
        method: "POST",
        body: {
          refresh: localStorage.getItem("refresh_token"),
        },
      }),
      invalidatesTags: ["User"],
    }),

    verifyOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/password-reset/verify/",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, ...data }) => {
        return {
          url: "/auth/password-reset/confirm/",
          method: "POST",
          body: data,
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : undefined,
        };
      },
    }),

    googleLogin: builder.mutation({
      query: (data) => ({
        url: "/auth/google/",
        method: "POST",
        body: data,
      }),
    }),

    facebookLogin: builder.mutation({
      query: ({ accessToken }) => ({
        url: "/auth/login/facebook",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useResendOTPMutation,
  useLoginMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
  useFacebookLoginMutation,
} = authApi;