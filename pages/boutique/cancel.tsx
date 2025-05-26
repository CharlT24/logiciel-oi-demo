import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-4xl font-bold text-red-700 mb-4">❌ Paiement annulé</h1>
      <p className="text-lg text-red-600 mb-6">
        Votre paiement a été annulé. Vous pouvez réessayer à tout moment.
      </p>
      <Link href="/boutique">
        <a className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded shadow">
          Retour à la boutique
        </a>
      </Link>
    </div>
  );
}
