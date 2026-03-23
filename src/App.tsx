import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PortalLayout } from './layouts/PortalLayout'
import { GantavySection, NewsPackagesSection, HospitalitySection } from './components'
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext'
import { ThemeProvider } from './context/ThemeContext'
import { SearchProvider } from './context/SearchContext'
import { CategoryProvider } from './context/CategoryContext'
import { SkeletonLoader } from './components/SkeletonLoader'
import { ErrorBoundary } from './components/ErrorBoundary'

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail').then(module => ({ default: module.ArticleDetail })))
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(module => ({ default: module.CategoryPage })))

function App() {
  return (
    <SiteConfigProvider>
      <ThemeProvider>
        <SearchProvider>
          <CategoryProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </CategoryProvider>
        </SearchProvider>
      </ThemeProvider>
    </SiteConfigProvider>
  )
}

function AppContent() {
  const { config } = useSiteConfig()
  const titles = config?.sectionTitles || {}

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><SkeletonLoader type="detail" /></div>}>
      <Routes>
        <Route path="/" element={
          <PortalLayout>
            <Suspense fallback={<SkeletonLoader type="hero" />}>
              <Home />
            </Suspense>
            <GantavySection title={titles.destination} />
            <NewsPackagesSection newsTitle={titles.latest} packageTitle={titles.packages} />
            <HospitalitySection hospitalityTitle={titles.hospitality} hotelsTitle={titles.hotels} />
          </PortalLayout>
        } />
        
        <Route path="/news/:slug" element={
          <PortalLayout>
            <Suspense fallback={<SkeletonLoader type="detail" />}>
              <ArticleDetail />
            </Suspense>
          </PortalLayout>
        } />

        <Route path="/category/:slug" element={
          <PortalLayout>
            <Suspense fallback={<SkeletonLoader type="card" />}>
              <CategoryPage />
            </Suspense>
          </PortalLayout>
        } />
      </Routes>
    </Suspense>
  )
}

export default App
