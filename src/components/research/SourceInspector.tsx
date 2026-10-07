import React from 'react';
import { SourceItem } from '../../types/spider';
import { ExternalLink, CheckCircle2, Clock, Globe, ShieldCheck } from 'lucide-react';

interface SourceInspectorProps {
  source: SourceItem | null;
  onClose?: () => void;
}

export const SourceInspector: React.FC<SourceInspectorProps> = ({ source, onClose }) => {
  if (!source) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-xs">
        Select a source to inspect extraction metrics and semantic quality.
      </div>
    );
  }

  const { quality } = source;

  return (
    <div className="p-6 space-y-6 select-none bg-[#0D0F13] h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <Globe size={12} className="text-cyan-400" />
            <span className="text-white font-semibold">{source.domain}</span>
            <span aria-hidden="true">·</span>
            <span>ID: {source.id}</span>
          </div>
          <h3 className="text-base font-bold text-white leading-snug">{source.title}</h3>
          <p className="text-xs font-mono text-slate-400 truncate max-w-lg">{source.url}</p>
        </div>

        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Open Source URL"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Extraction Quality Gauge Section */}
      <div className="space-y-3 p-4 rounded-lg bg-[#12151C] border border-white/5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Extraction Quality Audit
          </h4>
          <span className="font-mono text-sm font-bold text-cyan-400">
            {quality.overall}% OVERALL
          </span>
        </div>

        {/* Quality Progress Meter */}
        <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${quality.overall}%` }}
          />
        </div>

        {/* Sub-Metric Bars */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Content Fidelity</span>
              <span className="text-slate-200">{quality.content}%</span>
            </div>
            <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${quality.content}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>DOM Structure</span>
              <span className="text-slate-200">{quality.structure}%</span>
            </div>
            <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${quality.structure}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Metadata Purity</span>
              <span className="text-slate-200">{quality.metadata}%</span>
            </div>
            <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400" style={{ width: `${quality.metadata}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Boilerplate Noise</span>
              <span className="text-slate-200">{quality.noise}%</span>
            </div>
            <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-rose-400" style={{ width: `${quality.noise * 3}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Captured Telemetry Details */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-[#12151C] border border-white/5 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Word Count</div>
          <div className="text-lg font-mono font-bold text-white tabular-nums">{source.wordCount}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#12151C] border border-white/5 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Semantic Chunks</div>
          <div className="text-lg font-mono font-bold text-cyan-400 tabular-nums">{source.chunksCount}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#12151C] border border-white/5 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Extracted Entities</div>
          <div className="text-lg font-mono font-bold text-purple-400 tabular-nums">{source.entitiesCount}</div>
        </div>
      </div>

      {/* Section Headings Discovered */}
      {source.headings && source.headings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Detected Section Boundaries
          </h4>
          <div className="space-y-1">
            {source.headings.map((h, i) => (
              <div
                key={i}
                className="px-3 py-1.5 rounded bg-white/[0.02] border border-white/5 text-xs text-slate-300 font-mono"
              >
                § {h}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
