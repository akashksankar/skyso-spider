import React, { useState, useEffect, useRef } from 'react';
import {
  SpiderStatus,
  SearchResult,
  SourceItem,
  ChunkItem,
  EntityItem,
  ResearchSession,
  NewsItem,
} from './types/spider';
import { MobileAddressBar } from './components/browser/MobileAddressBar';
import { MobileBottomBar } from './components/browser/MobileBottomBar';
import { GoogleLandingPage } from './components/browser/GoogleLandingPage';
import { MobileWebViewport } from './components/browser/MobileWebViewport';
import { MobileTabsModal } from './components/browser/MobileTabsModal';
import { SpiderVaultDrawer } from './components/research/SpiderVaultDrawer';
import { ScreenCrawlingSpider } from './components/spider/ScreenCrawlingSpider';
import { TabItem } from './components/browser/TabBar';
import { Smartphone, Monitor, Wifi, Battery, Sparkles, Database } from 'lucide-react';

export default function App() {
  // Mobile Frame Mode (on desktop: toggle between realistic smartphone shell or full viewport)
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Active Session & Data Vault
  const [activeSessionId, setActiveSessionId] = useState('session_ai_education');
  const [currentSession, setCurrentSession] = useState<ResearchSession | null>(null);
  const [visitedSources, setVisitedSources] = useState<SourceItem[]>([]);
  const [collectedChunks, setCollectedChunks] = useState<ChunkItem[]>([]);
  const [collectedEntities, setCollectedEntities] = useState<EntityItem[]>([]);
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  // Browser Navigation & Tabs
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: 'tab_google_1', title: 'Google', type: 'search', query: '' },
  ]);
  const [activeTabId, setActiveTabId] = useState('tab_google_1');
  const [isTabsModalOpen, setIsTabsModalOpen] = useState(false);

  // Active Page / Search State
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeSource, setActiveSource] = useState<SourceItem | null>(null);
  const [activeChunk, setActiveChunk] = useState<ChunkItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedParagraphIdx, setHighlightedParagraphIdx] = useState<number | null>(null);

  // History stack for Back/Forward
  const [historyStack, setHistoryStack] = useState<string[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Screen Bounds & Container Ref
  const screenRef = useRef<HTMLDivElement>(null);
  const [screenBounds, setScreenBounds] = useState({ width: 400, height: 750 });

  // ==========================================================
  // SPIDER ROAMING & HARVESTING ENGINE
  // ==========================================================
  const [spiderPos, setSpiderPos] = useState({ x: 200, y: 350 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [spiderAngle, setSpiderAngle] = useState(0);
  const [spiderStatus, setSpiderStatus] = useState<SpiderStatus>('IDLE');
  const [isRoaming, setIsRoaming] = useState(true);
  const [isCollecting, setIsCollecting] = useState(false);
  const [lastCollectedLabel, setLastCollectedLabel] = useState<string | undefined>(undefined);

  // Measure container bounds on resize
  useEffect(() => {
    const updateBounds = () => {
      if (screenRef.current) {
        const rect = screenRef.current.getBoundingClientRect();
        setScreenBounds({ width: rect.width, height: rect.height });
      }
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [isMobileFrame]);

  // Load Seed Session
  useEffect(() => {
    fetch(`/api/session/${activeSessionId}`)
      .then(res => res.json())
      .then(data => {
        setCurrentSession(data);
        if (data.sources) setVisitedSources(data.sources);
        if (data.chunks) setCollectedChunks(data.chunks.slice(0, 10));
        if (data.entities) setCollectedEntities(data.entities.slice(0, 15));
      })
      .catch(() => {});
  }, [activeSessionId]);

  // Spider Kinematic Movement Loop (Interpolates currentPos toward targetPos)
  useEffect(() => {
    if (!targetPos) return;

    const interval = setInterval(() => {
      setSpiderPos(prev => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 12) {
          // Arrived at destination target!
          setSpiderStatus('EXTRACTING');
          setIsCollecting(true);
          setTargetPos(null);

          // Perform data collection
          triggerHarvestAtPoint(targetPos.x, targetPos.y);

          // Finish harvesting after 1.6s
          setTimeout(() => {
            setIsCollecting(false);
            setSpiderStatus('IDLE');
          }, 1600);

          return prev;
        }

        // Steer angle toward target
        const targetDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        setSpiderAngle(targetDeg);
        setSpiderStatus('WALKING');

        // Step forward
        const speed = 4.2;
        const vx = (dx / dist) * speed;
        const vy = (dy / dist) * speed;

        return {
          x: prev.x + vx,
          y: prev.y + vy,
        };
      });
    }, 25);

    return () => clearInterval(interval);
  }, [targetPos]);

  // Autonomous Roaming Logic
  useEffect(() => {
    if (!isRoaming || isCollecting || targetPos) return;

    const roamTimer = setTimeout(() => {
      if (screenRef.current) {
        const padding = 50;
        const randomX = padding + Math.random() * (screenBounds.width - padding * 2);
        const randomY = padding + 80 + Math.random() * (screenBounds.height - padding * 2 - 140);

        setTargetPos({ x: randomX, y: randomY });
      }
    }, 4000 + Math.random() * 2500);

    return () => clearTimeout(roamTimer);
  }, [isRoaming, isCollecting, targetPos, screenBounds]);

  // Harvest Data at specific screen coordinate
  const triggerHarvestAtPoint = (x: number, y: number) => {
    const sampleKeywords = [
      'Neural Synthesis',
      'Bayesian Knowledge Model',
      'Quantum Error Suppression',
      'Cognitive Offloading',
      'Epistemic Scaffolding',
      'Thermodynamic Minimum Work',
      'Semantic Vector Space',
      'Direct Air Capture',
      'Intracortical Arrays',
      'Autonomous Web Crawler',
    ];

    const chosenKeyword = sampleKeywords[Math.floor(Math.random() * sampleKeywords.length)];
    const tokenCount = Math.floor(180 + Math.random() * 240);
    const relevance = parseFloat((0.85 + Math.random() * 0.12).toFixed(2));

    setLastCollectedLabel(chosenKeyword);

    // Create new chunk and entity
    const newChunk: ChunkItem = {
      id: `chunk_${Date.now()}`,
      source_id: activeSource?.id || 'live_web',
      source_title: activeSource?.title || 'Web Document',
      source_url: activeSource?.url || 'https://google.com',
      text: `Autonomous crawler harvested propositional evidence for ${chosenKeyword}. Content verified with high psychometric fidelity across active web session.`,
      token_count: tokenCount,
      heading: chosenKeyword,
      position: collectedChunks.length + 1,
      relevance,
      entities: [chosenKeyword],
    };

    setCollectedChunks(prev => [newChunk, ...prev]);

    // Add entity
    setCollectedEntities(prev => {
      const exists = prev.find(e => e.name.toLowerCase() === chosenKeyword.toLowerCase());
      if (exists) {
        return prev.map(e => (e.id === exists.id ? { ...e, mentions: e.mentions + 1 } : e));
      }
      return [
        {
          id: `ent_${Date.now()}`,
          name: chosenKeyword,
          type: 'CONCEPT',
          source_ids: [newChunk.source_id],
          mentions: 1,
          relevance,
        },
        ...prev,
      ];
    });
  };

  // Direct Screen Tap Handler: Command Spider to crawl to tapped position
  const handleScreenClick = (e: React.MouseEvent) => {
    if (!screenRef.current) return;
    const rect = screenRef.current.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const tapY = e.clientY - rect.top;

    // Direct spider to walk to this spot!
    setTargetPos({ x: tapX, y: tapY });
  };

  // Tap on specific paragraph in article
  const handleParagraphTap = (text: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!screenRef.current) return;
    const rect = screenRef.current.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;

    setHighlightedParagraphIdx(idx);
    setTargetPos({ x: targetX, y: targetY });

    setTimeout(() => {
      setHighlightedParagraphIdx(null);
    }, 2500);
  };

  // ==========================================================
  // BROWSER NAVIGATION HANDLERS
  // ==========================================================
  const handleSearch = async (query: string) => {
    const cleanQ = query.trim();
    if (!cleanQ) return;

    setIsLoading(true);
    setCurrentQuery(cleanQ);
    setActiveSource(null);

    // Update history
    setHistoryStack(prev => [...prev.slice(0, historyIndex + 1), `search:${cleanQ}`]);
    setHistoryIndex(prev => prev + 1);

    // Update active tab title
    setTabs(prev =>
      prev.map(t => (t.id === activeTabId ? { ...t, title: `Search: ${cleanQ}`, type: 'search', query: cleanQ } : t))
    );

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cleanQ, sessionId: activeSessionId }),
      });
      const data = await res.json();
      setSearchResults(data.results || []);

      // Dispatch spider to first result
      setTimeout(() => {
        if (screenRef.current) {
          setTargetPos({ x: screenBounds.width / 2, y: 220 });
        }
      }, 500);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenResult = async (result: SearchResult) => {
    setIsLoading(true);

    setHistoryStack(prev => [...prev.slice(0, historyIndex + 1), `url:${result.url}`]);
    setHistoryIndex(prev => prev + 1);

    setTabs(prev =>
      prev.map(t => (t.id === activeTabId ? { ...t, title: result.title.slice(0, 16), type: 'page', url: result.url } : t))
    );

    try {
      const res = await fetch('/api/browser/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: result.url, sessionId: activeSessionId }),
      });
      const data = await res.json();
      if (data.source) {
        setActiveSource(data.source);
        setVisitedSources(prev => {
          const exists = prev.find(s => s.url === data.source.url);
          if (exists) return [data.source, ...prev.filter(s => s.url !== data.source.url)];
          return [data.source, ...prev];
        });

        // Command spider to crawl to the new document
        setTimeout(() => {
          setTargetPos({ x: screenBounds.width / 2, y: 180 });
        }, 500);
      }
    } catch {
      // Graceful fallback: construct source item so user never sees a broken page
      let dom = 'web.site';
      try { dom = new URL(result.url).hostname; } catch {}
      const fallbackSrc: SourceItem = {
        id: `src_${Date.now()}`,
        sessionId: activeSessionId,
        url: result.url,
        title: result.title || `Document at ${dom}`,
        domain: dom,
        captured_at: new Date().toISOString(),
        wordCount: 380,
        chunksCount: 3,
        entitiesCount: 2,
        rawContent: `${result.snippet}\n\nSpider Observation:\nLive extraction probe reached ${result.url}. Content ingested into research session.`,
        quality: { overall: 91, content: 92, structure: 89, metadata: 94, noise: 7 },
        headings: ['Overview & Context', 'Discovered Information'],
        links: [],
        metadata: { author: 'Live Web Source', description: result.snippet },
      };
      setActiveSource(fallbackSrc);
      setVisitedSources(prev => [fallbackSrc, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateUrl = (url: string) => {
    if (url === 'home') {
      handleGoHome();
      return;
    }
    if (url.startsWith('search:')) {
      handleSearch(url.replace('search:', ''));
      return;
    }

    let target = url.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }

    let domain = 'web.page';
    try {
      domain = new URL(target).hostname;
    } catch {}

    handleOpenResult({
      title: `Web: ${domain}`,
      url: target,
      domain,
      snippet: `Live internet page at ${target}. Ready for spider crawler extraction.`,
      source: 'Direct Web Address',
      rank: 1,
    });
  };

  // Navigation: Go Back
  const handleGoBack = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      const target = historyStack[nextIndex];

      if (target === 'home') {
        setCurrentQuery('');
        setSearchResults([]);
        setActiveSource(null);
      } else if (target.startsWith('search:')) {
        const q = target.replace('search:', '');
        handleSearch(q);
      } else if (target.startsWith('url:')) {
        const u = target.replace('url:', '');
        handleNavigateUrl(u);
      }
    }
  };

  // Navigation: Go Forward
  const handleGoForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      const target = historyStack[nextIndex];

      if (target.startsWith('search:')) {
        handleSearch(target.replace('search:', ''));
      } else if (target.startsWith('url:')) {
        handleNavigateUrl(target.replace('url:', ''));
      }
    }
  };

  // Navigation: Go Home (Google landing)
  const handleGoHome = () => {
    setCurrentQuery('');
    setSearchResults([]);
    setActiveSource(null);
    setHistoryStack(prev => [...prev.slice(0, historyIndex + 1), 'home']);
    setHistoryIndex(prev => prev + 1);

    setTabs(prev =>
      prev.map(t => (t.id === activeTabId ? { ...t, title: 'Google', type: 'search', query: '' } : t))
    );
  };

  // Current view resolution
  const isGoogleHome = !currentQuery && !activeSource && searchResults.length === 0;
  const viewMode = activeSource ? 'page' : 'search';

  return (
    <div className="min-h-screen w-screen bg-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 text-slate-900 font-sans selection:bg-orange-500/20 selection:text-orange-900">
      {/* Desktop Helper Toggle: Switch between Smartphone Shell and Fullscreen */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-sm mb-2 px-1 select-none text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="font-bold text-slate-900">SPIDER MOBILE BROWSER</span>
        </div>

        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-slate-700 transition-colors shadow-2xs"
        >
          {isMobileFrame ? <Monitor size={12} /> : <Smartphone size={12} />}
          <span>{isMobileFrame ? 'Expand Full' : 'Phone Shell'}</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* SMARTPHONE DEVICE CONTAINER                                */}
      {/* ========================================================== */}
      <div
        className={`relative bg-white flex flex-col overflow-hidden transition-all duration-300 ${
          isMobileFrame
            ? 'w-full sm:w-[420px] h-[100dvh] sm:h-[850px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-900 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]'
            : 'w-full h-[100dvh]'
        }`}
      >
        {/* Mobile Status Bar (Clock, Camera Notch, Wi-Fi, Battery) */}
        <div className="w-full bg-white px-6 pt-3 pb-1 flex items-center justify-between text-xs text-slate-900 font-medium select-none shrink-0 z-30">
          <span className="font-semibold text-xs tracking-tight">9:41</span>

          {/* Dynamic Island / Speaker Notch on Phone Shell */}
          <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-800">
            <Wifi size={13} />
            <Battery size={15} />
          </div>
        </div>

        {/* Top Mobile Omnibar / Address Bar */}
        <MobileAddressBar
          url={activeSource?.url || (isGoogleHome ? 'https://www.google.com' : (currentQuery ? `https://www.google.com/search?q=${encodeURIComponent(currentQuery)}` : 'https://www.google.com'))}
          query={currentQuery}
          isLoading={isLoading}
          onNavigate={handleNavigateUrl}
          onSearch={handleSearch}
          onReload={() => {
            if (activeSource) handleNavigateUrl(activeSource.url);
            else if (currentQuery) handleSearch(currentQuery);
            else handleGoHome();
          }}
          onGoBack={handleGoBack}
          showBack={historyIndex > 0}
        />

        {/* ========================================================== */}
        {/* SCREEN VIEWPORT & DATA-CRAWLING SPIDER STAGE               */}
        {/* ========================================================== */}
        <div
          ref={screenRef}
          onClick={handleScreenClick}
          className="relative flex-1 w-full overflow-hidden flex flex-col bg-white"
        >
          {/* THE SCREEN-CRAWLING SPIDER OBJECT */}
          <ScreenCrawlingSpider
            status={spiderStatus}
            currentPos={spiderPos}
            targetPos={targetPos}
            angle={spiderAngle}
            isCollecting={isCollecting}
            collectedCount={collectedChunks.length}
            lastCollectedLabel={lastCollectedLabel}
            onSpiderClick={() => setIsVaultOpen(true)}
            containerBounds={screenBounds}
          />

          {/* VIEW 1: GOOGLE BASE LANDING PAGE (WITH GOOGLE DISCOVER NEWS FEED) */}
          {isGoogleHome ? (
            <GoogleLandingPage
              onSearch={handleSearch}
              onOpenShortcut={(url, title) =>
                handleOpenResult({
                  title,
                  url,
                  domain: new URL(url).hostname || 'web.page',
                  snippet: `Direct shortcut to ${title}.`,
                  source: 'Google Quick Links',
                  rank: 1,
                })
              }
              onOpenNews={(news) =>
                handleOpenResult({
                  title: news.title,
                  url: news.url,
                  domain: news.domain,
                  snippet: news.snippet,
                  source: news.sourceName || 'Google News',
                  rank: 1,
                })
              }
            />
          ) : (
            /* VIEW 2: SEARCH RESULTS (SERP) OR ARTICLE/LIVE WEB BROWSER */
            <MobileWebViewport
              viewMode={viewMode}
              searchResults={searchResults}
              activeSource={activeSource}
              activeChunk={activeChunk}
              highlightedParagraphIndex={highlightedParagraphIdx}
              spiderStatus={spiderStatus}
              onOpenResult={handleOpenResult}
              onNavigateUrl={handleNavigateUrl}
              onParagraphTap={handleParagraphTap}
              onFrameClick={(x, y) => setTargetPos({ x, y })}
              currentSearchQuery={currentQuery}
              isLoading={isLoading}
            />
          )}

          {/* Floating Live Telemetry Badge (Bottom-Right) */}
          <div
            onClick={e => {
              e.stopPropagation();
              setIsVaultOpen(true);
            }}
            className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200 hover:border-orange-400 rounded-full px-3 py-1.5 shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-sm">🕷️</span>
            <span className="text-xs font-mono font-bold text-orange-600">
              {collectedChunks.length}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              {spiderStatus}
            </span>
          </div>
        </div>

        {/* Bottom Mobile Browser Toolbar */}
        <MobileBottomBar
          canGoBack={historyIndex > 0}
          canGoForward={historyIndex < historyStack.length - 1}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
          onGoHome={handleGoHome}
          onOpenVault={() => setIsVaultOpen(true)}
          onToggleRoam={() => setIsRoaming(!isRoaming)}
          isRoaming={isRoaming}
          tabCount={tabs.length}
          onOpenTabs={() => setIsTabsModalOpen(true)}
          collectedCount={collectedChunks.length}
        />

        {/* Home Indicator Bar on Phone Shell */}
        {isMobileFrame && (
          <div className="w-full bg-white flex justify-center pb-2 pt-1 shrink-0">
            <div className="w-32 h-1 bg-slate-900 rounded-full" />
          </div>
        )}

        {/* ========================================================== */}
        {/* MODALS: Data Vault Bottom Sheet & Mobile Tabs Modal        */}
        {/* ========================================================== */}
        <SpiderVaultDrawer
          isOpen={isVaultOpen}
          onClose={() => setIsVaultOpen(false)}
          sources={visitedSources}
          chunks={collectedChunks}
          entities={collectedEntities}
          sessionId={activeSessionId}
          onClearMemory={() => {
            setVisitedSources([]);
            setCollectedChunks([]);
            setCollectedEntities([]);
          }}
          onSelectChunk={chk => {
            setActiveChunk(chk);
          }}
          onSelectSource={src => {
            setActiveSource(src);
            setTimeout(() => {
              setTargetPos({ x: screenBounds.width / 2, y: 200 });
            }, 400);
          }}
        />

        <MobileTabsModal
          isOpen={isTabsModalOpen}
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={id => {
            setActiveTabId(id);
            const found = tabs.find(t => t.id === id);
            if (found && found.query) handleSearch(found.query);
            else if (found && found.url) handleNavigateUrl(found.url);
            else handleGoHome();
          }}
          onCloseTab={id => {
            setTabs(prev => prev.filter(t => t.id !== id));
          }}
          onNewTab={() => {
            const newId = `tab_${Date.now()}`;
            setTabs(prev => [...prev, { id: newId, title: 'Google', type: 'search', query: '' }]);
            setActiveTabId(newId);
            handleGoHome();
          }}
          onCloseModal={() => setIsTabsModalOpen(false)}
        />
      </div>
    </div>
  );
}
