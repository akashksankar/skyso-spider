import React from 'react';
import { ChevronLeft, ChevronRight, Home, Database, Layers, Play, Pause } from 'lucide-react';

interface MobileBottomBarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onGoHome: () => void;
  onOpenVault: () => void;
  onToggleRoam: () => void;
  isRoaming: boolean;
  tabCount: number;
  onOpenTabs: () => void;
  collectedCount: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onGoHome,
  onOpenVault,
  onToggleRoam,
  isRoaming,
  tabCount,
  onOpenTabs,
  collectedCount,
}) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around select-none z-30 shrink-0 shadow-lg">
      {/* 1. Back */}
      <button
        onClick={onGoBack}
        disabled={!canGoBack}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 disabled:text-slate-300 hover:text-slate-900 active:scale-95 transition-all"
        title="Back"
      >
        <ChevronLeft size={22} />
      </button>

      {/* 2. Forward */}
      <button
        onClick={onGoForward}
        disabled={!canGoForward}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 disabled:text-slate-300 hover:text-slate-900 active:scale-95 transition-all"
        title="Forward"
      >
        <ChevronRight size={22} />
      </button>

      {/* 3. Google Home */}
      <button
        onClick={onGoHome}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-orange-600 active:scale-95 transition-all"
        title="Google Home"
      >
        <Home size={20} />
      </button>

      {/* 4. Spider Crawl Controller & Data Vault Trigger */}
      <button
        onClick={onOpenVault}
        className="relative min-h-[44px] min-w-[50px] px-2 flex items-center justify-center bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-full text-orange-700 active:scale-95 transition-all shadow-sm"
        title="Spider Data Vault"
      >
        <span className="text-base mr-1">🕷️</span>
        <span className="font-mono text-xs font-bold text-orange-600">
          {collectedCount}
        </span>
        {isRoaming && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping ring-2 ring-white" />
        )}
      </button>

      {/* 5. Autonomous Roam Play/Pause */}
      <button
        onClick={onToggleRoam}
        className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all active:scale-95 ${
          isRoaming
            ? 'text-orange-600 hover:bg-orange-50'
            : 'text-slate-400 hover:bg-slate-100'
        }`}
        title={isRoaming ? 'Pause Spider Roaming' : 'Start Spider Roaming'}
      >
        {isRoaming ? <Pause size={18} /> : <Play size={18} />}
      </button>

      {/* 6. Tabs Switcher */}
      <button
        onClick={onOpenTabs}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-slate-900 active:scale-95 transition-all"
        title="Tabs"
      >
        <div className="w-5 h-5 rounded border-2 border-slate-700 flex items-center justify-center text-[10px] font-bold font-mono">
          {tabCount}
        </div>
      </button>
    </div>
  );
};
