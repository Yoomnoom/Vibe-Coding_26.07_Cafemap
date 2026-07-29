import { MoreVertical, Star, EyeOff, Ban, Trash2, RotateCcw } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

// 카페 상태 관리 더보기 메뉴 (PRD 3.11). "방문 완료"는 별도 버튼이 이미 있어 여기 넣지 않는다.
export default function CafeActionsMenu({ cafe, onAction }) {
  const isTrash = cafe.status === 'deleted'
  const isClosed = cafe.status === 'closed'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="더보기"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isTrash ? (
          <>
            <DropdownMenuItem onSelect={() => onAction('restore')}>
              <RotateCcw className="h-4 w-4" /> 복원
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAction('permanent-delete')} className="text-destructive">
              <Trash2 className="h-4 w-4" /> 영구 삭제
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onSelect={() => onAction('toggle-favorite')}>
              <Star className="h-4 w-4" /> {cafe.favorite ? '즐겨찾기 해제' : '즐겨찾기'}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAction('toggle-hidden')}>
              <EyeOff className="h-4 w-4" /> {cafe.hidden ? '숨김 해제' : '숨기기'}
            </DropdownMenuItem>
            {isClosed ? (
              <DropdownMenuItem onSelect={() => onAction('restore')}>
                <RotateCcw className="h-4 w-4" /> 폐업 해제
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={() => onAction('close')}>
                <Ban className="h-4 w-4" /> 폐업 처리
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onAction('delete')} className="text-destructive">
              <Trash2 className="h-4 w-4" /> 삭제
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
