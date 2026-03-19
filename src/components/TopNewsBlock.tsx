import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../services/newsService';

interface TopNewsBlockProps {
  article: Article | null;
  loading: boolean;
}

export const TopNewsBlock: React.FC<TopNewsBlockProps> = ({ article, loading }) => {
  if (loading) {
    return (
      <div className="w-full bg-gray-100 animate-pulse h-[400px] md:h-[500px] flex items-center justify-center">
        <div className="text-gray-400 font-medium">समाचार लोड हुँदैछ...</div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden group">
      <Link to={`/article/${article.id}`} className="block w-full h-full relative">
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500 z-10" />
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-5xl space-y-4">
            <span className="inline-block bg-blue-600 text-white text-xs md:text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
              {article.category || 'मुख्य समाचार'}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-2xl leading-tight md:leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/95 text-sm md:text-base font-medium mt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40 shadow-inner flex-shrink-0">
                  <img 
                    src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`} 
                    alt={article.author} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span>{article.author}</span>
              </div>
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
              <span className="font-noto bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full text-white/80">{article.date}</span>
            </div>
            <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto mt-6 hidden md:line-clamp-2">
              {article.excerpt}
            </p>
            <div className="mt-8">
              <span className="inline-flex items-center justify-center bg-white text-blue-600 font-bold px-8 py-3 rounded-md transition-all duration-300 hover:bg-blue-600 hover:text-white transform hover:-translate-y-1 shadow-xl">
                थप पढ्नुहोस्
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};
