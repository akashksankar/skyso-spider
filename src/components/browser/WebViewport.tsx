import React, { useRef, useEffect, useState } from 'react';
import { SearchResult, SourceItem, ChunkItem, SpiderStatus } from '../../types/spider';
import { Spider } from '../spider/Spider';
import { ExternalLink, Sparkles, BookOpen, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface WebViewportProps {
  viewMode: 'search' | 'page';
  searchResults: SearchResult[];
  activeSource: SourceItem | null;
  activeChunk: ChunkItem | null;
  highlightedParagraphIndex: number | null;
  spiderStatus: SpiderStatus;
  onOpenResult: (result: SearchResult) => void;
  onNavigateUrl: (url: string) => void;
  onExtractSource: (source: SourceItem) => void;
  onScrollChange?: (scrollRatio: number) => void;
  chunkCount: number;
  lastTokens?: number;
  lastRelevance?: number;
}

export const WebViewport: React.FC<WebViewportProps> = ({
  viewMode,
  searchResults,
  activeSource,
  activeChunk,
  highlightedParagraphIndex,
  spiderStatus,
  onOpenResult,
  onNavigateUrl,
  onExtractSource,
  onScrollChange,
  chunkCount,
  lastTokens,
  lastRelevance,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [spiderScreenY, setSpiderScreenY] = useState(140);
  const [reachCoords, setReachCoords] = useState<{ x: number; y: number } | null>(null);

  // Track scroll and update spider vertical position
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const maxScroll = Math.max(1, scrollHeight - clientHeight);
    const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
    setScrollProgress(ratio);
    onScrollChange?.(ratio);

    // Compute spider Y position relative to visible container
    const boundedY = 90 + ratio * (Math.min(clientHeight - 220, 420));
    setSpiderScreenY(boundedY);
  };

  // When a paragraph is highlighted, compute reach target for Spider front leg
  useEffect(() => {
    if (highlightedParagraphIndex !== null && containerRef.current) {
      const el = containerRef.current.querySelector(`#dom-p-${highlightedParagraphIndex}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setReachCoords({
          x: rect.left - containerRect.left + 30,
          y: rect.top - containerRect.top + 20,
        });
      }
    } else {
      setReachCoords(null);
    }
  }, [highlightedParagraphIndex]);

  return (
    <div className="relative flex-1 h-full overflow-hidden bg-[#0D0F13] flex flex-col">
      {/* Scrollable Document or Search Content Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth"
      >
        {/* ========================================= */}
        {/* VIEW 1: SEARCH RESULTS                    */}
        {/* ========================================= */}
        {viewMode === 'search' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Academic & Web Search Results</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {searchResults.length} verified sources indexed for algorithmic crawling
                  </p>
                </div>
                <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded">
                  READY TO CRAWL
                </div>
              </div>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-white/5 text-slate-400">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-300">No active crawl query</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Enter a research question in the address bar above to dispatch the SPIDER crawler.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((res, i) => (
                  <div
                    key={res.url + i}
                    className="group p-4 rounded-lg bg-[#12151B] border border-white/5 hover:border-cyan-500/40 transition-all hover:bg-[#161A22]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                          <span className="text-cyan-400">#{res.rank}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-300">{res.domain}</span>
                          {res.wordCount && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{res.wordCount} words</span>
                            </>
                          )}
                        </div>

                        <h3
                          onClick={() => onOpenResult(res)}
                          className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 cursor-pointer transition-colors"
                        >
                          {res.title}
                        </h3>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {res.snippet}
                        </p>
                      </div>

                      <button
                        onClick={() => onOpenResult(res)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition-colors"
                      >
                        <span>Dispatch Spider</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 2: ACTIVE PAGE CONTENT & DOM HIGHLIGHT*/}
        {/* ========================================= */}
        {viewMode === 'page' && activeSource && (
          <div className="max-w-3xl mx-auto space-y-6 pb-28">
            {/* Source Header */}
            <div className="border-b border-white/10 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-cyan-400 font-semibold">{activeSource.domain}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(activeSource.captured_at).toLocaleTimeString()}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeSource.wordCount} words</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    title="Open original URL"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              <h1 className="text-xl font-bold text-white tracking-tight">
                {activeSource.title}
              </h1>

              {activeSource.metadata?.author && (
                <p className="text-xs text-slate-400 font-mono">
                  By {activeSource.metadata.author} · Published {activeSource.metadata.publishedDate || '2026'}
                </p>
              )}
            </div>

            {/* Extracted Paragraphs with Animated DOM Region Highlights */}
            <div className="space-y-4">
              {activeSource.rawContent?.split('\n\n').map((paragraph, idx) => {
                const isHeading = paragraph.endsWith(':') || (paragraph.length < 50 && !paragraph.endsWith('.'));
                const isHighlighted = highlightedParagraphIndex === idx;

                if (isHeading) {
                  return (
                    <h2
                      key={idx}
                      id={`dom-p-${idx}`}
                      className="text-base font-semibold text-slate-100 pt-3 border-t border-white/5 font-sans"
                    >
                      {paragraph}
                    </h2>
                  );
                }

                return (
                  <div
                    key={idx}
                    id={`dom-p-${idx}`}
                    className={`relative p-3 rounded-md transition-all duration-300 text-sm leading-relaxed ${
                      isHighlighted
                        ? 'bg-cyan-950/30 border border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.25)] text-slate-100 ring-1 ring-cyan-400/40'
                        : 'bg-white/[0.02] border border-transparent hover:border-white/10 text-slate-300'
                    }`}
                  >
                    {isHighlighted && (
                      <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-cyan-900 border border-cyan-400 text-[10px] font-mono text-cyan-200 uppercase tracking-wider flex items-center gap-1 shadow-md animate-bounce">
                        <Sparkles size={10} />
                        <span>TACTILE EXTRACTION IN PROGRESS</span>
                      </div>
                    )}
                    <p>{paragraph}</p>
                  </div>
                );
              })}
            </div>

            {/* Discovered Outbound Links on this Page */}
            {activeSource.links && activeSource.links.length > 0 && (
              <div className="mt-8 pt-4 border-t border-white/10 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Discovered Crawl Nodes ({activeSource.links.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activeSource.links.map((link, lIdx) => (
                    <button
                      key={lIdx}
                      onClick={() => onNavigateUrl(link)}
                      className="text-left p-2 rounded bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 text-xs font-mono text-cyan-300 truncate transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">{link}</span>
                      <ArrowUpRight size={12} className="shrink-0 ml-1 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* FLOATING SPIDER OBSERVATION STAGE         */}
      {/* Synchronized with viewport scroll & events*/}
      {/* ========================================= */}
      <div
        className="pointer-events-none absolute right-6 z-40 transition-all duration-300 ease-out hidden md:block"
        style={{ top: `${spiderScreenY}px` }}
      >
        <div className="pointer-events-auto bg-[#101216]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl">
          <Spider
            status={spiderStatus}
            activeChunkCount={chunkCount}
            lastTokenCount={lastTokens}
            lastRelevance={lastRelevance}
            reachTarget={reachCoords}
            size={180}
            showLabels={true}
          />
        </div>
      </div>
    </div>
  );
};
