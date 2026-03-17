import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

export function TopBar() {
  const nepaliDate = '२८ फाल्गुन २०८२, मंगलबार'

  return (
    <div className="topbar">
      <div className="topbar-inner">
        {/* Left: Nepali date */}
        <div className="topbar-date">
          {nepaliDate}
        </div>

        {/* Center: Breaking news */}
        <div className="topbar-news">
          <span className="topbar-news-label">विशेष ब्रिफिङ:</span>{' '}
          प्रधानमन्त्री देउवासँग अध्यक्ष लिंखी शिवाचार भेटवार्ता
        </div>

        {/* Right: Social media icons */}
        <div className="topbar-social">
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="YouTube"><FaYoutube /></a>
        </div>
      </div>
    </div>
  )
}
