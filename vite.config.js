import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        // 커스텀 sw.js가 self.__WB_MANIFEST를 쓰지 않으므로 주입 지점 검사를 끈다.
        injectionPoint: undefined,
      },
      registerType: 'autoUpdate',
      manifest: {
        name: '우리 동네 카페 지도',
        short_name: '카페지도',
        description: '엑셀로 정리한 카페 목록을 지도에 표시하고 방문 소감을 기록하는 서비스',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        // 개발 서버에서는 PWA를 끈다(HMR과 서비스 워커 캐시가 서로 방해할 수 있음).
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      // 엑셀 파일은 소스 코드가 아니며, 엑셀 프로그램에서 열려 있으면
      // Windows에서 파일이 잠겨(EBUSY) 감시 시 dev 서버가 죽을 수 있다.
      ignored: ['**/*.xlsx'],
    },
  },
})
