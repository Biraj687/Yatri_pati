import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiGithub } from 'react-icons/fi'
import { SiDribbble } from 'react-icons/si'
import logoImg from '../assets/logo.png'

export function Footer() {
  const categories = [
    { label: 'समाज', slug: 'samaj' },
    { label: 'विचार/कलम', slug: 'vichar' },
    { label: 'साहित्य', slug: 'sahitya' },
    { label: 'अन्तरवार्ता', slug: 'interview' },
    { label: 'खेलकुद', slug: 'khel' },
    { label: 'जीवनशैली/स्वास्थ्य', slug: 'swasthya' },
  ];

  return (
    <footer className="bg-black text-white w-full">
      <div className="w-full py-10 px-6 lg:px-8">
        {/* Top Section - Logo and Social Icons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12 text-left">
          {/* Left: Logo and Nepali Text */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <Link to="/">
                <img src={logoImg} alt="Yatri Pati Logo" className="h-10 w-auto" />
              </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
              प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सरह सम्झनुपर्दछ । थोमस हब्स...
            </p>
            {/* Social Icons */}
            <div className="flex gap-5">
              {[FiFacebook, FiInstagram, FiTwitter, FiGithub, SiDribbble].map((Icon, idx) => (
                <a key={idx} href="#" className="text-white hover:text-blue-500 transition-colors duration-300">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 1: स्थान (Categories) */}
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2 uppercase tracking-wider text-sm">स्थान</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link to={`/category/${cat.slug}`} className="text-gray-300 text-sm hover:text-white transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: महत्त्वपूर्ण लिंकहरू */}
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2 uppercase tracking-wider text-sm">महत्त्वपूर्ण</h3>
            <ul className="space-y-3">
              {['लोकसेवा आयोग', 'राष्ट्रिय योजना आयोग', 'सञ्चार तथा सूचना प्रविधि', 'गृह मन्त्रालय', 'नेपाल सरकार'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: यात्रीपाटी */}
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2 uppercase tracking-wider text-sm">यात्रीपाटी</h3>
            <ul className="space-y-3">
              {['हाम्रो टिम', 'प्रयोगका सर्त', 'विज्ञापन', 'प्राइभेसी पोलिसी', 'सम्पर्क'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Yatri Pati. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
