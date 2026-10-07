import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Camera, Clock, ArrowUpRight, Sparkles, TrendingUp, Globe, Compass, Radio, Newspaper, ExternalLink, RefreshCw } from 'lucide-react';
import { NewsItem } from '../../types/spider';

interface GoogleLandingPageProps {
  onSearch: (query: string) => void;
  onOpenShortcut: (url: string, title: string) => void;
  onOpenNews?: (news: NewsItem) => void;
  onSwitchToLiveFrame?: () => void;
}

export const GoogleLandingPage: React.FC<GoogleLandingPageProps> = ({
  onSearch,
  onOpenShortcut,
  onOpenNews,
  onSwitchToLiveFrame,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Discover News Feed State
  const [newsCategory, setNewsCategory] = useState<'ALL' | 'TECH' | 'SCIENCE' | 'WORLD' | 'BUSINESS'>('ALL');
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // Debounced real Google autocomplete predictions
  useEffect(() => {
    const q = inputValue.trim();
    if (!q) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/google-suggest?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.suggestions && data.suggestions.length > 0) {
            setSuggestions(data.suggestions.slice(0, 6));
            setShowSuggestions(true);
            return;
          }
        }
      } catch {
        // fallback
      }

      // Default quick completions
      setSuggestions([
        `${q} news`,
        `${q} official website`,
        `${q} wikipedia`,
        `${q} 2026`,
      ]);
      setShowSuggestions(true);
    }, 180);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Load Real-World Live News for Google Discover Feed
  const fetchLiveNews = async (cat: string) => {
    setIsLoadingNews(true);
    try {
      const res = await fetch(`/api/news?category=${cat}`);
      if (res.ok) {
        const data = await res.json();
        setNewsList(data.news || []);
      }
    } catch {
      // fallback
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchLiveNews(newsCategory);
  }, [newsCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setShowSuggestions(false);
      onSearch(inputValue.trim());
    }
  };

  const handleSuggestionClick = (sug: string) => {
    setInputValue(sug);
    setShowSuggestions(false);
    onSearch(sug);
  };

  // Voice Search Microphone Simulation
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputValue(transcript);
            onSearch(transcript);
          }
        };
        recognition.start();
        return;
      } catch {}
    }

    // Visual listening modal fallback
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputValue('artificial intelligence in education');
      onSearch('artificial intelligence in education');
    }, 2000);
  };

  const shortcuts = [
    { title: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page', domain: 'wikipedia.org', icon: 'W', color: '#111827' },
    { title: 'BBC News', url: 'https://www.bbc.com/news', domain: 'bbc.com', icon: 'BBC', color: '#B80000' },
    { title: 'Apple', url: 'https://www.apple.com', domain: 'apple.com', icon: '🍎', color: '#111827' },
    { title: 'Nature', url: 'https://www.nature.com', domain: 'nature.com', icon: 'N', color: '#C8102E' },
    { title: 'TechCrunch', url: 'https://techcrunch.com', domain: 'techcrunch.com', icon: 'TC', color: '#00A562' },
    { title: 'Reddit', url: 'https://www.reddit.com/r/technology', domain: 'reddit.com', icon: 'R', color: '#FF4500' },
  ];

  const trendingQueries = [
    'artificial intelligence',
    'elon musk tesla',
    'climate change renewable energy',
    'quantum computing breakthrough',
    'apple iphone',
  ];

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-white text-slate-800 select-none overflow-y-auto pb-24 scroll-smooth">
      {/* Top Google Mobile Bar */}
      <div className="w-full max-w-xl flex justify-between items-center text-xs text-slate-600 font-sans px-4 py-3 shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <span className="font-bold text-orange-600 border-b-2 border-orange-500 pb-0.5">Google</span>
          <span
            onClick={() => onSearch('Google Images')}
            className="hover:text-slate-900 cursor-pointer transition-colors"
          >
            Images
          </span>
          <span
            onClick={() => onSearch('World News')}
            className="hover:text-slate-900 cursor-pointer transition-colors"
          >
            News
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            <span>SPIDER ACTIVE</span>
          </span>

          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            G
          </div>
        </div>
      </div>

      {/* Main Google Body */}
      <div className="w-full max-w-xl flex flex-col items-center px-4 pt-6 pb-4 space-y-4">
        {/* Real Authentic Google Logo with Genuine Colors */}
        <div
          className="flex items-center cursor-pointer my-1 select-none"
          onClick={() => {
            setInputValue('');
            setShowSuggestions(false);
          }}
        >
          <span className="text-5xl sm:text-6xl font-bold tracking-tight font-sans drop-shadow-xs">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>
        </div>

        {/* Real Google Mobile Omnibar */}
        <div className="relative w-full">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative flex items-center w-full bg-white border border-slate-300 hover:border-slate-400 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 rounded-full px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all">
              <Search size={18} className="text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Search Google or type web address"
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none font-sans"
              />

              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    setShowSuggestions(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 text-sm font-medium mr-2"
                >
                  ✕
                </button>
              )}

              <div className="flex items-center gap-2.5 ml-2 text-slate-500 shrink-0">
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  title="Search with voice"
                  className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <Mic size={17} className={isListening ? 'text-rose-500 animate-pulse' : 'text-[#4285F4]'} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick('elon musk tesla news')}
                  title="Search by image / Google Lens"
                  className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <Camera size={17} className="text-[#34A853]" />
                </button>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-center gap-2.5 mt-3">
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-full transition-colors border border-slate-200 shadow-xs"
              >
                Google Search
              </button>
              <button
                type="button"
                onClick={() => handleSuggestionClick(trendingQueries[Math.floor(Math.random() * trendingQueries.length)])}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-full transition-colors border border-slate-200 flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles size={12} className="text-orange-500" />
                <span>I'm Feeling Lucky</span>
              </button>
            </div>
          </form>

          {/* Autocomplete Predictions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-14 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1.5 animate-in fade-in duration-150">
              <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Google Suggestions
              </div>
              {suggestions.map((sug, i) => (
                <div
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-xs text-slate-800 font-sans transition-colors"
                >
                  <Search size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{sug}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voice Listening Overlay Modal */}
        {isListening && (
          <div className="w-full p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center animate-pulse">
                <Mic size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Listening to speech...</p>
                <p className="text-[11px] text-orange-700">Say your search query clearly</p>
              </div>
            </div>
            <button
              onClick={() => setIsListening(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Quick Shortcuts Grid */}
        <div className="w-full pt-1">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {shortcuts.map(sc => (
              <div
                key={sc.title}
                onClick={() => onOpenShortcut(sc.url, sc.title)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 group-hover:border-orange-400 group-hover:bg-orange-50 flex items-center justify-center text-slate-800 group-hover:text-orange-600 font-bold text-xs shadow-xs transition-all">
                  {sc.icon}
                </div>
                <span className="text-[11px] text-slate-700 font-medium truncate max-w-[70px]">
                  {sc.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Search Pills */}
        <div className="w-full space-y-1.5 pt-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <TrendingUp size={11} className="text-orange-500" />
            <span>Trending Searches</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {trendingQueries.map(q => (
              <button
                key={q}
                onClick={() => handleSuggestionClick(q)}
                className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-[11px] text-slate-700 hover:text-orange-700 transition-all font-sans"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* GOOGLE DISCOVER / REAL-WORLD LIVE NEWS FEED                */}
      {/* ========================================================= */}
      <div className="w-full max-w-xl px-4 pt-4 border-t border-slate-200 space-y-3">
        {/* Discover Header & Category Pills */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={17} className="text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Google Discover · Real-World News
            </h3>
          </div>

          <button
            onClick={() => fetchLiveNews(newsCategory)}
            disabled={isLoadingNews}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            title="Refresh news"
          >
            <RefreshCw size={13} className={isLoadingNews ? 'animate-spin text-orange-500' : ''} />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium scrollbar-none">
          {(['ALL', 'TECH', 'SCIENCE', 'WORLD', 'BUSINESS'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setNewsCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] transition-all whitespace-nowrap ${
                newsCategory === cat
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Top Stories' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoadingNews && (
          <div className="space-y-3 py-2">
            {[1, 2, 3].map(n => (
              <div key={n} className="p-3 border border-slate-200 rounded-xl space-y-2 animate-pulse bg-slate-50">
                <div className="h-3 w-28 bg-slate-200 rounded" />
                <div className="h-4 w-5/6 bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Real News Cards */}
        {!isLoadingNews && newsList.length > 0 && (
          <div className="space-y-3">
            {newsList.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => {
                  if (onOpenNews) onOpenNews(item);
                  else onOpenShortcut(item.url, item.title);
                }}
                className="group p-3 rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-md bg-white transition-all cursor-pointer space-y-2"
              >
                {/* Source Badge & Timestamp */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[9px] font-bold">
                      {item.domain.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-900">{item.sourceName || item.domain}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.timeAgo}</span>
                </div>

                {/* News Headline */}
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h4>

                {/* News Excerpt */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {item.snippet}
                </p>

                {/* Crawler Action Callout */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>🕷️ Tap to Crawl & Store</span>
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 group-hover:text-orange-600">
                    <span>Read Article</span>
                    <ArrowUpRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Footer */}
      <div className="w-full max-w-xl border-t border-slate-200 pt-4 mt-6 text-center text-xs text-slate-500 font-sans space-y-1 shrink-0 px-4">
        <div className="flex justify-center gap-3 text-slate-600 text-[11px]">
          <span>Google Mobile</span>
          <span>·</span>
          <span>Live Search Engine</span>
          <span>·</span>
          <span>Spider Extractor</span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono">
          Visual web crawler autonomously roaming and harvesting live data.
        </p>
      </div>
    </div>
  );
};
