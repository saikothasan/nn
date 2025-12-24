import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools-config'; // Ensure this path matches your project structure

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://prokit.uk';

  // 1. Define your static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Map over your tools config to generate dynamic routes
  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/tool/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8, // High priority for your main content pages
  }));

  // 3. Combine and return
  return [...staticRoutes, ...toolRoutes];
}
