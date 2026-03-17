import type { Article } from '../services/newsService';

export function HeroSection({ heroArticle }: { heroArticle: Article }) {
  return (
    <section className="py-2 px-4 group relative overflow-hidden">
      <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: '2 / 1' }}>
        <img 
          src={heroArticle.image} 
          alt="Featured" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center text-center gap-2">
          <span className="inline-block text-white text-xs font-semibold px-3 py-1 border border-white rounded">
            {heroArticle.category}
          </span>
          <h1 className="text-white text-lg font-bold leading-tight max-w-2xl drop-shadow-lg">
            {heroArticle.title}
          </h1>
          <div className="text-white text-xs font-medium drop-shadow">
            {heroArticle.author} — {heroArticle.date}
          </div>
        </div>
      </div>
    </section>
  );
}
