import React, { useEffect, useState } from 'react';
import { SpiderStatus } from '../../types/spider';
import { SpiderLeg } from './SpiderLeg';

interface SpiderProps {
  status: SpiderStatus;
  activeChunkCount?: number;
  lastTokenCount?: number;
  lastRelevance?: number;
  reachTarget?: { x: number; y: number } | null;
  size?: number;
  className?: string;
  showLabels?: boolean;
}

export const Spider: React.FC<SpiderProps> = ({
  status,
  activeChunkCount = 0,
  lastTokenCount,
  lastRelevance,
  reachTarget = null,
  size = 280,
  className = '',
  showLabels = true,
}) => {
  const [tick, setTick] = useState(0);

  // High-performance procedural animation loop
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setTick(t => (t + 1) % 100000);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Center coordinate of the spider in SVG coordinate system (300 x 300)
  const cx = 150;
  const cy = 150;

  // Subtle breathing / floating offset
  const breathY = Math.sin(tick * 0.05) * 3;
  const bodyY = cy + (status === 'WALKING' ? Math.cos(tick * 0.25) * 2.5 : breathY);

  // Color scheme based on status
  const coreColor =
    status === 'ERROR'
      ? '#F43F5E'
      : status === 'EXTRACTING' || status === 'COLLECTING'
      ? '#06B6D4'
      : status === 'PROCESSING' || status === 'SCANNING'
      ? '#A855F7'
      : '#38BDF8';

  const isReaching = status === 'EXTRACTING' && !!reachTarget;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 300 300"
        width={size}
        height={size}
        className="overflow-visible filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Reactor glow gradient */}
          <radialGradient id="spiderCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor={coreColor} stopOpacity="0.9" />
            <stop offset="70%" stopColor={coreColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
          </radialGradient>

          {/* Abdomen metallic gradient */}
          <linearGradient id="abdomenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E232F" />
            <stop offset="60%" stopColor="#11141A" />
            <stop offset="100%" stopColor="#090B0E" />
          </linearGradient>

          {/* Cephalothorax gradient */}
          <linearGradient id="thoraxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#252B3B" />
            <stop offset="100%" stopColor="#0E1217" />
          </linearGradient>

          {/* Laser blur */}
          <filter id="coreBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ===================================== */}
        {/* REAR SILK SPINNERET & ANCHOR THREADS  */}
        {/* ===================================== */}
        <g opacity={status === 'WALKING' || status === 'EXTRACTING' ? 0.7 : 0.3}>
          <line
            x1={cx}
            y1={bodyY + 45}
            x2={cx}
            y2={300}
            stroke="#06B6D4"
            strokeWidth={1}
            strokeDasharray="3 3"
            className="animate-silk-glow"
          />
        </g>

        {/* ===================================== */}
        {/* 8 PROCEDURAL LEGS                     */}
        {/* ===================================== */}
        <g id="spider-legs">
          {/* Left legs (0, 1, 2, 3) */}
          {[0, 1, 2, 3].map(idx => (
            <SpiderLeg
              key={`leg-left-${idx}`}
              index={idx}
              status={status}
              tick={tick}
              isReaching={isReaching}
              reachTarget={reachTarget}
              originX={cx - 14}
              originY={bodyY - 6 + (idx - 1.5) * 8}
            />
          ))}

          {/* Right legs (4, 5, 6, 7) */}
          {[4, 5, 6, 7].map(idx => (
            <SpiderLeg
              key={`leg-right-${idx}`}
              index={idx}
              status={status}
              tick={tick}
              isReaching={isReaching}
              reachTarget={reachTarget}
              originX={cx + 14}
              originY={bodyY - 6 + (idx - 5.5) * 8}
            />
          ))}
        </g>

        {/* ===================================== */}
        {/* ABDOMEN (REAR CHITIN SHELL)           */}
        {/* ===================================== */}
        <g transform={`translate(${cx}, ${bodyY + 22})`}>
          {/* Abdomen shell base */}
          <ellipse
            cx={0}
            cy={0}
            rx={24}
            ry={30}
            fill="url(#abdomenGrad)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth={1}
          />

          {/* Cybernetic exoskeleton plates */}
          <path
            d="M -16 -12 Q 0 -8 16 -12 Q 10 12 0 24 Q -10 12 -16 -12 Z"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1}
          />
          <path
            d="M -12 2 Q 0 6 12 2"
            fill="none"
            stroke={coreColor}
            strokeWidth={1}
            strokeOpacity={0.4}
          />
          <path
            d="M -8 12 Q 0 16 8 12"
            fill="none"
            stroke={coreColor}
            strokeWidth={1}
            strokeOpacity={0.3}
          />

          {/* Abdomen Telemetry Indicator */}
          <circle
            cx={0}
            cy={18}
            r={2}
            fill={coreColor}
            className="animate-pulse"
          />
        </g>

        {/* ===================================== */}
        {/* CEPHALOTHORAX (CENTRAL BODY)          */}
        {/* ===================================== */}
        <g transform={`translate(${cx}, ${bodyY - 10})`}>
          {/* Thorax base */}
          <ellipse
            cx={0}
            cy={0}
            rx={20}
            ry={18}
            fill="url(#thoraxGrad)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={1.2}
          />

          {/* Peripheral circuit traces */}
          <path
            d="M -14 -6 L -6 -6 L -3 0 L 3 0 L 6 -6 L 14 -6"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={0.8}
          />

          {/* DATA CORE REACTOR (Luminescing center) */}
          <circle
            cx={0}
            cy={0}
            r={11}
            fill="url(#spiderCoreGlow)"
            filter="url(#coreBlur)"
            className={status === 'PROCESSING' || status === 'EXTRACTING' ? 'animate-core-pulse' : ''}
          />
          <circle
            cx={0}
            cy={0}
            r={5.5}
            fill="#FFFFFF"
            opacity={0.9}
          />
          <circle
            cx={0}
            cy={0}
            r={8}
            fill="none"
            stroke={coreColor}
            strokeWidth={1}
            strokeDasharray={status === 'PROCESSING' ? '2 2' : 'none'}
            className={status === 'PROCESSING' ? 'animate-spin' : ''}
          />
        </g>

        {/* ===================================== */}
        {/* HEAD & SENSORY OCULAR CLUSTER (EYES)  */}
        {/* ===================================== */}
        <g transform={`translate(${cx}, ${bodyY - 28})`}>
          {/* Head segment */}
          <ellipse
            cx={0}
            cy={0}
            rx={14}
            ry={10}
            fill="#11141B"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth={1}
          />

          {/* Chelicerae / Fangs (Micro-manipulators) */}
          <path
            d="M -6 7 Q -4 14 -2 15 Q -1 12 -3 7 Z"
            fill="#06B6D4"
            opacity={0.85}
          />
          <path
            d="M 6 7 Q 4 14 2 15 Q 1 12 3 7 Z"
            fill="#06B6D4"
            opacity={0.85}
          />

          {/* 8 Clustered Sensory Eyes */}
          {/* Anterior Median Eyes (Large main lenses) */}
          <circle cx={-3.5} cy={-2} r={2.2} fill={coreColor} />
          <circle cx={-3.5} cy={-2} r={0.8} fill="#FFFFFF" />
          <circle cx={3.5} cy={-2} r={2.2} fill={coreColor} />
          <circle cx={3.5} cy={-2} r={0.8} fill="#FFFFFF" />

          {/* Anterior Lateral Eyes */}
          <circle cx={-8} cy={-1} r={1.5} fill={coreColor} opacity={0.85} />
          <circle cx={8} cy={-1} r={1.5} fill={coreColor} opacity={0.85} />

          {/* Posterior Eyes */}
          <circle cx={-5} cy={-6} r={1.2} fill={coreColor} opacity={0.7} />
          <circle cx={5} cy={-6} r={1.2} fill={coreColor} opacity={0.7} />
          <circle cx={-9} cy={-5} r={1.1} fill={coreColor} opacity={0.6} />
          <circle cx={9} cy={-5} r={1.1} fill={coreColor} opacity={0.6} />
        </g>
      </svg>

      {/* Observability telemetry label beneath spider */}
      {showLabels && (
        <div className="mt-1 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'ERROR'
                  ? 'bg-rose-500 ring-2 ring-rose-500/20'
                  : status === 'EXTRACTING' || status === 'COLLECTING'
                  ? 'bg-cyan-400 ring-2 ring-cyan-400/20 animate-pulse'
                  : status === 'SCANNING' || status === 'PROCESSING'
                  ? 'bg-purple-400 ring-2 ring-purple-400/20 animate-pulse'
                  : status === 'WALKING'
                  ? 'bg-emerald-400 ring-2 ring-emerald-400/20'
                  : 'bg-slate-400'
              }`}
            />
            <span className="font-semibold text-white">{status}</span>
          </div>

          {/* Real computational metrics */}
          <div className="flex items-center gap-2 mt-1 text-[10px] font-mono tabular-nums text-slate-400">
            <span>CHUNKS: <strong className="text-cyan-300 font-semibold">{activeChunkCount}</strong></span>
            {lastTokenCount !== undefined && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{lastTokenCount} TOKENS</span>
              </>
            )}
            {lastRelevance !== undefined && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>REL: {lastRelevance.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
