import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description: 'Conditions générales de vente du service traiteur Vite & Gourmand.',
};

export default function CGVPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-8">
          Conditions Générales de Vente
        </h1>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">1. Objet</h2>
            <p className="text-slate-600 leading-relaxed">
              Les présentes conditions générales de vente régissent les relations contractuelles entre
              la société Vite & Gourmand et ses clients dans le cadre de prestations de traiteur
              événementiel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">2. Commandes</h2>
            <p className="text-slate-600 leading-relaxed">
              Toute commande passée sur le site constitue un contrat de vente. La commande est confirmée
              par email une fois validée par nos équipes. Le nombre minimum de personnes est indiqué pour
              chaque menu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">3. Tarifs</h2>
            <p className="text-slate-600 leading-relaxed">
              Les prix sont indiqués en euros TTC. Le prix total de la commande comprend le prix du menu
              (prix par personne × nombre de personnes) et les frais de livraison.
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li><strong>Livraison à Bordeaux :</strong> gratuite</li>
              <li><strong>Hors Bordeaux :</strong> 5,00 € + 0,59 € / km (base 20 km)</li>
              <li><strong>Réduction :</strong> 10 % de remise si le nombre de personnes dépasse le minimum de 5 ou plus</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">4. Livraison et matériel</h2>
            <p className="text-slate-600 leading-relaxed">
              La livraison est assurée à la date et à l&apos;heure indiquées lors de la commande.
              Le matériel (vaisselle, couverts, nappes) est mis à disposition et doit être restitué
              sous 48 heures après l&apos;événement. Tout matériel non retourné sera facturé.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">5. Annulation</h2>
            <p className="text-slate-600 leading-relaxed">
              Toute annulation est possible tant que la commande est au statut &quot;Reçue&quot;.
              Une fois la commande acceptée ou en préparation, l&apos;annulation n&apos;est plus possible.
              Aucun remboursement ne sera effectué pour les commandes annulées tardivement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">6. Allergènes</h2>
            <p className="text-slate-600 leading-relaxed">
              La liste des allergènes est disponible pour chaque plat. Il est de la responsabilité du
              client de vérifier la présence d&apos;allergènes avant de passer commande. En cas d&apos;allergie
              non signalée, Vite & Gourmand ne pourra être tenu responsable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">7. Réclamations et avis</h2>
            <p className="text-slate-600 leading-relaxed">
              Les clients peuvent déposer un avis après la réalisation de leur prestation (commande au
              statut &quot;Terminée&quot;). Les avis sont modérés avant publication. Toute réclamation
              doit être adressée par email à contact@viteetgourmand.fr dans un délai de 7 jours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold text-slate-800">8. Droit applicable</h2>
            <p className="text-slate-600 leading-relaxed">
              Les présentes CGV sont soumises au droit français. En cas de litige, les parties
              s&apos;engagent à rechercher une solution amiable. À défaut, les tribunaux de Bordeaux
              seront compétents.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
