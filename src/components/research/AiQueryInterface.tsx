import React, { useState } from 'react';
import { Sparkles, Send, BookOpen, ExternalLink, ArrowRight, Layers } from 'lucide-react';
import { ChunkItem } from '../../types/spider';

interface Citation {
  index: number;
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
  chunkId: string;
  heading: string;
  excerpt: string;
}

interface AiQueryInterfaceProps {
  sessionId: string;
  onSelectChunk?: (chunkId: string) => void;
}

export const AiQueryInterface: React.FC<AiQueryInterfaceProps> = ({ sessionId, onSelectChunk }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setAnswer(null);
    setCitations([]);

    try {
      const res = await fetch('/api/research/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, question: q }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setCitations(data.citations || []);
    } catch (err: any) {
      setAnswer(`Query failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'What pedagogical benefits and limitations are cited?',
    'How does cognitive offloading differ from epistemic scaffolding?',
    'Which thermodynamic limits govern direct air capture?',
    'What do the sources agree on regarding automated assessment?',
  ];

  return (
    <div className="h-full flex flex-col bg-[#08090B] select-none p-5 space-y-5 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">
            AI Research Synthesis & Citation Engine
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Vector cosine retrieval over session chunks with strict attribution citations [Source XX]
        </p>
      </div>

      {/* Query Input Box */}
      <form onSubmit={handleQuery} className="space-y-3">
        <div className="relative flex items-center bg-[#101216] border border-white/10 focus-within:border-cyan-500/60 rounded-lg p-2 transition-colors">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask this research session (e.g. What are the key findings?)..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none font-mono px-2"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="px-3 py-1.5 rounded bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-30 disabled:hover:bg-cyan-500 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                <span>SYNTHESIZING...</span>
              </span>
            ) : (
              <>
                <span>Query</span>
                <Send size={12} />
              </>
            )}
          </button>
        </div>

        {/* Preset prompts */}
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQuestion(sq)}
              className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5 transition-colors text-left"
            >
              "{sq}"
            </button>
          ))}
        </div>
      </form>

      {/* Answer Area */}
      {answer && (
        <div className="space-y-4 p-4 rounded-lg bg-[#11141B] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              SYNTHESIZED RESEARCH EVIDENCE
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {citations.length} cited chunks
            </span>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
            {answer}
          </div>

          {/* Citations Grid */}
          {citations.length > 0 && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Grounding Citations & Source Evidence
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {citations.map(cit => (
                  <div
                    key={cit.index}
                    onClick={() => onSelectChunk?.(cit.chunkId)}
                    className="p-2.5 rounded bg-black/40 border border-white/5 hover:border-cyan-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-cyan-400 font-bold">
                        [Source 0{cit.index}]
                      </span>
                      <span className="text-slate-500 truncate max-w-[140px]">
                        § {cit.heading}
                      </span>
                    </div>

                    <h5 className="text-xs font-medium text-slate-300 group-hover:text-cyan-300 transition-colors truncate">
                      {cit.sourceTitle}
                    </h5>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {cit.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
