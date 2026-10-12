// O-PLUS Admin · comportamiento exclusivo de la app de Android
(()=>{
const g=id=>document.getElementById(id),P=(window.Capacitor&&Capacitor.Plugins)||{};
const IC={
  list:'<svg viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>',
  tool:'<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/></svg>',
  user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'
};
document.documentElement.classList.add("app");
document.body.classList.add("t-canales");

// ---- Intro: el logo entra desde la izquierda, hace zoom y el "+" se abre para revelar la app
(()=>{
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const PLUS="M-4 -12h8v8h8v8h-8v8h-8v-8h-8v-8h8z";
  const arc=(a,b,r)=>{const p=t=>[(r*Math.cos(t*Math.PI/180)).toFixed(2),(r*Math.sin(t*Math.PI/180)).toFixed(2)],[x1,y1]=p(a),[x2,y2]=p(b);return"M"+x1+" "+y1+"A"+r+" "+r+" 0 "+((b-a)>180?1:0)+" 1 "+x2+" "+y2};
  const sp=document.createElement("div");sp.id="splash";
  sp.innerHTML='<svg viewBox="-50 -50 100 100"><defs><mask id="spm" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="10000"><rect x="-5000" y="-5000" width="10000" height="10000" fill="#fff"/><path d="'+PLUS+'" fill="#000"/></mask></defs>'
   +'<g id="spz"><g mask="url(#spm)"><rect x="-5000" y="-5000" width="10000" height="10000" fill="#060e17"/><circle id="spn" r="31" fill="#163959"/><circle r="21" fill="#fff"/></g>'
   +'<path id="spp" d="'+PLUS+'" fill="#fff" stroke="#163959" stroke-width=".7" stroke-linejoin="round"/>'
   +'<g id="spr" fill="none" stroke-width="1.7" stroke-linecap="round"><path d="'+arc(180,311,38)+'" stroke="#1fc8d6"/><path d="'+arc(329,493,38)+'" stroke="#b03174"/></g></g></svg>';
  document.body.append(sp);
  const q=id=>sp.querySelector("#"+id),svg=sp.querySelector("svg"),z=q("spz"),rg=q("spr"),pl=q("spp"),nv=q("spn");
  const E=Math.max(innerWidth/16,innerHeight/48)*1.25;          // zoom final: el "+" cubre toda la pantalla
  const IN=.6,ZS=1.55,ZD=.55,t0=performance.now();
  (function f(now){
    const t=(now-t0)/1000;let s=1,x=0;
    if(t<IN){const p=t/IN,e=1-Math.pow(1-p,3);x=-(innerWidth/2+110)*(1-e)}            // entra deslizando desde la izquierda
    else if(t<ZS)s=1+.025*Math.sin((t-IN)*3.4);                                      // respira un instante
    let pz=0;
    if(t>=ZS){pz=Math.min(1,(t-ZS)/ZD);s=Math.exp(Math.log(E)*Math.pow(pz,2.3))}    // zoom acelerado
    svg.style.transform="translateX("+x.toFixed(1)+"px)";
    z.setAttribute("transform","scale("+s.toFixed(4)+")");
    rg.setAttribute("transform","rotate("+(300*(1-Math.pow(1-Math.min(t,1.3)/1.3,3))+t*25).toFixed(1)+")");   // los aros giran y se calman
    pl.style.opacity=t<ZS?1:Math.max(0,1-(t-ZS)/.1);                                  // el "+" se vuelve un hueco
    nv.style.opacity=1-.65*Math.min(1,pz*2.5);
    if(pz<1)requestAnimationFrame(f);else sp.remove();
  })(t0);
})();

// ---- Aviso corto
const tt=document.createElement("div");tt.id="toast";tt.hidden=true;document.body.append(tt);
let tT=0;const toast=(m,ms=2200)=>{tt.textContent=m;tt.hidden=false;clearTimeout(tT);tT=setTimeout(()=>{tt.hidden=true},ms)};

// ---- Pantalla de entrada con el logo
const lf=g("login");if(lf){const im=document.createElement("img");im.src="admin-512.png";im.className="llogo";im.alt="";lf.prepend(im)}

// ---- Barra inferior: Canales · Mantenimiento · Cuenta
const tabs=document.createElement("nav");tabs.id="tabs";
[["canales","Canales",IC.list],["mant","Mantenimiento",IC.tool],["cuenta","Cuenta",IC.user]].forEach(([k,t,i])=>{
  const b=document.createElement("button");b.dataset.k=k;b.innerHTML=i+"<span>"+t+"</span>";tabs.append(b);
});
document.body.append(tabs);
const em=document.createElement("b"),mt=tabs.querySelector('[data-k="mant"]');
let curTab="canales";
const show=t=>{
  ["canales","mant","cuenta"].forEach(x=>document.body.classList.toggle("t-"+x,x===t));
  tabs.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.k===t));
  if(t==="cuenta")em.textContent=g("who").textContent||"";
  const h=document.querySelector("header h1");if(h)h.textContent={canales:"Canales",mant:"Mantenimiento",cuenta:"Mi cuenta"}[t];
  scrollTo(0,0);
  curTab=t;
  try{hsub();moveInd();acctInfo();const w=document.querySelector(".wrap");w.classList.remove("fade");void w.offsetWidth;w.classList.add("fade")}catch{}
};
tabs.onclick=e=>{const b=e.target.closest("button");if(b)show(b.dataset.k)};
show("canales");
// "Mantenimiento" solo aparece para el dueño (la tarjeta se muestra únicamente con su usuario)
const syncM=()=>{mt.hidden=g("mcard").hidden;if(mt.hidden&&document.body.classList.contains("t-mant"))show("canales")};
new MutationObserver(syncM).observe(g("mcard"),{attributes:true,attributeFilter:["hidden"]});syncM();
new MutationObserver(()=>{if(g("app").hidden)show("canales")}).observe(g("app"),{attributes:true,attributeFilter:["hidden"]});

// ---- Pestaña Cuenta
const ac=document.createElement("section");ac.id="acct";
ac.innerHTML='<div class="card acc"><div class="av">'+IC.user+'</div></div>'
  +'<div class="card"><button class="btn" id="a-bk">Guardar copia de seguridad</button><label class="btn" for="rs">Restaurar copia desde un archivo</label></div>'
  +'<div class="card"><button class="btn" id="a-out">Cerrar sesión</button></div><p class="ver">O-PLUS Admin · v1.0</p>';
document.querySelector(".wrap").append(ac);
const accCard=ac.querySelector(".acc"),sm=document.createElement("small");sm.textContent="Administrador";accCard.append(em,sm);
g("a-out").onclick=()=>{if(window.adminIsDirty&&adminIsDirty()&&!confirm("Tienes cambios sin guardar (queda un borrador). ¿Cerrar sesión?"))return;g("out").click()};
g("a-bk").onclick=async()=>{
  const txt=window.adminExport?adminExport():"[]",name="oplus-canales-"+new Date().toISOString().slice(0,10)+".json";
  try{const f=new File([txt],name,{type:"application/json"});
    if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});return}}
  catch(e){if(e&&e.name==="AbortError")return}
  try{await navigator.clipboard.writeText(txt);toast("Copia en el portapapeles: pégala en una nota o archivo",3500)}catch{toast("No se pudo exportar la copia")}
};

// ---- Estilo propio: cabecera con avatar, resumen, tarjetas con color, vista previa, avisos
const rows=g("rows"),hd=document.querySelector("header"),h1=hd.querySelector("h1");
const hello=()=>{const h=new Date().getHours();return h<12?"Buenos días":h<19?"Buenas tardes":"Buenas noches"};
const nameOf=()=>{const e=(g("who").textContent||"").split("@")[0].replace(/[._-]+/g," ").trim();return e?e.charAt(0).toUpperCase()+e.slice(1):"Admin"};
// cabecera: avatar + título + subtítulo
const av=document.createElement("button");av.id="hav";av.setAttribute("aria-label","Mi cuenta");
const tx=document.createElement("div");tx.className="htxt";const sub=document.createElement("span");sub.className="hsub";
hd.prepend(tx);hd.prepend(av);tx.append(h1,sub);av.onclick=()=>show("cuenta");
function hsub(){
  av.textContent=(g("who").textContent||"A").trim().charAt(0).toUpperCase()||"A";
  const mpt=g("mpt");if(mpt&&curTab==="mant")mpt.textContent=g("mmsg").value.trim()||"Estamos mejorando la página. Volvemos muy pronto.";
  sub.textContent=curTab==="canales"?(g("cnt").textContent||""):curTab==="mant"?(g("mst").textContent||""):(g("who").textContent||"");
}
new MutationObserver(()=>{hsub();acctInfo()}).observe(g("who"),{childList:true,characterData:true,subtree:true});
// resumen de la lista
const st=document.createElement("div");st.className="stats";
st.innerHTML='<div class="st"><b id="s-n">0</b><span>Canales</span></div><div class="st"><b id="s-l">0</b><span>En vivo</span></div><div class="st"><b id="s-c">0</b><span>Categorías</span></div>';
document.querySelector(".wrap").prepend(st);
let sT=0;
const stats=()=>{clearTimeout(sT);sT=setTimeout(()=>{try{const l=JSON.parse(adminExport());
  g("s-n").textContent=l.length;g("s-l").textContent=l.filter(c=>c.live).length;g("s-c").textContent=new Set(l.map(c=>c.c).filter(Boolean)).size;hsub()}catch{}},120)};
// encabezado de cada canal (logo, nombre, categoría y su color)
function syncRh(r){
  const h=r.querySelector(".rh");if(!h)return;
  const nm=r.querySelector('input[placeholder="Mi canal"]'),ct=r.querySelector('input[list="cats"]'),th=r.querySelector(".thumb"),co=r.querySelector('input[type=color]'),lv=r.querySelector(".live input");
  const name=(nm&&nm.value.trim())||"Canal sin nombre",col=co&&co.style.opacity==="1"?co.value:"",rl=h.querySelector(".rl");
  h.querySelector("b").textContent=name;h.querySelector("span").textContent=(ct&&ct.value.trim())||"Sin categoría";
  rl.style.background=col||"linear-gradient(135deg,#1b4a6b,#163959)";r.style.setProperty("--ac",col||"#2a4a6a");
  if(th&&th.style.visibility==="visible"&&th.getAttribute("src")){
    const src=th.getAttribute("src");let im=rl.querySelector("img");
    if(!im){rl.textContent="";im=new Image();im.alt="";im.addEventListener("load",()=>im.classList.add("ok"));rl.append(im)}
    if(im._want!==src){im._want=src;im.classList.remove("ok");adminLoadImg(im,src,()=>{im.remove();rl.textContent=name.slice(0,2).toUpperCase()})}
  }
  else{rl.textContent=name.slice(0,2).toUpperCase()}
  h.querySelector(".rd").classList.toggle("on",!!(lv&&lv.checked));
}
const mkRh=r=>{r.dataset.s=1;const tm=r.querySelector(".thumb");if(tm)tm.addEventListener("load",()=>syncRh(r));const h=document.createElement("div");h.className="rh";h.innerHTML='<div class="rl"></div><div class="rt"><b></b><span></span></div><i class="rd" title="En vivo"></i>';r.prepend(h);syncRh(r)};
new MutationObserver(()=>{rows.querySelectorAll(".row:not([data-s])").forEach(mkRh);stats()}).observe(rows,{childList:true});
["input","change"].forEach(ev=>rows.addEventListener(ev,e=>{const r=e.target.closest(".row");if(r)syncRh(r);stats()}));
// vista previa del mantenimiento
const mp=document.createElement("div");mp.className="mprev";
mp.innerHTML='<div class="mb">'+["#c4c4bc","#c1b89c","#86b230","#1fa79c","#8672c4","#c8545c","#0c5f5a"].map(c=>'<i style="background:'+c+'"></i>').join("")+'</div><div class="mc"><b>EN MANTENIMIENTO</b><p id="mpt"></p></div><span class="ml">Vista previa</span>';
g("mcard").append(mp);
setInterval(()=>{if(curTab==="mant")g("mpt").textContent=g("mmsg").value.trim()||"Estamos mejorando la página. Volvemos muy pronto.";if(curTab==="mant")hsub()},400);
// el botón Guardar late cuando hay cambios sin guardar
new MutationObserver(()=>g("save").classList.toggle("dirty",/\*/.test(g("save").textContent))).observe(g("save"),{childList:true,characterData:true,subtree:true});
// los mensajes salen como aviso flotante (así se ven aunque estés abajo en la lista)
const msgObs=()=>{const m=g("msg"),t=(m.textContent||"").trim();if(t){tt.classList.toggle("bad",m.className==="err");toast(t,m.className==="err"?5000:2600)}};
new MutationObserver(msgObs).observe(g("msg"),{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:["class"]});
// indicador deslizante de la barra inferior
const ind=document.createElement("i");ind.className="ind";tabs.prepend(ind);
function moveInd(){const b=tabs.querySelector("button.on");if(!b||!b.offsetWidth)return;ind.style.width=b.offsetWidth+"px";ind.style.transform="translateX("+b.offsetLeft+"px)"}
new MutationObserver(()=>requestAnimationFrame(()=>{moveInd();hsub()})).observe(g("app"),{attributes:true,attributeFilter:["hidden"]});
addEventListener("resize",moveInd);
// cuenta: saludo, inicial y rol
function acctInfo(){
  const av2=ac.querySelector(".av");av2.textContent=(g("who").textContent||"A").trim().charAt(0).toUpperCase()||"A";
  let gr=ac.querySelector(".greet");if(!gr){gr=document.createElement("p");gr.className="greet";accCard.prepend(gr)}
  gr.textContent=hello()+", "+nameOf();sm.textContent=g("mcard").hidden?"Administrador":"Dueño";
  em.textContent=g("who").textContent||"";
}
// entrar: mostrar/ocultar contraseña y fondo animado
const pw=g("pw");if(pw){const w=document.createElement("div");w.className="pwrap";pw.parentNode.insertBefore(w,pw);w.append(pw);
  const eye=document.createElement("button");eye.type="button";eye.className="eye";eye.textContent="Ver";eye.onclick=()=>{const on=pw.type==="password";pw.type=on?"text":"password";eye.textContent=on?"Ocultar":"Ver"};w.append(eye)}
if(lf){const p=document.createElement("p");p.className="tag";p.textContent="Administra los canales de O-PLUS TV";lf.querySelector("h1").after(p)}
const orbs=document.createElement("div");orbs.className="orbs";orbs.innerHTML="<i></i><i></i>";document.body.prepend(orbs);
show("canales");hsub();

// ---- Botón "atrás" del celular
if(P.App)P.App.addListener("backButton",()=>{
  if(!g("app").hidden&&!document.body.classList.contains("t-canales"))return show("canales");
  if(window.adminIsDirty&&adminIsDirty()&&!confirm("Tienes cambios sin guardar (queda un borrador). ¿Salir de la app?"))return;
  P.App.exitApp();
});
})();
