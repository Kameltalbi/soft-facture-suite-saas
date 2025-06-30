
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
					DEFAULT: '#6C4CF1',
					foreground: '#FFFFFF',
					hover: '#5B3FD9',
					50: '#F4F2FF',
					100: '#EBE5FF',
					200: '#D9CFFF',
					300: '#BFA8FF',
					400: '#9F75FF',
					500: '#6C4CF1',
					600: '#5B3FD9',
					700: '#4A31C2',
					800: '#3D289E',
					900: '#332580'
				},
				secondary: {
					DEFAULT: '#1E3A8A',
					foreground: '#FFFFFF',
					hover: '#1E40AF',
					50: '#EFF6FF',
					100: '#DBEAFE',
					200: '#BFDBFE',
					300: '#93C5FD',
					400: '#60A5FA',
					500: '#3B82F6',
					600: '#2563EB',
					700: '#1E3A8A',
					800: '#1E40AF',
					900: '#1E3A8A'
				},
				accent: {
					DEFAULT: '#C7D2FE',
					foreground: '#1F2937',
					50: '#F8FAFC',
					100: '#F1F5F9',
					200: '#E2E8F0',
					300: '#C7D2FE',
					400: '#A5B4FC',
					500: '#818CF8',
					600: '#6366F1',
					700: '#4F46E5',
					800: '#4338CA',
					900: '#3730A3'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF',
					hover: '#DC2626'
				},
				success: {
					DEFAULT: '#10B981',
					foreground: '#FFFFFF',
					hover: '#059669'
				},
				warning: {
					DEFAULT: '#F59E0B',
					foreground: '#FFFFFF',
					hover: '#D97706'
				},
				muted: {
					DEFAULT: '#F3F4F6',
					foreground: '#6B7280'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#1F2937'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#1F2937'
				},
				sidebar: {
					DEFAULT: '#1E3A8A',
					foreground: '#FFFFFF',
					primary: '#6C4CF1',
					'primary-foreground': '#FFFFFF',
					accent: '#2563EB',
					'accent-foreground': '#FFFFFF',
					border: '#1E40AF',
					ring: '#6C4CF1'
				},
				// Texte
				text: {
					primary: '#1F2937',
					secondary: '#6B7280',
					muted: '#9CA3AF',
					white: '#FFFFFF'
				},
				// Arrière-plans
				gray: {
					50: '#F9FAFB',
					100: '#F3F4F6',
					200: '#E5E7EB',
					300: '#D1D5DB',
					400: '#9CA3AF',
					500: '#6B7280',
					600: '#4B5563',
					700: '#374151',
					800: '#1F2937',
					900: '#111827'
				}
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
				},
				'slide-in': {
					from: {
						transform: 'translateX(-100%)'
					},
					to: {
						transform: 'translateX(0)'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(108, 76, 241, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 30px rgba(108, 76, 241, 0.6)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'glow': 'glow 2s ease-in-out infinite'
			},
			fontFamily: {
				sans: ['Inter', 'Lato', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif']
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
			},
			boxShadow: {
				'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				'strong': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				'primary': '0 10px 15px -3px rgba(108, 76, 241, 0.1), 0 4px 6px -2px rgba(108, 76, 241, 0.05)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
