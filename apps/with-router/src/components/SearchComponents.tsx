import { useRef, useEffect, useState, Suspense, use } from 'react';
import type { ChangeEvent, ReactNode } from 'react';

export interface SearchResult {
  id: string;
  text: string;
}

export interface SearchFunction {
  (value: string, page?: number): Promise<Array<SearchResult>>;
}


export function CharacterCard({ id, text }: SearchResult) {
    console.log('card', id)
  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '10px', 
      margin: '5px 0',
      borderRadius: '4px'
    }}>
      <strong>ID:</strong> {id}
      <br />
      <strong>Text:</strong> {text}
    </div>
  );
}

export function SearchInput({ 
  onChange, 
  placeholder = "Search...",
  ...props 
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}
      {...props}
    />
  );
}

export function LoadingSpinner({ children = "Loading..." }: { children?: ReactNode }) {
  return (
    <div style={{ 
      minHeight: '0vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      {children}
    </div>
  );
}

export function IntersectionSentinel({ 
  onIntersect,
  style = {}
}: {
  onIntersect: () => void;
  style?: React.CSSProperties;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    });

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [onIntersect]);

  return (
    <div 
      ref={sentinelRef}
      style={{
        height: '20px',
        background: 'transparent',
        ...style
      }}
    />
  );
}
