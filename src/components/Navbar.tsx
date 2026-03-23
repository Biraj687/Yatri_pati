import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSearch, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa'
import { useSiteConfig } from '../context/SiteConfigContext'
import { useTheme } from '../context/ThemeContext'
import { useSearch } from '../context/SearchContext'
import { SearchBar } from './SearchBar'
import { NepaliDate } from 'nepali-date-library'
import logoSvg from '../assets/logo.svg'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const location = useLocation()
  const { config, loading } = useSiteConfig()
  const { toggleTheme, isDark } = useTheme()
  const { openSearch, closeSearch } = useSearch()
  
  const [todayBS, setTodayBS] = useState<NepaliDate | null>(null)

  useEffect(() => {
    setTodayBS(new NepaliDate())
  }, [])

  const handleSearchClick = () => {
    setSearchModalOpen(true)
    openSearch()
  }

  const handleCloseSearch = () => {
    setSearchModalOpen(false)
    closeSearch()
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <FaFacebook />;
      case 'instagram': return <FaInstagram />;
      case 'twitter': return <FaTwitter />;
      case 'youtube': return <FaYoutube />;
      case 'github': return <FaGithub />;
      default: return null;
    }
  };

  const isActive = (path: string) => location.pathname === path

  if (loading || !config) {
    return (
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-6 lg:px-8 h-16 flex items-center">
        <div className="h-8 w-32 bg-gray-100 animate-pulse rounded"></div>
      </nav>
    )
  }

  const formattedBS = todayBS ? todayBS.format('d mmmm yyyy, dddd') : '';

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-50 transition-colors duration-300 flex flex-col items-center w-full border-b-4 border-double border-gray-900 dark:border-gray-100">
      {/* Very Top Row: Date | Ticker | Socials */}
      <div className="hidden md:flex w-full items-center justify-between px-4 md:px-8 lg:px-[5rem] py-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex-1 text-[11px] md:text-sm font-noto font-bold text-gray-900 dark:text-gray-100">
          {formattedBS}
        </div>
        
        <div className="flex-[2] flex justify-center items-center gap-2 text-[11px] md:text-sm text-gray-800 dark:text-gray-300 overflow-hidden">
          <span className="font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap lg:text-base">आजको विशेषांक:</span>
          <span className="truncate max-w-[400px] hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer lg:text-base">
            {config.tickerNews[0]}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
           {config.socialLinks.map((link) => (
              <a 
                key={link.platform}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-800 dark:text-gray-300 hover:opacity-70 transition-opacity" 
                aria-label={link.platform}
              >
                {getSocialIcon(link.platform)}
              </a>
           ))}
        </div>
      </div>

      {/* Middle Row: Logo and Tools */}
      <div className="w-full relative flex items-center justify-between md:justify-center px-4 md:px-8 lg:px-[5rem] py-4 border-b border-gray-50 dark:border-gray-800 md:border-b-0">
        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-gray-800 dark:text-gray-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Center: Smaller Logo */}
        <Link to="/" className="flex items-center">
          <img src={logoSvg} alt="Logo" className="h-8 md:h-10 lg:h-12 w-auto dark:invert dark:brightness-200" />
        </Link>

        {/* Right tools (Search, Theme) */}
        <div className="flex items-center gap-4 md:absolute md:right-8 lg:right-[5rem]">
          <button
            onClick={toggleTheme}
            className="text-gray-800 dark:text-gray-200 hover:opacity-70 transition-opacity"
            aria-label="Theme Toggle"
          >
            {isDark ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
          <button
            onClick={handleSearchClick}
            className="text-gray-800 dark:text-gray-200 hover:opacity-70 transition-opacity"
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Row: Centered Navigation Links */}
      <div className="hidden md:flex w-full justify-center items-center px-4 mb-2">
        <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 max-w-7xl">
          {config.navigation.map((item) => (
            <div key={item.label} className="relative group flex items-center h-12">
              <Link 
                to={item.path} 
                className={`text-gray-900 dark:text-gray-100 font-bold px-2 text-base lg:text-lg transition-colors duration-300 flex items-center h-full hover:text-black dark:hover:text-white`}
              >
                {item.label}
                {item.hasDropdown && <span className="ml-1 text-xs opacity-50">▼</span>}
              </Link>
              {item.hasDropdown && item.dropdownItems && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-b shadow-xl min-w-[160px] z-50 hidden group-hover:block py-2">
                  {item.dropdownItems.map((sub) => (
                    <Link 
                      key={sub.label} 
                      to={sub.path} 
                      className="block px-6 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-gray-900 z-50 shadow-2xl transition-transform duration-300 ease-in-out transform md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <img src={logoSvg} alt="Logo" className="h-8 w-auto dark:invert dark:brightness-200" />
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <FiX size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-8">
            <div className="space-y-1">
              {config.navigation.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.path}
                    className={`block py-3 px-2 text-lg font-bold transition-colors ${
                      isActive(item.path) ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.hasDropdown && item.dropdownItems && (
                    <div className="pl-4 space-y-2 mb-4 border-l-2 border-gray-100 ml-2">
                      {item.dropdownItems.map((sub) => (
                        <Link 
                          key={sub.label} 
                          to={sub.path} 
                          className="block py-2 text-gray-600 hover:text-red-600 text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-start justify-center pt-20 md:pt-32 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">समाचार खोज्नुहोस्</h3>
              <button
                onClick={handleCloseSearch}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close search"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <SearchBar
              autoFocus={true}
              useContext={true}
              className="mb-6"
            />
            
            {/* Search results would go here */}
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <FiSearch size={48} className="mx-auto mb-4 opacity-30" />
              <p>खोज्नको लागि टाइप गर्नुहोस्...</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
