import React from 'react';
import { TabItem } from './TabBar';
import { X, Plus, Globe, Search, Trash2 } from 'lucide-react';

interface MobileTabsModalProps {
  isOpen: boolean;
  tabs: TabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onCloseModal: () => void;
}

export const MobileTabsModal: React.FC<MobileTabsModalProps> = ({
  isOpen,
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onCloseModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col justify-between p-4 select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between text-white pb-3 border-b border-white/10 shrink-0">
        <span className="font-bold text-sm">
          Tabs ({tabs.length})
        </span>
        <button
          onClick={onCloseModal}
          className="text-xs font-medium px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full"
        >
          Done
        </button>
      </div>

      {/* Tabs Grid */}
      <div className="flex-1 overflow-y-auto py-4 grid grid-cols-2 gap-3">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => {
                onSelectTab(tab.id);
                onCloseModal();
              }}
              className={`relative h-44 rounded-2xl overflow-hidden cursor-pointer transition-all border flex flex-col justify-between p-3 ${
                isActive
                  ? 'bg-white border-orange-500 shadow-xl ring-2 ring-orange-500'
                  : 'bg-slate-800 border-white/10 hover:border-white/30 text-white'
              }`}
            >
              {/* Tab Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate max-w-[100px]">
                  {tab.type === 'search' ? (
                    <Search size={12} className={isActive ? 'text-orange-500' : 'text-slate-400'} />
                  ) : (
                    <Globe size={12} className={isActive ? 'text-orange-500' : 'text-cyan-400'} />
                  )}
                  <span className={`text-[11px] font-medium truncate ${isActive ? 'text-slate-900' : 'text-white'}`}>
                    {tab.title}
                  </span>
                </div>

                {tabs.length > 1 && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className={`p-1 rounded-full ${
                      isActive ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Tab Preview Mockup */}
              <div className={`flex-1 my-2 rounded-lg flex items-center justify-center p-2 text-[10px] text-center ${
                isActive ? 'bg-slate-50 text-slate-500' : 'bg-slate-900/50 text-slate-400'
              }`}>
                {tab.type === 'search' ? 'Google Search' : tab.url || 'Web Document'}
              </div>

              {/* Status */}
              <div className="text-[10px] font-mono opacity-60 truncate">
                {isActive ? 'Active Tab' : 'Background'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Bar: New Tab button */}
      <div className="pt-3 border-t border-white/10 flex justify-center shrink-0">
        <button
          onClick={() => {
            onNewTab();
            onCloseModal();
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500 text-white font-bold text-xs shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
        >
          <Plus size={16} />
          <span>New Google Tab</span>
        </button>
      </div>
    </div>
  );
};
