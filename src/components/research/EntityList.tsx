import React, { useState } from 'react';
import { EntityItem } from '../../types/spider';
import { Tag, Search, Sparkles } from 'lucide-react';

interface EntityListProps {
  entities: EntityItem[];
  onSelectEntity?: (entity: EntityItem) => void;
}

export const EntityList: React.FC<EntityListProps> = ({ entities, onSelectEntity }) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = entities.filter(e => {
    const matchesQuery = !query || e.name.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === 'ALL' || e.type === typeFilter;
    return matchesQuery && matchesType;
  });

  return (
    <div className="h-full flex flex-col bg-[#08090B] select-none">
      <div className="p-4 border-b border-white/10 space-y-3 bg-[#101216]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Extracted Entities</h3>
          </div>
          <span className="text-xs font-mono text-purple-400">
            {entities.length} concepts
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-black/50 border border-white/10 rounded px-2.5 py-1 text-xs">
            <Search size={12} className="text-slate-500 mr-2" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search concepts, methodologies..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-black/40 rounded border border-white/5 text-[10px] font-mono">
            {['ALL', 'CONCEPT', 'METHODOLOGY', 'TOPIC'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  typeFilter === t
                    ? 'bg-purple-500/30 text-purple-200'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            No entities found.
          </div>
        ) : (
          filtered.map(entity => (
            <div
              key={entity.id}
              onClick={() => onSelectEntity?.(entity)}
              className="p-3 rounded-lg bg-[#11141B] border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-100">
                    {entity.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-purple-300">
                    {entity.type}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Across {entity.source_ids.length} sources
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <div className="text-cyan-400 font-bold">{entity.mentions}×</div>
                <div className="text-[10px] text-slate-500">MENTIONS</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
