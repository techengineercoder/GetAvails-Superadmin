import baseApi from "@/redux/api/baseApi";


export const invitationReviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        getInvitationReview: builder.query({
            query: (params) => ({
                url: "/teams/review/memberships/",
                method: "GET",
                params,
            }),
            providesTags: ["InvitationReview"],
        }),

        invitationReviewDetails: builder.query({
            query: (id: string) => ({
                url: `/teams/review/memberships/${id}/`,
                method: "GET",
            }),
            providesTags: ["InvitationReview"],
        }),

        // /api/v1/teams/review/memberships/{membership_id}/

        invitationReviewStatusUpdate: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => ({
                url: `/teams/review/memberships/${id}/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["InvitationReview"],
        })

    }),
});

export const {
    useGetInvitationReviewQuery,
    useInvitationReviewStatusUpdateMutation,
    useInvitationReviewDetailsQuery,
} = invitationReviewApi;