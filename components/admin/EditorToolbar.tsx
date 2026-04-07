'use client';

import { motion } from 'framer-motion';
import {
  FaBold,
  FaItalic,
  FaHeading,
  FaCode,
  FaLink,
  FaImage,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaTable,
  FaMinus,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

interface EditorToolbarProps {
  onInsert: (prefix: string, suffix: string, placeholder?: string) => void;
  onInsertLine: (text: string) => void;
  onImageClick: () => void;
  onLinkClick: () => void;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export default function EditorToolbar({
  onInsert,
  onInsertLine,
  onImageClick,
  onLinkClick,
  showPreview,
  onTogglePreview,
}: EditorToolbarProps) {
  const toolbarGroups = [
    {
      items: [
        {
          icon: FaBold,
          label: 'Bold',
          action: () => onInsert('**', '**', 'bold text'),
        },
        {
          icon: FaItalic,
          label: 'Italic',
          action: () => onInsert('*', '*', 'italic text'),
        },
        {
          icon: FaCode,
          label: 'Inline Code',
          action: () => onInsert('`', '`', 'code'),
        },
      ],
    },
    {
      items: [
        {
          icon: FaHeading,
          label: 'Heading 1',
          text: 'H1',
          action: () => onInsertLine('# '),
        },
        {
          icon: FaHeading,
          label: 'Heading 2',
          text: 'H2',
          action: () => onInsertLine('## '),
        },
        {
          icon: FaHeading,
          label: 'Heading 3',
          text: 'H3',
          action: () => onInsertLine('### '),
        },
      ],
    },
    {
      items: [
        {
          icon: FaLink,
          label: 'Link',
          action: onLinkClick,
        },
        {
          icon: FaImage,
          label: 'Image',
          action: onImageClick,
        },
      ],
    },
    {
      items: [
        {
          icon: FaListUl,
          label: 'Bullet List',
          action: () => onInsertLine('- '),
        },
        {
          icon: FaListOl,
          label: 'Numbered List',
          action: () => onInsertLine('1. '),
        },
        {
          icon: FaQuoteRight,
          label: 'Blockquote',
          action: () => onInsertLine('> '),
        },
      ],
    },
    {
      items: [
        {
          icon: FaCode,
          label: 'Code Block',
          text: '</>',
          action: () => onInsert('\n```\n', '\n```\n', 'code block'),
        },
        {
          icon: FaTable,
          label: 'Table',
          action: () =>
            onInsert(
              '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| ',
              ' |  |  |\n',
              'Cell 1'
            ),
        },
        {
          icon: FaMinus,
          label: 'Horizontal Rule',
          action: () => onInsertLine('\n---\n'),
        },
      ],
    },
    {
      items: [
        {
          icon: showPreview ? FaEyeSlash : FaEye,
          label: showPreview ? 'Hide Preview' : 'Show Preview',
          action: onTogglePreview,
          active: showPreview,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-700 border-b border-gray-600 rounded-t-lg">
      {toolbarGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center gap-1">
          {groupIndex > 0 && (
            <div className="w-px h-6 bg-gray-600 mx-1" />
          )}
          {group.items.map((item, itemIndex) => (
            <motion.button
              key={itemIndex}
              type="button"
              onClick={item.action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded hover:bg-gray-600 transition-colors ${
                'active' in item && item.active
                  ? 'bg-accent text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
              title={item.label}
            >
              {'text' in item && item.text ? (
                <span className="text-xs font-bold">{item.text}</span>
              ) : (
                <item.icon className="text-sm" />
              )}
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
}
