import React from 'react';
import { SpiderStatus } from '../../types/spider';

interface SpiderLegProps {
  index: number; // 0 to 7. 0-3: Left (front to back), 4-7: Right (front to back)
  status: SpiderStatus;
  tick: number;
  isReaching?: boolean;
  reachTarget?: { x: number; y: number } | null;
  originX: number;
  originY: number;
}

export const SpiderLeg: React.FC<SpiderLegProps> = ({
  index,
  status,
  tick,
  isReaching,
  reachTarget,
  originX,
  originY,
}) => {
  const isLeft = index < 4;
  const legOrdinal = isLeft ? index : index - 4; // 0 (front) to 3 (rear)

  // Base attachment angles on thorax
  const baseAngleDeg = isLeft
    ? 150 + legOrdinal * 24 // Left side fan
    : 30 - legOrdinal * 24;  // Right side fan

  // Segment lengths
  const lenCoxa = 18;
  const lenFemur = 32;
  const lenTibia = 40;
  const lenTarsus = 22;

  // Animation modulation depending on status
  let gaitOffset = 0;
  let lift = 0;

  if (status === 'WALKING') {
    // Alternating tetrapod wave gait
    const phase = tick * 0.15 + (index % 2 === 0 ? 0 : Math.PI);
    gaitOffset = Math.sin(phase + legOrdinal * 0.8) * 16;
    lift = Math.max(0, Math.cos(phase + legOrdinal * 0.8)) * 12;
  } else if (status === 'SCANNING') {
    // Rapid searching jitter on front legs
    if (legOrdinal <= 1) {
      gaitOffset = Math.sin(tick * 0.4 + index) * 12;
      lift = Math.abs(Math.cos(tick * 0.35 + index)) * 14;
    } else {
      gaitOffset = Math.sin(tick * 0.1 + index) * 4;
    }
  } else if (status === 'SEARCHING') {
    // Alert, elevated posture
    lift = legOrdinal === 0 ? 10 : 2;
    gaitOffset = Math.sin(tick * 0.08 + index) * 6;
  } else if (status === 'IDLE' || status === 'COMPLETE') {
    // Gentle biomechanical breathing
    gaitOffset = Math.sin(tick * 0.04 + index * 0.5) * 3;
    lift = Math.sin(tick * 0.04 + index * 0.5) * 2;
  } else if (status === 'ERROR') {
    // Defensive contracted posture
    gaitOffset = isLeft ? -8 : 8;
    lift = -4;
  }

  // Handle special target reaching (e.g. front leg touches page during extraction)
  let tipX = 0;
  let tipY = 0;
  let kneeX = 0;
  let kneeY = 0;
  let joint1X = 0;
  let joint1Y = 0;

  if (isReaching && reachTarget && (index === 0 || index === 4)) {
    // Extend directly towards extraction point
    const dx = reachTarget.x - originX;
    const dy = reachTarget.y - originY;
    joint1X = originX + (isLeft ? -15 : 15);
    joint1Y = originY - 10;
    kneeX = originX + dx * 0.45;
    kneeY = originY + dy * 0.25 - 20;
    tipX = reachTarget.x;
    tipY = reachTarget.y;
  } else {
    // Standard procedural joint calculation
    const rad = (baseAngleDeg * Math.PI) / 180;
    const sideSign = isLeft ? -1 : 1;

    // Joint 1 (Coxa-Femur joint)
    joint1X = originX + Math.cos(rad) * lenCoxa;
    joint1Y = originY + Math.sin(rad) * lenCoxa * 0.6;

    // Joint 2 (Femur-Tibia Knee): elevated above the body
    const kneeAngleRad = rad + (sideSign * 0.2) + (gaitOffset * 0.015);
    const kneeHeight = -lenFemur * 0.85 - lift;
    kneeX = joint1X + Math.cos(kneeAngleRad) * lenFemur;
    kneeY = joint1Y + kneeHeight;

    // Joint 3 / Tip (Tibia-Tarsus foot on ground)
    const legSpread = isLeft ? -lenTibia * 1.1 : lenTibia * 1.1;
    const forwardOffset = (legOrdinal - 1.5) * 14 + gaitOffset;
    tipX = kneeX + legSpread * 0.8;
    tipY = originY + 28 + (legOrdinal * 6) + (forwardOffset * 0.4);
  }

  // Draw two segmented paths (upper limb & lower limb) with glowing joint nodes
  const pathData = `M ${originX} ${originY} Q ${joint1X} ${joint1Y} ${kneeX} ${kneeY} T ${tipX} ${tipY}`;

  const legColor = status === 'ERROR'
    ? '#F43F5E'
    : status === 'EXTRACTING' || status === 'COLLECTING'
    ? '#06B6D4'
    : status === 'SCANNING'
    ? '#A855F7'
    : '#94A3B8';

  return (
    <g className="spider-leg-group transition-all duration-75">
      {/* Outer shadow / laser aura */}
      <path
        d={pathData}
        fill="none"
        stroke={legColor}
        strokeWidth={status === 'EXTRACTING' ? 3.5 : 2}
        strokeOpacity={status === 'EXTRACTING' ? 0.8 : 0.45}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Inner precise cybernetic limb bone */}
      <path
        d={pathData}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1}
        strokeOpacity={0.85}
        strokeLinecap="round"
      />

      {/* Articulated joint bearings */}
      <circle
        cx={kneeX}
        cy={kneeY}
        r={2.2}
        fill="#08090B"
        stroke={legColor}
        strokeWidth={1.5}
      />
      <circle
        cx={tipX}
        cy={tipY}
        r={1.8}
        fill={isReaching ? '#06B6D4' : '#E2E8F0'}
      />

      {/* Tactile contact spark if reaching and touching */}
      {isReaching && reachTarget && (index === 0 || index === 4) && (
        <g>
          <circle
            cx={tipX}
            cy={tipY}
            r={6}
            fill="none"
            stroke="#06B6D4"
            strokeWidth={1.5}
            className="animate-ping"
          />
          <circle
            cx={tipX}
            cy={tipY}
            r={3}
            fill="#06B6D4"
            opacity={0.9}
          />
        </g>
      )}
    </g>
  );
};
