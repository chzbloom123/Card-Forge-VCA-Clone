import React from 'react';
import { CardData, AttackData, CardClass, CLASS_COLORS } from '@/types/card';
import { EmojiPicker } from './EmojiPicker';
import { ImageUpload } from './ImageUpload';

interface BuilderFormProps {
  data: CardData;
  onChange: (data: CardData) => void;
}

const FIELD_STYLE: React.CSSProperties = {
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '4px',
  color: '#fff',
  padding: '6px 8px',
  fontSize: '12px',
  fontFamily: 'Share Tech Mono, monospace',
  width: '100%',
  outline: 'none',
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '9px',
  color: '#888',
  fontFamily: 'Orbitron, sans-serif',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  display: 'block',
  marginBottom: '3px',
};

const SECTION_STYLE: React.CSSProperties = {
  marginBottom: '20px',
};

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontFamily: 'Orbitron, sans-serif',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  marginBottom: '10px',
  paddingBottom: '5px',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ ...SECTION_TITLE_STYLE, color, borderBottom: `1px solid ${color}44` }}>
      {children}
    </div>
  );
}

function AttackRow({ attack, index, color, onChange, onRemove, showRemove }: {
  attack: AttackData;
  index: number;
  color: string;
  onChange: (a: AttackData) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  return (
    <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${color}33`, borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '9px', color, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em' }}>ATTACK {index + 1}</span>
        {showRemove && (
          <button type="button" onClick={onRemove} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '12px' }}>&#x2715;</button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px', marginBottom: '6px', alignItems: 'end' }}>
        <div>
          <label style={LABEL_STYLE}>Emoji</label>
          <EmojiPicker selected={attack.emojis} onChange={emojis => onChange({ ...attack, emojis })} />
        </div>
        <div>
          <label style={LABEL_STYLE}>Name</label>
          <input style={FIELD_STYLE} value={attack.name} onChange={e => onChange({ ...attack, name: e.target.value })} placeholder="e.g. Irradiated Claw" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '6px', marginBottom: '6px' }}>
        <div>
          <label style={LABEL_STYLE}>To-Hit</label>
          <input style={FIELD_STYLE} value={attack.toHit} onChange={e => onChange({ ...attack, toHit: e.target.value })} placeholder="+5" />
        </div>
        <div>
          <label style={LABEL_STYLE}>Damage</label>
          <input style={FIELD_STYLE} value={attack.damage} onChange={e => onChange({ ...attack, damage: e.target.value })} placeholder="2d6+3 radiation" />
        </div>
      </div>
      <div>
        <label style={LABEL_STYLE}>Riders (optional)</label>
        <input style={FIELD_STYLE} value={attack.riders} onChange={e => onChange({ ...attack, riders: e.target.value })} placeholder="DC 14 Fort or poisoned" />
      </div>
    </div>
  );
}

export function BuilderForm({ data, onChange }: BuilderFormProps) {
  const color = CLASS_COLORS[data.cardClass];

  function set<K extends keyof CardData>(key: K, value: CardData[K]) {
    onChange({ ...data, [key]: value });
  }

  function setAttack(index: number, attack: AttackData) {
    const attacks = [...data.attacks];
    attacks[index] = attack;
    onChange({ ...data, attacks });
  }

  function addAttack() {
    onChange({ ...data, attacks: [...data.attacks, { emojis: [], name: '', toHit: '', damage: '', riders: '' }] });
  }

  function removeAttack(index: number) {
    onChange({ ...data, attacks: data.attacks.filter((_, i) => i !== index) });
  }

  const inputStyle = { ...FIELD_STYLE };
  const textareaStyle = { ...FIELD_STYLE, resize: 'vertical' as const, minHeight: '70px' };

  return (
    <div style={{ fontFamily: 'Share Tech Mono, monospace', color: '#ccc' }}>
      {/* Identity */}
      <div style={SECTION_STYLE}>
        <SectionTitle color={color}>Identity</SectionTitle>
        <Field label="Entity Name">
          <input style={inputStyle} maxLength={40} value={data.entityName} onChange={e => set('entityName', e.target.value)} placeholder="ENTITY UNKNOWN" />
        </Field>
        <Field label="Card Class">
          <select
            style={inputStyle}
            value={data.cardClass}
            onChange={e => set('cardClass', e.target.value as CardClass)}
          >
            <option value="Mutant">☢️ Mutant</option>
            <option value="Monster">👾 Monster</option>
            <option value="Character">🧑 Character</option>
          </select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <Field label="Level">
            <input style={inputStyle} type="number" min={1} max={30} value={data.level} onChange={e => set('level', parseInt(e.target.value) || 1)} />
          </Field>
          <Field label="Card Number">
            <input style={inputStyle} value={data.cardNumber} onChange={e => set('cardNumber', e.target.value)} placeholder="#001" />
          </Field>
        </div>
        <Field label="Tagline (max 60 chars)">
          <input style={inputStyle} maxLength={60} value={data.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Flavor text for the card..." />
        </Field>
        <Field label="Portrait Image">
          <ImageUpload portrait={data.portrait} onPortraitChange={url => set('portrait', url)} classColor={color} />
        </Field>
      </div>

      {/* Combat Stats */}
      <div style={SECTION_STYLE}>
        <SectionTitle color={color}>Combat Stats (Threat Scan)</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          <Field label="HP Max">
            <input style={inputStyle} type="number" min={1} max={9999} value={data.hpMax} onChange={e => { const v = parseInt(e.target.value) || 1; onChange({ ...data, hpMax: v, hpCurrent: v }); }} />
          </Field>
          <Field label="HP Current">
            <input style={inputStyle} type="number" min={0} max={data.hpMax} value={data.hpCurrent} onChange={e => set('hpCurrent', parseInt(e.target.value) || 0)} />
          </Field>
          <Field label="DEF">
            <input style={inputStyle} type="number" min={1} max={30} value={data.def} onChange={e => set('def', parseInt(e.target.value) || 1)} />
          </Field>
        </div>
      </div>

      {/* Attacks */}
      <div style={SECTION_STYLE}>
        <SectionTitle color={color}>Attacks</SectionTitle>
        <p style={{ fontSize: '10px', color: '#666', marginBottom: '8px', fontStyle: 'italic' }}>First 2 attacks appear on Threat Scan. All attacks appear on Containment Dossier.</p>
        {data.attacks.map((atk, i) => (
          <AttackRow
            key={i}
            attack={atk}
            index={i}
            color={color}
            onChange={a => setAttack(i, a)}
            onRemove={() => removeAttack(i)}
            showRemove={data.attacks.length > 1}
          />
        ))}
        {data.attacks.length < 8 && (
          <button
            type="button"
            onClick={addAttack}
            style={{
              background: `${color}22`,
              border: `1px dashed ${color}66`,
              borderRadius: '4px',
              color,
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'Orbitron, sans-serif',
              width: '100%',
              letterSpacing: '0.1em',
            }}
          >
            + ADD ATTACK
          </button>
        )}
      </div>

      {/* A.S.P.I.C.E. */}
      <div style={SECTION_STYLE}>
        <SectionTitle color={color}>A.S.P.I.C.E. Attributes</SectionTitle>
        <p style={{ fontSize: '10px', color: '#666', marginBottom: '8px', fontStyle: 'italic' }}>Modifiers auto-calculated: floor((score-10)/2)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {([
            { key: 'adaptability' as keyof CardData, label: 'A — Adaptability' },
            { key: 'strength' as keyof CardData, label: 'S — Strength' },
            { key: 'perception' as keyof CardData, label: 'P — Perception' },
            { key: 'intellect' as keyof CardData, label: 'I — Intellect' },
            { key: 'constitution' as keyof CardData, label: 'C — Constitution' },
            { key: 'ego' as keyof CardData, label: 'E — Ego' },
          ] as const).map(attr => (
            <Field key={attr.key} label={attr.label}>
              <input style={inputStyle} type="number" min={1} max={30} value={data[attr.key] as number} onChange={e => set(attr.key, parseInt(e.target.value) || 10)} />
            </Field>
          ))}
        </div>
      </div>

      {/* Tactical Profile */}
      <div style={SECTION_STYLE}>
        <SectionTitle color={color}>Tactical Profile (Dossier)</SectionTitle>
        <Field label="Movement">
          <input style={inputStyle} value={data.movement} onChange={e => set('movement', e.target.value)} placeholder="30 ft., burrow 15 ft." />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          <Field label="Fort Save">
            <input style={inputStyle} value={data.fortitudeSave} onChange={e => set('fortitudeSave', e.target.value)} placeholder="+7" />
          </Field>
          <Field label="Reflex Save">
            <input style={inputStyle} value={data.reflexSave} onChange={e => set('reflexSave', e.target.value)} placeholder="+4" />
          </Field>
          <Field label="Will Save">
            <input style={inputStyle} value={data.willSave} onChange={e => set('willSave', e.target.value)} placeholder="+2" />
          </Field>
        </div>
        <Field label="Resistances">
          <input style={inputStyle} value={data.resistances} onChange={e => set('resistances', e.target.value)} placeholder="radiation, fire" />
        </Field>
        <Field label="Immunities">
          <input style={inputStyle} value={data.immunities} onChange={e => set('immunities', e.target.value)} placeholder="poison, frightened" />
        </Field>
      </div>

      {/* Narrative */}
      <div style={SECTION_STYLE}>
        <SectionTitle color={color}>Narrative (Dossier)</SectionTitle>
        <Field label="Anomaly Manifestations (one per line)">
          <textarea style={textareaStyle} maxLength={300} value={data.anomalyManifestations} onChange={e => set('anomalyManifestations', e.target.value)} placeholder={"Radiation Burst\nMutation Pulse"} />
        </Field>
        <Field label="Special Traits (one per line)">
          <textarea style={textareaStyle} maxLength={300} value={data.specialTraits} onChange={e => set('specialTraits', e.target.value)} placeholder={"Radiation Aura (5 ft.)\nDarkvision 60 ft."} />
        </Field>
        <Field label="Origin File (3-4 sentences)">
          <textarea style={{ ...textareaStyle, minHeight: '90px' }} maxLength={400} value={data.originFile} onChange={e => set('originFile', e.target.value)} placeholder="Declassified field report narrative..." />
        </Field>
      </div>
    </div>
  );
}
