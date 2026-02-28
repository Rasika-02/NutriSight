import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
<<<<<<< HEAD
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
=======
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
<<<<<<< HEAD

=======
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
<<<<<<< HEAD

=======
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
<<<<<<< HEAD

=======
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
<<<<<<< HEAD

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

=======
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
<<<<<<< HEAD

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

=======
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
<<<<<<< HEAD

=======
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
<<<<<<< HEAD

=======
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
<<<<<<< HEAD

=======
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
<<<<<<< HEAD

=======
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
<<<<<<< HEAD
} satisfies Config;
=======
} satisfies Config;
>>>>>>> 31d3dcd17e0eb3d2e8da572039f27821d6501fe8
