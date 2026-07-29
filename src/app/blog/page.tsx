import React from 'react';
import Link from 'next/link';
import { getPublishedArticles } from '@/lib/content/contentService';
import { BookOpen, Calendar, Clock, ArrowRight, User } from 'lucide-react';

export default function BlogIndexPage() {
  const articles = getPublishedArticles();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge Base & Updates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Onyx Stack Labs Insights
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Explore articles, updates, and deep dives into campus management tech and micro-SaaS architecture.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all duration-200 shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-semibold">
                    {article.category.name}
                  </span>
                  <span className="flex items-center space-x-1 text-slate-400 text-xs">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{article.readingTimeMinutes} min</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-white line-clamp-2 hover:text-indigo-400 transition-colors">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-300 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{article.author.name}</span>
                </div>

                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
