import { cn } from '@/lib/utils'

// 지역 정복 시스템 (PRD 3.10) — 지역별 방문 진행률 카드 + 선택 시 필터
export default function RegionProgress({ regions, selected, onSelect }) {
  if (regions.length === 0) return null

  return (
    <section className="mb-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-700">지역 정복 현황</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((r) => (
          <button
            key={r.region}
            type="button"
            onClick={() => onSelect(selected === r.region ? null : r.region)}
            className={cn(
              'rounded-lg border p-3 text-left transition-colors',
              selected === r.region ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:bg-gray-50'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-gray-900">📍 {r.region}</span>
              {r.conquered && <span className="text-xs font-semibold text-amber-600">🏆 정복 완료</span>}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {r.visited} / {r.total} 방문
              {!r.conquered && r.total > r.visited ? ` · 정복까지 ${r.total - r.visited}곳 남음` : ''}
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
              <div
                className={cn('h-2 rounded-full', r.conquered ? 'bg-amber-500' : 'bg-gray-900')}
                style={{ width: `${r.percentage}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
