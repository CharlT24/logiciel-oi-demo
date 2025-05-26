import { Buffer } from "buffer";
import axios from "axios";

interface WordPressExportOptions {
  wpUrl: string;
  username: string;
  appPassword: string;
  postType?: string;
  bien: {
    id: string;
    titre: string;
    description?: string;
    prix_vente?: number;
    honoraires?: number;
    prix_net_vendeur?: number;
    pourcentage_honoraires?: number;
    surface_m2?: number;
    ville?: string;
    code_postal?: string;
    nb_pieces?: number;
    nb_chambres?: number;
    etage?: number;
    type_bien?: string;
    statut?: string;
    mandat?: string;
    annee_construction?: number;
    type_chauffage?: string;
    mode_chauffage?: string;
    terrain_m2?: number;
    surface_carrez?: number;
    options?: string[];
    dpe?: string;
    dpe_conso_indice?: number;
    dpe_ges_indice?: number;
    dpe_cout_min?: number;
    dpe_cout_max?: number;
    agent_id?: string;
    cover_url?: string;
    gallery?: string[];
  };
}

export async function exportToWordPress({
  wpUrl,
  username,
  appPassword,
  postType = "bien",
  bien
}: WordPressExportOptions) {
  const auth = Buffer.from(`${username}:${appPassword}`).toString("base64");
  const headers = {
    Authorization: `Basic ${auth}`
  };

  let mediaId: number | null = null;

  if (bien.cover_url) {
    const imageResp = await axios.get(bien.cover_url, { responseType: "arraybuffer" });
    const fileName = bien.cover_url.split("/").pop() || "photo.jpg";

    const uploadResp = await axios.post(
      `${wpUrl}/wp-json/wp/v2/media`,
      imageResp.data,
      {
        headers: {
          ...headers,
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Type": "image/jpeg"
        }
      }
    );

    mediaId = uploadResp.data.id;
  }

  const postData = {
    title: bien.titre,
    content: bien.description || "Pas de description fournie.",
    status: "publish",
    featured_media: mediaId || undefined,
    meta: {
      prix_vente: bien.prix_vente,
      honoraires: bien.honoraires,
      prix_net_vendeur: bien.prix_net_vendeur,
      pourcentage_honoraires: bien.pourcentage_honoraires,
      surface_m2: bien.surface_m2,
      ville: bien.ville,
      code_postal: bien.code_postal,
      nb_pieces: bien.nb_pieces,
      nb_chambres: bien.nb_chambres,
      etage: bien.etage,
      type_bien: bien.type_bien,
      statut: bien.statut,
      mandat: bien.mandat,
      annee_construction: bien.annee_construction,
      type_chauffage: bien.type_chauffage,
      mode_chauffage: bien.mode_chauffage,
      surface_terrain: bien.terrain_m2,
      surface_carrez: bien.surface_carrez,
      options: bien.options?.join(", "),
      dpe: bien.dpe,
      dpe_conso_indice: bien.dpe_conso_indice,
      dpe_ges_indice: bien.dpe_ges_indice,
      dpe_cout_min: bien.dpe_cout_min,
      dpe_cout_max: bien.dpe_cout_max,
      agent_nom: bien.agent_id,
      supabase_id: bien.id,
      cover: true,
      gallery: JSON.stringify(bien.gallery || [])
    }
  };

  console.log("✅ Options préparées :", bien.options);

  console.log("🧪 Données bien exportées :", postData);

  const post = await axios.post(
    `${wpUrl}/wp-json/wp/v2/${postType}`,
    postData,
    { headers }
  );

  return post.data;
}
