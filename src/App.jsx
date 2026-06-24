import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const EJS_SERVICE     = "service_gdnezgh";
const EJS_TPL_CLIENTE = "template_ko2otxk";
const EJS_TPL_TIENDA  = "template_lmdnq8m";
const EJS_PUBLIC      = "fsB-EreO4-4UsYo9Y";
const TG_TOKEN        = "8561046903:AAEQl1KQSQeNGAQ0si63MbzRePhzGQytXdI";
const TG_CHAT_ID      = "7681123167";

async function sendTelegram(text) {
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: "HTML" }),
    });
  } catch (e) { console.error("Telegram error:", e); }
}

const bg     = "#fff5f7";
const card   = "#ffffff";
const cardHi = "#fdedf0";
const border = "#f5c6d0";
const accent = "#d63060";
const accentS= "#e8406f";
const text   = "#1a1a1a";
const muted  = "#9a6070";
const pill   = "#fdedf0";

const MENU = {
  esquites: {
    label: "Esquites", emoji: "🌽",
    items: [
      { id:"esquites-chico",   emoji:"🌽", nombre:"Esquites Chico",   desc:"Porción chica al estilo Veracruz",   precios:{ "Amarillo":50, "Natural":45 }, tipo:"grano" },
      { id:"esquites-mediano", emoji:"🌽", nombre:"Esquites Mediano", desc:"Porción mediana al estilo Veracruz", precios:{ "Amarillo":60, "Natural":55 }, tipo:"grano" },
      { id:"esquites-grande",  emoji:"🌽", nombre:"Esquites Grande",  desc:"Porción grande al estilo Veracruz",  precios:{ "Amarillo":70, "Natural":65 }, tipo:"grano" },
    ],
  },
  antojitos: {
    label: "Antojitos", emoji: "🌮",
    items: [
      { id:"elote",              emoji:"🌽", nombre:"Elote",              desc:"Elote preparado con crema, queso, chile y limón",              precios:{ "Regular":45 } },
      { id:"chicharron-preparado", emoji:"🥓", nombre:"Chicharrón Preparado", desc:"Chicharrón preparado al estilo Veracruz", precios:{ "Natural":75, "Amarillo":80 }, tipo:"grano" },
      { id:"tosticrazy",         emoji:"🔥", nombre:"Tosticrazy",         desc:"Tostielote con todo el sabor",                              precios:{ "Natural":75, "Amarillo":80 }, tipo:"grano" },
    ],
  },
  fresas: {
    label: "Fresas con Crema", emoji: "🍓",
    items: [
      { id:"fresas-chica",   emoji:"🍓", nombre:"Fresas con Crema Chica",   desc:"Fresas frescas con crema, tamaño chico",   precios:{ "Chica":45 } },
      { id:"fresas-mediana", emoji:"🍓", nombre:"Fresas con Crema Mediana", desc:"Fresas frescas con crema, tamaño mediano", precios:{ "Mediana":90 } },
      { id:"fresas-grande",  emoji:"🍓", nombre:"Fresas con Crema Grande",  desc:"Fresas frescas con crema, tamaño grande",  precios:{ "Grande":170 } },
    ],
  },
  dubai: {
    label: "Fresas Dubai", emoji: "✨",
    items: [
      { id:"dubai", emoji:"✨", nombre:"Fresas Dubai", desc:"Fresas con crema estilo Dubai", precios:{ "Chica":95, "Mediana":190, "Grande":370 }, tipo:"especial" },
    ],
  },
  lotus: {
    label: "Fresas Lotus", emoji: "🌸",
    items: [
      { id:"lotus", emoji:"🌸", nombre:"Fresas Lotus", desc:"Fresas con crema estilo Lotus", precios:{ "Chica":70, "Mediana":120, "Grande":205 }, tipo:"especial" },
    ],
  },
};

const HORARIOS = ["Lo antes posible","11:00–12:00","12:00–13:00","13:00–14:00","16:00–17:00","17:00–18:00","18:00–19:00","19:00–20:00"];
const ZONAS    = ["Martí","Colón","Centro","Boca del Río","Veracruz Norte","Veracruz Sur","Reforma","Flores Magón","Costa Verde"];

const s = {
  label: { fontFamily:"system-ui,sans-serif", fontSize:11, color:muted, textTransform:"uppercase", letterSpacing:"0.12em", display:"block", marginBottom:8 },
  input: { width:"100%", boxSizing:"border-box", background:card, border:`1.5px solid ${border}`, borderRadius:14, padding:"13px 16px", fontFamily:"system-ui,sans-serif", fontSize:15, color:text, outline:"none" },
};

function carritoLineKey(i) {
  return i.uid || `${i.id}|${i.tamano}|${i.precio}`;
}

function buildResumen(carrito) {
  return carrito.flatMap(i => {
    if (i.toppings) {
      return Array.from({ length: i.cantidad }, () =>
        `1× ${i.nombre} (${i.tamano}) — $${i.precio.toFixed(0)}\n   └ ${i.toppings}`
      );
    }
    return [`${i.cantidad}× ${i.nombre} (${i.tamano}) — $${(i.precio * i.cantidad).toFixed(0)}`];
  }).join("\n");
}

function Btn({ children, onClick, variant="primary", disabled }) {
  const base = { border:"none", cursor:disabled?"default":"pointer", borderRadius:14, fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:15, transition:"opacity 0.15s", opacity:disabled?0.4:1 };
  if (variant==="primary") return <button onClick={onClick} disabled={disabled} style={{ ...base, background:accent, color:"#fff", padding:"14px 0", width:"100%" }}>{children}</button>;
  if (variant==="ghost")   return <button onClick={onClick} disabled={disabled} style={{ ...base, background:"none", color:muted, padding:"14px 0" }}>{children}</button>;
}

function Pasos({ paso }) {
  const steps = ["Menú","Entrega","Confirmar"];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, margin:"8px 0 28px" }}>
      {steps.map((label,i) => {
        const n=i+1, active=paso===n, done=paso>n;
        return (
          <div key={n} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:14, background:active?accent:done?"#2a7c3a":pill, color:active||done?"#fff":muted, border:active?`2px solid ${accentS}`:"2px solid transparent" }}>{done?"✓":n}</div>
              <span style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:active?text:muted, fontWeight:active?600:400 }}>{label}</span>
            </div>
            {i<steps.length-1 && <div style={{ width:48, height:2, background:paso>n?"#2a7c3a":border, margin:"0 8px", marginBottom:18 }} />}
          </div>
        );
      })}
    </div>
  );
}

const TOPPINGS_GRATIS   = ["Oreo","Mazapán","Granola","Lunetas","Galleta María","Almendra","Nuez","Chispas de chocolate"];
const TOPPINGS_PREMIUM  = [{ nombre:"Cheesecake",extra:30 },{ nombre:"Huevito Kinder",extra:30 },{ nombre:"Magnum",extra:30 },{ nombre:"Brownie",extra:30 },{ nombre:"Kinder Bueno",extra:30 },{ nombre:"KitKat",extra:30 },{ nombre:"Queso de Bola",extra:30 }];
const TOPPINGS_ESPECIAL = [{ nombre:"Conejito Turín",extra:20 },{ nombre:"Snicker",extra:20 },{ nombre:"Kinder",extra:20 },{ nombre:"Kinder Delice",extra:20 },{ nombre:"Galleta Doble Chocolate",extra:20 },{ nombre:"Galleta Lotus",extra:20 }];
const JARABES           = [{ nombre:"Chocolate",extra:10 },{ nombre:"Fresa",extra:10 },{ nombre:"Cajeta",extra:10 },{ nombre:"Lechera",extra:10 }];

// ── Modal fresas clásicas (con toppings gratis obligatorios) ──────────────────
function ToppingModal({ item, tamano, precioBase, onConfirm, onClose }) {
  const isChica  = tamano === "Chica";
  const isGrande = tamano === "Grande";
  const maxGratis = isChica ? 1 : 2;

  const [selGratis,   setSelGratis]   = useState([]);
  const [selPremium,  setSelPremium]  = useState([]);
  const [selEspecial, setSelEspecial] = useState(null);
  const [selJarabe,   setSelJarabe]   = useState(null);
  const [error,       setError]       = useState("");

  const toggleGratis  = (t) => {
    if (selGratis.includes(t)) { setSelGratis(selGratis.filter(x=>x!==t)); return; }
    if (selGratis.length >= maxGratis) { setError(`Solo puedes elegir ${maxGratis} topping${maxGratis>1?"s":""} gratis`); setTimeout(()=>setError(""),2000); return; }
    setSelGratis([...selGratis, t]);
  };
  const togglePremium  = (t) => { if (selPremium.includes(t.nombre)) { setSelPremium(selPremium.filter(x=>x!==t.nombre)); return; } setSelPremium([...selPremium, t.nombre]); };
  const toggleEspecial = (t) => { setSelEspecial(selEspecial === t.nombre ? null : t.nombre); };

  const extraPremium  = selPremium.length * 30;
  const extraEspecial = (!isGrande && selEspecial) ? 20 : 0;
  const extraJarabe   = selJarabe ? 10 : 0;
  const totalExtra    = extraPremium + extraEspecial + extraJarabe;
  const precioFinal   = precioBase + totalExtra;

  const handleConfirm = () => {
    if (selGratis.length < maxGratis) { setError(`Elige ${maxGratis} topping${maxGratis>1?"s":""} gratis`); setTimeout(()=>setError(""),2500); return; }
    const toppingDesc = [...selGratis, ...selPremium.map(t=>`${t} (+$30)`), ...(selEspecial?[`${selEspecial}${isGrande?"":" (+$20)"}`]:[]), ...(selJarabe?[`Jarabe ${selJarabe} (+$10)`]:[])].join(", ");
    onConfirm({ toppingDesc, precioFinal });
  };

  const overlay  = { position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" };
  const sheet    = { background:bg, borderRadius:"24px 24px 0 0", padding:"24px 20px 36px", maxWidth:520, width:"100%", maxHeight:"90vh", overflowY:"auto" };
  const secTitle = { fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:13, color:accent, textTransform:"uppercase", letterSpacing:"0.1em", margin:"18px 0 10px" };
  const chip     = (sel) => ({ border:`1.5px solid ${sel?accent:border}`, background:sel?accent+"22":card, borderRadius:10, padding:"8px 13px", cursor:"pointer", fontFamily:"system-ui,sans-serif", fontSize:13, fontWeight:600, color:sel?accent:text, display:"flex", alignItems:"center", gap:6 });

  return (
    <div style={overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={sheet}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div>
            <div style={{ fontFamily:"system-ui,sans-serif", fontWeight:800, fontSize:18, color:text }}>Personaliza tus fresas 🍓</div>
            <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, color:muted, marginTop:3 }}>{item.nombre} — {tamano}</div>
          </div>
          <button onClick={onClose} style={{ background:pill, border:"none", borderRadius:"50%", width:34, height:34, fontSize:18, cursor:"pointer", color:text, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={secTitle}>🎉 Toppings incluidos — elige {maxGratis}<span style={{ color:muted, fontWeight:400, fontSize:11, marginLeft:6, textTransform:"none" }}>({selGratis.length}/{maxGratis})</span></div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{TOPPINGS_GRATIS.map(t=><button key={t} onClick={()=>toggleGratis(t)} style={chip(selGratis.includes(t))}>{t}</button>)}</div>
        <div style={secTitle}>⭐ Premium — +$30 c/u</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{TOPPINGS_PREMIUM.map(t=><button key={t.nombre} onClick={()=>togglePremium(t)} style={chip(selPremium.includes(t.nombre))}>{t.nombre} <span style={{ fontSize:11, color:selPremium.includes(t.nombre)?accent:muted }}>+$30</span></button>)}</div>
        <div style={secTitle}>✨ Especial — {isGrande?"1 gratis 🎁":"+$20"}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{TOPPINGS_ESPECIAL.map(t=><button key={t.nombre} onClick={()=>toggleEspecial(t)} style={chip(selEspecial===t.nombre)}>{t.nombre} {!isGrande&&<span style={{ fontSize:11, color:selEspecial===t.nombre?accent:muted }}>+$20</span>}{isGrande&&<span style={{ fontSize:11, color:"#2a7c3a" }}>gratis</span>}</button>)}</div>
        <div style={secTitle}>🍯 Jarabe — +$10</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{JARABES.map(j=><button key={j.nombre} onClick={()=>setSelJarabe(selJarabe===j.nombre?null:j.nombre)} style={chip(selJarabe===j.nombre)}>{j.nombre} <span style={{ fontSize:11, color:selJarabe===j.nombre?accent:muted }}>+$10</span></button>)}</div>
        {error && <div style={{ background:accent+"18", border:`1px solid ${accent}55`, borderRadius:10, padding:"10px 14px", fontFamily:"system-ui,sans-serif", fontSize:13, color:accent, marginTop:14 }}>{error}</div>}
        <div style={{ background:card, border:`1.5px solid ${border}`, borderRadius:14, padding:"14px 16px", marginTop:18, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"system-ui,sans-serif", fontSize:12, color:muted }}>Precio base ${precioBase}{totalExtra>0?` + extras $${totalExtra}`:""}</div>
            <div style={{ fontFamily:"system-ui,sans-serif", fontWeight:800, fontSize:20, color:accent }}>Total: ${precioFinal}</div>
          </div>
          <button onClick={handleConfirm} style={{ background:accent, border:"none", borderRadius:12, padding:"12px 22px", fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:15, color:"#fff", cursor:"pointer" }}>+ Agregar 🍓</button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Dubai / Lotus (básicos +$10, resto opcional) ───────────────────────
function ToppingModalOpcional({ item, tamano, precioBase, onConfirm, onClose }) {
  const [selBasicos,  setSelBasicos]  = useState([]);
  const [selPremium,  setSelPremium]  = useState([]);
  const [selEspecial, setSelEspecial] = useState(null);
  const [selJarabe,   setSelJarabe]   = useState(null);

  const toggleBasicos = (t) => { if (selBasicos.includes(t)) { setSelBasicos(selBasicos.filter(x=>x!==t)); return; } setSelBasicos([...selBasicos, t]); };
  const togglePremium = (t) => { if (selPremium.includes(t.nombre)) { setSelPremium(selPremium.filter(x=>x!==t.nombre)); return; } setSelPremium([...selPremium, t.nombre]); };

  const extraBasicos  = selBasicos.length * 10;
  const extraPremium  = selPremium.length * 30;
  const extraEspecial = selEspecial ? 20 : 0;
  const extraJarabe   = selJarabe ? 10 : 0;
  const totalExtra    = extraBasicos + extraPremium + extraEspecial + extraJarabe;
  const precioFinal   = precioBase + totalExtra;

  const handleConfirm = () => {
    const toppingDesc = [...selBasicos.map(t=>`${t} (+$10)`), ...selPremium.map(t=>`${t} (+$30)`), ...(selEspecial?[`${selEspecial} (+$20)`]:[]), ...(selJarabe?[`Jarabe ${selJarabe} (+$10)`]:[])].join(", ");
    onConfirm({ toppingDesc: toppingDesc || "Sin toppings extra", precioFinal });
  };

  const overlay  = { position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" };
  const sheet    = { background:bg, borderRadius:"24px 24px 0 0", padding:"24px 20px 36px", maxWidth:520, width:"100%", maxHeight:"90vh", overflowY:"auto" };
  const secTitle = { fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:13, color:accent, textTransform:"uppercase", letterSpacing:"0.1em", margin:"18px 0 10px" };
  const chip     = (sel) => ({ border:`1.5px solid ${sel?accent:border}`, background:sel?accent+"22":card, borderRadius:10, padding:"8px 13px", cursor:"pointer", fontFamily:"system-ui,sans-serif", fontSize:13, fontWeight:600, color:sel?accent:text, display:"flex", alignItems:"center", gap:6 });

  return (
    <div style={overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={sheet}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div>
            <div style={{ fontFamily:"system-ui,sans-serif", fontWeight:800, fontSize:18, color:text }}>Personaliza {item.emoji}</div>
            <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, color:muted, marginTop:3 }}>{item.nombre} — {tamano} · Toppings opcionales</div>
          </div>
          <button onClick={onClose} style={{ background:pill, border:"none", borderRadius:"50%", width:34, height:34, fontSize:18, cursor:"pointer", color:text, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={secTitle}>🎉 Básicos — +$10 c/u</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{TOPPINGS_GRATIS.map(t=><button key={t} onClick={()=>toggleBasicos(t)} style={chip(selBasicos.includes(t))}>{t} <span style={{ fontSize:11, color:selBasicos.includes(t)?accent:muted }}>+$10</span></button>)}</div>
        <div style={secTitle}>⭐ Premium — +$30 c/u</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{TOPPINGS_PREMIUM.map(t=><button key={t.nombre} onClick={()=>togglePremium(t)} style={chip(selPremium.includes(t.nombre))}>{t.nombre} <span style={{ fontSize:11, color:selPremium.includes(t.nombre)?accent:muted }}>+$30</span></button>)}</div>
        <div style={secTitle}>✨ Especial — +$20</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{TOPPINGS_ESPECIAL.map(t=><button key={t.nombre} onClick={()=>setSelEspecial(selEspecial===t.nombre?null:t.nombre)} style={chip(selEspecial===t.nombre)}>{t.nombre} <span style={{ fontSize:11, color:selEspecial===t.nombre?accent:muted }}>+$20</span></button>)}</div>
        <div style={secTitle}>🍯 Jarabe — +$10</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{JARABES.map(j=><button key={j.nombre} onClick={()=>setSelJarabe(selJarabe===j.nombre?null:j.nombre)} style={chip(selJarabe===j.nombre)}>{j.nombre} <span style={{ fontSize:11, color:selJarabe===j.nombre?accent:muted }}>+$10</span></button>)}</div>
        <div style={{ background:card, border:`1.5px solid ${border}`, borderRadius:14, padding:"14px 16px", marginTop:18, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"system-ui,sans-serif", fontSize:12, color:muted }}>Precio base ${precioBase}{totalExtra>0?` + extras $${totalExtra}`:""}</div>
            <div style={{ fontFamily:"system-ui,sans-serif", fontWeight:800, fontSize:20, color:accent }}>Total: ${precioFinal}</div>
          </div>
          <button onClick={handleConfirm} style={{ background:accent, border:"none", borderRadius:12, padding:"12px 22px", fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:15, color:"#fff", cursor:"pointer" }}>+ Agregar {item.emoji}</button>
        </div>
      </div>
    </div>
  );
}

function ProductoCard({ item, onAdd, carritoItems }) {
  const tamanos    = Object.keys(item.precios);
  const [tam, setTam]             = useState(tamanos[0]);
  const [flash, setFlash]         = useState(false);
  const [showModal, setShowModal] = useState(false);
  const esGrano    = item.tipo === "grano";
  const esFresa    = item.id.startsWith("fresas-");
  const esEspecial = item.tipo === "especial";
  const enCarrito  = carritoItems.filter(i=>i.id===item.id).reduce((s,i)=>s+i.cantidad,0);

  const handleAdd = () => {
    if (esFresa || esEspecial) { setShowModal(true); return; }
    onAdd({ id:item.id, nombre:item.nombre, tamano:esGrano?`Grano ${tam}`:tam, precio:item.precios[tam], emoji:item.emoji });
    setFlash(true); setTimeout(()=>setFlash(false),900);
  };
  const handleToppingConfirm = ({ toppingDesc, precioFinal }) => {
    onAdd({ id:item.id, nombre:item.nombre, tamano:tam, precio:precioFinal, emoji:item.emoji, toppings:toppingDesc });
    setShowModal(false);
    setFlash(true); setTimeout(()=>setFlash(false),900);
  };

  return (
    <>
      {showModal && esFresa && (
        <ToppingModal item={item} tamano={tam} precioBase={item.precios[tam]} onConfirm={handleToppingConfirm} onClose={()=>setShowModal(false)} />
      )}
      {showModal && esEspecial && (
        <ToppingModalOpcional item={item} tamano={tam} precioBase={item.precios[tam]} onConfirm={handleToppingConfirm} onClose={()=>setShowModal(false)} />
      )}
      <div style={{ background:card, border:`1.5px solid ${border}`, borderRadius:18, padding:"16px", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:68, height:68, borderRadius:14, background:pill, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, flexShrink:0 }}>{item.emoji}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:15, color:text, marginBottom:2 }}>{item.nombre}</div>
          <p style={{ fontFamily:"system-ui,sans-serif", fontSize:12, color:muted, margin:"0 0 8px", lineHeight:1.4 }}>{item.desc}</p>
          {esGrano ? (
            <div>
              <span style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>Grano:</span>
              <div style={{ display:"flex", gap:6, marginTop:5 }}>
                {tamanos.map(t=><button key={t} onClick={()=>setTam(t)} style={{ border:`1.5px solid ${t===tam?accent:border}`, background:t===tam?accent+"22":"none", borderRadius:8, padding:"4px 12px", fontFamily:"system-ui,sans-serif", fontSize:11, color:t===tam?accent:muted, cursor:"pointer", fontWeight:600 }}>{t}</button>)}
              </div>
            </div>
          ) : tamanos.length>1 ? (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {tamanos.map(t=><button key={t} onClick={()=>setTam(t)} style={{ border:`1.5px solid ${t===tam?accent:border}`, background:t===tam?accent+"22":"none", borderRadius:8, padding:"4px 10px", fontFamily:"system-ui,sans-serif", fontSize:11, color:t===tam?accent:muted, cursor:"pointer", fontWeight:600 }}>{t}</button>)}
            </div>
          ) : null}
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
          <span style={{ fontFamily:"system-ui,sans-serif", fontWeight:800, fontSize:17, color:accent }}>${item.precios[tam]}</span>
          <button onClick={handleAdd} style={{ border:"none", cursor:"pointer", borderRadius:10, padding:"7px 14px", background:flash?"#2a7c3a":pill, color:flash?"#7fff9f":text, fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:13, transition:"all 0.2s", whiteSpace:"nowrap" }}>
            {flash?"✓":enCarrito>0?`+1 (${enCarrito})`:esEspecial?`${item.emoji} Armar`:esFresa?"🍓 Armar":"+Agregar"}
          </button>
        </div>
      </div>
    </>
  );
}

function PasoMenu({ carrito, onAdd, onNext }) {
  const total = carrito.reduce((s,i)=>s+i.precio*i.cantidad,0);
  const count = carrito.reduce((s,i)=>s+i.cantidad,0);
  return (
    <div>
      <h2 style={{ fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:22, color:text, margin:"0 0 20px", textAlign:"center" }}>¿Qué se te antoja hoy?</h2>
      {Object.entries(MENU).map(([key,cat])=>(
        <div key={key} style={{ marginBottom:28 }}>
          <div style={{ fontFamily:"system-ui,sans-serif", fontWeight:600, fontSize:12, textTransform:"uppercase", letterSpacing:"0.12em", color:muted, marginBottom:12 }}>{cat.emoji} {cat.label}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {cat.items.map(item=><ProductoCard key={item.id} item={item} onAdd={onAdd} carritoItems={carrito} />)}
          </div>
        </div>
      ))}
      {count>0 && (
        <div style={{ position:"sticky", bottom:16, background:accent, borderRadius:16, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", boxShadow:"0 8px 32px rgba(214,48,96,0.4)" }} onClick={onNext}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ background:"rgba(255,255,255,0.25)", borderRadius:"50%", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,sans-serif", fontWeight:800, fontSize:13, color:"#fff" }}>{count}</span>
            <span style={{ fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:15, color:"#fff" }}>Ver pedido</span>
          </div>
          <span style={{ fontFamily:"system-ui,sans-serif", fontWeight:800, fontSize:16, color:"#fff" }}>${total.toFixed(0)} →</span>
        </div>
      )}
    </div>
  );
}

function PasoEntrega({ carrito, onQuitar, onAdd, onNext, onBack }) {
  const [tipo, setTipo] = useState("domicilio");
  const [hora, setHora] = useState(HORARIOS[0]);
  const subtotal = carrito.reduce((s,i)=>s+i.precio*i.cantidad,0);
  const envio    = tipo==="domicilio"&&subtotal<200?30:0;
  const total    = subtotal+envio;
  return (
    <div>
      <h2 style={{ fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:22, color:text, margin:"0 0 24px", textAlign:"center" }}>¿Cómo lo recibas?</h2>
      <div style={{ marginBottom:20 }}>
        <span style={s.label}>Tipo de entrega</span>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[["domicilio","🛵","A domicilio"],["recoger","🏪","Recoger en tienda"]].map(([v,emoji,lbl])=>(
            <div key={v} onClick={()=>setTipo(v)} style={{ background:tipo===v?accent+"22":card, border:`1.5px solid ${tipo===v?accent:border}`, borderRadius:16, padding:"18px 12px", textAlign:"center", cursor:"pointer" }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{emoji}</div>
              <div style={{ fontFamily:"system-ui,sans-serif", fontWeight:600, fontSize:13, color:tipo===v?accent:text }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom:20 }}>
        <span style={s.label}>{tipo==="domicilio"?"Horario de entrega":"Hora para recoger"}</span>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {HORARIOS.map(h=><button key={h} onClick={()=>setHora(h)} style={{ border:`1.5px solid ${h===hora?accent:border}`, background:h===hora?accent+"22":card, borderRadius:10, padding:"8px 14px", fontFamily:"system-ui,sans-serif", fontSize:12, fontWeight:600, color:h===hora?accent:muted, cursor:"pointer" }}>{h}</button>)}
        </div>
      </div>
      <div style={{ background:card, border:`1.5px solid ${border}`, borderRadius:18, padding:18, marginBottom:20 }}>
        <span style={s.label}>Tu pedido</span>
        {carrito.map(i=>(
          <div key={carritoLineKey(i)} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:44, height:44, borderRadius:8, background:pill, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{i.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"system-ui,sans-serif", fontSize:14, fontWeight:600, color:text }}>{i.nombre}</div>
              <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:muted }}>{i.tamano}{i.toppings?` · ${i.toppings}`:""}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button onClick={()=>onQuitar(i)} style={{ background:pill, border:"none", borderRadius:8, width:26, height:26, color:text, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
              <span style={{ fontFamily:"system-ui,sans-serif", fontSize:14, fontWeight:700, color:text, minWidth:16, textAlign:"center" }}>{i.cantidad}</span>
              <button onClick={()=>onAdd(i)} style={{ background:pill, border:"none", borderRadius:8, width:26, height:26, color:text, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
            </div>
            <span style={{ fontFamily:"system-ui,sans-serif", fontSize:14, fontWeight:700, color:accent, minWidth:52, textAlign:"right" }}>${(i.precio*i.cantidad).toFixed(0)}</span>
          </div>
        ))}
        <div style={{ borderTop:`1px solid ${border}`, marginTop:8, paddingTop:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"system-ui,sans-serif", fontSize:13, color:muted, marginBottom:4 }}><span>Subtotal</span><span>${subtotal.toFixed(0)}</span></div>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"system-ui,sans-serif", fontSize:13, color:muted, marginBottom:4 }}><span>Envío</span><span>{tipo==="recoger"?"—":envio===0?"🎉 Gratis":`$${envio}`}</span></div>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"system-ui,sans-serif", fontSize:17, fontWeight:800, color:text, marginTop:8 }}><span>Total</span><span style={{ color:accent }}>${total.toFixed(0)}</span></div>
        </div>
      </div>
      <Btn onClick={()=>onNext({tipo,hora,subtotal,envio,total})} variant="primary">Continuar →</Btn>
      <div style={{ textAlign:"center", marginTop:10 }}><Btn onClick={onBack} variant="ghost">← Volver al menú</Btn></div>
    </div>
  );
}

function PasoDatos({ entrega, carrito, onBack, onConfirmar }) {
  const [nombre,setNombre]       = useState("");
  const [telefono,setTelefono]   = useState("");
  const [email,setEmail]         = useState("");
  const [direccion,setDireccion] = useState("");
  const [colonia,setColonia]     = useState("");
  const [numInt,setNumInt]       = useState("");
  const [cp,setCp]               = useState("");
  const [pago,setPago]           = useState("efectivo");
  const [notas,setNotas]         = useState("");
  const [error,setError]         = useState(null);
  const [enviando,setEnviando]   = useState(false);

  const handleConfirmar = async () => {
    if (!nombre.trim()||!telefono.trim()) { setError("Falta tu nombre o teléfono."); return; }
    if (entrega.tipo==="domicilio"&&!direccion.trim()) { setError("Falta la dirección."); return; }
    if (entrega.tipo==="domicilio"&&!colonia)          { setError("Selecciona tu colonia."); return; }
    if (entrega.tipo==="domicilio"&&!cp.trim())        { setError("Falta el código postal."); return; }
    setError(null); setEnviando(true);

    const num   = Math.floor(Math.random()*9999)+1;
    const folio = `#FP:${String(num).padStart(4,"0")}`;
    const resumen    = buildResumen(carrito);
    const tipoLabel  = entrega.tipo==="domicilio"?"🛵 A domicilio":"🏪 Recoger en tienda";
    const pagoLabel  = pago==="efectivo"?"💵 Efectivo":pago==="tarjeta"?"💳 Tarjeta":"📲 Transferencia";
    const dirCompleta = entrega.tipo==="domicilio" ? `${direccion}${numInt?`, Int. ${numInt}`:""}, ${colonia}, CP ${cp}` : "—";

    try {
      emailjs.init(EJS_PUBLIC);
      await emailjs.send(EJS_SERVICE, EJS_TPL_TIENDA, {
        folio, nombre, telefono, email_cliente: email||"No proporcionó",
        resumen_pedido: resumen,
        subtotal: `$${entrega.subtotal.toFixed(0)}`,
        envio: entrega.envio===0?"Gratis":`$${entrega.envio.toFixed(0)}`,
        total: `$${entrega.total.toFixed(0)}`,
        tipo_entrega: tipoLabel, horario: entrega.hora, forma_pago: pagoLabel,
        direccion: dirCompleta, colonia: colonia||"—", num_interior: numInt||"—", cp: cp||"—",
        notas: notas||"Sin notas",
      });
    } catch (e) { console.error("EmailJS tienda:", e); }

    if (email.trim()) {
      try {
        await emailjs.send(EJS_SERVICE, EJS_TPL_CLIENTE, {
          folio, nombre, email_cliente: email,
          resumen_pedido: resumen,
          total: `$${entrega.total.toFixed(0)}`,
          tipo_entrega: tipoLabel, horario: entrega.hora, forma_pago: pagoLabel,
          direccion: dirCompleta, notas: notas||"",
        });
      } catch (e) { console.error("EmailJS cliente:", e); }
    }

    const tgMsg = [
      `🍓 <b>NUEVO PEDIDO — ${folio}</b>`, ``,
      `👤 <b>Cliente</b>`,
      `• Nombre: ${nombre}`, `• Tel: ${telefono}`, `• Email: ${email||"—"}`, `• Pago: ${pagoLabel}`, ``,
      `📦 <b>Entrega</b>`,
      `• Tipo: ${tipoLabel}`, `• Horario: ${entrega.hora}`,
      entrega.tipo==="domicilio"?`• Dirección: ${dirCompleta}`:"",``,
      `🛒 <b>Pedido</b>`, resumen, ``,
      `💰 Subtotal: $${entrega.subtotal.toFixed(0)}`,
      `🛵 Envío: ${entrega.envio===0?"Gratis":`$${entrega.envio.toFixed(0)}`}`,
      `✅ <b>TOTAL: $${entrega.total.toFixed(0)}</b>`,
      notas?`\n📝 Notas: ${notas}`:"",
    ].filter(l=>l!=="").join("\n");
    await sendTelegram(tgMsg);

    setEnviando(false);
    onConfirmar({ folio, nombre, telefono, email, direccion, numInt, colonia, cp, pago, notas });
  };

  return (
    <div>
      <h2 style={{ fontFamily:"system-ui,sans-serif", fontWeight:700, fontSize:22, color:text, margin:"0 0 24px", textAlign:"center" }}>Tus datos</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div><span style={s.label}>Nombre</span><input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="¿Cómo te llamas?" style={s.input} /></div>
        <div><span style={s.label}>Teléfono</span><input value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="229 000 0000" type="tel" style={s.input} /></div>
        <div><span style={s.label}>Correo <span style={{ color:muted, textTransform:"none", fontSize:10 }}>(opcional)</span></span><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tucorreo@gmail.com" type="email" style={s.input} /></div>
        {entrega.tipo==="domicilio"&&<div><span style={s.label}>Dirección</span><textarea value={direccion} onChange={e=>setDireccion(e.target.value)} placeholder="Calle, número y referencias" rows={2} style={{ ...s.input, resize:"vertical" }} /></div>}
        {entrega.tipo==="domicilio"&&<div><span style={s.label}>Número interior <span style={{ color:muted, textTransform:"none", fontSize:10 }}>(opcional)</span></span><input value={numInt} onChange={e=>setNumInt(e.target.value)} placeholder='Ej: "102A"' style={s.input} /></div>}
        {entrega.tipo==="domicilio"&&<div><span style={s.label}>Colonia</span><select value={colonia} onChange={e=>setColonia(e.target.value)} style={{ ...s.input, appearance:"none", WebkitAppearance:"none" }}><option value="">Selecciona tu colonia…</option>{ZONAS.map(z=><option key={z} value={z}>{z}</option>)}</select></div>}
        {entrega.tipo==="domicilio"&&<div><span style={s.label}>Código postal</span><input value={cp} onChange={e=>setCp(e.target.value)} placeholder="91700" type="tel" maxLength={5} style={s.input} /></div>}
        <div>
          <span style={s.label}>Forma de pago</span>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[["efectivo","💵","Efectivo"],["tarjeta","💳","Tarjeta"],["transferencia","📲","Transferencia"]].map(([v,emoji,lbl])=>(
              <div key={v} onClick={()=>setPago(v)} style={{ background:pago===v?accent+"22":card, border:`1.5px solid ${pago===v?accent:border}`, borderRadius:14, padding:"14px 8px", textAlign:"center", cursor:"pointer" }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{emoji}</div>
                <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, fontWeight:600, color:pago===v?accent:muted }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div><span style={s.label}>Notas (opcional)</span><textarea value={notas} onChange={e=>setNotas(e.target.value)} placeholder="Sin chile, extra crema…" rows={2} style={{ ...s.input, resize:"vertical" }} /></div>
        <div style={{ background:card, border:`1.5px solid ${border}`, borderRadius:14, padding:"14px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"system-ui,sans-serif", fontSize:13, color:muted, marginBottom:4 }}><span>{entrega.tipo==="domicilio"?"🛵 Entrega":"🏪 Recoger"}</span><span>{entrega.hora}</span></div>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"system-ui,sans-serif", fontSize:16, fontWeight:800, color:text }}><span>Total</span><span style={{ color:accent }}>${entrega.total.toFixed(0)}</span></div>
        </div>
        {error&&<div style={{ background:accent+"18", border:`1px solid ${accent}55`, borderRadius:12, padding:"12px 16px", fontFamily:"system-ui,sans-serif", fontSize:13, color:accent }}>{error}</div>}
        <Btn onClick={handleConfirmar} variant="primary" disabled={enviando}>{enviando?"Enviando pedido…":"Confirmar pedido 🍓"}</Btn>
        <div style={{ textAlign:"center" }}><Btn onClick={onBack} variant="ghost" disabled={enviando}>← Volver</Btn></div>
      </div>
    </div>
  );
}

function Confirmacion({ folio, nombre, entrega, carrito, onNuevoPedido }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🍓</div>
      <h2 style={{ fontFamily:"system-ui,sans-serif", fontWeight:800, fontSize:24, color:text, margin:"0 0 8px" }}>¡Pedido recibido!</h2>
      <p style={{ fontFamily:"system-ui,sans-serif", fontSize:15, color:muted, margin:"0 0 28px" }}>Ya preparamos tu pedido, {nombre.split(" ")[0]}.</p>
      <div style={{ background:card, border:`1.5px solid ${border}`, borderRadius:20, padding:24, marginBottom:24, textAlign:"left" }}>
        <div style={{ textAlign:"center", marginBottom:18 }}>
          <span style={{ fontFamily:"system-ui,sans-serif", fontSize:12, color:muted, textTransform:"uppercase", letterSpacing:"0.1em" }}>Folio</span>
          <div style={{ fontFamily:"monospace", fontSize:28, fontWeight:800, color:accent, marginTop:4 }}>{folio}</div>
        </div>
        <div style={{ borderTop:`1px dashed ${border}`, paddingTop:16 }}>
          {carrito.map(i=>(
            <div key={carritoLineKey(i)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, fontFamily:"system-ui,sans-serif" }}>
              <span style={{ fontSize:24, marginRight:8 }}>{i.emoji}</span>
              <span style={{ flex:1, fontSize:14, color:text }}>{i.cantidad}× {i.nombre} <span style={{ color:muted, fontSize:12 }}>({i.tamano}{i.toppings?` · ${i.toppings}`:""})</span></span>
              <span style={{ fontSize:14, fontWeight:700, color:accent }}>${(i.precio*i.cantidad).toFixed(0)}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop:`1px dashed ${border}`, paddingTop:14, marginTop:4 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"system-ui,sans-serif", fontSize:18, fontWeight:800, color:text }}><span>Total</span><span style={{ color:accent }}>${entrega.total.toFixed(0)}</span></div>
          <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, color:muted, marginTop:10 }}>{entrega.tipo==="domicilio"?`🛵 Entrega: ${entrega.hora}`:`🏪 Recoger: ${entrega.hora}`}</div>
        </div>
      </div>
      <Btn onClick={onNuevoPedido} variant="primary">Hacer otro pedido</Btn>
    </div>
  );
}

export default function App() {
  const [paso,setPaso]                 = useState(1);
  const [carrito,setCarrito]           = useState([]);
  const [entrega,setEntrega]           = useState(null);
  const [abierto,setAbierto]           = useState(null);
  const [confirmacion,setConfirmacion] = useState(null);

  useEffect(()=>{
    fetch("https://timeapi.io/api/time/current/zone?timeZone=America%2FMexico_City")
      .then(r=>r.json())
      .then(data=>{ const mins=data.hour*60+data.minute; setAbierto(mins>=10*60&&mins<21*60); })
      .catch(()=>setAbierto(null));
  },[]);

  const agregar = ({ id, nombre, tamano, precio, emoji, toppings }) => {
    setCarrito(prev => {
      const item = { id, nombre, tamano, precio, emoji, toppings };
      if (toppings) {
        return [...prev, { ...item, cantidad: 1, uid: `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }];
      }
      const ex = prev.find(i => !i.uid && i.id === id && i.tamano === tamano);
      if (ex) return prev.map(i => i === ex ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...item, cantidad: 1 }];
    });
  };
  const quitar = (item) => {
    setCarrito(prev => {
      const ex = item.uid
        ? prev.find(i => i.uid === item.uid)
        : prev.find(i => !i.uid && i.id === item.id && i.tamano === item.tamano);
      if (!ex) return prev;
      if (ex.cantidad <= 1) return prev.filter(i => i !== ex);
      return prev.map(i => i === ex ? { ...i, cantidad: i.cantidad - 1 } : i);
    });
  };
  const handleConfirmar = ({ folio, ...datos }) => { setConfirmacion({ folio, datos }); setPaso(4); };
  const reset = () => { setCarrito([]); setEntrega(null); setConfirmacion(null); setPaso(1); };

  return (
    <div style={{ background:bg, minHeight:"100vh", color:text, fontFamily:"system-ui,sans-serif" }}>
      <style>{`* { box-sizing:border-box; } body { margin:0; } input,textarea,select { color-scheme:light; }`}</style>
      <div style={{ borderBottom:`1px solid ${border}`, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:bg, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:32 }}>🍓</span>
          <div>
            <div style={{ fontWeight:800, fontSize:18, lineHeight:1.1 }}>Fresas Palace</div>
            <div style={{ fontSize:12, color:muted }}>Entrega y recolección · Veracruz</div>
          </div>
        </div>
        {abierto!==null&&(
          <div style={{ background:abierto?"#1a0020":"#1a1a1a", border:`1.5px solid ${abierto?accent:"#555"}`, borderRadius:20, padding:"6px 14px", fontFamily:"system-ui,sans-serif", fontSize:12, fontWeight:700, color:"#fcfcfc", display:"flex", alignItems:"center", gap:5 }}>
            <span>{abierto?"⚡":"🌙"}</span>{abierto?"Abierto ahora":"Cerrado"}
          </div>
        )}
      </div>
      <div style={{ background:cardHi, borderBottom:`1px solid ${border}`, padding:"10px 20px", display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:14 }}>📍</span>
        <span style={{ fontFamily:"system-ui,sans-serif", fontSize:12, color:muted }}>Zonas: <b style={{ color:text }}>Martí · Colón · Centro · Boca del Río · y más</b></span>
      </div>
      <div style={{ maxWidth:520, margin:"0 auto", padding:"24px 16px 40px" }}>
        {paso<4&&<Pasos paso={paso} />}
        {paso===1&&<PasoMenu carrito={carrito} onAdd={agregar} onNext={()=>setPaso(2)} />}
        {paso===2&&<PasoEntrega carrito={carrito} onQuitar={quitar} onAdd={agregar} onNext={e=>{setEntrega(e);setPaso(3);}} onBack={()=>setPaso(1)} />}
        {paso===3&&<PasoDatos entrega={entrega} carrito={carrito} onBack={()=>setPaso(2)} onConfirmar={handleConfirmar} />}
        {paso===4&&confirmacion&&<Confirmacion folio={confirmacion.folio} nombre={confirmacion.datos.nombre} entrega={entrega} carrito={carrito} onNuevoPedido={reset} />}
      </div>
    </div>
  );
}
