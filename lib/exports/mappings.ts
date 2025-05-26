export const ubiflowTypeMapping: Record<string, string> = {
    "Bien immobilier": "0",
    "Bien habitation (particuliers)": "1000",
    "Appartement": "1100",
    "Appartement ancien": "1111",
    "Appartement bourgeois": "1112",
    "Appartement à rénover": "1113",
    "Appartement rénové": "1114",
    "Appartement récent": "1115",
    "Appartement neuf": "1116",
    "Chambre": "1131",
    "Studio": "1132",
    "T1": "1133",
    "T1 bis": "1134",
    "T2": "1135",
    "T3": "1136",
    "T4": "1137",
    "T5": "1138",
    "T6 et plus": "1139",
    "Habitation de loisirs": "1180",
    "Autre": "1190",
    "Loft": "1191",
    "Duplex/Triplex": "1192",
    "Meublé": "1193",
    "Penthouse": "1194",
    "Maison": "1200",
    "Bien d'entreprise ou commerce (professionnels)": "2000",
  };
  
  // Liste de mots-clés associés à chaque type pour matching souple
  const ubiflowKeywords: { keywords: string[]; code: string }[] = [
    { keywords: ["appartement ancien"], code: "1111" },
    { keywords: ["appartement bourgeois"], code: "1112" },
    { keywords: ["appartement à rénover", "à rénover"], code: "1113" },
    { keywords: ["appartement rénové"], code: "1114" },
    { keywords: ["appartement récent", "appartement contemporain"], code: "1115" },
    { keywords: ["appartement neuf"], code: "1116" },
    { keywords: ["chambre étudiant"], code: "1131" },
    { keywords: ["studio"], code: "1132" },
    { keywords: ["t1", "type 1", "f1"], code: "1133" },
    { keywords: ["t1 bis", "type 1 bis", "f1 bis"], code: "1134" },
    { keywords: ["t2", "type 2", "f2"], code: "1135" },
    { keywords: ["t3", "type 3", "f3"], code: "1136" },
    { keywords: ["t4", "type 4", "f4"], code: "1137" },
    { keywords: ["t5", "type 5", "f5"], code: "1138" },
    { keywords: ["t6", "t7", "t8", "type 6", "type 7", "type 8", "f6", "f7", "f8"], code: "1139" },
    { keywords: ["loft"], code: "1191" },
    { keywords: ["duplex", "triplex"], code: "1192" },
    { keywords: ["meublé"], code: "1193" },
    { keywords: ["penthouse"], code: "1194" },
    { keywords: ["maison"], code: "1200" },
    { keywords: ["villa"], code: "1213" },
    { keywords: ["terrain"], code: "1300" },
    { keywords: ["parking", "garage", "stationnement"], code: "1400" },
    { keywords: ["immeuble"], code: "1500" },
    { keywords: ["local", "commerce", "bureau", "entreprise"], code: "2000" },
  ];
  
  /**
   * Retourne le code_type Ubiflow à partir du type ou de la description du bien.
   */
  export function getUbiflowCodeType(typeLabel: string, description = ""): string {
    const text = `${typeLabel} ${description}`.toLowerCase();
  
    // Matching par mot-clé d'abord
    for (const { keywords, code } of ubiflowKeywords) {
      if (keywords.some((kw) => text.includes(kw))) {
        return code;
      }
    }
  
    // Matching exact par label
    const found = Object.entries(ubiflowTypeMapping).find(([label]) =>
      text.includes(label.toLowerCase())
    );
  
    return found ? found[1] : "1000"; // Fallback générique : Bien habitation (particuliers)
  }
  