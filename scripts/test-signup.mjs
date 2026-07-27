import { createClient } from '@supabase/supabase-js'

const url = process.argv[2]
const anonKey = process.argv[3]
const email = process.argv[4]
const password = process.argv[5]

const supabase = createClient(url, anonKey)

const { data, error } = await supabase.auth.signUp({ email, password })

if (error) {
  console.error('SIGNUP_ERROR:', error.message)
  process.exit(1)
}

console.log('SIGNUP_OK:', JSON.stringify({ id: data.user?.id, email: data.user?.email }))
