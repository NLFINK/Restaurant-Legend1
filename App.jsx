import { useState, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════
   TOKENS
══════════════════════════════════════════════════════════════ */
const C = {
  orange:"#E07B39", orangeDk:"#B85E22", amber:"#F5B944",
  cream:"#FBF7F2", parchment:"#F2EBE0", warm100:"#EDE5D8", warm200:"#D9CDB8",
  brown:"#5C3D1E", brownMid:"#8B5E34", charcoal:"#1E1410",
  text:"#2D1F0F", muted:"#9A7B5C", white:"#FFFDF9",
  green:"#4A9070", greenLt:"#E6F4EE",
  gold:"#E8A020", goldDk:"#B87A00", goldLt:"#FFFBEE", goldBorder:"#F0D060",
  shadow:"rgba(92,61,30,0.12)", shadowMd:"rgba(92,61,30,0.2)",
};

/* ══════════════════════════════════════════════════════════════
   ICONS  (all paths defined, no missing names)
══════════════════════════════════════════════════════════════ */
const ICON_PATHS = {
  search:      <><circle cx="10" cy="10" r="6"/><line x1="14.5" y1="14.5" x2="20" y2="20"/></>,
  user:        <><circle cx="12" cy="7" r="4"/><path d="M3 21c0-5 3.6-9 9-9s9 4 9 9"/></>,
  settings:    <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
  message:     <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>,
  send:        <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></>,
  sparkle:     <><path d="M12 3L13.5 8.5H19L14.5 11.5L16 17L12 14L8 17L9.5 11.5L5 8.5H10.5L12 3Z"/><path d="M5 3L5.8 5.5H8.3L6.3 6.9L7.1 9.4L5 8L2.9 9.4L3.7 6.9L1.7 5.5H4.2L5 3Z" opacity="0.6"/></>,
  compass:     <><circle cx="12" cy="12" r="10"/><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/></>,
  chevronRight:<polyline points="9,18 15,12 9,6"/>,
  close:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  plus:        <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  trash:       <><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
  edit:        <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  upload:      <><polyline points="16,16 12,12 8,16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
  image:       <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></>,
  check:       <polyline points="20,6 9,17 4,12"/>,
  bell:        <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
  restaurant:  <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></>,
  location:    <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
  shield:      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  list:        <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
  printer:     <><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>,
  eye:         <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  arrowUp:     <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5,12 12,5 19,12"/></>,
  arrowDown:   <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19,12 12,19 5,12"/></>,
  bolt:        <polyline points="13,2 3,14 12,14 11,22 21,10 12,10"/>,
  leaf:        <path d="M2 22c1.25-1.25 2.5-5 2.5-5s3.75 1.25 5 0C13 13.5 20 2 20 2s-11 7-14.5 10.5C4.25 13.75 2 22 2 22z"/>,
  briefcase:   <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
  palette:     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1v-1.08c0-.27-.11-.52-.29-.71a1 1 0 01.29-.71c.35-.35.43-.86.21-1.29A6.99 6.99 0 1119 12c0 1.11-.23 2.15-.63 3.1a1 1 0 01-.95.65h-1.17a1 1 0 00-.7 1.71c.18.18.29.43.29.71V19c0 1.66-3.58 3-8 3z"/>,
  fileText:    <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  alignLeft:   <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></>,
  tag:         <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
  star:        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>,
};

const Icon = ({ name, size=18, color="currentColor", sw=1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ display:"inline-block", verticalAlign:"middle", flexShrink:0 }}>
    {ICON_PATHS[name] || <circle cx="12" cy="12" r="10"/>}
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   ALLERGEN + DIETARY DATA
══════════════════════════════════════════════════════════════ */
const TOP9 = [
  { id:"milk",      label:"Milk",       icon:"🥛", color:"#D97B2A", bw:"#555" },
  { id:"eggs",      label:"Eggs",       icon:"🥚", color:"#C8952A", bw:"#444" },
  { id:"fish",      label:"Fish",       icon:"🐟", color:"#3A82A8", bw:"#555" },
  { id:"shellfish", label:"Shellfish",  icon:"🦐", color:"#C05A3A", bw:"#444" },
  { id:"tree_nuts", label:"Tree Nuts",  icon:"🌰", color:"#7A4F2A", bw:"#555" },
  { id:"peanuts",   label:"Peanuts",    icon:"🥜", color:"#A06030", bw:"#444" },
  { id:"wheat",     label:"Wheat",      icon:"🌾", color:"#A89040", bw:"#555" },
  { id:"soybeans",  label:"Soybeans",   icon:"🫘", color:"#5A8A50", bw:"#444" },
  { id:"sesame",    label:"Sesame",     icon:"⚫", color:"#5A5068", bw:"#555" },
];
const EXTENDED = [
  { id:"gluten_free", label:"Gluten-Free", icon:"🌿", color:"#3A8A5A", bw:"#444" },
  { id:"vegan",       label:"Vegan",       icon:"🌱", color:"#2E7A50", bw:"#333" },
  { id:"vegetarian",  label:"Vegetarian",  icon:"🥦", color:"#4A9060", bw:"#444" },
  { id:"paleo",       label:"Paleo",       icon:"🦴", color:"#8A4A20", bw:"#555" },
  { id:"keto",        label:"Keto",        icon:"⚡", color:"#7A2020", bw:"#444" },
  { id:"dairy_free",  label:"Dairy-Free",  icon:"🚫", color:"#607080", bw:"#555" },
  { id:"nut_free",    label:"Nut-Free",    icon:"🚷", color:"#805070", bw:"#444" },
  { id:"halal",       label:"Halal",       icon:"☪",  color:"#205A40", bw:"#333" },
  { id:"kosher",      label:"Kosher",      icon:"✡",  color:"#1A3060", bw:"#444" },
];
const ALL_LABELS = [...TOP9, ...EXTENDED];
const LMAP = Object.fromEntries(ALL_LABELS.map(l => [l.id, l]));

const ALLERGEN_DESCS = {
  milk:"Dairy products: butter, cream, cheese, yoghurt",
  eggs:"Eggs and egg-derived ingredients",
  fish:"All finfish: salmon, tuna, cod, halibut, etc.",
  shellfish:"Crustaceans: shrimp, crab, lobster, crayfish",
  tree_nuts:"Almonds, cashews, walnuts, pecans, and more",
  peanuts:"Peanuts and peanut-derived ingredients",
  wheat:"Wheat flour and wheat-based ingredients",
  soybeans:"Soy and soy-derived products",
  sesame:"Sesame seeds and sesame oil",
};
const DIETARY_DESCS = {
  gluten_free:"No gluten-based ingredients",
  vegan:"No animal products of any kind",
  vegetarian:"No meat or fish; may contain dairy or eggs",
  paleo:"Grain-free, legume-free, unprocessed",
  keto:"Very low carbohydrate content",
  dairy_free:"No milk or dairy-derived ingredients",
  nut_free:"Free from all tree nuts and peanuts",
  halal:"Prepared per Islamic dietary law",
  kosher:"Prepared per Jewish dietary law",
};

const CUISINES = ["All","American","Japanese","Mediterranean","Italian","Mexican","Indian","Thai","French","Greek","Chinese","Korean","Other"];
const AMBIENCES = ["Casual","Fine Dining","Family-Friendly","Romantic","Fast Casual","Outdoor","Bar / Pub","Cafe"];
const CUISINE_OPTIONS = CUISINES.filter(c => c !== "All");
const CADENCES = ["Daily","Weekly","Seasonal"];

/* ══════════════════════════════════════════════════════════════
   SEED DATA
══════════════════════════════════════════════════════════════ */
const SEED = [
  {
    id:1, name:"Harvest and Hearth", cuisine:"American", location:"Brooklyn, NY",
    safetyRating:4.7, staffRating:4.5, kitchenRating:4.8, reviewCount:142,
    description:"Farm-to-table comfort food with full allergen transparency and dedicated prep zones.",
    ambience:"Casual", isNew:false, extendedLabels:true, published:true,
    specialsEnabled:false, specialsCadence:"Daily", specials:[],
    brandLogo:null, brandFont:"", brandAccent:"",
    menu:[
      { id:"d1", name:"Buttermilk Pancakes",  desc:"House-made batter, Vermont maple syrup, whipped butter",   price:"14", allergens:["milk","eggs","wheat"],          dietary:["vegetarian"] },
      { id:"d2", name:"Avocado Toast",        desc:"Sourdough, smashed avo, poached egg, chilli flakes",        price:"12", allergens:["wheat","eggs","sesame"],         dietary:["vegetarian"] },
      { id:"d3", name:"Grilled Salmon",       desc:"Atlantic salmon, lemon herb butter, seasonal vegetables",   price:"28", allergens:["fish","milk"],                   dietary:["gluten_free","paleo"] },
      { id:"d4", name:"PB Banana Smoothie",   desc:"Natural peanut butter, banana, oat milk, local honey",      price:"9",  allergens:["peanuts","soybeans"],            dietary:["vegan","gluten_free"] },
    ],
  },
  {
    id:2, name:"Sakura Ramen", cuisine:"Japanese", location:"Manhattan, NY",
    safetyRating:4.9, staffRating:4.8, kitchenRating:4.9, reviewCount:289,
    description:"Authentic tonkotsu and shoyu ramen with dedicated allergy awareness.",
    ambience:"Casual", isNew:false, extendedLabels:true, published:true,
    specialsEnabled:true, specialsCadence:"Weekly", specials:[
      { id:"sp1", name:"Spicy Miso Ramen",  desc:"White miso, chilli paste, crispy tofu, corn — weekly special", price:"20", allergens:["soybeans","sesame"], dietary:["vegan"] },
      { id:"sp2", name:"Wagyu Gyoza",       desc:"Pan-fried wagyu dumplings, ponzu dipping sauce",                price:"18", allergens:["wheat","soybeans","eggs"], dietary:[] },
    ],
    brandLogo:null, brandFont:"", brandAccent:"",
    menu:[
      { id:"d5", name:"Tonkotsu Ramen",  desc:"Rich pork broth, handmade noodles, soft egg, chashu, nori", price:"18", allergens:["wheat","eggs","soybeans","sesame"], dietary:[] },
      { id:"d6", name:"Edamame",         desc:"Steamed salted soybeans, sea salt",                          price:"6",  allergens:["soybeans"],                          dietary:["vegan","gluten_free"] },
      { id:"d7", name:"Shrimp Tempura",  desc:"Crispy battered shrimp, ponzu sauce",                        price:"16", allergens:["shellfish","wheat","eggs","soybeans"],dietary:[] },
      { id:"d8", name:"Miso Soup",       desc:"White miso, silken tofu, wakame, scallion",                  price:"5",  allergens:["soybeans"],                          dietary:["vegan"] },
    ],
  },
  {
    id:3, name:"Terra Verde", cuisine:"Mediterranean", location:"Hoboken, NJ",
    safetyRating:4.3, staffRating:4.1, kitchenRating:4.4, reviewCount:97,
    description:"Vibrant mezze, wood-fired proteins, and always-fresh market salads.",
    ambience:"Fine Dining", isNew:true, extendedLabels:false, published:true,
    specialsEnabled:false, specialsCadence:"Seasonal", specials:[],
    brandLogo:null, brandFont:"", brandAccent:"",
    menu:[
      { id:"d9",  name:"Hummus Platter",  desc:"House hummus, warm pita, olives, roasted peppers",      price:"11", allergens:["sesame","wheat"],            dietary:["vegan"] },
      { id:"d10", name:"Grilled Octopus", desc:"Char-grilled, lemon herb oil, fresh herbs",             price:"24", allergens:["shellfish"],                 dietary:["gluten_free","paleo"] },
      { id:"d11", name:"Baklava",         desc:"Phyllo layers, wildflower honey, mixed tree nuts",      price:"8",  allergens:["tree_nuts","wheat","milk"],   dietary:["vegetarian"] },
      { id:"d12", name:"Falafel Wrap",    desc:"Crispy falafel, tahini, tomato, cucumber",              price:"13", allergens:["sesame","wheat"],            dietary:["vegan"] },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:${C.cream};color:${C.text};}
button,input,select,textarea{font-family:'DM Sans',sans-serif;}
input:focus,select:focus,textarea:focus{outline:2px solid ${C.orange};outline-offset:1px;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${C.warm200};border-radius:10px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:none;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
.fu{animation:fadeUp .45s ease both;}
.fu1{animation-delay:.08s;}.fu2{animation-delay:.16s;}.fu3{animation-delay:.24s;}
.lift{transition:transform .18s,box-shadow .18s;}
.lift:hover{transform:translateY(-3px);box-shadow:0 12px 36px ${C.shadowMd};}
`;

/* ══════════════════════════════════════════════════════════════
   SMALL HELPERS
══════════════════════════════════════════════════════════════ */
const Stars = ({ val, size=12, col=C.amber }) => (
  <span style={{ display:"inline-flex", gap:1 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24"
        fill={i<=Math.floor(val)||(i===Math.ceil(val)&&val%1>=0.5)?col:"none"}
        stroke={i<=Math.floor(val)||(i===Math.ceil(val)&&val%1>=0.5)?col:C.warm200}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ))}
  </span>
);

const Divider = ({ gap=20 }) => (
  <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.warm200},transparent)`, margin:`${gap}px 0` }}/>
);

// White-bg black-outline allergen icon pill
const AllergenIcon = ({ id, showLabel=false }) => {
  const l = LMAP[id]; if (!l) return null;
  return (
    <span title={l.label} style={{
      display:"inline-flex", alignItems:"center", gap:4,
      background:"#fff", border:"1.5px solid #222", borderRadius:6,
      padding: showLabel ? "2px 8px" : "3px 5px",
      fontSize: showLabel ? 11 : 16, fontWeight:700,
      whiteSpace:"nowrap", cursor:"default", boxShadow:"0 1px 2px rgba(0,0,0,.07)"
    }}>
      <span style={{ fontSize:16, lineHeight:1 }}>{l.icon}</span>
      {showLabel && <span style={{ fontSize:11, color:"#222" }}>{l.label}</span>}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════
   PRINT HELPERS  (pure functions, no JSX)
══════════════════════════════════════════════════════════════ */
function buildPrintHTML(restaurant) {
  const accent = restaurant.brandAccent || "#E07B39";
  const headFont = restaurant.brandFont || "'Cormorant Garamond', serif";
  const bodyFont = restaurant.brandFont || "'DM Sans', sans-serif";
  const logoHtml = restaurant.brandLogo
    ? `<img src="${restaurant.brandLogo}" style="max-height:70px;max-width:200px;object-fit:contain;margin-bottom:8px;" alt="logo"/>`
    : "";

  const renderDishTags = (allergens, dietary) => {
    const safe = allergens.length === 0
      ? `<span style="display:inline-flex;align-items:center;background:#fff;border:1.5px solid #222;border-radius:6px;padding:2px 9px;font-size:11px;font-weight:700;color:#222;">No Major Allergens</span>`
      : allergens.map(id => {
          const l = LMAP[id];
          return l ? `<span title="${l.label}" style="display:inline-flex;align-items:center;justify-content:center;background:#fff;border:1.5px solid #222;border-radius:6px;width:28px;height:26px;font-size:16px;">${l.icon}</span>` : "";
        }).join("");
    const diet = (dietary || []).map(id => {
      const l = LMAP[id];
      return l ? `<span title="${l.label}" style="display:inline-flex;align-items:center;justify-content:center;background:#fff;border:1.5px solid #222;border-radius:6px;padding:2px 7px;font-size:11px;font-weight:700;color:#222;">${l.icon}</span>` : "";
    }).join("");
    return safe + diet;
  };

  const renderDish = (d, isSpecial) => {
    const border = isSpecial ? "1.5px solid #F0D060" : "1px solid #F2EBE0";
    const bg = isSpecial ? "#FFFBEE" : "transparent";
    const nameColor = isSpecial ? "#7A5000" : "#1E1410";
    const priceColor = isSpecial ? "#B87A00" : accent;
    const badge = isSpecial ? `<span style="font-size:9px;font-weight:700;color:#E8A020;background:#FFF3CC;border:1px solid #F0D060;border-radius:99px;padding:1px 6px;margin-left:6px;text-transform:uppercase;letter-spacing:.4px;">Special</span>` : "";
    return `<div style="display:flex;justify-content:space-between;gap:14px;padding:13px ${isSpecial ? "12px" : "0"};border-bottom:${border};border-radius:${isSpecial?"7px":"0"};background:${bg};margin-bottom:${isSpecial?"7px":"0"};">
      <div style="flex:1;">
        <div style="font-weight:700;font-size:15px;margin-bottom:3px;color:${nameColor};">${d.name}${badge}</div>
        <div style="font-size:12px;color:#9A7B5C;margin-bottom:8px;line-height:1.5;">${d.desc || ""}</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">${renderDishTags(d.allergens, d.dietary)}</div>
      </div>
      <div style="font-weight:800;font-size:16px;color:${priceColor};white-space:nowrap;">$${d.price}</div>
    </div>`;
  };

  const specialsSection = (restaurant.specialsEnabled && restaurant.specials && restaurant.specials.length > 0)
    ? `<div style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#E8A020,#B87A00);border-radius:7px;padding:5px 13px;margin-bottom:12px;">
        <span style="font-size:13px;font-weight:700;color:#fff;font-family:${headFont};">Chef's ${restaurant.specialsCadence} Specials</span>
      </div>
      ${restaurant.specials.map(d => renderDish(d, true)).join("")}
      <hr style="border:none;border-top:1.5px dashed #E8C040;margin:18px 0 20px;"/>`
    : "";

  const top9Legend = TOP9.map(a =>
    `<div style="display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid #222;border-radius:10px;padding:10px 12px;">
      <span style="font-size:22px;width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;background:#fff;border:1.5px solid #222;border-radius:7px;">${a.icon}</span>
      <div><div style="font-weight:700;font-size:13px;color:#1E1410;">${a.label}</div>
      <div style="font-size:10px;color:#9A7B5C;margin-top:2px;line-height:1.4;">${ALLERGEN_DESCS[a.id] || ""}</div></div>
    </div>`
  ).join("");

  const usedDietary = [...new Set((restaurant.menu || []).concat(restaurant.specials || []).flatMap(d => d.dietary || []))];
  const extLegend = (restaurant.extendedLabels && usedDietary.length > 0)
    ? `<div style="font-family:${headFont};font-size:17px;color:${accent};margin:20px 0 12px;font-weight:700;">Dietary and Lifestyle Labels</div>
       <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
         ${EXTENDED.filter(a => usedDietary.includes(a.id)).map(a =>
           `<div style="display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid #222;border-radius:10px;padding:10px 12px;">
             <span style="font-size:18px;width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;background:#fff;border:1.5px solid #222;border-radius:7px;">${a.icon}</span>
             <div><div style="font-weight:700;font-size:12px;color:#1E1410;">${a.label}</div>
             <div style="font-size:10px;color:#9A7B5C;margin-top:2px;line-height:1.4;">${DIETARY_DESCS[a.id] || ""}</div></div>
           </div>`
         ).join("")}
       </div>`
    : "";

  return `<!DOCTYPE html><html><head><title>${restaurant.name} - Allergen Menu</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;600;700&display=swap" rel="stylesheet"/>
  <style>
    body{font-family:${bodyFont};padding:48px 52px;color:#2D1F0F;max-width:800px;margin:0 auto;background:#fff;}
    h1{font-family:${headFont};font-size:36px;color:${accent};margin:8px 0 4px;}
    .meta{font-size:13px;color:#9A7B5C;margin-bottom:16px;}
    .rule{border:none;border-top:2px solid ${accent};margin:16px 0 24px;}
    .footer{margin-top:32px;text-align:center;font-size:11px;color:#C4A882;padding-top:14px;border-top:1px solid #F2EBE0;}
    .legend-page{page-break-before:always;padding-top:8px;}
    .legend-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
  </style></head><body>
  <div>${logoHtml}<h1>${restaurant.name}</h1>
  <div class="meta">${restaurant.cuisine} - ${restaurant.location} - Allergen-Labeled Menu</div></div>
  <hr class="rule"/>
  ${specialsSection}
  ${restaurant.menu.map(d => renderDish(d, false)).join("")}
  <div class="footer">See reverse for full allergen legend - Always inform your server of allergies - Restaurant Legend</div>

  <div class="legend-page">
  ${logoHtml ? `<img src="${restaurant.brandLogo}" style="max-height:40px;max-width:120px;object-fit:contain;margin-bottom:8px;" alt="logo"/>` : ""}
  <h1 style="font-size:28px;">${restaurant.name} - Allergen Icon Legend</h1>
  <div class="meta">Refer to this legend when reading your menu.</div>
  <hr class="rule"/>
  <div style="font-family:${headFont};font-size:17px;color:${accent};margin-bottom:12px;font-weight:700;">Top 9 FDA-Recognized Allergens</div>
  <div class="legend-grid">${top9Legend}</div>
  ${extLegend}
  <div style="margin-top:28px;background:#FFFDF9;border-radius:10px;padding:13px 16px;border:1.5px solid #222;font-size:11px;color:#9A7B5C;line-height:1.7;">
    <strong style="color:#1E1410;">Important:</strong> While we take every precaution to accurately label allergens, cross-contamination is always possible. If you have a severe allergy, please speak directly with your server before ordering.
  </div>
  <div class="footer">Restaurant Legend - restaurant-legend.app - Always inform your server of allergies before ordering.</div>
  </div>
  <script>window.onload=function(){window.print();};<\/script>
  </body></html>`;
}

/* ══════════════════════════════════════════════════════════════
   PRINT MENU MODAL
══════════════════════════════════════════════════════════════ */
const PrintMenuModal = ({ restaurant, onClose }) => {
  const accent = restaurant.brandAccent || C.orange;

  const doPrint = () => {
    const html = buildPrintHTML(restaurant);
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  const usedDietary = [...new Set((restaurant.menu || []).flatMap(d => d.dietary || []))];

  const DishRow = ({ d, isSpecial }) => (
    <div style={{
      display:"flex", justifyContent:"space-between", gap:12,
      padding: isSpecial ? "10px 12px" : "11px 0",
      borderBottom: isSpecial ? "none" : `1px solid ${C.parchment}`,
      background: isSpecial ? C.goldLt : "transparent",
      border: isSpecial ? `1.5px solid ${C.goldBorder}` : undefined,
      borderRadius: isSpecial ? 8 : 0,
      marginBottom: isSpecial ? 7 : 0,
    }}>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:700, fontSize:14, color: isSpecial ? C.goldDk : "#1E1410", marginBottom:3, display:"flex", alignItems:"center", gap:6 }}>
          {d.name}
          {isSpecial && (
            <span style={{ fontSize:9, fontWeight:700, color:C.gold, background:"#FFF3CC", border:`1px solid ${C.goldBorder}`, borderRadius:99, padding:"1px 6px", textTransform:"uppercase", letterSpacing:.4 }}>Special</span>
          )}
        </div>
        <div style={{ fontSize:11, color:C.muted, marginBottom:7, lineHeight:1.5 }}>{d.desc}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, alignItems:"center" }}>
          {d.allergens.length === 0
            ? <span style={{ background:"#fff", border:"1.5px solid #222", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, color:"#222" }}>No Major Allergens</span>
            : d.allergens.map(id => <AllergenIcon key={id} id={id} />)
          }
          {(d.dietary || []).map(id => <AllergenIcon key={id} id={id} />)}
        </div>
      </div>
      <div style={{ fontWeight:800, color: isSpecial ? C.goldDk : accent, fontSize:14, whiteSpace:"nowrap" }}>${d.price}</div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(30,20,16,.7)", zIndex:2000, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:24, overflowY:"auto", backdropFilter:"blur(6px)" }}>
      <div style={{ background:C.white, borderRadius:20, maxWidth:760, width:"100%", marginTop:24, overflow:"hidden", boxShadow:`0 40px 100px rgba(30,20,16,.35)` }} className="fu">
        {/* Header */}
        <div style={{ background:`linear-gradient(130deg,${C.brown},${C.brownMid})`, padding:"18px 26px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:C.amber, textTransform:"uppercase", marginBottom:3 }}>Print Preview</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:"#fff" }}>{restaurant.name}</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={doPrint} style={{ display:"inline-flex", alignItems:"center", gap:7, background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"9px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              <Icon name="printer" size={14} color="#fff"/> Print / Save PDF
            </button>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", borderRadius:50, width:34, height:34, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <Icon name="close" size={16} color="#fff"/>
            </button>
          </div>
        </div>

        <div style={{ padding:26 }}>
          {/* Page 1 label */}
          <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Page 1 — Menu</div>
          <div style={{ border:`1px solid ${C.warm100}`, borderRadius:12, padding:28, background:"#fff", marginBottom:20 }}>
            {restaurant.brandLogo && <img src={restaurant.brandLogo} alt="logo" style={{ maxHeight:60, maxWidth:180, objectFit:"contain", marginBottom:10, display:"block" }}/>}
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:accent, marginBottom:4 }}>{restaurant.name}</h1>
            <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>{restaurant.cuisine} - {restaurant.location} - Allergen-Labeled Menu</div>
            <hr style={{ border:"none", borderTop:`2px solid ${accent}`, marginBottom:18 }}/>

            {/* Specials */}
            {restaurant.specialsEnabled && restaurant.specials && restaurant.specials.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`linear-gradient(135deg,${C.gold},${C.goldDk})`, borderRadius:7, padding:"5px 12px", marginBottom:10 }}>
                  <Icon name="sparkle" size={12} color="#fff"/>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontWeight:700, color:"#fff" }}>{"Chef's " + restaurant.specialsCadence + " Specials"}</span>
                </div>
                {restaurant.specials.map(d => <DishRow key={d.id} d={d} isSpecial={true} />)}
                <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.goldBorder},transparent)`, margin:"14px 0" }}/>
              </div>
            )}

            {/* Main menu */}
            {restaurant.menu.map(d => <DishRow key={d.id} d={d} isSpecial={false} />)}
            <div style={{ marginTop:18, fontSize:11, color:C.muted, textAlign:"center", fontStyle:"italic" }}>See reverse for full allergen icon legend</div>
          </div>

          {/* Page 2 label */}
          <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Page 2 — Icon Legend</div>
          <div style={{ border:`1px solid ${C.warm100}`, borderRadius:12, padding:28, background:"#fff" }}>
            {restaurant.brandLogo && <img src={restaurant.brandLogo} alt="logo" style={{ maxHeight:40, maxWidth:130, objectFit:"contain", marginBottom:8, display:"block" }}/>}
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:accent, marginBottom:4 }}>{restaurant.name} — Allergen Icon Legend</h2>
            <div style={{ fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>Refer to this legend when reading your menu.</div>
            <hr style={{ border:"none", borderTop:`2px solid ${accent}`, marginBottom:18 }}/>

            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:accent, marginBottom:10, fontWeight:700 }}>Top 9 FDA-Recognized Allergens</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9, marginBottom:20 }}>
              {TOP9.map(a => (
                <div key={a.id} style={{ display:"flex", alignItems:"center", gap:9, background:"#fff", border:"1.5px solid #222", borderRadius:9, padding:"9px 11px", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
                  <span style={{ fontSize:20, lineHeight:1, flexShrink:0, width:32, height:32, display:"inline-flex", alignItems:"center", justifyContent:"center", background:"#fff", border:"1.5px solid #222", borderRadius:7 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:11, color:"#1E1410" }}>{a.label}</div>
                    <div style={{ fontSize:9, color:C.muted, lineHeight:1.4, marginTop:1 }}>{ALLERGEN_DESCS[a.id]}</div>
                  </div>
                </div>
              ))}
            </div>

            {restaurant.extendedLabels && usedDietary.length > 0 && (
              <>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:accent, marginBottom:10, fontWeight:700 }}>Dietary and Lifestyle Labels</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9, marginBottom:18 }}>
                  {EXTENDED.filter(a => usedDietary.includes(a.id)).map(a => (
                    <div key={a.id} style={{ display:"flex", alignItems:"center", gap:9, background:"#fff", border:"1.5px solid #222", borderRadius:9, padding:"9px 11px", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
                      <span style={{ fontSize:18, lineHeight:1, flexShrink:0, width:30, height:30, display:"inline-flex", alignItems:"center", justifyContent:"center", background:"#fff", border:"1.5px solid #222", borderRadius:7 }}>{a.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:11, color:"#1E1410" }}>{a.label}</div>
                        <div style={{ fontSize:9, color:C.muted, lineHeight:1.4, marginTop:1 }}>{DIETARY_DESCS[a.id]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ background:"#FFF8F0", borderRadius:9, padding:"11px 14px", border:`1px solid ${C.warm100}`, fontSize:11, color:C.muted, lineHeight:1.7 }}>
              <strong style={{ color:"#1E1410" }}>Important:</strong> Cross-contamination is always possible. If you have a severe allergy, please speak directly with your server before ordering.
            </div>
            <div style={{ marginTop:16, textAlign:"center", fontSize:10, color:C.muted }}>Restaurant Legend - restaurant-legend.app</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SUGGEST A RESTAURANT MODAL
══════════════════════════════════════════════════════════════ */
const SuggestModal = ({ onClose }) => {
  const [form, setForm] = useState({ name:"", location:"", website:"", why:"", email:"" });
  const [sent, setSent] = useState(false);
  const upd = (f, v) => setForm(p => ({ ...p, [f]:v }));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(30,20,16,.65)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24, backdropFilter:"blur(6px)" }}>
      <div style={{ background:C.white, borderRadius:22, maxWidth:500, width:"100%", overflow:"hidden", boxShadow:`0 40px 100px rgba(30,20,16,.3)` }} className="fu">
        <div style={{ background:`linear-gradient(130deg,${C.orange},${C.orangeDk})`, padding:"20px 26px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"rgba(255,255,255,.75)", textTransform:"uppercase", marginBottom:5 }}>Diner Request</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:"#fff", lineHeight:1.1 }}>Suggest a Restaurant</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,.75)", marginTop:4 }}>Know a great allergy-safe spot? Tell us about it.</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:50, width:32, height:32, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Icon name="close" size={15} color="#fff"/>
          </button>
        </div>
        <div style={{ padding:"24px 26px" }}>
          {!sent ? (
            <>
              {[["Restaurant Name","name","text","e.g. The Pollen Cafe",true],["City / Location","location","text","e.g. Chicago, IL",true],["Website (optional)","website","url","https://",false],["Your email (optional)","email","email","you@example.com",false]].map(([label,field,type,ph,req]) => (
                <div key={field} style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.brownMid, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:.8 }}>
                    {label}{req && <span style={{ color:C.orange }}> *</span>}
                  </label>
                  <input type={type} value={form[field]} onChange={e => upd(field, e.target.value)} placeholder={ph}
                    style={{ width:"100%", border:`1.5px solid ${C.warm100}`, borderRadius:9, padding:"9px 13px", fontSize:14, background:C.cream }}/>
                </div>
              ))}
              <div style={{ marginBottom:18 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.brownMid, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:.8 }}>Why should we add them?</label>
                <textarea value={form.why} onChange={e => upd("why", e.target.value)} rows={3} placeholder="Tell us about their allergy awareness..."
                  style={{ width:"100%", border:`1.5px solid ${C.warm100}`, borderRadius:9, padding:"9px 13px", fontSize:14, background:C.cream, resize:"vertical", lineHeight:1.55 }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                <button onClick={onClose} style={{ background:"none", border:`1.5px solid ${C.warm200}`, borderRadius:10, padding:"9px 20px", fontWeight:600, fontSize:14, cursor:"pointer", color:C.muted }}>Cancel</button>
                <button onClick={() => { if (form.name && form.location) setSent(true); }}
                  style={{ display:"inline-flex", alignItems:"center", gap:7, background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"9px 22px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                  <Icon name="send" size={14} color="#fff"/> Send Request
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"16px 0 8px" }}>
              <div style={{ width:52, height:52, background:C.greenLt, borderRadius:50, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                <Icon name="check" size={24} color={C.green} sw={2.5}/>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:C.orange, marginBottom:8 }}>Request Sent!</div>
              <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, marginBottom:20 }}>
                Thank you for suggesting <strong style={{ color:C.text }}>{form.name}</strong>! We will reach out to them and let you know when they join.
              </p>
              <button onClick={onClose} style={{ background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"10px 28px", fontWeight:700, fontSize:14, cursor:"pointer" }}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   DINER PREFERENCES MODAL
══════════════════════════════════════════════════════════════ */
const PrefsModal = ({ prefs, onChange, onClose }) => {
  const [local, setLocal] = useState(prefs);
  const tog = (key, val) => setLocal(p => {
    const arr = p[key] || [];
    return { ...p, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
  });
  const setVal = (key, val) => setLocal(p => ({ ...p, [key]:val }));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(30,20,16,.65)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24, backdropFilter:"blur(6px)", overflowY:"auto" }}>
      <div style={{ background:C.white, borderRadius:22, maxWidth:560, width:"100%", overflow:"hidden", boxShadow:`0 40px 100px rgba(30,20,16,.3)`, margin:"auto" }} className="fu">
        <div style={{ background:`linear-gradient(130deg,${C.brown},${C.brownMid})`, padding:"20px 26px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:C.amber, textTransform:"uppercase", marginBottom:4 }}>Account Settings</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:"#fff" }}>My Dining Preferences</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:50, width:32, height:32, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Icon name="close" size={15} color="#fff"/>
          </button>
        </div>
        <div style={{ padding:"22px 26px", maxHeight:"70vh", overflowY:"auto" }}>
          {/* Name */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C.brownMid, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:.8 }}>Your Name</label>
            <input value={local.name || ""} onChange={e => setVal("name", e.target.value)} placeholder="e.g. Alex"
              style={{ border:`1.5px solid ${C.warm100}`, borderRadius:9, padding:"9px 13px", fontSize:14, background:C.cream, width:"100%" }}/>
          </div>

          {/* Cuisines */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C.brownMid, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:.8 }}>Favourite Cuisines</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {CUISINE_OPTIONS.map(c => (
                <button key={c} onClick={() => tog("cuisines", c)}
                  style={{ borderRadius:99, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s", border:`1.5px solid ${(local.cuisines||[]).includes(c)?C.orange:C.warm200}`, background:(local.cuisines||[]).includes(c)?C.orange:C.parchment, color:(local.cuisines||[]).includes(c)?"#fff":C.muted }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C.brownMid, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:.8 }}>My Location</label>
            <input value={local.location || ""} onChange={e => setVal("location", e.target.value)} placeholder="e.g. Brooklyn, NY"
              style={{ border:`1.5px solid ${C.warm100}`, borderRadius:9, padding:"9px 13px", fontSize:14, background:C.cream, width:"100%" }}/>
          </div>

          {/* Min safety */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C.brownMid, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:.8 }}>
              Minimum Safety Rating — {local.minRating > 0 ? (local.minRating + "+") : "Any"}
            </label>
            <input type="range" min={0} max={5} step={0.5} value={local.minRating || 0} onChange={e => setVal("minRating", +e.target.value)}
              style={{ width:"100%", accentColor:C.orange }}/>
          </div>

          {/* Ambience */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C.brownMid, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:.8 }}>Preferred Ambience</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {AMBIENCES.map(a => (
                <button key={a} onClick={() => tog("ambience", a)}
                  style={{ borderRadius:99, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s", border:`1.5px solid ${(local.ambience||[]).includes(a)?C.brownMid:C.warm200}`, background:(local.ambience||[]).includes(a)?C.brownMid:C.parchment, color:(local.ambience||[]).includes(a)?"#fff":C.muted }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* New to platform */}
          <div style={{ marginBottom:8 }}>
            <label style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
              <div onClick={() => setVal("showNew", !local.showNew)}
                style={{ width:44, height:24, borderRadius:99, background:local.showNew?C.orange:C.warm200, transition:"background .2s", position:"relative", flexShrink:0, cursor:"pointer" }}>
                <div style={{ position:"absolute", top:3, left:local.showNew?22:3, width:18, height:18, borderRadius:50, background:"#fff", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.2)" }}/>
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:14, color:C.text }}>Highlight "New to Restaurant Legend"</div>
                <div style={{ fontSize:12, color:C.muted }}>Prioritise newly joined restaurants in suggestions</div>
              </div>
            </label>
          </div>
        </div>
        <div style={{ padding:"14px 26px", borderTop:`1px solid ${C.warm100}`, display:"flex", justifyContent:"flex-end", gap:10 }}>
          <button onClick={onClose} style={{ background:"none", border:`1.5px solid ${C.warm200}`, borderRadius:10, padding:"9px 20px", fontWeight:600, fontSize:14, cursor:"pointer", color:C.muted }}>Cancel</button>
          <button onClick={() => { onChange(local); onClose(); }}
            style={{ display:"inline-flex", alignItems:"center", gap:7, background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"9px 24px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            <Icon name="check" size={14} color="#fff" sw={2.5}/> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   RESTAURANT DETAIL MODAL (DINER SIDE)
══════════════════════════════════════════════════════════════ */
const RestaurantDetailModal = ({ restaurant, onClose, onRate }) => {
  const [filterIds, setFilterIds] = useState([]);
  const [rating, setRating] = useState({ safety:0, staff:0, kitchen:0 });
  const [hov, setHov] = useState({ safety:0, staff:0, kitchen:0 });
  const [submitted, setSubmitted] = useState(false);
  const [showPrint, setShowPrint] = useState(false);

  const filteredMenu = filterIds.length === 0
    ? restaurant.menu
    : restaurant.menu.filter(d => filterIds.every(id => !d.allergens.includes(id)));

  const filteredSpecials = (!restaurant.specialsEnabled || !restaurant.specials) ? [] :
    filterIds.length === 0 ? restaurant.specials
    : restaurant.specials.filter(d => filterIds.every(id => !d.allergens.includes(id)));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(30,20,16,.6)", zIndex:1500, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:20, overflowY:"auto", backdropFilter:"blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      {showPrint && <PrintMenuModal restaurant={restaurant} onClose={() => setShowPrint(false)}/>}
      <div style={{ background:C.white, borderRadius:22, maxWidth:680, width:"100%", marginTop:20, overflow:"hidden", boxShadow:`0 40px 100px rgba(30,20,16,.3)` }} className="fu">
        {/* Header */}
        <div style={{ background:`linear-gradient(140deg,${C.orangeDk},${C.orange},${C.amber})`, padding:"28px 30px", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,.2)", border:"none", borderRadius:50, width:34, height:34, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Icon name="close" size={16} color="#fff"/>
          </button>
          {restaurant.isNew && (
            <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(255,255,255,.25)", borderRadius:99, padding:"3px 12px", fontSize:11, fontWeight:700, color:"#fff", marginBottom:10 }}>
              <Icon name="sparkle" size={11} color="#fff"/> New to Restaurant Legend
            </span>
          )}
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"rgba(255,255,255,.8)", marginBottom:6, textTransform:"uppercase" }}>{restaurant.cuisine} - {restaurant.ambience || "Casual"}</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:"#fff", marginBottom:6, lineHeight:1.05 }}>{restaurant.name}</h2>
          <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13, color:"rgba(255,255,255,.8)", marginBottom:18 }}>
            <Icon name="location" size={13} color="rgba(255,255,255,.8)"/> {restaurant.location}
          </div>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
            {[["shield","Safety",restaurant.safetyRating],["user","Staff",restaurant.staffRating],["bolt","Kitchen",restaurant.kitchenRating]].map(([ico,lbl,val]) => (
              <div key={lbl}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.7)", marginBottom:3 }}>{lbl}</div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Stars val={val} size={12} col="#fff"/>
                  <span style={{ fontWeight:800, fontSize:14, color:"#fff" }}>{val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding:"22px 30px" }}>
          <p style={{ color:C.muted, lineHeight:1.7, marginBottom:20, fontSize:14 }}>{restaurant.description}</p>

          {/* Allergen filter */}
          <div style={{ background:C.parchment, borderRadius:13, padding:"13px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.brownMid, marginBottom:8, textTransform:"uppercase", letterSpacing:.8 }}>Filter out my allergens</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {TOP9.map(a => {
                const on = filterIds.includes(a.id);
                return (
                  <button key={a.id} onClick={() => setFilterIds(f => on ? f.filter(x => x !== a.id) : [...f, a.id])}
                    style={{ display:"inline-flex", alignItems:"center", gap:5, borderRadius:99, padding:"4px 11px", fontSize:11, fontWeight:600, cursor:"pointer", transition:"all .15s", background:"#fff", border:`1.5px solid ${on?"#222":C.warm200}`, color:"#222", boxShadow: on ? "inset 0 1px 3px rgba(0,0,0,.15)" : "none" }}>
                    <span style={{ fontSize:14 }}>{a.icon}</span>{a.label}{on && <Icon name="close" size={9} color="#222" sw={2.5}/>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specials */}
          {restaurant.specialsEnabled && filteredSpecials.length > 0 && (
            <div style={{ marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <div style={{ background:`linear-gradient(135deg,${C.gold},${C.goldDk})`, borderRadius:8, padding:"4px 12px", display:"inline-flex", alignItems:"center", gap:5 }}>
                  <Icon name="sparkle" size={12} color="#fff"/>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontWeight:700, color:"#fff" }}>{"Chef's " + restaurant.specialsCadence + " Specials"}</span>
                </div>
                <span style={{ fontSize:11, color:C.goldDk, fontWeight:600 }}>{filteredSpecials.length} item{filteredSpecials.length !== 1 ? "s" : ""}</span>
              </div>
              {filteredSpecials.map(d => (
                <div key={d.id} style={{ background:C.goldLt, borderRadius:11, border:`1.5px solid ${C.goldBorder}`, padding:"13px 16px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:8, boxShadow:`0 2px 10px rgba(200,140,0,.08)` }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                      <span style={{ fontWeight:700, fontSize:14, color:C.goldDk }}>{d.name}</span>
                      <span style={{ fontSize:9, fontWeight:700, color:C.gold, background:"#FFF3CC", border:`1px solid ${C.goldBorder}`, borderRadius:99, padding:"1px 6px", textTransform:"uppercase", letterSpacing:.4 }}>Special</span>
                    </div>
                    <div style={{ fontSize:12, color:C.muted, marginBottom:8, lineHeight:1.5 }}>{d.desc}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {d.allergens.length === 0
                        ? <span style={{ background:"#fff", border:"1.5px solid #222", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, color:"#222" }}>No Major Allergens</span>
                        : d.allergens.map(id => <AllergenIcon key={id} id={id} />)
                      }
                      {(d.dietary || []).map(id => <AllergenIcon key={id} id={id} />)}
                    </div>
                  </div>
                  <div style={{ fontWeight:800, color:C.goldDk, fontSize:15, whiteSpace:"nowrap" }}>${d.price}</div>
                </div>
              ))}
              <Divider gap={14}/>
            </div>
          )}

          {/* Menu header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.orange }}>Menu</div>
            <button onClick={() => setShowPrint(true)}
              style={{ display:"inline-flex", alignItems:"center", gap:6, background:C.parchment, border:`1.5px solid ${C.warm200}`, borderRadius:9, padding:"7px 14px", fontWeight:600, fontSize:12, cursor:"pointer", color:C.brownMid }}>
              <Icon name="printer" size={12} color={C.brownMid}/> Print Menu
            </button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:24 }}>
            {filteredMenu.length === 0 && (
              <div style={{ textAlign:"center", padding:"24px", color:C.muted, background:C.parchment, borderRadius:11, fontSize:14 }}>No dishes remain after your allergen filters.</div>
            )}
            {filteredMenu.map(d => (
              <div key={d.id} style={{ background:C.cream, borderRadius:11, border:`1px solid ${C.warm100}`, padding:"13px 16px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.charcoal, marginBottom:3 }}>{d.name}</div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:8, lineHeight:1.5 }}>{d.desc}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {d.allergens.length === 0
                      ? <span style={{ fontSize:11, fontWeight:700, color:C.green, background:C.greenLt, padding:"2px 9px", borderRadius:6 }}>No Major Allergens</span>
                      : d.allergens.map(id => <AllergenIcon key={id} id={id} />)
                    }
                    {(d.dietary || []).map(id => <AllergenIcon key={id} id={id} />)}
                  </div>
                </div>
                <div style={{ fontWeight:800, color:C.orange, fontSize:14, whiteSpace:"nowrap" }}>${d.price}</div>
              </div>
            ))}
          </div>

          <Divider/>

          {/* Rating */}
          {!submitted ? (
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.orange, marginBottom:14 }}>Rate Your Experience</div>
              {[["safety","shield","Overall Safety"],["staff","user","Knowledgeable Staff"],["kitchen","bolt","Kitchen Precautions"]].map(([key,ico,lbl]) => (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:11 }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, width:180, fontSize:13, color:C.text }}>
                    <Icon name={ico} size={13} color={C.muted}/>{lbl}
                  </span>
                  <div style={{ display:"flex", gap:3 }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s}
                        onMouseEnter={() => setHov(h => ({ ...h, [key]:s }))}
                        onMouseLeave={() => setHov(h => ({ ...h, [key]:0 }))}
                        onClick={() => setRating(r => ({ ...r, [key]:s }))}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:"2px", display:"inline-flex" }}>
                        <svg width={22} height={22} viewBox="0 0 24 24"
                          fill={s <= (hov[key] || rating[key]) ? C.amber : "none"}
                          stroke={s <= (hov[key] || rating[key]) ? C.amber : C.warm200}
                          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                  {rating[key] > 0 && <span style={{ fontSize:12, color:C.muted }}>{["","Poor","Fair","Good","Great","Excellent"][rating[key]]}</span>}
                </div>
              ))}
              <button onClick={() => { if (rating.safety && rating.staff && rating.kitchen) { onRate(restaurant.id, rating); setSubmitted(true); } }}
                style={{ marginTop:8, display:"inline-flex", alignItems:"center", gap:7, background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"10px 24px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                <Icon name="send" size={14} color="#fff"/> Submit Rating
              </button>
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"18px", background:C.greenLt, borderRadius:13, border:`1.5px solid ${C.green}` }}>
              <Icon name="check" size={26} color={C.green} sw={2.5}/>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.green, marginTop:8, marginBottom:4 }}>Thank you!</div>
              <div style={{ fontSize:13, color:C.muted }}>Your rating helps allergy-sensitive diners stay safe.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   RESTAURANT CARD  (diner side)
══════════════════════════════════════════════════════════════ */
const RestaurantCard = ({ r, onClick }) => {
  const allergens = [...new Set(r.menu.flatMap(d => d.allergens))];
  const dietary   = [...new Set(r.menu.flatMap(d => d.dietary || []))];

  return (
    <div onClick={onClick} className="lift" style={{ background:C.white, borderRadius:18, overflow:"hidden", cursor:"pointer", border:`1px solid ${C.warm100}`, boxShadow:`0 3px 16px ${C.shadow}` }}>
      <div style={{ background:`linear-gradient(135deg,${C.orangeDk},${C.orange})`, padding:"18px 20px 14px", position:"relative" }}>
        {r.isNew && (
          <span style={{ position:"absolute", top:10, right:10, display:"inline-flex", alignItems:"center", gap:4, background:"rgba(255,255,255,.22)", borderRadius:99, padding:"3px 9px", fontSize:10, fontWeight:700, color:"#fff" }}>
            <Icon name="sparkle" size={10} color="#fff"/> New
          </span>
        )}
        {r.specialsEnabled && r.specials && r.specials.length > 0 && (
          <span style={{ position:"absolute", bottom:10, right:10, display:"inline-flex", alignItems:"center", gap:4, background:`rgba(232,160,32,.9)`, borderRadius:99, padding:"3px 9px", fontSize:10, fontWeight:700, color:"#fff" }}>
            <Icon name="sparkle" size={10} color="#fff"/> {r.specialsCadence} Specials
          </span>
        )}
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"rgba(255,255,255,.75)", textTransform:"uppercase", marginBottom:5 }}>{r.cuisine}</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:"#fff", lineHeight:1.1, marginBottom:4 }}>{r.name}</div>
        <div style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12, color:"rgba(255,255,255,.8)" }}>
          <Icon name="location" size={12} color="rgba(255,255,255,.8)"/> {r.location}
        </div>
      </div>
      <div style={{ padding:"13px 20px 16px" }}>
        <div style={{ display:"flex", gap:14, marginBottom:10, flexWrap:"wrap" }}>
          {[["shield",r.safetyRating],["user",r.staffRating],["bolt",r.kitchenRating]].map(([ico,v],i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <Icon name={ico} size={11} color={C.muted}/>
              <Stars val={v} size={11}/> <span style={{ fontSize:11, fontWeight:700, color:C.text }}>{v}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize:12, color:C.muted, marginBottom:10, lineHeight:1.5 }}>{r.description}</p>
        {allergens.length > 0 && (
          <div style={{ marginBottom:7 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.brownMid, marginBottom:5, textTransform:"uppercase", letterSpacing:.8 }}>Contains</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              {allergens.slice(0,5).map(id => <AllergenIcon key={id} id={id} />)}
              {allergens.length > 5 && <span style={{ fontSize:11, color:C.muted, padding:"2px 6px" }}>+{allergens.length-5}</span>}
            </div>
          </div>
        )}
        {r.extendedLabels && dietary.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:7 }}>
            {dietary.map(id => <AllergenIcon key={id} id={id} />)}
          </div>
        )}
        <div style={{ fontSize:11, color:C.muted }}>{r.reviewCount} reviews</div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   DINER VIEW
══════════════════════════════════════════════════════════════ */
const DinerView = ({ restaurants, onRate }) => {
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState("");
  const [cuisine, setCuisine]     = useState("All");
  const [minSafety, setMinSafety] = useState(0);
  const [excludeIds, setExclude]  = useState([]);
  const [sortBy, setSortBy]       = useState("safety");
  const [showSuggest, setShowSuggest] = useState(false);
  const [showPrefs, setShowPrefs]     = useState(false);
  const [activeTab, setActiveTab]     = useState("discover");
  const [prefs, setPrefs] = useState({ name:"", cuisines:[], location:"", minRating:0, ambience:[], showNew:false });

  const filtered = restaurants
    .filter(r => {
      const q = search.toLowerCase();
      return (r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q))
        && (cuisine === "All" || r.cuisine === cuisine)
        && r.safetyRating >= minSafety
        && (excludeIds.length === 0 || excludeIds.every(id => !r.menu.some(d => d.allergens.includes(id))));
    })
    .sort((a,b) => sortBy==="safety" ? b.safetyRating-a.safetyRating : sortBy==="reviews" ? b.reviewCount-a.reviewCount : a.name.localeCompare(b.name));

  const suggested = restaurants.filter(r => {
    const mc = prefs.cuisines.length === 0 || prefs.cuisines.includes(r.cuisine);
    const mr = r.safetyRating >= (prefs.minRating || 0);
    const mn = !prefs.showNew || r.isNew;
    const ma = prefs.ambience.length === 0 || prefs.ambience.includes(r.ambience);
    const ml = !prefs.location || r.location.toLowerCase().includes(prefs.location.toLowerCase());
    return mc && mr && (prefs.showNew ? mn : true) && ma && ml;
  }).sort((a,b) => b.safetyRating - a.safetyRating);

  const hasPrefs = prefs.cuisines.length > 0 || prefs.ambience.length > 0 || prefs.minRating > 0 || prefs.showNew || prefs.location;

  return (
    <div style={{ minHeight:"100vh", background:C.cream }}>
      {showSuggest && <SuggestModal onClose={() => setShowSuggest(false)}/>}
      {showPrefs && <PrefsModal prefs={prefs} onChange={setPrefs} onClose={() => setShowPrefs(false)}/>}
      {selected !== null && (
        <RestaurantDetailModal
          restaurant={restaurants.find(r => r.id === selected)}
          onClose={() => setSelected(null)}
          onRate={onRate}
        />
      )}

      {/* Hero */}
      <div style={{ background:`linear-gradient(150deg,${C.orangeDk} 0%,${C.orange} 55%,${C.amber} 100%)`, padding:"50px 32px 46px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(ellipse at 20% 50%,rgba(255,255,255,.07) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(255,255,255,.05) 0%,transparent 50%)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", maxWidth:580, margin:"0 auto" }}>
          <div className="fu" style={{ fontSize:10, fontWeight:700, letterSpacing:3, color:"rgba(255,255,255,.75)", marginBottom:12, textTransform:"uppercase" }}>
            {prefs.name ? "Welcome back, " + prefs.name : "For Diners"}
          </div>
          <h1 className="fu fu1" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:44, color:"#fff", lineHeight:1.05, marginBottom:14 }}>
            Dine with <em>confidence.</em>
          </h1>
          <p className="fu fu2" style={{ fontSize:16, color:"rgba(255,255,255,.85)", lineHeight:1.7, maxWidth:440, margin:"0 auto 22px" }}>
            Every restaurant. Every dish. Every allergen — clearly labeled and verified by diners like you.
          </p>
          <div className="fu fu3" style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => setShowPrefs(true)}
              style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.45)", color:"#fff", borderRadius:10, padding:"9px 20px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              <Icon name="settings" size={14} color="#fff"/> My Preferences
            </button>
            <button onClick={() => setShowSuggest(true)}
              style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.45)", color:"#fff", borderRadius:10, padding:"9px 20px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              <Icon name="message" size={14} color="#fff"/> Suggest a Restaurant
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 24px" }}>
        {/* Tab toggle */}
        <div style={{ display:"flex", gap:4, marginBottom:22, background:C.parchment, borderRadius:12, padding:4, maxWidth:320 }}>
          {[["discover","compass","Discover"],["suggested","sparkle","For You"]].map(([tab,ico,lbl]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, background:activeTab===tab?C.white:"transparent", border:"none", borderRadius:9, padding:"9px 12px", fontWeight:700, fontSize:13, cursor:"pointer", color:activeTab===tab?C.orange:C.muted, transition:"all .18s", boxShadow:activeTab===tab?`0 2px 8px ${C.shadow}`:"none", position:"relative" }}>
              <Icon name={ico} size={14} color={activeTab===tab?C.orange:C.muted}/>{lbl}
              {tab==="suggested" && hasPrefs && <span style={{ width:7, height:7, borderRadius:50, background:C.orange, position:"absolute", top:6, right:6 }}/>}
            </button>
          ))}
        </div>

        {/* Discover tab */}
        {activeTab === "discover" && (
          <>
            {/* Filters */}
            <div style={{ background:C.white, borderRadius:18, padding:"20px 24px", marginBottom:22, boxShadow:`0 4px 20px ${C.shadow}`, border:`1px solid ${C.warm100}` }}>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:18 }}>
                <div style={{ flex:2, minWidth:180 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>Search</label>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Restaurant or location..."
                    style={{ width:"100%", border:`1.5px solid ${C.warm100}`, borderRadius:9, padding:"9px 14px", fontSize:14, background:C.cream }}/>
                </div>
                <div style={{ minWidth:140 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>Cuisine</label>
                  <select value={cuisine} onChange={e => setCuisine(e.target.value)} style={{ width:"100%", border:`1.5px solid ${C.warm100}`, borderRadius:9, padding:"9px 14px", fontSize:14, background:C.cream }}>
                    {CUISINES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ minWidth:140 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>Sort By</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width:"100%", border:`1.5px solid ${C.warm100}`, borderRadius:9, padding:"9px 14px", fontSize:14, background:C.cream }}>
                    <option value="safety">Safety Rating</option>
                    <option value="reviews">Most Reviewed</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                <div style={{ minWidth:160 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.muted, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>
                    Min Safety {minSafety > 0 ? minSafety.toFixed(1)+"+" : "Any"}
                  </label>
                  <input type="range" min={0} max={5} step={0.5} value={minSafety} onChange={e => setMinSafety(+e.target.value)}
                    style={{ width:"100%", accentColor:C.orange, marginTop:4 }}/>
                </div>
              </div>

              <div style={{ fontSize:11, fontWeight:700, color:C.brownMid, marginBottom:7, textTransform:"uppercase", letterSpacing:1 }}>Exclude my allergens:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {TOP9.map(a => {
                  const on = excludeIds.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => setExclude(f => on ? f.filter(x => x !== a.id) : [...f, a.id])}
                      style={{ display:"inline-flex", alignItems:"center", gap:5, borderRadius:99, padding:"4px 11px", fontSize:11, fontWeight:600, cursor:"pointer", transition:"all .15s", background:"#fff", border:`1.5px solid ${on?"#222":C.warm200}`, color:"#222", boxShadow: on ? "inset 0 1px 3px rgba(0,0,0,.15)" : "none" }}>
                      <span style={{ fontSize:14 }}>{a.icon}</span>{a.label}{on && <Icon name="close" size={9} color="#222" sw={2.5}/>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ fontSize:13, color:C.muted, marginBottom:16 }}>{filtered.length} restaurant{filtered.length !== 1 ? "s" : ""} found</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
              {filtered.map(r => <RestaurantCard key={r.id} r={r} onClick={() => setSelected(r.id)}/>)}
              {filtered.length === 0 && (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"70px 20px", color:C.muted }}>
                  <Icon name="search" size={40} color={C.warm200}/>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, marginTop:14, marginBottom:8 }}>No restaurants found</div>
                  <div style={{ fontSize:14 }}>Try adjusting your filters, or <button onClick={() => setShowSuggest(true)} style={{ background:"none", border:"none", color:C.orange, fontWeight:700, cursor:"pointer", fontSize:14 }}>suggest one</button></div>
                </div>
              )}
            </div>
          </>
        )}

        {/* For You tab */}
        {activeTab === "suggested" && (
          <div className="fu">
            {!hasPrefs ? (
              <div style={{ textAlign:"center", padding:"60px 24px", background:C.white, borderRadius:18, border:`1.5px dashed ${C.warm200}` }}>
                <div style={{ width:60, height:60, background:C.parchment, borderRadius:50, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                  <Icon name="sparkle" size={26} color={C.orange}/>
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:C.orange, marginBottom:10 }}>Set Your Preferences</div>
                <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, maxWidth:380, margin:"0 auto 20px" }}>
                  Tell us your favourite cuisines, location, and ambience — we will suggest restaurants tailored just for you.
                </p>
                <button onClick={() => setShowPrefs(true)}
                  style={{ display:"inline-flex", alignItems:"center", gap:7, background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"11px 26px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                  <Icon name="settings" size={15} color="#fff"/> Set My Preferences
                </button>
              </div>
            ) : (
              <>
                <div style={{ background:C.white, borderRadius:14, padding:"14px 20px", marginBottom:20, border:`1px solid ${C.warm100}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{suggested.length} suggestion{suggested.length !== 1 ? "s" : ""} based on your preferences</div>
                  <button onClick={() => setShowPrefs(true)}
                    style={{ display:"inline-flex", alignItems:"center", gap:6, background:C.parchment, border:`1.5px solid ${C.warm200}`, borderRadius:9, padding:"7px 14px", fontWeight:600, fontSize:13, cursor:"pointer", color:C.brownMid }}>
                    <Icon name="edit" size={13} color={C.brownMid}/> Edit
                  </button>
                </div>
                {suggested.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"50px 24px", color:C.muted, background:C.white, borderRadius:18, border:`1.5px dashed ${C.warm200}` }}>
                    <Icon name="search" size={36} color={C.warm200}/>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, marginTop:12, marginBottom:8 }}>No matches yet</div>
                    <div style={{ fontSize:14, marginBottom:14 }}>No restaurants match all your preferences.</div>
                    <button onClick={() => setShowSuggest(true)}
                      style={{ display:"inline-flex", alignItems:"center", gap:7, background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                      <Icon name="send" size={13} color="#fff"/> Suggest a restaurant
                    </button>
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
                    {suggested.map(r => <RestaurantCard key={r.id} r={r} onClick={() => setSelected(r.id)}/>)}
                  </div>
                )}
              </>
            )}

            <div style={{ marginTop:26, background:`${C.orange}18`, borderRadius:14, padding:"18px 22px", border:`1px solid ${C.amber}44`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:3 }}>Don't see your favourite spot?</div>
                <div style={{ fontSize:13, color:C.muted }}>Message Restaurant Legend and we'll reach out to them directly.</div>
              </div>
              <button onClick={() => setShowSuggest(true)}
                style={{ display:"inline-flex", alignItems:"center", gap:7, background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                <Icon name="send" size={13} color="#fff"/> Suggest a Restaurant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   DISH ROW (RESTAURANT PORTAL)
══════════════════════════════════════════════════════════════ */
const DishRow = ({ dish, index, total, extLabels, isSpecial=false, onUpdate, onRemove, onMoveUp, onMoveDown, isExpanded, onToggle }) => {
  const upd  = (f,v) => onUpdate({ ...dish, [f]:v });
  const togA = id => onUpdate({ ...dish, allergens: dish.allergens.includes(id) ? dish.allergens.filter(x=>x!==id) : [...dish.allergens,id] });
  const togD = id => { const d=dish.dietary||[]; onUpdate({ ...dish, dietary: d.includes(id)?d.filter(x=>x!==id):[...d,id] }); };
  const border = isSpecial ? (isExpanded ? `2px solid ${C.gold}` : `1px solid ${C.goldBorder}`) : (isExpanded ? `2px solid ${C.orange}` : `1px solid ${C.warm100}`);

  return (
    <div style={{ background: isSpecial ? "#FFFDF7" : C.white, borderRadius:13, border, overflow:"hidden", transition:"border-color .2s", boxShadow:`0 2px 8px ${C.shadow}` }}>
      <div style={{ padding:"11px 14px", display:"flex", gap:8, alignItems:"center" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:1, flexShrink:0 }}>
          <button onClick={onMoveUp} disabled={index===0} style={{ background:"none", border:"none", cursor:index===0?"default":"pointer", padding:"1px 3px", display:"flex" }}>
            <Icon name="arrowUp" size={12} color={index===0?C.warm200:C.muted}/>
          </button>
          <button onClick={onMoveDown} disabled={index===total-1} style={{ background:"none", border:"none", cursor:index===total-1?"default":"pointer", padding:"1px 3px", display:"flex" }}>
            <Icon name="arrowDown" size={12} color={index===total-1?C.warm200:C.muted}/>
          </button>
        </div>
        <button onClick={onToggle} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", transition:"transform .2s", transform:isExpanded?"rotate(90deg)":"" }}>
          <Icon name="chevronRight" size={15} color={isExpanded?(isSpecial?C.gold:C.orange):C.muted}/>
        </button>
        <input value={dish.name} onChange={e => upd("name", e.target.value)} onClick={() => !isExpanded && onToggle()} placeholder={isSpecial ? "Special dish name..." : "Dish name..."}
          style={{ flex:1, border:"none", fontSize:14, fontWeight:700, color:dish.name?C.charcoal:C.muted, background:"transparent", borderBottom:`1.5px solid ${isExpanded?(isSpecial?C.gold:C.orange):C.warm100}`, padding:"4px 2px", minWidth:0, transition:"border-color .2s" }}/>
        {dish.allergens.length > 0 && <span style={{ fontSize:11, fontWeight:700, background:C.orange, color:"#fff", borderRadius:99, padding:"2px 8px", flexShrink:0 }}>{dish.allergens.length}A</span>}
        {(dish.dietary||[]).length > 0 && <span style={{ fontSize:11, fontWeight:700, background:C.green, color:"#fff", borderRadius:99, padding:"2px 8px", flexShrink:0 }}>{(dish.dietary||[]).length}D</span>}
        <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
          <span style={{ color:C.muted, fontWeight:700, fontSize:13 }}>$</span>
          <input value={dish.price} onChange={e => upd("price", e.target.value)} placeholder="0.00"
            style={{ width:62, border:`1.5px solid ${C.warm100}`, borderRadius:8, padding:"5px 8px", fontSize:13, background:C.cream, textAlign:"right" }}/>
        </div>
        <button onClick={onRemove} style={{ background:"#FFF0F0", border:"1px solid #FFCCCC", borderRadius:8, padding:"5px 9px", cursor:"pointer", display:"flex" }}>
          <Icon name="trash" size={13} color="#CC4444"/>
        </button>
      </div>

      {isExpanded && (
        <div style={{ padding:"0 16px 18px", borderTop:`1px solid ${isSpecial?C.goldBorder:C.warm100}`, paddingTop:14 }}>
          <textarea value={dish.desc} onChange={e => upd("desc", e.target.value)} placeholder="Describe ingredients, preparation..." rows={2}
            style={{ width:"100%", border:`1.5px solid ${C.warm100}`, borderRadius:9, padding:"9px 12px", fontSize:13, background:C.cream, resize:"vertical", lineHeight:1.55, marginBottom:13 }}/>

          <div style={{ fontSize:11, fontWeight:700, color:C.brownMid, marginBottom:8, textTransform:"uppercase", letterSpacing:.8, display:"flex", alignItems:"center", gap:6 }}>
            <Icon name="tag" size={12} color={C.brownMid}/> Top 9 FDA Allergens
            {dish.allergens.length === 0 && <span style={{ fontSize:11, color:C.green, background:C.greenLt, padding:"2px 9px", borderRadius:6, fontWeight:600, textTransform:"none", letterSpacing:0 }}>None selected</span>}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:13 }}>
            {TOP9.map(a => {
              const on = dish.allergens.includes(a.id);
              return (
                <button key={a.id} onClick={() => togA(a.id)}
                  style={{ display:"inline-flex", alignItems:"center", gap:5, borderRadius:8, padding:"5px 11px", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s", background:on?a.color:C.parchment, border:on?`1.5px solid ${a.color}`:`1.5px solid ${C.warm100}`, color:on?"#fff":C.muted }}>
                  <span style={{ fontSize:13 }}>{a.icon}</span>{a.label}
                </button>
              );
            })}
          </div>

          {extLabels && (
            <>
              <div style={{ fontSize:11, fontWeight:700, color:C.brownMid, marginBottom:8, textTransform:"uppercase", letterSpacing:.8, display:"flex", alignItems:"center", gap:6 }}>
                <Icon name="leaf" size={12} color={C.green}/> Dietary and Lifestyle
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:13 }}>
                {EXTENDED.map(a => {
                  const on = (dish.dietary||[]).includes(a.id);
                  return (
                    <button key={a.id} onClick={() => togD(a.id)}
                      style={{ display:"inline-flex", alignItems:"center", gap:5, borderRadius:8, padding:"5px 11px", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s", background:on?a.color:C.parchment, border:on?`1.5px solid ${a.color}`:`1.5px solid ${C.warm100}`, color:on?"#fff":C.muted }}>
                      <Icon name="check" size={11} color={on?"#fff":C.muted} sw={on?2.5:1.8}/>{a.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Preview */}
          <div style={{ background: isSpecial ? "#FFF8E8" : C.parchment, borderRadius:9, padding:"9px 13px", border: isSpecial ? `1px solid ${C.goldBorder}` : "none" }}>
            <div style={{ fontSize:10, fontWeight:700, color: isSpecial ? "#9A7020" : C.brownMid, marginBottom:6, textTransform:"uppercase", letterSpacing:.8 }}>Label Preview</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {(dish.allergens.length === 0 && (dish.dietary||[]).length === 0)
                ? <span style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>No labels selected</span>
                : <>{dish.allergens.map(id => <AllergenIcon key={id} id={id} showLabel={true}/>)}{(dish.dietary||[]).map(id => <AllergenIcon key={id} id={id} showLabel={true}/>)}</>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   BRAND PANEL
══════════════════════════════════════════════════════════════ */
const BrandPanel = ({ restaurant, onSave }) => {
  const [logo, setLogo]     = useState(restaurant.brandLogo || null);
  const [font, setFont]     = useState(restaurant.brandFont || "");
  const [accent, setAccent] = useState(restaurant.brandAccent || "");
  const [menuFile, setMenuFile]   = useState(null);
  const [menuPreview, setMenuPreview] = useState(null);
  const [saved, setSaved]   = useState(false);
  const logoRef = useRef(); const menuRef = useRef();

  const handleLogo = e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = ev => setLogo(ev.target.result); r.readAsDataURL(file);
  };
  const handleMenu = e => {
    const file = e.target.files[0]; if (!file) return;
    setMenuFile(file.name);
    if (file.type.startsWith("image/")) {
      const r = new FileReader(); r.onload = ev => setMenuPreview(ev.target.result); r.readAsDataURL(file);
    } else { setMenuPreview(null); }
  };
  const doSave = () => { onSave({ brandLogo:logo, brandFont:font, brandAccent:accent }); setSaved(true); setTimeout(()=>setSaved(false),2500); };

  const FONT_OPTIONS = [
    { label:"Default (Cormorant Garamond)", value:"" },
    { label:"Georgia (Classic Serif)", value:"Georgia, serif" },
    { label:"Garamond", value:"Garamond, serif" },
    { label:"Helvetica Neue (Clean Sans)", value:"'Helvetica Neue', sans-serif" },
    { label:"Futura / Century Gothic", value:"Futura, 'Century Gothic', sans-serif" },
    { label:"Palatino (Elegant Serif)", value:"Palatino, serif" },
    { label:"Trebuchet MS", value:"'Trebuchet MS', sans-serif" },
    { label:"Courier New (Mono)", value:"'Courier New', monospace" },
  ];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:C.orange, marginBottom:3 }}>Brand and Menu Style</h2>
          <p style={{ fontSize:13, color:C.muted }}>Upload your logo and choose fonts — your allergen menu will reflect your brand identity.</p>
        </div>
        <button onClick={doSave}
          style={{ display:"inline-flex", alignItems:"center", gap:7, background:saved?`linear-gradient(135deg,${C.green},#2D6A4F)`:`linear-gradient(135deg,${C.orange},${C.orangeDk})`, color:"#fff", border:"none", borderRadius:10, padding:"9px 22px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
          {saved ? <><Icon name="check" size={13} color="#fff" sw={2.5}/> Saved!</> : <><Icon name="check" size={13} color="#fff" sw={2.5}/> Save Brand</>}
        </button>
      </div>

      {/* Logo upload */}
      <div style={{ background:C.white, borderRadius:14, padding:"20px", border:`1px solid ${C.warm100}`, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:13 }}>
          <div style={{ width:30, height:30, background:C.parchment, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="image" size={15} color={C.orange}/>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Restaurant Logo</div>
            <div style={{ fontSize:12, color:C.muted }}>Appears at the top of your printed menu</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap" }}>
          <div onClick={() => logoRef.current.click()}
            style={{ width:150, height:90, border:`2px dashed ${C.warm200}`, borderRadius:11, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", background:C.cream, overflow:"hidden", transition:"border-color .2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor=C.orange}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.warm200}>
            {logo
              ? <img src={logo} alt="logo" style={{ width:"100%", height:"100%", objectFit:"contain", padding:8 }}/>
              : <><Icon name="upload" size={18} color={C.muted}/><span style={{ fontSize:12, color:C.muted, marginTop:6 }}>Click to upload</span></>
            }
          </div>
          <div style={{ flex:1, minWidth:150 }}>
            <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} style={{ display:"none" }}/>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:8 }}>Supported: PNG, JPG, SVG, WebP. Recommended: transparent background, min 200x200px</div>
            {logo && (
              <button onClick={() => setLogo(null)} style={{ display:"inline-flex", alignItems:"center", gap:5, background:"#FFF0F0", border:"1px solid #FFCCCC", borderRadius:8, padding:"6px 12px", fontSize:12, color:"#CC4444", cursor:"pointer" }}>
                <Icon name="trash" size={12} color="#CC4444"/> Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
        {/* Font */}
        <div style={{ background:C.white, borderRadius:14, padding:"18px", border:`1px solid ${C.warm100}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:30, height:30, background:C.parchment, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="alignLeft" size={14} color={C.orange}/>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Menu Font</div>
              <div style={{ fontSize:12, color:C.muted }}>Applied to printed menu text</div>
            </div>
          </div>
          <select value={font} onChange={e => setFont(e.target.value)}
            style={{ width:"100%", border:`1.5px solid ${C.warm100}`, borderRadius:9, padding:"9px 12px", fontSize:13, background:C.cream, color:C.text, marginBottom:10 }}>
            {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          {font && (
            <div style={{ background:C.parchment, borderRadius:8, padding:"10px 13px", fontSize:15, fontFamily:font, color:C.text, lineHeight:1.5 }}>
              Preview: Grilled Salmon — herb butter
            </div>
          )}
        </div>

        {/* Accent colour */}
        <div style={{ background:C.white, borderRadius:14, padding:"18px", border:`1px solid ${C.warm100}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:30, height:30, background:C.parchment, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="palette" size={14} color={C.orange}/>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Brand Accent Colour</div>
              <div style={{ fontSize:12, color:C.muted }}>Used for headings and prices in print</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:9, alignItems:"center", marginBottom:10 }}>
            <input type="color" value={accent || C.orange} onChange={e => setAccent(e.target.value)}
              style={{ width:44, height:38, border:`1.5px solid ${C.warm100}`, borderRadius:8, cursor:"pointer", padding:3, background:"none" }}/>
            <input value={accent} onChange={e => setAccent(e.target.value)} placeholder={C.orange}
              style={{ flex:1, border:`1.5px solid ${C.warm100}`, borderRadius:8, padding:"8px 11px", fontSize:13, background:C.cream, fontFamily:"monospace" }}/>
            {accent && <button onClick={() => setAccent("")} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:12 }}>Reset</button>}
          </div>
          <div style={{ background:C.parchment, borderRadius:8, padding:"10px 13px", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:22, height:22, borderRadius:5, background:accent||C.orange }}/>
            <span style={{ fontSize:13, color:accent||C.orange, fontWeight:700 }}>Sample heading colour</span>
          </div>
        </div>
      </div>

      {/* Original menu upload */}
      <div style={{ background:C.white, borderRadius:14, padding:"20px", border:`1px solid ${C.warm100}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <div style={{ width:30, height:30, background:C.parchment, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="fileText" size={14} color={C.orange}/>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Upload Your Original Menu</div>
            <div style={{ fontSize:12, color:C.muted }}>We'll study your design to mirror your style in the allergen-labeled version</div>
          </div>
        </div>
        <div style={{ background:`linear-gradient(135deg,${C.parchment},${C.cream})`, borderRadius:10, padding:"12px 14px", marginBottom:14, border:`1px solid ${C.warm100}` }}>
          <div style={{ fontSize:12, color:C.brownMid, lineHeight:1.7 }}>
            Upload your current paper menu (PDF, JPG, or PNG). Our team will use it as a style reference — preserving your fonts, layout, and aesthetic in the printed allergen output.
          </div>
        </div>
        <div onClick={() => menuRef.current.click()}
          style={{ border:`2px dashed ${menuFile?C.orange:C.warm200}`, borderRadius:11, padding:"22px", textAlign:"center", cursor:"pointer", background:menuFile?`${C.orange}08`:C.cream, transition:"all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=C.orange; e.currentTarget.style.background=`${C.orange}08`; }}
          onMouseLeave={e => { if (!menuFile) { e.currentTarget.style.borderColor=C.warm200; e.currentTarget.style.background=C.cream; } }}>
          <input ref={menuRef} type="file" accept="image/*,.pdf" onChange={handleMenu} style={{ display:"none" }}/>
          {menuFile ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              {menuPreview
                ? <img src={menuPreview} alt="menu preview" style={{ maxHeight:140, maxWidth:"100%", objectFit:"contain", borderRadius:8, boxShadow:`0 4px 14px ${C.shadow}` }}/>
                : <div style={{ width:70, height:70, background:C.parchment, borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="fileText" size={28} color={C.orange}/></div>
              }
              <div style={{ fontWeight:700, fontSize:14, color:C.orange }}>{menuFile}</div>
              <div style={{ fontSize:12, color:C.green }}>Uploaded — our team will use this as a style reference</div>
              <button onClick={e => { e.stopPropagation(); setMenuFile(null); setMenuPreview(null); }}
                style={{ display:"inline-flex", alignItems:"center", gap:5, background:"#FFF0F0", border:"1px solid #FFCCCC", borderRadius:8, padding:"5px 11px", fontSize:12, color:"#CC4444", cursor:"pointer", marginTop:4 }}>
                <Icon name="trash" size={11} color="#CC4444"/> Remove
              </button>
            </div>
          ) : (
            <>
              <Icon name="upload" size={26} color={C.muted}/>
              <div style={{ fontSize:14, fontWeight:600, color:C.text, marginTop:9, marginBottom:4 }}>Drop your menu here</div>
              <div style={{ fontSize:12, color:C.muted }}>PDF, JPG, or PNG</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SPECIALS PANEL
══════════════════════════════════════════════════════════════ */
const SpecialsPanel = ({ restaurant, extLabels, specials, specialsEnabled, specialsCadence, onUpdate, onSave }) => {
  const [expanded, setExpanded] = useState(null);
  const [saved, setSaved] = useState(false);

  const addSpecial = () => {
    const id = "sp_" + Date.now();
    onUpdate({ specials:[...specials, { id, name:"", desc:"", price:"", allergens:[], dietary:[] }] });
    setExpanded(id);
  };
  const updSpecial  = (id,d) => onUpdate({ specials: specials.map(s => s.id===id ? d : s) });
  const remSpecial  = id    => onUpdate({ specials: specials.filter(s => s.id!==id) });
  const moveSpecial = (idx,dir) => { const a=[...specials]; [a[idx],a[idx+dir]]=[a[idx+dir],a[idx]]; onUpdate({ specials:a }); };
  const doSave = () => { onSave(); setSaved(true); setTimeout(()=>setSaved(false),2500); };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:C.goldDk, marginBottom:3, display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="sparkle" size={20} color={C.gold}/> Specials
          </h2>
          <div style={{ fontSize:13, color:C.muted }}>Manage featured, rotating, or seasonal dishes</div>
        </div>
        <button onClick={doSave}
          style={{ display:"inline-flex", alignItems:"center", gap:6, background:saved?`linear-gradient(135deg,${C.green},#2D6A4F)`:`linear-gradient(135deg,${C.gold},${C.goldDk})`, color:"#fff", border:"none", borderRadius:9, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
          {saved ? <><Icon name="check" size={13} color="#fff" sw={2.5}/> Saved!</> : <><Icon name="check" size={13} color="#fff" sw={2.5}/> Save Specials</>}
        </button>
      </div>

      {/* Enable toggle */}
      <div style={{ background:specialsEnabled?"#FFFBEE":"#fff", borderRadius:13, padding:"15px 18px", marginBottom:16, border:`2px solid ${specialsEnabled?C.goldBorder:C.warm200}`, transition:"all .25s", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:15, color:specialsEnabled?C.goldDk:C.text, marginBottom:3, display:"flex", alignItems:"center", gap:7 }}>
            <Icon name="sparkle" size={15} color={specialsEnabled?C.gold:C.muted}/> Specials Feature
          </div>
          <div style={{ fontSize:13, color:C.muted }}>
            {specialsEnabled
              ? "Active — specials appear highlighted on your menu and in print."
              : "Enable to add a rotating specials section to your menu."}
          </div>
        </div>
        <button onClick={() => onUpdate({ specialsEnabled:!specialsEnabled })}
          style={{ background:specialsEnabled?`linear-gradient(135deg,${C.gold},${C.goldDk})`:"#E0D9D0", border:"none", borderRadius:99, padding:"8px 20px", fontWeight:700, fontSize:13, color:specialsEnabled?"#fff":C.muted, cursor:"pointer", transition:"all .25s", minWidth:88 }}>
          {specialsEnabled ? "Enabled" : "Off"}
        </button>
      </div>

      {specialsEnabled && (
        <>
          {/* Cadence */}
          <div style={{ background:C.white, borderRadius:12, padding:"14px 16px", marginBottom:14, border:`1px solid ${C.goldBorder}` }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#9A7020", marginBottom:10, textTransform:"uppercase", letterSpacing:.8 }}>Update Frequency</div>
            <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
              {CADENCES.map(opt => {
                const active = specialsCadence === opt;
                return (
                  <button key={opt} onClick={() => onUpdate({ specialsCadence:opt })}
                    style={{ display:"inline-flex", alignItems:"center", gap:6, borderRadius:10, padding:"9px 16px", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all .18s", background:active?`linear-gradient(135deg,${C.gold},${C.goldDk})`:"#FFF8EE", border:active?"none":`1.5px solid ${C.goldBorder}`, color:active?"#fff":"#9A7020", boxShadow:active?`0 3px 12px rgba(200,130,0,.3)`:"none" }}>
                    <Icon name={opt==="Daily"?"bolt":opt==="Weekly"?"list":"leaf"} size={13} color={active?"#fff":C.gold}/>
                    {opt}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize:12, color:C.muted, marginTop:9 }}>
              {specialsCadence === "Daily" && "Updated each day — ideal for fresh catch, soups, or chef's inspiration."}
              {specialsCadence === "Weekly" && "Rotated each week — great for themed nights or featured ingredients."}
              {specialsCadence === "Seasonal" && "Changed with the seasons — perfect for farm-to-table or holiday menus."}
            </div>
          </div>

          <div style={{ background:"#FFFBEE", borderRadius:9, padding:"9px 13px", marginBottom:14, border:`1px solid ${C.goldBorder}`, fontSize:12, color:"#9A7020", display:"flex", alignItems:"flex-start", gap:7 }}>
            <Icon name="bell" size={13} color={C.gold}/>
            <span>Specials appear highlighted at the top of your menu on the app and in print. Update them any time — changes are reflected immediately.</span>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {specials.length === 0 && (
              <div style={{ textAlign:"center", padding:"36px 22px", background:"#FFFBEE", borderRadius:13, border:`2px dashed ${C.goldBorder}` }}>
                <Icon name="sparkle" size={34} color={C.gold}/>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.goldDk, marginTop:11, marginBottom:6 }}>No specials yet</div>
                <div style={{ fontSize:13, color:C.muted, marginBottom:14 }}>Add your first special — it will appear highlighted on your menu.</div>
                <button onClick={addSpecial}
                  style={{ display:"inline-flex", alignItems:"center", gap:7, background:`linear-gradient(135deg,${C.gold},${C.goldDk})`, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                  <Icon name="plus" size={14} color="#fff"/> Add First Special
                </button>
              </div>
            )}
            {specials.map((dish,idx) => (
              <DishRow key={dish.id} dish={dish} index={idx} total={specials.length}
                extLabels={extLabels} isSpecial={true}
                onUpdate={d => updSpecial(dish.id, d)}
                onRemove={() => remSpecial(dish.id)}
                onMoveUp={() => moveSpecial(idx,-1)}
                onMoveDown={() => moveSpecial(idx,1)}
                isExpanded={expanded===dish.id}
                onToggle={() => setExpanded(p => p===dish.id?null:dish.id)}
              />
            ))}
          </div>

          {specials.length > 0 && (
            <button onClick={addSpecial}
              style={{ marginTop:12, width:"100%", background:"transparent", border:`2px dashed ${C.goldBorder}`, borderRadius:12, padding:"13px", fontSize:13, fontWeight:700, color:C.gold, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.background="#FFFBEE"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.goldBorder; e.currentTarget.style.background="transparent"; }}>
              <Icon name="plus" size={14} color="currentColor"/> Add Another Special
            </button>
          )}
        </>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MENU EDITOR  (restaurant portal)
══════════════════════════════════════════════════════════════ */
const MenuEditor = ({ restaurant, onSave }) => {
  const [tab, setTab]   = useState("menu");
  const [menu, setMenu] = useState(restaurant.menu);
  const [extLabels, setExt]   = useState(restaurant.extendedLabels);
  const [published, setPub]   = useState(restaurant.published !== false);
  const [brand, setBrand]     = useState({ brandLogo:restaurant.brandLogo||null, brandFont:restaurant.brandFont||"", brandAccent:restaurant.brandAccent||"" });
  const [specials, setSpecials]         = useState(restaurant.specials || []);
  const [specialsEnabled, setSpEnabled] = useState(restaurant.specialsEnabled || false);
  const [specialsCadence, setSpCadence] = useState(restaurant.specialsCadence || "Daily");
  const [showPrint, setShowPrint] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const save = useCallback((overrides={}) => {
    onSave({ menu, extLabels, published, specials, specialsEnabled, specialsCadence, ...brand, ...overrides });
    setSaved(true); setTimeout(()=>setSaved(false),2500);
  }, [menu,extLabels,published,brand,specials,specialsEnabled,specialsCadence,onSave]);

  const addDish = () => { const id=Date.now().toString(); setMenu(m=>[...m,{id,name:"",desc:"",price:"",allergens:[],dietary:[]}]); setExpanded(id); };
  const updDish = (id,d) => setMenu(m=>m.map(x=>x.id===id?d:x));
  const remDish = id => setMenu(m=>m.filter(x=>x.id!==id));
  const moveDish= (idx,dir) => setMenu(m=>{ const a=[...m]; [a[idx],a[idx+dir]]=[a[idx+dir],a[idx]]; return a; });

  const handleSpecialsUpdate = updates => {
    if (updates.specials        !== undefined) setSpecials(updates.specials);
    if (updates.specialsEnabled !== undefined) setSpEnabled(updates.specialsEnabled);
    if (updates.specialsCadence !== undefined) setSpCadence(updates.specialsCadence);
  };

  const printRest = { ...restaurant, ...brand, menu, extendedLabels:extLabels, specials, specialsEnabled, specialsCadence };
  const incomplete = menu.filter(d => !d.name || !d.price);
  const unlabeled  = menu.filter(d => d.name && d.allergens.length===0 && (d.dietary||[]).length===0);

  const TABS = [
    { id:"menu",     icon:"list",    label:"Menu and Labels" },
    { id:"specials", icon:"sparkle", label:"Specials", badge:specialsEnabled },
    { id:"brand",    icon:"palette", label:"Brand and Style" },
    { id:"publish",  icon:"eye",     label:"Publish" },
  ];

  return (
    <div>
      {showPrint && <PrintMenuModal restaurant={printRest} onClose={() => setShowPrint(false)}/>}

      {/* Tab bar */}
      <div style={{ display:"flex", gap:3, marginBottom:20, background:C.parchment, borderRadius:11, padding:4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, background:tab===t.id?C.white:"transparent", border:"none", borderRadius:8, padding:"9px 6px", fontWeight:700, fontSize:12, cursor:"pointer", color:tab===t.id?(t.id==="specials"?C.goldDk:C.orange):C.muted, transition:"all .18s", boxShadow:tab===t.id?`0 2px 8px ${C.shadow}`:"none", position:"relative" }}>
            <Icon name={t.icon} size={13} color={tab===t.id?(t.id==="specials"?C.goldDk:C.orange):C.muted}/>
            {t.label}
            {t.badge && <span style={{ width:6, height:6, borderRadius:50, background:C.gold, position:"absolute", top:6, right:6 }}/>}
          </button>
        ))}
      </div>

      {/* MENU TAB */}
      {tab === "menu" && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
            <div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:C.orange, marginBottom:2 }}>Menu Editor</h2>
              <div style={{ fontSize:13, color:C.muted }}>{menu.length} dish{menu.length!==1?"es":""} — {menu.filter(d=>d.allergens.length>0).length} labeled</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setShowPrint(true)} style={{ display:"inline-flex", alignItems:"center", gap:6, background:C.parchment, border:`1.5px solid ${C.warm200}`, borderRadius:9, padding:"8px 14px", fontWeight:600, fontSize:12, cursor:"pointer", color:C.brownMid }}>
                <Icon name="printer" size={12} color={C.brownMid}/> Print
              </button>
              <button onClick={() => save()} style={{ display:"inline-flex", alignItems:"center", gap:6, background:saved?`linear-gradient(135deg,${C.green},#2D6A4F)`:`linear-gradient(135deg,${C.orange},${C.orangeDk})`, color:"#fff", border:"none", borderRadius:9, padding:"8px 16px", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                {saved ? <><Icon name="check" size={12} color="#fff" sw={2.5}/> Saved!</> : <><Icon name="check" size={12} color="#fff" sw={2.5}/> Save</>}
              </button>
            </div>
          </div>

          {incomplete.length > 0 && (
            <div style={{ background:"#FFF0F0", border:`1px solid #FFCCCC`, borderRadius:10, padding:"9px 13px", marginBottom:13, fontSize:13, color:"#B84040", display:"flex", alignItems:"center", gap:7 }}>
              <Icon name="bell" size={13} color="#B84040"/>
              <span><strong>{incomplete.length} dish{incomplete.length!==1?"es":""}</strong> missing name or price</span>
            </div>
          )}

          {/* Extended toggle */}
          <div style={{ background:C.white, borderRadius:12, padding:"12px 15px", marginBottom:14, border:`1px solid ${C.warm100}`, display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontWeight:700, color:C.text, fontSize:14, marginBottom:2 }}>
                <Icon name="leaf" size={14} color={C.green}/> Extended Dietary Labels
              </div>
              <div style={{ fontSize:12, color:C.muted }}>Enable Vegan, GF, Keto, Paleo, Halal, Kosher per dish</div>
            </div>
            <button onClick={() => setExt(v => !v)} style={{ background:extLabels?`linear-gradient(135deg,${C.orange},${C.orangeDk})`:"#E0D9D0", border:"none", borderRadius:99, padding:"7px 16px", fontWeight:700, fontSize:13, color:extLabels?"#fff":C.muted, cursor:"pointer", transition:"all .22s", minWidth:76 }}>
              {extLabels?"On":"Off"}
            </button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {menu.length === 0 && (
              <div style={{ textAlign:"center", padding:"44px 22px", background:C.white, borderRadius:14, border:`2px dashed ${C.warm200}` }}>
                <Icon name="restaurant" size={38} color={C.warm200}/>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:C.orange, marginTop:13, marginBottom:8 }}>No dishes yet</div>
                <button onClick={addDish} style={{ display:"inline-flex", alignItems:"center", gap:6, background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                  <Icon name="plus" size={14} color="#fff"/> Add First Dish
                </button>
              </div>
            )}
            {menu.map((dish,idx) => (
              <DishRow key={dish.id} dish={dish} index={idx} total={menu.length}
                extLabels={extLabels}
                onUpdate={d => updDish(dish.id,d)}
                onRemove={() => remDish(dish.id)}
                onMoveUp={() => moveDish(idx,-1)}
                onMoveDown={() => moveDish(idx,1)}
                isExpanded={expanded===dish.id}
                onToggle={() => setExpanded(p => p===dish.id?null:dish.id)}
              />
            ))}
          </div>

          {menu.length > 0 && (
            <button onClick={addDish}
              style={{ marginTop:13, width:"100%", background:"transparent", border:`2px dashed ${C.warm200}`, borderRadius:12, padding:"13px", fontSize:13, fontWeight:700, color:C.muted, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.orange; e.currentTarget.style.color=C.orange; e.currentTarget.style.background=`${C.orange}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.warm200; e.currentTarget.style.color=C.muted; e.currentTarget.style.background="transparent"; }}>
              <Icon name="plus" size={15} color="currentColor"/> Add Dish
            </button>
          )}
        </div>
      )}

      {/* SPECIALS TAB */}
      {tab === "specials" && (
        <SpecialsPanel
          restaurant={restaurant}
          extLabels={extLabels}
          specials={specials}
          specialsEnabled={specialsEnabled}
          specialsCadence={specialsCadence}
          onUpdate={handleSpecialsUpdate}
          onSave={() => save()}
        />
      )}

      {/* BRAND TAB */}
      {tab === "brand" && (
        <BrandPanel restaurant={{ ...restaurant, ...brand }} onSave={b => { setBrand(b); save(b); }}/>
      )}

      {/* PUBLISH TAB */}
      {tab === "publish" && (
        <div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:C.orange, marginBottom:16 }}>Publish Status</h2>
          <div style={{ background:published?C.greenLt:"#FFF8F0", borderRadius:14, padding:"18px 22px", border:`2px solid ${published?C.green:C.amber}`, marginBottom:18, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:published?C.green:C.brownMid, marginBottom:4 }}>
                {published ? "Live and Visible to Diners" : "Draft — Not Visible Yet"}
              </div>
              <div style={{ fontSize:13, color:C.muted }}>{published ? restaurant.name+" appears in diner search with your allergen-labeled menu." : "Save as draft until you're ready to go live."}</div>
            </div>
            <button onClick={() => { const v=!published; setPub(v); save({ published:v }); }}
              style={{ background:published?"#FFF0F0":`linear-gradient(135deg,${C.orange},${C.orangeDk})`, border:published?"1.5px solid #FFCCCC":"none", color:published?"#CC4444":"#fff", borderRadius:10, padding:"10px 20px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              {published?"Unpublish":"Publish Now"}
            </button>
          </div>

          <div style={{ background:C.white, borderRadius:14, padding:"18px 22px", border:`1px solid ${C.warm100}`, marginBottom:18 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:C.orange, marginBottom:13 }}>Pre-Publish Checklist</div>
            {[
              [!!restaurant.name && !!restaurant.location, "Restaurant profile complete"],
              [menu.length > 0, "Menu has dishes (" + menu.length + " added)"],
              [incomplete.length === 0, "All dishes have names and prices"],
              [unlabeled.length === 0, "All dishes have allergen labels reviewed"],
              [true, "Logo uploaded (optional but recommended)"],
            ].map(([ok,lbl],i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:i<4?`1px solid ${C.parchment}`:"none" }}>
                <div style={{ width:21, height:21, borderRadius:6, background:ok?C.greenLt:C.parchment, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name="check" size={11} color={ok?C.green:C.warm200} sw={ok?2.5:1.5}/>
                </div>
                <span style={{ fontSize:14, color:ok?C.text:C.muted }}>{lbl}</span>
              </div>
            ))}
          </div>

          <div style={{ background:C.parchment, borderRadius:13, padding:"16px 18px", border:`1px solid ${C.warm100}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, color:C.orange, marginBottom:4 }}>Print-Ready Menu</div>
              <div style={{ fontSize:13, color:C.muted }}>Generate a formatted allergen menu for in-restaurant distribution</div>
            </div>
            <button onClick={() => setShowPrint(true)} style={{ display:"inline-flex", alignItems:"center", gap:7, background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              <Icon name="printer" size={13} color="#fff"/> Open Print Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   CREATE RESTAURANT MODAL
══════════════════════════════════════════════════════════════ */
const CreateModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ name:"", cuisine:"American", location:"", description:"", ambience:"Casual" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const upd = (f,v) => { setForm(p=>({...p,[f]:v})); setErrors(p=>({...p,[f]:""})); };

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.location.trim()) e.location = "Required";
    if (!form.description.trim()) e.description = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCreate({ id:Date.now(), ...form, safetyRating:0, staffRating:0, kitchenRating:0, reviewCount:0, extendedLabels:false, published:false, isNew:true, brandLogo:null, brandFont:"", brandAccent:"", specialsEnabled:false, specialsCadence:"Daily", specials:[], menu:[] });
    setDone(true);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(30,20,16,.7)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:24, backdropFilter:"blur(6px)" }}>
      <div style={{ background:C.white, borderRadius:20, maxWidth:500, width:"100%", overflow:"hidden", boxShadow:`0 40px 100px rgba(30,20,16,.35)` }} className="fu">
        <div style={{ background:`linear-gradient(130deg,${C.brown},${C.brownMid})`, padding:"20px 26px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:C.amber, textTransform:"uppercase", marginBottom:4 }}>New Restaurant</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:"#fff" }}>{done?"You're all set!":"Create Your Profile"}</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:50, width:32, height:32, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Icon name="close" size={15} color="#fff"/>
          </button>
        </div>
        <div style={{ padding:"24px 26px" }}>
          {!done ? (
            <>
              {[["Restaurant Name","name","text","e.g. The Golden Fork",true],["Location","location","text","City, State",true]].map(([lbl,f,t,ph,req]) => (
                <div key={f} style={{ marginBottom:15 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.brownMid, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:.8 }}>{lbl}{req && <span style={{ color:C.orange }}> *</span>}</label>
                  <input type={t} value={form[f]} onChange={e => upd(f, e.target.value)} placeholder={ph}
                    style={{ width:"100%", border:`1.5px solid ${errors[f]?C.orangeDk:C.warm100}`, borderRadius:9, padding:"9px 13px", fontSize:14, background:C.cream }}/>
                  {errors[f] && <div style={{ fontSize:12, color:C.orangeDk, marginTop:3 }}>{errors[f]}</div>}
                </div>
              ))}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13, marginBottom:15 }}>
                {[["Cuisine","cuisine",CUISINE_OPTIONS],["Ambience","ambience",AMBIENCES]].map(([lbl,f,opts]) => (
                  <div key={f}>
                    <label style={{ fontSize:11, fontWeight:700, color:C.brownMid, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:.8 }}>{lbl}</label>
                    <select value={form[f]} onChange={e => upd(f, e.target.value)} style={{ width:"100%", border:`1.5px solid ${C.warm100}`, borderRadius:9, padding:"9px 12px", fontSize:13, background:C.cream, color:C.text }}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.brownMid, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:.8 }}>Description *</label>
                <textarea value={form.description} onChange={e => upd("description", e.target.value)} rows={3} placeholder="Describe your cuisine and approach to allergen safety..."
                  style={{ width:"100%", border:`1.5px solid ${errors.description?C.orangeDk:C.warm100}`, borderRadius:9, padding:"9px 13px", fontSize:14, background:C.cream, resize:"vertical", lineHeight:1.55 }}/>
                {errors.description && <div style={{ fontSize:12, color:C.orangeDk, marginTop:3 }}>{errors.description}</div>}
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                <button onClick={onClose} style={{ background:"none", border:`1.5px solid ${C.warm200}`, borderRadius:10, padding:"9px 20px", fontWeight:600, fontSize:14, cursor:"pointer", color:C.muted }}>Cancel</button>
                <button onClick={submit}
                  style={{ display:"inline-flex", alignItems:"center", gap:7, background:`linear-gradient(135deg,${C.orange},${C.orangeDk})`, color:"#fff", border:"none", borderRadius:10, padding:"9px 22px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                  Create Restaurant
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"14px 0 8px" }}>
              <div style={{ width:52, height:52, background:C.greenLt, borderRadius:50, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                <Icon name="check" size={24} color={C.green} sw={2.5}/>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:C.orange, marginBottom:8 }}>Restaurant Created!</div>
              <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, marginBottom:20 }}>
                <strong style={{ color:C.text }}>{form.name}</strong> is ready. Now head to the Menu Editor to add dishes and allergen labels, then publish when ready.
              </p>
              <button onClick={onClose} style={{ background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"10px 28px", fontWeight:700, fontSize:14, cursor:"pointer" }}>Go to Menu Editor</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   RESTAURANT PORTAL
══════════════════════════════════════════════════════════════ */
const RestaurantPortal = ({ restaurants, onSaveMenu, onAddRestaurant }) => {
  const [active, setActive] = useState(restaurants[0]?.id || null);
  const [showCreate, setShowCreate] = useState(false);
  const activeRest = restaurants.find(r => r.id === active);

  const handleCreate = r => { onAddRestaurant(r); setActive(r.id); };

  return (
    <div style={{ minHeight:"100vh", background:C.cream }}>
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={r => { handleCreate(r); setShowCreate(false); }}/>}

      <div style={{ background:`linear-gradient(135deg,${C.charcoal},${C.brown})`, padding:"26px 30px 22px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:3, color:C.amber, marginBottom:8, textTransform:"uppercase" }}>Restaurant Portal</div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:"#fff", marginBottom:4 }}>Menu Management</h1>
            <p style={{ color:"rgba(255,255,255,.5)", fontSize:13 }}>Build allergen menus, upload your brand, and publish for diners.</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            style={{ display:"inline-flex", alignItems:"center", gap:7, background:`linear-gradient(135deg,${C.orange},${C.orangeDk})`, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            <Icon name="plus" size={14} color="#fff"/> New Restaurant
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"22px 24px", display:"flex", gap:20 }}>
        {/* Sidebar */}
        <div style={{ width:220, flexShrink:0 }}>
          <div style={{ background:C.white, borderRadius:14, overflow:"hidden", border:`1px solid ${C.warm100}`, boxShadow:`0 3px 14px ${C.shadow}`, marginBottom:12 }}>
            <div style={{ padding:"11px 14px", background:C.parchment, borderBottom:`1px solid ${C.warm100}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.brownMid, letterSpacing:1, textTransform:"uppercase" }}>Your Restaurants</div>
              <span style={{ fontSize:11, background:C.orange, color:"#fff", borderRadius:99, padding:"1px 7px", fontWeight:700 }}>{restaurants.length}</span>
            </div>
            {restaurants.length === 0 && (
              <div style={{ padding:"22px 14px", textAlign:"center", color:C.muted, fontSize:13 }}>
                <Icon name="restaurant" size={26} color={C.warm200}/><br/>No restaurants yet
              </div>
            )}
            {restaurants.map(r => (
              <button key={r.id} onClick={() => setActive(r.id)}
                style={{ display:"block", width:"100%", textAlign:"left", background:active===r.id?`${C.orange}0D`:"transparent", border:"none", borderLeft:active===r.id?`3px solid ${C.orange}`:"3px solid transparent", padding:"11px 13px", cursor:"pointer", transition:"all .14s", borderBottom:`1px solid ${C.warm100}` }}>
                <div style={{ fontWeight:700, fontSize:13, color:active===r.id?C.orange:C.charcoal, marginBottom:2 }}>{r.name}</div>
                <div style={{ fontSize:11, color:C.muted }}>{r.cuisine} — {r.menu.length} dishes</div>
                <div style={{ display:"flex", gap:6, marginTop:3 }}>
                  {r.published!==false ? <span style={{ fontSize:10, color:C.green, fontWeight:700 }}>Live</span> : <span style={{ fontSize:10, color:C.muted, fontWeight:700 }}>Draft</span>}
                  {r.specialsEnabled && <span style={{ fontSize:10, color:C.gold, fontWeight:700 }}>Specials</span>}
                </div>
              </button>
            ))}
            <button onClick={() => setShowCreate(true)}
              style={{ display:"flex", width:"100%", alignItems:"center", justifyContent:"center", gap:6, background:"transparent", border:"none", padding:"11px 13px", cursor:"pointer", color:C.orange, fontWeight:700, fontSize:13 }}>
              <Icon name="plus" size={13} color={C.orange}/> Add Restaurant
            </button>
          </div>

          <div style={{ background:`${C.orange}14`, borderRadius:12, padding:"12px 14px", border:`1px solid ${C.amber}44` }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.brownMid, marginBottom:6 }}>Tips</div>
            <div style={{ fontSize:11, color:C.muted, lineHeight:1.85 }}>
              Expand dishes with the arrow icon<br/>
              Use arrows to reorder dishes<br/>
              Upload logo in Brand tab<br/>
              Enable Specials for rotating dishes<br/>
              Publish when ready
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex:1, minWidth:0 }}>
          {activeRest
            ? <MenuEditor key={activeRest.id} restaurant={activeRest} onSave={updates => onSaveMenu(activeRest.id, updates)}/>
            : (
              <div style={{ background:C.white, borderRadius:18, padding:"70px 36px", textAlign:"center", border:`2px dashed ${C.warm200}`, boxShadow:`0 3px 14px ${C.shadow}` }}>
                <Icon name="restaurant" size={48} color={C.warm200}/>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:C.orange, marginTop:16, marginBottom:10 }}>Welcome to the Portal</div>
                <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, maxWidth:360, margin:"0 auto 22px" }}>
                  Create your first restaurant, build an allergen-labeled menu, upload your brand assets, and publish for diners.
                </p>
                <button onClick={() => setShowCreate(true)} style={{ display:"inline-flex", alignItems:"center", gap:7, background:`linear-gradient(135deg,${C.orange},${C.orangeDk})`, color:"#fff", border:"none", borderRadius:10, padding:"12px 26px", fontWeight:700, fontSize:15, cursor:"pointer" }}>
                  <Icon name="plus" size={15} color="#fff"/> Create First Restaurant
                </button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════════════════ */
const LandingPage = ({ onSelect }) => {
  const [hov, setHov] = useState(null);
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(155deg,${C.charcoal} 0%,${C.brown} 55%,${C.orangeDk} 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      {[...Array(5)].map((_,i) => (
        <div key={i} style={{ position:"absolute", borderRadius:"50%", background:`radial-gradient(circle,${C.amber}12,transparent 70%)`, width:280+i*100, height:280+i*100, left:[8,62,28,72,18][i]+"%", top:[18,8,62,38,78][i]+"%", transform:"translate(-50%,-50%)", animation:`float ${4.5+i*.8}s ease-in-out ${i*.6}s infinite`, pointerEvents:"none" }}/>
      ))}

      <div style={{ textAlign:"center", marginBottom:50, position:"relative" }} className="fu">
        <div style={{ display:"inline-flex", alignItems:"center", gap:13, marginBottom:14 }}>
          <div style={{ background:`linear-gradient(135deg,${C.orange},${C.amber})`, borderRadius:17, width:58, height:58, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 8px 26px rgba(224,123,57,.4)` }}>
            <Icon name="restaurant" size={26} color="#fff" sw={1.8}/>
          </div>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, color:"#fff", lineHeight:1, fontWeight:700 }}>Restaurant</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, color:C.amber, lineHeight:1, fontStyle:"italic" }}>Legend</div>
          </div>
        </div>
        <p style={{ fontSize:16, color:"rgba(255,255,255,.7)", maxWidth:400, margin:"0 auto", lineHeight:1.7 }}>
          The allergy-aware dining platform connecting diners with safe, transparent restaurant experiences.
        </p>
      </div>

      <div style={{ display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center", position:"relative" }} className="fu fu2">
        {[
          { role:"diner",      iconName:"user",      title:"I'm a Diner",      sub:"Find allergy-safe restaurants",  desc:"Browse allergen-labeled menus, set your preferences, rate restaurants, and suggest new spots.",   cta:"Enter as Diner" },
          { role:"restaurant", iconName:"briefcase", title:"I'm a Restaurant", sub:"Manage your allergen menus",    desc:"Build your menu with full allergen labeling, upload brand assets, and generate print-ready menus.", cta:"Enter as Restaurant" },
        ].map(card => (
          <div key={card.role}
            onMouseEnter={() => setHov(card.role)} onMouseLeave={() => setHov(null)}
            onClick={() => onSelect(card.role)}
            style={{ background:"rgba(255,255,255,.08)", backdropFilter:"blur(18px)", border:`2px solid ${hov===card.role?C.amber:"rgba(255,255,255,.14)"}`, borderRadius:20, padding:"32px 28px", width:292, cursor:"pointer", textAlign:"center", transition:"all .25s ease", transform:hov===card.role?"translateY(-6px) scale(1.02)":"", boxShadow:hov===card.role?`0 28px 64px rgba(0,0,0,.4)`:`0 8px 28px rgba(0,0,0,.22)` }}>
            <div style={{ width:54, height:54, background:"rgba(255,255,255,.15)", borderRadius:15, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 15px" }}>
              <Icon name={card.iconName} size={25} color="#fff" sw={1.6}/>
            </div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:25, color:"#fff", fontWeight:700, marginBottom:4 }}>{card.title}</div>
            <div style={{ fontSize:11, color:C.amber, fontWeight:700, marginBottom:13, textTransform:"uppercase", letterSpacing:1 }}>{card.sub}</div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,.62)", lineHeight:1.65, marginBottom:22 }}>{card.desc}</p>
            <div style={{ background:card.role==="diner"?`linear-gradient(135deg,${C.orange},${C.orangeDk})`:`linear-gradient(135deg,${C.brown},${C.charcoal})`, color:"#fff", borderRadius:10, padding:"11px 20px", fontWeight:700, fontSize:14, display:"inline-flex", alignItems:"center", gap:7 }}>
              {card.cta} <Icon name="chevronRight" size={13} color="#fff"/>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:26, marginTop:50, flexWrap:"wrap", justifyContent:"center", position:"relative" }} className="fu fu3">
        {[["shield","Top 9 FDA Allergens"],["leaf","Extended Dietary Labels"],["printer","Print-Ready Menus"],["star","Safety Ratings"],["message","Suggest a Restaurant"]].map(([ico,lbl]) => (
          <div key={lbl} style={{ display:"flex", alignItems:"center", gap:7, color:"rgba(255,255,255,.55)", fontSize:12 }}>
            <Icon name={ico} size={13} color="rgba(255,255,255,.55)"/>{lbl}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{ marginTop:36, position:"relative" }} className="fu fu3">
        <a href="mailto:info@restaurantlegend.com"
          style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,255,255,.09)", border:"1.5px solid rgba(255,255,255,.2)", borderRadius:99, padding:"8px 20px", fontSize:12, fontWeight:700, color:"rgba(255,255,255,.7)", textDecoration:"none", transition:"all .2s", backdropFilter:"blur(8px)" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,.16)"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor=C.amber; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,.09)"; e.currentTarget.style.color="rgba(255,255,255,.7)"; e.currentTarget.style.borderColor="rgba(255,255,255,.2)"; }}>
          <Icon name="message" size={13} color="currentColor"/> info@restaurantlegend.com
        </a>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   NAV BAR
══════════════════════════════════════════════════════════════ */
const NavBar = ({ role, onHome }) => (
  <nav style={{ background:`linear-gradient(130deg,${C.charcoal},${C.brown})`, padding:"0 24px", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:700, boxShadow:`0 4px 20px rgba(30,20,16,.28)` }}>
    <button onClick={onHome} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", padding:"14px 0", marginRight:"auto" }}>
      <div style={{ background:`linear-gradient(135deg,${C.orange},${C.amber})`, borderRadius:9, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name="restaurant" size={17} color="#fff" sw={1.8}/>
      </div>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", color:"#fff", fontSize:18, fontWeight:700 }}>Restaurant</span>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", color:C.amber, fontSize:18, fontStyle:"italic" }}>Legend</span>
    </button>
    <div style={{ fontSize:12, fontWeight:700, color:C.amber, padding:"5px 12px", background:"rgba(245,185,68,.15)", borderRadius:99, border:`1px solid ${C.amber}40`, display:"flex", alignItems:"center", gap:5 }}>
      <Icon name={role==="diner"?"user":"briefcase"} size={12} color={C.amber}/>{role==="diner"?"Diner":"Restaurant"}
    </div>
    <a href="mailto:info@restaurantlegend.com"
      style={{ display:"inline-flex", alignItems:"center", gap:5, background:"transparent", border:`1.5px solid rgba(255,255,255,.22)`, color:"rgba(255,255,255,.65)", borderRadius:99, padding:"5px 13px", fontSize:11, fontWeight:700, textDecoration:"none", transition:"all .18s" }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.amber; e.currentTarget.style.color=C.amber; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,.22)"; e.currentTarget.style.color="rgba(255,255,255,.65)"; }}>
      <Icon name="message" size={11} color="currentColor"/> Contact
    </a>
    <button onClick={onHome} style={{ background:"transparent", border:`1.5px solid rgba(255,255,255,.22)`, color:"rgba(255,255,255,.6)", borderRadius:99, padding:"5px 13px", fontSize:11, fontWeight:700, cursor:"pointer" }}>Switch</button>
  </nav>
);

/* ══════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen]   = useState("landing");
  const [restaurants, setRestaurants] = useState(SEED);

  const handleRate = (id, r) => {
    setRestaurants(rs => rs.map(rest => rest.id!==id ? rest : {
      ...rest,
      safetyRating:  +((rest.safetyRating  * rest.reviewCount + r.safety)  / (rest.reviewCount+1)).toFixed(1),
      staffRating:   +((rest.staffRating   * rest.reviewCount + r.staff)   / (rest.reviewCount+1)).toFixed(1),
      kitchenRating: +((rest.kitchenRating * rest.reviewCount + r.kitchen) / (rest.reviewCount+1)).toFixed(1),
      reviewCount: rest.reviewCount + 1,
    }));
  };

  const handleSaveMenu = (id, updates) => {
    setRestaurants(rs => rs.map(r => r.id!==id ? r : { ...r, ...updates }));
  };

  const handleAddRestaurant = r => {
    setRestaurants(rs => [...rs, r]);
  };

  const dinerRestaurants = restaurants.filter(r => r.published !== false);

  return (
    <>
      <style>{CSS}</style>
      {screen === "landing" && <LandingPage onSelect={s => setScreen(s)}/>}
      {screen !== "landing" && (
        <>
          <NavBar role={screen} onHome={() => setScreen("landing")}/>
          {screen === "diner" && <DinerView restaurants={dinerRestaurants} onRate={handleRate}/>}
          {screen === "restaurant" && <RestaurantPortal restaurants={restaurants} onSaveMenu={handleSaveMenu} onAddRestaurant={handleAddRestaurant}/>}
        </>
      )}
    </>
  );
}
