import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CardData, CLASS_COLORS, DEFAULT_CARD_DATA, SAMPLE_CARDS } from '@/types/card';
import { ThreatScan } from '@/components/mm/ThreatScan';
import { ContainmentDossier } from '@/components/mm/ContainmentDossier';
import { BuilderForm } from '@/components/mm/BuilderForm';
import { CardLibrary } from '@/components/mm/CardLibrary';
import { exportCardPng } from '@/utils/exportCard';
import { exportCardPdf } from '@/utils/exportPdf';
import { api } from '@/lib/api';
import type { CardResponse } from '../../../backend/src/types';

export default function Index() {
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'build' | 'samples'>('build');
  const [exporting, setExporting] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const threatRef = useRef<HTMLDivElement>(null);
  const dossierRef = useRef<HTMLDivElement>(null);
  const color = CLASS_COLORS[cardData.cardClass];
  const queryClient = useQueryClient();

  async function handleExportPng() {
    if (!threatRef.current || !dossierRef.current) return;
    setExporting(true);
    try {
      await exportCardPng(threatRef.current, dossierRef.current, cardData.entityName);
    } finally {
      setExporting(false);
    }
  }

  async function handleExportPdf() {
    if (!threatRef.current || !dossierRef.current) return;
    setExporting(true);
    try {
      await exportCardPdf(threatRef.current, dossierRef.current, cardData.entityName, color);
    } finally {
      setExporting(false);
    }
  }

  function loadSample(sample: CardData) {
    setCardData(sample);
    setCurrentCardId(null);
    setActiveTab('build');
  }

  function handleNew() {
    setCardData(DEFAULT_CARD_DATA);
    setCurrentCardId(null);
  }

  function handleLoad(card: CardResponse) {
    setCardData(card.data);
    setCurrentCardId(card.id);
    setActiveTab('build');
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (currentCardId) {
        return api.put<CardResponse>(`/api/cards/${currentCardId}`, { data: cardData });
      } else {
        return api.post<CardResponse>('/api/cards', { data: cardData });
      }
    },
    onSuccess: (result) => {
      if (result && !currentCardId) {
        setCurrentCardId(result.id);
      }
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    },
  });

  const btnBase: React.CSSProperties = {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0d0d0d 0%, #111111 100%)',
      color: '#E0E0E0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${color}44`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.5)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
      }}>
        <div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '20px',
            fontWeight: 900,
            letterSpacing: '0.08em',
            color: '#fff',
            textShadow: `0 0 20px ${color}`,
          }}>
            ☢️ MUTANTS &amp; MONSTERS
          </div>
          <div style={{ fontSize: '10px', color: '#666', fontFamily: 'Share Tech Mono, monospace', letterSpacing: '0.1em', marginTop: '2px' }}>
            CARD BUILDER v3.0 — A.S.P.I.C.E. EDITION
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: '0', border: `1px solid ${color}44`, borderRadius: '4px', overflow: 'hidden' }}>
            {(['build', 'samples'] as const).map(tab => (
              <button
                key={tab}
                style={{
                  ...btnBase,
                  background: activeTab === tab ? color : 'transparent',
                  color: activeTab === tab ? '#000' : '#888',
                  borderRadius: 0,
                  padding: '6px 14px',
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'build' ? 'BUILD' : 'SAMPLES'}
              </button>
            ))}
          </div>

          {/* Save button */}
          {activeTab === 'build' && (
            <button
              style={{
                ...btnBase,
                background: savedFlash ? '#4CAF50' : `${color}22`,
                color: savedFlash ? '#000' : color,
                border: `1px solid ${savedFlash ? '#4CAF50' : `${color}44`}`,
                minWidth: '80px',
              }}
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? '...' : savedFlash ? 'SAVED!' : currentCardId ? 'Update' : 'Save'}
            </button>
          )}

          <button
            style={{ ...btnBase, background: `${color}22`, color, border: `1px solid ${color}44` }}
            onClick={handleExportPng}
            disabled={exporting}
          >
            {exporting ? '...' : 'Export PNGs'}
          </button>
          <button
            style={{ ...btnBase, background: color, color: '#000' }}
            onClick={handleExportPdf}
            disabled={exporting}
          >
            {exporting ? '...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {activeTab === 'samples' ? (
        /* Samples View */
        <div style={{ padding: '32px 24px' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', color: '#888', letterSpacing: '0.1em', marginBottom: '24px', textTransform: 'uppercase' }}>
            Sample Cards — Click to Load
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '32px' }}>
            {SAMPLE_CARDS.map((sample, i) => (
              <div
                key={i}
                onClick={() => loadSample(sample)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <ThreatScan data={sample} />
                <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '10px', color: '#666', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em' }}>
                  CLICK TO LOAD
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Build View - Three Column: Library | Form | Preview */
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left: Card Library */}
          <CardLibrary
            onLoad={handleLoad}
            onNew={handleNew}
            currentCardId={currentCardId}
          />

          {/* Middle: Form */}
          <div style={{
            width: '400px',
            minWidth: '380px',
            overflowY: 'auto',
            padding: '24px',
            borderRight: `1px solid rgba(255,255,255,0.05)`,
          }}>
            <BuilderForm data={cardData} onChange={setCardData} />
          </div>

          {/* Right: Preview */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            alignItems: 'flex-start',
            background: 'rgba(0,0,0,0.2)',
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' as const, textAlign: 'center', marginBottom: '8px' }}>
                Threat Scan (Front)
              </div>
              <ThreatScan data={cardData} cardRef={threatRef} />
            </div>
            <div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' as const, textAlign: 'center', marginBottom: '8px' }}>
                Containment Dossier (Back)
              </div>
              <ContainmentDossier data={cardData} cardRef={dossierRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
