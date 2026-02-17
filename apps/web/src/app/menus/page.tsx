import type { Metadata } from 'next';
import MenusClient from './MenusClient';

export const metadata: Metadata = {
  title: 'Nos Menus',
  description: 'Découvrez nos menus traiteur pour tous vos événements : mariages, séminaires, anniversaires. Filtres par thème, régime et budget.',
};

export default function MenusPage() {
  return <MenusClient />;
}
