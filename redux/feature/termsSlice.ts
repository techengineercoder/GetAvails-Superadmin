import baseApi from "@/redux/api/baseApi";


export const termsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        // /pages/
        getAllTerms: builder.query({
            query: () => ({
                url: "/pages/",
                method: "GET",
            }),
            providesTags: ["Terms"],
        }),



        // /pages/{slug}/
        deleteTerms: builder.mutation({
            query: (slug: string) => ({
                url: `/pages/${slug}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Terms"],
        }),



        // /pages/{slug}/
        updateTerms: builder.mutation({
            query: ({ slug, data }: { slug: string, data: any }) => ({
                url: `/pages/${slug}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Terms"],
        }),



        // /pages/{slug}/
        patchTerms: builder.mutation({
            query: ({ slug, data }: { slug: string, data: any }) => ({
                url: `/pages/${slug}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Terms"],
        }),



        // /pages/{slug}/
        getTermsById: builder.query({
            query: (slug: string) => ({
                url: `/pages/${slug}/`,
                method: "GET",
            }),
            providesTags: ["Terms"],
        }),


    }),
});

export const {

    useGetAllTermsQuery,
    useDeleteTermsMutation,
    useUpdateTermsMutation,
    usePatchTermsMutation,
    useGetTermsByIdQuery,

} = termsApi;