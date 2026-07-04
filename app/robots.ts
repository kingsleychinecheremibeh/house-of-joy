import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // We don't want Google indexing the admin page
    },
    sitemap: 'https://houseofjoy.vercel.app/sitemap.xml',
  }
}
