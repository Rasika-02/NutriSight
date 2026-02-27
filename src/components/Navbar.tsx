import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/how-it-works", label: "How It Works" },
  { to: "/meal-plans",   label: "Meal Plans"   },
  { to: "/budget",       label: "Budget"       },
  { to: "/health",       label: "Health"       },
  { to: "/dashboard",   label: "Dashboard"    },
  { to: "/about",        label: "About"        },
];

const Navbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="font-heading font-bold text-xl text-primary">
          NutriAI 🍛
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? "text-primary active"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons — desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-muted-foreground">
                👋 {user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-b border-border px-6 pb-4 space-y-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="text-sm font-semibold text-muted-foreground py-2"
              >
                Logout ({user?.name?.split(" ")[0]})
              </button>
            ) : (
              <>
                <Link to="/login"  onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground">Login</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
