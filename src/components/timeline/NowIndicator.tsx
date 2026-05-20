import type { NowIndicatorData } from '../../domain/types';

interface NowIndicatorProps {
  data: NowIndicatorData;
}

export function NowIndicator({ data }: NowIndicatorProps) {
  return (
    <>
      {/* Faixa âmbar — bloco de 30min atual */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-[2]"
        style={{
          top:        data.slotTop,
          height:     data.bandH,
          background: 'rgba(251,191,36,0.1)',
          borderTop:  '2px solid rgba(251,191,36,0.55)',
        }}
      />
      {/* Linha vermelha — minuto exato */}
      <div
        className="absolute left-0 right-0 h-0.5 pointer-events-none z-[7] bg-red-500"
        style={{ top: data.nowTop }}
      >
        <div
          className="absolute rounded-full bg-red-500"
          style={{
            left:      -3,
            top:       -4,
            width:     10,
            height:    10,
            boxShadow: '0 0 0 2px rgba(255,255,255,0.9)',
          }}
        />
      </div>
    </>
  );
}
