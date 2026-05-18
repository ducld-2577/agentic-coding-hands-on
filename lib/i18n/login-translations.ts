export const loginTranslations = {
  VN: {
    tagline: 'ROOT FURTHER',
    description1: 'Bắt đầu hành trình của bạn cùng SAA 2025.',
    description2: 'Đăng nhập để khám phá!',
    loginButton: 'ĐĂNG NHẬP BẰNG GOOGLE',
  },
  EN: {
    tagline: 'ROOT FURTHER',
    description1: 'Begin your journey with SAA 2025.',
    description2: 'Sign in to explore!',
    loginButton: 'LOGIN WITH GOOGLE',
  },
} as const

export type Locale = keyof typeof loginTranslations
