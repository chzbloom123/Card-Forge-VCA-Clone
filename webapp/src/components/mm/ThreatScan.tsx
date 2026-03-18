import React from 'react';
import { CardData, CLASS_COLORS, CLASS_ICONS, getModifier } from '@/types/card';
import { HpBar } from './HpBar';

interface ThreatScanProps {
  data: CardData;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export function ThreatScan({ data, cardRef }: ThreatScanProps) {
  const color = CLASS_COLORS[data.cardClass];
  const icon = CLASS_ICONS[data.cardClass];
  const frontAttacks = data.attacks.slice(0, 2);

  // suppress unused warning
  void getModifier;

  return (
    <div
      ref={cardRef}
      className="mm-card"
      style={{ '--mm-class-color': color } as React.CSSProperties}
    >
      {/* Name Banner */}
      <div className="mm-name-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '18px', lineHeight: 1.1 }}>
          {data.entityName || 'ENTITY UNKNOWN'}
        </span>
        <span className="mm-class-badge">{icon} {data.cardClass.toUpperCase()}</span>
      </div>

      {/* Portrait */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 100%)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: `1px solid ${color}44`,
      }}>
        {data.portrait ? (
          <img
            src={data.portrait}
            alt={data.entityName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: `${color}44`,
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.1em',
            gap: '12px',
          }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke={`${color}44`} strokeWidth="1" strokeDasharray="4 2" />
              <circle cx="32" cy="32" r="20" stroke={`${color}33`} strokeWidth="1" />
              <text x="32" y="38" textAnchor="middle" fill={`${color}66`} fontSize="20">☢</text>
            </svg>
            <span>PORTRAIT SLOT</span>
            <span style={{ fontSize: '9px', color: `${color}33` }}>UPLOAD IMAGE</span>
          </div>
        )}
        {/* Corner decorations */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '16px', height: '16px', borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '16px', height: '16px', borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '16px', height: '16px', borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      </div>

      {/* Tagline */}
      <div style={{
        padding: '8px 16px',
        fontStyle: 'italic',
        fontSize: '11px',
        color: '#aaa',
        borderBottom: `1px solid rgba(255,255,255,0.05)`,
        textAlign: 'center',
        minHeight: '28px',
      }}>
        {data.tagline ? data.tagline : <span style={{ color: '#444' }}>TAGLINE PENDING CLASSIFICATION</span>}
      </div>

      {/* Combat Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gap: '8px',
        padding: '10px 12px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: `1px solid ${color}44`,
      }}>
        {/* Level */}
        <div className="mm-stat-box">
          <div style={{ fontSize: '8px', color: '#888', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Level</div>
          <div style={{ fontSize: '24px', fontFamily: 'Orbitron, sans-serif', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{data.level}</div>
        </div>
        {/* HP */}
        <div className="mm-stat-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <HpBar current={data.hpCurrent} max={data.hpMax} classColor={color} />
        </div>
        {/* DEF */}
        <div className="mm-stat-box">
          <div style={{ fontSize: '8px', color: '#888', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>DEF</div>
          <div style={{ fontSize: '24px', fontFamily: 'Orbitron, sans-serif', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{data.def}</div>
        </div>
      </div>

      {/* Primary Attacks */}
      <div style={{ padding: '8px 12px', overflow: 'hidden' }}>
        <div className="mm-section-header">Primary Attacks</div>
        {frontAttacks.length > 0 ? frontAttacks.map((atk, i) => (
          <div key={i} className="mm-attack-line">
            <span style={{ fontSize: '13px' }}>{atk.emojis.join('')}</span>{' '}
            <span style={{ color: '#fff', fontWeight: 600 }}>{atk.name || 'Unnamed Attack'}</span>{' '}
            {atk.toHit && <span style={{ color: color }}>{atk.toHit}</span>}
            {atk.damage && <> — <span style={{ color: '#ccc' }}>{atk.damage}</span></>}
            {atk.riders && <span style={{ color: '#888' }}> ({atk.riders})</span>}
          </div>
        )) : (
          <div className="mm-attack-line" style={{ color: '#444' }}>NO ATTACKS ON FILE</div>
        )}
      </div>

      {/* Footer */}
      <div className="mm-footer">
        <span>Mutants &amp; Monsters</span>
        <span>THREAT SCAN</span>
        {data.cardNumber && <span>{data.cardNumber}</span>}
      </div>
    </div>
  );
}
