import { Header, Footer, GantavySection, BannerSection, NewsPackagesSection } from './components'
import { Home } from './pages'

function App() {
  return (
    <div className="app">
      <Header />
      <Home />
      <BannerSection />
      <GantavySection />
      <NewsPackagesSection />
      <Footer />
    </div>
  )
}

export default App
