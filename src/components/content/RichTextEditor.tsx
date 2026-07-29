'use client';

import React, { useState } from 'react';
import { calculateReadingTime } from '@/lib/content/contentService';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit3,
  Sparkles,
} from 'lucide-react';

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  initialValue = '',
  onChange,
  placeholder = 'Write your content here...',
}: RichTextEditorProps) {
  const [content, setContent] = useState<string>(initialValue);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    if (onChange) onChange(val);
  };

  const insertMarkup = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    if (onChange) onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = calculateReadingTime(content);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-0">
      {/* Top Action Toolbar */}
      <div className="bg-slate-950 border-b border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertMarkup('# ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('## ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('### ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          <button
            type="button"
            onClick={() => insertMarkup('**', '**')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('*', '*')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          <button
            type="button"
            onClick={() => insertMarkup('- ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('1. ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('> ')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('`', '`')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'write' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Main Editing Area */}
      {activeTab === 'write' ? (
        <textarea
          id="rich-editor-textarea"
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          rows={12}
          className="w-full bg-slate-900 p-4 text-slate-200 text-sm font-mono focus:outline-none resize-y placeholder-slate-600 leading-relaxed"
        />
      ) : (
        <div className="p-6 bg-slate-950 min-h-[288px] text-slate-300 text-sm leading-relaxed space-y-3">
          {content ? (
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">{content}</div>
          ) : (
            <p className="text-slate-600 italic">Nothing to preview yet. Start typing in write mode.</p>
          )}
        </div>
      )}

      {/* Bottom Status Footer */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div className="flex items-center space-x-4">
          <span>Words: <strong className="text-slate-300">{wordCount}</strong></span>
          <span>Chars: <strong className="text-slate-300">{content.length}</strong></span>
        </div>
        <div className="flex items-center space-x-1 text-indigo-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Est. Reading: {readingTime} min</span>
        </div>
      </div>
    </div>
  );
}
