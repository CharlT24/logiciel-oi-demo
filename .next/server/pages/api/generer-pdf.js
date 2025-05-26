"use strict";(()=>{var e={};e.id=4253,e.ids=[4253],e.modules={2885:e=>{e.exports=require("@supabase/supabase-js")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},7871:(e,a,s)=>{s.r(a),s.d(a,{config:()=>u,default:()=>d,routeModule:()=>c});var i={};s.r(i),s.d(i,{default:()=>handler});var n=s(1802),l=s(7153),r=s(6249),t=s(2678);let p=require("html-pdf");var o=s.n(p);async function handler(e,a){let{id:s}=e.query;if(!s)return a.status(400).send("ID manquant");let{data:i,error:n}=await t.O.from("biens").select("*").eq("id",s).single();if(n||!i)return a.status(404).send("Bien introuvable");let l=`
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Fiche Bien</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { color: #e67e22; }
        p { margin: 6px 0; }
        .label { font-weight: bold; color: #555; }
        .box { background: #f9f9f9; padding: 12px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h1>${i.titre}</h1>
      <div class="box">
        <p><span class="label">📍 Ville :</span> ${i.ville}</p>
        <p><span class="label">📏 Surface :</span> ${i.surface_m2} m\xb2</p>
        <p><span class="label">💰 Prix :</span> ${i.prix.toLocaleString()} €</p>
        <p><span class="label">🔋 DPE :</span> ${i.dpe}</p>
        <p><span class="label">💼 Honoraires :</span> ${i.honoraires?.toLocaleString()||0} €</p>
        <p><span class="label">📅 Disponibilit\xe9 :</span> ${i.disponible?"Disponible":"Indisponible"}</p>
        <p><span class="label">📦 Statut :</span> ${i.vendu?"Vendu":i.sous_compromis?"Sous compromis":"En vente"}</p>
      </div>

      <h3>Description</h3>
      <p>${i.description}</p>
    </body>
    </html>
  `;o().create(l).toBuffer((e,s)=>{if(e)return console.error("❌ Erreur PDF :",e),a.status(500).send("Erreur g\xe9n\xe9ration PDF");a.setHeader("Content-Type","application/pdf"),a.setHeader("Content-Disposition",`inline; filename=fiche-bien-${i.id}.pdf`),a.send(s)})}let d=(0,r.l)(i,"default"),u=(0,r.l)(i,"config"),c=new n.PagesAPIRouteModule({definition:{kind:l.x.PAGES_API,page:"/api/generer-pdf",pathname:"/api/generer-pdf",bundlePath:"",filename:""},userland:i})},2678:(e,a,s)=>{s.d(a,{O:()=>n});var i=s(2885);let n=globalThis.supabase||(0,i.createClient)("https://fkavtsofmglifzalclyn.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYXZ0c29mbWdsaWZ6YWxjbHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDgzNDIsImV4cCI6MjA1ODQ4NDM0Mn0.vN8-2RzyVu_2X4lWT4Uqa6aI3OYuAcIFFuMeGS5Po1Y")}};var a=require("../../webpack-api-runtime.js");a.C(e);var __webpack_exec__=e=>a(a.s=e),s=a.X(0,[4222],()=>__webpack_exec__(7871));module.exports=s})();