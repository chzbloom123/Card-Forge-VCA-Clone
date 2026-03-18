import React, { useRef, useState, useCallback } from 'react';

interface ImageUploadProps {
  portrait: string;
  onPortraitChange: (dataUrl: string) => void;
  classColor: string;
}

export function ImageUpload({ portrait, onPortraitChange, classColor }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') onPortraitChange(result);
    };
    reader.readAsDataURL(file);
  }, [onPortraitChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? classColor : 'rgba(255,255,255,0.15)'}`,
          borderRadius: '6px',
          padding: '12px',
          cursor: 'pointer',
          background: dragging ? `${classColor}11` : 'rgba(0,0,0,0.2)',
          transition: 'all 0.2s',
          textAlign: 'center',
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        {portrait ? (
          <>
            <img src={portrait} alt="Portrait" style={{ height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
            <span style={{ fontSize: '10px', color: '#888', fontFamily: 'Share Tech Mono, monospace' }}>Click to change</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '24px' }}>🖼️</span>
            <span style={{ fontSize: '11px', color: '#888', fontFamily: 'Share Tech Mono, monospace' }}>Drop image or click to upload</span>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} style={{ display: 'none' }} />
    </div>
  );
}
