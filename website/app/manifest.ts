import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GitHint',
    short_name: 'GitHint',
    description:
      'Local Conventional Commit suggestions from staged Git changes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0d1117',
    icons: [
      {
        src: '/githint-logo.png',
        sizes: '1250x1250',
        type: 'image/png',
      },
    ],
  };
}
