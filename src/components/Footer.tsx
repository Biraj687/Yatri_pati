import { FiFacebook, FiInstagram, FiTwitter, FiGithub } from 'react-icons/fi'
import { SiDribbble } from 'react-icons/si'
import logoImg from '../assets/logo.png'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Column 1: Logo + Description + Socials */}
        <div className="footer-brand">
          <a href="/" className="footer-logo">
            <img src={logoImg} alt="Yatri Pati" className="footer-logo-img" />
          </a>
          <p className="footer-desc">
            प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सरह सम्झनुपर्दछ । थोमस हब्स
            प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सम्झनुपर्दछ । थोमस हब्स
            प्रत्येक मानिसले अर्को व्यक्तिलाई प्राकृतिक रूपमा आफू सरह सम्झनुपर्दछ । थोमस हब्स
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="GitHub"><FiGithub /></a>
            <a href="#" aria-label="Dribbble"><SiDribbble /></a>
          </div>
        </div>

        {/* Column 2: संस्थान */}
        <div className="footer-col">
          <h4 className="footer-col-title">संस्थान</h4>
          <ul className="footer-links">
            {['समाज', 'विचार/कलम', 'साहित्य', 'अन्तर्वार्ता', 'खेलकुद', 'जीवनशैली/स्वास्थ्य'].map(item => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Column 3: महत्वपूर्ण लिंकहरु */}
        <div className="footer-col">
          <h4 className="footer-col-title">महत्वपूर्ण लिंकहरु</h4>
          <ul className="footer-links">
            {['लोकसेवा आयोग', 'राष्ट्रिय योजना आयोग', 'सञ्चार तथा सूचना प्रविधि मन्त्रालय', 'गृह मन्त्रालय', 'नेपाल सरकार'].map(item => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Column 4: विशेष श्रृंखला */}
        <div className="footer-col">
          <h4 className="footer-col-title">विशेष श्रृंखला</h4>
          <ul className="footer-links">
            {['संसद विघटन विशेष', 'फ्रन्टलाइन हिरोज', 'निर्वाचन २०७४', 'मेरो कक्षा', 'स्थानीय चुनाव २०७९', 'एमाले महाधिवेशन'].map(item => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Column 5: यात्रीपाटी */}
        <div className="footer-col">
          <h4 className="footer-col-title">यात्रीपाटी</h4>
          <ul className="footer-links">
            {['हाम्रो टीम', 'प्रयोगका सर्त', 'विज्ञापन', 'प्राइभेसी पोलिसी', 'सम्पर्क'].map(item => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Yatri Pati. All rights reserved.</p>
      </div>
    </footer>
  )
}
