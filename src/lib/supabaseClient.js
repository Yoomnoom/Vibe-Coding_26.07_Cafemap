import { createClient } from '@supabase/supabase-js'

// 앱 전체에서 하나만 생성해 재사용한다. (CLAUDE.md: Supabase 클라이언트 싱글턴)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
