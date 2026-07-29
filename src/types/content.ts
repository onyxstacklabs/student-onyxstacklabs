export type ContentPublicationStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type ContentType = 'blog_post' | 'announcement' | 'guide' | 'case_study' | 'documentation';

export interface AuthorProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  bio?: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ContentMetadata {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  keywords: string[];
  noIndex?: boolean;
}

export interface ContentArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  contentMarkdown: string;
  type: ContentType;
  status: ContentPublicationStatus;
  author: AuthorProfile;
  category: ContentCategory;
  tags: string[];
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  readingTimeMinutes: number;
  metadata: ContentMetadata;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}
