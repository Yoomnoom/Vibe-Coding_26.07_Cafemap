import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

// 마커 클릭 시 여는 방문 체크 + 한줄 소감 팝업 (PRD 3.3).
// 지도/마커 조회는 로그인 없이 가능하지만, 소감 저장은 로그인이 필요하다.
// 저장은 visit_notes_260727에 upsert된다 (같은 카페 재저장 시 새 기록이 아니라 기존 기록이 갱신됨).
export default function VisitDialog({ cafe, open, onOpenChange, onSave, user, onRequireLogin }) {
  const [visited, setVisited] = useState(false)
  const [comment, setComment] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!cafe) return
    setVisited(Boolean(cafe.visited))
    setComment(cafe.comment ?? '')
    setSaveError('')
  }, [cafe])

  if (!cafe) return null

  async function handleSave() {
    setIsSaving(true)
    setSaveError('')

    try {
      await onSave?.(cafe.id, { visited, comment })
      onOpenChange?.(false)
    } catch (error) {
      // 저장 도중 로그인 세션이 끊긴 경우(RLS 거부 등) 에러 화면 대신 안내만 보여준다.
      setSaveError('로그인이 풀린 것 같아요. 다시 로그인한 뒤 저장해 주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cafe.name}</DialogTitle>
          <DialogDescription>
            {cafe.address}
            {cafe.category ? ` · ${cafe.category}` : ''}
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="visit-checkbox"
                checked={visited}
                onCheckedChange={(checked) => setVisited(Boolean(checked))}
              />
              <Label htmlFor="visit-checkbox">방문했어요</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visit-comment">한줄 소감</Label>
              <Textarea
                id="visit-comment"
                placeholder="이 카페에 대한 소감을 남겨보세요"
                value={comment}
                maxLength={200}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>

            {saveError && <p className="text-sm text-destructive">{saveError}</p>}

            {saveError ? (
              <DialogFooter>
                <Button onClick={onRequireLogin}>로그인하기</Button>
              </DialogFooter>
            ) : (
              <DialogFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? '저장 중...' : '저장'}
                </Button>
              </DialogFooter>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              방문 체크와 소감을 남기려면 로그인이 필요해요.
            </p>
            <DialogFooter>
              <Button onClick={onRequireLogin}>로그인하기</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
