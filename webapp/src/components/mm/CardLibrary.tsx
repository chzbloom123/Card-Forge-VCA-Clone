import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CLASS_COLORS, CLASS_ICONS } from '@/types/card';
import type { CardResponse } from '../../../../backend/src/types';

interface CardLibraryProps {
  onLoad: (card: CardResponse) => void;
  onNew: () => void;
  currentCardId: string | null;
}

export function CardLibrary({ onLoad, onNew, currentCardId }: CardLibraryProps) {
  const queryClient = useQueryClient();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: () => api.get<CardResponse[]>('/api/cards'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/cards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });

  function handleDelete(e: React.MouseEvent, card: CardResponse) {
    e.stopPropagation();
    deleteMutation.mutate(card.id);
  }

  const panelStyle: React.CSSProperties = {
    width: '240px',
    minWidth: '240px',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(0,0,0,0.4)',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    overflowY: 'auto',
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#555',
    padding: '16px 16px 10px',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const newBtnStyle: React.CSSProperties = {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '8px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.08)',
    color: '#aaa',
    border: '1px solid rgba(255,255,255,0.12)',
    textTransform: 'uppercase',
    transition: 'all 0.15s',
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span>Library {cards.length > 0 ? `(${cards.length})` : ''}</span>
        <button
          style={newBtnStyle}
          onClick={onNew}
          onMouseOver={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)';
            (e.currentTarget as HTMLButtonElement).style.color = '#fff';
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLButtonElement).style.color = '#aaa';
          }}
        >
          + New
        </button>
      </div>

      <div style={{ flex: 1, padding: '8px 0' }}>
        {isLoading ? (
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '10px',
            color: '#444',
            padding: '16px',
            textAlign: 'center',
          }}>
            SCANNING...
          </div>
        ) : cards.length === 0 ? (
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '10px',
            color: '#333',
            padding: '24px 16px',
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            NO CARDS SAVED
            <br />
            <span style={{ color: '#222' }}>Build and save a card to begin.</span>
          </div>
        ) : (
          cards.map((card) => {
            const color = CLASS_COLORS[card.cardClass as keyof typeof CLASS_COLORS] ?? '#888';
            const icon = CLASS_ICONS[card.cardClass as keyof typeof CLASS_ICONS] ?? '?';
            const isSelected = card.id === currentCardId;
            const isHovered = hoveredId === card.id;
            const isDeleting = deleteMutation.isPending && deleteMutation.variables === card.id;

            return (
              <div
                key={card.id}
                onClick={() => onLoad(card)}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  background: isSelected
                    ? `${color}18`
                    : isHovered
                    ? 'rgba(255,255,255,0.04)'
                    : 'transparent',
                  borderLeft: isSelected ? `2px solid ${color}` : '2px solid transparent',
                  transition: 'all 0.15s',
                  position: 'relative',
                  opacity: isDeleting ? 0.4 : 1,
                }}
              >
                {/* Class icon */}
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{icon}</span>

                {/* Name + class */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: isSelected ? color : '#ccc',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textTransform: 'uppercase',
                  }}>
                    {card.name || 'UNTITLED'}
                  </div>
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: '9px',
                    color: `${color}88`,
                    marginTop: '2px',
                  }}>
                    {card.cardClass.toUpperCase()}
                  </div>
                </div>

                {/* Delete button - shows on hover */}
                {(isHovered || isSelected) && (
                  <button
                    onClick={(e) => handleDelete(e, card)}
                    disabled={isDeleting}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#555',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '3px',
                      flexShrink: 0,
                      transition: 'color 0.15s',
                    }}
                    onMouseOver={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = '#ff4444';
                    }}
                    onMouseOut={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = '#555';
                    }}
                    title="Delete card"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
