import { useState, useCallback, useEffect } from "react";

/* ─── Responsive hook ─── */
function useWindowWidth() {
  const [w, setW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

/* ─── Types ─── */
interface GroceryItem {
  id: string;
  name: string;
  price: number;
  qty: string;
  category: string;
  saved: boolean;
}

/* ─── Data ─── */
const MEAL_PLANS = [
  {
    id: "hostel",
    title: "₹100/Day Hostel",
    budget: 100,
    color: "#FF6B3D",
    emoji: "🏠",
    meals: [
      { name: "Poha + Chai",      cost: 20, protein: 8,  emoji: "🌅" },
      { name: "Dal Rice + Sabzi", cost: 45, protein: 22, emoji: "☀️" },
      { name: "Roti + Egg Curry", cost: 35, protein: 25, emoji: "🌙" },
    ],
  },
  {
    id: "pg",
    title: "₹60/Day PG",
    budget: 60,
    color: "#F5A623",
    emoji: "🏢",
    meals: [
      { name: "Bread + Peanut Butter", cost: 15, protein: 7,  emoji: "🌅" },
      { name: "Rajma Chawal",          cost: 30, protein: 18, emoji: "☀️" },
      { name: "Dal + Roti",            cost: 15, protein: 10, emoji: "🌙" },
    ],
  },
];

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const SPEND_HISTORY = [1840,2100,1950,2300,2050,1780,2200,2400,2100,1900,2250,2180];

const CATEGORIES = [
  { name:"Grains & Rice", emoji:"🌾", amount:200, color:"#FF6B3D", pct:32 },
  { name:"Vegetables",    emoji:"🥦", amount:150, color:"#F5A623", pct:24 },
  { name:"Protein",       emoji:"🥚", amount:144, color:"#4ECDC4", pct:23 },
  { name:"Dairy",         emoji:"🥛", amount:90,  color:"#A78BFA", pct:14 },
  { name:"Misc",          emoji:"🛒", amount:50,  color:"#F472B6", pct:7  },
];

const DEFAULT_GROCERY: GroceryItem[] = [
  { id:"1", name:"Rice 2kg",    price:80,  qty:"2kg",    category:"Grains & Rice", saved:true  },
  { id:"2", name:"Dal 1kg",     price:120, qty:"1kg",    category:"Grains & Rice", saved:true  },
  { id:"3", name:"Eggs 12",     price:84,  qty:"12 pcs", category:"Protein",       saved:true  },
  { id:"4", name:"Paneer 200g", price:60,  qty:"200g",   category:"Dairy",         saved:true  },
  { id:"5", name:"Onion 1kg",   price:30,  qty:"1kg",    category:"Vegetables",    saved:false },
  { id:"6", name:"Milk 2L",     price:90,  qty:"2L",     category:"Dairy",         saved:false },
];

const genId = () => Math.random().toString(36).slice(2, 9);

/* ─── Donut Chart ─── */
function DonutChart({ data, total, size = 160 }: { data: typeof CATEGORIES; total: number; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38, stroke = size * 0.13;
  const circ = 2 * Math.PI * r;
  let offsetAcc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,.05)" strokeWidth={stroke}/>
      {data.map((d) => {
        const dash = (d.pct / 100) * circ;
        const gap  = circ - dash;
        const seg  = (
          <circle key={d.name} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offsetAcc}
            strokeLinecap="butt"
            style={{ transform:"rotate(-90deg)", transformOrigin:"center" }}
          />
        );
        offsetAcc += dash;
        return seg;
      })}
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#3D1F0A"
        fontFamily="'Playfair Display',serif" fontSize={size * 0.12} fontWeight="900">₹{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(92,61,46,.5)"
        fontFamily="'DM Sans',sans-serif" fontSize={size * 0.065} fontWeight="600">WEEKLY</text>
    </svg>
  );
}

/* ─── Sparkline ─── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 320, h = 64;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * (h - 12) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const polyPts = pts.join(" ");
  const areaPts = `0,${h} ${polyPts} ${w},${h}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ overflow:"visible", display:"block" }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill="url(#sg)"/>
      <polyline points={polyPts} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Section label ─── */
const SLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize:10, fontWeight:700, color:"rgba(92,61,46,.5)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:12 }}>{children}</div>
);

export default function BudgetPage() {
  const vw = useWindowWidth();
  const isMobile = vw < 600;
  const isTablet = vw >= 600 && vw < 900;
  const isDesktop = vw >= 900;

  const [items, setItems]               = useState<GroceryItem[]>(DEFAULT_GROCERY);
  const [newName, setNewName]           = useState("");
  const [newPrice, setNewPrice]         = useState("");
  const [newQty, setNewQty]             = useState("");
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [activeTab, setActiveTab]       = useState<"overview"|"meals"|"grocery">("overview");
  const [savedMsg, setSavedMsg]         = useState(false);
  const [editId, setEditId]             = useState<string|null>(null);
  const [editPrice, setEditPrice]       = useState("");
  const [hoveredBar, setHoveredBar]     = useState<number|null>(null);

  const totalSpend   = items.reduce((s, i) => s + i.price, 0);
  const savedItems   = items.filter(i => i.saved);
  const savedTotal   = savedItems.reduce((s, i) => s + i.price, 0);
  const plan         = MEAL_PLANS[selectedPlan];
  const planProtein  = plan.meals.reduce((s, m) => s + m.protein, 0);
  const planCost     = plan.meals.reduce((s, m) => s + m.cost, 0);
  const currentMonth = new Date().getMonth();
  const maxBar       = Math.max(...SPEND_HISTORY);

  const addItem    = useCallback(() => {
    if (!newName.trim() || !newPrice) return;
    setItems(prev => [...prev, { id:genId(), name:newName.trim(), price:Number(newPrice), qty:newQty||"1 unit", category:"Misc", saved:false }]);
    setNewName(""); setNewPrice(""); setNewQty("");
  }, [newName, newPrice, newQty]);
  const removeItem = useCallback((id: string) => setItems(prev => prev.filter(i => i.id !== id)), []);
  const toggleSave = useCallback((id: string) => setItems(prev => prev.map(i => i.id===id?{...i,saved:!i.saved}:i)), []);
  const saveList   = useCallback(() => { setItems(prev => prev.map(i=>({...i,saved:true}))); setSavedMsg(true); setTimeout(()=>setSavedMsg(false),2500); }, []);
  const startEdit  = (id: string, price: number) => { setEditId(id); setEditPrice(String(price)); };
  const commitEdit = (id: string) => { setItems(prev => prev.map(i=>i.id===id?{...i,price:Number(editPrice)||i.price}:i)); setEditId(null); };

  const pad = isMobile ? "16px 14px" : isTablet ? "20px 18px" : "24px 22px";
  const gap = isMobile ? 10 : 14;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"linear-gradient(150deg,#FFF5EE 0%,#FFEADB 50%,#FFD9C0 100%)", minHeight:"100vh", paddingBottom:80, overflowX:"hidden", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input:focus{outline:none}
        @keyframes fadeUp  {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn {from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes savedPop{0%{transform:translate(-50%,16px);opacity:0}20%{transform:translate(-50%,0);opacity:1}80%{opacity:1}100%{opacity:0}}
        @keyframes blobAnim{0%,100%{border-radius:60% 40% 55% 45%/50% 60% 40% 50%}50%{border-radius:45% 55% 60% 40%}}

        .fade-up { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }
        .blob-dec { animation: blobAnim 12s ease-in-out infinite; position:fixed; pointer-events:none; z-index:0; }

        .glass {
          background: rgba(255,255,255,.76);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,210,180,.4);
          border-radius: 18px;
          box-shadow: 0 4px 20px rgba(180,90,40,.07), 0 1px 3px rgba(180,90,40,.04);
        }

        .tab-btn {
          font-family: 'DM Sans',sans-serif; font-size: 12px; font-weight: 600;
          border-radius: 22px; border: none; cursor: pointer;
          transition: all .22s cubic-bezier(.22,1,.36,1); white-space: nowrap;
        }
        .tab-btn.on  { background:#FF6B3D; color:#fff; box-shadow:0 4px 14px rgba(255,107,61,.35); }
        .tab-btn.off { background:rgba(255,255,255,.65); color:#7A3D2A; }
        .tab-btn.off:hover { background:rgba(255,255,255,.9); transform:translateY(-1px); }

        .stat-card {
          padding: 14px 16px; border-radius: 16px;
          background: rgba(255,255,255,.72); border: 1px solid rgba(255,200,160,.35);
          display: flex; flex-direction: column; gap: 3px;
          transition: transform .25s, box-shadow .25s; min-width: 0;
        }
        .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(180,90,40,.12); }

        .txn-row {
          display:flex; align-items:center; gap:10px;
          padding:10px 13px; border-radius:12px;
          background:rgba(255,248,240,.85); border:1px solid rgba(255,200,160,.18);
          transition:all .18s; animation:slideIn .3s cubic-bezier(.22,1,.36,1) both;
        }
        .txn-row:hover { background:rgba(255,232,210,.9); border-color:rgba(255,107,61,.22); transform:translateX(2px); }

        .plan-sel {
          padding: 12px 16px; border-radius:15px; cursor:pointer;
          border: 2px solid transparent; background:rgba(255,255,255,.7);
          display:flex; align-items:center; gap:11px;
          transition:all .25s cubic-bezier(.22,1,.36,1);
        }
        .plan-sel.on  { border-color:#FF6B3D; background:#fff; box-shadow:0 6px 22px rgba(255,107,61,.16); }
        .plan-sel.off:hover { background:#fff; transform:translateY(-1px); }

        .meal-row-item {
          display:flex; justify-content:space-between; align-items:center;
          padding:10px 13px; border-radius:11px;
          background:rgba(255,248,242,.88); border:1px solid rgba(255,200,160,.22); margin-bottom:7px;
          flex-wrap: wrap; gap: 6px;
        }

        .tag { display:inline-flex; align-items:center; padding:3px 8px; border-radius:8px; font-size:11px; font-weight:700; }

        .add-input {
          background:rgba(255,255,255,.85); border:1.5px solid rgba(212,168,138,.38);
          border-radius:10px; padding:9px 12px; font-family:'DM Sans',sans-serif;
          font-size:13px; color:#3D1F0A; transition:border .18s; min-width:0;
        }
        .add-input:focus { border-color:#FF6B3D; background:#fff; }
        .add-input::placeholder { color:rgba(92,61,46,.38); }

        .check-btn {
          width:24px; height:24px; border-radius:50%;
          border:1.5px dashed rgba(196,82,46,.32);
          background:none; cursor:pointer; display:flex; align-items:center;
          justify-content:center; font-size:11px; transition:all .18s; flex-shrink:0; color:transparent;
        }
        .check-btn.on { background:rgba(46,125,82,.1); border:1.5px solid #2E7D52; color:#2E7D52; }

        .del-btn {
          background:none; border:none; cursor:pointer; width:26px; height:26px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          color:#C4522E; font-size:12px; transition:all .18s; flex-shrink:0;
        }
        .del-btn:hover { background:rgba(196,82,46,.1); transform:scale(1.18); }

        .edit-input {
          background:#fff; border:1.5px solid #FF6B3D; border-radius:8px;
          padding:3px 7px; font-family:'DM Sans',sans-serif; font-size:13px; color:#3D1F0A; width:62px;
        }

        .prog-track { height:6px; background:rgba(0,0,0,.055); border-radius:6px; overflow:hidden; }
        .prog-fill   { height:100%; border-radius:6px; transition:width 1s cubic-bezier(.22,1,.36,1); }

        .saved-toast {
          position:fixed; bottom:28px; left:50%;
          background:linear-gradient(135deg,#2E7D52,#1a5c38);
          color:#fff; padding:10px 22px; border-radius:24px;
          font-size:13px; font-weight:600;
          box-shadow:0 6px 18px rgba(46,125,82,.35); z-index:9999;
          animation:savedPop 2.5s cubic-bezier(.22,1,.36,1) both; pointer-events:none;
          white-space: nowrap;
        }

        .green-btn {
          background:linear-gradient(135deg,#2E7D52,#1a5c38); color:#fff;
          border:none; border-radius:10px; font-family:'DM Sans',sans-serif;
          font-size:12px; font-weight:600; cursor:pointer;
          box-shadow:0 4px 12px rgba(46,125,82,.26); transition:all .22s; white-space:nowrap;
        }
        .green-btn:hover { transform:translateY(-2px); box-shadow:0 7px 18px rgba(46,125,82,.35); }

        .orange-btn {
          background:linear-gradient(135deg,#FF6B3D,#C4522E); color:#fff;
          border:none; border-radius:10px; font-family:'DM Sans',sans-serif;
          font-size:12px; font-weight:600; cursor:pointer;
          box-shadow:0 4px 12px rgba(255,107,61,.26); transition:all .22s; white-space:nowrap;
        }
        .orange-btn:hover { transform:translateY(-2px); box-shadow:0 7px 18px rgba(255,107,61,.36); }
      `}</style>

      {/* Decorative blobs */}
      <div className="blob-dec" style={{ width:isMobile?240:420, height:isMobile?240:420, top:-80, right:-60, background:"rgba(255,107,61,.06)" }}/>
      <div className="blob-dec" style={{ width:isMobile?160:260, height:isMobile?160:260, bottom:-40, left:-40, background:"rgba(245,166,35,.05)", animationDelay:"3s" }}/>

      <div style={{ position:"relative", zIndex:1, maxWidth:1000, margin:"0 auto", padding: isMobile ? "24px 14px 0" : isTablet ? "30px 20px 0" : "36px 24px 0" }}>

        {/* ══ HEADER ══ */}
        <div className="fade-up" style={{ display:"flex", flexDirection: isDesktop ? "row" : "column", justifyContent:"space-between", alignItems: isDesktop ? "flex-start" : "stretch", gap:16, marginBottom: isMobile ? 20 : 26 }}>

          {/* Title */}
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,107,61,.1)", border:"1px solid rgba(255,107,61,.2)", borderRadius:22, padding:"5px 13px", marginBottom:10 }}>
              <span style={{ fontSize:12 }}>💸</span>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#FF6B3D" }}>Budget Dashboard</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 32 : isTablet ? 38 : 44, fontWeight:900, color:"#3D1F0A", letterSpacing:"-1.5px", lineHeight:1.08 }}>
              Eat Smart,<br/><span style={{ color:"#FF6B3D", fontStyle:"italic" }}>Spend Less</span>
            </h1>
            <p style={{ fontSize:12, color:"rgba(92,61,46,.6)", marginTop:6 }}>Hostel &amp; PG student budget tracker</p>
          </div>

          {/* Plan switcher */}
          <div style={{ display:"flex", flexDirection: isMobile ? "row" : "column", gap:8, minWidth: isDesktop ? 210 : 0 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(92,61,46,.4)", marginBottom:isMobile?0:2, display: isMobile ? "none" : "block" }}>Switch Plan</div>
            {MEAL_PLANS.map((p,i) => (
              <div key={p.id} className={`plan-sel ${selectedPlan===i?"on":"off"}`} style={{ flex: isMobile ? 1 : undefined }} onClick={()=>setSelectedPlan(i)}>
                <div style={{ width:32, height:32, borderRadius:10, background:`${p.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{p.emoji}</div>
                <div style={{ minWidth:0, flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#3D1F0A", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title}</div>
                  <div style={{ fontSize:10, color:p.color, fontWeight:600 }}>₹{p.budget}/day</div>
                </div>
                {selectedPlan===i && <div style={{ width:7, height:7, borderRadius:"50%", background:"#FF6B3D", flexShrink:0 }}/>}
              </div>
            ))}
          </div>
        </div>

        {/* ══ STAT CARDS ══ */}
        <div className="fade-up" style={{ display:"grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap, marginBottom:gap+4, animationDelay:".07s" }}>
          {[
            { emoji:"🛒", val:`₹${totalSpend}`,     sub:`₹${(totalSpend/7).toFixed(0)}/day`,  label:"Weekly Groceries", color:"#FF6B3D" },
            { emoji:"📅", val:`₹${planCost*30}`,    sub:"monthly estimate",                    label:"Monthly Est.",     color:"#F5A623" },
            { emoji:"💪", val:`${planProtein}g`,     sub:`${plan.title}`,                       label:"Daily Protein",    color:"#4ECDC4" },
            { emoji:"✅", val:`${savedItems.length}/${items.length}`, sub:`₹${savedTotal} confirmed`, label:"Saved Items", color:"#A78BFA" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize:18, marginBottom:1 }}>{s.emoji}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 22 : 26, fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:10, fontWeight:600, color:"rgba(92,61,46,.55)", marginTop:1 }}>{s.label}</div>
              <div style={{ fontSize:9, color:"rgba(92,61,46,.38)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ══ TABS ══ */}
        <div className="fade-up" style={{ display:"flex", gap:8, marginBottom:gap+4, animationDelay:".11s", flexWrap:"wrap" }}>
          {([
            { k:"overview" as const, l: isMobile ? "📊 Overview" : "📊 Overview" },
            { k:"meals"    as const, l: isMobile ? "🍽️ Meals"   : "🍽️ Meal Plans" },
            { k:"grocery"  as const, l: isMobile ? "🛒 Grocery"  : "🛒 Grocery List" },
          ]).map(t => (
            <button key={t.k}
              className={`tab-btn ${activeTab===t.k?"on":"off"}`}
              style={{ padding: isMobile ? "8px 16px" : "9px 20px", flex: isMobile ? 1 : undefined }}
              onClick={()=>setActiveTab(t.k)}
            >{t.l}</button>
          ))}
        </div>

        {/* ═══════════════════════════════════
             OVERVIEW TAB
        ═══════════════════════════════════ */}
        {activeTab==="overview" && (
          <div className="fade-up" style={{ animationDelay:".14s" }}>

            {/* Donut + Trend row */}
            <div style={{ display:"grid", gridTemplateColumns: isDesktop ? "200px 1fr" : "1fr", gap, marginBottom:gap }}>

              {/* Donut card */}
              <div className="glass" style={{ padding:pad }}>
                <SLabel>Spend Mix</SLabel>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
                  <DonutChart data={CATEGORIES} total={totalSpend} size={isMobile ? 140 : 160}/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {CATEGORIES.map(c => (
                    <div key={c.name} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:c.color, flexShrink:0 }}/>
                      <span style={{ fontSize:11, color:"#5C3D2E", flex:1, fontWeight:500 }}>{c.emoji} {c.name}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:c.color }}>₹{c.amount}</span>
                      <span style={{ fontSize:9, color:"rgba(92,61,46,.4)", minWidth:24, textAlign:"right" }}>{c.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column — sparkline + category bars */}
              <div style={{ display:"flex", flexDirection:"column", gap }}>

                {/* Sparkline */}
                <div className="glass" style={{ padding:pad }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:10, flexWrap:"wrap" }}>
                    <div>
                      <SLabel>Monthly Spend Trend — 2026</SLabel>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 26 : 30, fontWeight:900, color:"#3D1F0A", lineHeight:1 }}>
                        ₹{SPEND_HISTORY[currentMonth].toLocaleString()}
                      </div>
                      <div style={{ fontSize:11, color:"rgba(92,61,46,.45)", marginTop:3 }}>{MONTHS_SHORT[currentMonth]} — current month</div>
                    </div>
                    <div style={{ background:"rgba(78,205,196,.1)", border:"1px solid rgba(78,205,196,.22)", borderRadius:10, padding:"6px 12px", textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:900, color:"#2E9E96", fontFamily:"'Playfair Display',serif" }}>
                        {SPEND_HISTORY[currentMonth] < (SPEND_HISTORY[currentMonth-1]||SPEND_HISTORY[0]) ? "↓" : "↑"}
                        {Math.abs(Math.round(((SPEND_HISTORY[currentMonth]-(SPEND_HISTORY[currentMonth>0?currentMonth-1:0]))/SPEND_HISTORY[currentMonth>0?currentMonth-1:0])*100))}%
                      </div>
                      <div style={{ fontSize:9, color:"#2E9E96", fontWeight:600 }}>vs last mo.</div>
                    </div>
                  </div>
                  <Sparkline data={SPEND_HISTORY} color="#FF6B3D"/>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                    {MONTHS_SHORT.map((m,i) => (
                      <span key={m} style={{ fontSize: isMobile ? 7 : 9, color:i===currentMonth?"#FF6B3D":"rgba(92,61,46,.3)", fontWeight:i===currentMonth?700:400 }}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* Category progress bars */}
                <div className="glass" style={{ padding:pad }}>
                  <SLabel>Category Budgets</SLabel>
                  {CATEGORIES.map(c => (
                    <div key={c.name} style={{ marginBottom:11 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <span style={{ fontSize:13 }}>{c.emoji}</span>
                          <span style={{ fontSize:12, fontWeight:600, color:"#3D1F0A" }}>{c.name}</span>
                        </div>
                        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                          <span style={{ fontSize:12, fontWeight:700, color:c.color }}>₹{c.amount}</span>
                          <span style={{ fontSize:9, color:"rgba(92,61,46,.4)" }}>{c.pct}%</span>
                        </div>
                      </div>
                      <div className="prog-track">
                        <div className="prog-fill" style={{ width:`${c.pct}%`, background:c.color }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar chart */}
            <div className="glass" style={{ padding:pad }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                <div>
                  <SLabel>12-Month Grocery Spend</SLabel>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 18 : 22, fontWeight:900, color:"#3D1F0A" }}>
                    Avg ₹{Math.round(SPEND_HISTORY.reduce((a,b)=>a+b,0)/12).toLocaleString()}/month
                  </div>
                </div>
                {!isMobile && (
                  <div style={{ display:"flex", gap:18 }}>
                    {[{l:"Best",v:`₹${Math.min(...SPEND_HISTORY)}`,c:"#4ECDC4"},{l:"Peak",v:`₹${Math.max(...SPEND_HISTORY)}`,c:"#FF6B3D"}].map(s=>(
                      <div key={s.l} style={{ textAlign:"right" }}>
                        <div style={{ fontSize:9, color:"rgba(92,61,46,.45)", fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>{s.l}</div>
                        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:s.c }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display:"flex", alignItems:"flex-end", gap: isMobile ? 4 : 7, height: isMobile ? 80 : 110 }}>
                {SPEND_HISTORY.map((v,i)=>{
                  const pct=(v/maxBar)*100;
                  const isCur=i===currentMonth;
                  const isHov=hoveredBar===i;
                  return (
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer" }}
                      onMouseEnter={()=>setHoveredBar(i)} onMouseLeave={()=>setHoveredBar(null)}>
                      {isHov && (
                        <div style={{ fontSize:8, fontWeight:700, color:"#FF6B3D", whiteSpace:"nowrap", background:"rgba(255,255,255,.92)", padding:"2px 4px", borderRadius:4, boxShadow:"0 2px 8px rgba(0,0,0,.09)" }}>₹{v}</div>
                      )}
                      <div style={{ width:"100%", borderRadius:"4px 4px 0 0",
                        background:isCur?"linear-gradient(to top,#FF6B3D,#FFB08A)":isHov?"linear-gradient(to top,#F5A623,#FFD88A)":"rgba(255,107,61,.2)",
                        height:`${pct}%`, transition:"all .25s", minHeight:3 }}/>
                      <div style={{ fontSize: isMobile ? 7 : 8, color:isCur?"#FF6B3D":"rgba(92,61,46,.38)", fontWeight:isCur?700:400 }}>{MONTHS_SHORT[i]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════
             MEAL PLANS TAB
        ═══════════════════════════════════ */}
        {activeTab==="meals" && (
          <div className="fade-up" style={{ animationDelay:".14s" }}>
            {/* Plan cards */}
            <div style={{ display:"grid", gridTemplateColumns: isDesktop ? "repeat(2,1fr)" : "1fr", gap, marginBottom:gap }}>
              {MEAL_PLANS.map((p,i)=>{
                const daily=p.meals.reduce((s,m)=>s+m.cost,0);
                const prot=p.meals.reduce((s,m)=>s+m.protein,0);
                const isOn=selectedPlan===i;
                return (
                  <div key={p.id} className="glass"
                    style={{ padding:pad, cursor:"pointer", border:isOn?`2px solid ${p.color}`:"1px solid rgba(255,200,160,.4)", transition:"all .28s" }}
                    onClick={()=>setSelectedPlan(i)}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:40, height:40, borderRadius:11, background:`${p.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{p.emoji}</div>
                        <div>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:"#3D1F0A" }}>{p.title}</div>
                          <div style={{ fontSize:11, color:p.color, fontWeight:600, marginTop:1 }}>₹{p.budget} daily budget</div>
                        </div>
                      </div>
                      {isOn && <div style={{ background:p.color, color:"#fff", borderRadius:12, padding:"3px 10px", fontSize:9, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", flexShrink:0 }}>Active ✓</div>}
                    </div>
                    {p.meals.map(m=>(
                      <div key={m.name} className="meal-row-item">
                        <span style={{ fontSize:15, marginRight:4 }}>{m.emoji}</span>
                        <span style={{ flex:1, fontSize:13, fontWeight:500, color:"#5C3D2E", minWidth:0 }}>{m.name}</span>
                        <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                          <span className="tag" style={{ background:`${p.color}15`, color:p.color }}>₹{m.cost}</span>
                          <span className="tag" style={{ background:"rgba(78,205,196,.1)", color:"#2E9E96" }}>{m.protein}g</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:14, paddingTop:14, borderTop:`1.5px dashed ${p.color}28` }}>
                      {[{l:"Protein",v:`${prot}g`},{l:"Daily",v:`₹${daily}`},{l:"Monthly",v:`₹${daily*30}`}].map(s=>(
                        <div key={s.l} style={{ textAlign:"center", background:`${p.color}08`, borderRadius:10, padding:"9px 4px" }}>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:p.color }}>{s.v}</div>
                          <div style={{ fontSize:9, fontWeight:600, color:"rgba(92,61,46,.5)", textTransform:"uppercase", letterSpacing:.4, marginTop:1 }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cost breakdown */}
            <div className="glass" style={{ padding:pad }}>
              <SLabel>Cost Distribution</SLabel>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#3D1F0A", marginBottom:16 }}>{plan.title} — ₹{plan.budget}/day</div>
              {plan.meals.map((m)=>{
                const pct=Math.round((m.cost/plan.budget)*100);
                return (
                  <div key={m.name} style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:4 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:"#5C3D2E" }}>{m.emoji} {m.name}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:plan.color }}>₹{m.cost} · {m.protein}g · {pct}%</span>
                    </div>
                    <div className="prog-track">
                      <div className="prog-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${plan.color},${plan.color}88)` }}/>
                    </div>
                  </div>
                );
              })}
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap:10, marginTop:18, padding:"14px", background:`${plan.color}07`, borderRadius:12, border:`1px solid ${plan.color}18` }}>
                {[
                  { l:"Monthly Cost",      v:`₹${planCost*30}`,                              c:"#3D1F0A" },
                  { l:"Saved vs Eating Out",v:`₹${(5000-planCost*30).toLocaleString()}`,     c:"#2E7D52" },
                  { l:"Protein per ₹",     v:`${(planProtein/planCost).toFixed(2)}g`,         c:plan.color },
                ].map(s=>(
                  <div key={s.l} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:9, color:"rgba(92,61,46,.5)", textTransform:"uppercase", letterSpacing:.4, fontWeight:600 }}>{s.l}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 20 : 24, fontWeight:900, color:s.c, marginTop:2 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════
             GROCERY TAB
        ═══════════════════════════════════ */}
        {activeTab==="grocery" && (
          <div className="fade-up" style={{ animationDelay:".14s" }}>
            <div style={{ display:"grid", gridTemplateColumns: isDesktop ? "1fr 290px" : "1fr", gap }}>

              {/* Main list */}
              <div className="glass" style={{ padding:pad }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:"#3D1F0A" }}>🛒 Grocery List</div>
                    <div style={{ fontSize:11, color:"rgba(92,61,46,.5)", marginTop:2 }}>{items.length} items · ₹{totalSpend} total</div>
                  </div>
                  <button className="green-btn" style={{ padding:"9px 16px" }} onClick={saveList}>💾 Save All</button>
                </div>

                {/* Add row — stacks on mobile */}
                <div style={{ display:"flex", flexDirection: isMobile ? "column" : "row", gap:8, marginBottom:14, padding:12, background:"rgba(255,107,61,.045)", borderRadius:12, border:"1.5px dashed rgba(255,107,61,.2)" }}>
                  <input className="add-input" style={{ flex:1 }} placeholder="Item name…" value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()}/>
                  <div style={{ display:"flex", gap:8 }}>
                    <input className="add-input" style={{ width: isMobile ? "50%" : 74 }} placeholder="Qty" value={newQty} onChange={e=>setNewQty(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()}/>
                    <input className="add-input" style={{ width: isMobile ? "50%" : 74 }} placeholder="₹" type="number" value={newPrice} onChange={e=>setNewPrice(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()}/>
                  </div>
                  <button className="orange-btn" style={{ padding:"9px 16px", width: isMobile ? "100%" : undefined }} onClick={addItem}>+ Add Item</button>
                </div>

                {/* Items */}
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {items.length===0 && (
                    <div style={{ textAlign:"center", padding:"30px 0", color:"rgba(92,61,46,.38)", fontSize:13 }}>
                      <div style={{ fontSize:28, marginBottom:8 }}>🛒</div>List is empty — add items above!
                    </div>
                  )}
                  {items.map((item,idx)=>(
                    <div key={item.id} className="txn-row" style={{ animationDelay:`${idx*.04}s` }}>
                      <button className={`check-btn ${item.saved?"on":""}`} onClick={()=>toggleSave(item.id)}>✓</button>
                      <div style={{ width:28, height:28, borderRadius:8, background:"rgba(255,107,61,.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>
                        {CATEGORIES.find(c=>c.name===item.category)?.emoji||"🛒"}
                      </div>
                      <span style={{ flex:1, fontSize:13, fontWeight:500, color:"#3D1F0A", minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</span>
                      {!isMobile && <span style={{ fontSize:10, color:"rgba(92,61,46,.4)", minWidth:36, flexShrink:0 }}>{item.qty}</span>}
                      {editId===item.id
                        ? <input className="edit-input" value={editPrice} autoFocus onChange={e=>setEditPrice(e.target.value)} onBlur={()=>commitEdit(item.id)} onKeyDown={e=>e.key==="Enter"&&commitEdit(item.id)}/>
                        : <span onClick={()=>startEdit(item.id,item.price)} style={{ fontSize:13, fontWeight:700, color:"#FF6B3D", cursor:"pointer", minWidth:40, textAlign:"right", flexShrink:0 }} title="Tap to edit">₹{item.price}</span>
                      }
                      <button className="del-btn" onClick={()=>removeItem(item.id)}>✕</button>
                    </div>
                  ))}
                </div>

                {/* Footer totals */}
                {items.length>0 && (
                  <div style={{ marginTop:14, paddingTop:12, borderTop:"1px dashed rgba(255,107,61,.18)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                    <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                      {[{l:"Total",v:`₹${totalSpend}`,c:"#3D1F0A"},{l:"Confirmed",v:`₹${savedTotal}`,c:"#2E7D52"},{l:"Per Day",v:`₹${(totalSpend/30).toFixed(0)}`,c:"#FF6B3D"}].map(s=>(
                        <div key={s.l}>
                          <div style={{ fontSize:9, textTransform:"uppercase", letterSpacing:.7, color:"rgba(92,61,46,.45)", fontWeight:600 }}>{s.l}</div>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:s.c }}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>setItems([])} style={{ background:"none", border:"1px solid rgba(196,82,46,.18)", color:"rgba(196,82,46,.55)", borderRadius:9, padding:"5px 12px", fontSize:11, fontWeight:600, cursor:"pointer" }}>🗑️ Clear</button>
                  </div>
                )}
              </div>

              {/* Sidebar — shows below list on mobile/tablet */}
              <div style={{ display:"flex", flexDirection: isMobile ? "column" : "column", gap }}>

                {/* Category spend */}
                <div className="glass" style={{ padding:pad }}>
                  <SLabel>Spend by Category</SLabel>
                  {CATEGORIES.map(c=>{
                    const catAmt=items.filter(i=>i.category===c.name).reduce((s,i)=>s+i.price,0);
                    const pct=totalSpend>0?Math.round((catAmt/totalSpend)*100):0;
                    if(!catAmt) return null;
                    return (
                      <div key={c.name} style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:12, color:"#5C3D2E", display:"flex", alignItems:"center", gap:5 }}><span>{c.emoji}</span>{c.name}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:c.color }}>₹{catAmt}</span>
                        </div>
                        <div className="prog-track">
                          <div className="prog-fill" style={{ width:`${pct}%`, background:c.color }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Budget health */}
                <div className="glass" style={{ padding:pad }}>
                  <SLabel>Budget Health</SLabel>
                  {[
                    { l:"Weekly Spend", cur:totalSpend,                              max:700,         color:"#FF6B3D" },
                    { l:"Daily Avg",    cur:Number((totalSpend/7).toFixed(0)),        max:plan.budget, color:"#F5A623" },
                    { l:"Monthly Est.", cur:planCost*30,                              max:4000,        color:"#A78BFA" },
                  ].map(b=>{
                    const pct=Math.min(Math.round((b.cur/b.max)*100),100);
                    const ok=pct<80;
                    return (
                      <div key={b.l} style={{ marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:600, color:"#5C3D2E" }}>{b.l}</span>
                          <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                            <span style={{ fontSize:12, fontWeight:700, color:b.color }}>₹{b.cur}</span>
                            <span style={{ fontSize:9, color:ok?"#2E7D52":"#C4522E", fontWeight:700, background:ok?"rgba(46,125,82,.08)":"rgba(196,82,46,.08)", padding:"1px 5px", borderRadius:4 }}>{ok?"✓":"⚠"}</span>
                          </div>
                        </div>
                        <div style={{ height:6, background:"rgba(0,0,0,.055)", borderRadius:6, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:ok?b.color:"#C4522E", borderRadius:6, transition:"width 1s cubic-bezier(.22,1,.36,1)" }}/>
                        </div>
                        <div style={{ fontSize:9, color:"rgba(92,61,46,.36)", marginTop:2 }}>of ₹{b.max} limit</div>
                      </div>
                    );
                  })}
                </div>

                {/* Tip */}
                <div style={{ background:"rgba(78,205,196,.07)", border:"1px solid rgba(78,205,196,.18)", borderRadius:14, padding:"13px 15px" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#2E9E96", marginBottom:4 }}>💡 Pro Tip</div>
                  <div style={{ fontSize:11, color:"rgba(26,92,56,.65)", lineHeight:1.6 }}>Tap any price to edit it inline. ✓ marks bought items. "Save All" locks your week's list.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {savedMsg && <div className="saved-toast">✅ List saved!</div>}
    </div>
  );
}