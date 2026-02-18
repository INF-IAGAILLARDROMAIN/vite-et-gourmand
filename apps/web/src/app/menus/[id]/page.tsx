import type { Metadata } from 'next';
import MenuDetailClient from './MenuDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function getMenu(id: string) {
  try {
    const res = await fetch(`${API_URL}/menus/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const menu = await getMenu(id);

  if (!menu) {
    return { title: 'Menu introuvable' };
  }

  return {
    title: menu.titre,
    description: menu.description,
    openGraph: {
      title: `${menu.titre} | Vite & Gourmand`,
      description: menu.description,
      type: 'website',
      images: menu.images?.[0]?.url
        ? [{ url: menu.images[0].url, alt: menu.images[0].alt || menu.titre }]
        : undefined,
    },
  };
}

export default async function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MenuDetailClient menuId={parseInt(id)} />;
}
