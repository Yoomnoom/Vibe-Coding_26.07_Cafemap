// 주소 하나를 카카오 지오코더로 좌표 변환한다. 실패하면 null.
export function geocodeAddress(kakao, address) {
  return new Promise((resolve) => {
    const geocoder = new kakao.maps.services.Geocoder()
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        resolve({ lat: Number(result[0].y), lng: Number(result[0].x) })
      } else {
        resolve(null)
      }
    })
  })
}

// 좌표 → 행정구역(동) 역지오코딩. 지역 정복 시스템(PRD 3.10)의 지역 판정 기준.
// 행정동(H) 우선, 없으면 법정동(B). 둘 다 없으면 null(= "지역 미분류").
export function reverseGeocodeRegion(kakao, lat, lng) {
  return new Promise((resolve) => {
    const geocoder = new kakao.maps.services.Geocoder()
    geocoder.coord2RegionCode(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const region =
          result.find((item) => item.region_type === 'H') ||
          result.find((item) => item.region_type === 'B')
        resolve(region?.region_3depth_name || null)
      } else {
        resolve(null)
      }
    })
  })
}

// 카카오 API 요청 한도를 넘기지 않도록 주소를 하나씩 순서대로 지오코딩한다.
// (CLAUDE.md 지도/지오코딩 규칙) 좌표 변환 성공 시 지역(region)도 함께 판정한다.
export async function geocodeCafesSequentially(kakao, cafeRows, onProgress) {
  const geocoded = []
  const failed = []

  for (let i = 0; i < cafeRows.length; i++) {
    const row = cafeRows[i]
    const coords = await geocodeAddress(kakao, row.address)

    if (coords) {
      const region = await reverseGeocodeRegion(kakao, coords.lat, coords.lng)
      geocoded.push({ ...row, ...coords, region })
    } else {
      failed.push(row)
    }

    onProgress?.({ current: i + 1, total: cafeRows.length })
  }

  return { geocoded, failed }
}
