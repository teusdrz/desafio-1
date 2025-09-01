/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
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
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
                display: ['Lexend', 'Inter', 'system-ui', 'sans-serif'],
                heading: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Purple theme colors with more variations
                purple: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7c3aed',
                    800: '#6b21a8',
                    900: '#581c87',
                    950: '#3b0764'
                },
                brand: {
                    purple: '#9333ea',
                    'purple-light': '#c084fc',
                    'purple-dark': '#7c3aed',
                    white: '#ffffff',
                    gray: '#f8fafc'
                },
                // Additional sophisticated colors
                gradient: {
                    from: '#667eea',
                    via: '#764ba2',
                    to: '#f093fb'
                }
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            boxShadow: {
                'elegant': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'purple': '0 10px 25px -3px rgba(147, 51, 234, 0.1), 0 4px 6px -2px rgba(147, 51, 234, 0.05)',
                'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
            },
            backdropBlur: {
                xs: '2px',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }
        },
        borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
        },
        keyframes: {
            "accordion-down": {
                from: { height: 0 },
                to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: 0 },
            },
            "shimmer": {
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(100%)" },
            },
            "float": {
                "0%, 100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-20px)" },
            },
            "pulse-soft": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.8 },
            },
            "gradient-x": {
                "0%, 100%": {
                    "background-size": "200% 200%",
                    "background-position": "left center"
                },
                "50%": {
                    "background-size": "200% 200%",
                    "background-position": "right center"
                }
            },
            "fade-in-up": {
                "0%": {
                    opacity: "0",
                    transform: "translateY(10px)"
                },
                "100%": {
                    opacity: "1",
                    transform: "translateY(0)"
                }
            }
        },
        animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
            "shimmer": "shimmer 2s linear infinite",
            "float": "float 6s ease-in-out infinite",
            "pulse-soft": "pulse-soft 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            "gradient-x": "gradient-x 15s ease infinite",
            "fade-in-up": "fade-in-up 0.5s ease-out"
        }
    },
    plugins: [require("tailwindcss-animate")]
}
