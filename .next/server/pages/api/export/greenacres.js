"use strict";(()=>{var e={};e.id=6449,e.ids=[6449],e.modules={2885:e=>{e.exports=require("@supabase/supabase-js")},4483:e=>{e.exports=require("basic-ftp")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},2781:e=>{e.exports=require("stream")},8190:(e,r,a)=>{a.r(r),a.d(r,{config:()=>u,default:()=>l,routeModule:()=>d});var s={};a.r(s),a.d(s,{default:()=>handler});var t=a(1802),i=a(7153),o=a(6249);function escapeXml(e=""){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}let generateGreenAcresXML=e=>`<?xml version="1.0" encoding="UTF-8"?>
<greenacres>
${e.map(e=>`
  <property>
    <title>${escapeXml(e.titre)}</title>
    <location>${escapeXml(e.ville)}</location>
    <area>${e.surface_m2||""}</area>
    <price>${e.prix_vente||""}</price>
    <description><![CDATA[${e.description||""}]]></description>
    <type>${escapeXml(e.type_bien||"")}</type>
    <rooms>${e.nb_pieces||""}</rooms>
    <bedrooms>${e.nb_chambres||""}</bedrooms>
  </property>
`).join("\n")}
</greenacres>`;var n=a(2678),p=a(4483),c=a(2781);async function handler(e,r){if("GET"!==e.method)return r.status(405).end("M\xe9thode non autoris\xe9e");try{let e=await n.O.auth.getSession(),{data:a,error:s}=await n.O.from("biens").select("*").eq("publier_portail",!0);if(s||!a)throw Error("Erreur r\xe9cup\xe9ration biens Supabase");let t=generateGreenAcresXML(a),i=new p.Client;i.ftp.verbose=!0,await i.access({host:"ftp.green-acres.com",user:"hektor_group",password:"hydatia",secure:!1});let o=c.Readable.from([t]);await i.uploadFrom(o,"export.xml"),i.close(),await n.O.from("export_logs").insert({portail:"greenacres",nb_biens:a.length,user_email:e?.data?.session?.user?.email||null}),r.status(200).send("✅ Export Green-Acres r\xe9ussi.")}catch(e){console.error("Erreur export Green-Acres:",e),r.status(500).send("❌ Erreur export Green-Acres.")}}let l=(0,o.l)(s,"default"),u=(0,o.l)(s,"config"),d=new t.PagesAPIRouteModule({definition:{kind:i.x.PAGES_API,page:"/api/export/greenacres",pathname:"/api/export/greenacres",bundlePath:"",filename:""},userland:s})},2678:(e,r,a)=>{a.d(r,{O:()=>t});var s=a(2885);let t=globalThis.supabase||(0,s.createClient)("https://fkavtsofmglifzalclyn.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYXZ0c29mbWdsaWZ6YWxjbHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDgzNDIsImV4cCI6MjA1ODQ4NDM0Mn0.vN8-2RzyVu_2X4lWT4Uqa6aI3OYuAcIFFuMeGS5Po1Y")}};var r=require("../../../webpack-api-runtime.js");r.C(e);var __webpack_exec__=e=>r(r.s=e),a=r.X(0,[4222],()=>__webpack_exec__(8190));module.exports=a})();