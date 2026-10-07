import React from 'react';
import { SourceItem } from '../../types/spider';
import { GitBranch, Globe, ArrowDownRight, CheckCircle2, Shield, Radio } from 'lucide-react';

interface CrawlGraphProps {
  rootQuery: string;
  sources: SourceItem[];
  onSelectSource?: (source: SourceItem) => void;
  activeSourceId?: string;
  maxDepth: number;
}

export const CrawlGraph: React.FC<CrawlGraphProps> = ({
  rootQuery,
  sources,
  onSelectSource,
  activeSourceId,
  maxDepth,
}) => {
  return (
    <div className="h-full flex flex-col bg-[#08090B] p-6 overflow-y-auto select-none space-y-6">
      {/* Header Explanation */}
      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <GitBranch size={16} className="text-cyan-400" />
            <span>Crawler Navigation Topology</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Path traversal tree showing where the spider walked (Depth: 0 → {maxDepth})
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <Shield size={12} className="text-emerald-400" />
          <span>ROBOTS.TXT ENFORCED</span>
        </div>
      </div>

      {/* Traversal Tree Diagram */}
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Root Node (Search Query Origin) */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Radio size={18} className="animate-pulse" />
            </div>
            <div className="w-0.5 h-12 bg-cyan-500/30" />
          </div>

          <div className="p-3 rounded-lg bg-[#11141B] border border-cyan-500/30 max-w-xl flex-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              ORIGIN QUERY (DEPTH 0)
            </span>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              "{rootQuery || 'Initial research query'}"
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Dispatched spider crawler across academic & open indexes
            </p>
          </div>
        </div>

        {/* Level 1: Seed Sources Crawled */}
        <div className="pl-6 space-y-6 border-l-2 border-cyan-500/20 ml-5">
          {sources.map((source, idx) => {
            const isActive = source.id === activeSourceId;

            return (
              <div key={source.id} className="space-y-3">
                <div
                  onClick={() => onSelectSource?.(source)}
                  className={`group p-4 rounded-lg cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      : 'bg-[#101216] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span className="text-cyan-400">SOURCE #{idx + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span>DEPTH 1</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-300">{source.domain}</span>
                        <span aria-hidden="true">·</span>
                        <span>{source.chunksCount} chunks generated</span>
                      </div>

                      <h4 className="text-sm font-medium text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {source.title}
                      </h4>

                      <p className="text-xs text-slate-400 font-mono truncate max-w-lg">
                        {source.url}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                      <CheckCircle2 size={11} />
                      <span>INGESTED</span>
                    </div>
                  </div>
                </div>

                {/* Level 2: Discovered Outbound Branch Nodes */}
                {source.links && source.links.length > 0 && (
                  <div className="pl-6 space-y-2 border-l border-white/10 ml-4">
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 uppercase">
                      <ArrowDownRight size={12} />
                      <span>Discovered Leaves (Depth 2 Queue)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {source.links.slice(0, 3).map((link, lIdx) => (
                        <div
                          key={lIdx}
                          className="p-2 rounded bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400 truncate flex items-center gap-1.5"
                        >
                          <Globe size={11} className="text-cyan-500 shrink-0" />
                          <span className="truncate">{link}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
