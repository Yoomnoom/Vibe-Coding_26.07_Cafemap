export default function FailedAddressList({ failedCafes }) {
  if (failedCafes.length === 0) return null

  return (
    <section className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
      <h2 className="mb-2 text-sm font-semibold text-red-700">
        주소를 찾지 못한 카페 ({failedCafes.length}개)
      </h2>
      <ul className="space-y-1 text-sm text-red-700">
        {failedCafes.map((cafe) => (
          <li key={`${cafe.name}__${cafe.address}`}>
            <span className="font-medium">{cafe.name}</span> — {cafe.address}
          </li>
        ))}
      </ul>
    </section>
  )
}
