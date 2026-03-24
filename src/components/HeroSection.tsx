import { Link } from 'react-router-dom';
import type { Article } from '../services/newsService';

export function HeroSection({ heroArticle }: { heroArticle: Article }) {
  return (
    <section className="py-8 px-4 md:px-12 lg:px-20 w-full max-w-[1440px] mx-auto group relative overflow-hidden">
      <Link to={`/news/${heroArticle.id}`} className="block relative max-w-6xl mx-auto rounded-sxl overflow-hidden shadow-2xl transition-all duration-300" style={{ aspectRatio: '16 / 7' }}>
        <img 
          src={heroArticle.image} 
          alt="Featured" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Centered Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center">
          {/* Category Pill */}
          <span className="inline-block bg-white/10 backdrop-blur-md text-white text-[12px] font-medium px-4 py-1.5 rounded-full border border-white/20 mb-6 uppercase">
            {heroArticle.category}
          </span>

          {/* Title */}
          <h1 className="text-white text-3xl md:text-5xl lg:text-5xl font-extrabold leading-[1.2] max-w-4xl drop-shadow-2xl mb-8 font-noto">
            {heroArticle.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center justify-center gap-3 text-white/80 text-[13px] md:text-base font-medium font-noto">
            <span className="hover:text-white transition-colors">{heroArticle.author}</span>
            <span className="opacity-50">—</span>
            <span>{heroArticle.date}</span>
          </div>
        </div>
      </Link>
    </section>
  );
}
