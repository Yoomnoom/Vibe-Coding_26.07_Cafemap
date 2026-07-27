export default function Header({ onExcelUpload, user, onLoginClick, onLogoutClick }) {
  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (file) onExcelUpload?.(file)
    event.target.value = ''
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <h1 className="text-xl font-bold text-gray-900">우리 동네 카페 지도</h1>
      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
          엑셀 업로드
          <input type="file" accept=".xlsx" className="hidden" onChange={handleFileChange} />
        </label>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              type="button"
              onClick={onLogoutClick}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onLoginClick}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            로그인
          </button>
        )}
      </div>
    </header>
  )
}
