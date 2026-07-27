import { createClient } from '@supabase/supabase-js'

const [, , url, anonKey, email, password] = process.argv
const supabase = createClient(url, anonKey)

async function main() {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
  if (signUpError) throw signUpError
  const userId = signUpData.user.id
  console.log('USER_ID:', userId)

  const { data: cafeRows, error: cafeError } = await supabase
    .from('cafes_260727')
    .upsert(
      [{ name: '연결테스트카페', address: '서울 어딘가 테스트로 1', category: '테스트', lat: 37.5, lng: 127.0, geocode_status: 'success' }],
      { onConflict: 'name,address' }
    )
    .select()
  if (cafeError) throw cafeError
  const cafeId = cafeRows[0].id
  console.log('CAFE_ID:', cafeId)

  const { data: visitRow, error: visitError } = await supabase
    .from('visit_notes_260727')
    .upsert(
      { user_id: userId, cafe_id: cafeId, visited: true, comment: '연결 테스트 소감' },
      { onConflict: 'user_id,cafe_id' }
    )
    .select()
    .single()
  if (visitError) throw visitError
  console.log('VISIT_ROW:', JSON.stringify(visitRow))

  const { data: fetched, error: fetchError } = await supabase
    .from('visit_notes_260727')
    .select('cafe_id, visited, comment')
    .eq('user_id', userId)
  if (fetchError) throw fetchError
  console.log('FETCHED_FOR_USER:', JSON.stringify(fetched))
}

main().catch((error) => {
  console.error('TEST_FAILED:', error.message)
  process.exit(1)
})
