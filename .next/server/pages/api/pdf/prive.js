"use strict";(()=>{var e={};e.id=3364,e.ids=[3364],e.modules={2885:e=>{e.exports=require("@supabase/supabase-js")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},5462:e=>{e.exports=import("puppeteer")},7776:(e,a,t)=>{t.a(e,async(e,s)=>{try{t.r(a),t.d(a,{config:()=>c,default:()=>l,routeModule:()=>d});var r=t(1802),i=t(7153),n=t(6249),o=t(3779),p=e([o]);o=(p.then?(await p)():p)[0];let l=(0,n.l)(o,"default"),c=(0,n.l)(o,"config"),d=new r.PagesAPIRouteModule({definition:{kind:i.x.PAGES_API,page:"/api/pdf/prive",pathname:"/api/pdf/prive",bundlePath:"",filename:""},userland:o});s()}catch(e){s(e)}})},2678:(e,a,t)=>{t.d(a,{O:()=>r});var s=t(2885);let r=globalThis.supabase||(0,s.createClient)("https://fkavtsofmglifzalclyn.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYXZ0c29mbWdsaWZ6YWxjbHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDgzNDIsImV4cCI6MjA1ODQ4NDM0Mn0.vN8-2RzyVu_2X4lWT4Uqa6aI3OYuAcIFFuMeGS5Po1Y")},3779:(e,a,t)=>{t.a(e,async(e,s)=>{try{t.r(a),t.d(a,{default:()=>handler});var r=t(2678),i=t(5462),n=e([i]);async function handler(e,a){let{id:t}=e.query;if(!t)return a.status(400).send("Missing ID");let{data:s,error:n}=await r.O.from("biens").select("*").eq("id",t).single();if(n||!s)return a.status(404).send("Bien introuvable");let{data:o}=await r.O.from("proprietaires").select("*").eq("bien_id",t),p=`https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/covers/${t}/cover.jpg`,l=await r.O.storage.from("photos").list(`gallery/${t}`),c=l?.data?.map(e=>`https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/gallery/${t}/${e.name}`)||[],d=`
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #e95f1c; font-size: 28px; }
          .section { margin-top: 30px; }
          .photos img { max-width: 100%; margin: 10px 0; border-radius: 12px; }
          .gallery { display: flex; gap: 10px; flex-wrap: wrap; }
          .gallery img { width: 200px; height: 140px; object-fit: cover; border-radius: 8px; }
          .info p { margin: 6px 0; font-size: 14px; }
          .badge { background: #f2f2f2; padding: 6px 12px; border-radius: 20px; display: inline-block; margin: 4px; font-size: 13px; }
          .sub { font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${s.titre}</h1>
        <p class="sub">${s.type_bien} • ${s.surface_m2} m\xb2 • ${s.nb_chambres} chambres • ${s.ville} (${s.code_postal})</p>

        <div class="photos">
          <img src="${p}" />
        </div>

        <div class="section info">
          <h2>🔎 D\xe9tails complets</h2>
          <p><strong>Prix affich\xe9 :</strong> ${s.prix_vente?.toLocaleString()} €</p>
          <p><strong>Honoraires :</strong> ${s.honoraires?.toLocaleString()} €</p>
          <p><strong>Net vendeur :</strong> ${s.prix_net_vendeur?.toLocaleString()} €</p>
          <p><strong>% Honoraires :</strong> ${s.pourcentage_honoraires}%</p>
          <p><strong>Mandat :</strong> ${s.mandat}</p>
          <p><strong>Statut :</strong> ${s.statut}</p>
          <p><strong>\xc9tage :</strong> ${s.etage}</p>
          <p><strong>Chauffage :</strong> ${s.type_chauffage} (${s.mode_chauffage})</p>
          <p><strong>Ann\xe9e construction :</strong> ${s.annee_construction}</p>
          <p><strong>Surface Carrez :</strong> ${s.surface_carrez} m\xb2</p>
          <p><strong>Terrain :</strong> ${s.surface_terrain} m\xb2</p>
          <p><strong>Taxe fonci\xe8re :</strong> ${s.taxe_fonciere} €</p>
          <p><strong>Charges annuelles :</strong> ${s.quote_part_charges} €</p>
          <p><strong>Fonds travaux :</strong> ${s.fonds_travaux} €</p>
        </div>

        ${s.options?.length?`<div class="section">
          <h2>✨ \xc9quipements</h2>
          ${s.options.map(e=>`<span class="badge">${e}</span>`).join(" ")}
        </div>`:""}

        ${c.length?`<div class="section gallery">
          ${c.map(e=>`<img src="${e}" />`).join(" ")}
        </div>`:""}

        ${s.description?`<div class="section">
          <h2>📝 Description</h2>
          <p style="font-size: 14px; color: #444; line-height: 1.5;">${s.description}</p>
        </div>`:""}

        ${o?.length?`<div class="section">
          <h2>👤 Propri\xe9taire(s)</h2>
          ${o.map(e=>`
            <p><strong>${e.prenom} ${e.nom}</strong> – ${e.email} – ${e.telephone}</p>
            <p class="sub">Adresse : ${e.adresse_principale}</p>
            ${e.adresse_differente?`<p class="sub">Adresse 2 : ${e.adresse_differente}</p>`:""}
            <p class="sub">Mandat #${e.numero_mandat} – du ${e.date_debut_mandat} au ${e.date_fin_mandat}</p>
            <br />
          `).join("")}
        </div>`:""}

        <p style="margin-top: 40px; font-size: 12px; color: #888;">Fiche confidentielle g\xe9n\xe9r\xe9e via CRM Immo</p>
      </body>
    </html>
  `,g=await i.default.launch({headless:"new"}),u=await g.newPage();await u.setContent(d,{waitUntil:"networkidle0"});let f=await u.pdf({format:"A4",printBackground:!0});await g.close(),a.setHeader("Content-Type","application/pdf"),a.setHeader("Content-Disposition",`inline; filename=fiche-privee-${t}.pdf`),a.send(f)}i=(n.then?(await n)():n)[0],s()}catch(e){s(e)}})}};var a=require("../../../webpack-api-runtime.js");a.C(e);var __webpack_exec__=e=>a(a.s=e),t=a.X(0,[4222],()=>__webpack_exec__(7776));module.exports=t})();