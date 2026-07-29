import { supabase } from './supabaseClient'

const TABLE = 'visit_notes_260727'

// 로그인한 본인의 방문 기록만 조회된다 (RLS: auth.uid() = user_id).
export async function fetchVisitNotes(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('cafe_id, visited, comment, favorite, hidden')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

// 같은 사람의 같은 장소(cafe_id) 기록은 1개만 유지 (UNIQUE(user_id, cafe_id) + upsert).
// visited/comment뿐 아니라 favorite/hidden(PRD 3.11) 등 일부 필드만 넘겨도 나머지는 기존 값이 유지된다.
export async function upsertVisitNote({ userId, cafeId, ...fields }) {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      { user_id: userId, cafe_id: cafeId, ...fields, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,cafe_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}
