'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaTimes, FaImage, FaSpinner, FaCheck } from 'react-icons/fa';

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onImageInsert: (url: string, altText: string) => void;
}

export default function ImageUploader({ isOpen, onClose, onImageInsert }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<{ url: string; filename: string } | null>(null);
  const [altText, setAltText] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const uploadFile = async (file: File) => {
    setError('');
    setUploading(true);
    setUploaded(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploaded({ url: data.url, filename: data.filename });
      setAltText(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    } else {
      setError('Please drop an image file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleInsert = () => {
    if (uploaded) {
      onImageInsert(uploaded.url, altText || 'image');
      handleClose();
    }
  };

  const handleClose = () => {
    setUploaded(null);
    setAltText('');
    setError('');
    setIsDragOver(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FaImage className="text-accent" />
              Upload Image
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Upload Area */}
          {!uploaded && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragOver
                  ? 'border-accent bg-accent/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <FaSpinner className="text-4xl text-accent animate-spin" />
                  <p className="text-gray-400">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <FaCloudUploadAlt className="text-4xl text-gray-500" />
                  <div>
                    <p className="text-white font-medium">
                      Drop an image here or click to select
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      PNG, JPG, GIF, WebP, SVG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Uploaded Preview */}
          {uploaded && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={uploaded.url}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                  <FaCheck className="text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Alt Text (image description)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setUploaded(null);
                    setAltText('');
                  }}
                  className="flex-1 py-2 px-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Upload Another
                </button>
                <button
                  onClick={handleInsert}
                  className="flex-1 py-2 px-4 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
                >
                  Insert Image
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
