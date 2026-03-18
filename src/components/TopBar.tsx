import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

export function TopBar() {
  const nepaliDate = '२८ फाल्गुन २०८२, मंगलबार'

  return (
    <div className="bg-white border-b border-gray-200 text-sm">
      {/* Top: Center aligned Breaking news */}
      <div className="py-1.5 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 text-center text-xs text-gray-800">
          <span className="font-semibold text-blue-600">विशेष ब्रिफिङ:</span>{' '}
          प्रधानमन्त्री देउवासँग अध्यक्ष लिंखी शिवाचार भेटवार्ता
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between">
        {/* Left: Nepali date */}
        <div className="text-gray-800 font-medium whitespace-nowrap text-xs">
          {nepaliDate}
        </div>

        {/* Right: Social media icons & Login */}
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <a href="#" className="text-gray-600 text-sm transition-colors duration-300 hover:text-blue-600" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" className="text-gray-600 text-sm transition-colors duration-300 hover:text-blue-600" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="text-gray-600 text-sm transition-colors duration-300 hover:text-blue-600" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="text-gray-600 text-sm transition-colors duration-300 hover:text-blue-600" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>
    </div>
  )
}
