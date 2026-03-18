import { Routes, Route } from 'react-router-dom'
import { PortalLayout } from './layouts/PortalLayout'
import { GantavySection, NewsPackagesSection, HospitalitySection } from './components'
import { Home, ArticleDetail, CategoryPage } from './pages'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <PortalLayout>
          <Home />
          <GantavySection />
          <NewsPackagesSection />
          <HospitalitySection />
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
