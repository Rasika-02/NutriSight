import { useSectionAnimation } from "@/hooks/useSectionAnimation";
import { useState } from "react";
import { Plus, Check } from "lucide-react";

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const weeklyPlan: Record<string, { breakfast:string; lunch:string; dinner:string; kcal:number; protein:number; cost:number }> = {
  Mon: { breakfast:"Poha + Chai",        lunch:"Rajma Chawal",       dinner:"Dal Tadka + Roti",     kcal:1820, protein:58, cost:65 },
  Tue: { breakfast:"Idli Sambar",         lunch:"Chole Bhature",      dinner:"Paneer Bhurji + Roti", kcal:1950, protein:72, cost:80 },
  Wed: { breakfast:"Moong Dal Chilla",   lunch:"Egg Curry + Rice",   dinner:"Khichdi",              kcal:1760, protein:68, cost:70 },
  Thu: { breakfast:"Upma",               lunch:"Soya Pulao",         dinner:"Palak Dal + Roti",     kcal:1800, protein:64, cost:68 },
  Fri: { breakfast:"Besan Cheela",       lunch:"Rajma Chawal",       dinner:"Egg Bhurji + Roti",    kcal:1870, protein:70, cost:72 },
  Sat: { breakfast:"Poha + Boiled Eggs", lunch:"Chole Rice",         dinner:"Paneer Sabzi + Roti",  kcal:1920, protein:74, cost:85 },
  Sun: { breakfast:"Oats with Nuts",     lunch:"Dal Makhani + Rice", dinner:"Mixed Veg Curry",      kcal:1780, protein:60, cost:75 },
};

const meals = [
  { name:"Rajma Chawal",     cal:"320 kcal", protein:"18g", price:"₹40",  emoji:"🫘", color:"#FF6B35" },
  { name:"Paneer Bhurji",    cal:"380 kcal", protein:"22g", price:"₹60",  emoji:"🧀", color:"#F59E0B" },
  { name:"Egg Curry",        cal:"290 kcal", protein:"20g", price:"₹45",  emoji:"🥚", color:"#22C55E" },
  { name:"Dal Rice",         cal:"350 kcal", protein:"15g", price:"₹30",  emoji:"🍛", color:"#3B82F6" },
  { name:"Soya Pulao",       cal:"310 kcal", protein:"24g", price:"₹35",  emoji:"🍚", color:"#8B5CF6" },
  { name:"Moong Dal Chilla", cal:"220 kcal", protein:"14g", price:"₹25",  emoji:"🥞", color:"#06B6D4" },
  { name:"Chole Roti",       cal:"340 kcal", protein:"16g", price:"₹35",  emoji:"🥘", color:"#EC4899" },
  { name:"Idli Sambar",      cal:"280 kcal", protein:"12g", price:"₹25",  emoji:"🥣", color:"#10B981" },
];

const swaps = [
  { junk:"Burger 🍔",      alt:"Rajma Chawal 🫘",    saved:170, price:"₹100" },
  { junk:"Lays Chips 🫙",  alt:"Roasted Makhana 🌾", saved:416, price:"₹20"  },
  { junk:"Cold Drink 🥤",  alt:"Nimbu Pani 🍋",      saved:180, price:"₹10"  },
  { junk:"Samosa 🥟",      alt:"Paneer Bhurji 🧀",   saved:120, price:"₹30"  },
  { junk:"Ice Cream 🍦",   alt:"Dahi + Honey 🥣",    saved:260, price:"₹25"  },
  { junk:"Chocolate Cake 🎂", alt:"Fruit Bowl 🍓",   saved:390, price:"₹80"  },
];

const nutrition = [
  { label:"Calories", cur:1820, max:2000, unit:"kcal", color:"#FF5C1A" },
  { label:"Protein",  cur:58,   max:75,   unit:"g",    color:"#22C55E" },
  { label:"Carbs",    cur:240,  max:300,  unit:"g",    color:"#F59E0B" },
  { label:"Water",    cur:1.8,  max:3,    unit:"L",    color:"#06B6D4" },
];

const slotLabels = ["🌅 Breakfast","☀️ Lunch","🌙 Dinner"];

export default function MealPlansPage() {
  const ref = useSectionAnimation(true);
  const [day,    setDay]    = useState("Mon");
  const [added,  setAdded]  = useState<string[]>([]);
  const [expand, setExpand] = useState<number|null>(null);

  const plan   = weeklyPlan[day];
  const toggle = (n:string) => setAdded(p => p.includes(n) ? p.filter(x=>x!==n) : [...p,n]);

  return (
    <section
      ref={ref}
      className="section-fade min-h-screen py-14 px-4"
      style={{
        background:"linear-gradient(160deg,#FFF0E8 0%,#FFE4D0 40%,#FFF8F3 70%,#FFEADB 100%)",
        fontFamily:"'DM Sans',sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,800;0,900;1,800&family=DM+Sans:wght@400;500;600;700&display=swap');

        /* ── card shell ── */
        .card {
          background:rgba(255,255,255,0.75);
          backdrop-filter:blur(18px);
          border:1px solid rgba(255,140,80,0.15);
          border-radius:24px;
          padding:22px 20px;
        }

        /* ── section heading ── */
        .sec-title {
          font-family:'Fraunces',serif;
          font-size:1.05rem;
          font-weight:800;
          color:#2D1206;
          margin:0 0 16px;
        }

        /* ── day pill ── */
        .dpill {
          border:1.5px solid rgba(255,120,60,0.22);
          border-radius:12px;
          padding:7px 14px;
          background:transparent;
          font-family:'DM Sans',sans-serif;
          font-size:13px;
          font-weight:600;
          color:#8A4828;
          cursor:pointer;
          transition:all .2s;
          white-space:nowrap;
          flex-shrink:0;
        }
        .dpill:hover { background:rgba(255,255,255,.8); }
        .dpill.on {
          background:linear-gradient(135deg,#FF8C5A,#FF5C1A);
          color:#fff;
          border-color:transparent;
          box-shadow:0 4px 14px rgba(255,92,26,.32);
        }

        /* ── meal slot ── */
        .mslot {
          background:rgba(255,255,255,.5);
          border:1px dashed rgba(255,120,60,.28);
          border-radius:14px;
          padding:12px 14px;
          flex:1;
        }
        .mslot-label { font-size:0.65rem; font-weight:700; color:#B06040; letter-spacing:.6px; text-transform:uppercase; margin-bottom:4px; }
        .mslot-text  { font-size:0.86rem; font-weight:600; color:#2D1206; }

        /* ── stat chip ── */
        .schip {
          flex:1;
          border-radius:14px;
          padding:10px 8px;
          text-align:center;
        }
        .schip-val { font-family:'Fraunces',serif; font-size:1.05rem; font-weight:900; line-height:1; }
        .schip-lbl { font-size:0.62rem; font-weight:600; color:#8A4828; margin-top:3px; }

        /* ── meal card ── */
        .mcard {
          display:flex;
          align-items:center;
          gap:13px;
          background:rgba(255,255,255,.65);
          border:1px solid rgba(255,140,80,.14);
          border-radius:18px;
          padding:13px 14px;
          transition:all .28s cubic-bezier(.34,1.56,.64,1);
        }
        .mcard:hover { transform:translateY(-3px); box-shadow:0 12px 28px rgba(220,90,40,.13); background:rgba(255,255,255,.92); }
        .mcard.on   { border-color:rgba(34,197,94,.35); background:rgba(242,255,247,.85); }

        .add-btn {
          width:30px; height:30px; border-radius:50%; border:none;
          color:#fff; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all .25s cubic-bezier(.34,1.56,.64,1);
          flex-shrink:0;
        }
        .add-btn:hover { transform:scale(1.22) rotate(90deg); }

        /* ── swap row ── */
        .srow {
          display:flex; align-items:center; justify-content:space-between;
          padding:11px 14px;
          background:rgba(255,255,255,.62);
          border:1px solid rgba(255,140,80,.14);
          border-radius:15px;
          cursor:pointer;
          transition:all .22s ease;
        }
        .srow:hover { background:rgba(255,255,255,.92); border-color:rgba(255,92,26,.28); }
        .srow.open  { background:rgba(255,255,255,.92); border-color:rgba(255,92,26,.3); }

        /* ── nut bar ── */
        .nbar-track { height:7px; border-radius:99px; background:rgba(230,150,100,.15); overflow:hidden; margin-top:5px; }
        .nbar-fill  { height:100%; border-radius:99px; transition:width 1s ease; }

        /* ── page tag ── */
        .ptag {
          display:inline-block;
          background:rgba(255,92,26,.1);
          border:1.5px solid rgba(255,92,26,.22);
          color:#CC4A10;
          font-size:10px; font-weight:800;
          letter-spacing:2px; text-transform:uppercase;
          padding:5px 16px; border-radius:30px;
          margin-bottom:14px;
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu { animation:fadeUp .35s cubic-bezier(.34,1.56,.64,1) both; }

        /* ── grid: 1-col mobile, 2-col md+, 4-col xl for meals ── */
        .meals-grid {
          display:grid;
          grid-template-columns:1fr;
          gap:10px;
        }
        @media(min-width:640px) {
          .meals-grid { grid-template-columns:1fr 1fr; }
        }

        .page-wrap { max-width:680px; margin:0 auto; display:flex; flex-direction:column; gap:20px; }
      `}</style>

      <div className="page-wrap">

        {/* ── Header ── */}
        <div>
          <div className="ptag">Weekly Meal Intelligence</div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(2rem,6vw,3rem)", fontWeight:900, color:"#2D1206", lineHeight:1.08, letterSpacing:"-1.5px", marginBottom:8 }}>
            Indian Hostel{" "}
            <span style={{ fontStyle:"italic", background:"linear-gradient(135deg,#FF8C5A,#FF3D00)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Meal Plans
            </span>
          </h1>
          <p style={{ color:"#8A4828", fontSize:"0.95rem", lineHeight:1.65, margin:0 }}>
            Budget-friendly, protein-rich Indian meals — planned for your whole week.
          </p>
        </div>

        {/* ── 1. Weekly Day Planner ── */}
        <div className="card">
          <p className="sec-title">📅 Weekly Planner</p>

          {/* Day pills */}
          <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:6, marginBottom:16 }}>
            {days.map(d => (
              <button key={d} className={`dpill${day===d?" on":""}`} onClick={()=>setDay(d)}>{d}</button>
            ))}
          </div>

          {/* Meal slots */}
          <div key={day} className="fu" style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:14 }}>
            {[
              { label:"Breakfast", meal:plan.breakfast, icon:"🌅" },
              { label:"Lunch",     meal:plan.lunch,     icon:"☀️" },
              { label:"Dinner",    meal:plan.dinner,    icon:"🌙" },
            ].map(s => (
              <div key={s.label} className="mslot">
                <div className="mslot-label">{s.icon} {s.label}</div>
                <div className="mslot-text">{s.meal}</div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div key={`s-${day}`} className="fu" style={{ display:"flex", gap:8 }}>
            <div className="schip" style={{ background:"rgba(255,92,26,.08)" }}>
              <div className="schip-val" style={{ color:"#FF5C1A" }}>{plan.kcal}</div>
              <div className="schip-lbl">kcal</div>
            </div>
            <div className="schip" style={{ background:"rgba(34,197,94,.08)" }}>
              <div className="schip-val" style={{ color:"#16A34A" }}>{plan.protein}g</div>
              <div className="schip-lbl">protein</div>
            </div>
            <div className="schip" style={{ background:"rgba(59,130,246,.08)" }}>
              <div className="schip-val" style={{ color:"#2563EB" }}>₹{plan.cost}</div>
              <div className="schip-lbl">budget</div>
            </div>
          </div>
        </div>

        {/* ── 2. Nutrition Targets ── */}
        <div className="card">
          <p className="sec-title">🔥 Daily Nutrition</p>
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            {nutrition.map(n => {
              const pct = Math.round(n.cur / n.max * 100);
              return (
                <div key={n.label}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"0.82rem", fontWeight:600, color:"#2D1206" }}>{n.label}</span>
                    <span style={{ fontSize:"0.75rem", color:"#8A4828" }}>
                      <span style={{ fontWeight:700, color:n.color }}>{n.cur}{n.unit}</span>
                      <span style={{ opacity:.6 }}> / {n.max}{n.unit}</span>
                      <span style={{ marginLeft:6, background:`${n.color}18`, color:n.color, fontWeight:800, fontSize:"0.68rem", padding:"1px 7px", borderRadius:8 }}>{pct}%</span>
                    </span>
                  </div>
                  <div className="nbar-track">
                    <div className="nbar-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${n.color}80,${n.color})` }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 3. Meal Cards Grid ── */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <p className="sec-title" style={{ margin:0 }}>🍽️ Meal Catalogue</p>
            {added.length > 0 && (
              <span style={{ fontSize:"0.72rem", background:"rgba(255,92,26,.1)", color:"#CC4A10", fontWeight:700, padding:"3px 10px", borderRadius:20 }}>
                {added.length} added
              </span>
            )}
          </div>

          <div className="meals-grid">
            {meals.map(m => {
              const isOn = added.includes(m.name);
              return (
                <div key={m.name} className={`mcard${isOn?" on":""}`}>
                  {/* Emoji */}
                  <div style={{ width:46, height:46, borderRadius:13, background:`${m.color}14`, border:`1.5px solid ${m.color}28`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>
                    {m.emoji}
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, color:"#2D1206", fontSize:"0.87rem", marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.name}</div>
                    <div style={{ display:"flex", gap:8 }}>
                      <span style={{ fontSize:"0.7rem", color:"#8A4828" }}>🔥 {m.cal}</span>
                      <span style={{ fontSize:"0.7rem", color:"#8A4828" }}>💪 {m.protein}</span>
                    </div>
                  </div>

                  {/* Price + Add */}
                  <div style={{ display:"flex", alignItems:"center", gap:9, flexShrink:0 }}>
                    <span style={{ fontFamily:"'Fraunces',serif", fontWeight:900, color:"#FF5C1A", fontSize:"1.05rem" }}>{m.price}</span>
                    <button
                      className="add-btn"
                      style={{
                        background: isOn
                          ? "linear-gradient(135deg,#22C55E,#16A34A)"
                          : "linear-gradient(135deg,#FF8C5A,#FF5C1A)",
                        boxShadow: `0 4px 12px ${isOn?"rgba(34,197,94,.32)":"rgba(255,92,26,.3)"}`,
                      }}
                      onClick={()=>toggle(m.name)}
                    >
                      {isOn ? <Check size={13}/> : <Plus size={13}/>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4. Craving Swaps ── */}
        <div className="card">
          <p className="sec-title">⚡ Craving → Swap</p>
          <p style={{ fontSize:"0.82rem", color:"#8A4828", marginBottom:14, marginTop:-8 }}>
            Same price, fewer calories. Tap any to see details.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {swaps.map((s,i) => (
              <div key={s.junk}>
                <div
                  className={`srow${expand===i?" open":""}`}
                  onClick={()=>setExpand(expand===i?null:i)}
                >
                  <div>
                    <div style={{ fontSize:"0.78rem", color:"#8A4828", textDecoration:"line-through", opacity:.65, marginBottom:2 }}>{s.junk}</div>
                    <div style={{ fontSize:"0.88rem", fontWeight:700, color:"#2D1206" }}>{s.alt}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontWeight:800, fontSize:"0.8rem", color:"#16A34A" }}>−{s.saved} kcal</div>
                    <div style={{ fontSize:"0.68rem", color:"#8A4828", marginTop:2 }}>same {s.price}</div>
                  </div>
                </div>

                {/* Expanded detail */}
                {expand === i && (
                  <div className="fu" style={{ display:"flex", gap:7, padding:"10px 14px 4px", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"0.72rem", fontWeight:700, padding:"4px 10px", borderRadius:10, background:"rgba(34,197,94,.1)", color:"#16A34A" }}>
                      ✅ Healthier choice
                    </span>
                    <span style={{ fontSize:"0.72rem", fontWeight:700, padding:"4px 10px", borderRadius:10, background:"rgba(255,92,26,.1)", color:"#CC4A10" }}>
                      💰 Same {s.price}
                    </span>
                    <span style={{ fontSize:"0.72rem", fontWeight:700, padding:"4px 10px", borderRadius:10, background:"rgba(59,130,246,.1)", color:"#2563EB" }}>
                      🔥 {s.saved} kcal saved
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}