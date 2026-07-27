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
