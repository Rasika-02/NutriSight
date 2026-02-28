import { useSectionAnimation } from "@/hooks/useSectionAnimation";
import { Mail, Github } from "lucide-react";

const AboutPage = () => {
  const ref = useSectionAnimation(true);

  return (
    <section
      ref={ref}
      className="min-h-screen px-6 py-24 relative overflow-hidden"
      style={{
        fontFamily: "'Playfair Display', serif",
        background: "linear-gradient(180deg, #FFF5EE 0%, #FFE5D6 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');

        .floating-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ff9a6b, #e8734a 60%, #c4522e);
          filter: blur(120px);
          opacity: 0.35;
          animation: floatMove 16s ease-in-out infinite,
                     glowFade 8s ease-in-out infinite;
        }

        .blob1 { width: 400px; height: 400px; top: 10%; left: 5%; }
        .blob2 { width: 500px; height: 500px; bottom: 10%; right: 10%; animation-delay: 2s; }
        .blob3 { width: 350px; height: 350px; top: 55%; left: 40%; animation-delay: 4s; }

        @keyframes floatMove {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-50px) translateX(30px); }
          100% { transform: translateY(0) translateX(0); }
        }

        @keyframes glowFade {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.6; }
        }

        .luxury-title {
          font-size: clamp(48px, 6vw, 72px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -2px;
          color: #3D1F0A;
          text-align: center;
          margin-bottom: 20px;
        }

        .luxury-title span {
          font-style: italic;
          color: #E8734A;
        }

        .subtitle {
          text-align: center;
          font-size: 20px;
          color: #6b4c3b;
          margin-bottom: 60px;
        }

        .glass-card {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(14px);
          border-radius: 30px;
          padding: 50px;
          border: 1px solid rgba(232,115,74,0.2);
          box-shadow: 0 25px 70px rgba(232,115,74,0.15);
          margin-bottom: 50px;
          transition: 0.4s ease;
        }

        .glass-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 35px 90px rgba(232,115,74,0.25);
        }

        .section-heading {
          font-size: 36px;
          font-weight: 900;
          margin-bottom: 20px;
          color: #3D1F0A;
        }

        .section-heading span {
          font-style: italic;
          color: #E8734A;
        }

        .text-muted {
          font-size: 18px;
          line-height: 1.8;
          color: #6b4c3b;
        }

        .team-card {
          background: linear-gradient(135deg, #FFE8D8, #FFD6C4);
          padding: 25px;
          border-radius: 20px;
          transition: 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 40px rgba(232,115,74,0.25);
        }

        .contact-card {
          background: linear-gradient(135deg, #E8734A, #C4522E);
          border-radius: 40px;
          padding: 60px;
          text-align: center;
          color: white;
          box-shadow: 0 40px 100px rgba(196,82,46,0.4);
        }

        .contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.2);
          padding: 14px 24px;
          border-radius: 40px;
          backdrop-filter: blur(10px);
          transition: 0.3s ease;
          font-size: 16px;
        }

        .contact-btn:hover {
          background: rgba(255,255,255,0.35);
        }
      `}</style>

      <div className="floating-bg">
        <span className="blob blob1"></span>
        <span className="blob blob2"></span>
        <span className="blob blob3"></span>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <h1 className="luxury-title">
          About <span>NutriAI</span>
        </h1>

        <p className="subtitle">
          Built with ❤️ for Indian students.
        </p>

        <div className="glass-card">
          <h3 className="section-heading">
            Hackathon <span>Project</span>
          </h3>
          <p className="text-muted">
            NutriAI is an AI-powered nutrition and diet recommendation platform
            designed for Indian hostel students, PG residents, and gym beginners.
            It combines computer vision, nutrient analysis, and budget optimization
            to create personalized, affordable meal plans.
          </p>
        </div>

        <div className="glass-card">
          <h3 className="section-heading">
            Meet the <span>Team</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["Lalit Mahajan","Rasika Mane","Rohit Rathod","Chaitali More"].map((name) => (
              <div key={name} className="team-card">
                <p className="text-xl font-bold text-[#3D1F0A]">{name}</p>
                <p className="text-sm text-gray-600 mt-2">Developer</p>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-card">
          <h3 className="text-3xl font-bold mb-8">Contact Us</h3>
          <div className="flex justify-center gap-8 flex-wrap">
            <a href="mailto:team@nutriai.dev" className="contact-btn">
              <Mail className="w-4 h-4" /> team@nutriai.dev
            </a>
            <a href="#" className="contact-btn">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;