#!/bin/bash

echo "🔍 Recherche des fichiers contenant 'import { supabase } from '@/lib/supabaseClient''..."

grep -rl "import { supabase } from '@/lib/supabaseClient'" . \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=types \
  --exclude-dir=.git > files_to_fix.txt

echo "�� Fichiers trouvés :"
cat files_to_fix.txt

echo ""
echo "⚙️ Remplacement en cours..."

while IFS= read -r file; do
  sed -i '' "s|import { supabase } from '@/lib/supabaseClient'|import supabase from '@/lib/supabaseClient'|g" \"$file\"
  echo \"✅ Modifié : $file\"
done < files_to_fix.txt

echo ""
echo "🚀 Tous les remplacements sont faits. Pense à faire :"
echo "git add ."
echo "git commit -m 'Corrige tous les imports supabase en default import'"
echo "git push origin main"

