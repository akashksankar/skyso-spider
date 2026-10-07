import React, { useState } from 'react';
import { ChunkItem } from '../../types/spider';
import { Layers, Search, Cpu, Sparkles } from 'lucide-react';

interface ChunkListProps {
  chunks: ChunkItem[];
  activeChunkId?: string;
  onSelectChunk?: (chunk: ChunkItem) => void;
}

export const ChunkList: React.FC<ChunkListProps> = ({
  chunks,
  activeChunkId,
  onSelectChunk,
}) => {
  const [query, setQuery] = useState('');

  const filtered = chunks.filter(c => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.text.toLowerCase().includes(q) ||
      c.heading.toLowerCase().includes(q) ||
      c.source_title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-full flex flex-col bg-[#08090B] select-none">
      {/* Search & Header */}
      <div className="p-4 border-b border-white/10 space-y-3 bg-[#101216]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Semantic Chunks</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {chunks.length} vectorized
          </span>
        </div>

        <div className="flex items-center bg-black/50 border border-white/10 rounded px-2.5 py-1 text-xs">
          <Search size={12} className="text-slate-500 mr-2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search chunk text or headings..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none font-mono"
          />
        </div>
      </div>

      {/* Chunk Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            No semantic chunks found matching "{query}".
          </div>
        ) : (
          filtered.map(chunk => {
            const isSelected = chunk.id === activeChunkId;
            return (
              <div
                key={chunk.id}
                onClick={() => onSelectChunk?.(chunk)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-[#11141B] border-white/5 hover:border-white/20'
                }`}
              >
                {/* Meta header */}
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-cyan-400 font-semibold">{chunk.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-300">POS: {chunk.position}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{chunk.token_count} TOKENS</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-emerald-400 font-semibold">
                      REL: {chunk.relevance}
                    </span>
                  </div>
                </div>

                {/* Heading tag */}
                <div className="text-xs font-semibold text-slate-200 mb-1">
                  § {chunk.heading}
                </div>

                {/* Text excerpt */}
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {chunk.text}
                </p>

                {/* Source attribution & entities */}
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="truncate max-w-[200px] text-slate-400">
                    {chunk.source_title}
                  </span>

                  {chunk.entities && chunk.entities.length > 0 && (
                    <span className="text-cyan-400 truncate">
                      {chunk.entities.slice(0, 2).join(' · ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
