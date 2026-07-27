export default function VisitSummary({ total, visited }) {
  return (
    <p className="mb-3 text-sm font-medium text-gray-700">
      총 {total}곳 중 {visited}곳 방문 완료
    </p>
  )
}
