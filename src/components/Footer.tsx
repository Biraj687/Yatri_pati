import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiGithub, FiYoutube } from 'react-icons/fi'
import { SiDribbble } from 'react-icons/si'
import { useSiteConfig } from '../context/SiteConfigContext'
import logoSvg from '../assets/logo.svg'

export function Footer() {
  const { config } = useSiteConfig()

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return FiFacebook;
      case 'instagram': return FiInstagram;
      case 'twitter': return FiTwitter;
      case 'github': return FiGithub;
      case 'youtube': return FiYoutube;
      case 'dribbble': return SiDribbble;
      default: return FiGithub;
    }
  };

  if (!config) return null;

  return (
    <footer className="bg-black text-white w-full">
      <div className="w-full py-10 px-6 lg:px-8">
        {/* Top Section - Logo and Social Icons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12 text-left">
          {/* Left: Logo and Nepali Text */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <Link to="/" className="flex items-center gap-2">
                <img src={logoSvg} alt="Logo" className="h-10 w-auto invert brightness-100" />
              </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm font-noto">
              {config.footer.aboutText}
            </p>
            {/* Social Icons */}
            <div className="flex gap-5">
              {config.socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a 
                    key={link.platform} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-red-500 transition-colors duration-300"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Columns */}
          {config.footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2 uppercase text-sm font-noto">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.isExternal ? (
                      <a 
                        href={link.path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-300 text-sm hover:text-white transition-colors font-noto"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        to={link.path} 
                        className="text-gray-300 text-sm hover:text-white transition-colors font-noto"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section - Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm font-noto">
            {config.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
