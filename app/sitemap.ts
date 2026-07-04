import { MetadataRoute } from 'next'
import { getFabrics } from '@/lib/db'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let fabrics = []
  try {
    // Only attempt to fetch if we have a database connection
    if (process.env.DATABASE_URL) {
      fabrics = await getFabrics() as any[]
    }
  } catch (error) {
    // Silent fail for build time if db isn't reachable
  }

  const fabricEntries: MetadataRoute.Sitemap = fabrics.map((fabric) => ({
    url: `https://houseofjoy.vercel.app/fabrics/${fabric.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://houseofjoy.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...fabricEntries,
  ]
}
