import Link from 'next/link';
import { ChefHat, Truck, Users, Star, ArrowRight, Utensils, Clock, Shield } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Vite & Gourmand',
    description: 'Traiteur événementiel à Bordeaux. Menus raffinés pour tous vos événements.',
    servesCuisine: 'French',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '12 Rue Sainte-Catherine',
      addressLocality: 'Bordeaux',
      postalCode: '33000',
      addressCountry: 'FR',
    },
    telephone: '+33556000000',
    url: 'https://vite-et-gourmand.fr',
    priceRange: '€€',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
