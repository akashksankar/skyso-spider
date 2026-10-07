import React from 'react';
import { Spider } from '../spider/Spider';
import { ArrowRight, Globe, Layers, GitBranch, Cpu, Shield, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-[#08090B] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Bar: follows top-bar contract strictly */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <span className="text-xl font-bold tracking-tight text-white font-mono">
            SPIDER
          </span>
          <span className="text-xs font-mono text-cyan-400">· SKYSO LABS</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-slate-400">
          <a href="#visual-crawling" className="hover:text-white transition-colors">Visual Crawling</a>
          <a href="#semantic-extraction" className="hover:text-white transition-colors">Semantic Extraction</a>
          <a href="#knowledge-graph" className="hover:text-white transition-colors">Knowledge Graph</a>
          <a href="#research-memory" className="hover:text-white transition-colors">Research Memory</a>
        </nav>

        <div>
          <button
            onClick={onLaunch}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold text-xs font-mono hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <span>Launch Spider</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-5xl mx-auto w-full relative">
        {/* Subtle background tech grid */}
        <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

        {/* Ambient glow */}
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -top-20" />

        {/* Animated Procedural Spider Hero Visual */}
        <div className="mb-6 relative z-10">
          <Spider
            status="WALKING"
            size={240}
            activeChunkCount={42}
            lastTokenCount={384}
            lastRelevance={0.92}
            showLabels={false}
          />
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>OPEN R&D PROTOCOL · VERSION 1.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance">
            See the web. Watch the data. Understand the crawl.
          </h1>

          <p className="text-base text-slate-400 font-sans leading-relaxed text-balance">
            An experimental visual browser for machine-assisted web research. SPIDER visualizes computation instead of hiding it—procedural kinematics, semantic chunking, and knowledge graph construction in real time.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={onLaunch}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-black font-bold text-sm font-mono hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              <span>Launch Research Environment</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-20 text-left w-full relative z-10">
          <div id="visual-crawling" className="p-5 rounded-xl bg-[#101216] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Globe size={16} />
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Visual Crawling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every HTTP probe, DOM parse, and hyperlink traversal maps directly to observable procedural spider kinematics.
            </p>
          </div>

          <div id="semantic-extraction" className="p-5 rounded-xl bg-[#101216] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Layers size={16} />
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Semantic Chunking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Text divided by linguistic heading boundaries, generating local vector embeddings and tactile particle extractions.
            </p>
          </div>

          <div id="knowledge-graph" className="p-5 rounded-xl bg-[#101216] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <GitBranch size={16} />
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Knowledge Graph</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamic force-directed ontology uniting sources, chunks, concepts, and relationships in an organic growing web.
            </p>
          </div>

          <div id="research-memory" className="p-5 rounded-xl bg-[#101216] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400">
              <Cpu size={16} />
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Research Memory & Q&A</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Query sessions with strict numbered citations [Source XX] grounded in verified extracted evidence.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-8 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-3">
        <div>
          SPIDER · An experiment by <span className="text-slate-300">Skyso Labs</span> · Open Source R&D
        </div>
        <div>
          Watch the web become knowledge.
        </div>
      </footer>
    </div>
  );
};
