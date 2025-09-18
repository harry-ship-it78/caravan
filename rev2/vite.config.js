import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Important when serving from https://<user>.github.io/<repo>/
  base: '/caravan/',
})
