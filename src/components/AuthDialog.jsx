import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import AuthForm from './AuthForm'

export default function AuthDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>로그인 / 회원가입</DialogTitle>
        </DialogHeader>
        <AuthForm onSuccess={() => onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  )
}
