"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuX,
  LuLoader,
} from "react-icons/lu";

type Article = {
  _id: string;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  imagePath?: string;
  createdAt: string;
  updatedAt: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    category: "Crop Management",
    content: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchArticles = async () => {
    try {
      setFetching(true);

      const response = await api.get("/api/articles");

      setArticles(response.data.articles || []);
      console.log("✅ Articles loaded:", response.data.articles?.length || 0);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch articles";

      console.error("❌ Failed to fetch articles:", errorMessage);
      alert(errorMessage);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);

    setFormData({
      title: "",
      category: "Crop Management",
      content: "",
    });

    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingArticle(null);

    setFormData({
      title: "",
      category: "Crop Management",
      content: "",
    });

    setImageFile(null);
    setImagePreview("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();
    const trimmedCategory = formData.category.trim();
    const trimmedContent = formData.content.trim();

    if (!trimmedTitle || !trimmedCategory || !trimmedContent) {
      alert("Title, category, and content cannot be empty.");
      return;
    }

    if (!editingArticle && !imageFile) {
      alert("Please select an article image for new articles.");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("title", trimmedTitle);
      submitData.append("category", trimmedCategory);
      submitData.append("content", trimmedContent);

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      console.log("📤 Sending article request:", {
        endpoint: editingArticle ? `PUT /api/articles/${editingArticle._id}` : "POST /api/articles",
        payload: {
          title: trimmedTitle,
          category: trimmedCategory,
          content: trimmedContent,
          hasImage: !!imageFile,
          imageFileName: imageFile?.name,
        },
      });

      const response = editingArticle
        ? await api.put(`/api/articles/${editingArticle._id}`, submitData)
        : await api.post("/api/articles", submitData);

      console.log("✅ Article saved successfully:", response.data);

      await fetchArticles();
      closeModal();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save article";

      console.error("❌ Article save failed:", {
        status: error.response?.status,
        message: errorMessage,
        fullError: error.response?.data,
      });

      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);

    setFormData({
      title: article.title,
      category: article.category,
      content: article.content,
    });

    setImageFile(null);
    setImagePreview(article.imageUrl || "");
    setShowModal(true);
  };

  const handleDelete = async (articleId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this article?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/articles/${articleId}`);

      console.log("✅ Article deleted successfully");
      setArticles((prev) => prev.filter((article) => article._id !== articleId));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete article";

      console.error("❌ Failed to delete article:", errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4">
        <LuLoader className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Loading articles data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-0 pb-28">
      <div className="flex h-[560px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center ml-4 gap-3 min-w-fit">
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-slate-900">KNOWLEDGE ARTICLES</h2>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                {articles.length} ARTICLES
                <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:flex flex-col flex-1 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-[35%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Title
                  </th>
                  <th className="w-[20%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Category
                  </th>
                  <th className="w-[25%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Last Updated
                  </th>
                  <th className="w-[20%] py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id} className="border-b border-slate-100 hover:bg-slate-50 h-16">
                    <td className="w-[35%] py-4 px-4">
                      <div className="flex items-center gap-3">
                        {article.imageUrl ? (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-black text-blue-700">
                            IMG
                          </div>
                        )}
                        <p className="truncate text-sm font-bold text-slate-900">
                          {article.title}
                        </p>
                      </div>
                    </td>
                    <td className="w-[20%] py-4 px-4 text-sm font-medium text-slate-600">
                      {article.category}
                    </td>
                    <td className="w-[25%] py-4 px-4 text-sm text-slate-600">
                      {new Date(article.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="w-[20%] py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100"
                          title="Edit Article"
                        >
                          <LuPencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                          title="Delete Article"
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {articles.map((article) => (
            <div key={article._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{article.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-block rounded-full px-2 py-1 text-xs font-bold whitespace-nowrap bg-blue-100 text-blue-700">
                  {article.category}
                </span>
              </div>
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="mb-3 h-32 w-full rounded-lg object-cover"
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="flex-1 rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(article._id)}
                  className="flex-1 rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <p className="text-sm">No articles found</p>
          </div>
        )}
      </div>

      {/* Fixed Floating Action Button */}
      <button
        onClick={openCreateModal}
        className="fixed bottom-8 right-8 z-40 flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-white text-sm font-bold shadow-xl hover:bg-blue-700 transition-colors"
      >
        <LuPlus className="h-5 w-5" />
        <span>Create Article</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-[2rem] bg-white shadow-lg flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white p-6 flex-shrink-0">
              <h2 className="text-lg font-black text-slate-900">
                {editingArticle ? "Edit Article" : "Create Article"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col p-6 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Article Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Best Practices for Crop Management"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Crop Management</option>
                    <option>Pest Control</option>
                    <option>Disease Control</option>
                    <option>Organic Farming</option>
                    <option>Soil Health</option>
                    <option>Weather</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Article Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Article preview"
                        className="h-40 w-full rounded-2xl object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Content *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write article content..."
                    rows={8}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/30 flex-shrink-0 justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 min-w-fit"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-2xl bg-blue-600 px-8 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-fit"
              >
                {loading ? "Saving..." : editingArticle ? "Update Article" : "Publish Article"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}