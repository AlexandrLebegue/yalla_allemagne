'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaChevronDown } from 'react-icons/fa';
import { Heading } from '@/lib/markdown';

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (headings.length === 0) return null;

  return (
    <motion.div
      className="mb-6 bg-white p-4 border border-gray-300 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left mb-2 group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <h2 className="text-base font-heading font-semibold text-gray-500 flex items-center gap-2">
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            <FaBook className="text-gray-400" />
          </motion.div>
          <span>Table des matières</span>
        </h2>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.nav
            className="space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {headings.map((heading, index) => (
              <motion.a
                key={index}
                href={`#${heading.id}`}
                className={`block hover:text-gray-600 transition-all no-underline group relative ${
                  heading.level === 2
                    ? 'text-gray-500 font-medium py-1 text-sm'
                    : 'text-gray-500 text-xs pl-5 py-0.5'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform">
                  {heading.text}
                </span>
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}