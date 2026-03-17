import { Header, Footer, GantavySection, NewsPackagesSection } from './components'
import { Home } from './pages'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <Home />
      <GantavySection />
      <NewsPackagesSection />
      <Footer />
    </div>
  )
}

export default App
