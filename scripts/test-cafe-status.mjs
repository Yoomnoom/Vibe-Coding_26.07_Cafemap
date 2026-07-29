import { createClient } from '@supabase/supabase-js'

const [, , url, anonKey] = process.argv
const supabase = createClient(url, anonKey)
const email = `status-test-${Date.now()}@example.com`
const password = 'test-password-123'

async function main() {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
  if (signUpError) throw signUpError
  const userId = signUpData.user.id
  console.log('USER_ID:', userId)

  const { data: cafeRows, error: cafeError } = await supabase
    .from('cafes_260727')
    .upsert(
      [{ name: '상태관리테스트카페', address: '서울 상태테스트로 1', category: '테스트', lat: 37.5, lng: 127.0 }],
      { onConflict: 'name,address' }
    )
    .select()
  if (cafeError) throw cafeError
  const cafeId = cafeRows[0].id
  console.log('CAFE_ID:', cafeId, 'initial status:', cafeRows[0].status)

  // 1) 즐겨찾기만 upsert (visited/comment는 안 건드림 - 부분 업데이트 확인)
  const { data: favRow, error: favError } = await supabase
    .from('visit_notes_260727')
    .upsert({ user_id: userId, cafe_id: cafeId, favorite: true }, { onConflict: 'user_id,cafe_id' })
    .select()
    .single()
  if (favError) throw favError
  console.log('STEP1_FAVORITE:', JSON.stringify(favRow))

  // 2) 숨김 추가 (기존 favorite=true가 유지되는지 확인)
  const { data: hiddenRow, error: hiddenError } = await supabase
    .from('visit_notes_260727')
    .upsert({ user_id: userId, cafe_id: cafeId, hidden: true }, { onConflict: 'user_id,cafe_id' })
    .select()
    .single()
  if (hiddenError) throw hiddenError
  console.log('STEP2_HIDDEN (favorite should still be true):', JSON.stringify(hiddenRow))

  // 3) 폐업 처리
  const { data: closedCafe, error: closeError } = await supabase
    .from('cafes_260727')
    .update({ status: 'closed' })
    .eq('id', cafeId)
    .select()
    .single()
  if (closeError) throw closeError
  console.log('STEP3_CLOSED:', closedCafe.status)

  // 4) 삭제(휴지통)
  const { data: deletedCafe, error: deleteError } = await supabase
    .from('cafes_260727')
    .update({ status: 'deleted' })
    .eq('id', cafeId)
    .select()
    .single()
  if (deleteError) throw deleteError
  console.log('STEP4_DELETED_STATUS:', deletedCafe.status)

  // 5) 복원
  const { data: restoredCafe, error: restoreError } = await supabase
    .from('cafes_260727')
    .update({ status: 'active' })
    .eq('id', cafeId)
    .select()
    .single()
  if (restoreError) throw restoreError
  console.log('STEP5_RESTORED:', restoredCafe.status)

  // 6) 영구 삭제 (cascade로 visit_notes도 같이 삭제되는지 확인)
  const { error: hardDeleteError } = await supabase.from('cafes_260727').delete().eq('id', cafeId)
  if (hardDeleteError) throw hardDeleteError

  const { data: remainingCafe } = await supabase.from('cafes_260727').select('id').eq('id', cafeId)
  const { data: remainingVisit } = await supabase.from('visit_notes_260727').select('id').eq('cafe_id', cafeId)
  console.log('STEP6_AFTER_PERMANENT_DELETE:', JSON.stringify({ remainingCafe, remainingVisit }))

  console.log('CLEANUP_TARGET_USER:', userId, email)
}

main().catch((error) => {
  console.error('TEST_FAILED:', error.message)
  process.exit(1)
})
