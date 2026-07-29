import { useEffect, useRef } from 'react'
import { loadKakaoMapSdk } from '../lib/kakaoMapLoader'
import { escapeHtml } from '../lib/escapeHtml'
import { getCategoryColor, VISITED_MARKER_COLOR } from '../lib/categoryColors'

const SEOUL_CITY_HALL = { lat: 37.5665, lng: 126.978 }

const CLOSED_MARKER_COLOR = '#9ca3af'

// 방문 체크된 카페는 카테고리와 무관하게 고정 색 + 체크 표시, 폐업 카페는 회색, 그 외는 카테고리 색.
// 위치(lat/lng)는 그대로 두고 색상만 바꾼다.
function createMarkerElement(cafe) {
  const el = document.createElement('div')
  const color =
    cafe.status === 'closed'
      ? CLOSED_MARKER_COLOR
      : cafe.visited
        ? VISITED_MARKER_COLOR
        : getCategoryColor(cafe.category)

  el.style.cssText = `
    width: 22px;
    height: 22px;
    border-radius: 9999px;
    background: ${color};
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
  `

  if (cafe.visited) {
    el.textContent = '✓'
  }

  return el
}

// 카페 목록으로 마커를 다시 그린다. 기존 마커를 모두 지운 뒤 새로 그려서
// 마커가 겹쳐 쌓이지 않게 한다. (CLAUDE.md 지도/지오코딩 규칙)
function renderCafeMarkers(kakao, map, cafes, markersRef, infoWindowRef, onSelectCafe) {
  markersRef.current.forEach((marker) => marker.setMap(null))
  markersRef.current = []

  if (!infoWindowRef.current) {
    infoWindowRef.current = new kakao.maps.InfoWindow({ removable: true })
  }

  cafes
    .filter((cafe) => cafe.lat != null && cafe.lng != null)
    .forEach((cafe) => {
      const position = new kakao.maps.LatLng(cafe.lat, cafe.lng)
      const element = createMarkerElement(cafe)

      const overlay = new kakao.maps.CustomOverlay({
        position,
        content: element,
        map,
        xAnchor: 0.5,
        yAnchor: 0.5,
      })

      element.addEventListener('click', () => {
        const label = cafe.status === 'closed' ? `${escapeHtml(cafe.name)} (폐업)` : escapeHtml(cafe.name)
        infoWindowRef.current.setContent(
          `<div style="padding:6px 10px;font-size:13px;white-space:nowrap;">${label}</div>`
        )
        infoWindowRef.current.setPosition(position)
        infoWindowRef.current.open(map)
        onSelectCafe?.(cafe)
      })

      markersRef.current.push(overlay)
    })
}

export default function MapView({ cafes, onSelectCafe }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const infoWindowRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    loadKakaoMapSdk().then((kakao) => {
      if (cancelled || !containerRef.current) return

      mapRef.current = new kakao.maps.Map(containerRef.current, {
        center: new kakao.maps.LatLng(SEOUL_CITY_HALL.lat, SEOUL_CITY_HALL.lng),
        level: 4,
      })

      renderCafeMarkers(kakao, mapRef.current, cafes, markersRef, infoWindowRef, onSelectCafe)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapRef.current || !window.kakao?.maps) return
    renderCafeMarkers(window.kakao, mapRef.current, cafes, markersRef, infoWindowRef, onSelectCafe)
  }, [cafes, onSelectCafe])

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full rounded-lg border border-gray-200 bg-gray-100"
    />
  )
}
