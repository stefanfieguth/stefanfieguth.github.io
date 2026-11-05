import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Served from the root of the custom domain (stefanfieguth.ca, see
  // public/CNAME). If deploying to a sub-path like username.github.io/repo,
  // set this to '/repo/'.
  base: '/',
})
