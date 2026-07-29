'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getPublishedArticles } from '@/lib/content/contentService';
import { BookOpen, Clock, Tag, ArrowRight, User } from 'lucide-react';

export default function BlogIndexPage() {
  const articles = getPublishedArticles();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'All Articles', value: 'all' },
    { label: 'Platform Updates', value: 'platform-updates' },
    { label: 'Architecture & Tech', value: 'architecture-tech' },
  ];

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter((art) => art.category.slug === selectedCategory);

  const featuredArticle = articles[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>OnyxStackLabs Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Insights, Updates & Architecture
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base">
            Deep dives into enterprise multi-tenant higher education software, AI integration, and platform engineering.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Article Spotlight */}
        {featuredArticle && selectedCategory === 'all' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                Featured Post
              </span>
            </div>
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span className="text-indigo-400 font-semibold">{featuredArticle.category.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredArticle.readingTimeMinutes} min read
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                <Link href={`/blog/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h2>
              <p className="text-slate-300 text-sm line-clamp-2">
                {featuredArticle.excerpt}
              </p>
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{featuredArticle.author.name}</span>
                </div>
                <Link
                  href={`/blog/${featuredArticle.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-indigo-400 font-medium">{article.category.name}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readingTimeMinutes} min
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
                <p className="text-slate-400 text-xs line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-slate-400">
                  <Tag className="w-3 h-3 text-slate-500" />
                  <span>{article.tags[0]}</span>
                </div>
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
                >
                  Read <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
