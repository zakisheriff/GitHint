import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://githint.theatom.lk/sitemap.xml',
    host: 'https://githint.theatom.lk',
  };
}
