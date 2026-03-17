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
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Left: Logo */}
        <a href="/" className="navbar-logo">
          <img src={logoImg} alt="Yatripati Logo" className="navbar-logo-img" />
        </a>

        {/* Center: Desktop Navigation */}
        <div className="navbar-links">
          {navItems.map((item) => (
            <div key={item.label} className="navbar-item-container">
              <a href={item.href} className="navbar-link">
                {item.label}
                {item.hasDropdown && <span className="dropdown-arrow">▾</span>}
              </a>
              {item.label === 'प्रदेश' && (
                <div className="dropdown-menu">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <a key={num} href={`/pradesh-${num}`} className="dropdown-link">
                      प्रदेश {num}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Icons */}
        <div className="navbar-icons">
          <button className="navbar-icon-btn" aria-label="Bookmark">
            <FiStar />
          </button>
          <button className="navbar-icon-btn" aria-label="Search">
            <FiSearch />
          </button>
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="navbar-mobile-link"
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
