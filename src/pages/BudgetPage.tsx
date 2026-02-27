import { useState, useCallback, useEffect } from "react";

/* ─── Types ─── */
type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

interface DayPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  kcal: number;
  protein: number;
  cost: number;
}

interface Ingredient {
  id: string;
  name: string;
  price: number;
  qty: string;
  category: string;
  icon: string;
  mealTag: string;
  bought: boolean;
}

interface MonthData {
  spend: number;
  meal: number;
  grocery: number;
  saved: number;
}

interface Swap {
  bad: string;
  good: string;
  save: number;
  kcalSave: number;
  why: string;
}

interface AiTip {
  icon: string;
  title: string;
  desc: string;
  tag: string;
  color: string;
}

/* ─── Responsive hook ─── */
function useWindowWidth(): number {
  const [w, setW] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

/* ═══════════════════════════════════════════
   DATA — pulled from MealPlans page
═══════════════════════════════════════════ */

const weeklyPlan: Record<DayKey, DayPlan> = {
  Mon: { breakfast:"Poha + Chai", lunch:"Rajma Chawal", dinner:"Dal Tadka + Roti", kcal:1820, protein:58, cost:65 },
  Tue: { breakfast:"Idli Sambar", lunch:"Chole Bhature", dinner:"Paneer Bhurji + Roti", kcal:1950, protein:72, cost:80 },
  Wed: { breakfast:"Moong Dal Chilla", lunch:"Egg Curry + Rice", dinner:"Khichdi", kcal:1760, protein:68, cost:70 },
  Thu: { breakfast:"Upma", lunch:"Soya Pulao", dinner:"Palak Dal + Roti", kcal:1800, protein:64, cost:68 },
  Fri: { breakfast:"Besan Cheela", lunch:"Rajma Chawal", dinner:"Egg Bhurji + Roti", kcal:1870, protein:70, cost:72 },
  Sat: { breakfast:"Poha + Boiled Eggs", lunch:"Chole Rice", dinner:"Paneer Sabzi + Roti", kcal:1920, protein:74, cost:85 },
  Sun: { breakfast:"Oats with Nuts", lunch:"Dal Makhani + Rice", dinner:"Mixed Veg Curry", kcal:1780, protein:60, cost:75 },
};

const weekDays: DayKey[] = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const weeklyMealCost = weekDays.reduce((s, d) => s + weeklyPlan[d].cost, 0);
const monthlyMealCost = Math.round(weeklyMealCost * 4.33);

const INGREDIENTS: Ingredient[] = [
  { id:"r1",  name:"Rice (5kg)",         price:200, qty:"5kg",    category:"Grains",     icon:"🌾", mealTag:"Dal Rice · Chole Rice · Khichdi",       bought:true  },
  { id:"r2",  name:"Atta / Flour (3kg)", price:120, qty:"3kg",    category:"Grains",     icon:"🌾", mealTag:"Roti · Dal Tadka + Roti",               bought:true  },
  { id:"r3",  name:"Poha (1kg)",         price:45,  qty:"1kg",    category:"Grains",     icon:"🌾", mealTag:"Poha + Chai · Poha + Eggs",             bought:false },
  { id:"r4",  name:"Oats (500g)",        price:90,  qty:"500g",   category:"Grains",     icon:"🌾", mealTag:"Oats with Nuts",                        bought:false },
  { id:"r5",  name:"Rajma (500g)",       price:80,  qty:"500g",   category:"Lentils",    icon:"🫘", mealTag:"Rajma Chawal (Mon, Fri)",               bought:true  },
  { id:"r6",  name:"Chana Dal (500g)",   price:70,  qty:"500g",   category:"Lentils",    icon:"🫘", mealTag:"Chole Bhature · Chole Rice",            bought:true  },
  { id:"r7",  name:"Moong Dal (500g)",   price:80,  qty:"500g",   category:"Lentils",    icon:"🫘", mealTag:"Moong Dal Chilla · Palak Dal",          bought:false },
  { id:"r8",  name:"Eggs (18 pcs)",      price:126, qty:"18 pcs", category:"Protein",    icon:"🥚", mealTag:"Egg Curry · Egg Bhurji + Roti · Eggs",  bought:true  },
  { id:"r9",  name:"Paneer (300g)",      price:90,  qty:"300g",   category:"Protein",    icon:"🧀", mealTag:"Paneer Bhurji · Paneer Sabzi",          bought:false },
  { id:"r10", name:"Soya Chunks (200g)", price:40,  qty:"200g",   category:"Protein",    icon:"🌱", mealTag:"Soya Pulao",                            bought:false },
  { id:"r11", name:"Onion (2kg)",        price:60,  qty:"2kg",    category:"Vegetables", icon:"🧅", mealTag:"All sabzis",                            bought:true  },
  { id:"r12", name:"Tomato (1kg)",       price:40,  qty:"1kg",    category:"Vegetables", icon:"🍅", mealTag:"Curries · Sabzis",                      bought:true  },
  { id:"r13", name:"Spinach (500g)",     price:25,  qty:"500g",   category:"Vegetables", icon:"🥬", mealTag:"Palak Dal",                             bought:false },
  { id:"r14", name:"Mixed Veg (500g)",   price:50,  qty:"500g",   category:"Vegetables", icon:"🥦", mealTag:"Mixed Veg Curry",                       bought:false },
  { id:"r15", name:"Milk (3L)",          price:135, qty:"3L",     category:"Dairy",      icon:"🥛", mealTag:"Chai · Oats",                           bought:true  },
  { id:"r16", name:"Curd (500g)",        price:40,  qty:"500g",   category:"Dairy",      icon:"🥛", mealTag:"Side with meals",                       bought:false },
  { id:"r17", name:"Oil (1L)",           price:130, qty:"1L",     category:"Staples",    icon:"🫙", mealTag:"All cooking",                           bought:true  },
  { id:"r18", name:"Spices Mix",         price:80,  qty:"set",    category:"Staples",    icon:"🌶️", mealTag:"All meals",                            bought:true  },
  { id:"r19", name:"Tea Leaves (100g)",  price:50,  qty:"100g",   category:"Beverages",  icon:"🍵", mealTag:"Poha + Chai",                           bought:false },
  { id:"r20", name:"Nuts Mix (200g)",    price:120, qty:"200g",   category:"Snacks",     icon:"🥜", mealTag:"Oats with Nuts",                        bought:false },
];

const CAT_COLORS: Record<string, string> = {
  Grains:     "#FF6B3D",
  Lentils:    "#F5A623",
  Protein:    "#4ECDC4",
  Vegetables: "#2ECC71",
  Dairy:      "#A78BFA",
  Staples:    "#F472B6",
  Beverages:  "#FB923C",
  Snacks:     "#FBBF24",
};

const SMART_SWAPS: Swap[] = [
  { bad:"Burger 🍔 ₹200",   good:"Rajma Chawal 🫘 ₹40",     save:160, kcalSave:170, why:"Same protein, 4× cheaper" },
  { bad:"Sandwich ₹80",      good:"Moong Dal Chilla 🥞 ₹25", save:55,  kcalSave:80,  why:"Higher protein, homemade" },
  { bad:"Cold Drink 🥤 ₹50", good:"Nimbu Pani 🍋 ₹10",       save:40,  kcalSave:180, why:"Zero sugar, zero waste" },
  { bad:"Samosa × 2 ₹40",   good:"Boiled Eggs × 2 🥚 ₹20",  save:20,  kcalSave:120, why:"2× protein for half price" },
  { bad:"Chips Packet ₹30",  good:"Roasted Chana 🌾 ₹10",    save:20,  kcalSave:150, why:"More filling, less junk" },
  { bad:"Paneer Roll ₹120",  good:"Egg Bhurji Roti 🥚 ₹40",  save:80,  kcalSave:60,  why:"Same vibe, ₹80 saved" },
];

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MONTHLY_DATA: MonthData[] = [
  { spend:2800, meal:1900, grocery:900,  saved:500 },
  { spend:3100, meal:2100, grocery:1000, saved:200 },
  { spend:2750, meal:1850, grocery:900,  saved:550 },
  { spend:3300, meal:2200, grocery:1100, saved:0   },
  { spend:2950, meal:1950, grocery:1000, saved:350 },
  { spend:2600, meal:1700, grocery:900,  saved:700 },
  { spend:3200, meal:2100, grocery:1100, saved:100 },
  { spend:3500, meal:2300, grocery:1200, saved:0   },
  { spend:3000, meal:2000, grocery:1000, saved:300 },
  { spend:2700, meal:1750, grocery:950,  saved:600 },
  { spend:3100, meal:2050, grocery:1050, saved:200 },
  { spend:monthlyMealCost + 900, meal:monthlyMealCost, grocery:900, saved:400 },
];

const AI_TIPS: AiTip[] = [
  { icon:"🧠", title:"Cook in Bulk on Sundays",        desc:"Prep dal, rice & sabzi for Mon–Wed. Saves ₹150+/week and 45 mins daily.",                   tag:"Time Save",  color:"#4ECDC4" },
  { icon:"📦", title:"Buy Grains Monthly",              desc:"Buying rice & dal in 5kg lots vs 1kg saves ~22% — that's ₹90/month.",                       tag:"₹90 saved",  color:"#2ECC71" },
  { icon:"🔁", title:"Repeat Rajma Twice a Week",      desc:"Cheapest protein source (₹2.2/g). Already in your Mon/Fri plan — extend to lunches.",        tag:"Best Value", color:"#FF6B3D" },
  { icon:"🥚", title:"Eggs = Emergency Protein",       desc:"Always have 12 eggs at home. Fastest meal, cheapest protein, never wasteful.",                tag:"Essential",  color:"#F5A623" },
  { icon:"🛒", title:"Shop on Wednesday",              desc:"Local mandis restock mid-week — veg prices dip 10–15% vs weekend buying.",                   tag:"Price Hack", color:"#A78BFA" },
  { icon:"❄️", title:"Batch Cook & Freeze Roti Dough", desc:"Prep 2-day dough lots. Saves gas, effort, and impulse ordering at ₹80+/time.",              tag:"Saves ₹240", color:"#F472B6" },
];

const genId = (): string => Math.random().toString(36).slice(2, 9);

/* ─── Donut Chart ─── */
function DonutChart({ data, total, size = 160 }: { data: Ingredient[]; total: number; size?: number }) {
  const cx = size/2, cy = size/2, r = size*0.38, stroke = size*0.13;
  const circ = 2*Math.PI*r;
  let acc = 0;
  const cats = Object.entries(
    data.reduce<Record<string, number>>((m, i) => {
      m[i.category] = (m[i.category] || 0) + i.price;
      return m;
    }, {})
  );
  const catTotal = cats.reduce((s, [, v]) => s + v, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,.06)" strokeWidth={stroke}/>
      {cats.map(([cat, amt]) => {
        const pct = amt/catTotal;
        const dash = pct*circ;
        const gap = circ - dash;
        const seg = (
          <circle key={cat} cx={cx} cy={cy} r={r} fill="none"
            stroke={CAT_COLORS[cat]||"#ccc"} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-acc}
            strokeLinecap="butt"
            style={{ transform:"rotate(-90deg)", transformOrigin:"center" }}
          />
        );
        acc += dash;
        return seg;
      })}
      <text x={cx} y={cy-10} textAnchor="middle" fill="#2D1206"
        fontFamily="'Playfair Display',serif" fontSize={size*0.115} fontWeight="900">₹{total}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="rgba(92,61,46,.5)"
        fontFamily="'DM Sans',sans-serif" fontSize={size*0.07} fontWeight="600">MONTHLY</text>
    </svg>
  );
}

/* ─── Sparkline ─── */
function Sparkline({ data, color, height = 64 }: { data: number[]; color: string; height?: number }) {
  const w = 340, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i/(data.length-1))*w;
    const y = h-((v-min)/(max-min||1))*(h-14)-6;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{overflow:"visible",display:"block"}}>
      <defs>
        <linearGradient id={`sg-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill={`url(#sg-${color.slice(1)})`}/>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Section Label ─── */
const SLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize:9, fontWeight:800, color:"rgba(92,61,46,.45)", textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>{children}</div>
);

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function EnhancedBudgetPage() {
  const vw        = useWindowWidth();
  const isMobile  = vw < 600;
  const isTablet  = vw >= 600 && vw < 900;
  const isDesktop = vw >= 900;

  const [items, setItems]                   = useState<Ingredient[]>(INGREDIENTS);
  const [activeTab, setActiveTab]           = useState<string>("overview");
  const [newName, setNewName]               = useState<string>("");
  const [newPrice, setNewPrice]             = useState<string>("");
  const [newQty, setNewQty]                 = useState<string>("");
  const [newCat, setNewCat]                 = useState<string>("Staples");
  const [editId, setEditId]                 = useState<string | null>(null);
  const [editPrice, setEditPrice]           = useState<string>("");
  const [hoveredBar, setHoveredBar]         = useState<number | null>(null);
  const [savedMsg, setSavedMsg]             = useState<boolean>(false);
  const [expandSwap, setExpandSwap]         = useState<number | null>(null);
  const [dismissedTips, setDismissedTips]   = useState<number[]>([]);
  const [catFilter, setCatFilter]           = useState<string>("All");

  useEffect(() => { setTimeout(() => {/* aiAnimated removed — unused */}, 400); }, []);

  const totalGrocery = items.reduce((s, i) => s + i.price, 0);
  const boughtTotal  = items.filter(i => i.bought).reduce((s, i) => s + i.price, 0);
  const totalMonth   = totalGrocery + monthlyMealCost;
  const currentMonth = new Date().getMonth();
  const avgSpend     = Math.round(MONTHLY_DATA.reduce((s, d) => s + d.spend, 0) / 12);
  const totalSavings = MONTHLY_DATA.reduce((s, d) => s + d.saved, 0);

  const addItem = useCallback(() => {
    if (!newName.trim() || !newPrice) return;
    setItems(prev => [...prev, {
      id: genId(), name: newName.trim(), price: Number(newPrice),
      qty: newQty || "1 unit", category: newCat, icon: "🛒",
      mealTag: "Custom item", bought: false,
    }]);
    setNewName(""); setNewPrice(""); setNewQty("");
  }, [newName, newPrice, newQty, newCat]);

  const removeItem   = useCallback((id: string) => setItems(prev => prev.filter(i => i.id !== id)), []);
  const toggleBought = useCallback((id: string) => setItems(prev => prev.map(i => i.id === id ? {...i, bought: !i.bought} : i)), []);
  const saveAll      = useCallback(() => {
    setItems(prev => prev.map(i => ({...i, bought: true})));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  }, []);

  const startEdit  = (id: string, price: number) => { setEditId(id); setEditPrice(String(price)); };
  const commitEdit = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? {...i, price: Number(editPrice) || i.price} : i));
    setEditId(null);
  };

  const categories    = ["All", ...Object.keys(CAT_COLORS)];
  const filteredItems = catFilter === "All" ? items : items.filter(i => i.category === catFilter);

  const pad = isMobile ? "16px 14px" : "22px 20px";
  const gap = isMobile ? 10 : 14;

  const catBreakdown: [string, number][] = Object.entries(
    items.reduce<Record<string, number>>((m, i) => {
      m[i.category] = (m[i.category] || 0) + i.price;
      return m;
    }, {})
  ).sort(([, a], [, b]) => b - a);

  return (
    <div style={{
      fontFamily:"'DM Sans',sans-serif",
      background:"linear-gradient(145deg,#FFF5EE 0%,#FFEADB 40%,#FFF0F8 70%,#E8F4FF 100%)",
      minHeight:"100vh", paddingBottom:80, overflowX:"hidden", position:"relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input:focus{outline:none}
        select:focus{outline:none}

        @keyframes fadeUp   {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn  {from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blobAnim {0%,100%{border-radius:60% 40% 55% 45%/50% 60% 40% 50%}50%{border-radius:45% 55% 60% 40%}}
        @keyframes savedPop {0%{transform:translate(-50%,16px);opacity:0}15%{transform:translate(-50%,0);opacity:1}85%{opacity:1}100%{opacity:0}}
        @keyframes pulse    {0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes shimmer  {0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes tipSlide {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

        .fade-up  { animation:fadeUp  .5s cubic-bezier(.22,1,.36,1) both; }
        .slide-in { animation:slideIn .35s cubic-bezier(.22,1,.36,1) both; }
        .tip-slide{ animation:tipSlide .4s cubic-bezier(.22,1,.36,1) both; }

        .blob { animation:blobAnim 14s ease-in-out infinite; position:fixed; pointer-events:none; z-index:0; }

        .glass {
          background:rgba(255,255,255,.78);
          backdrop-filter:blur(22px);
          -webkit-backdrop-filter:blur(22px);
          border:1px solid rgba(255,200,160,.35);
          border-radius:20px;
          box-shadow:0 4px 24px rgba(180,90,40,.07),0 1px 4px rgba(180,90,40,.04);
        }

        .tab-btn {
          font-family:'DM Sans',sans-serif; font-size:12px; font-weight:700;
          border-radius:24px; border:none; cursor:pointer; letter-spacing:.3px;
          transition:all .22s cubic-bezier(.22,1,.36,1); white-space:nowrap;
        }
        .tab-btn.on  { background:#FF6B3D; color:#fff; box-shadow:0 5px 16px rgba(255,107,61,.38); }
        .tab-btn.off { background:rgba(255,255,255,.65); color:#7A3D2A; }
        .tab-btn.off:hover { background:rgba(255,255,255,.9); transform:translateY(-1px); }

        .stat-card {
          padding:14px 15px; border-radius:18px;
          background:rgba(255,255,255,.72); border:1px solid rgba(255,200,160,.3);
          display:flex; flex-direction:column; gap:3px;
          transition:transform .25s,box-shadow .25s; min-width:0; position:relative; overflow:hidden;
        }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(180,90,40,.14); }

        .item-row {
          display:flex; align-items:center; gap:9px;
          padding:9px 12px; border-radius:14px;
          background:rgba(255,248,240,.88); border:1px solid rgba(255,200,160,.15);
          transition:all .18s; animation:slideIn .3s cubic-bezier(.22,1,.36,1) both;
        }
        .item-row:hover { background:rgba(255,237,220,.95); border-color:rgba(255,107,61,.2); transform:translateX(3px); }
        .item-row.done  { opacity:.7; background:rgba(240,255,245,.8); border-color:rgba(46,204,113,.15); }

        .check-btn {
          width:26px; height:26px; border-radius:50%; border:1.5px dashed rgba(196,82,46,.3);
          background:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
          font-size:12px; transition:all .2s; flex-shrink:0; color:transparent;
        }
        .check-btn.on { background:rgba(46,204,113,.12); border:1.5px solid #2ECC71; color:#2ECC71; }

        .del-btn {
          background:none; border:none; cursor:pointer; width:24px; height:24px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          color:#C4522E; font-size:11px; transition:all .18s; flex-shrink:0;
        }
        .del-btn:hover { background:rgba(196,82,46,.1); transform:scale(1.2); }

        .add-input {
          background:rgba(255,255,255,.88); border:1.5px solid rgba(212,168,138,.35);
          border-radius:11px; padding:9px 12px; font-family:'DM Sans',sans-serif;
          font-size:13px; color:#3D1F0A; transition:border .18s; min-width:0;
        }
        .add-input:focus { border-color:#FF6B3D; background:#fff; }
        .add-input::placeholder { color:rgba(92,61,46,.35); }

        .edit-input {
          background:#fff; border:1.5px solid #FF6B3D; border-radius:8px;
          padding:3px 7px; font-family:'DM Sans',sans-serif; font-size:13px; color:#3D1F0A; width:64px;
        }

        .green-btn {
          background:linear-gradient(135deg,#2ECC71,#1a9e52); color:#fff;
          border:none; border-radius:11px; font-family:'DM Sans',sans-serif;
          font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap;
          box-shadow:0 4px 14px rgba(46,204,113,.28); transition:all .22s;
        }
        .green-btn:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(46,204,113,.38); }

        .orange-btn {
          background:linear-gradient(135deg,#FF6B3D,#C4522E); color:#fff;
          border:none; border-radius:11px; font-family:'DM Sans',sans-serif;
          font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap;
          box-shadow:0 4px 14px rgba(255,107,61,.28); transition:all .22s;
        }
        .orange-btn:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(255,107,61,.38); }

        .ai-card {
          border-radius:18px; padding:16px; cursor:pointer;
          transition:all .28s cubic-bezier(.22,1,.36,1);
          border:1px solid rgba(255,200,160,.25);
          position:relative; overflow:hidden;
        }
        .ai-card:hover { transform:translateY(-4px); box-shadow:0 14px 36px rgba(180,90,40,.16); }

        .swap-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:11px 14px; border-radius:14px;
          background:rgba(255,255,255,.62); border:1px solid rgba(255,140,80,.14);
          cursor:pointer; transition:all .22s;
        }
        .swap-row:hover { background:rgba(255,255,255,.92); border-color:rgba(255,92,26,.28); }

        .cat-pill {
          padding:5px 12px; border-radius:16px; font-size:11px; font-weight:700;
          border:none; cursor:pointer; transition:all .2s; white-space:nowrap;
        }
        .cat-pill.on  { background:#FF6B3D; color:#fff; box-shadow:0 3px 10px rgba(255,107,61,.3); }
        .cat-pill.off { background:rgba(255,255,255,.6); color:#7A3D2A; }
        .cat-pill.off:hover { background:rgba(255,255,255,.9); }

        .prog-track { height:6px; background:rgba(0,0,0,.055); border-radius:6px; overflow:hidden; }
        .prog-fill  { height:100%; border-radius:6px; transition:width 1s cubic-bezier(.22,1,.36,1); }

        .saved-toast {
          position:fixed; bottom:28px; left:50%;
          background:linear-gradient(135deg,#2ECC71,#1a9e52);
          color:#fff; padding:10px 22px; border-radius:24px; font-size:13px; font-weight:700;
          box-shadow:0 6px 20px rgba(46,204,113,.4); z-index:9999;
          animation:savedPop 2.5s cubic-bezier(.22,1,.36,1) both; pointer-events:none; white-space:nowrap;
        }

        .ai-shimmer {
          background:linear-gradient(90deg,rgba(255,107,61,.08) 25%,rgba(255,107,61,.18) 50%,rgba(255,107,61,.08) 75%);
          background-size:200% 100%;
          animation:shimmer 2s ease-in-out infinite;
          border-radius:8px;
        }

        .meal-badge {
          display:inline-flex; align-items:center; gap:3px;
          padding:2px 8px; border-radius:8px;
          font-size:9.5px; font-weight:700; letter-spacing:.2px;
          background:rgba(255,107,61,.1); color:#C4522E;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px;
        }

        .saving-badge {
          position:absolute; top:10px; right:10px;
          background:rgba(46,204,113,.12); color:#16A34A;
          font-size:10px; font-weight:800; padding:3px 8px; border-radius:10px;
          border:1px solid rgba(46,204,113,.2);
        }
      `}</style>

      {/* Blobs */}
      <div className="blob" style={{ width:isMobile?200:380, height:isMobile?200:380, top:-70, right:-50, background:"rgba(255,107,61,.055)" }}/>
      <div className="blob" style={{ width:isMobile?140:240, height:isMobile?140:240, bottom:-40, left:-40, background:"rgba(78,205,196,.045)", animationDelay:"4s" }}/>
      <div className="blob" style={{ width:isMobile?100:200, height:isMobile?100:200, top:"40%", right:-60, background:"rgba(167,139,250,.035)", animationDelay:"7s" }}/>

      <div style={{ position:"relative", zIndex:1, maxWidth:1040, margin:"0 auto", padding:isMobile?"22px 12px 0":"30px 22px 0" }}>

        {/* ══ HEADER ══ */}
        <div className="fade-up" style={{ marginBottom:isMobile?18:24 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,107,61,.1)", border:"1px solid rgba(255,107,61,.2)", borderRadius:24, padding:"5px 14px", marginBottom:12 }}>
            <span style={{ fontSize:12 }}>🤖</span>
            <span style={{ fontSize:9, fontWeight:800, letterSpacing:2.5, textTransform:"uppercase", color:"#FF6B3D" }}>AI Budget Intelligence</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?30:isTablet?38:46, fontWeight:900, color:"#2D1206", letterSpacing:"-2px", lineHeight:1.06 }}>
            Smart Spend,<br/>
            <span style={{ color:"#FF6B3D", fontStyle:"italic" }}>Smarter Save</span>
          </h1>
          <p style={{ fontSize:12.5, color:"rgba(92,61,46,.6)", marginTop:7, lineHeight:1.6 }}>
            Groceries auto-synced from your Meal Plans · AI-powered monthly budget · Smart swap suggestions
          </p>
        </div>

        {/* ══ STAT CARDS ══ */}
        <div className="fade-up" style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap, marginBottom:gap+2, animationDelay:".07s" }}>
          {[
            { emoji:"🍽️", val:`₹${monthlyMealCost}`, sub:`₹${Math.round(monthlyMealCost/30)}/day from meals`, label:"Monthly Meal Cost", color:"#FF6B3D", glow:"rgba(255,107,61,.1)"  },
            { emoji:"🛒",  val:`₹${totalGrocery}`,    sub:`${items.length} ingredients tracked`,               label:"Grocery Budget",   color:"#F5A623", glow:"rgba(245,166,35,.1)"  },
            { emoji:"💰",  val:`₹${totalSavings}`,    sub:"saved this year vs eating out",                     label:"Total Saved",       color:"#2ECC71", glow:"rgba(46,204,113,.1)"  },
            { emoji:"📅",  val:`₹${totalMonth}`,      sub:`avg ₹${avgSpend} last 12mo`,                        label:"Full Monthly Est.", color:"#A78BFA", glow:"rgba(167,139,250,.1)" },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ background:`linear-gradient(135deg,rgba(255,255,255,.85),${s.glow})` }}>
              <div style={{ fontSize:20, marginBottom:2 }}>{s.emoji}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?22:28, fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(92,61,46,.55)", marginTop:2 }}>{s.label}</div>
              <div style={{ fontSize:9, color:"rgba(92,61,46,.38)", marginTop:1 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ══ TABS ══ */}
        <div className="fade-up" style={{ display:"flex", gap:8, marginBottom:gap+4, animationDelay:".11s", flexWrap:"wrap" }}>
          {[
            { k:"overview", l:isMobile?"📊 Overview":"📊 Overview" },
            { k:"grocery",  l:isMobile?"🛒 Grocery":"🛒 Ingredient List" },
            { k:"ai",       l:isMobile?"🤖 AI Tips":"🤖 AI Suggestions" },
            { k:"swaps",    l:isMobile?"⚡ Swaps":"⚡ Smart Swaps" },
          ].map(t => (
            <button key={t.k} className={`tab-btn ${activeTab===t.k?"on":"off"}`}
              style={{ padding:isMobile?"8px 14px":"9px 20px", flex:isMobile?1:undefined }}
              onClick={() => setActiveTab(t.k)}>{t.l}
            </button>
          ))}
        </div>

        {/* ═══════════════════ OVERVIEW ═══════════════════ */}
        {activeTab==="overview" && (
          <div className="fade-up" style={{ animationDelay:".13s" }}>
            <div style={{ display:"grid", gridTemplateColumns:isDesktop?"220px 1fr":"1fr", gap, marginBottom:gap }}>

              {/* Donut */}
              <div className="glass" style={{ padding:pad }}>
                <SLabel>Monthly Spend Mix</SLabel>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
                  <DonutChart data={items} total={totalMonth} size={isMobile?140:160}/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {catBreakdown.map(([cat, amt]) => (
                    <div key={cat} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:CAT_COLORS[cat]||"#ccc", flexShrink:0 }}/>
                      <span style={{ fontSize:11, color:"#5C3D2E", flex:1, fontWeight:500 }}>{cat}</span>
                      <span style={{ fontSize:11, fontWeight:800, color:CAT_COLORS[cat]||"#ccc" }}>₹{amt}</span>
                    </div>
                  ))}
                  <div style={{ borderTop:"1px dashed rgba(255,107,61,.18)", paddingTop:8, marginTop:2 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:11, color:"#5C3D2E", fontWeight:600 }}>🍽️ Meal cost</span>
                      <span style={{ fontSize:11, fontWeight:800, color:"#FF6B3D" }}>₹{monthlyMealCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right col */}
              <div style={{ display:"flex", flexDirection:"column", gap }}>
                {/* Sparkline */}
                <div className="glass" style={{ padding:pad }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:10 }}>
                    <div>
                      <SLabel>12-Month Total Spend</SLabel>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?24:30, fontWeight:900, color:"#2D1206", lineHeight:1 }}>
                        ₹{MONTHLY_DATA[currentMonth].spend.toLocaleString()}
                      </div>
                      <div style={{ fontSize:11, color:"rgba(92,61,46,.45)", marginTop:3 }}>{MONTHS_SHORT[currentMonth]} — current month</div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <div style={{ background:"rgba(255,107,61,.08)", border:"1px solid rgba(255,107,61,.18)", borderRadius:11, padding:"6px 12px", textAlign:"center" }}>
                        <div style={{ fontSize:16, fontWeight:900, color:"#FF6B3D", fontFamily:"'Playfair Display',serif" }}>₹{MONTHLY_DATA[currentMonth].meal}</div>
                        <div style={{ fontSize:9, color:"rgba(92,61,46,.5)", fontWeight:700 }}>meals</div>
                      </div>
                      <div style={{ background:"rgba(46,204,113,.08)", border:"1px solid rgba(46,204,113,.18)", borderRadius:11, padding:"6px 12px", textAlign:"center" }}>
                        <div style={{ fontSize:16, fontWeight:900, color:"#2ECC71", fontFamily:"'Playfair Display',serif" }}>₹{MONTHLY_DATA[currentMonth].saved}</div>
                        <div style={{ fontSize:9, color:"rgba(46,125,82,.55)", fontWeight:700 }}>saved</div>
                      </div>
                    </div>
                  </div>
                  <Sparkline data={MONTHLY_DATA.map(d => d.spend)} color="#FF6B3D"/>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                    {MONTHS_SHORT.map((m, i) => (
                      <span key={m} style={{ fontSize:isMobile?7:9, color:i===currentMonth?"#FF6B3D":"rgba(92,61,46,.3)", fontWeight:i===currentMonth?800:400 }}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* Bar chart */}
                <div className="glass" style={{ padding:pad }}>
                  <SLabel>Spending vs Savings — 12 Months</SLabel>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:isMobile?3:5, height:isMobile?70:96 }}>
                    {MONTHLY_DATA.map((d, i) => {
                      const maxS   = Math.max(...MONTHLY_DATA.map(x => x.spend));
                      const spendH = (d.spend/maxS)*100;
                      const saveH  = (d.saved/maxS)*100;
                      const isCur  = i===currentMonth;
                      const isHov  = hoveredBar===i;
                      return (
                        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", position:"relative" }}
                          onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                          {isHov && (
                            <div style={{ position:"absolute", top:-36, left:"50%", transform:"translateX(-50%)", fontSize:8.5, fontWeight:800, color:"#2D1206", whiteSpace:"nowrap", background:"rgba(255,255,255,.95)", padding:"3px 6px", borderRadius:6, boxShadow:"0 3px 10px rgba(0,0,0,.1)", zIndex:10 }}>
                              ₹{d.spend} | save ₹{d.saved}
                            </div>
                          )}
                          <div style={{ width:"100%", display:"flex", gap:1.5, alignItems:"flex-end", height:"100%" }}>
                            <div style={{ flex:1, height:`${spendH}%`, background:isCur?"linear-gradient(to top,#FF6B3D,#FFB08A)":isHov?"rgba(255,107,61,.5)":"rgba(255,107,61,.2)", borderRadius:"3px 3px 0 0", minHeight:3, transition:"all .25s" }}/>
                            <div style={{ flex:1, height:`${saveH}%`, background:d.saved>0?"linear-gradient(to top,#2ECC71,#6DF0A0)":"transparent", borderRadius:"3px 3px 0 0", minHeight:d.saved>0?3:0, transition:"all .25s" }}/>
                          </div>
                          <div style={{ fontSize:isMobile?6.5:8, color:isCur?"#FF6B3D":"rgba(92,61,46,.35)", fontWeight:isCur?800:400 }}>{MONTHS_SHORT[i]}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display:"flex", gap:14, marginTop:10, flexWrap:"wrap" }}>
                    {[{c:"#FF6B3D",l:"Monthly Spend"},{c:"#2ECC71",l:"Savings"}].map(x => (
                      <div key={x.l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <div style={{ width:8, height:8, borderRadius:2, background:x.c }}/>
                        <span style={{ fontSize:9.5, color:"rgba(92,61,46,.55)", fontWeight:600 }}>{x.l}</span>
                      </div>
                    ))}
                    <span style={{ fontSize:9.5, color:"rgba(92,61,46,.45)", marginLeft:"auto" }}>Year total saved: <strong style={{ color:"#2ECC71" }}>₹{totalSavings.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly meal grid */}
            <div className="glass" style={{ padding:pad, marginBottom:gap }}>
              <SLabel>This Week's Meal Budget (from Meal Plan)</SLabel>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(7,1fr)", gap:8 }}>
                {weekDays.map(d => {
                  const p = weeklyPlan[d];
                  return (
                    <div key={d} style={{ borderRadius:14, padding:"10px 8px", background:"rgba(255,107,61,.05)", border:"1px solid rgba(255,107,61,.12)", textAlign:"center" }}>
                      <div style={{ fontSize:10, fontWeight:800, color:"#FF6B3D", letterSpacing:.5, marginBottom:4 }}>{d}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:"#2D1206" }}>₹{p.cost}</div>
                      <div style={{ fontSize:8, color:"rgba(92,61,46,.45)", marginTop:2 }}>{p.protein}g protein</div>
                      <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:2 }}>
                        {([p.breakfast, p.lunch, p.dinner] as string[]).map((m, i) => (
                          <div key={i} style={{ fontSize:8, background:(["rgba(255,200,100,.12)","rgba(255,150,80,.12)","rgba(150,100,255,.12)"] as string[])[i], borderRadius:5, padding:"2px 4px", color:"#5C3D2E", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:14, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                  {[
                    { l:"Weekly Total",  v:`₹${weeklyMealCost}`,                                                                                  c:"#FF6B3D" },
                    { l:"Monthly Est.",  v:`₹${monthlyMealCost}`,                                                                                  c:"#F5A623" },
                    { l:"Avg Protein",   v:`${Math.round(weekDays.reduce((s,d)=>s+weeklyPlan[d].protein,0)/7)}g/day`,                             c:"#4ECDC4" },
                    { l:"vs Eating Out", v:`Save ₹${(5000-monthlyMealCost).toLocaleString()}/mo`,                                                  c:"#2ECC71" },
                  ].map(s => (
                    <div key={s.l}>
                      <div style={{ fontSize:9, textTransform:"uppercase", letterSpacing:.7, color:"rgba(92,61,46,.45)", fontWeight:700 }}>{s.l}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category progress */}
            <div className="glass" style={{ padding:pad }}>
              <SLabel>Grocery Category Budgets</SLabel>
              {catBreakdown.map(([cat, amt]) => {
                const pct = Math.min(Math.round((amt/totalGrocery)*100), 100);
                return (
                  <div key={cat} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:"#3D1F0A" }}>{cat}</span>
                      <div style={{ display:"flex", gap:8 }}>
                        <span style={{ fontSize:12, fontWeight:800, color:CAT_COLORS[cat]||"#ccc" }}>₹{amt}</span>
                        <span style={{ fontSize:9, color:"rgba(92,61,46,.4)" }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="prog-track">
                      <div className="prog-fill" style={{ width:`${pct}%`, background:CAT_COLORS[cat]||"#ccc" }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════ GROCERY ═══════════════════ */}
        {activeTab==="grocery" && (
          <div className="fade-up" style={{ animationDelay:".13s" }}>
            <div style={{ display:"grid", gridTemplateColumns:isDesktop?"1fr 280px":"1fr", gap }}>
              <div className="glass" style={{ padding:pad }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:"#2D1206" }}>🛒 Ingredients from Meal Plans</div>
                    <div style={{ fontSize:11, color:"rgba(92,61,46,.5)", marginTop:2 }}>{items.length} items · ₹{totalGrocery} groceries + ₹{monthlyMealCost} meals</div>
                  </div>
                  <button className="green-btn" style={{ padding:"9px 16px" }} onClick={saveAll}>✅ Mark All Bought</button>
                </div>

                {/* Category filter */}
                <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6, marginBottom:12 }}>
                  {categories.map(c => (
                    <button key={c} className={`cat-pill ${catFilter===c?"on":"off"}`} onClick={() => setCatFilter(c)}>{c}</button>
                  ))}
                </div>

                {/* Add item */}
                <div style={{ display:"flex", flexDirection:isMobile?"column":"row", gap:7, marginBottom:14, padding:12, background:"rgba(255,107,61,.04)", borderRadius:13, border:"1.5px dashed rgba(255,107,61,.18)" }}>
                  <input className="add-input" style={{ flex:1 }} placeholder="Ingredient name…" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key==="Enter" && addItem()}/>
                  <div style={{ display:"flex", gap:7 }}>
                    <input className="add-input" style={{ width:isMobile?"50%":68 }} placeholder="Qty" value={newQty} onChange={e => setNewQty(e.target.value)} onKeyDown={e => e.key==="Enter" && addItem()}/>
                    <input className="add-input" style={{ width:isMobile?"50%":70 }} placeholder="₹" type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} onKeyDown={e => e.key==="Enter" && addItem()}/>
                  </div>
                  <div style={{ display:"flex", gap:7 }}>
                    <select className="add-input" style={{ flex:1 }} value={newCat} onChange={e => setNewCat(e.target.value)}>
                      {Object.keys(CAT_COLORS).map(c => <option key={c}>{c}</option>)}
                    </select>
                    <button className="orange-btn" style={{ padding:"9px 14px" }} onClick={addItem}>+ Add</button>
                  </div>
                </div>

                {/* Items list */}
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {filteredItems.length===0 && (
                    <div style={{ textAlign:"center", padding:"30px 0", color:"rgba(92,61,46,.38)", fontSize:13 }}>
                      <div style={{ fontSize:28, marginBottom:8 }}>🛒</div>No items in this category
                    </div>
                  )}
                  {filteredItems.map((item, idx) => (
                    <div key={item.id} className={`item-row ${item.bought?"done":""}`} style={{ animationDelay:`${idx*.03}s` }}>
                      <button className={`check-btn ${item.bought?"on":""}`} onClick={() => toggleBought(item.id)}>✓</button>
                      <div style={{ width:30, height:30, borderRadius:9, background:`${CAT_COLORS[item.category]||"#FF6B3D"}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{item.icon}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"#2D1206", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textDecoration:item.bought?"line-through":"none" }}>{item.name}</div>
                        {!isMobile && <div className="meal-badge" title={item.mealTag}>🍽️ {item.mealTag}</div>}
                      </div>
                      <span style={{ fontSize:9.5, color:CAT_COLORS[item.category]||"#ccc", fontWeight:700, background:`${CAT_COLORS[item.category]||"#ccc"}14`, padding:"2px 7px", borderRadius:8, flexShrink:0 }}>{item.qty}</span>
                      {editId===item.id
                        ? <input className="edit-input" value={editPrice} autoFocus onChange={e => setEditPrice(e.target.value)} onBlur={() => commitEdit(item.id)} onKeyDown={e => e.key==="Enter" && commitEdit(item.id)}/>
                        : <span onClick={() => startEdit(item.id, item.price)} style={{ fontSize:13, fontWeight:800, color:"#FF6B3D", cursor:"pointer", minWidth:40, textAlign:"right", flexShrink:0 }} title="Tap to edit">₹{item.price}</span>
                      }
                      <button className="del-btn" onClick={() => removeItem(item.id)}>✕</button>
                    </div>
                  ))}
                </div>

                {items.length>0 && (
                  <div style={{ marginTop:14, paddingTop:12, borderTop:"1px dashed rgba(255,107,61,.16)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                    <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                      {[
                        { l:"Grocery",    v:`₹${totalGrocery}`,    c:"#3D1F0A" },
                        { l:"Meals",      v:`₹${monthlyMealCost}`, c:"#FF6B3D" },
                        { l:"Grand Total",v:`₹${totalMonth}`,      c:"#A78BFA" },
                        { l:"Bought",     v:`₹${boughtTotal}`,     c:"#2ECC71" },
                      ].map(s => (
                        <div key={s.l}>
                          <div style={{ fontSize:8.5, textTransform:"uppercase", letterSpacing:.7, color:"rgba(92,61,46,.45)", fontWeight:700 }}>{s.l}</div>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:s.c }}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setItems([])} style={{ background:"none", border:"1px solid rgba(196,82,46,.18)", color:"rgba(196,82,46,.5)", borderRadius:9, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>🗑️ Clear</button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ display:"flex", flexDirection:"column", gap }}>
                <div className="glass" style={{ padding:pad }}>
                  <SLabel>Category Spend</SLabel>
                  {catBreakdown.map(([cat, amt]) => {
                    const pct = totalGrocery>0 ? Math.round((amt/totalGrocery)*100) : 0;
                    return (
                      <div key={cat} style={{ marginBottom:9 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:12, color:"#5C3D2E", fontWeight:600 }}>{cat}</span>
                          <span style={{ fontSize:12, fontWeight:800, color:CAT_COLORS[cat]||"#ccc" }}>₹{amt}</span>
                        </div>
                        <div className="prog-track">
                          <div className="prog-fill" style={{ width:`${pct}%`, background:CAT_COLORS[cat]||"#ccc" }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="glass" style={{ padding:pad }}>
                  <SLabel>Budget Health</SLabel>
                  {[
                    { l:"Monthly Groceries", v:totalGrocery,    max:1500, c:"#FF6B3D" },
                    { l:"Meal Budget",       v:monthlyMealCost, max:2500, c:"#F5A623" },
                    { l:"Grand Total",       v:totalMonth,      max:4000, c:"#A78BFA" },
                  ].map(b => {
                    const pct = Math.min(Math.round((b.v/b.max)*100), 100);
                    const ok  = pct<80;
                    return (
                      <div key={b.l} style={{ marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:600, color:"#5C3D2E" }}>{b.l}</span>
                          <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                            <span style={{ fontSize:12, fontWeight:800, color:b.c }}>₹{b.v}</span>
                            <span style={{ fontSize:9, color:ok?"#2ECC71":"#C4522E", fontWeight:800, background:ok?"rgba(46,204,113,.09)":"rgba(196,82,46,.09)", padding:"1px 5px", borderRadius:4 }}>{ok?"✓":"⚠"}</span>
                          </div>
                        </div>
                        <div style={{ height:6, background:"rgba(0,0,0,.05)", borderRadius:6, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:ok?b.c:"#C4522E", borderRadius:6, transition:"width 1s cubic-bezier(.22,1,.36,1)" }}/>
                        </div>
                        <div style={{ fontSize:9, color:"rgba(92,61,46,.36)", marginTop:2 }}>of ₹{b.max} limit</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ AI SUGGESTIONS ═══════════════════ */}
        {activeTab==="ai" && (
          <div className="fade-up" style={{ animationDelay:".13s" }}>
            <div style={{ background:"linear-gradient(135deg,#FF6B3D,#C4522E)", borderRadius:20, padding:isMobile?"18px 16px":"22px 24px", marginBottom:gap, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-20, right:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,.07)" }}/>
              <div style={{ position:"absolute", bottom:-30, right:60, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,.05)" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:"rgba(255,255,255,.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🤖</div>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, fontWeight:900, color:"#fff", lineHeight:1.1 }}>AI Budget Assistant</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.75)", marginTop:2 }}>Personalized to your meal plan & spending habits</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                {[
                  { l:"Monthly Budget", v:`₹${totalMonth}`,                                           sub:"current estimate" },
                  { l:"Could Save",     v:`₹${Math.round(totalMonth*0.18)}`,                          sub:"with AI tips"    },
                  { l:"Best Month",     v:`₹${Math.min(...MONTHLY_DATA.map(d => d.spend))}`,          sub:"lowest spend"    },
                ].map(s => (
                  <div key={s.l} style={{ background:"rgba(255,255,255,.15)", borderRadius:12, padding:"10px 8px", textAlign:"center" }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?16:20, fontWeight:900, color:"#fff" }}>{s.v}</div>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,.75)", fontWeight:700, textTransform:"uppercase", letterSpacing:.4, marginTop:2 }}>{s.l}</div>
                    <div style={{ fontSize:8.5, color:"rgba(255,255,255,.55)", marginTop:1 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":isTablet?"1fr 1fr":"repeat(3,1fr)", gap, marginBottom:gap }}>
              {AI_TIPS.filter((_, i) => !dismissedTips.includes(i)).map((tip, i) => (
                <div key={tip.title} className="ai-card tip-slide" style={{ background:`linear-gradient(135deg,rgba(255,255,255,.9),${tip.color}09)`, animationDelay:`${i*.08}s` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`${tip.color}15`, border:`1.5px solid ${tip.color}28`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{tip.icon}</div>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      <span style={{ fontSize:9.5, fontWeight:800, color:tip.color, background:`${tip.color}12`, padding:"2px 8px", borderRadius:8 }}>{tip.tag}</span>
                      <button onClick={() => setDismissedTips(p => [...p, i])} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(92,61,46,.35)", fontSize:13, lineHeight:1 }}>×</button>
                    </div>
                  </div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:14, fontWeight:700, color:"#2D1206", marginBottom:6, lineHeight:1.3 }}>{tip.title}</div>
                  <div style={{ fontSize:11.5, color:"rgba(92,61,46,.65)", lineHeight:1.65 }}>{tip.desc}</div>
                </div>
              ))}
              {dismissedTips.length===AI_TIPS.length && (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"30px 0" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>✅</div>
                  <div style={{ fontSize:14, color:"rgba(92,61,46,.5)" }}>You've reviewed all tips!</div>
                  <button className="orange-btn" style={{ marginTop:12, padding:"8px 18px" }} onClick={() => setDismissedTips([])}>Show Again</button>
                </div>
              )}
            </div>

            <div className="glass" style={{ padding:pad, marginBottom:gap }}>
              <SLabel>If You Follow All Tips — Monthly Projection</SLabel>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:10 }}>
                {[
                  { l:"Current Spend",   v:`₹${totalMonth}`,                    c:"#FF6B3D", icon:"📊" },
                  { l:"Potential Spend", v:`₹${Math.round(totalMonth*0.82)}`,    c:"#F5A623", icon:"🎯" },
                  { l:"Monthly Savings", v:`₹${Math.round(totalMonth*0.18)}`,    c:"#2ECC71", icon:"💰" },
                  { l:"Annual Savings",  v:`₹${Math.round(totalMonth*0.18*12)}`, c:"#A78BFA", icon:"🚀" },
                ].map(s => (
                  <div key={s.l} style={{ background:`${s.c}09`, border:`1px solid ${s.c}18`, borderRadius:14, padding:"14px 12px", textAlign:"center" }}>
                    <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?20:24, fontWeight:900, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:9.5, fontWeight:700, color:"rgba(92,61,46,.5)", textTransform:"uppercase", letterSpacing:.4, marginTop:3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14, padding:"12px 14px", background:"rgba(46,204,113,.06)", border:"1px solid rgba(46,204,113,.14)", borderRadius:13 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#2ECC71", marginBottom:4 }}>💡 AI Insight</div>
                <div style={{ fontSize:11.5, color:"rgba(26,80,50,.7)", lineHeight:1.65 }}>
                  Based on your current meal plan (₹{monthlyMealCost}/month on meals) and grocery spending (₹{totalGrocery}/month),
                  bulk buying grains + Sunday meal prep could save you up to ₹{Math.round(totalMonth*0.18).toLocaleString()} per month.
                  That's ₹{Math.round(totalMonth*0.18*12).toLocaleString()} a year — enough for a trip home! 🏠
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding:pad }}>
              <SLabel>Cheapest High-Protein Sources (₹ per gram protein)</SLabel>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:10 }}>
                {[
                  { name:"Rajma (cooked)", pg:2.2, color:"#FF6B3D", icon:"🫘", note:"Also in your Mon & Fri plan" },
                  { name:"Eggs",           pg:2.8, color:"#F5A623", icon:"🥚", note:"Already in your grocery list" },
                  { name:"Moong Dal",      pg:3.1, color:"#4ECDC4", icon:"🫘", note:"Chilla for breakfast" },
                  { name:"Soya Chunks",    pg:1.4, color:"#2ECC71", icon:"🌱", note:"Cheapest per gram — use in pulao" },
                  { name:"Paneer",         pg:4.5, color:"#A78BFA", icon:"🧀", note:"Higher cost but great occasionally" },
                  { name:"Curd/Dahi",      pg:5.0, color:"#F472B6", icon:"🥛", note:"Good for gut health" },
                ].map(p => (
                  <div key={p.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"rgba(255,255,255,.55)", borderRadius:13, border:`1px solid ${p.color}18` }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`${p.color}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{p.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#2D1206" }}>{p.name}</div>
                      <div style={{ fontSize:10, color:"rgba(92,61,46,.55)" }}>{p.note}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:900, color:p.color }}>₹{p.pg}</div>
                      <div style={{ fontSize:8.5, color:"rgba(92,61,46,.45)", fontWeight:600 }}>per gram</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ SMART SWAPS ═══════════════════ */}
        {activeTab==="swaps" && (
          <div className="fade-up" style={{ animationDelay:".13s" }}>
            <div style={{ background:"linear-gradient(135deg,#2ECC71,#1a9e52)", borderRadius:20, padding:isMobile?"16px 14px":"20px 22px", marginBottom:gap, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
              <div style={{ fontSize:32 }}>⚡</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, fontWeight:900, color:"#fff", lineHeight:1.1 }}>Smart Food Swaps</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.75)", marginTop:3 }}>Same satisfaction · Less spend · Better nutrition</div>
              </div>
              <div style={{ background:"rgba(255,255,255,.18)", borderRadius:12, padding:"10px 16px", textAlign:"center", flexShrink:0 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:"#fff" }}>
                  ₹{SMART_SWAPS.reduce((s, x) => s+x.save, 0)}
                </div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,.7)", fontWeight:700 }}>total saveable/mo</div>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:gap }}>
              {SMART_SWAPS.map((swap, i) => (
                <div key={swap.bad}>
                  <div className="swap-row" onClick={() => setExpandSwap(expandSwap===i ? null : i)} style={{ background:expandSwap===i?"rgba(255,255,255,.95)":"rgba(255,255,255,.65)" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                        <div style={{ width:20, height:20, borderRadius:6, background:"rgba(196,82,46,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9.5, fontWeight:800, color:"#C4522E", flexShrink:0 }}>✕</div>
                        <span style={{ fontSize:13, color:"rgba(92,61,46,.55)", textDecoration:"line-through", fontWeight:500 }}>{swap.bad}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:20, height:20, borderRadius:6, background:"rgba(46,204,113,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9.5, fontWeight:800, color:"#2ECC71", flexShrink:0 }}>✓</div>
                        <span style={{ fontSize:14, fontWeight:700, color:"#2D1206" }}>{swap.good}</span>
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0, marginLeft:12 }}>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:"#2ECC71" }}>₹{swap.save} saved</div>
                      <div style={{ fontSize:10, color:"rgba(92,61,46,.5)", marginTop:1 }}>−{swap.kcalSave} kcal</div>
                    </div>
                    <div style={{ width:28, height:28, borderRadius:8, background:"rgba(255,107,61,.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, marginLeft:8, transition:"transform .2s", transform:expandSwap===i?"rotate(180deg)":"none" }}>▾</div>
                  </div>

                  {expandSwap===i && (
                    <div className="fade-up" style={{ marginTop:-4, padding:"14px 16px", background:"rgba(255,255,255,.88)", borderRadius:"0 0 14px 14px", border:"1px solid rgba(255,107,61,.15)", borderTop:"none" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#2D1206", marginBottom:8 }}>Why this swap works:</div>
                      <div style={{ fontSize:12, color:"rgba(92,61,46,.65)", marginBottom:10, lineHeight:1.6 }}>{swap.why}</div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <span style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:10, background:"rgba(46,204,113,.1)", color:"#16A34A" }}>✅ ₹{swap.save}/month saved</span>
                        <span style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:10, background:"rgba(255,107,61,.1)", color:"#CC4A10" }}>🔥 {swap.kcalSave} kcal less</span>
                        <span style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:10, background:"rgba(59,130,246,.08)", color:"#2563EB" }}>💰 ₹{swap.save*12}/year</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="glass" style={{ padding:pad }}>
              <SLabel>If You Made All Swaps This Month</SLabel>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14, flexWrap:"wrap" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?28:36, fontWeight:900, color:"#2ECC71", animation:"pulse 2.5s ease-in-out infinite" }}>
                  ₹{SMART_SWAPS.reduce((s, x) => s+x.save, 0)} saved
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:"rgba(92,61,46,.55)", lineHeight:1.6 }}>
                    That's ₹{SMART_SWAPS.reduce((s, x) => s+x.save, 0)*12} a year — and {SMART_SWAPS.reduce((s, x) => s+x.kcalSave, 0)} fewer calories weekly.
                    Your body and wallet will both thank you. 🎯
                  </div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)", gap:10 }}>
                {[
                  { l:"Money saved/mo",    v:`₹${SMART_SWAPS.reduce((s,x)=>s+x.save,0)}`,      c:"#2ECC71" },
                  { l:"Calories saved/wk", v:`${SMART_SWAPS.reduce((s,x)=>s+x.kcalSave,0)}`,  c:"#FF6B3D" },
                  { l:"Annual savings",    v:`₹${SMART_SWAPS.reduce((s,x)=>s+x.save,0)*12}`,   c:"#A78BFA" },
                ].map(s => (
                  <div key={s.l} style={{ background:`${s.c}08`, border:`1px solid ${s.c}18`, borderRadius:13, padding:"12px 10px", textAlign:"center" }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?20:24, fontWeight:900, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:9.5, fontWeight:700, color:"rgba(92,61,46,.5)", textTransform:"uppercase", letterSpacing:.4, marginTop:3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {savedMsg && <div className="saved-toast">✅ All items marked as bought!</div>}
    </div>
  );
}