import React, { useState } from 'react';
import { ChunkItem, EntityItem, SourceItem } from '../../types/spider';
import { X, Sparkles, Send, Database, Layers, Tag, Trash2, ArrowUpRight, Globe, Newspaper, Copy, Check, Download } from 'lucide-react';

interface SpiderVaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources?: SourceItem[];
  chunks: ChunkItem[];
  entities: EntityItem[];
  sessionId: string;
  onClearMemory?: () => void;
  onSelectChunk?: (chunk: ChunkItem) => void;
  onSelectSource?: (source: SourceItem) => void;
}

export const SpiderVaultDrawer: React.FC<SpiderVaultDrawerProps> = ({
  isOpen,
  onClose,
  sources = [],
  chunks,
  entities,
  sessionId,
  onClearMemory,
  onSelectChunk,
  onSelectSource,
}) => {
  const [activeTab, setActiveTab] = useState<'sites' | 'chunks' | 'entities' | 'ask'>('sites');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isQuerying) return;
    setIsQuerying(true);
    setAnswer(null);

    try {
      const res = await fetch('/api/research/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err: any) {
      setAnswer(`Synthesis error: ${err.message}`);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleCopyExport = () => {
    let report = `# SPIDER CRAWLER KNOWLEDGE VAULT REPORT\n\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Total Visited Sites: ${sources.length}\n`;
    report += `Harvested Chunks: ${chunks.length}\n`;
    report += `Extracted Entities: ${entities.length}\n\n`;

    report += `## 1. Visited Sites & News Articles\n`;
    sources.forEach((s, idx) => {
      report += `${idx + 1}. [${s.title}](${s.url}) — ${s.domain} (${s.wordCount} words, ${s.chunksCount} chunks)\n`;
    });

    report += `\n## 2. Key Knowledge Entities\n`;
    entities.slice(0, 20).forEach(e => {
      report += `- **${e.name}** (${e.type}) — Mentions: ${e.mentions}, Relevance: ${e.relevance}\n`;
    });

    report += `\n## 3. Harvested Propositional Chunks\n`;
    chunks.slice(0, 15).forEach((c, idx) => {
      report += `### ${idx + 1}. ${c.heading} (from ${c.source_title})\n${c.text}\n\n`;
    });

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-3 shrink-0" />

        {/* Drawer Header */}
        <div className="px-5 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕷️</span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Spider Data Vault
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                {sources.length} sites · {chunks.length} chunks · {entities.length} concepts stored
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyExport}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-orange-600 transition-colors flex items-center gap-1 text-[11px] font-medium"
              title="Export all collected research as Markdown"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Export'}</span>
            </button>

            {onClearMemory && (
              <button
                onClick={onClearMemory}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
                title="Clear collected data"
              >
                <Trash2 size={15} />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Segmented Control Tabs */}
        <div className="px-5 pt-3 pb-2 shrink-0">
          <div className="grid grid-cols-4 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('sites')}
              className={`py-1.5 rounded-lg transition-all truncate px-1 ${
                activeTab === 'sites'
                  ? 'bg-white text-orange-600 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Sites ({sources.length})
            </button>
            <button
              onClick={() => setActiveTab('chunks')}
              className={`py-1.5 rounded-lg transition-all truncate px-1 ${
                activeTab === 'chunks'
                  ? 'bg-white text-orange-600 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Chunks ({chunks.length})
            </button>
            <button
              onClick={() => setActiveTab('entities')}
              className={`py-1.5 rounded-lg transition-all truncate px-1 ${
                activeTab === 'entities'
                  ? 'bg-white text-orange-600 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Entities ({entities.length})
            </button>
            <button
              onClick={() => setActiveTab('ask')}
              className={`py-1.5 rounded-lg transition-all truncate px-1 flex items-center justify-center gap-1 ${
                activeTab === 'ask'
                  ? 'bg-white text-orange-600 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Sparkles size={11} className="text-orange-500" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 pb-8">
          {/* TAB 1: VISITED SITES & NEWS ARTICLES */}
          {activeTab === 'sites' && (
            <div className="space-y-3">
              {sources.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-sans space-y-1">
                  <Globe size={24} className="mx-auto text-slate-300 mb-2" />
                  <p>No websites or news crawled yet.</p>
                  <p className="text-[11px] text-slate-400">Search on Google or open any news article to let the spider collect details!</p>
                </div>
              ) : (
                sources.map((src, i) => (
                  <div
                    key={src.id || i}
                    onClick={() => {
                      if (onSelectSource) onSelectSource(src);
                      onClose();
                    }}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-xs bg-white transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Globe size={13} className="text-orange-500" />
                        <span className="truncate max-w-[200px]">{src.domain}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {src.captured_at ? new Date(src.captured_at).toLocaleTimeString() : 'Recent'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {src.title}
                    </h4>

                    {src.metadata?.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {src.metadata.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                      <span>{src.wordCount} words · {src.chunksCount} chunks</span>
                      <span className="text-orange-600 font-bold flex items-center gap-0.5">
                        <span>Open & Crawl</span>
                        <ArrowUpRight size={10} />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: HARVESTED CHUNKS LIST */}
          {activeTab === 'chunks' && (
            <div className="space-y-2.5">
              {chunks.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-sans">
                  No data chunks harvested yet. Watch the spider roam the screen or tap any paragraph to harvest!
                </div>
              ) : (
                chunks.map((chk, i) => (
                  <div
                    key={chk.id + i}
                    onClick={() => onSelectChunk?.(chk)}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-xs bg-white transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-orange-600 text-[11px] truncate max-w-[200px]">
                        {chk.heading}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                        <span>{chk.token_count} tok</span>
                        <span className="text-emerald-600 font-semibold">
                          {(chk.relevance * 100).toFixed(0)}% rel
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-sans line-clamp-3">
                      {chk.text}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                      <span className="truncate max-w-[220px]">{chk.source_title}</span>
                      <span>#pos {chk.position}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: EXTRACTED ENTITIES */}
          {activeTab === 'entities' && (
            <div className="space-y-2">
              {entities.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-sans">
                  No entities extracted yet. Spider will extract concepts as it visits websites.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {entities.map((ent, i) => (
                    <div
                      key={ent.id + i}
                      className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-800"
                    >
                      <span className="font-semibold">{ent.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-700 font-bold">
                        {ent.mentions}x
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ASK SPIDER AI */}
          {activeTab === 'ask' && (
            <div className="space-y-4">
              <form onSubmit={handleAsk} className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Ask a question about the collected sites & data..."
                  className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:border-orange-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={isQuerying || !question.trim()}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1 shadow-xs"
                >
                  <Send size={12} />
                  <span>Ask</span>
                </button>
              </form>

              {isQuerying && (
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <span>Synthesizing response from harvested knowledge vault...</span>
                </div>
              )}

              {answer && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans space-y-2">
                  <div className="font-bold text-orange-600 flex items-center gap-1">
                    <Sparkles size={13} />
                    <span>Spider AI Synthesis</span>
                  </div>
                  <div className="whitespace-pre-wrap">{answer}</div>
                </div>
              )}

              <div className="text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-500">Sample research queries:</p>
                <div className="flex flex-wrap gap-1">
                  {[
                    'Summarize the news gathered',
                    'What are the key technical findings?',
                    'Which entities are most prominent?',
                  ].map(sq => (
                    <button
                      key={sq}
                      type="button"
                      onClick={() => {
                        setQuestion(sq);
                      }}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 text-[10px] text-slate-600 hover:text-orange-600 border border-slate-200 transition-colors"
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
