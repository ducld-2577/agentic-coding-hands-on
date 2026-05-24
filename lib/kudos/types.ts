// Kudos Live Board — shared TypeScript types

export interface Department {
  id: number
  name: string
}

export interface KudosHashtag {
  id: number
  name: string
}

export interface KudosCategory {
  id: number
  name: string
}

export type BadgeTitle = 'New Hero' | 'Rising Hero' | 'Legend Hero'
export type StarLevel = 0 | 1 | 2 | 3

export interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  department_id: number | null
  department_name: string | null
  badge_title: BadgeTitle | null
  star_level: StarLevel
  kudos_received_count: number
  kudos_sent_count: number
  hearts_received: number
}

/** Lightweight profile used in cards and leaderboards */
export interface ProfileSummary {
  id: string
  full_name: string
  avatar_url: string | null
  department_name: string | null
  badge_title: BadgeTitle | null
  star_level: StarLevel
}

export interface KudosFeedItem {
  id: string
  sender: ProfileSummary
  receiver: ProfileSummary
  content: string
  category_name: string | null
  image_urls: string[]
  hashtags: string[]
  like_count: number
  user_liked: boolean
  created_at: string
}

export interface KudosStats {
  received: number
  sent: number
  hearts: number
  opened_boxes: number
  unopened_boxes: number
}

export interface SpotlightNode {
  id: string
  name: string
  avatar_url: string | null
  kudos_count: number
  last_received_at: string | null
}

export interface PrizeRecipient {
  id: string
  user_id: string
  full_name: string
  avatar_url: string | null
  prize_description: string
  received_at: string
}

export interface SecretBox {
  id: string
  user_id: string
  is_opened: boolean
  prize_description: string | null
  opened_at: string | null
  created_at: string
}

export interface FilterState {
  hashtag_ids: number[]
  department_id: number | null
}

export interface FeedPage {
  items: KudosFeedItem[]
  nextCursor: string | null
}
