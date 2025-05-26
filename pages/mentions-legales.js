export default function MentionsLegales() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-gray-800 space-y-10">
      <h1 className="text-3xl font-bold text-orange-600">📜 Mentions légales & CGU</h1>

      {/* Section 1 - Mentions légales */}
      <section>
        <h2 className="text-xl font-semibold">1. Éditeur du site</h2>
        <p>
          Le présent site est édité par <strong>Open I</strong>, société innovante spécialisée dans le développement de solutions logicielles pour les professionnels de l’immobilier.
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
          <li>Raison sociale : Open I</li>
          <li>Adresse : 12 rue de l'Innovation, 75000 Paris</li>
          <li>Email : contact@openimmobilier.immo</li>
          <li>SIRET : 123 456 789 00012</li>
        </ul>
      </section>

      {/* Section 2 - Hébergement */}
      <section>
        <h2 className="text-xl font-semibold">2. Hébergement</h2>
        <p>
          Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA —{" "}
          <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-orange-600 underline">
            vercel.com
          </a>
        </p>
      </section>

      {/* Section 3 - Propriété intellectuelle */}
      <section>
        <h2 className="text-xl font-semibold">3. Propriété intellectuelle</h2>
        <p>
          Tous les contenus (textes, codes, images, logo, interface) sont la propriété exclusive de Open I. Toute reproduction ou diffusion sans autorisation écrite est interdite.
        </p>
      </section>

      {/* Section 4 - Données personnelles */}
      <section>
        <h2 className="text-xl font-semibold">4. Données personnelles (RGPD)</h2>
        <p>
          Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données.
          Pour toute demande :{" "}
          <a href="mailto:contact@openimmobilier.immo" className="text-orange-600 underline">
            contact@openimmobilier.immo
          </a>
        </p>
      </section>

      {/* Section 5 - Cookies */}
      <section>
        <h2 className="text-xl font-semibold">5. Cookies</h2>
        <p>
          Ce site utilise des cookies à des fins de fonctionnement et d'analyse. Vous pouvez les désactiver via les paramètres de votre navigateur.
        </p>
      </section>

      {/* Section 6 - Conditions Générales d’Utilisation */}
      <section>
        <h2 className="text-2xl font-bold text-orange-500 mt-10">🧾 Conditions Générales d’Utilisation (CGU)</h2>
        <h3 className="text-lg font-semibold mt-4">1. Accès au site</h3>
        <p>
          Le site est accessible 24h/24, 7j/7, sauf en cas de maintenance ou force majeure. L’accès nécessite une connexion internet et un équipement compatible.
        </p>

        <h3 className="text-lg font-semibold mt-4">2. Responsabilités</h3>
        <p>
          Open I ne peut être tenue responsable des dommages liés à l’utilisation du site. L’utilisateur s’engage à ne pas nuire au bon fonctionnement du service.
        </p>

        <h3 className="text-lg font-semibold mt-4">3. Compte utilisateur</h3>
        <p>
          L’utilisateur s’engage à maintenir la confidentialité de ses identifiants et à utiliser le service de manière loyale et responsable.
        </p>
      </section>

      {/* Section 7 - Politique de confidentialité */}
      <section>
        <h2 className="text-2xl font-bold text-orange-500 mt-10">🔒 Politique de confidentialité</h2>
        <p>
          Vos données sont collectées uniquement pour les besoins du service (connexion, gestion client, historique). Elles ne sont en aucun cas vendues à des tiers.
        </p>

        <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
          <li>Données stockées de manière sécurisée (via Supabase)</li>
          <li>Accès réservé aux utilisateurs autorisés uniquement</li>
          <li>Suppression sur simple demande</li>
        </ul>
      </section>

      {/* Footer */}
      <p className="text-sm text-gray-400 mt-12">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
    </div>
  )
}
