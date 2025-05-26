#!/bin/bash

echo "🔧 Correction des chemins '@/components/layout' en chemins relatifs..."

find . -type f -name "*.js" -exec sed -i '' 's|@/components/layout|../../../components/layout|g' {} +

echo "📦 Installation de nodemailer..."
npm install nodemailer

echo "🧠 Création de jsconfig.json pour alias '@/...' (utile en dev local)..."
cat <<EOT > jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
EOT

echo "✅ Terminé ! Tu peux maintenant git add, commit et push vers Vercel ✨"
