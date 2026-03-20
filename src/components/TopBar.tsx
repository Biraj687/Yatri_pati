import { useState, useEffect } from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa'
import { useSiteConfig } from '../SiteConfigContext'
import { NepaliDate } from 'nepali-date-library'

export function TopBar() {
  const { config } = useSiteConfig()
  const [todayBS, setTodayBS] = useState<NepaliDate | null>(null)

  useEffect(() => {
    setTodayBS(new NepaliDate())
  }, [])

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

  const formattedBS = todayBS ? todayBS.format('d mmmm yyyy, dddd') : '';

  return (
    <div className="bg-white border-b border-gray-100 py-1.5 px-[5rem]">
      <div className="w-full flex items-center justify-between">
        {/* Left: Nepali date */}
        <div className="text-gray-900 font-medium whitespace-nowrap text-[11px] md:text-sm font-noto">
          {formattedBS}
        </div>

        {/* Center: Dynamic Ticker News */}
        <div className="flex-1 flex justify-center items-center gap-2 text-[11px] md:text-sm text-gray-800 hidden md:flex overflow-hidden">
          <span className="font-bold text-gray-900 whitespace-nowrap">विशेष शृंखला:</span>
          <span className="truncate max-w-lg hover:text-red-600 transition-colors cursor-pointer">
            {config.tickerNews[0]}
          </span>
        </div>

        {/* Right: Dynamic Social Links */}
        <div className="flex items-center gap-4">
          {config.socialLinks.map((link) => (
            <a 
              key={link.platform}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:opacity-70 transition-opacity" 
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
