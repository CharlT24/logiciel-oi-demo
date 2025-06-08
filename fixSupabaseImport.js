// fixSupabaseImport.js
const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();

function scanAndFix(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanAndFix(fullPath);
    } else if (entry.isFile() && fullPath.match(/\.(js|ts|jsx|tsx)$/)) {
      let content = fs.readFileSync(fullPath, "utf8");

      const incorrect = `import supabase from "@/lib/supabaseClient"`;
      const correct = `import supabase from "@/lib/supabaseClient"`;

      if (content.includes(incorrect)) {
        const updated = content.replace(incorrect, correct);
        fs.writeFileSync(fullPath, updated, "utf8");
        console.log(`✅ Corrigé : ${fullPath}`);
      }
    }
  }
}

console.log("🔍 Correction des imports incorrects de Supabase...");
scanAndFix(rootDir);
console.log("✅ Terminé !");
