import type { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function getMenuIds(): Promise<number[]> {
  try {
    const res = await fetch(`${API_URL}/menus`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const menus = await res.json();
    return menus.map((m: { id: number }) => m.id);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vite-et-gourmand-rust.vercel.app';

  const menuIds = await getMenuIds();

  const menuPages: MetadataRoute.Sitemap = menuIds.map((id) => ({
    url: `${baseUrl}/menus/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/menus`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...menuPages,
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/connexion`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/inscription`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cgv`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
