import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";

export default function RegistreMandats() {
  const [mandats, setMandats] = useState([]);

  useEffect(() => {
    fetchMandats();
  }, []);

  const fetchMandats = async () => {
    const { data, error } = await supabase
      .from("registres_mandats")
      .select("*")
      .eq("statut", "valide")
      .order("date_validation", { ascending: false });

    if (!error) setMandats(data);
  };

  const generateWordDoc = async () => {
    const rows = [
      new TableRow({
        children: [
          "Numéro", "Ville", "Code Postal", "Type Bien", "Nom", "Prénom", "Adresse Propriétaire", "Adresse Bien", "Statut", "Date Validation"        
        ].map(text => new TableCell({
          children: [new Paragraph({ text, bold: true })],
          width: { size: 10, type: WidthType.PERCENTAGE },
        }))
      }),
      ...mandats.map(mandat => new TableRow({
        children: [
          mandat.numero_mandat,
          mandat.ville,
          mandat.code_postal,
          mandat.type_bien,
          mandat.proprietaire_nom,
          mandat.proprietaire_prenom,
          mandat.adresse_proprietaire,
          mandat.adresse_bien,
          mandat.statut,
          mandat.date_validation ? new Date(mandat.date_validation).toLocaleDateString() : "-"
        ].map(text => new TableCell({
          children: [new Paragraph(String(text))],
          width: { size: 10, type: WidthType.PERCENTAGE },
        }))
      }))
    ];

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "Registre des Mandats Validés", heading: "Heading1" }),
          new Table({ rows })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `registre-mandats-${new Date().toLocaleDateString()}.docx`);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-600">📜 Registre des Mandats Validés</h1>
        <button
          onClick={generateWordDoc}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm"
        >
          📄 Exporter Word
        </button>
      </div>

      {mandats.length === 0 ? (
        <p className="text-gray-500">Aucun mandat validé pour l'instant.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-orange-100">
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">Ville</th>
                <th className="border p-2">Code Postal</th>
                <th className="border p-2">Type Bien</th>
                <th className="border p-2">Nom Propriétaire</th>
                <th className="border p-2">Prénom Propriétaire</th>
                <th className="border p-2">Adresse Propriétaire</th>
                <th className="border p-2">Adresse Bien</th>
                <th className="border p-2">Statut</th>
                <th className="border p-2">Date Validation</th>                
              </tr>
            </thead>
            <tbody>
              {mandats.map((mandat) => (
                <tr key={mandat.id} className="hover:bg-orange-50">
                  <td className="border p-2 text-center font-bold">{mandat.numero_mandat}</td>
                  <td className="border p-2">{mandat.ville}</td>
                  <td className="border p-2">{mandat.code_postal}</td>
                  <td className="border p-2">{mandat.type_bien}</td>
                  <td className="border p-2">{mandat.proprietaire_nom}</td>
                  <td className="border p-2">{mandat.proprietaire_prenom}</td>
                  <td className="border p-2">{mandat.adresse_proprietaire}</td>
                  <td className="border p-2">{mandat.adresse_bien}</td>
                  <td className="border p-2 text-center">{mandat.statut}</td>
                  <td className="border p-2">{mandat.date_validation ? new Date(mandat.date_validation).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
