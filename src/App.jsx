import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import PageMeta from './components/layout/PageMeta.jsx'
import ScrollManager from './components/layout/ScrollManager.jsx'
import { sectionRedirects } from './data/pageMeta.js'
import Home from './pages/Home.jsx'

// Every other route is code-split into its own chunk — a visitor on "/"
// (the common entry point) never downloads the other pages' bundles until
// they actually navigate there.
//
// To add a page: create it in src/pages/, add a lazy import and a <Route>
// below, add its link to src/data/navLinks.js, and its title/description
// to src/data/pageMeta.js (plus a body in scripts/prerender.mjs).
const Experience  = lazy(() => import('./pages/Experience.jsx'))
const Mechanical  = lazy(() => import('./pages/projects/Mechanical.jsx'))
const Printing    = lazy(() => import('./pages/projects/Printing.jsx'))
const Electrical  = lazy(() => import('./pages/projects/Electrical.jsx'))
const Woodworking = lazy(() => import('./pages/projects/Woodworking.jsx'))
const Other       = lazy(() => import('./pages/projects/Other.jsx'))
const DetailedReport = lazy(() => import('./pages/DetailedReport.jsx'))
const NotFound    = lazy(() => import('./pages/NotFound.jsx'))

export default function App() {
  return (
    <BrowserRouter>
      <PageMeta />
      <ScrollManager />
      <Navbar />
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/"                     element={<Home />} />
            <Route path="/experience/:jobId?"   element={<Experience />} />
            <Route path="/projects"             element={<Navigate to={sectionRedirects['/projects']} replace />} />
            <Route path="/projects/mechanical"  element={<Mechanical />} />
            <Route path="/projects/3d-printing" element={<Printing />} />
            <Route path="/projects/electrical"  element={<Electrical />} />
            <Route path="/projects/woodworking" element={<Woodworking />} />
            <Route path="/projects/other"       element={<Other />} />
            <Route path="/reports/:reportId"    element={<DetailedReport />} />
            <Route path="*"                     element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
