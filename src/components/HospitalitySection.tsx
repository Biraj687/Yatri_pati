import thumbnail1 from '../assets/thumbnail.jpg';
import thumbnail2 from '../assets/thumbnail 2.jpg';
import thumbnail3 from '../assets/thumbnail 3.jpg';

interface HospitalityItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

const hospitalityData: HospitalityItem[] = [
  {
    id: 1,
    image: thumbnail1,
    title: 'कोही माथी निर्भर नहुनु, केही पनि आशा नराख्नु।',
    description: 'जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहनेछु ।'
  },
  {
    id: 2,
    image: thumbnail2,
    title: 'कोही माथी निर्भर नहुनु, केही पनि आशा नराख्नु।',
    description: 'जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहनेछु ।'
  },
  {
    id: 3,
    image: thumbnail3,
    title: 'कोही माथी निर्भर नहुनु, केही पनि आशा नराख्नु।',
    description: 'जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहनेछु ।'
  },
  {
    id: 4,
    image: thumbnail1, // Repeating first one for the 4th card
    title: 'कोही माथी निर्भर नहुनु, केही पनि आशा नराख्नु।',
    description: 'जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडीरहनेछु ।'
  }
];

export function HospitalitySection() {
  return (
    <section className="bg-white py-12 px-4 md:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto text-left">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 font-noto text-left">हस्पिटालिटि</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {hospitalityData.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 text-left"
            >
              <div className="h-48 overflow-hidden rounded-2xl m-2">
                <img 
                  src={item.image} 
                  alt="Hospitality" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 pt-1 text-left">
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 font-noto text-left">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 font-noto text-left">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
