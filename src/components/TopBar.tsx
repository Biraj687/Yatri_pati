import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa'
import { useSiteConfig } from '../SiteConfigContext'

export function TopBar() {
  const { config } = useSiteConfig()
  
  // Format current date in Nepali
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const nepaliDate = today.toLocaleDateString('ne-NP', options);

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

  if (!config) return null;

  return (
    <div className="bg-white border-b border-gray-100 py-1.5 px-6 lg:px-8">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left: Nepali date */}
        <div className="text-gray-800 font-medium whitespace-nowrap text-[11px] md:text-xs font-noto">
          {nepaliDate}
        </div>

        {/* Center: Dynamic Ticker News */}
        <div className="flex-1 text-center text-[11px] md:text-sm text-gray-800 hidden md:block overflow-hidden">
          <div className="inline-flex items-center gap-2">
            <span className="font-bold text-red-600">ताजा:</span>{' '}
            <span className="animate-pulse">{config.tickerNews[0]}</span>
          </div>
        </div>

        {/* Right: Dynamic Social Links */}
        <div className="flex items-center gap-3">
          {config.socialLinks.map((link) => (
            <a 
              key={link.platform}
              href={link.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 text-sm hover:text-red-600 transition-colors" 
              aria-label={link.platform}
            >
              {getSocialIcon(link.platform)}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
