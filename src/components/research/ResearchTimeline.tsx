import React from 'react';
import { SpiderEvent } from '../../types/spider';
import { Terminal, Shield, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

interface ResearchTimelineProps {
  events: SpiderEvent[];
  onClear?: () => void;
}

export const ResearchTimeline: React.FC<ResearchTimelineProps> = ({ events, onClear }) => {
  const getEventBadge = (type: SpiderEvent['type']) => {
    switch (type) {
      case 'SEARCH_STARTED':
      case 'SEARCH_RESULT':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/40';
      case 'PAGE_OPENED':
      case 'PAGE_SCANNING':
        return 'text-indigo-400 bg-indigo-950/40 border-indigo-800/40';
      case 'DOM_DETECTED':
      case 'TEXT_EXTRACTED':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      case 'CHUNK_CREATED':
      case 'EMBEDDING_CREATED':
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
      case 'ENTITY_FOUND':
      case 'RELATIONSHIP_FOUND':
        return 'text-purple-400 bg-purple-950/40 border-purple-800/40';
      case 'ERROR':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/40';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#08090B] select-none font-mono">
      {/* Header */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-[#101216]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-cyan-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Crawler Event Bus
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>STREAM ACTIVE ({events.length})</span>
        </div>
      </div>

      {/* Events Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
        {events.length === 0 ? (
          <div className="text-center py-16 text-slate-600 text-xs">
            Awaiting crawler dispatch events...
          </div>
        ) : (
          events.map(evt => {
            const timeStr = new Date(evt.timestamp).toTimeString().split(' ')[0];
            const badgeClass = getEventBadge(evt.type);

            return (
              <div
                key={evt.id}
                className="p-2 rounded bg-[#0D0F14] border border-white/5 hover:border-white/15 transition-colors flex items-start gap-2.5"
              >
                {/* Timestamp */}
                <span className="text-[10px] text-slate-500 tabular-nums shrink-0 pt-0.5">
                  {timeStr}
                </span>

                {/* Event Type Badge */}
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded border shrink-0 font-bold ${badgeClass}`}
                >
                  {evt.type}
                </span>

                {/* Event Details */}
                <div className="text-slate-300 text-[11px] truncate flex-1">
                  {evt.type === 'SEARCH_STARTED' && (
                    <span>Query: "{evt.data.query}"</span>
                  )}
                  {evt.type === 'SEARCH_RESULT' && (
                    <span>Found {evt.data.count} candidates · Top: {evt.data.topRank}</span>
                  )}
                  {evt.type === 'PAGE_OPENED' && (
                    <span className="truncate">{evt.data.url}</span>
                  )}
                  {evt.type === 'PAGE_SCANNING' && (
                    <span>Spider legs initiated DOM topological scan</span>
                  )}
                  {evt.type === 'DOM_DETECTED' && (
                    <span>Parsed {evt.data.elementsCount} semantic blocks</span>
                  )}
                  {evt.type === 'TEXT_EXTRACTED' && (
                    <span>Normalized {evt.data.wordCount} words (Trafilatura clean)</span>
                  )}
                  {evt.type === 'CHUNK_CREATED' && (
                    <span>
                      {evt.data.chunk_id} · {evt.data.tokens} tokens · Rel: {evt.data.relevance}
                    </span>
                  )}
                  {evt.type === 'EMBEDDING_CREATED' && (
                    <span>Vector project {evt.data.dimensions}D space · FAISS cached</span>
                  )}
                  {evt.type === 'ENTITY_FOUND' && (
                    <span className="text-purple-300 font-semibold">
                      Concept: {evt.data.name} ({evt.data.type})
                    </span>
                  )}
                  {evt.type === 'RELATIONSHIP_FOUND' && (
                    <span>Edge: {evt.data.type} ({evt.data.from} → {evt.data.to})</span>
                  )}
                  {evt.type === 'LINK_DISCOVERED' && (
                    <span>Discovered {evt.data.count} outbound crawler leaves</span>
                  )}
                  {evt.type === 'CRAWL_STARTED' && (
                    <span className="text-cyan-300 font-semibold">Autonomous crawler cycle dispatched</span>
                  )}
                  {evt.type === 'CRAWL_FINISHED' && (
                    <span className="text-emerald-300 font-semibold">Crawler session completed successfully</span>
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
