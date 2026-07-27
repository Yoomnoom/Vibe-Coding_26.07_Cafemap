import { getCategoryColor } from '@/lib/categoryColors'

export default function CafeCard({ cafe, onToggleVisited }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{cafe.name}</h3>
          <p className="text-sm text-gray-500">{cafe.address}</p>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: getCategoryColor(cafe.category) }}
            />
            {cafe.category}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onToggleVisited?.(cafe.id)}
          className={`shrink-0 rounded-md px-3 py-1 text-xs font-medium ${
            cafe.visited ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {cafe.visited ? '방문함' : '방문 체크'}
        </button>
      </div>
      {cafe.comment && <p className="mt-2 text-sm text-gray-700">"{cafe.comment}"</p>}
    </div>
  )
}
