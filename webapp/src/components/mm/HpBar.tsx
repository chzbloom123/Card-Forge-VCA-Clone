import React from 'react';

interface HpBarProps {
  current: number;
  max: number;
  classColor: string;
}

export function HpBar({ current, max, classColor }: HpBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;
  const barColor = pct > 50 ? '#4CAF50' : pct > 25 ? '#FFA726' : '#EF5350';

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-center" style={{ fontSize: '9px', color: '#aaa', fontFamily: 'Share Tech Mono, monospace' }}>
        <span>HP</span>
        <span style={{ color: barColor }}>{current}/{max}</span>
      </div>
      <div style={{ height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', width: '100%' }}>
        <div
          className="hp-bar-fill"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}aa, ${barColor})` }}
        />
      </div>
    </div>
  );
}
