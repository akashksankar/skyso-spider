import React from 'react';
import { X, Search, FileText, Plus } from 'lucide-react';

export interface TabItem {
  id: string;
  title: string;
  type: 'search' | 'page';
  url?: string;
  query?: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
}) => {
  return (
    <div className="flex items-center bg-[#0B0D11] px-2 pt-2 border-b border-white/5 select-none overflow-x-auto">
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center gap-2 px-3 py-1.5 max-w-[200px] rounded-t-md text-xs cursor-pointer transition-all border-t border-x ${
                isActive
                  ? 'bg-[#101216] border-white/10 text-white font-medium shadow-sm'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className="shrink-0 text-slate-400">
                {tab.type === 'search' ? <Search size={12} /> : <FileText size={12} className="text-cyan-400" />}
              </div>
              
              <span className="truncate text-xs font-mono">
                {tab.title || (tab.type === 'search' ? 'Search' : 'Document')}
              </span>

              {tabs.length > 1 && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-opacity"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={onNewTab}
          title="New Search Tab"
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
};
