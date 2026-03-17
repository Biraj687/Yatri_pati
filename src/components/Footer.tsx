import { FiFacebook, FiInstagram, FiTwitter, FiGithub } from 'react-icons/fi'
import { SiDribbble } from 'react-icons/si'
import logoImg from '../assets/logo.png'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

        {/* Column 1: Logo + Description + Socials */}
        <div className="lg:col-span-2">
          <a href="/" className="mb-4 block">
            <img src={logoImg} alt="Yatri Pati" className="h-10 w-auto" />
          </a>
          <p className="text-gray-300 text-sm leading-relaxed mb-5">
            प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सरह सम्झनुपर्दछ । थोमस हब्स
            प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सम्झनुपर्दछ । थोमस हब्स
            प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सरह सम्झनुपर्दछ । थोमस हब्स
          </p>
          <div className="flex gap-3">
            <a href="#" className="text-gray-300 text-lg hover:text-white transition-colors duration-300" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" className="text-gray-300 text-lg hover:text-white transition-colors duration-300" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" className="text-gray-300 text-lg hover:text-white transition-colors duration-300" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" className="text-gray-300 text-lg hover:text-white transition-colors duration-300" aria-label="GitHub"><FiGithub /></a>
            <a href="#" className="text-gray-300 text-lg hover:text-white transition-colors duration-300" aria-label="Dribbble"><SiDribbble /></a>
          </div>
        </div>

        {/* Column 2: संस्थान */}
        <div>
          <h4 className="text-white text-base font-semibold mb-4 border-b-2 border-red-600 pb-2">संस्थान</h4>
          <ul className="space-y-2">
            {['समाज', 'विचार/कलम', 'साहित्य', 'अन्तर्वार्ता', 'खेलकुद', 'जीवनशैली/स्वास्थ्य'].map(item => (
              <li key={item}><a href="#" className="text-gray-300 text-sm hover:text-white transition-colors duration-300">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Column 3: महत्वपूर्ण लिंकहरु */}
        <div>
          <h4 className="text-white text-base font-semibold mb-4 border-b-2 border-red-600 pb-2">महत्वपूर्ण लिंकहरु</h4>
          <ul className="space-y-2">
            {['लोकसेवा आयोग', 'राष्ट्रिय योजना आयोग', 'सञ्चार तथा सूचना प्रविधि मन्त्रालय', 'गृह मन्त्रालय', 'नेपाल सरकार'].map(item => (
              <li key={item}><a href="#" className="text-gray-300 text-sm hover:text-white transition-colors duration-300">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Column 4: विशेष श्रृंखला */}
        <div>
          <h4 className="text-white text-base font-semibold mb-4 border-b-2 border-red-600 pb-2">विशेष श्रृंखला</h4>
          <ul className="space-y-2">
            {['संसद विघटन विशेष', 'फ्रन्टलाइन हिरोज', 'निर्वाचन २०७४', 'मेरो कक्षा', 'स्थानीय चुनाव २०७९', 'एमाले महाधिवेशन'].map(item => (
              <li key={item}><a href="#" className="text-gray-300 text-sm hover:text-white transition-colors duration-300">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Column 5: यात्रीपाटी */}
        <div>
          <h4 className="text-white text-base font-semibold mb-4 border-b-2 border-red-600 pb-2">यात्रीपाटी</h4>
          <ul className="space-y-2">
            {['हाम्रो टीम', 'प्रयोगका सर्त', 'विज्ञापन', 'प्राइभेसी पोलिसी', 'सम्पर्क'].map(item => (
              <li key={item}><a href="#" className="text-gray-300 text-sm hover:text-white transition-colors duration-300">{item}</a></li>
            ))}
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 pt-5 mt-10 text-center text-gray-500 text-xs">
        <p>© 2026 Yatri Pati. All rights reserved.</p>
      </div>
    </footer>
  )
}
