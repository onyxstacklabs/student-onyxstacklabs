import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/metadataEngine';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/_next/',
          '/static/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.baseUrl}/sitemap.xml`,
    host: SITE_CONFIG.baseUrl,
  };
}
