import { List, Table2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const OPTIONS = [
  { value: 'list', label: '목록', icon: List },
  { value: 'table', label: '테이블', icon: Table2 },
]

export default function ViewModeToggle({ value, onChange }) {
  return (
    <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
      {OPTIONS.map((option) => {
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors',
              value === option.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
