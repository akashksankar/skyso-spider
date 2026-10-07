import React, { useEffect, useState, useRef } from 'react';
import { SpiderStatus } from '../../types/spider';

interface ScreenCrawlingSpiderProps {
  status: SpiderStatus;
  targetPos: { x: number; y: number } | null;
  currentPos: { x: number; y: number };
  angle: number;
  isCollecting: boolean;
  collectedCount: number;
  lastCollectedLabel?: string;
  onSpiderClick?: () => void;
  containerBounds: { width: number; height: number };
}

export const ScreenCrawlingSpider: React.FC<ScreenCrawlingSpiderProps> = ({
  status,
  targetPos,
  currentPos,
  angle,
  isCollecting,
  collectedCount,
  lastCollectedLabel,
  onSpiderClick,
}) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      setTick(t => (t + 1) % 100000);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const isMoving = status === 'WALKING';

  // Leg joint calculations with orange accents & black biomechanical chassis
  const renderLeg = (idx: number, isLeft: boolean) => {
    const legOrdinal = isLeft ? idx : idx - 4;
    const baseAngle = isLeft ? 140 + legOrdinal * 22 : 40 - legOrdinal * 22;
    const rad = (baseAngle * Math.PI) / 180;

    let gait = 0;
    let tapY = 0;

    if (isMoving) {
      const phase = tick * 0.25 + (idx % 2 === 0 ? 0 : Math.PI);
      gait = Math.sin(phase + legOrdinal * 0.8) * 12;
    } else if (isCollecting) {
      if (legOrdinal <= 1) {
        tapY = Math.sin(tick * 0.4 + idx) * 8;
      }
    } else {
      gait = Math.sin(tick * 0.05 + idx) * 2;
    }

    const coxaLen = 10;
    const femurLen = 18;
    const tibiaLen = 22;

    const j1x = Math.cos(rad) * coxaLen;
    const j1y = Math.sin(rad) * coxaLen * 0.6;

    const kneeRad = rad + (isLeft ? -0.2 : 0.2) + gait * 0.02;
    const kneeX = j1x + Math.cos(kneeRad) * femurLen;
    const kneeY = j1y - femurLen * 0.7 - Math.abs(gait) * 0.3;

    const tipSpread = isLeft ? -tibiaLen * 0.9 : tibiaLen * 0.9;
    const tipX = kneeX + tipSpread + (isLeft ? -2 : 2);
    const tipY = 16 + legOrdinal * 4 + gait * 0.4 + tapY;

    const legPath = `M 0 0 Q ${j1x} ${j1y} ${kneeX} ${kneeY} T ${tipX} ${tipY}`;

    return (
      <g key={idx}>
        {/* Outer Shadow */}
        <path
          d={legPath}
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth={3}
          strokeLinecap="round"
          transform="translate(0, 2)"
        />
        {/* Black articulated leg */}
        <path
          d={legPath}
          fill="none"
          stroke="#111827"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Orange Joint Bearing */}
        <circle cx={kneeX} cy={kneeY} r={1.6} fill="#FF5500" />
        <circle cx={tipX} cy={tipY} r={1.3} fill={isCollecting && legOrdinal <= 1 ? '#FF5500' : '#111827'} />
      </g>
    );
  };

  return (
    <div
      className="absolute z-40 pointer-events-auto transition-transform duration-75 select-none"
      style={{
        left: `${currentPos.x}px`,
        top: `${currentPos.y}px`,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      }}
      onClick={onSpiderClick}
    >
      {/* Spider SVG Body */}
      <div className="relative cursor-pointer group">
        <svg
          viewBox="-60 -60 120 120"
          width="90"
          height="90"
          className="overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
        >
          {/* Silk spinneret trailing thread */}
          <line
            x1="0"
            y1="20"
            x2="0"
            y2="70"
            stroke="#FF5500"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity={isMoving ? 0.8 : 0.3}
          />

          {/* Left Legs */}
          <g id="legs-left">
            {[0, 1, 2, 3].map(i => (
              <g key={i} transform="translate(-6, -2)">
                {renderLeg(i, true)}
              </g>
            ))}
          </g>

          {/* Right Legs */}
          <g id="legs-right">
            {[4, 5, 6, 7].map(i => (
              <g key={i} transform="translate(6, -2)">
                {renderLeg(i, false)}
              </g>
            ))}
          </g>

          {/* Abdomen (Rear Chassis) */}
          <ellipse
            cx="0"
            cy="12"
            rx="12"
            ry="16"
            fill="#111827"
            stroke="#000000"
            strokeWidth="1.5"
          />

          {/* Exoskeleton Chevron Markings */}
          <path
            d="M -7 6 Q 0 10 7 6"
            fill="none"
            stroke="#FF5500"
            strokeWidth="1.2"
            opacity="0.8"
          />
          <path
            d="M -5 13 Q 0 17 5 13"
            fill="none"
            stroke="#FF5500"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Glowing Orange Data Core Reactor */}
          <circle
            cx="0"
            cy="12"
            r={isCollecting ? 5.5 : 4}
            fill="#FF5500"
            className={isCollecting ? 'animate-orange-pulse' : ''}
          />
          <circle cx="0" cy="12" r="1.8" fill="#FFFFFF" />

          {/* Cephalothorax (Front Body) */}
          <ellipse
            cx="0"
            cy="-6"
            rx="10"
            ry="9"
            fill="#18181B"
            stroke="#000000"
            strokeWidth="1.5"
          />

          {/* Head & Sensory Eyes */}
          <ellipse cx="0" cy="-14" rx="7" ry="5" fill="#09090B" />

          {/* 4 Glowing Front Eyes */}
          <circle cx="-2.5" cy="-15" r="1.4" fill="#FF5500" />
          <circle cx="2.5" cy="-15" r="1.4" fill="#FF5500" />
          <circle cx="-5" cy="-13.5" r="1" fill="#FF7700" />
          <circle cx="5" cy="-13.5" r="1" fill="#FF7700" />

          {/* Chelicerae (Micro-fangs) */}
          <path d="M -3 -17 L -1.5 -21 L 0 -17" fill="none" stroke="#FF5500" strokeWidth="1" />
          <path d="M 3 -17 L 1.5 -21 L 0 -17" fill="none" stroke="#FF5500" strokeWidth="1" />
        </svg>

        {/* Tactile Data Extraction Ripple */}
        {isCollecting && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-16 h-16 rounded-full border-2 border-orange-500 animate-ping opacity-75" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-orange-500/20 animate-pulse" />
          </div>
        )}

        {/* Floating Mini Telemetry Tag (Counter-rotated so it stays readable) */}
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-[10px] font-mono px-2 py-0.5 rounded-full shadow-md border border-orange-500/50 flex items-center gap-1.5"
          style={{ transform: `rotate(${-angle}deg)` }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
          <span className="font-bold text-orange-400">{collectedCount}</span>
          <span className="text-[9px] text-slate-300">CHUNKS</span>
        </div>

        {/* Collection Notification Pill */}
        {lastCollectedLabel && isCollecting && (
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-orange-500 text-white font-mono text-[9px] px-2.5 py-1 rounded-md shadow-lg font-bold flex items-center gap-1 animate-bounce"
            style={{ transform: `rotate(${-angle}deg)` }}
          >
            <span>+1</span>
            <span className="max-w-[120px] truncate">{lastCollectedLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
