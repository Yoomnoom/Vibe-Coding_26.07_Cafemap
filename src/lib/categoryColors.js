// 카테고리별 마커/배지 색상. 카테고리 문자열을 해시해 고정 팔레트에서 고른다.
// 같은 카테고리는 항상 같은 색, 카테고리가 없으면 기본 회색을 쓴다.
const PALETTE = ['#b45309', '#db2777', '#059669', '#2563eb', '#7c3aed', '#ea580c', '#0891b2', '#65a30d']

export const DEFAULT_CATEGORY_COLOR = '#6b7280'

// 방문 체크된 마커는 카테고리와 무관하게 이 색으로 고정 — 지도에서 한눈에 구분되도록.
export const VISITED_MARKER_COLOR = '#111827'

export function getCategoryColor(category) {
  if (!category) return DEFAULT_CATEGORY_COLOR

  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0
  }

  return PALETTE[hash % PALETTE.length]
}
