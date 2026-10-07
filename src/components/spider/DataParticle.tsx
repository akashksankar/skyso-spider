import React from 'react';

export interface FlyParticle {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  label?: string;
  color?: string;
  tokens?: number;
  relevance?: number;
}

interface ParticleFieldProps {
  particles: FlyParticle[];
}

export const DataParticleField: React.FC<ParticleFieldProps> = ({ particles }) => {
  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map(p => {
        const dx = p.targetX - p.startX;
        const dy = p.targetY - p.startY;

        return (
          <div
            key={p.id}
            className="absolute top-0 left-0"
            style={{
              transform: `translate(${p.startX}px, ${p.startY}px)`,
              animation: 'particleFlight 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              ['--tx' as any]: `${dx}px`,
              ['--ty' as any]: `${dy}px`,
            }}
          >
            {/* Glowing particle body */}
            <div className="relative flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#06B6D4] ring-2 ring-white/80 animate-ping" />
              <div className="absolute -top-0.5 -left-0.5 w-4.5 h-4.5 rounded-full bg-cyan-300 opacity-90 blur-[1px]" />

              {/* Data particle badge */}
              {p.tokens && (
                <div className="ml-2 whitespace-nowrap rounded bg-slate-950/90 border border-cyan-500/50 px-1.5 py-0.5 font-mono text-[9px] text-cyan-200 shadow-lg">
                  CHUNK +1 · {p.tokens} TOKENS
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
