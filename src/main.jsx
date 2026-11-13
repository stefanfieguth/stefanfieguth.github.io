import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted Inter, restricted to the weights index.css actually declares
// (see --weight-* tokens) and to the latin/latin-ext subsets this
// English-language site renders — @fontsource's unmarked `300.css` etc.
// each pull in every script (cyrillic, greek, vietnamese...), which no
// visitor here needs. Every file still ships `font-display: swap`.
import '@fontsource/inter/latin-300.css'
import '@fontsource/inter/latin-ext-300.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-ext-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-ext-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-ext-700.css'
// Regular-weight Latin file, imported for its resolved (content-hashed)
// build URL so it can be preloaded below — body copy on every page is set
// in this weight, and it's used above the fold everywhere. Vite hashes the
// font filename at build time, so this can't be a static <link rel=preload>
// in index.html; injecting it as the very first thing the entry module
// does is the earliest equivalent.
import interRegularWoff2 from '@fontsource/inter/files/inter-latin-400-normal.woff2?url'
import './index.css'
import App from './App.jsx'

const fontPreload = document.createElement('link')
fontPreload.rel = 'preload'
fontPreload.as = 'font'
fontPreload.type = 'font/woff2'
fontPreload.href = interRegularWoff2
fontPreload.crossOrigin = 'anonymous'
document.head.appendChild(fontPreload)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
