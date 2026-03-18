import React from 'react';
import { CardData, CLASS_COLORS, CLASS_ICONS, getModifier } from '@/types/card';

interface ContainmentDossierProps {
  data: CardData;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const ASPICE = [
  { key: 'adaptability' as keyof CardData, label: 'A', full: 'Adaptability' },
  { key: 'strength' as keyof CardData, label: 'S', full: 'Strength' },
  { key: 'perception' as keyof CardData, label: 'P', full: 'Perception' },
  { key: 'intellect' as keyof CardData, label: 'I', full: 'Intellect' },
  { key: 'constitution' as keyof CardData, label: 'C', full: 'Constitution' },
  { key: 'ego' as keyof CardData, label: 'E', full: 'Ego' },
] as const;

export function ContainmentDossier({ data, cardRef }: ContainmentDossierProps) {
  const color = CLASS_COLORS[data.cardClass];
  const icon = CLASS_ICONS[data.cardClass];

  const anomalies = data.anomalyManifestations.split('\n').filter(Boolean);
  const traits = data.specialTraits.split('\n').filter(Boolean);

  return (
    <div
      ref={cardRef}
      className="mm-card"
      style={{ '--mm-class-color': color } as React.CSSProperties}
    >
      {/* Compact Header */}
      <div style={{
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${color}66`,
        background: 'rgba(0,0,0,0.4)',
      }}>
        <div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: '14px', color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {data.entityName || 'ENTITY UNKNOWN'}
          </div>
          <div style={{ fontSize: '9px', color: '#888', fontFamily: 'Share Tech Mono, monospace', marginTop: '1px' }}>
            CONTAINMENT DOSSIER — LVL {data.level}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
          <span className="mm-class-badge">{icon} {data.cardClass.toUpperCase()}</span>
        </div>
      </div>

      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden', flex: 1 }}>

        {/* A.S.P.I.C.E. Grid */}
        <div>
          <div className="mm-section-header">A.S.P.I.C.E. Attributes</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {ASPICE.map(attr => {
              const score = data[attr.key] as number;
              const mod = getModifier(score);
              return (
                <div key={attr.label} className="mm-stat-box" style={{ padding: '5px 4px' }}>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', fontWeight: 700, color: color }}>{attr.label}</div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{score}</div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: '#aaa' }}>({mod})</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tactical Profile */}
        <div>
          <div className="mm-section-header">Tactical Profile</div>
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '6px 8px', fontSize: '10px', fontFamily: 'Share Tech Mono, monospace' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px' }}>
              {data.movement && <div><span style={{ color: color }}>MV: </span>{data.movement}</div>}
              {data.fortitudeSave && <div><span style={{ color: color }}>FORT: </span>{data.fortitudeSave}</div>}
              {data.reflexSave && <div><span style={{ color: color }}>REFLEX: </span>{data.reflexSave}</div>}
              {data.willSave && <div><span style={{ color: color }}>WILL: </span>{data.willSave}</div>}
              {data.resistances && <div style={{ gridColumn: '1/-1' }}><span style={{ color: color }}>RES: </span>{data.resistances}</div>}
              {data.immunities && <div style={{ gridColumn: '1/-1' }}><span style={{ color: color }}>IMM: </span>{data.immunities}</div>}
            </div>
          </div>
        </div>

        {/* Full Attack List */}
        <div>
          <div className="mm-section-header">Full Attack List</div>
          {data.attacks.length > 0 ? data.attacks.map((atk, i) => (
            <div key={i} className="mm-attack-line" style={{ fontSize: '10px' }}>
              <span>{atk.emojis.join('')}</span>{' '}
              <span style={{ color: '#fff', fontWeight: 600 }}>{atk.name}</span>{' '}
              {atk.toHit && <span style={{ color: color }}>{atk.toHit}</span>}
              {atk.damage && <> — <span>{atk.damage}</span></>}
              {atk.riders && <span style={{ color: '#777' }}> ({atk.riders})</span>}
            </div>
          )) : (
            <div className="mm-attack-line" style={{ color: '#444', fontSize: '10px' }}>NO ATTACKS ON FILE</div>
          )}
        </div>

        {/* Anomaly Manifestations */}
        {anomalies.length > 0 && (
          <div>
            <div className="mm-section-header">Anomaly Manifestations</div>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '5px 8px' }}>
              {anomalies.map((a, i) => (
                <div key={i} style={{ fontSize: '10px', fontFamily: 'Share Tech Mono, monospace', color: '#ddd', display: 'flex', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ color: color }}>&#9656;</span><span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Traits */}
        {traits.length > 0 && (
          <div>
            <div className="mm-section-header">Special Traits</div>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '5px 8px' }}>
              {traits.map((t, i) => (
                <div key={i} style={{ fontSize: '10px', fontFamily: 'Share Tech Mono, monospace', color: '#ddd', display: 'flex', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ color: color }}>&#9670;</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Origin File */}
        {data.originFile && (
          <div>
            <div className="mm-section-header">Origin File</div>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: `1px solid ${color}33`,
              borderRadius: '4px',
              padding: '6px 8px',
              fontSize: '9.5px',
              fontFamily: 'Share Tech Mono, monospace',
              color: '#bbb',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}>
              {data.originFile}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mm-footer">
        <span>Mutants &amp; Monsters</span>
        <span>CONTAINMENT DOSSIER</span>
        {data.cardNumber && <span>{data.cardNumber}</span>}
      </div>
    </div>
  );
}
