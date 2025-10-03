import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 기존 흑/회/백 토큰(다른 컴포넌트 호환용)
        ink: { deep: '#0A0A0A', charcoal: '#1E1E1E', slate: '#2F2F2F' },
        graytone: { ash: '#555555', mist: '#9E9E9E', cloud: '#EDEDED', fog: '#F6F6F6' },
        base: { white: '#FFFFFF' },

        // 파스텔 포인트 팔레트 (탭에 사용)
        pastel: {
          rose50: '#FFF1F2', rose200: '#FECDD3', rose600: '#E11D48',
          amber50: '#FFFBEB', amber200: '#FDE68A', amber700: '#B45309',
          emerald50: '#ECFDF5', emerald200: '#A7F3D0', emerald700: '#047857',
          sky50: '#F0F9FF', sky200: '#BAE6FD', sky700: '#0369A1',
          violet50: '#F5F3FF', violet200: '#DDD6FE', violet700: '#6D28D9',
          slate50: '#F8FAFC', slate200: '#E2E8F0', slate700: '#334155'
        }
      },
      boxShadow: {
        soft: '0 1px 2px rgba(17,17,17,0.06), 0 6px 24px rgba(17,17,17,0.04)'
      },
      borderRadius: { xl2: '14px' }
    }
  },
  plugins: []
} satisfies Config
