
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#6A9C89',
					foreground: '#FFFFFF',
					hover: '#5A8A75'
				},
				secondary: {
					DEFAULT: '#D96C4F',
					foreground: '#FFFFFF',
					hover: '#C25A43'
				},
				sage: {
					50: '#F5F8F6',
					100: '#E8F0ED',
					200: '#C8DAD1',
					300: '#A8C4B5',
					400: '#88AE99',
					500: '#6A9C89',
					600: '#5A8A75',
					700: '#4A7261',
					800: '#3A5A4D',
					900: '#2A4239'
				},
				terracotta: {
					50: '#FDF5F3',
					100: '#FAEBE7',
					200: '#F2CFC3',
					300: '#EAB39F',
					400: '#E2977B',
					500: '#D96C4F',
					600: '#C25A43',
					700: '#AB4837',
					800: '#94362B',
					900: '#7D241F'
				},
				neutral: {
					50: '#FAFAF9',
					100: '#E9E4DB',
					200: '#E0E0E0',
					300: '#6C6C6C',
					900: '#2E2E2E'
				},
				destructive: {
					DEFAULT: '#E57373',
					foreground: '#FFFFFF'
				},
				success: {
					DEFAULT: '#8DA57A',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#E9E4DB',
					foreground: '#6C6C6C'
				},
				accent: {
					DEFAULT: '#E9E4DB',
					foreground: '#2E2E2E'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#2E2E2E'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#2E2E2E'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				'emerald-25': 'hsl(var(--emerald-25))',
				'emerald-700': 'hsl(var(--emerald-700))',
				'blue-25': 'hsl(var(--blue-25))',
				'blue-700': 'hsl(var(--blue-700))',
				'purple-25': 'hsl(var(--purple-25))',
				'purple-700': 'hsl(var(--purple-700))',
				'orange-25': 'hsl(var(--orange-25))',
				'orange-700': 'hsl(var(--orange-700))',
				'indigo-25': 'hsl(var(--indigo-25))',
				'indigo-700': 'hsl(var(--indigo-700))',
				'rose-25': 'hsl(var(--rose-25))',
				'rose-700': 'hsl(var(--rose-700))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
