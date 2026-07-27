import { createClient } from '@supabase/supabase-js'

const [, , url, anonKey] = process.argv
const supabase = createClient(url, anonKey)
const email = `visit-flow-test-${Date.now()}@example.com`
const password = 'test-password-123'

async function main() {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
  if (signUpError) throw signUpError
  const userId = signUpData.user.id
  console.log('USER_ID:', userId, email)

  const { data: cafeRows, error: cafeError } = await supabase
    .from('cafes_260727')
    .upsert(
      [{ name: '소감연결테스트카페', address: '서울 소감테스트로 1', category: '테스트', lat: 37.5, lng: 127.0, geocode_status: 'success' }],
      { onConflict: 'name,address' }
    )
    .select()
  if (cafeError) throw cafeError
  const cafeId = cafeRows[0].id
  console.log('CAFE_ID:', cafeId)

  // 1) 저장 (첫 저장 = insert)
  const { data: firstSave, error: firstSaveError } = await supabase
    .from('visit_notes_260727')
    .upsert(
      { user_id: userId, cafe_id: cafeId, visited: true, comment: '처음 남긴 소감', updated_at: new Date().toISOString() },
      { onConflict: 'user_id,cafe_id' }
    )
    .select()
    .single()
  if (firstSaveError) throw firstSaveError
  console.log('STEP1_SAVE:', JSON.stringify(firstSave))

  // 2) 재조회 (같은 카페를 다시 눌렀을 때 채워질 값)
  const { data: reopened, error: reopenError } = await supabase
    .from('visit_notes_260727')
    .select('cafe_id, visited, comment')
    .eq('user_id', userId)
  if (reopenError) throw reopenError
  console.log('STEP2_REFETCH:', JSON.stringify(reopened))

  // 3) 수정 저장 (같은 user_id+cafe_id → update, 새 행 생성 아님)
  const { data: secondSave, error: secondSaveError } = await supabase
    .from('visit_notes_260727')
    .upsert(
      { user_id: userId, cafe_id: cafeId, visited: false, comment: '수정한 소감', updated_at: new Date().toISOString() },
      { onConflict: 'user_id,cafe_id' }
    )
    .select()
    .single()
  if (secondSaveError) throw secondSaveError
  console.log('STEP3_EDIT_SAVE:', JSON.stringify(secondSave))

  console.log('SAME_ROW_ID:', firstSave.id === secondSave.id)
  console.log('CLEANUP_TARGET:', JSON.stringify({ userId, cafeId, email }))
}

main().catch((error) => {
  console.error('TEST_FAILED:', error.message)
  process.exit(1)
})
