import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
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
