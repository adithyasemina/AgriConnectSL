"use client";

import { useState } from "react";

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

type Article = {
  id: number;
  title: string;
  category: string;
  description: string;
  content: string;
  status: "Published" | "Draft";
  lastUpdated: string;
};

const sampleArticles: Article[] = [
  {
    id: 1,
    title: "Nitrogen Management in Paddy Fields",
    category: "Crop Management",
    description: "Best practices for nitrogen application in paddy cultivation.",
    content: "Nitrogen is a critical nutrient for paddy cultivation...",
    status: "Published",
    lastUpdated: "2024-01-20",
  },
  {
    id: 2,
    title: "Pest Management: Fall Armyworm",
    category: "Pest Control",
    description: "Strategies to control fall armyworm in maize and other crops.",
    content: "Fall armyworm is a destructive pest that...",
    status: "Published",
    lastUpdated: "2024-01-18",
  },
  {
    id: 3,
    title: "Organic Farming Introduction",
    category: "Organic Farming",
    description: "Getting started with organic farming practices.",
    content: "Organic farming is an agricultural approach...",
    status: "Published",
    lastUpdated: "2024-01-15",
  },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(sampleArticles);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Crop Management",
    description: "",
    content: "",
    status: "Published" as "Published" | "Draft",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.content) {
      return;
    }

    if (editingId) {
      setArticles(
        articles.map((article) =>
          article.id === editingId
            ? {
                ...article,
                ...formData,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : article
        )
      );
      setEditingId(null);
    } else {
      const newArticle: Article = {
        id: Math.max(...articles.map((a) => a.id), 0) + 1,
        ...formData,
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setArticles([newArticle, ...articles]);
    }

    setFormData({
      title: "",
      category: "Crop Management",
      description: "",
      content: "",
      status: "Published",
    });
    setShowForm(false);
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      category: article.category,
      description: article.description,
      content: article.content,
      status: article.status,
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setArticles(articles.filter((article) => article.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: "",
      category: "Crop Management",
      description: "",
      content: "",
      status: "Published",
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700"
          >
            <PlusIcon />
            New Article
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-black text-slate-900">
            {editingId ? "Edit Article" : "Create New Article"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Article title..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
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
                  <option>Organic Farming</option>
                  <option>Soil Health</option>
                  <option>Weather</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Short Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the article..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your article content..."
                rows={8}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700"
              >
                {editingId ? "Update Article" : "Publish Article"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Articles List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="mb-6 text-lg font-black text-slate-900">
            Articles ({articles.length})
          </h2>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-[35%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Title
                  </th>
                  <th className="w-[18%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Category
                  </th>
                  <th className="w-[14%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="w-[18%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Last Updated
                  </th>
                  <th className="w-[15%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="w-[35%] py-4 px-4">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {article.description}
                        </p>
                      </div>
                    </td>
                    <td className="w-[18%] py-4 px-4 text-sm text-slate-600 truncate">
                      {article.category}
                    </td>
                    <td className="w-[14%] py-4 px-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
                          article.status === "Published"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="w-[18%] py-4 px-4 text-sm text-slate-600 truncate">
                      {new Date(article.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="w-[15%] py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {articles.map((article) => (
              <div
                key={article.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="mb-3">
                  <p className="font-bold text-slate-900 truncate">{article.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {article.description}
                  </p>
                </div>

                <div className="mb-4 flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-600 truncate">{article.category}</span>
                  <span
                    className={`rounded-full px-2 py-1 font-bold ${
                      article.status === "Published"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {article.status}
                  </span>
                </div>

                <div className="mb-4 border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-500">Updated</p>
                  <p className="font-bold text-slate-900">
                    {new Date(article.lastUpdated).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(article)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
