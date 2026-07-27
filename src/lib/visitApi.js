import { supabase } from './supabaseClient'

const TABLE = 'visit_notes_260727'

// 로그인한 본인의 방문 기록만 조회된다 (RLS: auth.uid() = user_id).
export async function fetchVisitNotes(userId) {
  const { data, error } = await supabase.from(TABLE).select('cafe_id, visited, comment').eq('user_id', userId)

  if (error) throw error
  return data
}

// 같은 사람의 같은 장소(cafe_id) 기록은 1개만 유지 (UNIQUE(user_id, cafe_id) + upsert).
export async function upsertVisitNote({ userId, cafeId, visited, comment }) {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      { user_id: userId, cafe_id: cafeId, visited, comment, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,cafe_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}
