import { useState } from "react"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider as SupabaseProvider } from "@supabase/auth-helpers-react"
import { SessionProvider as AuthProvider } from "next-auth/react"
import Layout from "@/components/Layout"
import "@/styles/globals.css"

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)

  return (
    <AuthProvider session={pageProps.session}>
      <SupabaseProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
        {getLayout(<Component {...pageProps} />)}
      </SupabaseProvider>
    </AuthProvider>
  )
}
