'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import EditorToolbar from './EditorToolbar';
import ImageUploader from './ImageUploader';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your article content here...',
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [imageUploaderOpen, setImageUploaderOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  // Update selection on change
  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  // Insert text with wrap (for bold, italic, etc.)
  const insertWrap = useCallback(
    (prefix: string, suffix: string, placeholder = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      const textToInsert = selected || placeholder;

      const newValue =
        value.substring(0, start) +
        prefix +
        textToInsert +
        suffix +
        value.substring(end);

      onChange(newValue);

      // Set cursor position after insert
      setTimeout(() => {
        textarea.focus();
        const newStart = start + prefix.length;
        const newEnd = newStart + textToInsert.length;
        textarea.setSelectionRange(newStart, newEnd);
      }, 0);
    },
    [value, onChange]
  );

  // Insert at line start
  const insertLine = useCallback(
    (text: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      // Find the start of the current line
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;

      const newValue =
        value.substring(0, lineStart) + text + value.substring(lineStart);

      onChange(newValue);

      setTimeout(() => {
        textarea.focus();
        const newPos = lineStart + text.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    },
    [value, onChange]
  );

  // Insert image markdown
  const insertImage = useCallback(
    (url: string, altText: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const imageMarkdown = `![${altText}](${url})`;

      const newValue =
        value.substring(0, start) + imageMarkdown + value.substring(start);

      onChange(newValue);

      setTimeout(() => {
        textarea.focus();
        const newPos = start + imageMarkdown.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    },
    [value, onChange]
  );

  // Insert link
  const insertLink = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = selectionStart;
    const end = selectionEnd;
    const selected = value.substring(start, end);

    const text = linkText || selected || 'link text';
    const url = linkUrl || 'https://';
    const linkMarkdown = `[${text}](${url})`;

    const newValue =
      value.substring(0, start) + linkMarkdown + value.substring(end);

    onChange(newValue);
    setLinkDialogOpen(false);
    setLinkText('');
    setLinkUrl('');

    setTimeout(() => {
      textarea.focus();
    }, 0);
  }, [value, onChange, selectionStart, selectionEnd, linkText, linkUrl]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!textareaRef.current) return;
      if (document.activeElement !== textareaRef.current) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            insertWrap('**', '**', 'bold');
            break;
          case 'i':
            e.preventDefault();
            insertWrap('*', '*', 'italic');
            break;
          case 'k':
            e.preventDefault();
            handleSelectionChange();
            setLinkDialogOpen(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [insertWrap]);

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <EditorToolbar
        onInsert={insertWrap}
        onInsertLine={insertLine}
        onImageClick={() => setImageUploaderOpen(true)}
        onLinkClick={() => {
          handleSelectionChange();
          setLinkDialogOpen(true);
        }}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

      {/* Editor and Preview */}
      <div className={`flex ${showPreview ? 'divide-x divide-gray-600' : ''}`}>
        {/* Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'}`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onSelect={handleSelectionChange}
            placeholder={placeholder}
            style={{
              width: '100%',
              height: '500px',
              padding: '16px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              resize: 'none',
              border: 'none',
              outline: 'none',
              caretColor: '#60a5fa',
              boxSizing: 'border-box'
            }}
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div style={{
            width: '50%',
            height: '500px',
            overflowY: 'auto',
            backgroundColor: '#1e293b',
            padding: '16px',
            color: '#f1f5f9'
          }}>
            <div style={{ maxWidth: 'none', color: '#f1f5f9' }} className="admin-preview">
              {value ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {value}
                </ReactMarkdown>
              ) : (
                <p style={{ color: '#64748b', fontStyle: 'italic' }}>Preview will appear here...</p>
              )}
            </div>
            <style jsx global>{`
              .admin-preview h1, .admin-preview h2, .admin-preview h3, .admin-preview h4, .admin-preview h5, .admin-preview h6 {
                color: #ffffff !important;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                font-weight: 600;
              }
              .admin-preview h1 { font-size: 2em; }
              .admin-preview h2 { font-size: 1.5em; }
              .admin-preview h3 { font-size: 1.25em; }
              .admin-preview p { color: #e2e8f0 !important; margin-bottom: 1em; line-height: 1.6; }
              .admin-preview strong { color: #ffffff !important; font-weight: 600; }
              .admin-preview em { color: #e2e8f0 !important; }
              .admin-preview code { color: #93c5fd !important; background: #334155; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
              .admin-preview pre { background: #0f172a !important; padding: 16px; border-radius: 8px; overflow-x: auto; }
              .admin-preview pre code { background: transparent !important; padding: 0; }
              .admin-preview a { color: #60a5fa !important; text-decoration: underline; }
              .admin-preview ul, .admin-preview ol { color: #e2e8f0 !important; margin-bottom: 1em; padding-left: 1.5em; }
              .admin-preview li { color: #e2e8f0 !important; margin-bottom: 0.25em; }
              .admin-preview blockquote { border-left: 4px solid #475569; padding-left: 1em; color: #cbd5e1 !important; font-style: italic; }
              .admin-preview table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
              .admin-preview th { background: #334155; color: #ffffff !important; padding: 10px; text-align: left; border: 1px solid #475569; font-weight: 600; }
              .admin-preview td { color: #e2e8f0 !important; padding: 10px; border: 1px solid #475569; }
              .admin-preview hr { border-color: #475569; margin: 1.5em 0; }
              .admin-preview img { max-width: 100%; border-radius: 8px; }
            `}</style>
          </div>
        )}
      </div>

      {/* Image Uploader Modal */}
      <ImageUploader
        isOpen={imageUploaderOpen}
        onClose={() => setImageUploaderOpen(false)}
        onImageInsert={insertImage}
      />

      {/* Link Dialog */}
      {linkDialogOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setLinkDialogOpen(false)}
        >
          <div
            className="bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Display text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setLinkDialogOpen(false)}
                  className="flex-1 py-2 px-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={insertLink}
                  className="flex-1 py-2 px-4 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
