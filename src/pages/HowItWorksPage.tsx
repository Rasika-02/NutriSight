import { useSectionAnimation } from "@/hooks/useSectionAnimation";
import { Upload, Brain, Search, CalendarCheck, ShoppingCart } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Body Photo",
    desc: "Share meal or body images for instant AI analysis.",
    emoji: "📸",
  },
  {
    icon: Brain,
    title: "AI Body Analysis",
    desc: "Our model identifies body composition, BMI & visual cues.",
    emoji: "🧠",
  },
  {
    icon: Search,
    title: "Detect Nutrient Deficiencies",
    desc: "Spot gaps in vitamins, iron, and protein with precision.",
    emoji: "🔍",
  },
  {
    icon: CalendarCheck,
    title: "Budget-Friendly Diet Plan",
    desc: "Weekly Indian diet plan under ₹100/day, tailored to you.",
    emoji: "📋",
  },
  {
    icon: ShoppingCart,
    title: "Weekly Grocery List",
    desc: "Auto-generated list sourced from your local market.",
    emoji: "🛒",
  },
];

const HowItWorksPage = () => {
  const ref = useSectionAnimation(true);

  return (
    <section
      ref={ref}
      className="section-fade min-h-screen flex flex-col justify-center px-6 py-24"
      style={{
        background: "linear-gradient(145deg, #FFF0E8 0%, #FFE0CC 35%, #FFF5EE 65%, #FFEADB 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600&display=swap');

        .hiw-card {
          position: relative;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 140, 80, 0.18);
          border-radius: 28px;
          padding: 32px 22px 28px;
          text-align: center;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, background 0.3s ease;
          overflow: hidden;
          cursor: default;
        }
        .hiw-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(255,140,80,0.07) 0%, transparent 60%);
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .hiw-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 28px 60px rgba(220, 90, 40, 0.16), 0 4px 12px rgba(220,90,40,0.08);
          background: rgba(255, 255, 255, 0.92);
        }
        .hiw-card:hover::before { opacity: 1; }

        .hiw-icon-wrap {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFF0E5, #FFD9C0);
          border: 2px solid rgba(255, 120, 60, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 6px 18px rgba(255,100,50,0.12);
        }
        .hiw-card:hover .hiw-icon-wrap {
          transform: scale(1.18) rotate(-6deg);
          background: linear-gradient(135deg, #FF8C5A, #FF5C1A);
          border-color: transparent;
          box-shadow: 0 12px 32px rgba(255,92,26,0.38);
        }
        .hiw-card:hover .hiw-icon {
          color: white !important;
        }

        .step-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #FF8C5A, #FF5C1A);
          color: white;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
          padding: 4px 13px;
          border-radius: 20px;
          margin-bottom: 14px;
          text-transform: uppercase;
          box-shadow: 0 4px 14px rgba(255,92,26,0.3);
        }

        .connector-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF8C5A, #FF5C1A);
          flex-shrink: 0;
          box-shadow: 0 0 0 4px rgba(255,92,26,0.12);
        }
        .connector-line {
          flex: 1;
          height: 1.5px;
          background: linear-gradient(90deg, rgba(255,92,26,0.45), rgba(255,92,26,0.08));
        }

        .tag-float {
          position: absolute;
          top: 14px;
          right: 16px;
          font-size: 1.25rem;
          opacity: 0.15;
          transition: opacity 0.3s ease, transform 0.35s ease;
        }
        .hiw-card:hover .tag-float {
          opacity: 0.5;
          transform: scale(1.25) rotate(10deg);
        }

        .section-label {
          display: inline-block;
          background: rgba(255, 92, 26, 0.1);
          border: 1.5px solid rgba(255,92,26,0.25);
          color: #CC4A10;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          padding: 6px 20px;
          border-radius: 30px;
          margin-bottom: 20px;
          font-family: 'DM Sans', sans-serif;
        }

        .bottom-tag {
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,120,60,0.2);
          color: #8A4828;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 20px;
          backdrop-filter: blur(8px);
          font-family: 'DM Sans', sans-serif;
          transition: all 0.25s ease;
        }
        .bottom-tag:hover {
          background: rgba(255,255,255,0.9);
          border-color: rgba(255,92,26,0.35);
          transform: translateY(-2px);
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(75px);
          pointer-events: none;
        }

        .accent-bar {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #FF8C5A, transparent);
          border-radius: 0 0 28px 28px;
          transition: width 0.4s ease;
        }
        .hiw-card:hover .accent-bar {
          width: 50%;
        }
      `}</style>

      {/* Ambient background orbs */}
      <div className="glow-orb" style={{ width: 500, height: 500, background: "rgba(255,110,50,0.08)", top: "-10%", left: "45%", transform: "translateX(-50%)", zIndex: 0, position: "absolute" }} />
      <div className="glow-orb" style={{ width: 350, height: 350, background: "rgba(255,180,90,0.1)", bottom: "5%", left: "5%", zIndex: 0, position: "absolute" }} />
      <div className="glow-orb" style={{ width: 250, height: 250, background: "rgba(255,150,80,0.09)", bottom: "15%", right: "5%", zIndex: 0, position: "absolute" }} />

      <div className="container mx-auto max-w-6xl" style={{ position: "relative", zIndex: 1 }}>

        {/* ── HEADER ── */}
        <div className="text-center mb-16">
          <div className="section-label">AI-Powered Nutrition Intelligence</div>

          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(2.8rem, 5.5vw, 4.6rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-1.5px",
            color: "#2D1206",
            marginBottom: 18,
          }}>
            How It{" "}
            <span style={{
              fontStyle: "italic",
              background: "linear-gradient(135deg, #FF8C5A, #FF3D00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Works
            </span>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "#8A4828",
            fontSize: "1.08rem",
            maxWidth: 460,
            margin: "0 auto",
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            Five simple steps to smarter, personalized nutrition — built for India.
          </p>
        </div>

        {/* ── CONNECTOR DOTS (desktop only) ── */}
        <div className="hidden lg:flex items-center justify-center mb-[-30px] px-20 relative" style={{ zIndex: 2 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div className="connector-dot" />
              {i < steps.length - 1 && <div className="connector-line" />}
            </div>
          ))}
        </div>

        {/* ── STEP CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="hiw-card"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <span className="tag-float">{step.emoji}</span>

              {/* Icon circle */}
              <div className="hiw-icon-wrap">
                <step.icon
                  size={26}
                  className="hiw-icon"
                  style={{ color: "#FF5C1A", transition: "color 0.3s ease" }}
                />
              </div>

              {/* Step pill */}
              <div className="step-badge">Step {i + 1}</div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.02rem",
                fontWeight: 700,
                color: "#2D1206",
                marginBottom: 9,
                lineHeight: 1.3,
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.81rem",
                color: "#8A4828",
                lineHeight: 1.65,
                fontWeight: 400,
              }}>
                {step.desc}
              </p>

              {/* Hover accent bar */}
              <div className="accent-bar" />
            </div>
          ))}
        </div>



      </div>
    </section>
  );
};

export default HowItWorksPage;