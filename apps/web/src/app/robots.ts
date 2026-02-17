import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/mon-compte/'],
      },
    ],
    sitemap: 'https://vite-et-gourmand.fr/sitemap.xml',
  };
}
