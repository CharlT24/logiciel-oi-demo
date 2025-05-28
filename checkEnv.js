console.log('🔍 Vérification des variables d’environnement :\n');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ SUPABASE_URL est manquant');
} else {
  console.log('✅ SUPABASE_URL chargé :', supabaseUrl);
}

if (!supabaseAnonKey) {
  console.error('❌ SUPABASE_ANON_KEY est manquant');
} else {
  console.log('✅ SUPABASE_ANON_KEY chargé :', supabaseAnonKey.slice(0, 10) + '...');
}

console.log('\n👉 Si une variable est manquante, vérifie ton fichier .env local ou les variables sur Vercel.');

