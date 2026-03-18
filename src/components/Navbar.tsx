import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiMenu, FiX, FiStar } from 'react-icons/fi'
import logoImg from '../assets/logo.png'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full flex items-center justify-between h-15">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center">
          <img src={logoImg} alt="Yatripati Logo" className="h-10 w-auto" />
        </Link>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <Link to={item.href} className="text-gray-800 font-medium px-3 py-2 rounded transition-colors duration-300 hover:bg-gray-100 flex items-center">
                {item.label}
                {item.hasDropdown && <span className="ml-1">▾</span>}
              </Link>
              {item.label === 'प्रदेश' && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded shadow-lg min-w-40 z-50 hidden group-hover:block">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <Link key={num} to={`/category/pradesh-${num}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-300">
                      प्रदेश {num}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          <button className="text-gray-600 p-2 rounded transition-colors duration-300 hover:bg-gray-100" aria-label="Bookmark">
            <FiStar />
          </button>
          <button className="text-gray-600 p-2 rounded transition-colors duration-300 hover:bg-gray-100" aria-label="Search">
            <FiSearch />
          </button>
          <button
            className="md:hidden text-gray-600 p-2 rounded transition-colors duration-300 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out transform md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <img src={logoImg} alt="Yatripati Logo" className="h-8 w-auto" />
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-600 p-2">
              <FiX size={24} />
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-gray-100 last:border-0 py-2">
                <Link
                  to={item.href}
                  className="block py-3 text-lg font-medium text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.label === 'प्रदेश' && (
                  <div className="pl-4 mt-2 space-y-2 pb-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <Link 
                        key={num} 
                        to={`/category/pradesh-${num}`} 
                        className="block text-gray-600 hover:text-blue-600"
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
    </nav>
  )
}
