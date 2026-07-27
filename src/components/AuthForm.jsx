import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// 이메일/비밀번호 회원가입·로그인 폼. 성공 시 onSuccess() 호출(다이얼로그 닫기 등).
export default function AuthForm({ onSuccess }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  async function handleGoogleLogin() {
    setError('')
    setIsGoogleLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })

      if (authError) {
        setError(authError.message)
        setIsGoogleLoading(false)
      }
      // 성공 시 구글 로그인 페이지로 이동하므로 여기서 할 일은 없음(돌아오면 세션이 자동 반영됨)
    } catch (error) {
      setError(error.message)
      setIsGoogleLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const { error: authError } =
        mode === 'signup'
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError(authError.message)
        return
      }

      onSuccess?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 border-b border-border text-sm">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={cn(
            'border-b-2 border-transparent pb-2 font-medium text-muted-foreground',
            mode === 'login' && 'border-primary text-foreground'
          )}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={cn(
            'border-b-2 border-transparent pb-2 font-medium text-muted-foreground',
            mode === 'signup' && 'border-primary text-foreground'
          )}
        >
          회원가입
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="auth-email">이메일</Label>
        <Input
          id="auth-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="auth-password">비밀번호</Label>
        <Input
          id="auth-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {mode === 'signup' ? '회원가입' : '로그인'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full" disabled={isGoogleLoading} onClick={handleGoogleLogin}>
        {isGoogleLoading ? '이동 중...' : 'Google로 계속하기'}
      </Button>
    </form>
  )
}
