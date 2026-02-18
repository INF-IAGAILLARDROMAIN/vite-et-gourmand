import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FoodEstablishment',
      name: 'Vite & Gourmand',
      description: 'Traiteur événementiel à Bordeaux. Menus raffinés pour tous vos événements.',
      servesCuisine: 'French',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '12 Rue Sainte-Catherine',
        addressLocality: 'Bordeaux',
        postalCode: '33000',
        addressRegion: 'Nouvelle-Aquitaine',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 44.8378,
        longitude: -0.5792,
      },
      telephone: '+33556000000',
      url: 'https://vite-et-gourmand-rust.vercel.app',
      priceRange: '€€',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '3',
        bestRating: '5',
      },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '18:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '19:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '17:00' },
      ],
      image: 'https://vite-et-gourmand-rust.vercel.app/images/og-image.jpg',
      sameAs: ['https://github.com/INF-IAGAILLARDROMAIN/vite-et-gourmand'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Vite & Gourmand',
      url: 'https://vite-et-gourmand-rust.vercel.app',
    },
  ];

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
