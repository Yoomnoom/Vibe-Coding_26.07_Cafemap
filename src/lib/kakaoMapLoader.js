// 카카오맵 SDK를 앱 전체에서 한 번만 로드하기 위한 싱글턴 로더.
// (CLAUDE.md: SDK <script>는 한 번만 로드, libraries=services 필수)
let kakaoLoaderPromise = null

export function loadKakaoMapSdk() {
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao)
  }

  if (kakaoLoaderPromise) {
    return kakaoLoaderPromise
  }

  kakaoLoaderPromise = new Promise((resolve, reject) => {
    const appKey = import.meta.env.VITE_KAKAO_MAP_KEY
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao))
    }
    script.onerror = reject
    document.head.appendChild(script)
  })

  return kakaoLoaderPromise
}
