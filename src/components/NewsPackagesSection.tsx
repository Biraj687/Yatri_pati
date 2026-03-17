import ppImage from '../assets/pp.jpg'

export default function NewsPackagesSection() {
  const newsItems = [
    {
      id: 1,
      title: 'काठमाडौंमा नयाँ सांस्कृतिक कार्यक्रम',
      author: 'बिराज प्याकुरेल',
      date: '२०२४-०१-१५',
      description: 'काठमाडौंमा आयोजित नयाँ सांस्कृतिक कार्यक्रमले स्थानीय कलाकारहरूलाई प्रदर्शन गर्ने अवसर दिएको छ।'
    },
    {
      id: 2,
      title: 'पर्यटकों के लिए गन्तव्य की घोषणा',
      author: 'बिराज प्याकुरेल',
      date: '२०२४-०१-१४',
      description: 'नेपाल सरकारले पर्यटन को विकास के लिए नए गन्तव्य की घोषणा की है।'
    },
    {
      id: 3,
      title: 'खेलकुद : राष्ट्रीय टोली की तैयारी',
      author: 'बिराज प्याकुरेल',
      date: '२०२४-०१-१३',
      description: 'आगामी अन्तर्राष्ट्रीय प्रतियोगिता के लिए राष्ट्रीय टोली की तैयारी तेज हो गई है।'
    }
  ]

  const packages = [
    {
      id: 1,
      title: 'हिमालय दर्शन पैकेज',
      author: 'बिराज प्याकुरेल',
      duration: '५ दिन',
      description: 'हिमालयको सौंदर्य अनुभव गर्न विशेष पैकेज जसमा संचारा र नागरकोट समावेश छ।'
    },
    {
      id: 2,
      title: 'वन र वन्यजीव अन्वेषण',
      author: 'बिराज प्याकुरेल',
      duration: '७ दिन',
      description: 'प्रकृतिको मध्यमा समय बिताउने अवसरको साथ वन्यजीव अभयारण्यको भ्रमण।'
    },
    {
      id: 3,
      title: 'सांस्कृतिक विरासत यात्रा',
      author: 'बिराज प्याकुरेल',
      duration: '६ दिन',
      description: 'नेपालको समृद्ध सांस्कृतिक विरासत जान्न विशेष ट्यूर पैकेज।'
    }
  ]

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* News Column */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-gray-400 pb-3 text-left">
              समाचार
            </h2>
            <div className="space-y-4">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={ppImage}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.author} • {item.date}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Packages Column */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-blue-600 pb-3 text-left">
              प्याकेज समाचार
            </h2>
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={ppImage}
                      alt={pkg.title}
                      className="w-24 h-24 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {pkg.author} • {pkg.duration}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
