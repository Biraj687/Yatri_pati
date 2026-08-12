import { useFrontendControl } from '@context/FrontendControlContext';

/**
 * LIVE PREVIEW - See changes to your website in real-time
 * Shows how hero, navbar, sections, ads, and footer appear with current Master Dashboard settings
 */
export function LivePreviewPage() {
  const { heroConfig, navbarConfig, sections, advertisements, footerConfig } = useFrontendControl();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav
        className={`${navbarConfig.sticky ? 'sticky top-0 z-50' : ''} w-full shadow-md`}
        style={{ backgroundColor: navbarConfig.backgroundColor }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div style={{ color: navbarConfig.logoColor }} className="text-2xl font-bold">
            {navbarConfig.logoText}
          </div>

          {/* Search Bar */}
          {navbarConfig.searchEnabled && (
            <input
              type="text"
              placeholder="Search..."
              style={{ color: navbarConfig.textColor, borderColor: navbarConfig.logoColor }}
              className="px-4 py-2 border-2 rounded-lg bg-transparent"
            />
          )}

          {/* Categories */}
          {navbarConfig.showCategories && (
            <div className="flex gap-6">
              {navbarConfig.categories
                .filter(c => c.visible)
                .map((cat, idx) => (
                  <a
                    key={idx}
                    href="#"
                    style={{ color: navbarConfig.textColor }}
                    className="font-semibold hover:opacity-70 transition"
                  >
                    {cat.name}
                  </a>
                ))}
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      {heroConfig.visible && (
        <div className="relative w-full h-96 bg-gray-300 overflow-hidden">
          {heroConfig.image && (
            <img
              src={heroConfig.image}
              alt="Hero"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
            <h1 style={{ color: '#ffffff' }} className="text-5xl font-bold mb-4">
              {heroConfig.title}
            </h1>
            <p style={{ color: '#ffffff' }} className="text-2xl">
              {heroConfig.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* ADS - BEFORE SECTIONS */}
      {advertisements
        .filter(ad => ad.position === 'hero-bottom' && ad.visible)
        .map(ad => (
          <div key={ad.id} className="max-w-7xl mx-auto px-4 py-6">
            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block">
              <img
                src={ad.image}
                alt={ad.name}
                className="w-full h-auto rounded-lg hover:opacity-90 transition"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </a>
          </div>
        ))}

      {/* MAIN CONTENT SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {sections.map((section, idx) => {
          if (!section.visible) return null;

          return (
            <div key={section.id}>
              {/* AD Before Section */}
              {advertisements
                .filter(ad => ad.position === `after-${idx === 0 ? 'latest' : idx === 1 ? 'trending' : idx === 2 ? 'packages' : idx === 3 ? 'hospitality' : 'destinations'}` && ad.visible)
                .map(ad => (
                  <div key={ad.id} className="mb-8">
                    <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={ad.image}
                        alt={ad.name}
                        className="w-full h-auto rounded-lg hover:opacity-90 transition"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </a>
                  </div>
                ))}

              {/* Section Title */}
              <h2 className="text-4xl font-bold text-secondary-700 mb-8">{section.name}</h2>

              {/* Section Content Based on Layout */}
              {section.layout === 'grid-3' && (
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[...Array(Math.min(section.maxArticles, 3))].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="w-full h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-semibold">
                        Article {i + 1}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-secondary-700 mb-2">Sample Article Title</h3>
                        <p className="text-sm text-gray-600 mb-4">Sample article description...</p>
                        <a href="#" className="text-blue-600 font-semibold hover:underline">
                          Read More →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.layout === 'grid-4' && (
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[...Array(Math.min(section.maxArticles, 4))].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="w-full h-32 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        Article {i + 1}
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-secondary-700 mb-1 text-sm">Article {i + 1}</h3>
                        <p className="text-xs text-gray-600">Brief description...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.layout === 'featured-compact' && (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* Featured */}
                  <div className="col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="w-full h-60 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-lg font-semibold">
                      Featured Article
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-secondary-700 mb-2 text-2xl">Featured Article</h3>
                      <p className="text-gray-600 mb-4">Detailed description of featured article...</p>
                      <a href="#" className="text-blue-600 font-semibold hover:underline">
                        Read Full Story →
                      </a>
                    </div>
                  </div>

                  {/* Compact List */}
                  <div className="col-span-1 space-y-3">
                    {[...Array(Math.min(section.maxArticles - 1, 4))].map((_, i) => (
                      <div key={i} className="flex gap-3 pb-3 border-b">
                        <div className="w-20 h-20 bg-gray-300 rounded flex-shrink-0 flex items-center justify-center text-gray-600 font-semibold">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">Article {i + 1}</h4>
                          <p className="text-sm text-gray-600">Compact article preview...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ADS FOOTER SECTION */}
      {advertisements
        .filter(ad => ad.position === 'before-footer' && ad.visible)
        .map(ad => (
          <div key={ad.id} className="max-w-7xl mx-auto px-4 py-6">
            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block">
              <img
                src={ad.image}
                alt={ad.name}
                className="w-full h-auto rounded-lg hover:opacity-90 transition"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </a>
          </div>
        ))}

      {/* FOOTER */}
      <footer
        className="mt-12"
        style={{ backgroundColor: footerConfig.backgroundColor, color: footerConfig.textColor }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h4 className="text-2xl font-bold mb-3">{footerConfig.companyName}</h4>
              <p className="text-sm opacity-75">{footerConfig.description}</p>
            </div>

            {/* Footer Links */}
            {footerConfig.links.filter(l => l.visible).length > 0 && (
              <div>
                <h5 className="font-bold mb-3">Quick Links</h5>
                <ul className="space-y-2 text-sm opacity-75">
                  {footerConfig.links
                    .filter(l => l.visible)
                    .map((link, idx) => (
                      <li key={idx}>
                        <a href={link.url} className="hover:opacity-100 transition">
                          {link.name}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Social Links */}
            {footerConfig.social.filter(s => s.visible).length > 0 && (
              <div>
                <h5 className="font-bold mb-3">Follow Us</h5>
                <ul className="space-y-2 text-sm opacity-75">
                  {footerConfig.social
                    .filter(s => s.visible)
                    .map((social, idx) => (
                      <li key={idx}>
                        <a href={social.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition">
                          {social.platform}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-opacity-20 pt-8 text-center text-sm opacity-75">
            <p>© 2026 {footerConfig.companyName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LivePreviewPage;
