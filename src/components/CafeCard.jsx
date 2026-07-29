import { getCategoryColor } from '@/lib/categoryColors'
import CafeActionsMenu from './CafeActionsMenu'

export default function CafeCard({ cafe, onToggleVisited, onCafeAction }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-gray-900">{cafe.name}</h3>
            {cafe.status === 'closed' && (
              <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">폐업</span>
            )}
            {cafe.favorite && <span title="즐겨찾기">⭐</span>}
          </div>
          <p className="text-sm text-gray-500">{cafe.address}</p>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: getCategoryColor(cafe.category) }}
            />
            {cafe.category}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleVisited?.(cafe.id)}
            className={`rounded-md px-3 py-1 text-xs font-medium ${
              cafe.visited ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {cafe.visited ? '방문함' : '방문 체크'}
          </button>
          <CafeActionsMenu cafe={cafe} onAction={(action) => onCafeAction?.(cafe.id, action)} />
        </div>
      </div>
      {cafe.comment && <p className="mt-2 text-sm text-gray-700">"{cafe.comment}"</p>}
    </div>
  )
}
