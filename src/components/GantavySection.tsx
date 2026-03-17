import ppImage from '../assets/pp.jpg';
import thumbnailImage from '../assets/thumbnail.jpg';

interface QuoteItem {
  id: number;
  quote: string;
  author: string;
  date: string;
}

const quotes: QuoteItem[] = [
  {
    id: 1,
    quote: 'जहाँ जहाँ जान्छौ तिमी, म पाइला बनि पछ्याई रहन्छु जहाँ जहाँ जान्छौ तिमी',
    author: 'बिराज प्याकुरेल',
    date: '२२ माघ २०७७, बुधवार'
  },
  {
    id: 2,
    quote: 'जहाँ जहाँ जान्छौ तिमी, म पाइला बनि पछ्याई रहन्छु जहाँ जहाँ जान्छौ तिमी',
    author: 'बिराज प्याकुरेल',
    date: '२२ माघ २०११, बुधबार'
  },
  {
    id: 3,
    quote: 'खाँ खाँ जान्छौ तिमी, म पाइला बनि पछ्याई रहन्छु खाँ खाँ जान्छौ तिमी',
    author: 'बिराज प्याकुरेल',
    date: '२२ माघ २०७७, बुधवार'
  },
  {
    id: 4,
    quote: 'जहाँ जहाँ जान्छौ तिमी, म पाइला बनि पछ्याई रहन्छु जहाँ जहाँ जान्छौ तिमी',
    author: 'बिराज प्याकुरेल',
    date: '२२ माघ २०११, बुधबार'
  },
  {
    id: 5,
    quote: 'खाँ खाँ जान्छौ तिमी, म पाइला बनि पछ्याई रहन्छु खाँ खाँ जान्छौ तिमी',
    author: 'बिराज प्याकुरेल',
    date: '२२ माघ २०७७, बुधवार'
  },
  {
    id: 6,
    quote: 'जहाँ जहाँ जान्छौ तिमी, म पाइला बनि पछ्याई रहन्छु जहाँ जहाँ जान्छौ तिमी',
    author: 'बिराज प्याकुरेल',
    date: '२२ माघ २०७७, बुधवार'
  }
];

export function GantavySection() {
  return (
    <section className="px-4 py-12 text-left">
      <div className="bg-black rounded-lg p-8 mx-auto max-w-6xl">
        {/* Header */}
        <h2 className="text-white text-3xl font-bold text-left mb-12">गन्तव्य</h2>

        {/* 2x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quotes.map((item) => (
            <div key={item.id} className="flex flex-col">
              {/* Image */}
              <div className="mb-4 h-40 overflow-hidden rounded">
                <img
                  src={thumbnailImage}
                  alt="Quote image"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quote */}
              <p className="text-white text-sm leading-relaxed mb-3 flex-grow">
                {item.quote}
              </p>

              {/* Author with circular image */}
              <div className="flex items-center gap-3">
                <img
                  src={ppImage}
                  alt={item.author}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="text-white text-xs opacity-75">
                  {item.author} — {item.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
