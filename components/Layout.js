import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";

export default function Layout({ children }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pagesSansSidebar = ["/login", "/register"];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data: userData } = await supabase
          .from("utilisateurs")
          .select("role")
          .eq("id", userId)
          .single();

        if (userData?.role === "admin") {
          setIsAdmin(true);
        }
      }
    };

    fetchUser();
    setIsMounted(true);
  }, []);

  const handleChatClick = () => {
    window.open(
      "https://cdn.botpress.cloud/webchat/v2.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/04/12/14/20250412141501-0QE2INQG.json",
      "_blank"
    );
  };

  if (pagesSansSidebar.includes(router.pathname)) {
    return <main>{children}</main>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-white text-gray-800 font-inter">
      <aside className="w-64 bg-white p-6 shadow-xl rounded-tr-3xl rounded-br-3xl border-r border-gray-200 space-y-4 transition-all">
        <div
          className="flex items-center justify-start cursor-pointer mb-6"
          onClick={() => router.push("/dashboard")}
        >
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="mr-2" />
          <span className="text-xl font-extrabold text-orange-500 tracking-tight">
            Mon Agence
          </span>
        </div>

        <button onClick={() => router.push("/dashboard")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          📊 Tableau de bord
        </button>
        <button onClick={() => router.push("/clients")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          👥 Clients
        </button>
        <button onClick={() => router.push("/biens")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          🏡 Biens
        </button>
        <button onClick={() => router.push("/mandats")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          🧾 Numéros de mandat
        </button>
        <button onClick={() => router.push("/immopro")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          🏢 immopro
        </button>
        <button onClick={() => router.push("/rapprochement")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          🔗 Rapprochement
        </button>
        <button onClick={() => router.push("/agents")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          🧑‍💼 Agents
        </button>
        <button onClick={() => router.push("/export")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          📤 Export
        </button>
        <button onClick={() => router.push("/boutique")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          🛒 Boutique
        </button>

        {isAdmin && (
          <button onClick={() => router.push("/agenda")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
            📅 Agenda
          </button>
        )}

        <button onClick={() => window.open("https://www.a2sformation.com", "_blank")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          🎓 Formation
        </button>
        <button onClick={() => router.push("/parametres")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
          ⚙️ Paramètres
        </button>

        {isAdmin && (
          <>
            <button onClick={() => router.push("/prospects")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
              📬 Prospects
            </button>
            <button onClick={() => router.push("/crypto")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
              ₿ Crypto
            </button>
            <button onClick={() => router.push("/admin")} className="block w-full text-left py-2 px-3 rounded hover:bg-orange-100 transition">
              ⚙️ Admin
            </button>
          </>
        )}

        <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="block w-full text-left py-2 px-3 rounded text-red-600 hover:bg-red-100 transition"
          >
            🚪 Déconnexion
          </button>

          <div className="text-xs text-gray-400 mt-2 space-x-2 text-center">
            <a href="/mentions" className="hover:underline">
              Mentions légales
            </a>{" "}
            |{" "}
            <a href="/privacy" className="hover:underline">
              Confidentialité
            </a>{" "}
            |{" "}
            <a href="/terms" className="hover:underline">
              CGU
            </a>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 bg-white rounded-tl-3xl shadow-inner overflow-y-auto relative">
        {children}
      </main>

      <button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        🤖 Besoin d'aide ?
      </button>
    </div>
  );
}
