'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSpinner,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaClock,
  FaCalendar,
  FaExclamationTriangle,
} from 'react-icons/fa';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  category: string;
  tags: string[];
  readingTime: number;
  wordCount: number;
}

type SortField = 'title' | 'date' | 'category' | 'readingTime';
type SortOrder = 'asc' | 'desc';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/articles');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch articles');
      }

      setArticles(data.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (slug: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/articles/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete article');
      }

      setArticles((prev) => prev.filter((a) => a.slug !== slug));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedArticles = articles
    .filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison =
            new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'readingTime':
          comparison = a.readingTime - b.readingTime;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <FaSort className="text-gray-500" />;
    return sortOrder === 'asc' ? (
      <FaSortUp className="text-accent" />
    ) : (
      <FaSortDown className="text-accent" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="text-4xl text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Articles</h1>
          <p className="text-gray-400">
            {articles.length} article{articles.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors no-underline"
        >
          <FaPlus />
          New Article
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 flex items-center gap-2">
          <FaExclamationTriangle />
          {error}
          <button
            onClick={() => setError('')}
            className="ml-auto hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title, category, or tags..."
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Articles Table */}
      {filteredAndSortedArticles.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg">
          <p className="text-gray-400 mb-4">
            {searchQuery
              ? 'No articles match your search'
              : 'No articles yet'}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors no-underline"
            >
              <FaPlus />
              Create your first article
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white"
                    >
                      Title
                      <SortIcon field="title" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('category')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white"
                    >
                      Category
                      <SortIcon field="category" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white"
                    >
                      Date
                      <SortIcon field="date" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('readingTime')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white"
                    >
                      Reading Time
                      <SortIcon field="readingTime" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-gray-300">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAndSortedArticles.map((article) => (
                  <motion.tr
                    key={article.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-white">
                          {article.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {article.excerpt}
                        </p>
                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{article.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-accent/20 text-accent text-sm rounded">
                        {article.category || 'None'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <FaCalendar className="text-xs" />
                        {new Date(article.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <FaClock className="text-xs" />
                        {article.readingTime} min
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/articles/${article.slug}/edit`}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(article.slug)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => !deleting && setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <FaTrash className="text-red-400 text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Delete Article
                  </h3>
                  <p className="text-gray-400 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete{' '}
                <strong className="text-white">
                  {articles.find((a) => a.slug === deleteConfirm)?.title}
                </strong>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                  className="flex-1 py-2 px-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <>
                      <FaTrash />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
