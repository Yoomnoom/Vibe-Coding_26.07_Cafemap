import { getCategoryColor } from '@/lib/categoryColors'
import CafeActionsMenu from './CafeActionsMenu'

export default function CafeTable({ cafes, onToggleVisited, onCafeAction }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-2 font-medium">이름</th>
            <th className="px-4 py-2 font-medium">주소</th>
            <th className="px-4 py-2 font-medium">카테고리</th>
            <th className="px-4 py-2 font-medium">소감</th>
            <th className="px-4 py-2 font-medium">방문</th>
            <th className="px-4 py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cafes.map((cafe) => (
            <tr key={cafe.id} className="align-top">
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                <span className="inline-flex items-center gap-1.5">
                  {cafe.name}
                  {cafe.status === 'closed' && (
                    <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                      폐업
                    </span>
                  )}
                  {cafe.favorite && <span title="즐겨찾기">⭐</span>}
                </span>
              </td>
              <td className="px-4 py-2 text-gray-500">{cafe.address}</td>
              <td className="whitespace-nowrap px-4 py-2">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: getCategoryColor(cafe.category) }}
                  />
                  {cafe.category}
                </span>
              </td>
              <td className="px-4 py-2 text-gray-500">{cafe.comment || '-'}</td>
              <td className="whitespace-nowrap px-4 py-2">
                <button
                  type="button"
                  onClick={() => onToggleVisited?.(cafe.id)}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    cafe.visited ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cafe.visited ? '방문함' : '방문 체크'}
                </button>
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-right">
                <CafeActionsMenu cafe={cafe} onAction={(action) => onCafeAction?.(cafe.id, action)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
