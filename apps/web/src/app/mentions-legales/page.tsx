import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site Vite & Gourmand, traiteur événementiel à Bordeaux.',
};

export default function MentionsLegalesPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-8">
          Mentions légales
        </h1>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">1. Éditeur du site</h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>Raison sociale :</strong> Vite & Gourmand SARL<br />
              <strong>Siège social :</strong> 12 Rue Sainte-Catherine, 33000 Bordeaux<br />
              <strong>SIRET :</strong> 123 456 789 00012<br />
              <strong>Téléphone :</strong> 05 56 00 00 00<br />
              <strong>Email :</strong> contact@viteetgourmand.fr<br />
              <strong>Directeur de publication :</strong> Jean Dupont
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">2. Hébergement</h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>Hébergeur :</strong> Vercel Inc.<br />
              <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
              <strong>Site :</strong> vercel.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">3. Propriété intellectuelle</h2>
            <p className="text-slate-600 leading-relaxed">
              L&apos;ensemble du contenu du site Vite & Gourmand (textes, images, logos, icônes, etc.)
              est protégé par le droit d&apos;auteur. Toute reproduction, même partielle, est interdite
              sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">4. Protection des données personnelles</h2>
            <p className="text-slate-600 leading-relaxed">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
              Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès, de rectification et de
              suppression de vos données personnelles. Pour exercer ce droit, contactez-nous à
              l&apos;adresse : contact@viteetgourmand.fr
            </p>
            <p className="text-slate-600 leading-relaxed">
              Les données collectées (nom, email, adresse, téléphone) sont utilisées uniquement pour
              le traitement des commandes et la communication avec nos clients. Elles ne sont jamais
              cédées à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">5. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              Ce site utilise des cookies techniques nécessaires à son fonctionnement (authentification,
              préférences). Aucun cookie publicitaire ou de traçage n&apos;est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">6. Litiges</h2>
            <p className="text-slate-600 leading-relaxed">
              Le présent site est soumis au droit français. En cas de litige, les tribunaux de
              Bordeaux seront seuls compétents.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
