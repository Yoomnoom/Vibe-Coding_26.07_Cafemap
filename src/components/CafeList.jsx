import CafeCard from './CafeCard'
import CafeTable from './CafeTable'
import SortControl from './SortControl'
import ViewModeToggle from './ViewModeToggle'

export default function CafeList({
  cafes,
  onToggleVisited,
  onCafeAction,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
}) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">카페 목록</h2>
        <div className="flex items-center gap-2">
          <SortControl value={sortOrder} onChange={onSortChange} />
          <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
        </div>
      </div>

      {viewMode === 'table' ? (
        <CafeTable cafes={cafes} onToggleVisited={onToggleVisited} onCafeAction={onCafeAction} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cafes.map((cafe) => (
            <CafeCard
              key={cafe.id}
              cafe={cafe}
              onToggleVisited={onToggleVisited}
              onCafeAction={onCafeAction}
            />
          ))}
        </div>
      )}
    </section>
  )
}
