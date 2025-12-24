import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ProKit',
    short_name: 'ProKit',
    description: 'A suite of high-performance developer tools for AI, Security, and DNS.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.svg', // Using the svg you already have
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
