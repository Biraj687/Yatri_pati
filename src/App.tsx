import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PortalLayout } from '@layouts/PortalLayout'
import { GantavySection, NewsPackagesSection, HospitalitySection, SkeletonLoader, ErrorBoundary, AdBanner } from '@components'
import { SiteConfigProvider, useSiteConfig } from '@context/SiteConfigContext'
import { ThemeProvider } from '@context/ThemeContext'
import { SearchProvider } from '@context/SearchContext'
import { CategoryProvider } from '@context/CategoryContext'

// Lazy load page components for code splitting
const Home = lazy(() => import('@pages/Home').then(module => ({ default: module.Home })))
const ArticleDetail = lazy(() => import('@pages/ArticleDetail').then(module => ({ default: module.ArticleDetail })))
const CategoryPage = lazy(() => import('@pages/CategoryPage').then(module => ({ default: module.CategoryPage })))

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
            <AdBanner 
              id="ad-banner-1"
              adText="Advertisement Space 1"
              height="100px"
            />
            <GantavySection title={titles.destination} />
            <AdBanner 
              id="ad-banner-2"
              adText="Advertisement Space 2"
              height="100px"
            />
            <NewsPackagesSection newsTitle={titles.latest} packageTitle={titles.packages} />
            <AdBanner 
              id="ad-banner-3"
              adText="Advertisement Space 3"
              height="100px"
            />
            <HospitalitySection hospitalityTitle={titles.hospitality} hotelsTitle={titles.hotels} />
            <AdBanner 
              id="ad-banner-4"
              adText="Advertisement Space 4"
              height="100px"
            />
          </PortalLayout>
        } />
        
        <Route path="/news/:id" element={
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
