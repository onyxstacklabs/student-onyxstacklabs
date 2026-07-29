import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getPublishedArticles } from '@/lib/content/contentService';
import { ShareButton } from '@/components/content/ShareButton';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticleDetailPage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Knowledge Base</span>
          </Link>

          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            {article.category.name}
          </span>
        </div>

        {/* Article Header */}
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {article.title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-slate-400">
            {/* Author Meta */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">{article.author.name}</p>
                <p className="text-slate-500 text-[11px]">{article.author.role}</p>
              </div>
            </div>

            {/* Publishing Telemetry */}
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Draft'}
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{article.readingTimeMinutes} min read</span>
              </span>
            </div>
          </div>
        </header>

        {/* Article Body Content */}
        <div
          className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Article Footer & Tags */}
        <footer className="pt-8 border-t border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-slate-500" />
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Client Share Button */}
            <ShareButton title={article.title} />
          </div>
        </footer>
      </article>
    </div>
  );
}
