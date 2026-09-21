/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))"
      },
      fontFamily: {
        sans: ["Vazirmatn","IRANSans","Tahoma","Arial","sans-serif"],
        mono: ["ui-monospace","SFMono-Regular","Consolas","monospace"]
      },
      boxShadow: {
        soft: "0 24px 80px hsl(var(--foreground) / 0.06)"
      }
    }
  },
  plugins: []
};
