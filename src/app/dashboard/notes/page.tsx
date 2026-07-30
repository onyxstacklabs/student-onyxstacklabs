'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import {
  BookOpen,
  Search,
  PlusCircle,
  Trash2,
  Tag,
  Check,
  X,
  FileText,
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt?: string;
}

const CATEGORIES = [
  'All',
  'General',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Research',
];

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');

  useEffect(() => {
    let mounted = true;

    async function fetchNotes() {
      if (!user?.uid) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'student_notes'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedNotes: Note[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedNotes.push({
            id: docSnap.id,
            title: data.title || 'Untitled Note',
            content: data.content || '',
            category: data.category || 'General',
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString()
              : 'Recently',
          });
        });

        if (mounted) setNotes(fetchedNotes);
      } catch (error) {
        console.error('[NotesPage] Error loading notes:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchNotes();

    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user?.uid) return;

    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'student_notes'), {
        userId: user.uid,
        title: title.trim(),
        category,
        content: content.trim(),
        createdAt: serverTimestamp(),
      });

      const newNote: Note = {
        id: docRef.id,
        title: title.trim(),
        category,
        content: content.trim(),
        createdAt: 'Just now',
      };

      setNotes((prev) => [newNote, ...prev]);
      setTitle('');
      setContent('');
      setCategory('General');
    } catch (error) {
      console.error('[NotesPage] Error creating note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'student_notes', id));
      setNotes((prev) => prev.filter((note) => note.id !== id));
      setDeletingId(null);
    } catch (error) {
      console.error('[NotesPage] Error deleting note:', error);
    }
  };

  // Filtered Notes Computation
  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      selectedCategory === 'All' || note.category === selectedCategory;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-2 sm:p-0">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Notes & Academic Workspace
            </h1>
            <p className="text-xs text-slate-400">
              Create, organize, and quickly search your study notes • OnyxStack Labs
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-mono font-bold text-emerald-400">
          {notes.length} Active {notes.length === 1 ? 'Note' : 'Notes'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Note Editor */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 h-fit shadow-sm">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Create New Note
            </h2>
          </div>

          <form onSubmit={handleCreateNote} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Note Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Data Structures & Algorithms"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="General">General</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Research">Research</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Content
              </label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your study points, key formulas, or lecture summaries..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Note...' : 'Save Note'}</span>
            </button>
          </form>
        </div>

        {/* Saved Notes Display Grid with Filters */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search Bar & Category Filters */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by keyword or title..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 animate-pulse"
                >
                  <div className="h-4 w-1/3 bg-slate-800 rounded" />
                  <div className="h-12 w-full bg-slate-800/50 rounded" />
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-8 bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-300">
                {notes.length === 0
                  ? 'No notes saved yet.'
                  : 'No matching notes found.'}
              </p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                {notes.length === 0
                  ? 'Use the editor on the left to write and save your first lecture note.'
                  : 'Try adjusting your search keyword or selecting a different category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col justify-between gap-3 transition shadow-sm group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        {note.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {note.createdAt}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug group-hover:text-indigo-300 transition">
                      {note.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed whitespace-pre-line">
                      {note.content}
                    </p>
                  </div>

                  {/* Card Footer with Delete Action */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {note.content.length} characters
                    </span>

                    {deletingId === note.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-rose-400 font-medium">
                          Confirm?
                        </span>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition"
                          title="Confirm Delete"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(note.id)}
                        className="text-[10px] text-slate-500 hover:text-rose-400 font-medium p-1 rounded hover:bg-rose-500/10 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
