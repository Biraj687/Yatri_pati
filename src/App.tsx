import { Routes, Route } from 'react-router-dom'
import { PortalLayout } from './layouts/PortalLayout'
import { GantavySection, NewsPackagesSection, HospitalitySection } from './components'
import { Home, ArticleDetail, CategoryPage } from './pages'
import { SiteConfigProvider, useSiteConfig } from './SiteConfigContext'
import './App.css'

function App() {
  return (
    <SiteConfigProvider>
      <AppContent />
    </SiteConfigProvider>
  )
}

function AppContent() {
  const { config } = useSiteConfig()
  const titles = config?.sectionTitles || {}

  return (
    <Routes>
      <Route path="/" element={
        <PortalLayout>
          <Home />
          <GantavySection title={titles.destination} />
          <NewsPackagesSection newsTitle={titles.latest} packageTitle={titles.packages} />
          <HospitalitySection hospitalityTitle={titles.hospitality} hotelsTitle={titles.hotels} />
        </PortalLayout>
      } />
      
      <Route path="/article/:id" element={
        <PortalLayout>
          <ArticleDetail />
        </PortalLayout>
      } />

      <Route path="/category/:categoryName" element={
        <PortalLayout>
          <CategoryPage />
        </PortalLayout>
      } />
    </Routes>
  )
}

export default App
