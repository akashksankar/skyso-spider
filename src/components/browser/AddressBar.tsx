import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search, ShieldCheck, Globe } from 'lucide-react';

interface AddressBarProps {
  url: string;
  query: string;
  isLoading: boolean;
  onNavigate: (target: string) => void;
  onSearch: (query: string) => void;
  onReload: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
}

export const AddressBar: React.FC<AddressBarProps> = ({
  url,
  query,
  isLoading,
  onNavigate,
  onSearch,
  onReload,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
}) => {
  const [inputValue, setInputValue] = useState(url || query || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    if (val.startsWith('http://') || val.startsWith('https://')) {
      onNavigate(val);
    } else {
      onSearch(val);
    }
  };

  // Keep input in sync with external navigation
  React.useEffect(() => {
    setInputValue(url || query || '');
  }, [url, query]);

  const isUrl = inputValue.startsWith('http://') || inputValue.startsWith('https://');

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#101216] border-b border-white/10 select-none">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onGoBack}
          disabled={!canGoBack}
          title="Back"
          className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
        </button>
        <button
          onClick={onGoForward}
          disabled={!canGoForward}
          title="Forward"
          className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight size={14} />
        </button>
        <button
          onClick={onReload}
          title="Reload"
          className={`p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors ${
            isLoading ? 'animate-spin text-cyan-400' : ''
          }`}
        >
          <RotateCw size={14} />
        </button>
      </div>

      {/* Omnibar Input */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center">
        <div className="relative w-full flex items-center bg-[#08090B] border border-white/10 focus-within:border-cyan-500/60 rounded-md transition-colors px-2.5 py-1">
          <div className="mr-2 text-slate-500">
            {isUrl ? <Globe size={13} className="text-cyan-400" /> : <Search size={13} />}
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Search web or enter URL (e.g. artificial intelligence in education or https://...)"
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none font-mono"
          />

          {isLoading && (
            <div className="flex items-center gap-1.5 ml-2 font-mono text-[10px] text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>SCANNING</span>
            </div>
          )}

          {!isLoading && isUrl && (
            <div className="flex items-center gap-1 ml-2 text-[10px] font-mono text-emerald-400" title="Secure R&D Sandbox">
              <ShieldCheck size={12} />
              <span className="hidden sm:inline">SANDBOX</span>
            </div>
          )}
        </div>
      </form>

      {/* Active Search Provider tag */}
      <div className="hidden lg:flex items-center text-[10px] font-mono text-slate-500 px-2 py-1 bg-white/5 rounded">
        <span>PROVIDER: <strong className="text-slate-300 font-normal">SKYSO INDEX</strong></span>
      </div>
    </div>
  );
};
