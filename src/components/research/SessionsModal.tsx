import React from 'react';
import { ResearchSession } from '../../types/spider';
import { Folder, Clock, Layers, Globe, Plus, Tag, Check } from 'lucide-react';

interface SessionsModalProps {
  sessions: {
    id: string;
    title: string;
    query: string;
    createdAt: string;
    sourceCount: number;
    chunkCount: number;
    entityCount: number;
  }[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateNewSession: (title: string, query: string) => void;
  onClose: () => void;
}

export const SessionsModal: React.FC<SessionsModalProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateNewSession,
  onClose,
}) => {
  const [newTitle, setNewTitle] = React.useState('');
  const [newQuery, setNewQuery] = React.useState('');
  const [showCreate, setShowCreate] = React.useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateNewSession(newTitle.trim(), newQuery.trim() || newTitle.trim());
    setShowCreate(false);
    setNewTitle('');
    setNewQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-2xl bg-[#101216] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#13161D]">
          <div className="flex items-center gap-2">
            <Folder size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Research Sessions Memory</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1"
          >
            ✕ ESC
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-mono">
              Saved knowledge vaults with persistent sources, vectors, and entity graphs
            </p>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-mono transition-colors"
            >
              <Plus size={12} />
              <span>New Session</span>
            </button>
          </div>

          {/* New session form */}
          {showCreate && (
            <form onSubmit={handleCreate} className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Session Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Quantum Computing & Error Mitigation"
                  className="w-full bg-[#101216] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Initial Research Query</label>
                <input
                  type="text"
                  value={newQuery}
                  onChange={e => setNewQuery(e.target.value)}
                  placeholder="e.g. quantum error correction surface codes"
                  className="w-full bg-[#101216] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 text-black font-semibold text-xs font-mono"
                >
                  Create Session
                </button>
              </div>
            </form>
          )}

          {/* Session Cards */}
          <div className="space-y-3">
            {sessions.map(s => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    onClose();
                  }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-[#12151C] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">{s.title}</h4>
                      {isActive && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                          <Check size={10} />
                          <span>ACTIVE</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 font-mono truncate max-w-md">
                      "{s.query}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Globe size={11} className="text-cyan-400" />
                        {s.sourceCount} sources
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="flex items-center gap-1">
                        <Layers size={11} className="text-emerald-400" />
                        {s.chunkCount} chunks
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="flex items-center gap-1">
                        <Tag size={11} className="text-purple-400" />
                        {s.entityCount} entities
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-[10px] font-mono text-slate-500 shrink-0">
                    <Clock size={11} className="inline mr-1" />
                    {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
