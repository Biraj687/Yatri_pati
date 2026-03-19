import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

export function TopBar() {
  const nepaliDate = '२८ भदौ २०७९, मंगलबार'

  return (
    <div className="bg-white border-b border-gray-100 py-1.5 px-6 lg:px-8">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left: Nepali date */}
        <div className="text-gray-800 font-medium whitespace-nowrap text-[11px] md:text-xs">
          {nepaliDate}
        </div>

        {/* Center: Special series headline */}
        <div className="flex-1 text-center text-[11px] md:text-sm text-gray-800 hidden md:block">
          <span className="font-bold">विशेष श्रृंखला:</span>{' '}
          प्रधानमन्त्री देउवासँग अध्यक्ष लीको शिष्टाचार भेटवार्ता
        </div>

        {/* Right: Social media icons */}
        <div className="flex items-center gap-3">
          <a href="#" className="text-gray-800 text-sm hover:text-red-600 transition-colors" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" className="text-gray-800 text-sm hover:text-red-600 transition-colors" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" className="text-gray-800 text-sm hover:text-red-600 transition-colors" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" className="text-gray-800 text-sm hover:text-red-600 transition-colors" aria-label="YouTube"><FaYoutube /></a>
        </div>
      </div>
    </div>
  )
}
