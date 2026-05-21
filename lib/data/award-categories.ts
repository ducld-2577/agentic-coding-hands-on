export interface AwardCategory {
  slug: string
  title: string
  description: string
  textLogoSrc: string
}

export const AWARD_CATEGORIES: AwardCategory[] = [
  {
    slug: 'top-talent',
    title: 'Top Talent',
    description: 'Vinh danh top cá nhân xuất sắc trên mọi phương diện',
    textLogoSrc: '/awards/top-talent.png',
  },
  {
    slug: 'top-project',
    title: 'Top Project',
    description: 'Ghi nhận dự án nổi bật và đóng góp xuất sắc',
    textLogoSrc: '/awards/top-project.png',
  },
  {
    slug: 'top-project-leader',
    title: 'Top Project Leader',
    description: 'Vinh danh người lãnh đạo dự án xuất sắc',
    textLogoSrc: '/awards/top-project-leader.png',
  },
  {
    slug: 'best-manager',
    title: 'Best Manager',
    description: 'Ghi nhận nhà quản lý truyền cảm hứng và hiệu quả',
    textLogoSrc: '/awards/best-manager.png',
  },
  {
    slug: 'signature-creator',
    title: 'Signature 2025 — Creator',
    description: 'Vinh danh cá nhân sáng tạo xuất sắc của năm',
    textLogoSrc: '/awards/signature-creator.png',
  },
  {
    slug: 'mvp',
    title: 'MVP',
    description: 'Most Valuable Person — người có đóng góp giá trị nhất',
    textLogoSrc: '/awards/mvp.png',
  },
]
