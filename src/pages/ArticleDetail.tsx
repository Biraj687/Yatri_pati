import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiShare2, FiArrowLeft, FiUser, FiCalendar } from 'react-icons/fi';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { CompactArticle } from '../components/CompactArticle';
import { OptimizedImage } from '../components/OptimizedImage';
import { useArticle, useNews } from '../hooks/useNews';
import { useSiteConfig } from '../context/SiteConfigContext';
import { generateSlug } from '../utils/stringUtils';
import { mockTargetArticles, normalizeArticle } from '../services/newsService';

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { config } = useSiteConfig();

  // Scroll to top when article ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const {
    article,
    isLoading: articleLoading
  } = useArticle({
    id: id || '',
    enabled: !!id
  });

  const {
    data: relatedData,
    isLoading: relatedLoading,
    error: relatedError
  } = useNews({
    category: article?.category,
    limit: 4,
    enabled: !!article?.category
  });

  // Fallback dummy articles when related news fails to load
  const fallbackRelatedArticles = mockTargetArticles
    .map(normalizeArticle)
    .filter(a => a.id !== article?.id)
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('लिङ्क क्लिपबोर्डमा कपी गरियो!');
    }
  };

  if (articleLoading) {
    return <SkeletonLoader type="detail" />;
  }

  // Show article regardless of error - the mock data will provide fallback content
  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem] py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">समाचार फेला परेन।</h2>
        <Link to="/" className="text-primary-600 hover:underline flex items-center gap-2">
          <FiArrowLeft /> गृहपृष्ठमा फर्कनुहोस्
        </Link>
      </div>
    );
  }

  const relatedArticles = relatedData?.data || [];
  const displayedRelatedArticles = relatedError ? fallbackRelatedArticles : relatedArticles;
  // Clean date by removing trailing " 0" if present
  const cleanedDate = article.date ? article.date.replace(/ 0$/, '') : article.date;
  const siteName = config?.siteName || 'यत्रिपाटि';
  const pageTitle = `${article.title} - ${siteName}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <article className="w-full text-gray-900 dark:text-gray-100 min-h-screen pb-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem] py-14 flex flex-col lg:flex-row gap-16 text-left">
          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    गृहपृष्ठ
                  </Link>
                </li>
                <li>/</li>
                {article.category && (
                  <>
                    <li>
                      <Link 
                        to={`/category/${generateSlug(article.category)}`}
                        className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {article.category}
                      </Link>
                    </li>
                    <li>/</li>
                  </>
                )}
                <li className="text-gray-900 dark:text-gray-300 font-medium truncate">
                  {article.title}
                </li>
              </ol>
            </nav>

            {/* Article Header */}
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4" />
                  <span className="font-medium">{article.author}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>{cleanedDate}</span>
                </div>
                
                {/* Read time removed as per user request */}
                {/* {article.readTime && (
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                )} */}
                
                {/* Views counter removed */}
              </div>
            </header>

            {/* Featured Image */}
            {article.image && (
              <figure className="my-10">
                <OptimizedImage
                  src={article.image}
                  alt={article.title}
                  className="w-full h-auto rounded-2xl shadow-lg"
                  width={800}
                  height={450}
                  lazy={true}
                  priority={true}
                  fallbackSrc="https://via.placeholder.com/800x450?text=Image+Not+Available"
                />
                {article.source && (
                  <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    स्रोत: {article.source}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {article.content ? (
                <div className="space-y-6">
                  {article.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl p-6">
                  <p className="text-blue-800 dark:text-blue-200">
                    यस समाचारको पूर्ण विवरण उपलब्ध छैन। थप विवरणका लागि मूल स्रोत हेर्नुहोस्।
                  </p>
                </div>
              )}
            </div>

            {/* Article Actions */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiArrowLeft />
                फिर्ता जानुहोस्
              </button>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <FiShare2 />
                  सेयर गर्नुहोस्
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                सम्बन्धित समाचार
              </h3>
              
              {relatedLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : displayedRelatedArticles.length > 0 ? (
                <div className="space-y-6">
                  {displayedRelatedArticles.map((relatedArticle, index) => (
                    <CompactArticle
                      key={relatedArticle.id}
                      article={relatedArticle}
                      minimal={false}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    यस श्रेणीमा अरू समाचार उपलब्ध छैन।
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
