"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function TrashIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function EditIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function PlusIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

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

  return (
    <div className="min-h-[calc(100vh-96px)] bg-slate-50 px-6 py-8 lg:p-0">
      <div className="mx-auto max-w-[1280px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-11 pb-6 pt-8">
            <div className="mb-9">
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                Articles
              </h2>

              <p className="mt-1 text-sm font-semibold uppercase text-slate-500">
                {articles.length} Articles <span className="text-green-500">●</span>
              </p>
            </div>

            <div className="hidden md:block">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="w-[38%] px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Title
                    </th>

                    <th className="w-[24%] px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="w-[22%] px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Last Updated
                    </th>

                    <th className="w-[16%] px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {fetching && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-12 text-center text-sm font-semibold text-slate-500"
                      >
                        Loading articles...
                      </td>
                    </tr>
                  )}

                  {!fetching &&
                    articles.map((article) => (
                      <tr key={article._id} className="border-b border-slate-100">
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-4">
                            {article.imageUrl ? (
                              <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="h-12 w-12 shrink-0 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-700">
                                IMG
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-slate-950">
                                {article.title}
                              </p>

                              <p className="mt-1 truncate text-sm font-medium text-slate-500">
                                {article.content}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-5 text-sm font-medium text-slate-700">
                          {article.category}
                        </td>

                        <td className="px-4 py-5 text-sm font-medium text-slate-700">
                          {new Date(article.updatedAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(article)}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                              title="Edit Article"
                            >
                              <EditIcon />
                            </button>

                            <button
                              onClick={() => handleDelete(article._id)}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                              title="Delete Article"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {!fetching && articles.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-12 text-center text-sm font-medium text-slate-500"
                      >
                        No articles available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 md:hidden">
              {fetching && (
                <div className="rounded-2xl border border-slate-200 p-6 text-center text-sm font-semibold text-slate-500">
                  Loading articles...
                </div>
              )}

              {!fetching &&
                articles.map((article) => (
                  <div
                    key={article._id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="mb-4 h-44 w-full rounded-2xl object-cover"
                      />
                    )}

                    <p className="font-black text-slate-900">{article.title}</p>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {article.content}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-600">
                        {article.category}
                      </span>

                      <span className="text-slate-500">
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-2 text-xs font-bold text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(article._id)}
                        className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

              {!fetching && articles.length === 0 && (
                <div className="rounded-2xl border border-slate-200 p-6 text-center text-sm font-medium text-slate-500">
                  No articles available.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 px-7 py-6">
            <button
              onClick={openCreateModal}
              className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 text-base font-black text-white shadow-lg shadow-blue-100 hover:bg-blue-700"
            >
              <PlusIcon className="h-6 w-6" />
              Create Article
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {editingArticle ? "Edit Article" : "Create Article"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add article title, category, image and content.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Article Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter article title"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Category
                </label>

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
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Article Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-blue-700 hover:file:bg-blue-100"
                />

                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Article preview"
                      className="h-56 w-full rounded-2xl object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Content
                </label>

                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write article content..."
                  rows={7}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {loading
                    ? "Saving..."
                    : editingArticle
                    ? "Update Article"
                    : "Publish Article"}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}