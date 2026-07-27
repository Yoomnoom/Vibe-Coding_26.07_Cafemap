import { getCategoryColor } from '@/lib/categoryColors'
import { cn } from '@/lib/utils'

export default function CategoryFilter({ categories, selected, onSelect }) {
  if (categories.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'rounded-full border px-3 py-1 text-xs font-medium',
          selected === null
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
        )}
      >
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
            selected === category
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
          )}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: selected === category ? '#fff' : getCategoryColor(category) }}
          />
          {category}
        </button>
      ))}
    </div>
  )
}
