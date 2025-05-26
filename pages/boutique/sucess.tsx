import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-4xl font-bold text-green-700 mb-4">✅ Merci pour votre achat !</h1>
      <p className="text-lg text-green-600 mb-6">
        Votre commande a été confirmée. Nous la préparons avec soin.
      </p>
      <Link href="/boutique">
        <a className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow">
          Retour à la boutique
        </a>
      </Link>
    </div>
  );
}
