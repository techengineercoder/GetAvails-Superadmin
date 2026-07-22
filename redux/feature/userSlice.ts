import baseApi from "@/redux/api/baseApi";


export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => ({
                url: "/auth/me/",
                method: "GET",
            }),
            providesTags: ["User"],
        }),

        updateUser: builder.mutation({
            query: (userData) => ({
                url: "/auth/me/",
                method: "PATCH",
                body: userData,
            }),
            invalidatesTags: ["User"],
        }),
        // /admin/get-all-admins
        getAllAdmins: builder.query({
            query: () => ({
                url: "/admin/get-all-admins",
                method: "GET",
            }),
            providesTags: ["User"],
        }),

    }),
});

export const {
    useGetUsersQuery,
    useUpdateUserMutation,
    useGetAllAdminsQuery,
} = userApi;