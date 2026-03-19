import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSearch, FiMenu, FiX, FiSun } from 'react-icons/fi'
import logoSvg from '../assets/logo.svg'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'होमपेज', href: '/' },
    { label: 'प्रदेश', href: '/category/pradesh', hasDropdown: true },
    { label: 'विचार', href: '/category/vichar' },
    { label: 'शिक्षा', href: '/category/shiksha' },
    { label: 'स्वास्थ्य', href: '/category/swasthya' },
    { label: 'खेलकुद', href: '/category/khel' },
    { label: 'अर्थतन्त्र', href: '/category/arthatantra', hasDropdown: true },
    { label: 'अन्य', href: '/category/anya', hasDropdown: true },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-6 lg:px-8">
      <div className="w-full flex items-center justify-between h-16">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img src={logoSvg} alt="Yatripati Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <div key={item.label} className="relative group h-16 flex items-center">
              <Link 
                to={item.href} 
                className={`text-gray-900 font-bold px-3 py-1 text-sm lg:text-base transition-colors duration-300 flex items-center h-full border-b-2 ${
                  isActive(item.href) ? 'border-red-600' : 'border-transparent hover:border-red-600'
                }`}
              >
                {item.label}
                {item.hasDropdown && <span className="ml-1 text-[10px]">▼</span>}
              </Link>
              {item.label === 'प्रदेश' && (
                <div className="absolute top-full left-0 bg-white border border-gray-100 rounded-b shadow-xl min-w-[200px] z-50 hidden group-hover:block py-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <Link 
                      key={num} 
                      to={`/category/pradesh-${num}`} 
                      className="block px-6 py-2.5 text-sm text-gray-800 hover:bg-gray-50 hover:text-red-600 transition-colors"
                    >
                      प्रदेश {num}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          <button className="text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Theme Toggle">
            <FiSun size={20} />
          </button>
          <button className="text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Search">
            <FiSearch size={20} />
          </button>
          
          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out transform md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <img src={logoSvg} alt="Yatripati Logo" className="h-8 w-auto" />
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <FiX size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-8">
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className={`block py-3 px-2 text-lg font-bold transition-colors ${
                      isActive(item.href) ? 'text-red-600' : 'text-gray-800 hover:text-red-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.label === 'प्रदेश' && (
                    <div className="pl-4 space-y-2 mb-4 border-l-2 border-gray-100 ml-2">
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <Link 
                          key={num} 
                          to={`/category/pradesh-${num}`} 
                          className="block py-2 text-gray-600 hover:text-red-600 text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          प्रदेश {num}
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
    </nav>
  )
}
