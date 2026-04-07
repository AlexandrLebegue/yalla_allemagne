'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleForm, { ArticleFrontmatter } from '@/components/admin/ArticleForm';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import { motion } from 'framer-motion';
import {
  FaSave,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft,
} from 'react-icons/fa';
import Link from 'next/link';

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [frontmatter, setFrontmatter] = useState<ArticleFrontmatter>({
    title: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    coverImage: '',
    category: '',
    tags: [],
    keywords: [],
    author: '',
  });

  const handleSave = async () => {
    // Validation
    if (!frontmatter.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!slug.trim()) {
      setError('Slug is required');
      return;
    }
    if (!frontmatter.excerpt.trim()) {
      setError('Excerpt is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          frontmatter,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create article');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">New Article</h1>
              <p className="text-gray-400">Create a new blog post</p>
            </div>
          </div>
          <motion.button
            onClick={handleSave}
            disabled={saving || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <FaSpinner className="animate-spin" />
            ) : success ? (
              <FaCheckCircle />
            ) : (
              <FaSave />
            )}
            {saving ? 'Saving...' : success ? 'Saved!' : 'Save Article'}
          </motion.button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 flex items-center gap-2"
          >
            <FaExclamationTriangle />
            {error}
            <button
              onClick={() => setError('')}
              className="ml-auto hover:text-white"
            >
              ×
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 flex items-center gap-2"
          >
            <FaCheckCircle />
            Article created successfully! Redirecting...
          </motion.div>
        )}

        {/* Article Form */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            Article Details
          </h2>
          <ArticleForm
            frontmatter={frontmatter}
            onChange={setFrontmatter}
            slug={slug}
            onSlugChange={setSlug}
          />
        </div>

        {/* Markdown Editor */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Content</h2>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Write your article content in Markdown..."
          />
        </div>
      </div>
    </AdminLayout>
  );
}
