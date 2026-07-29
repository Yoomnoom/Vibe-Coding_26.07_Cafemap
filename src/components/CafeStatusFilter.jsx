import { cn } from '@/lib/utils'

const OPTIONS = [
  { value: 'active', label: '활성' },
  { value: 'visited', label: '방문 완료' },
  { value: 'favorite', label: '즐겨찾기' },
  { value: 'hidden', label: '숨김' },
  { value: 'closed', label: '폐업' },
  { value: 'deleted', label: '삭제' },
  { value: 'all', label: '전체' },
]

// 카페 상태 필터 (PRD 3.11). 기본값은 'active' — 숨김/폐업/삭제는 이때만 제외된다.
export default function CafeStatusFilter({ value, onChange }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium',
            value === option.value
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
