'use client';

import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Article } from '@/models/Article';
import { motion } from 'framer-motion';
import { FaClock, FaArrowRight, FaTag } from 'react-icons/fa';

dayjs.locale('fr');

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured';
  index?: number;
}

export default function ArticleCard({ article, variant = 'default', index = 0 }: ArticleCardProps) {
  const isFeatured = variant === 'featured';
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={isFeatured ? 'md:col-span-2' : ''}
    >
      <Link
        href={`/articles/${article.slug}`}
        className="group block no-underline h-full"
      >
        <motion.article 
          className={`card h-full ${
            isFeatured ? 'md:flex md:flex-row' : 'flex flex-col'
          }`}
          whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' }}
          transition={{ duration: 0.3 }}
        >
          {/* Image */}
          <div className={`relative overflow-hidden rounded-lg ${
            isFeatured 
              ? 'md:w-1/2 h-64 md:h-auto' 
              : 'w-full h-48'
          }`}>
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
              />
            </motion.div>
            
            {/* Category Badge */}
            <motion.div 
              className="absolute top-4 left-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-accent text-xs font-semibold rounded-full inline-flex items-center gap-1">
                <FaTag className="text-xs" />
                {article.category === 'visa-et-papiers' && 'Visa & Papiers'}
                {article.category === 'logement' && 'Logement'}
                {article.category === 'travail' && 'Travail'}
                {article.category === 'langue' && 'Langue'}
                {article.category === 'vie-quotidienne' && 'Vie quotidienne'}
              </span>
            </motion.div>
          </div>

          {/* Content */}
          <div className={`flex flex-col ${
            isFeatured ? 'md:w-1/2 md:pl-6' : 'mt-4'
          }`}>
            {/* Metadata */}
            <motion.div 
              className="flex items-center gap-3 text-sm text-text-gray mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <time dateTime={article.date}>
                {dayjs(article.date).format('D MMMM YYYY')}
              </time>
              {article.readingTime && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <FaClock className="text-xs" />
                    {article.readingTime} min de lecture
                  </span>
                </>
              )}
            </motion.div>

            {/* Title */}
            <motion.h3 
              className={`font-heading font-bold text-text-dark group-hover:text-accent transition-colors ${
                isFeatured ? 'text-2xl md:text-3xl mb-4' : 'text-xl mb-3'
              }`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {article.title}
            </motion.h3>

            {/* Excerpt */}
            <motion.p 
              className={`text-text-gray leading-relaxed ${
                isFeatured ? 'text-base mb-4' : 'text-sm mb-4 line-clamp-3'
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {article.excerpt}
            </motion.p>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-2 mt-auto mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {article.tags.slice(0, 3).map((tag, idx) => (
                  <motion.span
                    key={tag}
                    className="px-2 py-1 bg-light-gray text-text-gray text-xs rounded"
                    whileHover={{ scale: 1.1, backgroundColor: '#E5E7EB' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                  >
                    #{tag}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Read More */}
            <motion.div 
              className="inline-flex items-center text-accent font-medium text-sm group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Lire l&apos;article
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <FaArrowRight className="ml-2" />
              </motion.div>
            </motion.div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}