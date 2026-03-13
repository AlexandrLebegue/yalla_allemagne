'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaClock, FaUser, FaArrowLeft, FaRobot, FaTag, FaBook } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { Article } from '@/models/Article';
import { Heading } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';

dayjs.locale('fr');

interface ArticlePageClientProps {
  article: Article;
  headings: Heading[];
}

export default function ArticlePageClient({ article, headings }: ArticlePageClientProps) {
  const [showStickyToc, setShowStickyToc] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tocRef.current) {
        const tocPosition = tocRef.current.getBoundingClientRect().top;
        // Show sticky TOC when original TOC scrolls past viewport
        setShowStickyToc(tocPosition < -100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const fadeInUp = {
  //   initial: { opacity: 0, y: 20 },
  //   animate: { opacity: 1, y: 0 },
  //   transition: { duration: 0.6 }
  // };

  // const staggerContainer = {
  //   animate: {
  //     transition: {
  //       staggerChildren: 0.1
  //     }
  //   }
  // };

  const getCategoryConfig = () => {
    switch (article.category) {
      case 'visa-et-papiers':
        return { emoji: '🛂', label: 'Visa & Papiers', color: 'from-red-500 to-red-600' };
      case 'logement':
        return { emoji: '🏠', label: 'Logement', color: 'from-blue-500 to-blue-600' };
      case 'travail':
        return { emoji: '💼', label: 'Travail', color: 'from-green-500 to-green-600' };
      case 'langue':
        return { emoji: '🗣️', label: 'Langue', color: 'from-purple-500 to-purple-600' };
      case 'vie-quotidienne':
        return { emoji: '☕', label: 'Vie quotidienne', color: 'from-yellow-500 to-yellow-600' };
      default:
        return { emoji: '📝', label: 'Guide', color: 'from-gray-500 to-gray-600' };
    }
  };

  const category = getCategoryConfig();

  const articleContent = (
    <>
      {/* Cover Image */}
      {article.coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      )}

      {/* Title and Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-6"
      >
        <div className={`inline-block px-4 py-2 bg-gradient-to-r ${category.color} text-white rounded-full mb-4 shadow-lg`}>
          <span className="text-sm font-semibold flex items-center gap-2">
            <span>{category.emoji}</span>
            <span>{category.label}</span>
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-dark">
          {article.title}
        </h1>
      </motion.div>

      {/* Meta Information */}
      <motion.div
        className="flex flex-wrap items-center gap-4 text-text-gray mb-8 pb-8 border-b border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <FaCalendar className="w-5 h-5 text-accent" />
          <time dateTime={article.date}>
            {dayjs(article.date).format('D MMMM YYYY')}
          </time>
        </div>
        
        {article.readingTime && (
          <>
            <span>•</span>
            <div className="flex items-center gap-2">
              <FaClock className="w-5 h-5 text-accent" />
              <span>{article.readingTime} min de lecture</span>
            </div>
          </>
        )}

        {article.author && (
          <>
            <span>•</span>
            <div className="flex items-center gap-2">
              <FaUser className="w-5 h-5 text-accent" />
              <span>{article.author}</span>
            </div>
          </>
        )}
      </motion.div>

      {/* Table of Contents - Inline (original position) */}
      {headings.length > 0 && (
        <motion.div
          ref={tocRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <TableOfContents headings={headings} />
        </motion.div>
      )}

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <MarkdownRenderer content={article.content} />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <motion.div
            className="mt-12 pt-8 border-t border-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-sm font-semibold text-text-gray mb-4 flex items-center gap-2">
              <FaTag className="text-accent" />
              Tags :
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  className="px-3 py-1 bg-light-gray text-text-dark text-sm rounded-full hover:bg-accent hover:text-white transition-colors cursor-default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          className="mt-12 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <motion.div
              whileHover={{ x: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/tutoriels"
                className="inline-flex items-center gap-2 text-accent hover:underline no-underline"
              >
                <FaArrowLeft className="w-4 h-4" />
                <FaBook className="w-4 h-4" />
                Retour aux tutoriels
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/chatbot"
                className="btn btn-primary no-underline inline-flex items-center gap-2"
              >
                <FaRobot />
                <span>Poser une question</span>
                <HiSparkles />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.article>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Article Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto relative">
          {/* Sticky Table of Contents - Absolutely positioned to the left */}
          {headings.length > 0 && (
            <AnimatePresence>
              {showStickyToc && (
                <motion.div
                  className="hidden xl:block fixed left-8 top-24 w-64"
                  initial={{
                    opacity: 0,
                    x: -100,
                    scale: 0.9
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    x: -100,
                    scale: 0.9
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                    x: { type: "spring", stiffness: 100, damping: 15 }
                  }}
                  style={{
                    zIndex: 10
                  }}
                >
                  <div>
                    <div className="bg-white p-4 border border-gray-300 rounded-lg max-h-[calc(100vh-8rem)] overflow-y-auto">
                      <h2 className="text-base font-heading font-semibold text-gray-500 flex items-center gap-2 mb-3">
                        <FaBook className="text-gray-400" />
                        <span>Table des matières</span>
                      </h2>
                      <nav className="space-y-1">
                        {headings.map((heading, index) => (
                          <a
                            key={index}
                            href={`#${heading.id}`}
                            className={`block hover:text-gray-600 transition-all no-underline group relative ${
                              heading.level === 2
                                ? 'text-gray-500 font-medium py-1 text-sm'
                                : 'text-gray-400 text-xs pl-5 py-0.5'
                            }`}
                          >
                            <span className="group-hover:translate-x-1 inline-block transition-transform">
                              {heading.text}
                            </span>
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Main Article Column - Always centered */}
          <div>
            {articleContent}
          </div>
        </div>
      </div>
    </div>
  );
}