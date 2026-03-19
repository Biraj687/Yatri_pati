import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiClock, FiShare2, FiArrowLeft, FiUser, FiCalendar } from 'react-icons/fi';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { CompactArticle } from '../components/CompactArticle';
import { fetchNewsData, fetchArticleById } from '../services/newsService';
import type { Article } from '../services/newsService';
export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        const found = await fetchArticleById(id as string);
        
        if (found) {
          setArticle(found);
          // For related articles, we can still fetch the main news or use a dedicated related endpoint if available
          const data = await fetchNewsData();
          const allArticles = [data.hero, data.featured, ...data.articles];
          const related = allArticles
            .filter(a => String(a.id) !== id && a.category === found.category)
            .slice(0, 4);
          
          setRelatedArticles(related.length > 0 ? related : allArticles.filter(a => String(a.id) !== id).slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load article", err);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    loadArticle();
  }, [id]);

  if (loading) return <SkeletonLoader type="detail" />;
  if (!article) return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 min-h-[60vh] flex flex-col items-center justify-center text-white">
      <h2 className="text-2xl font-bold mb-4">समाचार फेला परेन।</h2>
      <Link to="/" className="text-blue-400 hover:underline flex items-center gap-2">
        <FiArrowLeft /> गृहपृष्ठमा फर्कनुहोस्
      </Link>
    </div>
  );

  return (
    <article className="w-full text-gray-900 min-h-screen pb-20 bg-white">
      <Helmet>
        <title>{`${article.title} - Yatripati`}</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Hero Header Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full px-4 lg:px-6 py-6 md:py-8">
          <div className="max-w-7xl mx-auto">
            <Link to={`/category/${article.category?.toLowerCase() || 'news'}`} className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-3 hover:bg-blue-700 transition-colors">
              {article.category || 'समाचार'}
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white drop-shadow-xl">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <FiUser className="text-blue-400 w-4 h-4" />
                <span className="font-semibold text-white">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-blue-400 w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-blue-400 w-4 h-4" />
                <span>{article.readTime || '५ मिनेट पढ्नुहोस्'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col lg:flex-row gap-12 text-left">
        {/* Main Content */}
        <div className="flex-grow">
          <div className="prose prose-lg md:prose-xl max-w-none text-gray-800">
            <p className="text-xl md:text-2xl leading-relaxed text-blue-900 italic mb-10 border-l-4 border-blue-600 pl-6 py-4 bg-blue-50 rounded-r-lg font-medium">
              {article.excerpt}
            </p>
            
            <div className="space-y-8 leading-relaxed text-lg text-gray-800">
              {article.content ? (
                // Display real content from backend
                <div className="prose prose-lg md:prose-xl max-w-none">
                  {article.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                // Fallback placeholder content
                <>
                  <p>
                    यो समाचारको विस्तृत विवरण यहाँ राखिनेछ। अहिलेका लागि हामीले डेटाबेसबाट संकलन गरेको संक्षिप्त विवरण यहाँ देखाइएको छ।
                    यस पोर्टलमा हामीले नेपाल र विश्वका पछिल्ला घटनाक्रमहरूलाई समेट्ने प्रयास गरेका छौं।
                  </p>

                  <figure className="my-10">
                    <img
                      src={article.image}
                      alt="Contextual"
                      className="rounded-xl w-full h-auto shadow-xl"
                    />
                    <figcaption className="text-center text-sm text-gray-500 mt-4 italic">
                      तस्बिर: {article.title} सम्बन्धी एक झलक
                    </figcaption>
                  </figure>

                  <p>
                    पर्यटन, संस्कृति, र प्रविधिको क्षेत्रमा भइरहेका परिवर्तनहरूलाई हामीले नजिकबाट नियालिरहेका छौं।
                    हाम्रो उद्देश्य पाठकहरूलाई सही र निष्पक्ष जानकारी प्रदान गर्नु हो। हामी विश्वास गर्छौं कि सूचनाले समाजलाई सुसूचित र सचेत बनाउन मद्दत गर्दछ।
                  </p>

                  <p>
                    थप जानकारीका लागि हाम्रा अन्य लेखहरू पनि पढ्न सक्नुहुन्छ। हामी निरन्तर ताजा र गहन विश्लेषणहरू पाठकमाझ पुर्याउने वाचा गर्दछौं।
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-bold">साझेदारी गर्नुहोस्:</span>
              <button className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 shadow-md group">
                <FiShare2 className="text-white" />
              </button>
              <button className="p-3 bg-sky-500 rounded-full hover:bg-sky-600 transition-all hover:scale-110 shadow-md">
                <FiShare2 className="text-white transform rotate-12" />
              </button>
            </div>
            
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-bold">
              <FiArrowLeft /> सबै समाचारहरू हेर्नुहोस्
            </Link>
          </div>
        </div>

        {/* Sidebar / Related */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b-2 border-blue-600 pb-3">
                सम्बन्धित समाचार
              </h3>
              <div className="space-y-2">
                {relatedArticles.map((rel, index) => (
                  <CompactArticle 
                    key={rel.id} 
                    article={rel} 
                    index={index} 
                  />
                ))}
              </div>
            </div>

          </div>
        </aside>
      </div>
    </article>
  );
}
