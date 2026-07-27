import { cn } from '@/lib/utils'

const OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'name', label: '이름순' },
]

export default function SortControl({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium',
            value === option.value ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
