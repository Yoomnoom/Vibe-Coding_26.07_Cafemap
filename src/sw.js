// 커스텀 서비스 워커 (injectManifest 전략).
// 카카오맵/Supabase는 온라인이 필수라 앱 화면 자체를 오프라인 캐시하지 않는다.
// 페이지 이동(navigate) 요청이 네트워크에 실패하면 offline.html만 보여준다.
const OFFLINE_URL = 'offline.html'
const OFFLINE_CACHE = 'offline-cache-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(OFFLINE_CACHE).then((cache) => cache.add(OFFLINE_URL)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return

  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL))
  )
})
