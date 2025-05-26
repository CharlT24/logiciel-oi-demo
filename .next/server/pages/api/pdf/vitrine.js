"use strict";(()=>{var e={};e.id=8409,e.ids=[8409],e.modules={2885:e=>{e.exports=require("@supabase/supabase-js")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},5462:e=>{e.exports=import("puppeteer")},3477:(e,t,a)=>{a.a(e,async(e,i)=>{try{a.r(t),a.d(t,{config:()=>c,default:()=>l,routeModule:()=>d});var s=a(1802),o=a(7153),n=a(6249),r=a(8032),p=e([r]);r=(p.then?(await p)():p)[0];let l=(0,n.l)(r,"default"),c=(0,n.l)(r,"config"),d=new s.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/pdf/vitrine",pathname:"/api/pdf/vitrine",bundlePath:"",filename:""},userland:r});i()}catch(e){i(e)}})},2678:(e,t,a)=>{a.d(t,{O:()=>s});var i=a(2885);let s=globalThis.supabase||(0,i.createClient)("https://fkavtsofmglifzalclyn.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYXZ0c29mbWdsaWZ6YWxjbHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDgzNDIsImV4cCI6MjA1ODQ4NDM0Mn0.vN8-2RzyVu_2X4lWT4Uqa6aI3OYuAcIFFuMeGS5Po1Y")},8032:(e,t,a)=>{a.a(e,async(e,i)=>{try{a.r(t),a.d(t,{default:()=>handler});var s=a(2678),o=a(5462),n=e([o]);async function handler(e,t){let{id:a}=e.query;if(!a)return t.status(400).send("Missing ID");let{data:i,error:n}=await s.O.from("biens").select("*").eq("id",a).single();if(n||!i)return t.status(404).send("Bien introuvable");let r=`https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/covers/${a}/cover.jpg`,p=await s.O.storage.from("photos").list(`gallery/${a}`),l=p?.data?.map(e=>`https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/gallery/${a}/${e.name}`)||[],c=`
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
        </style>
      </head>
      <body>
        <h1>${i.titre}</h1>
        <p style="color: #555;">${i.type_bien} • ${i.surface_m2} m\xb2 • ${i.nb_chambres} chambres</p>

        <div class="photos">
          <img src="${r}" />
        </div>

        <div class="section info">
          <h2 style="font-size: 20px; color: #333;">🔎 D\xe9tails</h2>
          <p><strong>Prix affich\xe9 :</strong> ${i.prix_vente?.toLocaleString()} €</p>
          <p><strong>Honoraires :</strong> ${i.honoraires?.toLocaleString()} €</p>
          <p><strong>Type :</strong> ${i.type_bien}</p>
          <p><strong>\xc9tage :</strong> ${i.etage||"-"}</p>
          <p><strong>Chauffage :</strong> ${i.type_chauffage} (${i.mode_chauffage})</p>
          <p><strong>Ann\xe9e :</strong> ${i.annee_construction}</p>
        </div>

        ${i.options?.length?`<div class="section">
          <h2 style="font-size: 20px; color: #333;">✨ \xc9quipements & Atouts</h2>
          ${i.options.map(e=>`<span class="badge">${e}</span>`).join(" ")}
        </div>`:""}

        ${l.length?`<div class="section gallery">
          ${l.slice(0,6).map(e=>`<img src="${e}" />`).join(" ")}
        </div>`:""}

        ${i.description?`<div class="section">
          <h2 style="font-size: 20px; color: #333;">📝 Description</h2>
          <p style="font-size: 14px; color: #444; line-height: 1.5;">${i.description}</p>
        </div>`:""}

        <p style="margin-top: 40px; font-size: 12px; color: #888;">Fiche g\xe9n\xe9r\xe9e automatiquement • CRM Immo</p>
      </body>
    </html>
  `,d=await o.default.launch({headless:"new"}),g=await d.newPage();await g.setContent(c,{waitUntil:"networkidle0"});let f=await g.pdf({format:"A4",printBackground:!0});await d.close(),t.setHeader("Content-Type","application/pdf"),t.setHeader("Content-Disposition",`inline; filename=fiche-vitrine-${a}.pdf`),t.send(f)}o=(n.then?(await n)():n)[0],i()}catch(e){i(e)}})}};var t=require("../../../webpack-api-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),a=t.X(0,[4222],()=>__webpack_exec__(3477));module.exports=a})();