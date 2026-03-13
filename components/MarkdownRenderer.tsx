'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { FaCheck, FaCopy, FaInfoCircle, FaExclamationTriangle, FaLightbulb, FaBan, FaCheckCircle } from 'react-icons/fa';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <style jsx global>{`
        /* Enhanced Prose Styling */
        .prose {
          color: #1f2937;
          font-size: 1.125rem;
          line-height: 1.75;
        }

        /* Headings */
        .prose h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-top: 4rem;
          margin-bottom: 2.5rem;
          color: #111827;
          line-height: 1.2;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 0.5rem;
        }

        .prose h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 4.5rem;
          margin-bottom: 2rem;
          color: #1f2937;
          line-height: 1.3;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
          scroll-margin-top: 100px;
        }

        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
          color: #374151;
          line-height: 1.4;
          scroll-margin-top: 100px;
        }

        .prose h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          color: #4b5563;
        }

        /* Paragraphs */
        .prose p {
          margin-bottom: 1.5rem;
          color: #374151;
        }

        /* Links */
        .prose a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid transparent;
          transition: all 0.2s;
        }

        .prose a:hover {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }

        /* Strong & Em */
        .prose strong {
          color: #111827;
          font-weight: 700;
        }

        .prose em {
          font-style: italic;
          color: #4b5563;
        }

        /* Lists */
        .prose ul, .prose ol {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .prose li {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
        }

        .prose ul > li {
          position: relative;
        }

        .prose ul > li::marker {
          color: #3b82f6;
          font-size: 1.2em;
        }

        .prose ol > li::marker {
          color: #3b82f6;
          font-weight: 600;
        }

        /* Nested Lists */
        .prose ul ul, .prose ol ul, .prose ul ol, .prose ol ol {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }

        /* Blockquotes */
        .prose blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          margin: 2rem 0;
          font-style: italic;
          background: linear-gradient(to right, #eff6ff 0%, transparent 100%);
          color: #1f2937;
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .prose blockquote p {
          margin: 0.5rem 0;
        }

        /* Code */
        .prose code {
          background-color: #f1f5f9;
          color: #e11d48;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
          font-family: 'Courier New', monospace;
          font-weight: 500;
        }

        .prose pre {
          background-color: #1e293b !important;
          border-radius: 0.75rem;
          padding: 0 !important;
          margin: 2rem 0;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .prose pre code {
          background-color: transparent;
          color: #e2e8f0;
          padding: 1.5rem;
          display: block;
          overflow-x: auto;
          font-size: 0.95rem;
          line-height: 1.6;
          border-radius: 0;
        }

        /* Tables */
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .prose thead {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .prose thead th {
          color: white;
          font-weight: 600;
          text-align: left;
          padding: 1rem;
          border: none;
        }

        .prose tbody tr {
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s;
        }

        .prose tbody tr:hover {
          background-color: #f9fafb;
        }

        .prose tbody tr:last-child {
          border-bottom: none;
        }

        .prose td {
          padding: 0.875rem 1rem;
          border: none;
        }

        /* Horizontal Rules */
        .prose hr {
          border: none;
          height: 2px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 3rem 0;
        }

        /* Images */
        .prose img {
          border-radius: 0.75rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin: 2rem 0;
        }

        /* Callout/Admonition Styles */
        .callout {
          padding: 1.25rem;
          margin: 2rem 0;
          border-radius: 0.75rem;
          border-left: 4px solid;
          display: flex;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .callout-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          margin-top: 0.125rem;
        }

        .callout-content {
          flex: 1;
        }

        .callout-content > *:first-child {
          margin-top: 0;
        }

        .callout-content > *:last-child {
          margin-bottom: 0;
        }

        .callout-note {
          background-color: #eff6ff;
          border-left-color: #3b82f6;
          color: #1e40af;
        }

        .callout-info {
          background-color: #f0f9ff;
          border-left-color: #0ea5e9;
          color: #075985;
        }

        .callout-tip {
          background-color: #f0fdf4;
          border-left-color: #22c55e;
          color: #166534;
        }

        .callout-warning {
          background-color: #fffbeb;
          border-left-color: #f59e0b;
          color: #92400e;
        }

        .callout-danger {
          background-color: #fef2f2;
          border-left-color: #ef4444;
          color: #991b1b;
        }

        .callout-success {
          background-color: #f0fdf4;
          border-left-color: #10b981;
          color: #065f46;
        }
      `}</style>
      
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom heading renderer with IDs for anchor links
          h1: ({ children, ...props }) => {
            const text = children?.toString() || '';
            const id = text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            return (
              <h1 id={id} {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ children, ...props }) => {
            const text = children?.toString() || '';
            const id = text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const text = children?.toString() || '';
            const id = text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
          
          // Enhanced link renderer for YouTube embeds
          a: ({ href, children, ...props }) => {
            // Check if it's a YouTube link
            const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
            const match = href?.match(youtubeRegex);
            
            if (match && match[1]) {
              const videoId = match[1];
              return (
                <div className="my-8 rounded-lg overflow-hidden shadow-xl aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              );
            }
            
            // Regular link with enhanced styling
            return (
              <a 
                href={href} 
                {...props} 
                target={href?.startsWith('http') ? '_blank' : undefined} 
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            );
          },
          
          // Enhanced blockquote with callout support
          blockquote: ({ children, ...props }) => {
            const content = children?.toString() || '';
            
            // Check for callout syntax: [!NOTE], [!TIP], [!WARNING], [!DANGER], [!INFO], [!SUCCESS]
            const calloutMatch = content.match(/^\[!(NOTE|TIP|WARNING|DANGER|INFO|SUCCESS)\]/i);
            
            if (calloutMatch) {
              const type = calloutMatch[1].toLowerCase();
              // const cleanContent = content.replace(/^\[!.*?\]\s*/, '');
              
              const icons: { [key: string]: React.ReactElement } = {
                note: <FaInfoCircle className="callout-icon text-blue-600" />,
                info: <FaInfoCircle className="callout-icon text-sky-600" />,
                tip: <FaLightbulb className="callout-icon text-green-600" />,
                warning: <FaExclamationTriangle className="callout-icon text-amber-600" />,
                danger: <FaBan className="callout-icon text-red-600" />,
                success: <FaCheckCircle className="callout-icon text-emerald-600" />,
              };
              
              return (
                <div className={`callout callout-${type}`}>
                  {icons[type]}
                  <div className="callout-content">
                    {children}
                  </div>
                </div>
              );
            }
            
            return <blockquote {...props}>{children}</blockquote>;
          },
          
          // Enhanced code block with language label and copy button
          code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');
            const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
            
            if (!inline && language) {
              return (
                <div className="relative group">
                  {/* Language Label */}
                  <div className="absolute top-0 left-0 px-4 py-2 bg-slate-700 text-slate-200 text-xs font-semibold rounded-tl-lg rounded-br-lg uppercase tracking-wider">
                    {language}
                  </div>
                  
                  {/* Copy Button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => copyToClipboard(codeString, codeId)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/90 hover:bg-slate-600 text-white text-xs rounded-lg transition-all duration-200 shadow-lg"
                      aria-label="Copier le code"
                    >
                      {copiedCode === codeId ? (
                        <>
                          <FaCheck className="w-3 h-3" />
                          Copié !
                        </>
                      ) : (
                        <>
                          <FaCopy className="w-3 h-3" />
                          Copier
                        </>
                      )}
                    </button>
                  </div>
                  
                  <pre>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }
            
            // Inline code
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          
          // Enhanced image renderer
          img: ({ src, alt }) => {
            return (
              <img
                src={src || ''}
                alt={alt || ''}
                loading="lazy"
              />
            );
          },
          
          // Enhanced table renderer
          table: ({ children, ...props }) => {
            return (
              <div className="overflow-x-auto my-8">
                <table {...props}>{children}</table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}