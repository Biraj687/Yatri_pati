import { lazy, Suspense, useEffect } from 'react'
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

function DashboardRedirect() {
  useEffect(() => {
    const dashboardBase = (import.meta.env.VITE_DASHBOARD_URL as string | undefined) || 'http://localhost:5174';
    const currentUrl = new URL(window.location.href);
    const dashPath = currentUrl.pathname.replace(/^\/dashboard/, '') || '/';
    const target = `${dashboardBase}${dashPath}${currentUrl.search}${currentUrl.hash}`;
    window.location.replace(target);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700">
      Redirecting to dashboard...
    </div>
  );
}

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
              height="120px"
              maxWidth="max-w-[1440px]"
              center={true}
              className="mt-8"
            />
            <GantavySection title={titles.destination} />
            <AdBanner
              id="ad-banner-2"
              adText="Advertisement Space 2"
              height="100px"
              maxWidth="max-w-[1440px]"
              center={true}
            />
            <NewsPackagesSection newsTitle={titles.latest} packageTitle={titles.packages} />
            <AdBanner
              id="ad-banner-3"
              adText="Advertisement Space 3"
              height="100px"
              maxWidth="max-w-[1440px]"
              center={true}
            />
            <HospitalitySection hospitalityTitle={titles.hospitality} hotelsTitle={titles.hotels} />
            <AdBanner
              id="ad-banner-4"
              adText="Advertisement Space 4"
              height="120px"
              maxWidth="max-w-[1440px]"
              center={true}
              className="mb-8"
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

        <Route path="/dashboard/*" element={<DashboardRedirect />} />
      </Routes>
    </Suspense>
  )
}

export default App
