"use client";

import React, { useState } from "react";
import {
  useCreateBlogMutation,
  useCreateCategoryMutation,
  useDeleteBlogMutation,
  useDeleteCategoryMutation,
  useGetAllBlogQuery,
  useGetAllCategoryQuery,
  useUpdateBlogMutation,
  useUpdateCategoryMutation,
} from "@/redux/feature/blogSlice";
import {
  Plus,
  Pencil,
  Trash2,
  FolderPlus,
  Search,
  Eye,
  Image as ImageIcon,
  X,
  FileText,
  BookOpen,
  Calendar,
  Layers,
  User,
  Globe,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

// Import Modular Components
import StatsPanel from "@/components/dashboard/blog/StatsPanel";
import CategoryModal from "@/components/dashboard/blog/CategoryModal";
import BlogModal from "@/components/dashboard/blog/BlogModal";
import BlogPreviewModal from "@/components/dashboard/blog/BlogPreviewModal";
import DeleteConfirmModal from "@/components/dashboard/blog/DeleteConfirmModal";

export default function BlogManagementPage() {
  const [activeTab, setActiveTab] = useState<"blogs" | "categories">("blogs");
  const [blogSearch, setBlogSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // API Queries & Mutations
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoryQuery(undefined);
  const { data: blogsData, isLoading: isBlogsLoading } = useGetAllBlogQuery(undefined);

  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation();

  const [createBlog, { isLoading: isCreatingBlog }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdatingBlog }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeletingBlog }] = useDeleteBlogMutation();

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<"create" | "edit">("create");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");

  // Blog Modal State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogModalMode, setBlogModalMode] = useState<"create" | "edit">("create");
  const [editingBlog, setEditingBlog] = useState<any>(null);
  
  // Blog Form Fields
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState<number | "">("");
  const [blogIsPublished, setBlogIsPublished] = useState(true);
  
  // Image handling via File object and object URLs
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // View Blog Details Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingBlog, setViewingBlog] = useState<any>(null);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"blog" | "category">("blog");
  const [deleteTargetId, setDeleteTargetId] = useState<string>("");
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");

  // Open Category Modal
  const openCategoryModal = (mode: "create" | "edit", category?: any) => {
    setCategoryModalMode(mode);
    if (mode === "edit" && category) {
      setEditingCategory(category);
      setCategoryNameInput(category.name);
    } else {
      setEditingCategory(null);
      setCategoryNameInput("");
    }
    setIsCategoryModalOpen(true);
  };

  // Handle Category Submit
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (categoryModalMode === "create") {
        await createCategory({ name: categoryNameInput }).unwrap();
        toast.success("Category created successfully");
      } else {
        await updateCategory({
          id: editingCategory.slug,
          data: { name: categoryNameInput },
        }).unwrap();
        toast.success("Category updated successfully");
      }
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.error?.message || "Failed to save category");
    }
  };

  // Open Blog Modal
  const openBlogModal = (mode: "create" | "edit", blog?: any) => {
    setBlogModalMode(mode);
    setImageFile(null);
    if (mode === "edit" && blog) {
      setEditingBlog(blog);
      setBlogTitle(blog.title);
      setBlogContent(blog.content || "");
      setBlogCategory(blog.category);
      setBlogIsPublished(blog.is_published);
      setImagePreview(blog.image || null);
    } else {
      setEditingBlog(null);
      setBlogTitle("");
      setBlogContent("");
      setBlogCategory("");
      setBlogIsPublished(true);
      setImagePreview(null);
    }
    setIsBlogModalOpen(true);
  };

  // Handle Blog Submit via FormData
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) {
      toast.error("Blog title is required");
      return;
    }
    if (blogCategory === "") {
      toast.error("Category is required");
      return;
    }
    if (!blogContent || blogContent === "<br>" || blogContent === "<div><br></div>") {
      toast.error("Blog content is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", blogTitle);
    formData.append("content", blogContent);
    formData.append("category", String(blogCategory));
    formData.append("is_published", String(blogIsPublished));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (blogModalMode === "create") {
        await createBlog(formData).unwrap();
        toast.success("Blog post created successfully!");
      } else {
        await updateBlog({
          id: editingBlog.slug,
          data: formData,
        }).unwrap();
        toast.success("Blog post updated successfully!");
      }
      setIsBlogModalOpen(false);
    } catch (err: any) {
      const errorMsg = err?.data?.error?.message || err?.data?.message || "Failed to save blog post";
      if (err?.data?.error?.details?.image) {
        toast.error(`Image error: ${err.data.error.details.image.join(", ")}`);
      } else {
        toast.error(errorMsg);
      }
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (type: "blog" | "category", id: string, name: string) => {
    setDeleteType(type);
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setIsDeleteModalOpen(true);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    try {
      if (deleteType === "blog") {
        await deleteBlog(deleteTargetId).unwrap();
        toast.success("Blog post deleted successfully");
      } else {
        await deleteCategory(deleteTargetId).unwrap();
        toast.success("Category deleted successfully");
      }
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.error?.message || `Failed to delete ${deleteType}`);
    }
  };

  // Format Date Helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stripHtml = (htmlString: string) => {
    if (!htmlString) return "";
    let cleanText = htmlString.replace(/<[^>]*>/g, "");
    cleanText = cleanText
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return cleanText;
  };

  // Filter categories and blogs based on search query
  const categoriesList = categoriesData?.results || [];
  const filteredCategories = categoriesList.filter((cat: any) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const getFullImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    try {
      const origin = new URL(baseUrl).origin;
      const cleanRelative = url.startsWith("/") ? url : `/${url}`;
      return `${origin}${cleanRelative}`;
    } catch (e) {
      const cleanRelative = url.startsWith("/") ? url : `/${url}`;
      return `${baseUrl}${cleanRelative}`;
    }
  };

  const blogsList = (blogsData?.results || []).map((blog: any) => ({
    ...blog,
    image: blog.image ? getFullImageUrl(blog.image) : null,
  }));

  const filteredBlogs = blogsList.filter((blog: any) =>
    blog.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
    blog.content.toLowerCase().includes(blogSearch.toLowerCase())
  );

  // Compute Dashboard Stats
  const totalBlogs = blogsList.length;
  const publishedBlogs = blogsList.filter((b: any) => b.is_published).length;
  const draftBlogs = totalBlogs - publishedBlogs;
  const totalCategories = categoriesList.length;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Title Banner matching Verification Center */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-cyan-400" />
            Blog Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Write blog posts, manage content tags, categories, and keep track of publication statistics.
          </p>
        </div>
        
        {/* Action Button styled as Verification Center Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {activeTab === "blogs" ? (
            <button
              onClick={() => openBlogModal("create")}
              className="flex items-center gap-2 px-3.5 py-2 bg-cyan-950/50 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-900/40 shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all font-semibold text-xs rounded-lg cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              New Blog Post
            </button>
          ) : (
            <button
              onClick={() => openCategoryModal("create")}
              className="flex items-center gap-2 px-3.5 py-2 bg-cyan-950/50 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-900/40 shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all font-semibold text-xs rounded-lg cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              Add Category
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Statistics Panel Component */}
      <StatsPanel
        totalBlogs={totalBlogs}
        publishedBlogs={publishedBlogs}
        draftBlogs={draftBlogs}
        totalCategories={totalCategories}
        isLoading={isBlogsLoading || isCategoriesLoading}
      />

      {/* Filter Tabs & Search Row (Exact Clone of Verification Center Layout) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#1a1d24] pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all shrink-0 cursor-pointer ${
              activeTab === "blogs"
                ? "bg-cyan-950/50 text-cyan-400 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                : "bg-[#0d0f12] text-gray-400 border-[#1e2229] hover:bg-[#12151a] hover:text-gray-200"
            }`}
          >
            <span>Blog Posts</span>
            <span className={`px-1.5 py-0.2 text-[9px] font-bold font-mono rounded ${
              activeTab === "blogs" ? "bg-cyan-500/20 text-cyan-300" : "bg-gray-800 text-gray-400"
            }`}>
              {totalBlogs}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all shrink-0 cursor-pointer ${
              activeTab === "categories"
                ? "bg-cyan-950/50 text-cyan-400 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                : "bg-[#0d0f12] text-gray-400 border-[#1e2229] hover:bg-[#12151a] hover:text-gray-200"
            }`}
          >
            <span>Categories</span>
            <span className={`px-1.5 py-0.2 text-[9px] font-bold font-mono rounded ${
              activeTab === "categories" ? "bg-cyan-500/20 text-cyan-300" : "bg-gray-800 text-gray-400"
            }`}>
              {totalCategories}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder={activeTab === "blogs" ? "Search posts..." : "Search categories..."}
            value={activeTab === "blogs" ? blogSearch : categorySearch}
            onChange={(e) => activeTab === "blogs" ? setBlogSearch(e.target.value) : setCategorySearch(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-xs bg-[#0d0f12] text-gray-200 placeholder-gray-500 rounded-xl border border-[#1e2229] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          {(activeTab === "blogs" ? blogSearch : categorySearch) && (
            <button
              onClick={() => activeTab === "blogs" ? setBlogSearch("") : setCategorySearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "blogs" && (
        <div className="space-y-6">
          {/* Blogs Loader */}
          {isBlogsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-5 bg-[#0c0e12]/60 rounded-2xl border border-[#1e2229]/60 animate-pulse space-y-4 h-80" />
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-16 text-center bg-[#0d0f12]/60 rounded-2xl border border-[#1e2229] space-y-3 max-w-xl mx-auto my-12">
              <FileText className="w-12 h-12 text-gray-500 mx-auto" />
              <h3 className="text-base font-bold text-gray-300">No blog posts found</h3>
              <p className="text-xs text-gray-500">No items match your query. Add a blog post to display it here.</p>
            </div>
          ) : (
            /* Styled Blog Posts Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBlogs.map((blog: any) => (
                <div
                  key={blog.id}
                  onClick={() => {
                    setViewingBlog(blog);
                    setIsViewModalOpen(true);
                  }}
                  className="group flex flex-col justify-between p-5 bg-[#0c0e12] border border-[#1e2229] hover:border-cyan-500/40 rounded-2xl shadow-md transition-all hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(6,182,212,0.06)] cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Header Cover Image */}
                    <div className="relative aspect-video bg-[#11141c] border border-[#1e2229] rounded-xl overflow-hidden">
                      {blog.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-1.5">
                          <ImageIcon className="w-8 h-8" />
                          <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500">No Image</span>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <span
                        className={`absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border backdrop-blur-md ${
                          blog.is_published
                            ? "bg-emerald-950/60 border-emerald-550/20 text-emerald-400"
                            : "bg-amber-950/60 border-amber-550/20 text-amber-400"
                        }`}
                      >
                        {blog.is_published ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                          {blog.category_detail?.name || "Uncategorized"}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">
                        {stripHtml(blog.content)}
                      </p>
                    </div>
                  </div>

                  {/* Footer Toolbar */}
                  <div className="pt-4 mt-4 border-t border-[#1a1d24] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-semibold text-gray-300 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-cyan-400" /> {blog.author || "Admin"}
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-600" /> {formatDate(blog.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openBlogModal("edit", blog)}
                        className="p-1.5 bg-[#12151f] hover:bg-[#1a1e26] border border-[#222733] text-gray-400 hover:text-cyan-400 rounded-lg transition-colors cursor-pointer"
                        title="Edit Post"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal("blog", blog.slug, blog.title)}
                        className="p-1.5 bg-[#12151f] hover:bg-[#1a1e26] border border-[#222733] text-gray-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab Content */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          {/* Categories Loader */}
          {isCategoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-[#0c0e12] border border-[#12151c] rounded-2xl h-36 animate-pulse" />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-16 text-center bg-[#0d0f12]/60 rounded-2xl border border-[#1e2229] space-y-3 max-w-xl mx-auto my-12">
              <Layers className="w-12 h-12 text-gray-550 mx-auto" />
              <h3 className="text-base font-bold text-gray-300">No categories found</h3>
              <p className="text-xs text-gray-500">Organize your blog posts by adding category tags.</p>
            </div>
          ) : (
            /* Flat Category Card Layout aligned with grid design instructions */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((cat: any) => (
                <div
                  key={cat.id}
                  className="group bg-[#0c0e12] border border-[#1e2229] hover:border-cyan-500/40 p-5 rounded-2xl flex flex-col justify-between gap-4 shadow-sm hover:shadow-[0_0_25px_rgba(6,182,212,0.06)] hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded-lg">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wider">
                        Slug: {cat.slug}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-[#1a1d24] flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-mono">
                      Added: {formatDate(cat.created_at)}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openCategoryModal("edit", cat)}
                        className="p-1.5 bg-[#12151f] hover:bg-[#1a1e26] border border-[#222733] text-gray-400 hover:text-cyan-400 rounded-lg transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal("category", cat.slug, cat.name)}
                        className="p-1.5 bg-[#12151f] hover:bg-[#1a1e26] border border-[#222733] text-gray-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- MODALS SECTION --- */}

      {/* 1. Category Modal (Create/Edit) */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        mode={categoryModalMode}
        categoryName={categoryNameInput}
        setCategoryName={setCategoryNameInput}
        isLoading={isCreatingCategory || isUpdatingCategory}
      />

      {/* 2. Blog Modal (Create/Edit) */}
      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        onSubmit={handleBlogSubmit}
        mode={blogModalMode}
        categoriesList={categoriesList}
        blogTitle={blogTitle}
        setBlogTitle={setBlogTitle}
        blogContent={blogContent}
        setBlogContent={setBlogContent}
        blogCategory={blogCategory}
        setBlogCategory={setBlogCategory}
        blogIsPublished={blogIsPublished}
        setBlogIsPublished={setBlogIsPublished}
        imageFile={imageFile}
        setImageFile={setImageFile}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        isLoading={isCreatingBlog || isUpdatingBlog}
      />

      {/* 3. Read Blog Details Modal */}
      <BlogPreviewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        blog={viewingBlog}
      />

      {/* 4. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        targetName={deleteTargetName}
        type={deleteType}
        isLoading={isDeletingBlog || isDeletingCategory}
      />

    </div>
  );
}
