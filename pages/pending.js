export default function PendingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-yellow-100 text-center px-4">
      <div className="bg-white p-6 rounded shadow max-w-md">
        <h1 className="text-2xl font-bold mb-4">⏳ Accès en attente</h1>
        <p className="text-gray-700">
          Ton compte est bien enregistré mais il n'est pas encore activé.<br />
          Un administrateur va valider ton accès très bientôt.<br /><br />
          ⏱️ Merci de ta patience 🙏<br />
          Tu peux fermer cette page, tu recevras un accès dès que validé.
        </p>
      </div>
    </div>
  )
}
