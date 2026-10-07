import React, { useState, useEffect } from 'react';
import { Lock, RotateCw, Search, X, Globe, ArrowLeft } from 'lucide-react';

interface MobileAddressBarProps {
  url: string;
  query: string;
  isLoading: boolean;
  onNavigate: (target: string) => void;
  onSearch: (query: string) => void;
  onReload: () => void;
  onGoBack?: () => void;
  showBack?: boolean;
}

export const MobileAddressBar: React.FC<MobileAddressBarProps> = ({
  url,
  query,
  isLoading,
  onNavigate,
  onSearch,
  onReload,
  onGoBack,
  showBack,
}) => {
  const [inputValue, setInputValue] = useState(url || query || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInputValue(url || query || '');
  }, [url, query]);

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

  const isUrl = inputValue.startsWith('http://') || inputValue.startsWith('https://');

  return (
    <div className="w-full bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-2 select-none z-30 shrink-0">
      {/* Optional Back button */}
      {showBack && (
        <button
          onClick={onGoBack}
          className="p-1 rounded-full hover:bg-slate-100 text-slate-700"
          title="Back"
        >
          <ArrowLeft size={18} />
        </button>
      )}

      {/* Omnibar Input Box */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center">
        <div
          className={`w-full flex items-center bg-slate-100 rounded-full px-3 py-1.5 border transition-all ${
            isFocused
              ? 'bg-white border-orange-500 ring-2 ring-orange-100 shadow-sm'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          {/* Security lock or search icon */}
          <div className="mr-2 text-slate-500 shrink-0">
            {isUrl ? (
              <Lock size={12} className="text-emerald-600" />
            ) : (
              <Search size={13} className="text-slate-400" />
            )}
          </div>

          {/* Input */}
          <input
            type="text"
            value={inputValue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Search or enter website address"
            className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none font-sans"
          />

          {/* Clear button if text */}
          {inputValue && isFocused && (
            <button
              type="button"
              onMouseDown={e => {
                e.preventDefault();
                setInputValue('');
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 ml-1"
            >
              <X size={12} />
            </button>
          )}

          {/* Reload or Loading Spinner */}
          <button
            type="button"
            onClick={onReload}
            className={`ml-1.5 text-slate-400 hover:text-slate-700 shrink-0 ${
              isLoading ? 'animate-spin text-orange-500' : ''
            }`}
          >
            <RotateCw size={12} />
          </button>
        </div>
      </form>
    </div>
  );
};
