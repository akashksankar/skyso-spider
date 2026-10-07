import React, { useRef, useState, useEffect } from 'react';
import { SearchResult, SourceItem, ChunkItem, SpiderStatus } from '../../types/spider';
import { ExternalLink, Sparkles, Clock, Globe, ArrowUpRight, Search, AlertCircle, BookOpen, Monitor, RotateCw, CheckCircle2, ShieldCheck } from 'lucide-react';

interface MobileWebViewportProps {
  viewMode: 'search' | 'page';
  searchResults: SearchResult[];
  activeSource: SourceItem | null;
  activeChunk: ChunkItem | null;
  highlightedParagraphIndex: number | null;
  spiderStatus: SpiderStatus;
  onOpenResult: (result: SearchResult) => void;
  onNavigateUrl: (url: string) => void;
  onParagraphTap?: (text: string, index: number, event: React.MouseEvent) => void;
  onFrameClick?: (x: number, y: number) => void;
  currentSearchQuery?: string;
  isLoading?: boolean;
}

export const MobileWebViewport: React.FC<MobileWebViewportProps> = ({
  viewMode,
  searchResults,
  activeSource,
  activeChunk,
  highlightedParagraphIndex,
  spiderStatus,
  onOpenResult,
  onNavigateUrl,
  onParagraphTap,
  onFrameClick,
  currentSearchQuery,
  isLoading,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // For web pages, allow switching between Live Web Page (Iframe) and High-Fidelity Reader / Extraction view
  const [pageDisplayMode, setPageDisplayMode] = useState<'reader' | 'live'>('reader');
  const [iframeError, setIframeError] = useState(false);

  // Listen to postMessage bridge from the proxy iframe
  useEffect(() => {
    const handleBridgeMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === 'OPEN_URL' && e.data.url) {
        onNavigateUrl(e.data.url);
      } else if (e.data.type === 'GOOGLE_SEARCH' && e.data.query) {
        onNavigateUrl(`search:${e.data.query}`);
      } else if (e.data.type === 'GO_HOME') {
        onNavigateUrl('home');
      } else if (e.data.type === 'SWITCH_READER') {
        setPageDisplayMode('reader');
      } else if (e.data.type === 'IFRAME_CLICK' && onFrameClick) {
        onFrameClick(e.data.x, e.data.y);
      }
    };

    window.addEventListener('message', handleBridgeMessage);
    return () => window.removeEventListener('message', handleBridgeMessage);
  }, [onNavigateUrl, onFrameClick]);

  // Reset display mode and error state when active source changes
  useEffect(() => {
    setIframeError(false);
  }, [activeSource?.url]);

  const trendingQueries = [
    'artificial intelligence',
    'elon musk tesla news',
    'climate change renewable energy',
    'quantum computing breakthrough',
    'apple iphone 16 rumors',
  ];

  // Helper knowledge summaries for Google SERP Knowledge Panel
  const getKnowledgeCard = (query?: string) => {
    if (!query) return null;
    const qLower = query.toLowerCase();

    if (qLower.includes('elon') || qLower.includes('musk')) {
      return {
        title: 'Elon Musk',
        subtitle: 'CEO of Tesla, Chief Engineer of SpaceX',
        born: 'June 28, 1971 (age 54), Pretoria, South Africa',
        netWorth: '$270+ Billion (Forbes 2026)',
        organizations: 'Tesla, SpaceX, Neuralink, X, xAI',
        description: 'Elon Reeve Musk is a businessman and investor. He is the founder, CEO, and chief engineer of SpaceX, CEO and product architect of Tesla, Inc., and owner of X.',
      };
    }
    if (qLower.includes('ai') || qLower.includes('artificial intelligence')) {
      return {
        title: 'Artificial Intelligence',
        subtitle: 'Field of computer science',
        description: 'Artificial intelligence (AI) is the intelligence of machines or software, as opposed to the intelligence of living beings, primarily of humans. Key subfields include machine learning, deep learning, and transformer architectures.',
        subtopics: ['Machine Learning', 'Neural Networks', 'Natural Language Processing', 'Computer Vision'],
      };
    }
    if (qLower.includes('climate') || qLower.includes('carbon')) {
      return {
        title: 'Climate Change Mitigation',
        subtitle: 'Global environmental science',
        description: 'Actions to limit global warming and its related effects. This involves reductions in human emissions of greenhouse gases as well as activities that reduce their concentrations in the atmosphere, such as Direct Air Capture.',
        subtopics: ['Renewable Energy', 'Direct Air Capture', 'Ocean Alkalinity', 'Carbon Sequestration'],
      };
    }
    return null;
  };

  const knowledgeCard = getKnowledgeCard(currentSearchQuery);

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full h-full overflow-hidden bg-white text-slate-900 select-none flex flex-col"
    >
      {/* ========================================================= */}
      {/* 1. GOOGLE MOBILE SERP (SEARCH ENGINE RESULTS PAGE)        */}
      {/* ========================================================= */}
      {viewMode === 'search' && (
        <div className="flex-1 w-full overflow-y-auto px-4 py-3 space-y-4 pb-24 scroll-smooth">
          {/* Google Search Filter Sub-tabs */}
          <div className="flex items-center gap-4 border-b border-slate-200 pb-2 text-xs font-medium text-slate-600 overflow-x-auto scrollbar-none">
            <span className="text-orange-600 font-bold border-b-2 border-orange-500 pb-2 cursor-pointer">
              All
            </span>
            <span className="cursor-pointer hover:text-slate-900">News</span>
            <span className="cursor-pointer hover:text-slate-900">Academic</span>
            <span className="cursor-pointer hover:text-slate-900">Images</span>
            <span className="cursor-pointer hover:text-slate-900">Videos</span>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="space-y-4 py-3">
              <div className="flex items-center gap-2 text-xs text-orange-600 font-mono">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span>Searching live internet index for "{currentSearchQuery}"...</span>
              </div>
              {[1, 2, 3].map(n => (
                <div key={n} className="p-3 space-y-2 border border-slate-100 rounded-xl animate-pulse bg-slate-50">
                  <div className="h-3 w-28 bg-slate-200 rounded" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-4/5 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Search Result Stats */}
          {!isLoading && searchResults.length > 0 && (
            <div className="text-[11px] text-slate-500 font-sans flex items-center justify-between">
              <span>About {searchResults.length * 1420} results (0.24 seconds)</span>
              <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                🕷️ Spider Crawling Results
              </span>
            </div>
          )}

          {/* Google Knowledge Panel Card (if query matches entity) */}
          {!isLoading && knowledgeCard && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    {knowledgeCard.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {knowledgeCard.subtitle}
                  </p>
                </div>
                <div className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-mono font-bold">
                  KNOWLEDGE GRAPH
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {knowledgeCard.description}
              </p>

              {knowledgeCard.netWorth && (
                <div className="pt-2 text-xs text-slate-600 space-y-1 border-t border-slate-200/60 font-sans">
                  <div><strong>Net Worth:</strong> {knowledgeCard.netWorth}</div>
                  <div><strong>Organizations:</strong> {knowledgeCard.organizations}</div>
                  <div><strong>Born:</strong> {knowledgeCard.born}</div>
                </div>
              )}

              {knowledgeCard.subtopics && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {knowledgeCard.subtopics.map(st => (
                    <button
                      key={st}
                      onClick={() => onNavigateUrl(`search:${st}`)}
                      className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] text-slate-700 hover:text-orange-600 hover:border-orange-300 transition-colors"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No results state with helpful recovery */}
          {!isLoading && searchResults.length === 0 && (
            <div className="py-6 space-y-4">
              <div className="flex items-center gap-2 text-slate-800 text-sm font-medium">
                <AlertCircle size={18} className="text-orange-500 shrink-0" />
                <span>No direct web documents returned for "{currentSearchQuery || 'your query'}".</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pl-6 font-sans">
                <p>Suggestions:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                  <li>Check your spelling or try more general search terms.</li>
                  <li>Or browse live internet topics with the autonomous spider:</li>
                </ul>
              </div>

              <div className="pt-2 pl-6 flex flex-wrap gap-2">
                {trendingQueries.map(tq => (
                  <button
                    key={tq}
                    onClick={() => onNavigateUrl(`search:${tq}`)}
                    className="px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs text-orange-700 font-medium transition-colors"
                  >
                    {tq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results List */}
          {!isLoading && searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((res, idx) => (
                <div
                  key={res.url + idx}
                  id={`search-item-${idx}`}
                  className="group space-y-1 p-3 rounded-2xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-200"
                >
                  {/* Domain & Favicon */}
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                      {res.domain.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-semibold text-slate-900 leading-tight truncate">
                        {res.domain}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[260px]">
                        {res.url}
                      </span>
                    </div>
                  </div>

                  {/* Title (Classic Google Blue with Orange hover) */}
                  <h3
                    onClick={() => onOpenResult(res)}
                    className="text-base font-medium text-[#1A0DAB] hover:text-orange-600 hover:underline cursor-pointer transition-colors leading-snug"
                  >
                    {res.title}
                  </h3>

                  {/* Snippet */}
                  <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                    {res.snippet}
                  </p>

                  {/* Crawl Action Button */}
                  <div className="pt-1.5 flex items-center gap-2">
                    <button
                      onClick={() => onOpenResult(res)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-semibold transition-colors"
                    >
                      <span>🕷️ Read & Crawl Page</span>
                      <ArrowUpRight size={12} />
                    </button>
                    <span className="text-[10px] text-slate-400">
                      {res.wordCount ? `${res.wordCount} words` : 'Live web source'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. REAL-WORLD WEB PAGE BROWSER (ARTICLE OR LIVE WEB)      */}
      {/* ========================================================= */}
      {viewMode === 'page' && activeSource && (
        <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
          {/* Top Browser View Switcher Toolbar */}
          <div className="w-full bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs text-slate-600 shrink-0">
            {/* View Mode Toggle: Reader vs Live Web */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
              <button
                onClick={() => setPageDisplayMode('reader')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  pageDisplayMode === 'reader'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen size={12} />
                <span>Spider Reader</span>
              </button>

              <button
                onClick={() => setPageDisplayMode('live')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  pageDisplayMode === 'live'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor size={12} />
                <span>Live Web View</span>
              </button>
            </div>

            {/* Live Spider Extractor Metrics Badge */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                <span>{activeSource.chunksCount} CHUNKS</span>
              </div>

              <button
                onClick={() => window.open(activeSource.url, '_blank')}
                className="p-1 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
                title="Open live link in new window"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          </div>

          {/* VIEW OPTION A: LIVE WEB VIEW (SANITIZED PROXY IFRAME) */}
          {pageDisplayMode === 'live' && (
            <div className="relative flex-1 w-full h-full bg-white flex flex-col overflow-hidden">
              <iframe
                ref={iframeRef}
                src={`/api/proxy?url=${encodeURIComponent(activeSource.url)}`}
                className="w-full flex-1 border-0 bg-white"
                title={activeSource.title}
                onError={() => setIframeError(true)}
              />

              {/* Informative fallback bar at the bottom */}
              <div className="bg-slate-50 border-t border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                  <Globe size={12} className="text-orange-500 shrink-0" />
                  <span className="truncate">{activeSource.url}</span>
                </div>

                <button
                  onClick={() => setPageDisplayMode('reader')}
                  className="text-orange-600 font-semibold hover:underline shrink-0"
                >
                  Switch to Reader View →
                </button>
              </div>
            </div>
          )}

          {/* VIEW OPTION B: SPIDER READER & EXTRACTION (GUARANTEED NEVER BROKEN) */}
          {pageDisplayMode === 'reader' && (
            <div className="flex-1 w-full overflow-y-auto px-4 py-4 space-y-5 pb-24 scroll-smooth">
              {/* Article Header */}
              <div className="border-b border-slate-200 pb-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-semibold text-orange-600">
                    <Globe size={13} />
                    <span>{activeSource.domain}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {activeSource.captured_at ? new Date(activeSource.captured_at).toLocaleTimeString() : 'Live'}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {activeSource.title}
                </h1>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-sans">
                  <span>By {activeSource.metadata?.author || 'Web Contributor'}</span>
                  <span>·</span>
                  <span>{activeSource.wordCount} words</span>
                  <span>·</span>
                  <span className="text-orange-600 font-bold">{activeSource.chunksCount} chunks harvested</span>
                </div>
              </div>

              {/* Interactive Paragraphs with Tap-To-Harvest */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-orange-500" />
                  <span>Tap any paragraph to guide the spider to extract facts</span>
                </div>

                {activeSource.rawContent?.split('\n\n').map((paragraph, idx) => {
                  const isHeading = paragraph.endsWith(':') || (paragraph.length < 55 && !paragraph.endsWith('.'));
                  const isHighlighted = highlightedParagraphIndex === idx;

                  if (isHeading) {
                    return (
                      <h2
                        key={idx}
                        id={`page-p-${idx}`}
                        onClick={e => onParagraphTap?.(paragraph, idx, e)}
                        className="text-base font-bold text-slate-900 pt-3 border-t border-slate-100 cursor-pointer hover:text-orange-600 transition-colors"
                      >
                        {paragraph}
                      </h2>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      id={`page-p-${idx}`}
                      onClick={e => onParagraphTap?.(paragraph, idx, e)}
                      className={`relative p-3 rounded-2xl transition-all duration-300 text-sm leading-relaxed cursor-pointer ${
                        isHighlighted
                          ? 'bg-orange-50 border-2 border-orange-500 shadow-sm text-slate-900'
                          : 'hover:bg-slate-50 border border-transparent hover:border-slate-200 text-slate-700'
                      }`}
                    >
                      {isHighlighted && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <Sparkles size={10} />
                          <span>HARVESTING CHUNK</span>
                        </div>
                      )}
                      <p>{paragraph}</p>
                    </div>
                  );
                })}
              </div>

              {/* Discovered Outbound Links on this Page */}
              {activeSource.links && activeSource.links.length > 0 && (
                <div className="mt-8 pt-4 border-t border-slate-200 space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Discovered Web Links ({activeSource.links.length})
                  </h4>
                  <div className="space-y-1.5">
                    {activeSource.links.slice(0, 5).map((link, lIdx) => (
                      <div
                        key={lIdx}
                        onClick={() => onNavigateUrl(link)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="text-xs text-slate-800 font-medium truncate max-w-[280px]">
                          {link}
                        </span>
                        <ArrowUpRight size={13} className="text-orange-500 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
