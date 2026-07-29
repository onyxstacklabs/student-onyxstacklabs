import { ContentArticle, ContentPublicationStatus, ContentType } from '@/types/content';

export const MOCK_CONTENT_ARTICLES: ContentArticle[] = [
  {
    id: 'art-001',
    slug: 'introducing-onyx-student-saas-platform',
    title: 'Introducing the Onyx Enterprise Student SaaS Platform',
    excerpt: 'An all-in-one multi-tenant campus governance and AI-assisted learning platform designed for modern academic institutions.',
    contentHtml: '<p>Today we are excited to launch the Onyx Enterprise Student SaaS Platform, built to empower universities with institutional governance, student portals, and AI-driven study tools.</p>',
    contentMarkdown: 'Today we are excited to launch the Onyx Enterprise Student SaaS Platform...',
    type: 'announcement',
    status: 'published',
    author: {
      id: 'usr-001',
      name: 'Alex Johnson',
      email: 'alex.johnson@onyxstacklabs.com',
      role: 'Platform Lead',
    },
    category: {
      id: 'cat-news',
      name: 'Platform Updates',
      slug: 'platform-updates',
      description: 'Official announcements and feature releases.',
    },
    tags: ['SaaS', 'Education', 'AI', 'Next.js'],
    featuredImageUrl: '/images/blog/launch-banner.jpg',
    featuredImageAlt: 'Onyx Student SaaS Platform Dashboard Interface',
    readingTimeMinutes: 3,
    metadata: {
      metaTitle: 'Introducing the Onyx Enterprise Student SaaS Platform | OnyxStackLabs',
      metaDescription: 'Discover how the Onyx Student SaaS platform enables multi-tenant institutional governance and AI-assisted learning.',
      keywords: ['SaaS', 'EdTech', 'Student Portal', 'Multi-Tenant'],
    },
    publishedAt: '2026-07-20T10:00:00.000Z',
    createdAt: '2026-07-15T08:00:00.000Z',
    updatedAt: '2026-07-20T10:00:00.000Z',
  },
  {
    id: 'art-002',
    slug: 'scaling-multi-tenant-campus-architecture',
    title: 'Scaling Multi-Tenant Architecture for Higher Education',
    excerpt: 'A deep dive into subdomains, tenant isolation, and quota telemetry in enterprise higher education software.',
    contentHtml: '<p>Multi-tenancy in higher education requires isolation of student data, department management, and quota enforcement.</p>',
    contentMarkdown: 'Multi-tenancy in higher education requires isolation of student data...',
    type: 'blog_post',
    status: 'published',
    author: {
      id: 'usr-002',
      name: 'Dr. Robert Morris',
      email: 'dean.morris@onyxtech.edu',
      role: 'Dean of Technology',
    },
    category: {
      id: 'cat-tech',
      name: 'Architecture & Tech',
      slug: 'architecture-tech',
      description: 'Technical deep dives into multi-tenant web engineering.',
    },
    tags: ['Architecture', 'Multi-Tenancy', 'Next.js', 'Firebase'],
    featuredImageUrl: '/images/blog/multi-tenant-arch.jpg',
    featuredImageAlt: 'Multi-Tenant Architecture Diagram',
    readingTimeMinutes: 6,
    metadata: {
      metaTitle: 'Scaling Multi-Tenant Architecture for Higher Education',
      metaDescription: 'Learn how to architect isolated multi-tenant workspaces for universities using subdomains and quota tracking.',
      keywords: ['Multi-Tenant', 'Software Architecture', 'Higher Ed'],
    },
    publishedAt: '2026-07-25T14:30:00.000Z',
    createdAt: '2026-07-22T09:00:00.000Z',
    updatedAt: '2026-07-25T14:30:00.000Z',
  },
];

export function getPublishedArticles(): ContentArticle[] {
  return MOCK_CONTENT_ARTICLES.filter((article) => article.status === 'published');
}

export function getArticleBySlug(slug: string): ContentArticle | undefined {
  return MOCK_CONTENT_ARTICLES.find((article) => article.slug === slug);
}

export function filterArticles(options: {
  status?: ContentPublicationStatus;
  type?: ContentType;
  categorySlug?: string;
  searchQuery?: string;
}): ContentArticle[] {
  return MOCK_CONTENT_ARTICLES.filter((article) => {
    if (options.status && article.status !== options.status) return false;
    if (options.type && article.type !== options.type) return false;
    if (options.categorySlug && article.category.slug !== options.categorySlug) return false;
    if (options.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      const matchesTitle = article.title.toLowerCase().includes(q);
      const matchesExcerpt = article.excerpt.toLowerCase().includes(q);
      const matchesTags = article.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchesTitle && !matchesExcerpt && !matchesTags) return false;
    }
    return true;
  });
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
