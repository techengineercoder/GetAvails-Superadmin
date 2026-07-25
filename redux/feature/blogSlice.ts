import baseApi from "@/redux/api/baseApi";


export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /blog/categories/
        createCategory: builder.mutation({
            query: (data) => ({
                url: "/blog/categories/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),
        //         {
        //   "name": "string"
        // }

        // /blog/categories/
        getAllCategory: builder.query({
            query: () => ({
                url: "/blog/categories/",
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),

        // /blog/categories/33/
        updateCategory: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => ({
                url: `/blog/categories/${id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),

        // /blog/categories/33/
        deleteCategory: builder.mutation({
            query: (id: string) => ({
                url: `/blog/categories/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),

        // /blog/posts/
        createBlog: builder.mutation({
            query: (data) => ({
                url: "/blog/posts/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),
        // /blog/posts/
        getAllBlog: builder.query({
            query: () => ({
                url: "/blog/posts/",
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),

        // /blog/posts/50/
        getBlogById: builder.query({
            query: (id: string) => ({
                url: `/blog/posts/${id}/`,
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),
        // /blog/posts/50/
        updateBlog: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => ({
                url: `/blog/posts/${id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),
        // /blog/posts/50/
        deleteBlog: builder.mutation({
            query: (id: string) => ({
                url: `/blog/posts/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),

    }),
});

export const {
    useCreateCategoryMutation,
    useGetAllCategoryQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useCreateBlogMutation,
    useGetAllBlogQuery,
    useGetBlogByIdQuery,
    useUpdateBlogMutation,
    useDeleteBlogMutation,

} = blogApi;