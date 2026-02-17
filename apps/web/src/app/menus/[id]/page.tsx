import MenuDetailClient from './MenuDetailClient';

export default async function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MenuDetailClient menuId={parseInt(id)} />;
}
