import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { fetchNewsData } from '../services/newsService';
import type { Article } from '../services/newsService';

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await fetchNewsData();
        // For now, search in all mock data since we don't have a fetchById endpoint
        const allArticles = [data.hero, data.featured, ...data.articles];
        const found = allArticles.find(a => String(a.id) === id);
        setArticle(found || null);
      } catch (err) {
        console.error("Failed to load article", err);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  if (loading) return <SkeletonLoader type="detail" />;
  if (!article) return <div className="p-10 text-center color-white">समाचार फेला परेन।</div>;

  return (
    <article className="max-w-4xl mx-auto px-5 py-10 text-white">
      <Helmet>
        <title>{`${article.title} - Yatripati`}</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Link to="/" className="text-blue-400 hover:underline mb-6 inline-block">← गृहपृष्ठमा फर्कनुहोस्</Link>
      
      <header className="mb-8">
        <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4 inline-block">
          {article.category || 'समाचार'}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          {article.title}
        </h1>
        
        <div className="flex items-center space-x-4 mb-8">
          {article.authorAvatar && (
            <img src={article.authorAvatar} alt={article.author} className="w-12 h-12 rounded-full border-2 border-blue-500" />
          )}
          <div>
            <p className="font-bold text-lg">{article.author}</p>
            <p className="text-gray-400 text-sm">{article.date}</p>
          </div>
        </div>
      </header>

      <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl">
        <img src={article.image} alt={article.title} className="w-full h-auto object-cover" />
      </div>

      <article className="prose prose-invert prose-lg max-w-none">
        <p className="text-xl leading-relaxed text-gray-300 italic mb-8 border-l-4 border-blue-500 pl-6">
          {article.excerpt}
        </p>
        <div className="text-gray-200 space-y-6 leading-relaxed">
          <p>
            यो समाचारको विस्तृत विवरण यहाँ राखिनेछ। अहिलेका लागि हामीले डेटाबेसबाट संकलन गरेको संक्षिप्त विवरण यहाँ देखाइएको छ। 
            यस पोर्टलमा हामीले नेपाल र विश्वका पछिल्ला घटनाक्रमहरूलाई समेट्ने प्रयास गरेका छौं।
          </p>
          <p>
            पर्यटन, संस्कृति, र प्रविधिको क्षेत्रमा भइरहेका परिवर्तनहरूलाई हामीले नजिकबाट नियालिरहेका छौं। 
            हाम्रो उद्देश्य पाठकहरूलाई सही र निष्पक्ष जानकारी प्रदान गर्नु हो।
          </p>
        </div>
      </article>

      <footer className="mt-16 pt-8 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-700 transition">Share to Facebook</button>
            <button className="bg-sky-500 px-4 py-2 rounded font-bold hover:bg-sky-600 transition">Share to Twitter</button>
          </div>
        </div>
      </footer>
    </article>
  );
}
