import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mode, setMode] = useState<"request" | "reset">("request");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      setMode("reset");
    }
  }, []);

  const handleRequest = async () => {
    setLoading(true);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setMessage(error ? `❌ ${error.message}` : "✅ Lien envoyé à votre email.");
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Mot de passe mis à jour. Redirection...");
      setTimeout(() => router.push("/login"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold text-center text-orange-600">
          🔐 Réinitialisation du mot de passe
        </h1>

        {message && <p className="text-sm text-center text-gray-700">{message}</p>}

        {mode === "request" ? (
          <>
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />
            <button
              type="button"
              onClick={handleRequest}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
            >
              {loading ? "Envoi en cours..." : "📩 Envoyer le lien"}
            </button>
          </>
        ) : (
          <>
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />
            <button
              type="button"
              onClick={handleReset}
              disabled={loading || !newPassword}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
            >
              {loading ? "Mise à jour..." : "✅ Réinitialiser"}
            </button>
          </>
        )}

        <p className="text-sm text-center text-gray-600">
          <a href="/login" className="text-orange-600 hover:underline">← Retour à la connexion</a>
        </p>
      </form>
    </div>
  );
}

ResetPassword.getLayout = function PageLayout(page) {
  return <>{page}</>;
};