'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, BookOpen, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getNotesForUser, createNote, deleteNote, Note } from '@/lib/academics/notes';

function formatNoteDate(note: Note): string {
  if (note.createdAt && typeof (note.createdAt as any).toDate === 'function') {
    return (note.createdAt as any).toDate().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return '';
}

function NotesWorkspace() {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!user?.uid) return;

    let mounted = true;
    setNotesLoading(true);
    getNotesForUser(user.uid)
      .then((data) => {
        if (mounted) setNotes(data);
      })
      .catch(() => {
        if (mounted) setNotesError('Could not load your notes right now.');
      })
      .finally(() => {
        if (mounted) setNotesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user?.uid) return;

    setSubmitting(true);
    setNotesError('');
    try {
      const created = await createNote(user.uid, title, category, content);
      setNotes((prev) => [created, ...prev]);
      setTitle('');
      setContent('');
    } catch (err) {
      setNotesError('Failed to save note. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    const previous = notes;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNote(id);
    } catch (err) {
      setNotesError('Failed to delete note. Please try again.');
      setNotes(previous);
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Notes Workspace</h1>
        <p className="text-slate-400 text-sm mt-1">Create, manage, and store your academic study notes safely.</p>
      </div>

      {notesError && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">
          {notesError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" /> Create New Note
          </h2>

          <form onSubmit={handleSaveNote} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Note Title</label>
              <input
                type="text"
                placeholder="e.g., Data Structures & Algorithms"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="General">General</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Content</label>
              <textarea
                rows={5}
                placeholder="Write your study points, key formulas, or lecture summaries..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> {submitting ? 'Saving...' : 'Save Note'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search notes by keyword or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All', 'General', 'Computer Science', 'Mathematics'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {notesLoading ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
              <p className="text-slate-500 text-sm">Loading your notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-slate-300 font-semibold text-base">No notes saved yet.</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Use the editor on the left to write and save your first study note.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <div key={note.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition space-y-2 relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] rounded-md font-mono uppercase">
                        {note.category}
                      </span>
                      <h3 className="text-white font-bold text-base mt-1">{note.title}</h3>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>
                  <p className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/60">{formatNoteDate(note)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <ProtectedRoute allowedRoles={['STUDENT', 'PARENT', 'TEACHER']}>
      <NotesWorkspace />
    </ProtectedRoute>
  );
}
