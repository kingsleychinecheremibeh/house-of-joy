import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'House of Joy',
    short_name: 'House of Joy',
    description: 'Premium Lace, Sequins & Asoebi Fabrics. Order on WhatsApp.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#faf9f6', // cream — matches the website
    theme_color: '#faf9f6',      // makes the status bar match on Android
    categories: ['shopping', 'lifestyle'],
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
