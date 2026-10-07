import React from 'react';
import { CrawlSettings } from '../../types/spider';
import { Sliders, ShieldCheck } from 'lucide-react';

interface CrawlSettingsModalProps {
  settings: CrawlSettings;
  onUpdateSettings: (newSettings: CrawlSettings) => void;
  onClose: () => void;
}

export const CrawlSettingsModal: React.FC<CrawlSettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [local, setLocal] = React.useState<CrawlSettings>(settings);

  const handleSave = () => {
    onUpdateSettings(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-lg bg-[#101216] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#13161D]">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Crawler Governance & Parameters</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-mono">
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Depth and Max Pages */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400 uppercase text-[10px]">Max Crawl Depth</label>
              <input
                type="number"
                min={1}
                max={5}
                value={local.maxDepth}
                onChange={e => setLocal({ ...local, maxDepth: parseInt(e.target.value) || 1 })}
                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 uppercase text-[10px]">Max Ingest Pages</label>
              <input
                type="number"
                min={1}
                max={100}
                value={local.maxPages}
                onChange={e => setLocal({ ...local, maxPages: parseInt(e.target.value) || 1 })}
                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
              />
            </div>
          </div>

          {/* Delay */}
          <div className="space-y-1.5">
            <label className="text-slate-400 uppercase text-[10px]">Request Delay (ms)</label>
            <input
              type="number"
              step={100}
              min={100}
              max={5000}
              value={local.delayMs}
              onChange={e => setLocal({ ...local, delayMs: parseInt(e.target.value) || 500 })}
              className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="flex items-center justify-between p-2 rounded bg-white/[0.02] cursor-pointer">
              <span className="text-slate-300">Respect robots.txt Protocols</span>
              <input
                type="checkbox"
                checked={local.respectRobotsTxt}
                onChange={e => setLocal({ ...local, respectRobotsTxt: e.target.checked })}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-white/[0.02] cursor-pointer">
              <span className="text-slate-300">Extract Outbound Hyperlinks</span>
              <input
                type="checkbox"
                checked={local.extractLinks}
                onChange={e => setLocal({ ...local, extractLinks: e.target.checked })}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-white/[0.02] cursor-pointer">
              <span className="text-slate-300">Generate Semantic Vector Embeddings</span>
              <input
                type="checkbox"
                checked={local.generateEmbeddings}
                onChange={e => setLocal({ ...local, generateEmbeddings: e.target.checked })}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-white/[0.02] cursor-pointer">
              <span className="text-slate-300">Build Knowledge Graph Relationships</span>
              <input
                type="checkbox"
                checked={local.buildGraph}
                onChange={e => setLocal({ ...local, buildGraph: e.target.checked })}
                className="accent-cyan-400"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end gap-2 bg-[#13161D]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white font-mono"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded bg-cyan-500 text-black font-semibold text-xs font-mono hover:bg-cyan-400 transition-colors"
          >
            Save Parameters
          </button>
        </div>
      </div>
    </div>
  );
};
