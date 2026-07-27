import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import MapView from './components/MapView'
import CafeList from './components/CafeList'
import FailedAddressList from './components/FailedAddressList'
import VisitDialog from './components/VisitDialog'
import AuthDialog from './components/AuthDialog'
import VisitSummary from './components/VisitSummary'
import CategoryFilter from './components/CategoryFilter'
import VisitStatusFilter from './components/VisitStatusFilter'
import RegionProgress from './components/RegionProgress'
import { parseCafeExcelFile } from './lib/excelParser'
import { geocodeCafesSequentially } from './lib/geocode'
import { loadKakaoMapSdk } from './lib/kakaoMapLoader'
import { supabase } from './lib/supabaseClient'
import { fetchCafes, upsertCafes } from './lib/cafeApi'
import { fetchVisitNotes, upsertVisitNote } from './lib/visitApi'

export default function App() {
  const [cafes, setCafes] = useState([])
  const [visitsByCafeId, setVisitsByCafeId] = useState({})
  const [failedCafes, setFailedCafes] = useState([])
  const [progress, setProgress] = useState(null)
  const [selectedCafe, setSelectedCafe] = useState(null)
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [visitFilter, setVisitFilter] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [sortOrder, setSortOrder] = useState(
    () => localStorage.getItem('cafeMapSortOrder') || 'latest'
  )

  // 새로고침 후에도 선택한 정렬 방식이 유지되도록 저장
  useEffect(() => {
    localStorage.setItem('cafeMapSortOrder', sortOrder)
  }, [sortOrder])

  // 카페 목록은 공용 데이터라 로그인 여부와 무관하게 불러온다 (PRD 3.1)
  useEffect(() => {
    fetchCafes().then(setCafes)
  }, [])

  // 로그인 상태 구독 (PRD 3.4) — 지도/마커 조회는 로그인 없이도 그대로 가능
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // 로그인한 사용자 본인의 방문 기록만 불러와 병합한다 (RLS로 본인 것만 조회됨)
  // 사용자가 바뀌면 화면 데이터를 즉시 비우고, 이전 사용자 요청이 늦게 도착해도
  // (cancelled 가드) 새 사용자 상태를 덮어쓰지 못하게 한다 — 다른 계정 기록이 섞여 보이는 것 방지.
  useEffect(() => {
    setVisitsByCafeId({})

    if (!user) return

    let cancelled = false

    fetchVisitNotes(user.id).then((rows) => {
      if (cancelled) return

      const map = {}
      rows.forEach((row) => {
        map[row.cafe_id] = { visited: row.visited, comment: row.comment ?? '' }
      })
      setVisitsByCafeId(map)
    })

    return () => {
      cancelled = true
    }
  }, [user])

  // 카페 목록 + 본인 방문 기록을 합친 화면용 데이터
  const cafesWithVisits = useMemo(
    () =>
      cafes.map((cafe) => ({
        ...cafe,
        visited: visitsByCafeId[cafe.id]?.visited ?? false,
        comment: visitsByCafeId[cafe.id]?.comment ?? '',
      })),
    [cafes, visitsByCafeId]
  )

  // 목록에 등장하는 카테고리 (없는 카페는 제외)
  const categories = useMemo(
    () => Array.from(new Set(cafesWithVisits.map((cafe) => cafe.category).filter(Boolean))).sort(),
    [cafesWithVisits]
  )

  // 지역별 카페 수 / 방문 수 / 진행률 (필터와 무관하게 전체 기준, PRD 3.10)
  const regionStats = useMemo(() => {
    const statsByRegion = new Map()

    cafesWithVisits.forEach((cafe) => {
      const region = cafe.region || '지역 미분류'
      if (!statsByRegion.has(region)) {
        statsByRegion.set(region, { region, total: 0, visited: 0 })
      }
      const entry = statsByRegion.get(region)
      entry.total += 1
      if (cafe.visited) entry.visited += 1
    })

    return Array.from(statsByRegion.values())
      .map((entry) => ({
        ...entry,
        percentage: entry.total ? Math.round((entry.visited / entry.total) * 100) : 0,
        conquered: entry.total > 0 && entry.visited === entry.total,
      }))
      .sort((a, b) => b.percentage - a.percentage || a.region.localeCompare(b.region, 'ko'))
  }, [cafesWithVisits])

  // 선택한 지역 + 카테고리 + 방문 여부 필터를 지도 + 목록에 동일하게 적용 (PRD 3.5, 3.7, 3.10)
  const visibleCafes = useMemo(() => {
    let list = cafesWithVisits
    if (selectedRegion) list = list.filter((cafe) => (cafe.region || '지역 미분류') === selectedRegion)
    if (selectedCategory) list = list.filter((cafe) => cafe.category === selectedCategory)
    if (visitFilter === 'visited') list = list.filter((cafe) => cafe.visited)
    else if (visitFilter === 'unvisited') list = list.filter((cafe) => !cafe.visited)
    return list
  }, [cafesWithVisits, selectedRegion, selectedCategory, visitFilter])

  // 목록 정렬 — 지도 마커 순서에는 영향 없음
  const sortedCafes = useMemo(() => {
    const list = [...visibleCafes]
    if (sortOrder === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
    } else {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    return list
  }, [visibleCafes, sortOrder])

  // 방문 현황 요약은 필터와 무관하게 전체 기준으로 계산
  const visitedCount = cafesWithVisits.filter((cafe) => cafe.visited).length

  // 엑셀 업로드 → 파싱 → 지오코딩 → Supabase upsert → 지도 마커 반영 (PRD 3.1, 3.2)
  // 카페 목록 추가/수정은 로그인 사용자만 가능하도록 RLS를 걸어뒀으므로 업로드도 로그인이 필요하다.
  async function handleExcelUpload(file) {
    if (!user) {
      setIsAuthDialogOpen(true)
      return
    }

    setProgress({ current: 0, total: 0 })
    setFailedCafes([])
    setUploadError('')

    try {
      const rows = await parseCafeExcelFile(file)
      const kakao = await loadKakaoMapSdk()

      const { geocoded, failed } = await geocodeCafesSequentially(kakao, rows, setProgress)
      const savedCafes = await upsertCafes(geocoded)

      // (name, address) 기준으로 이미 있던 카페는 갱신, 새 카페는 추가 → 마커가 중복으로 쌓이지 않는다.
      setCafes((prev) => {
        const byId = new Map(prev.map((cafe) => [cafe.id, cafe]))
        savedCafes.forEach((cafe) => byId.set(cafe.id, cafe))
        return Array.from(byId.values())
      })
      setFailedCafes(failed)
    } catch (error) {
      setUploadError(`엑셀 업로드에 실패했어요: ${error.message}`)
    } finally {
      setProgress(null)
    }
  }

  function handleLoginClick() {
    setIsAuthDialogOpen(true)
  }

  async function handleLogoutClick() {
    await supabase.auth.signOut()
  }

  // 마커 클릭 시 방문 체크 + 한줄 소감 팝업 열기 (PRD 3.3)
  function handleSelectCafe(cafe) {
    setSelectedCafe(cafe)
    setIsVisitDialogOpen(true)
  }

  // Supabase visit_notes_260727 테이블에 upsert (PRD 3.4, 3.5)
  async function handleSaveVisit(cafeId, { visited, comment }) {
    if (!user) return
    await upsertVisitNote({ userId: user.id, cafeId, visited, comment })
    setVisitsByCafeId((prev) => ({ ...prev, [cafeId]: { visited, comment } }))
  }

  // 카드의 빠른 방문 체크도 동일하게 upsert — 소감 저장과 마찬가지로 로그인 필요
  async function handleToggleVisited(cafeId) {
    if (!user) {
      setIsAuthDialogOpen(true)
      return
    }

    const current = visitsByCafeId[cafeId] ?? { visited: false, comment: '' }
    const updated = { visited: !current.visited, comment: current.comment }

    await upsertVisitNote({ userId: user.id, cafeId, ...updated })
    setVisitsByCafeId((prev) => ({ ...prev, [cafeId]: updated }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onExcelUpload={handleExcelUpload}
        user={user}
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogoutClick}
      />
      <main className="mx-auto max-w-5xl px-6 py-6">
        {uploadError && (
          <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {uploadError}
          </p>
        )}
        {progress && (
          <p className="mb-3 text-sm text-gray-500">
            주소를 좌표로 변환하는 중... {progress.current}/{progress.total || '?'}
          </p>
        )}
        <VisitSummary total={cafesWithVisits.length} visited={visitedCount} />
        <MapView cafes={visibleCafes} onSelectCafe={handleSelectCafe} />
        <FailedAddressList failedCafes={failedCafes} />
        <RegionProgress regions={regionStats} selected={selectedRegion} onSelect={setSelectedRegion} />
        <VisitStatusFilter value={visitFilter} onChange={setVisitFilter} />
        <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
        <CafeList
          cafes={sortedCafes}
          onToggleVisited={handleToggleVisited}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </main>
      <VisitDialog
        cafe={selectedCafe}
        open={isVisitDialogOpen}
        onOpenChange={setIsVisitDialogOpen}
        onSave={handleSaveVisit}
        user={user}
        onRequireLogin={() => {
          setIsVisitDialogOpen(false)
          setIsAuthDialogOpen(true)
        }}
      />
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </div>
  )
}
