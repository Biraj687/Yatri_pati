import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

export function TopBar() {
  const nepaliDate = '२८ फाल्गुन २०८२, मंगलबार'

  return (
    <div className="bg-white border-b border-gray-200 text-sm">
      {/* Top: Center aligned Breaking news */}
      <div className="py-1.5 border-b border-gray-100">
      <div className="w-full text-center text-xs text-gray-800 px-6 lg:px-8">
          <span className="font-semibold text-blue-600">विशेष ब्रिफिङ:</span>{' '}
          प्रधानमन्त्री देउवासँग अध्यक्ष लिंखी शिवाचार भेटवार्ता
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Nepali date */}
        <div className="text-gray-800 font-medium whitespace-nowrap text-[10px] md:text-xs">
          {nepaliDate}
        </div>

        {/* Right: Social media icons */}
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 text-base md:text-sm hover:text-blue-600" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" className="text-gray-600 text-base md:text-sm hover:text-blue-600" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="text-gray-600 text-base md:text-sm hover:text-blue-600" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="text-gray-600 text-base md:text-sm hover:text-blue-600" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>
    </div>
  )
}
