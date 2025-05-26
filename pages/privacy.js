export default function PolitiqueConfidentialite() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">🔒 Politique de confidentialité</h1>

      <p><strong>Collecte des données :</strong><br />
      Nous collectons uniquement les informations nécessaires à l’utilisation du logiciel CRM, notamment :<br />
      - Nom, prénom, email (via compte utilisateur)<br />
      - Informations professionnelles (ville, téléphone, bio, photo)<br />
      - Accès aux agendas Google (si autorisé)</p>

      <p><strong>Utilisation des données :</strong><br />
      Ces données sont utilisées exclusivement pour :<br />
      - Gérer les comptes agents<br />
      - Organiser et planifier les activités (agenda)<br />
      - Fournir un suivi des biens et des prospects</p>

      <p><strong>Stockage et sécurité :</strong><br />
      Les données sont hébergées de manière sécurisée sur Supabase et ne sont jamais revendues ni partagées à des tiers non autorisés.</p>

      <p><strong>Droits des utilisateurs :</strong><br />
      Conformément à la réglementation, vous pouvez demander l’accès, la rectification ou la suppression de vos données en contactant : <a href="mailto:ctudela@groupe-ass.com" className="underline text-orange-600">ctudela@groupe-ass.com</a></p>
    </div>
  )
}
