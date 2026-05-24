'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function likeKudos(
  kudosId: string,
): Promise<{ success: boolean; hearts_added?: number; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthenticated' }

  // Prevent sender from liking their own kudos
  const { data: kudos } = await supabase
    .from('kudos')
    .select('sender_id, receiver_id')
    .eq('id', kudosId)
    .single()
  if (!kudos) return { success: false, error: 'Kudos not found' }
  if (kudos.sender_id === user.id) return { success: false, error: 'Cannot like your own kudos' }

  const hearts_added = 1  // future: check is_special_day from settings table → 2

  const { error: insertError } = await supabase
    .from('kudos_likes')
    .insert({ kudos_id: kudosId, user_id: user.id, hearts_added })
  if (insertError) {
    if (insertError.code === '23505') return { success: false, error: 'Already liked' }
    return { success: false, error: insertError.message }
  }

  // Atomic increments via DB functions (avoids read-modify-write race)
  await Promise.all([
    supabase.rpc('increment_kudos_like_count', { p_kudos_id: kudosId }),
    supabase.rpc('increment_profile_hearts', { p_profile_id: kudos.receiver_id, p_amount: hearts_added }),
  ])

  revalidatePath('/sun-kudos')
  return { success: true, hearts_added }
}

export async function unlikeKudos(
  kudosId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthenticated' }

  // Get the like record to know how many hearts to revoke
  const { data: like } = await supabase
    .from('kudos_likes')
    .select('hearts_added')
    .eq('kudos_id', kudosId)
    .eq('user_id', user.id)
    .single()
  if (!like) return { success: false, error: 'Like not found' }

  const { error: deleteError } = await supabase
    .from('kudos_likes')
    .delete()
    .eq('kudos_id', kudosId)
    .eq('user_id', user.id)
  if (deleteError) return { success: false, error: deleteError.message }

  // Atomic decrements via DB functions
  const { data: kudos } = await supabase
    .from('kudos')
    .select('receiver_id')
    .eq('id', kudosId)
    .single()
  if (kudos) {
    await Promise.all([
      supabase.rpc('decrement_kudos_like_count', { p_kudos_id: kudosId }),
      supabase.rpc('decrement_profile_hearts', { p_profile_id: kudos.receiver_id, p_amount: like.hearts_added }),
    ])
  }

  revalidatePath('/sun-kudos')
  return { success: true }
}

export async function submitKudos(data: {
  receiver_id: string
  content: string
  category_id: number | null
  hashtag_ids: number[]
  image_urls: string[]
}): Promise<{ kudos_id?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }
  if (user.id === data.receiver_id) return { error: 'Cannot send kudos to yourself' }

  const trimmedContent = data.content.trim()
  if (!trimmedContent) return { error: 'Content is required' }
  if (trimmedContent.length > 1000) return { error: 'Content must be 1000 characters or less' }
  if (data.hashtag_ids.length > 5) return { error: 'Maximum 5 hashtags allowed' }
  if (data.image_urls.length > 5) return { error: 'Maximum 5 images allowed' }

  // Validate image URLs belong to this project's Supabase storage
  const validUrlPrefix = `https://`
  const invalidUrls = data.image_urls.filter(
    url => !url.startsWith(validUrlPrefix) || !url.includes('.supabase.co/storage/v1/object/public/kudos-images/')
  )
  if (invalidUrls.length > 0) return { error: 'Invalid image URL' }

  const { data: kudos, error: kudosError } = await supabase
    .from('kudos')
    .insert({
      sender_id:   user.id,
      receiver_id: data.receiver_id,
      content:     trimmedContent,
      category_id: data.category_id,
      image_urls:  data.image_urls,
    })
    .select('id')
    .single()
  if (kudosError || !kudos) return { error: kudosError?.message ?? 'Insert failed' }

  // Insert hashtag associations
  if (data.hashtag_ids.length > 0) {
    await supabase.from('kudos_to_hashtags').insert(
      data.hashtag_ids.map(hid => ({ kudos_id: kudos.id, hashtag_id: hid })),
    )
  }

  // Atomic counter increments via DB functions
  await Promise.all([
    supabase.rpc('increment_kudos_sent', { p_profile_id: user.id }),
    (async () => {
      await supabase.rpc('increment_kudos_received', { p_profile_id: data.receiver_id })
      await supabase.rpc('update_profile_badge', { p_id: data.receiver_id })
    })(),
  ])

  revalidatePath('/sun-kudos')
  return { kudos_id: kudos.id }
}

export async function openSecretBox(
  boxId: string,
): Promise<{ prize_description?: string | null; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const { data, error } = await supabase
    .from('secret_boxes')
    .update({ is_opened: true, opened_at: new Date().toISOString() })
    .eq('id', boxId)
    .eq('user_id', user.id)
    .eq('is_opened', false)
    .select('prize_description')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/sun-kudos')
  return { prize_description: data.prize_description }
}

// ─── Client-accessible fetch wrappers ────────────────────────────────────────
// Called from client components via server action prop pattern

export async function fetchHighlightKudos(
  filters: { hashtag_ids: number[]; department_id: number | null },
) {
  const { getHighlightKudos } = await import('./queries')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  return getHighlightKudos(filters, user.id)
}

export async function fetchKudosFeed(
  cursor: string | null,
  filters: { hashtag_ids: number[]; department_id: number | null },
) {
  const { getKudosFeed } = await import('./queries')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { items: [], nextCursor: null }
  return getKudosFeed(filters, cursor, user.id)
}
