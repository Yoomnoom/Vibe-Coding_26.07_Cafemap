import CafeCard from './CafeCard'
import SortControl from './SortControl'

export default function CafeList({ cafes, onToggleVisited, sortOrder, onSortChange }) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">카페 목록</h2>
        <SortControl value={sortOrder} onChange={onSortChange} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cafes.map((cafe) => (
          <CafeCard key={cafe.id} cafe={cafe} onToggleVisited={onToggleVisited} />
        ))}
      </div>
    </section>
  )
}
