import { Metadata } from 'next';
import { ContentMetadata } from '@/types/content';

export const SITE_CONFIG = {
  name: 'Onyx Enterprise Student SaaS Platform',
  domain: 'Student.OnyxStackLabs.com',
  baseUrl: 'https://Student.OnyxStackLabs.com',
  defaultDescription:
    'An enterprise multi-tenant campus governance and AI-assisted learning platform built for higher education institutions.',
  defaultOgImage: 'https://Student.OnyxStackLabs.com/og-default.jpg',
  twitterHandle: '@OnyxStackLabs',
  // Aliases used by root layout.tsx metadata block — kept in sync with the fields above.
  title: 'Onyx Enterprise Student SaaS Platform',
  siteName: 'OnyxStack Labs',
  description:
    'An enterprise multi-tenant campus governance and AI-assisted learning platform built for higher education institutions.',
  url: 'https://Student.OnyxStackLabs.com',
};

export interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  slug?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function generatePageMetadata(options: GenerateMetadataOptions): Metadata {
  const fullTitle = options.title
    ? `${options.title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.name;
  const description = options.description || SITE_CONFIG.defaultDescription;
  const canonicalUrl = options.slug
    ? `${SITE_CONFIG.baseUrl}/${options.slug.replace(/^\//, '')}`
    : SITE_CONFIG.baseUrl;
  const ogImage = options.ogImageUrl || SITE_CONFIG.defaultOgImage;

  return {
    title: fullTitle,
    description: description,
    keywords: options.keywords || ['EdTech', 'SaaS', 'Multi-Tenant', 'University Governance', 'AI Learning'],
    authors: [{ name: 'OnyxStackLabs Team', url: SITE_CONFIG.baseUrl }],
    creator: 'OnyxStackLabs',
    publisher: 'OnyxStackLabs',
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !options.noIndex,
      follow: !options.noIndex,
      googleBot: {
        index: !options.noIndex,
        follow: !options.noIndex,
      },
    },
    openGraph: {
      title: fullTitle,
      description: description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: options.title || SITE_CONFIG.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      creator: SITE_CONFIG.twitterHandle,
      images: [ogImage],
    },
  };
}

export function generateArticleMetadata(contentMeta: ContentMetadata, slug: string): Metadata {
  return generatePageMetadata({
    title: contentMeta.metaTitle,
    description: contentMeta.metaDescription,
    slug: `blog/${slug}`,
    ogImageUrl: contentMeta.ogImageUrl,
    noIndex: contentMeta.noIndex,
    keywords: contentMeta.keywords,
  });
}
