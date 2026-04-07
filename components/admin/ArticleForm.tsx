'use client';

import { useState } from 'react';
import { FaTags, FaCalendar, FaImage, FaUser, FaFolder, FaKey } from 'react-icons/fa';

export interface ArticleFrontmatter {
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  category: string;
  tags: string[];
  keywords: string[];
  author: string;
}

interface ArticleFormProps {
  frontmatter: ArticleFrontmatter;
  onChange: (frontmatter: ArticleFrontmatter) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  isEdit?: boolean;
}

export default function ArticleForm({
  frontmatter,
  onChange,
  slug,
  onSlugChange,
  isEdit = false,
}: ArticleFormProps) {
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const updateField = <K extends keyof ArticleFrontmatter>(
    field: K,
    value: ArticleFrontmatter[K]
  ) => {
    onChange({ ...frontmatter, [field]: value });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  };

  const handleTitleChange = (title: string) => {
    updateField('title', title);
    if (!isEdit) {
      onSlugChange(generateSlug(title));
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !frontmatter.tags.includes(tag)) {
      updateField('tags', [...frontmatter.tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    updateField(
      'tags',
      frontmatter.tags.filter((t) => t !== tagToRemove)
    );
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !frontmatter.keywords.includes(keyword)) {
      updateField('keywords', [...frontmatter.keywords, keyword]);
    }
    setKeywordInput('');
  };

  const removeKeyword = (keywordToRemove: string) => {
    updateField(
      'keywords',
      frontmatter.keywords.filter((k) => k !== keywordToRemove)
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    type: 'tag' | 'keyword'
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'tag') addTag();
      else addKeyword();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={frontmatter.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Article title"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent text-lg"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Slug (URL) *
        </label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">/articles/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
            placeholder="article-slug"
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent font-mono"
            required
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Excerpt *
        </label>
        <textarea
          value={frontmatter.excerpt}
          onChange={(e) => updateField('excerpt', e.target.value)}
          placeholder="Brief description of the article (shown in cards and SEO)"
          rows={3}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          required
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <FaCalendar className="text-gray-500" />
            Date *
          </label>
          <input
            type="date"
            value={frontmatter.date}
            onChange={(e) => updateField('date', e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <FaFolder className="text-gray-500" />
            Category
          </label>
          <input
            type="text"
            value={frontmatter.category}
            onChange={(e) => updateField('category', e.target.value)}
            placeholder="e.g., Tutorial, Guide, News"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <FaImage className="text-gray-500" />
            Cover Image URL
          </label>
          <input
            type="text"
            value={frontmatter.coverImage}
            onChange={(e) => updateField('coverImage', e.target.value)}
            placeholder="/images/covers/article.jpg"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Author */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <FaUser className="text-gray-500" />
            Author
          </label>
          <input
            type="text"
            value={frontmatter.author}
            onChange={(e) => updateField('author', e.target.value)}
            placeholder="Author name"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <FaTags className="text-gray-500" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'tag')}
            placeholder="Add a tag and press Enter"
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <FaKey className="text-gray-500" />
          Keywords (SEO)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {frontmatter.keywords.map((keyword) => (
            <span
              key={keyword}
              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'keyword')}
            placeholder="Add a keyword and press Enter"
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
