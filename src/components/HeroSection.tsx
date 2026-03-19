import { Link } from 'react-router-dom';
import type { Article } from '../services/newsService';

export function HeroSection({ heroArticle }: { heroArticle: Article }) {
  return (
    <section className="py-2 px-4 group relative overflow-hidden">
      <Link to={`/article/${heroArticle.id}`} className="block relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: '2 / 1' }}>
        <img 
          src={heroArticle.image} 
          alt="Featured" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center text-center gap-2">
          <span className="inline-block text-white text-sm font-semibold px-3 py-1 border border-white rounded">
            {heroArticle.category}
          </span>
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight max-w-3xl drop-shadow-lg transition-colors group-hover:text-blue-200">
            {heroArticle.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-white text-sm font-medium drop-shadow-md bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mt-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0 shadow-sm">
              <img 
                src={heroArticle.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(heroArticle.author)}&background=random`} 
                alt={heroArticle.author} 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="font-bold tracking-wide">{heroArticle.author}</span>
            <span className="mx-1 text-white/50">•</span>
            <span className="font-noto text-white/90">{heroArticle.date}</span>
          </div>
        </div>
      </Link>
    </section>
  );
}
