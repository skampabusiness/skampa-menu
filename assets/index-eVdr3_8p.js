import{r as c,a as ee}from"./vendor-YrKBaaSI.js";import"./utils-CHx6bvGq.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))l(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&l(d)}).observe(document,{childList:!0,subtree:!0});function o(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(t){if(t.ep)return;t.ep=!0;const s=o(t);fetch(t.href,s)}})();var F={exports:{}},w={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var te=c,se=Symbol.for("react.element"),re=Symbol.for("react.fragment"),ae=Object.prototype.hasOwnProperty,ne=te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,oe={key:!0,ref:!0,__self:!0,__source:!0};function B(i,n,o){var l,t={},s=null,d=null;o!==void 0&&(s=""+o),n.key!==void 0&&(s=""+n.key),n.ref!==void 0&&(d=n.ref);for(l in n)ae.call(n,l)&&!oe.hasOwnProperty(l)&&(t[l]=n[l]);if(i&&i.defaultProps)for(l in n=i.defaultProps,n)t[l]===void 0&&(t[l]=n[l]);return{$$typeof:se,type:i,key:s,ref:d,props:t,_owner:ne.current}}w.Fragment=re;w.jsx=B;w.jsxs=B;F.exports=w;var e=F.exports,U,$=ee;U=$.createRoot,$.hydrateRoot;const M=(i,n)=>{const o=new Date,l=o.toLocaleDateString("en-US",{weekday:"long"});if(n.some(({startDate:h,endDate:S})=>{const g=new Date(h+"T00:00:00"),y=new Date(S+"T00:00:00"),b=new Date(o.toISOString().split("T")[0]+"T00:00:00");return b>=g&&b<=y}))return!1;const s=i.find(h=>h.day===l);if(!s||s.openTime==="CLOSED"||s.closeTime==="CLOSED")return!1;const d=o.getHours()*100+o.getMinutes(),[D,C]=s.openTime.split(":"),[N,p]=s.closeTime.split(":"),O=parseInt(D)*100+parseInt(C),f=parseInt(N)*100+parseInt(p);return d>=O&&d<=f},A=i=>new Date(i+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),le=i=>{const n=new Date().toLocaleDateString("en-US",{weekday:"long"}),o=i.find(l=>l.day===n);return o?o.openTime==="CLOSED"?"Closed today":`Today: ${o.openTime} - ${o.closeTime}`:"Hours not available"},ce=()=>{const[i,n]=c.useState([]),[o,l]=c.useState([]),[t,s]=c.useState([]),[d,D]=c.useState(null),[C,N]=c.useState(!0),[p,O]=c.useState("all"),[f,h]=c.useState(""),[S,g]=c.useState(!1),[y,b]=c.useState(!1),[v,q]=c.useState(null),E=c.useRef(null);c.useEffect(()=>{const a=u=>{E.current&&!E.current.contains(u.target)&&g(!1)};return document.addEventListener("mousedown",a),()=>{document.removeEventListener("mousedown",a)}},[]),c.useEffect(()=>{(async()=>{try{const m="1VX-i0LIFaHrlR-grOZRgWeSNARxBm93ni1o3fyeVOw0",j="AIzaSyAM1FO-37Wwhg7ctsUkmLQc1e_SVNP4egM",T=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${m}/values/Sheet1?key=${j}`),_=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${m}/values/BusinessHours?key=${j}`),I=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${m}/values/SpecialDates?key=${j}`);if(!T.ok||!_.ok||!I.ok)throw new Error("Failed to fetch data");const[V,W,z]=await Promise.all([T.json(),_.json(),I.json()]),[de,...K]=V.values,P=K.map(r=>({Category:r[0]||"",Name:r[1]||"",Price:r[2]||"0.00",Description:r[3]||""})),[ue,...Y]=W.values,k=Y.map(r=>({day:r[0],openTime:r[1],closeTime:r[2]})),[me,...J]=z.values,L=J.filter(r=>r[0]&&r[1]).map(r=>({startDate:r[0],endDate:r[1],status:r[2],reason:r[3]})),X=[...new Set(P.map(r=>r.Category))].map(r=>({category:r,items:P.filter(x=>x.Category===r).map(x=>({name:x.Name,price:parseFloat(x.Price||0).toFixed(2),description:x.Description}))}));n(X),l(k),s(L);const Z=M(k,L);b(Z);const H=new Date;H.setHours(0,0,0,0);const G=L.find(r=>new Date(r.startDate+"T00:00:00")>=H);q(G),N(!1)}catch(m){console.error("Error loading data:",m),D("Error loading data. Please try again later."),N(!1)}})();const u=setInterval(()=>{o.length&&t.length&&b(M(o,t))},6e4);return()=>clearInterval(u)},[]);const R=a=>{O(a),g(!1)},Q=i.map(a=>({...a,items:a.items.filter(u=>u.name.toLowerCase().includes(f.toLowerCase())||u.description.toLowerCase().includes(f.toLowerCase()))})).filter(a=>p==="all"||a.category===p).filter(a=>f===""||a.items.length>0);return C?e.jsx("div",{className:"flex justify-center items-center min-h-screen",children:e.jsx("div",{className:"text-xl",children:"Loading menu..."})}):d?e.jsx("div",{className:"max-w-4xl mx-auto p-4",children:e.jsx("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded",children:d})}):e.jsxs("div",{className:"max-w-4xl mx-auto p-4",children:[e.jsx("header",{className:"mb-8",children:e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between",children:[e.jsxs("div",{className:"flex flex-col items-center sm:items-start",children:[e.jsx("h1",{className:"text-3xl font-bold",children:"Skampa Restaurant"}),e.jsx("h2",{className:"text-xl",children:"Menu"}),e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"Famous for the Best Roast Beef in Cambridge"})]}),e.jsxs("div",{className:"flex flex-col items-center sm:items-end mt-2 sm:mt-0",children:[e.jsxs("div",{className:`inline-flex items-center px-3 py-1 rounded-full ${y?"bg-blue-100 text-blue-800":"bg-red-100 text-red-800"}`,children:[e.jsx("span",{className:`w-2 h-2 rounded-full mr-2 ${y?"bg-blue-500":"bg-red-500"}`}),e.jsx("span",{className:"font-semibold",children:y?"Open Now":"Closed"})]}),e.jsx("div",{className:"text-sm mt-1",children:le(o)}),v&&e.jsxs("div",{className:"text-sm text-gray-600 mt-1",children:["Closed ",A(v.startDate)," - ",A(v.endDate),v.reason&&e.jsxs("span",{className:"text-red-600 ml-1",children:["(",v.reason,")"]})]}),e.jsxs("address",{className:"text-sm text-gray-600 mt-2 not-italic",children:[e.jsx("a",{href:"tel:+16173540009",className:"hover:text-blue-600",children:"617-354-0009"}),e.jsx("br",{}),e.jsx("a",{href:"https://maps.google.com/?q=424+Cambridge+St,+Cambridge+MA+02141",target:"_blank",rel:"noopener noreferrer",className:"hover:text-blue-600",children:"424 Cambridge St, Cambridge"})]})]})]})}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 mb-6",children:[e.jsx("input",{type:"text",placeholder:"Search menu...",className:"flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",value:f,onChange:a=>h(a.target.value)}),e.jsxs("div",{className:"relative",ref:E,children:[e.jsx("button",{onClick:()=>g(!S),className:"w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500",children:p==="all"?"Categories":p}),S&&e.jsxs("div",{className:"absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20 border",children:[e.jsx("button",{onClick:()=>R("all"),className:`block w-full text-left px-4 py-2 hover:bg-gray-100 ${p==="all"?"bg-blue-50 text-blue-500":""}`,children:"All Categories"}),i.map((a,u)=>e.jsx("button",{onClick:()=>R(a.category),className:`block w-full text-left px-4 py-2 hover:bg-gray-100 ${p===a.category?"bg-blue-50 text-blue-500":""}`,children:a.category},u))]})]})]}),e.jsx("main",{role:"main","aria-label":"Restaurant Menu",children:Q.map((a,u)=>e.jsxs("section",{className:"mb-8",children:[e.jsx("h2",{className:"text-2xl font-bold mb-4",id:`category-${a.category.toLowerCase().replace(/\s+/g,"-")}`,children:a.category}),e.jsx("div",{className:"grid gap-4",children:a.items.map((m,j)=>e.jsxs("article",{className:"border p-4 rounded-lg",itemScope:!0,itemType:"https://schema.org/MenuItem",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("h3",{className:"font-semibold",itemProp:"name",children:m.name}),e.jsxs("span",{className:"text-gray-700",itemProp:"price",children:["$",m.price]})]}),m.description&&e.jsx("p",{className:"text-gray-600 mt-2",itemProp:"description",children:m.description})]},j))})]},u))})]})};function ie(){return e.jsx("div",{className:"min-h-screen bg-gray-50",children:e.jsx(ce,{})})}U(document.getElementById("root")).render(e.jsx(c.StrictMode,{children:e.jsx(ie,{})}));
//# sourceMappingURL=index-eVdr3_8p.js.map