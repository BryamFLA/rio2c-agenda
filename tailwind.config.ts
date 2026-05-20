import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT:   '#f7f9fb',
          dim:       '#d8dadc',
          bright:    '#f7f9fb',
          lowest:    '#ffffff',
          low:       '#f2f4f6',
          container: '#eceef0',
          high:      '#e6e8ea',
          highest:   '#e0e3e5',
        },
        'on-surface':         '#191c1e',
        'on-surface-variant': '#47464b',
        outline:              '#78767b',
        'outline-variant':    '#c8c5cb',
        primary:              '#000000',
        'on-primary':         '#ffffff',
        'primary-container':  '#1b1b1f',
        error:                '#ba1a1a',
        'error-container':    '#ffdad6',
        trilha: {
          games:     '#6366F1',
          creator:   '#F59E0B',
          ia:        '#0EA5E9',
          tech:      '#10B981',
          marketing: '#EC4899',
          edu:       '#8B5CF6',
        },
      },
      boxShadow: {
        card:         '0 4px 12px rgba(0,0,0,0.03)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.07)',
        modal:        '0 20px 60px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        sm:      '0.25rem',
        DEFAULT: '0.5rem',
        md:      '0.75rem',
        lg:      '1rem',
        xl:      '1.5rem',
        full:    '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
