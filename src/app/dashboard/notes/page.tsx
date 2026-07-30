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

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt?: string;
}

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    } catch (error) {
      console.error('[NotesPage] Error deleting note:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>📝</span> Notes & Academic Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store, search, and manage your lecture summaries synced with Firestore.
          </p>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-mono font-bold text-emerald-400">
          {notes.length} Active Notes Saved
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Note Editor */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 h-fit">
          <h2 className="text-sm font-bold text-white tracking-tight">Create New Note</h2>
          <form onSubmit={handleCreateNote} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Note Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Category / Subject
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="General">General</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Research">Research</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Content
              </label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your study points, key formulas, or raw thoughts..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold text-xs rounded-xl transition shadow-md"
            >
              {isSaving ? 'Saving to Cloud...' : 'Save Note'}
            </button>
          </form>
        </div>

        {/* Saved Notes Display Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-white tracking-tight">Your Saved Workspace Notes</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 animate-pulse">
                  <div className="h-4 w-1/3 bg-slate-800 rounded" />
                  <div className="h-10 w-full bg-slate-800/50 rounded" />
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="p-8 bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl text-center space-y-2">
              <p className="text-xs font-semibold text-slate-300">No notes saved yet.</p>
              <p className="text-[11px] text-slate-500">
                Use the editor on the left to add your first lecture note.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between gap-3 hover:border-slate-700 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {note.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{note.createdAt}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                      {note.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed whitespace-pre-line">
                      {note.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-500/10 transition"
                    >
                      Delete Note
                    </button>
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
