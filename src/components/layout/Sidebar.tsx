import type { ReactNode } from 'react';

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#78767b] mb-1">
        {label}
      </div>
      <div className="text-[12px] text-[#47464b] leading-relaxed">{children}</div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col p-6 overflow-y-auto">
      <div className="mb-8">
        <div className="text-[20px] font-bold text-[#191c1e] leading-tight">Rio2C 2026</div>
        <div className="text-[11px] text-[#78767b] italic mt-0.5">Precision Minimalism</div>
      </div>
      <div className="flex flex-col gap-5">
        <Section label="LOCAL">
          Cidade das Artes, Barra da Tijuca, Rio de Janeiro.
        </Section>
        <Section label="DATAS">
          24 a 30 de Maio de 2026.
        </Section>
        <Section label="OBJETIVO">
          O maior encontro de criatividade e inovação da América Latina, conectando audiovisual, música, games, tecnologia, ciência, mídia e publicidade.
        </Section>
        <Section label="ESTRUTURA">
          Conference (painéis), Market (negócios) e Festivalia (experiências).
        </Section>
      </div>
    </aside>
  );
}
