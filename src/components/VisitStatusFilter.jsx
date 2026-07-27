import { cn } from '@/lib/utils'

const OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'visited', label: '방문함' },
  { value: 'unvisited', label: '안 가본 곳' },
]

// PRD 3.5 "방문한 카페만 모아보기"를 별도 화면 대신 필터로 구현
export default function VisitStatusFilter({ value, onChange }) {
  return (
    <div className="mb-3 flex gap-1">
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
