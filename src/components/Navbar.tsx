import { useState } from 'react'
import { FiSearch, FiMenu, FiX, FiStar } from 'react-icons/fi'
import logoImg from '../assets/logo.png'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'होमपेज', href: '/' },
    { label: 'प्रदेश', href: '/pradesh', hasDropdown: true,pradeshobject: [] },
    { label: 'विचार', href: '/vichar' },
    { label: 'शिक्षा', href: '/shiksha' },
    { label: 'स्वास्थ्य', href: '/swasthya' },
    { label: 'खेलकुद', href: '/khel' },
    { label: 'अर्थतन्त्र', href: '/arthatantra', hasDropdown: true },
    { label: 'अन्य', href: '/anya', hasDropdown: true },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-15">
        {/* Left: Logo */}
        <a href="/" className="flex items-center">
          <img src={logoImg} alt="Yatripati Logo" className="h-10 w-auto" />
        </a>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <a href={item.href} className="text-gray-800 font-medium px-3 py-2 rounded transition-colors duration-300 hover:bg-gray-100 flex items-center">
                {item.label}
                {item.hasDropdown && <span className="ml-1">▾</span>}
              </a>
              {item.label === 'प्रदेश' && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded shadow-lg min-w-40 z-50 hidden group-hover:block">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <a key={num} href={`/pradesh-${num}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-300">
                      प्रदेश {num}
                    </a>
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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block py-3 text-gray-800 border-b border-gray-100 last:border-b-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
