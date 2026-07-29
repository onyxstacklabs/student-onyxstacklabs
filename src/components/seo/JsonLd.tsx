import React from 'react';
import { ContentArticle } from '@/types/content';
import { SITE_CONFIG } from '@/lib/seo/metadataEngine';

interface JsonLdProps {
  type: 'Organization' | 'SoftwareApplication' | 'Article';
  article?: ContentArticle;
}

export function JsonLd({ type, article }: JsonLdProps) {
  let schemaData: Record<string, unknown> = {};

  if (type === 'Organization') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl}/logo.png`,
      sameAs: [
        'https://twitter.com/OnyxStackLabs',
        'https://github.com/onyxstacklabs',
        'https://www.producthunt.com/@onyxstacklabs',
      ],
    };
  } else if (type === 'SoftwareApplication') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_CONFIG.name,
      operatingSystem: 'Web',
      applicationCategory: 'EducationalApplication',
      offers: {
        '@type': 'Offer',
        price: '12.00',
        priceCurrency: 'USD',
      },
      publisher: {
        '@type': 'Organization',
        name: 'OnyxStackLabs',
        url: SITE_CONFIG.baseUrl,
      },
    };
  } else if (type === 'Article' && article) {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      image: article.featuredImageUrl || SITE_CONFIG.defaultOgImage,
      datePublished: article.publishedAt || article.createdAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        name: article.author.name,
        jobTitle: article.author.role,
      },
      publisher: {
        '@type': 'Organization',
        name: 'OnyxStackLabs',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_CONFIG.baseUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_CONFIG.baseUrl}/blog/${article.slug}`,
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
