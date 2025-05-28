import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function AvatarUploader({ userId, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);

    try {
      // 📸 Conversion de l'image en JPEG
      const imageBitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(imageBitmap, 0, 0);

      const jpegBlob: Blob = await new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(blob as Blob), "image/jpeg", 0.9)
      );

      const fileName = `avatars/${userId}.jpg`;

      // 📤 Upload vers Supabase (format JPEG uniquement)
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, jpegBlob, { upsert: true });

      if (uploadError) {
        console.error("❌ Upload échoué :", uploadError.message);
        alert("❌ Erreur lors de l'envoi de la photo.");
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from("photos").getPublicUrl(fileName);
      if (data?.publicUrl) {
        onUpload(data.publicUrl);
      }
    } catch (err) {
      console.error("❌ Erreur de conversion :", err);
      alert("❌ Échec de traitement de l'image.");
    }

    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && (
        <p className="text-sm text-gray-500">📤 Envoi de l’image en cours...</p>
      )}
    </div>
  );
}
