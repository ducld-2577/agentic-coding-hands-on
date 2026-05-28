export const homeTranslations = {
  VN: {
    details: 'Chi tiết',
    // Account menu
    account: {
      profile: 'Hồ sơ',
      signOut: 'Đăng xuất',
      adminDashboard: 'Admin Dashboard',
    },
    // Footer
    footer: {
      logoAriaLabel: 'SAA 2025 — về trang chủ',
      copyright: 'Bản quyền thuộc về Sun* © 2025',
      generalStandards: 'Tiêu chuẩn chung',
    },
    // Countdown widget on home page
    countdown: {
      comingSoon: 'Sắp diễn ra',
      days: 'NGÀY',
      hours: 'GIỜ',
      minutes: 'PHÚT',
    },
    // Event info block
    eventInfo: {
      dateLabel: 'Thời gian:',
      date: '26/12/2025',
      venueLabel: 'Địa điểm:',
      venue: 'Âu Cơ Art Center',
      livestream: 'Tường thuật trực tiếp qua sóng Livestream',
    },
    // CTA buttons
    cta: {
      aboutAwards: 'Về Giải Thưởng',
      aboutKudos: 'Về Kudos',
    },
    // Awards section header
    awards: {
      sectionLabel: 'Sun* annual awards 2025',
      title: 'Hệ thống giải thưởng',
      description: 'Các hạng mục sẽ được trao giải theo TOP những người xuất sắc nhất.',
    },
    // Kudos section (short strings only — long description in home-content-translations)
    kudos: {
      movementLabel: 'Phong trào ghi nhận',
      newFeatureLabel: 'ĐIỂM MỚI CỦA SAA 2025',
    },
  },
  EN: {
    details: 'Details',
    account: {
      profile: 'Profile',
      signOut: 'Sign out',
      adminDashboard: 'Admin Dashboard',
    },
    footer: {
      logoAriaLabel: 'SAA 2025 — go to home',
      copyright: 'Copyright Sun* © 2025',
      generalStandards: 'General Standards',
    },
    countdown: {
      comingSoon: 'Coming soon',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINUTES',
    },
    eventInfo: {
      dateLabel: 'Date:',
      date: 'Dec 26, 2025',
      venueLabel: 'Venue:',
      venue: 'Âu Cơ Art Center',
      livestream: 'Live broadcast on Livestream',
    },
    cta: {
      aboutAwards: 'About Awards',
      aboutKudos: 'About Kudos',
    },
    awards: {
      sectionLabel: 'Sun* annual awards 2025',
      title: 'Awards System',
      description: 'Categories will be awarded to the top outstanding performers.',
    },
    kudos: {
      movementLabel: 'Recognition Movement',
      newFeatureLabel: 'NEW AT SAA 2025',
    },
  },
} as const

export type HomeTranslations = typeof homeTranslations
