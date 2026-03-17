import { FiFacebook, FiInstagram, FiTwitter, FiGithub } from 'react-icons/fi'
import { SiDribbble } from 'react-icons/si'
import logoImg from '../assets/logo.png'

export function Footer() {
  return (
    <footer className="bg-black text-white w-full">
      <div className="container mx-auto py-10 px-6">
        {/* Top Section - Logo and Social Icons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Left: Logo and Nepali Text */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <img src={logoImg} alt="Yatri Pati Logo" className="h-10 w-auto" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 text-left">
              प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सरह सम्झनुपर्दछ । थोमस हब्स प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सम्झनुपर्दछ । थोमस हब्स प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सरह सम्झनुपर्दछ । थोमस हब्स
            </p>
            {/* Social Icons */}
            <div className="flex gap-5">
              <a 
                href="#" 
                className="text-white hover:text-gray-400 transition-colors duration-300" 
                aria-label="Facebook"
              >
                <FiFacebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-gray-400 transition-colors duration-300" 
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-gray-400 transition-colors duration-300" 
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-gray-400 transition-colors duration-300" 
                aria-label="GitHub"
              >
                <FiGithub size={20} />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-gray-400 transition-colors duration-300" 
                aria-label="Dribbble"
              >
                <SiDribbble size={20} />
              </a>
            </div>
          </div>

          {/* Column 1: स्थान */}
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">स्थान</h3>
            <ul className="space-y-3">
              {['समाज', 'विचार/कलम', 'साहित्य', 'अन्तरवार्ता', 'खेलकुद', 'जीवनशैली/स्वास्थ्य'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 text-sm hover:text-gray-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: महत्त्वपूर्ण लिंकहरू */}
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">महत्त्वपूर्ण</h3>
            <ul className="space-y-3">
              {['लोकसेवा आयोग', 'राष्ट्रिय योजना आयोग', 'सञ्चार तथा सूचना प्रविधि', 'गृह मन्त्रालय', 'नेपाल सरकार'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 text-sm hover:text-gray-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: विशेष श्रृंखला */}
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">विशेष श्रृंखला</h3>
            <ul className="space-y-3">
              {['संसद विशेष', 'फ्रन्टलाइन हिरोज', 'निर्वाचन २०७४', 'मेरो कथा', 'स्थानीय चुनाव २०७९', 'एमाओवादी महाधिवेशन'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 text-sm hover:text-gray-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: यात्रीपाटी */}
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">यात्रीपाटी</h3>
            <ul className="space-y-3">
              {['हाम्रो टिम', 'प्रयोगका सर्त', 'विज्ञापन', 'प्राइभेसी पोलिसी', 'सम्पर्क'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 text-sm hover:text-gray-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="border-t border-gray-700 pt-6 text-left">
          <p className="text-gray-400 text-sm">
            © 2026 Yatri Pati. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
