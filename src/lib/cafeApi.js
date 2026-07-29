import { supabase } from './supabaseClient'

const TABLE = 'cafes_260727'

export async function fetchCafes() {
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}

// 엑셀에서 지오코딩까지 끝난 카페들을 (name, address) 기준으로 upsert한다.
export async function upsertCafes(cafeRows) {
  const payload = cafeRows.map((cafe) => ({
    name: cafe.name,
    address: cafe.address,
    category: cafe.category,
    lat: cafe.lat,
    lng: cafe.lng,
    region: cafe.region ?? null,
    geocode_status: 'success',
  }))

  const { data, error } = await supabase.from(TABLE).upsert(payload, { onConflict: 'name,address' }).select()

  if (error) throw error
  return data
}

// 카페 전역 상태 변경: active(활성) / closed(폐업) / deleted(삭제, 휴지통) — 로그인 사용자 누구나 가능 (PRD 3.11)
export async function updateCafeStatus(cafeId, status) {
  const { data, error } = await supabase.from(TABLE).update({ status }).eq('id', cafeId).select().single()
  if (error) throw error
  return data
}

// 영구 삭제 — 되돌릴 수 없음. FK cascade로 모든 사용자의 방문 기록도 함께 삭제된다.
export async function deleteCafePermanently(cafeId) {
  const { error } = await supabase.from(TABLE).delete().eq('id', cafeId)
  if (error) throw error
}
