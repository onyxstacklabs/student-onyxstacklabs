import { Metadata } from 'next';
import { ContentMetadata } from '@/types/content';

export const SITE_CONFIG = {
  name: 'CampusOS',
  domain: 'Student.OnyxStackLabs.com',
  baseUrl: 'https://Student.OnyxStackLabs.com',
  defaultDescription:
    'CampusOS is an all-in-one platform for schools, colleges, and universities — attendance, grades, fees, timetables, AI-powered learning support, and campus safety, all in one place.',
  defaultOgImage: 'https://Student.OnyxStackLabs.com/og-default.jpg',
  twitterHandle: '@OnyxStackLabs',
  // Aliases used by root layout.tsx metadata block — kept in sync with the fields above.
  title: 'CampusOS — Campus Management, Simplified',
  siteName: 'CampusOS',
  description:
    'CampusOS is an all-in-one platform for schools, colleges, and universities — attendance, grades, fees, timetables, AI-powered learning support, and campus safety, all in one place.',
  url: 'https://Student.OnyxStackLabs.com',
  agencyName: 'OnyxStack Labs',
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
    : SITE_CONFIG.title;
  const description = options.description || SITE_CONFIG.defaultDescription;
  const canonicalUrl = options.slug
    ? `${SITE_CONFIG.baseUrl}/${options.slug.replace(/^\//, '')}`
    : SITE_CONFIG.baseUrl;
  const ogImage = options.ogImageUrl || SITE_CONFIG.defaultOgImage;

  return {
    title: fullTitle,
    description: description,
    keywords: options.keywords || ['school management software', 'college ERP', 'student attendance app', 'campus management system', 'AI learning assistant'],
    authors: [{ name: SITE_CONFIG.agencyName, url: SITE_CONFIG.baseUrl }],
    creator: SITE_CONFIG.agencyName,
    publisher: SITE_CONFIG.agencyName,
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
      siteName: SITE_CONFIG.siteName,
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
