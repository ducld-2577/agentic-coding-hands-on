// Kudos Live Board — Supabase server-side query functions
// All functions require server context (cookies); do not call from client components.

import { createClient } from '@/lib/supabase/server'
import type {
  Department, KudosHashtag, KudosCategory,
  KudosFeedItem, KudosStats, SpotlightNode,
  PrizeRecipient, SecretBox, FeedPage, FilterState,
} from './types'

const FEED_PAGE_SIZE = 10

// ─────────────────────────────────────────────
// Lookup tables
// ─────────────────────────────────────────────

export async function getDepartments(): Promise<Department[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('departments')
    .select('id, name')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getHashtags(): Promise<KudosHashtag[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('kudos_hashtags')
    .select('id, name')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getKudosCategories(): Promise<KudosCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('kudos_categories')
    .select('id, name')
    .order('name')
  if (error) throw error
  return data ?? []
}

// ─────────────────────────────────────────────
// Internal: shape a raw DB row into KudosFeedItem
// ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeKudosRow(row: any): KudosFeedItem {
  return {
    id: row.id,
    sender: {
      id:                   row.sender_id,
      full_name:            row.sender_name,
      avatar_url:           row.sender_avatar,
      department_name:      row.sender_dept,
      badge_title:          row.sender_badge ?? null,
      star_level:           row.sender_stars ?? 0,
      kudos_received_count: row.sender_received ?? 0,
      kudos_sent_count:     row.sender_sent ?? 0,
    },
    receiver: {
      id:                   row.receiver_id,
      full_name:            row.receiver_name,
      avatar_url:           row.receiver_avatar,
      department_name:      row.receiver_dept,
      badge_title:          row.receiver_badge ?? null,
      star_level:           row.receiver_stars ?? 0,
      kudos_received_count: row.receiver_received ?? 0,
      kudos_sent_count:     row.receiver_sent ?? 0,
    },
    content:            row.content,
    category_name:      row.category_name ?? null,
    image_urls:         row.image_urls ?? [],
    hashtags:           row.hashtag_names?.filter(Boolean) ?? [],
    like_count:         row.like_count ?? 0,
    user_liked:         row.user_liked ?? false,
    created_at:         row.created_at,
    is_anonymous:       row.is_anonymous ?? false,
    anonymous_nickname: row.anonymous_nickname ?? null,
  }
}

// ─────────────────────────────────────────────
// Feed (cursor-based, ordered by created_at DESC)
// ─────────────────────────────────────────────

export async function getKudosFeed(
  filters: FilterState,
  cursor: string | null,
  currentUserId: string,
): Promise<FeedPage> {
  const supabase = await createClient()

  // Build the join query via RPC to handle array_agg + filters cleanly
  const query = supabase.rpc('get_kudos_feed', {
    p_hashtag_ids:    filters.hashtag_ids.length > 0 ? filters.hashtag_ids : null,
    p_department_id:  filters.department_id,
    p_cursor:         cursor,
    p_limit:          FEED_PAGE_SIZE + 1,
    p_user_id:        currentUserId,
  })

  const { data, error } = await query
  if (error) {
    // Fallback: direct query if RPC not yet deployed
    return getKudosFeedDirect(filters, cursor, currentUserId)
  }

  const items = (data ?? []).slice(0, FEED_PAGE_SIZE).map(shapeKudosRow)
  const nextCursor = data && data.length > FEED_PAGE_SIZE
    ? data[FEED_PAGE_SIZE - 1].created_at
    : null

  return { items, nextCursor }
}

/** Direct join query fallback (no RPC needed) */
async function getKudosFeedDirect(
  filters: FilterState,
  cursor: string | null,
  currentUserId: string,
): Promise<FeedPage> {
  const supabase = await createClient()

  // Fetch kudos IDs that match hashtag filter (if any)
  let kudosIds: string[] | null = null
  if (filters.hashtag_ids.length > 0) {
    const { data: tagRows } = await supabase
      .from('kudos_to_hashtags')
      .select('kudos_id')
      .in('hashtag_id', filters.hashtag_ids)
    kudosIds = tagRows?.map(r => r.kudos_id) ?? []
    if (kudosIds.length === 0) return { items: [], nextCursor: null }
  }

  let query = supabase
    .from('kudos')
    .select(`
      id, content, image_urls, like_count, created_at,
      is_anonymous, anonymous_nickname,
      category_id,
      kudos_categories!left(name),
      sender:profiles!kudos_sender_id_fkey(
        id, full_name, avatar_url, badge_title, star_level,
        kudos_received_count, kudos_sent_count,
        departments!left(name)
      ),
      receiver:profiles!kudos_receiver_id_fkey(
        id, full_name, avatar_url, badge_title, star_level,
        kudos_received_count, kudos_sent_count,
        departments!left(name)
      ),
      kudos_to_hashtags(kudos_hashtags(name)),
      kudos_likes(user_id)
    `)
    .order('created_at', { ascending: false })
    .limit(FEED_PAGE_SIZE + 1)

  if (cursor) query = query.lt('created_at', cursor)
  if (kudosIds) query = query.in('id', kudosIds)

  if (filters.department_id) {
    // Filter by receiver's department
    const { data: profileIds } = await supabase
      .from('profiles')
      .select('id')
      .eq('department_id', filters.department_id)
    const ids = profileIds?.map(p => p.id) ?? []
    if (ids.length === 0) return { items: [], nextCursor: null }
    query = query.in('receiver_id', ids)
  }

  const { data, error } = await query
  if (error) throw error

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = (data ?? []).slice(0, FEED_PAGE_SIZE).map((row: any) => ({
    id:            row.id,
    sender: {
      id:                   row.sender.id,
      full_name:            row.sender.full_name,
      avatar_url:           row.sender.avatar_url,
      department_name:      row.sender.departments?.name ?? null,
      badge_title:          row.sender.badge_title ?? null,
      star_level:           row.sender.star_level ?? 0,
      kudos_received_count: row.sender.kudos_received_count ?? 0,
      kudos_sent_count:     row.sender.kudos_sent_count ?? 0,
    },
    receiver: {
      id:                   row.receiver.id,
      full_name:            row.receiver.full_name,
      avatar_url:           row.receiver.avatar_url,
      department_name:      row.receiver.departments?.name ?? null,
      badge_title:          row.receiver.badge_title ?? null,
      star_level:           row.receiver.star_level ?? 0,
      kudos_received_count: row.receiver.kudos_received_count ?? 0,
      kudos_sent_count:     row.receiver.kudos_sent_count ?? 0,
    },
    content:       row.content,
    category_name: row.kudos_categories?.name ?? null,
    image_urls:    row.image_urls ?? [],
    hashtags:      row.kudos_to_hashtags
      ?.map((kth: { kudos_hashtags: { name: string } | null }) => kth.kudos_hashtags?.name)
      .filter(Boolean) ?? [],
    like_count:         row.like_count ?? 0,
    user_liked:         row.kudos_likes?.some((l: { user_id: string }) => l.user_id === currentUserId) ?? false,
    created_at:         row.created_at,
    is_anonymous:       row.is_anonymous ?? false,
    anonymous_nickname: row.anonymous_nickname ?? null,
  }))

  const nextCursor = data && data.length > FEED_PAGE_SIZE
    ? data[FEED_PAGE_SIZE - 1].created_at
    : null

  return { items, nextCursor }
}

// ─────────────────────────────────────────────
// Highlight: top-5 by like_count
// ─────────────────────────────────────────────

export async function getHighlightKudos(
  filters: FilterState,
  currentUserId: string,
): Promise<KudosFeedItem[]> {
  // Reuse feed logic but sort by like_count — fetch 20 and slice top-5
  const supabase = await createClient()

  let kudosIds: string[] | null = null
  if (filters.hashtag_ids.length > 0) {
    const { data: tagRows } = await supabase
      .from('kudos_to_hashtags')
      .select('kudos_id')
      .in('hashtag_id', filters.hashtag_ids)
    kudosIds = tagRows?.map(r => r.kudos_id) ?? []
    if (kudosIds.length === 0) return []
  }

  let query = supabase
    .from('kudos')
    .select(`
      id, content, image_urls, like_count, created_at,
      is_anonymous, anonymous_nickname,
      kudos_categories!left(name),
      sender:profiles!kudos_sender_id_fkey(
        id, full_name, avatar_url, badge_title, star_level,
        kudos_received_count, kudos_sent_count,
        departments!left(name)
      ),
      receiver:profiles!kudos_receiver_id_fkey(
        id, full_name, avatar_url, badge_title, star_level,
        kudos_received_count, kudos_sent_count,
        departments!left(name)
      ),
      kudos_to_hashtags(kudos_hashtags(name)),
      kudos_likes(user_id)
    `)
    .order('like_count', { ascending: false })
    .limit(5)

  if (kudosIds) query = query.in('id', kudosIds)

  if (filters.department_id) {
    const { data: profileIds } = await supabase
      .from('profiles')
      .select('id')
      .eq('department_id', filters.department_id)
    const ids = profileIds?.map(p => p.id) ?? []
    if (ids.length === 0) return []
    query = query.in('receiver_id', ids)
  }

  const { data, error } = await query
  if (error) throw error

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id:            row.id,
    sender: {
      id:                   row.sender.id,
      full_name:            row.sender.full_name,
      avatar_url:           row.sender.avatar_url,
      department_name:      row.sender.departments?.name ?? null,
      badge_title:          row.sender.badge_title ?? null,
      star_level:           row.sender.star_level ?? 0,
      kudos_received_count: row.sender.kudos_received_count ?? 0,
      kudos_sent_count:     row.sender.kudos_sent_count ?? 0,
    },
    receiver: {
      id:                   row.receiver.id,
      full_name:            row.receiver.full_name,
      avatar_url:           row.receiver.avatar_url,
      department_name:      row.receiver.departments?.name ?? null,
      badge_title:          row.receiver.badge_title ?? null,
      star_level:           row.receiver.star_level ?? 0,
      kudos_received_count: row.receiver.kudos_received_count ?? 0,
      kudos_sent_count:     row.receiver.kudos_sent_count ?? 0,
    },
    content:       row.content,
    category_name: row.kudos_categories?.name ?? null,
    image_urls:    row.image_urls ?? [],
    hashtags:      row.kudos_to_hashtags
      ?.map((kth: { kudos_hashtags: { name: string } | null }) => kth.kudos_hashtags?.name)
      .filter(Boolean) ?? [],
    like_count:         row.like_count ?? 0,
    user_liked:         row.kudos_likes?.some((l: { user_id: string }) => l.user_id === currentUserId) ?? false,
    created_at:         row.created_at,
    is_anonymous:       row.is_anonymous ?? false,
    anonymous_nickname: row.anonymous_nickname ?? null,
  }))
}

// ─────────────────────────────────────────────
// Stats for current user
// ─────────────────────────────────────────────

export async function getKudosStats(userId: string): Promise<KudosStats> {
  const supabase = await createClient()

  const [profileRes, boxRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('kudos_received_count, kudos_sent_count, hearts_received')
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('secret_boxes')
      .select('is_opened')
      .eq('user_id', userId),
  ])

  if (profileRes.error) throw profileRes.error

  const profile = profileRes.data
  const boxes = boxRes.data ?? []

  return {
    received:       profile?.kudos_received_count ?? 0,
    sent:           profile?.kudos_sent_count ?? 0,
    hearts:         profile?.hearts_received ?? 0,
    opened_boxes:   boxes.filter(b => b.is_opened).length,
    unopened_boxes: boxes.filter(b => !b.is_opened).length,
  }
}

// ─────────────────────────────────────────────
// Spotlight data (word cloud nodes)
// ─────────────────────────────────────────────

export async function getSpotlightData(): Promise<SpotlightNode[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, kudos_received_count')
    .gt('kudos_received_count', 0)
    .order('kudos_received_count', { ascending: false })
  if (error) throw error

  // Get last received_at per profile
  const profileIds = (data ?? []).map(p => p.id)
  if (profileIds.length === 0) return []

  const { data: lastKudos } = await supabase
    .from('kudos')
    .select('receiver_id, created_at')
    .in('receiver_id', profileIds)
    .order('created_at', { ascending: false })

  const lastReceivedMap = new Map<string, string>()
  for (const k of lastKudos ?? []) {
    if (!lastReceivedMap.has(k.receiver_id)) {
      lastReceivedMap.set(k.receiver_id, k.created_at)
    }
  }

  return (data ?? []).map(p => ({
    id:              p.id,
    name:            p.full_name,
    avatar_url:      p.avatar_url,
    kudos_count:     p.kudos_received_count,
    last_received_at: lastReceivedMap.get(p.id) ?? null,
  }))
}

export async function getKudosTotalCount(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('kudos')
    .select('id', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

// ─────────────────────────────────────────────
// Prize recipients (D.3 sidebar)
// ─────────────────────────────────────────────

export async function getRecentPrizeRecipients(limit = 10): Promise<PrizeRecipient[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('prize_recipients')
    .select(`
      id, user_id, prize_description, received_at,
      profiles(full_name, avatar_url)
    `)
    .order('received_at', { ascending: false })
    .limit(limit)
  if (error) throw error

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id:               row.id,
    user_id:          row.user_id,
    full_name:        row.profiles?.full_name ?? '',
    avatar_url:       row.profiles?.avatar_url ?? null,
    prize_description: row.prize_description,
    received_at:      row.received_at,
  }))
}

// ─────────────────────────────────────────────
// Secret boxes (current user)
// ─────────────────────────────────────────────

export async function getUserSecretBoxes(userId: string): Promise<SecretBox[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('secret_boxes')
    .select('id, user_id, is_opened, prize_description, opened_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
