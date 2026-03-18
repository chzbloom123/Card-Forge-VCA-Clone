import React, { useState, useRef, useEffect } from 'react';

const EMOJI_FAMILIES = [
  { emoji: '☢️', label: 'Radiation' },
  { emoji: '⚡', label: 'Energy' },
  { emoji: '🌪️', label: 'Wind' },
  { emoji: '🐾', label: 'Physical' },
  { emoji: '☣️', label: 'Poison' },
  { emoji: '🧪', label: 'Acid' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '🧬', label: 'Mutation' },
  { emoji: '⚠️', label: 'Hazard' },
];

interface EmojiPickerProps {
  selected: string[];
  onChange: (emojis: string[]) => void;
}

export function EmojiPicker({ selected, onChange }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggle(emoji: string) {
    if (selected.includes(emoji)) {
      onChange(selected.filter(e => e !== emoji));
    } else if (selected.length < 2) {
      onChange([...selected, emoji]);
    } else {
      onChange([selected[1], emoji]);
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          fontSize: '16px',
          minWidth: '52px',
          color: '#fff',
        }}
      >
        {selected.length > 0 ? selected.join('') : '➕'}
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          zIndex: 100,
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '6px',
          padding: '8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          minWidth: '160px',
        }}>
          {EMOJI_FAMILIES.map(f => (
            <button
              key={f.emoji}
              type="button"
              onClick={() => toggle(f.emoji)}
              title={f.label}
              style={{
                background: selected.includes(f.emoji) ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: selected.includes(f.emoji) ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                borderRadius: '4px',
                padding: '4px',
                cursor: 'pointer',
                fontSize: '18px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <span>{f.emoji}</span>
              <span style={{ fontSize: '7px', color: '#888', fontFamily: 'Share Tech Mono, monospace' }}>{f.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
