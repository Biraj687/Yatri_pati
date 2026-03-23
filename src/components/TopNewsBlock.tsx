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
      <div className="w-full bg-gray-100 dark:bg-gray-800 animate-pulse h-[400px] md:h-[500px] flex items-center justify-center">
        <div className="text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">समाचार लोड हुँदैछ...</div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <section className="py-4 md:py-8 px-4 md:px-8 lg:px-[5rem] w-full max-w-[1600px] mx-auto group relative overflow-hidden">
      <Link to={`/news/${article.id}`} className="block relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 h-[450px] md:h-[600px]">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        {/* Centered Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 px-6 text-center">
          {/* Category Pill */}
          <span className="inline-block bg-white/10 backdrop-blur-md text-white text-[11px] md:text-[13px] font-medium px-4 py-1.5 rounded-full border border-white/20 mb-6 uppercase">
            {article.category || 'पाइला'}
          </span>

          {/* Title */}
          <h1 className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold leading-[1.2] max-w-4xl drop-shadow-2xl mb-8 font-noto px-4">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center justify-center gap-3 text-white/80 text-[11px] md:text-base font-medium font-noto">
            <span className="hover:text-white transition-colors">{article.author}</span>
            <span className="opacity-50">—</span>
            <span>{article.date}</span>
          </div>
        </div>
      </Link>
    </section>
  );
};
