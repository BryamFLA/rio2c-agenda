# RIO2C Agenda — React Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar o app `rio2c-agenda` de um único `index.html` vanilla para uma SPA React com TypeScript, Tailwind CSS, Zustand e @dnd-kit/core, aplicando o design system "Monochrome Logic" com layout responsivo: lista vertical no mobile, grid horizontal no desktop.

**Architecture:** Camadas limpas — `data/` (dados estáticos) → `domain/` (lógica pura) → `store/` (Zustand + persist) → `hooks/` (React hooks) → `components/` (UI). Cada camada importa somente das camadas anteriores. Layout responsivo: `<MobileTimeline>` (< 768px) / `<Timeline>` (≥ 768px).

**Tech Stack:** React 18, TypeScript 5, Vite 6, Tailwind CSS 3, Zustand 5, @dnd-kit/core 6, Inter (Google Fonts), GitHub Pages

---

## Design System — "Monochrome Logic"

### Palette
| Token | Valor | Uso |
|-------|-------|-----|
| `surface` | `#f7f9fb` | Background geral |
| `surface-container-lowest` | `#ffffff` | Cards, modais |
| `surface-container` | `#eceef0` | Hover states |
| `on-surface` | `#191c1e` | Texto primário |
| `on-surface-variant` | `#47464b` | Texto secundário |
| `outline` | `#78767b` | Bordas visíveis |
| `outline-variant` | `#c8c5cb` | Bordas sutis |
| `primary` | `#000000` | Botões primários, ativo |
| `error` | `#ba1a1a` | Remover, erro |

### Cores das trilhas (atualizadas)
| Trilha | Cor antiga | Cor nova |
|--------|-----------|---------|
| games | `#7C3AED` | `#6366F1` |
| creator | `#EA580C` | `#F59E0B` |
| ia | `#2563EB` | `#0EA5E9` |
| tech | `#0891B2` | `#10B981` |
| marketing | `#DB2777` | `#EC4899` |
| edu | `#16A34A` | `#8B5CF6` |

### Tipografia
- **Fonte:** Inter (Google Fonts) em toda a aplicação
- **Títulos:** `font-semibold` / `font-bold`, `tracking-tight`
- **Labels:** `uppercase`, `tracking-wide`, `text-[10px]`
- **Numerics (horários):** `tabular-nums`

### Componentes — regras visuais
- **Cards:** `bg-white`, `border border-[#E2E8F0]`, `rounded-2xl`, `shadow-[0_4px_12px_rgba(0,0,0,0.03)]`, borda esquerda **2px** colorida (não 4px)
- **Botões primários:** `bg-[#000000] text-white rounded-lg` (8px radius)
- **Botões ghost:** `border border-[#c8c5cb] text-[#47464b] rounded-lg`
- **Chips/tags:** `bg-[#eceef0] text-[#47464b]` (neutro, nunca colorido)
- **Header:** `bg-white/80 backdrop-blur-[12px]` com `border-b border-[#eceef0]`
- **Modal overlay:** `backdrop-blur-[12px] bg-black/40`
- **Inputs/textarea:** `border border-[#e2e8f0]`, focus: `border-[#191c1e]` (charcoal 2px)
- **Favorito ativo:** ★ sólido charcoal (`text-[#191c1e]`), inativo: outline gray

### Layout responsivo
- **Mobile (< 768px):** Lista vertical — time-axis 64px esquerdo + cards em coluna + route filter pills no header
- **Desktop (≥ 768px):** Grid horizontal — 4 colunas de rota lado a lado + drag entre colunas

---

## File Map

| Arquivo | Responsabilidade |
|---------|-----------------|
| `package.json` | dependências e scripts |
| `vite.config.ts` | base path `/rio2c-agenda/` |
| `tailwind.config.ts` | tokens do design system + Inter |
| `postcss.config.cjs` | tailwind + autoprefixer |
| `tsconfig.json` + `tsconfig.app.json` | compilação TS |
| `index.html` | root do Vite + Google Fonts Inter |
| `src/main.tsx` | entry point React |
| `src/index.css` | @tailwind directives + globals |
| `src/App.tsx` | estado do modal + route filter mobile, layout responsivo |
| `src/domain/constants.ts` | PX, DAY_S, DAY_E, CARD_W, HDR_H |
| `src/domain/types.ts` | interfaces: AppEvent, TrilhaConfig, RouteCol, Day, MobileRouteFilter, etc. |
| `src/domain/eventUtils.ts` | toMin, getType, assignLanes, groupEventsByTime |
| `src/domain/timeUtils.ts` | getNowSP, isEventDay, NowSP |
| `src/data/trilhas.ts` | TRILHAS com cores atualizadas do design system |
| `src/data/routes.ts` | ROUTE_COLS, ROUTE_COLORS, ROUTE_LABELS |
| `src/data/events.ts` | EVENTS: AppEvent[] (135 eventos) |
| `src/store/useAgendaStore.ts` | Zustand store + persist com Set serializer |
| `src/hooks/useNowIndicator.ts` | polling 60s → NowIndicatorData \| null |
| `src/hooks/useRouteColumns.ts` | deriva RouteColumnData[] do store |
| `src/components/ui/Badge.tsx` | badge reutilizável com cor dinâmica |
| `src/components/layout/LiveBadge.tsx` | badge pulsante "HH:MM SP" |
| `src/components/layout/Header.tsx` | logo, tabs, live badge, contador, restaurar |
| `src/components/timeline/TimeAxis.tsx` | eixo de horários sticky + now tick |
| `src/components/timeline/NowIndicator.tsx` | faixa âmbar + linha vermelha |
| `src/components/timeline/EventCard.tsx` | card com useDraggable |
| `src/components/timeline/RouteColumn.tsx` | coluna com useDroppable |
| `src/components/timeline/Timeline.tsx` | DndContext + DragOverlay + scroll |
| `src/components/modal/EventModal.tsx` | modal detalhes, rotas, notas, remover |
| `.github/workflows/deploy.yml` | build Vite + deploy dist/ |

---

## Task 1: Scaffolding — package.json, configs, entry point

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.cjs`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx` (placeholder)
- Create: `src/index.css`

- [ ] **Remover o index.html antigo da raiz**

```bash
cd C:\Users\bryam\rio2c-agenda
# O index.html da raiz será substituído pelo do Vite — apagar antes de criar o novo
git rm index.html
```

- [ ] **Criar `package.json`**

```json
{
  "name": "rio2c-agenda",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/utilities": "^3.2.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.3.20",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.4.1",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3",
    "vite": "^6.3.2"
  }
}
```

- [ ] **Instalar dependências**

```bash
npm install
```

Resultado esperado: `node_modules/` criado, sem erros.

- [ ] **Criar `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/rio2c-agenda/',
});
```

- [ ] **Criar `tailwind.config.ts`** (com todos os tokens do design system)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT:   '#f7f9fb',
          dim:       '#d8dadc',
          bright:    '#f7f9fb',
          lowest:    '#ffffff',
          low:       '#f2f4f6',
          container: '#eceef0',
          high:      '#e6e8ea',
          highest:   '#e0e3e5',
        },
        'on-surface':         '#191c1e',
        'on-surface-variant': '#47464b',
        outline:              '#78767b',
        'outline-variant':    '#c8c5cb',
        primary:              '#000000',
        'on-primary':         '#ffffff',
        'primary-container':  '#1b1b1f',
        error:                '#ba1a1a',
        'error-container':    '#ffdad6',
        // trilha accent colors
        trilha: {
          games:     '#6366F1',
          creator:   '#F59E0B',
          ia:        '#0EA5E9',
          tech:      '#10B981',
          marketing: '#EC4899',
          edu:       '#8B5CF6',
        },
      },
      boxShadow: {
        card:    '0 4px 12px rgba(0,0,0,0.03)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.07)',
        modal:   '0 20px 60px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        sm:  '0.25rem',
        DEFAULT: '0.5rem',
        md:  '0.75rem',
        lg:  '1rem',
        xl:  '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Criar `postcss.config.cjs`**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Criar `tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}
```

- [ ] **Criar `tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Criar `index.html` (root do Vite, com Inter via Google Fonts)**

```html
<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title>RIO2C 2026 — Minha Agenda</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Criar `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  overscroll-behavior: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

- [ ] **Criar `src/main.tsx` (placeholder)**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Criar `src/App.tsx` (placeholder)**

```tsx
export default function App() {
  return <div className="p-4 text-xl font-bold">RIO2C 2026 — carregando…</div>;
}
```

- [ ] **Verificar que o dev server sobe sem erros**

```bash
npm run dev
```

Resultado esperado: `http://localhost:5173/rio2c-agenda/` com a mensagem "carregando…".

- [ ] **Commit**

```bash
git add package.json package-lock.json vite.config.ts tailwind.config.ts postcss.config.cjs tsconfig.json tsconfig.app.json index.html src/
git commit -m "feat: scaffold Vite + React + TypeScript + Tailwind"
```

---

## Task 2: Domain — constants, types

**Files:**
- Create: `src/domain/constants.ts`
- Create: `src/domain/types.ts`

- [ ] **Criar `src/domain/constants.ts`**

```typescript
/** Pixels por minuto na timeline */
export const PX = 1.5;
/** Minuto de início do dia (10:00) */
export const DAY_S = 600;
/** Minuto de fim do dia (19:00) */
export const DAY_E = 1140;
/** Largura fixa de cada card em pixels */
export const CARD_W = 168;
/** Altura do header de cada coluna em pixels */
export const HDR_H = 36;
```

- [ ] **Criar `src/domain/types.ts`**

```typescript
export type TrilhaKey = 'games' | 'creator' | 'ia' | 'tech' | 'marketing' | 'edu';
export type RouteKey  = 0 | 1 | 2 | 3;
export type Day       = 26 | 27 | 28;

export interface AppEvent {
  idx:      number;
  day:      Day;
  start:    string;
  end:      string;
  title:    string;
  room:     string;
  trilha:   TrilhaKey;
  startMin: number;
  endMin:   number;
}

export interface TrilhaConfig {
  label: string;
  color: string;
}

export interface RouteCol {
  key:   RouteKey;
  label: string;
  color: string;
}

export interface LaneAssignment {
  map: Record<number, number>;
  n:   number;
}

export interface NowSP {
  year:     number;
  month:    number;
  day:      number;
  hour:     number;
  minute:   number;
  totalMin: number;
}

export interface NowIndicatorData {
  nowTop:    number;
  slotTop:   number;
  bandH:     number;
  timeLabel: string;
}

export interface RouteColumnData {
  route:    RouteCol;
  events:   AppEvent[];
  laneMap:  Record<number, number>;
  numLanes: number;
}

/** Grupo de eventos com o mesmo horário de início — usado no layout mobile */
export interface TimeGroup {
  time:   string;        // "HH:MM"
  events: AppEvent[];
}

/** Filtro de rota no mobile: 'all' = todas, 1/2/3 = rota específica */
export type MobileRouteFilter = 'all' | 1 | 2 | 3;
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

Resultado esperado: sem erros.

- [ ] **Commit**

```bash
git add src/domain/
git commit -m "feat: domain constants and types"
```

---

## Task 3: Domain — utilities

**Files:**
- Create: `src/domain/eventUtils.ts`
- Create: `src/domain/timeUtils.ts`

- [ ] **Criar `src/domain/eventUtils.ts`**

```typescript
import type { AppEvent, LaneAssignment } from './types';

/** Converte "HH:MM" para total de minutos */
export function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/** Deriva o tipo de apresentação a partir do título */
export function getType(title: string): string {
  if (/S\.O\.S\. Habilidades/i.test(title))      return 'Workshop';
  if (/masterclass/i.test(title))                 return 'Masterclass';
  if (/^mentoria/i.test(title))                   return 'Mentoria';
  if (/art talks for lunch/i.test(title))         return 'Art Talk';
  if (/laboratório dos sentidos/i.test(title))    return 'Lab';
  if (/Prêmio|Premio/i.test(title))               return 'Premiação';
  if (/sessão patrocinada|\*sessão/i.test(title)) return 'Patrocinada';
  if (/meetup/i.test(title))                      return 'Meetup';
  if (/pitching/i.test(title))                    return 'Pitching';
  if (/abertura/i.test(title))                    return 'Abertura';
  if (/conversas no aquário/i.test(title))        return 'Mesa Redonda';
  return 'Palestra';
}

/**
 * Distribui eventos em lanes (sub-colunas) para evitar sobreposição.
 * Retorna { map: { [idx]: laneIndex }, n: totalLanes }
 */
export function assignLanes(events: AppEvent[]): LaneAssignment {
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin);
  const lanes: Array<{ endMin: number }> = [];
  const map: Record<number, number> = {};

  sorted.forEach(e => {
    let placed = false;
    for (let i = 0; i < lanes.length; i++) {
      if (e.startMin >= lanes[i].endMin) {
        map[e.idx] = i;
        lanes[i] = { endMin: e.endMin };
        placed = true;
        break;
      }
    }
    if (!placed) {
      map[e.idx] = lanes.length;
      lanes.push({ endMin: e.endMin });
    }
  });

  return { map, n: lanes.length };
}

/** Sanitiza o título removendo marcadores de sessão patrocinada */
export function cleanTitle(title: string): string {
  return title.replace(/\*[^*]*/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Agrupa eventos por horário de início — usado no layout mobile.
 * Retorna TimeGroup[] ordenado cronologicamente.
 */
export function groupEventsByTime(events: AppEvent[]): import('./types').TimeGroup[] {
  const map = new Map<string, AppEvent[]>();
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin);
  sorted.forEach(e => {
    const list = map.get(e.start) ?? [];
    list.push(e);
    map.set(e.start, list);
  });
  return Array.from(map.entries()).map(([time, evs]) => ({ time, events: evs }));
}
```

- [ ] **Criar `src/domain/timeUtils.ts`**

```typescript
import type { NowSP } from './types';

/** Retorna data/hora atual no fuso de São Paulo */
export function getNowSP(): NowSP {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year:   'numeric',
    month:  '2-digit',
    day:    '2-digit',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) =>
    parseInt(parts.find(p => p.type === type)!.value, 10);

  const hour   = get('hour');
  const minute = get('minute');

  return {
    year:     get('year'),
    month:    get('month'),
    day:      get('day'),
    hour,
    minute,
    totalMin: hour * 60 + minute,
  };
}

/** Verifica se a data SP corresponde a um dos dias do evento RIO2C 2026 */
export function isEventDay(sp: NowSP): boolean {
  return sp.year === 2026 && sp.month === 5 && [26, 27, 28].includes(sp.day);
}

/** Formata número como string com 2 dígitos (ex: 9 → "09") */
export function fmt2(n: number): string {
  return String(n).padStart(2, '0');
}
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

Resultado esperado: sem erros.

- [ ] **Commit**

```bash
git add src/domain/
git commit -m "feat: domain utilities (eventUtils, timeUtils)"
```

---

## Task 4: Camada de dados

**Files:**
- Create: `src/data/trilhas.ts`
- Create: `src/data/routes.ts`
- Create: `src/data/events.ts`

- [ ] **Criar `src/data/trilhas.ts`** (cores atualizadas pelo design system "Monochrome Logic")

```typescript
import type { TrilhaKey, TrilhaConfig } from '../domain/types';

export const TRILHAS: Record<TrilhaKey, TrilhaConfig> = {
  games:     { label: '🎮 Games & eSports',      color: '#6366F1' },
  creator:   { label: '💡 Creator Economy',      color: '#F59E0B' },
  ia:        { label: '🤖 Tecnologia & IA',      color: '#0EA5E9' },
  tech:      { label: '💻 Tech & Produção',      color: '#10B981' },
  marketing: { label: '📣 Marketing & Marcas',   color: '#EC4899' },
  edu:       { label: '🎓 Educação & Carreira',  color: '#8B5CF6' },
};
```

- [ ] **Criar `src/data/routes.ts`**

```typescript
import type { RouteCol } from '../domain/types';

export const ROUTE_COLS: RouteCol[] = [
  { key: 1, label: 'Rota 1',      color: '#2563EB' },
  { key: 2, label: 'Rota 2',      color: '#EA580C' },
  { key: 3, label: 'Rota 3',      color: '#059669' },
  { key: 0, label: 'Disponíveis', color: '#6b7280' },
];

export const ROUTE_COLORS: Record<number, string> = {
  0: '#6b7280',
  1: '#2563EB',
  2: '#EA580C',
  3: '#059669',
};

export const ROUTE_LABELS: Record<number, string> = {
  0: 'Livre',
  1: 'Rota 1',
  2: 'Rota 2',
  3: 'Rota 3',
};
```

- [ ] **Criar `src/data/events.ts`**

```typescript
import type { AppEvent, TrilhaKey, Day } from '../domain/types';
import { toMin } from '../domain/eventUtils';

type RawEvent = [number, Day, string, string, string, string, TrilhaKey];

const raw: RawEvent[] = [
  // Dia 26
  [0,  26, "10:00", "11:00", "Marcas e o Mundo da Cultura e Entretenimento com BTG, Magalu e Natura", "House of Brands", "marketing"],
  [1,  26, "10:00", "11:00", "A Década dos Esports: De Nicho a Cultura", "SportsON", "games"],
  [2,  26, "10:15", "11:00", "Futuro da Criação Do Post ao IP: Criadores Que Transformaram Conteúdo em Propriedade", "Summit Creator Economy By Play9", "creator"],
  [3,  26, "11:15", "12:00", "Viral Sem Fronteiras: Como o Conteúdo se Espalha nas Redes?", "Summit Creator Economy By Play9", "creator"],
  [4,  26, "11:15", "12:15", "A Nova Era das ORGs de Esports", "SportsON", "games"],
  [5,  26, "11:30", "12:30", "Nunca é Tarde Para Se Reinventar — com Renato Camargo, CMO do Bradesco", "House of Brands", "marketing"],
  [6,  26, "12:15", "13:00", "Pequeno é Grande: Como Criadores Menores Estão Redefinindo o Mercado com UGC", "Summit Creator Economy By Play9", "creator"],
  [7,  26, "13:30", "14:30", "O Poder da Comunidade: de Streamer ao Ecossistema de Negócios", "SportsON", "games"],
  [8,  26, "14:00", "14:45", "O Algoritmo Também Ensina: a Nova Forma de Consumir Conhecimento nas Plataformas", "Summit Creator Economy By Play9", "creator"],
  [9,  26, "14:00", "15:00", "A Próxima Fase do Conteúdo de Entretenimento — com Victor Assis, do PodPah", "House of Brands", "marketing"],
  [10, 26, "14:45", "15:45", "O Ritmo dos Esports: Transformação Constante", "SportsON", "games"],
  [11, 26, "15:00", "15:45", "O Poder do Juntos — Líderes da Creator Economy Sobre o Presente e o Futuro", "Summit Creator Economy By Play9", "creator"],
  [12, 26, "15:30", "16:30", "Como as Grandes Narrativas Criam Conexões entre Marcas e Fãs", "House of Brands", "marketing"],
  [13, 26, "15:45", "16:30", "FURIA: Do Time ao Império", "SportsON", "games"],
  [14, 26, "16:40", "16:55", "Prêmio Esports Brasil: 10 Anos Celebrando os Esportes Eletrônicos", "SportsON", "games"],
  [15, 26, "17:00", "18:00", "Estratégia Orientada por Dados: O Novo Imperativo do C-Level na Transformação do Marketing", "House of Brands", "marketing"],
  [16, 26, "17:00", "18:00", "A Próxima Década dos Esports: Para Onde Vai o Jogo", "SportsON", "games"],
  // Dia 27
  [17, 27, "10:00", "10:30", "S.O.S. Habilidades: Pensamento Crítico", "BrainSpace", "edu"],
  [18, 27, "10:00", "11:00", "Latin Grammy: Uma Janela Para o Mundo", "Soundbeats", "marketing"],
  [19, 27, "10:00", "11:00", "Impacto do Ao Vivo na Audiência e nos Negócios", "Screening Room", "marketing"],
  [20, 27, "10:00", "11:00", "Como Liderar Equipes Que Mesclam Agentes de IA e Humanos?", "House of Brands", "ia"],
  [21, 27, "10:00", "11:00", "Energia que Move o Jogo: Projetos que Transformam Vidas", "SportsON", "games"],
  [22, 27, "10:15", "11:15", "Leitores do Tempo MMXXVI", "Future.U", "edu"],
  [23, 27, "10:15", "11:15", "SAV Apresenta: Construindo a Próxima Década de Crescimento do Audiovisual Brasileiro", "StoryVillage", "marketing"],
  [24, 27, "10:15", "11:15", "SAV Apresenta: Construindo a Próxima Década de Crescimento do Audiovisual Brasileiro", "StoryVillage", "marketing"],
  [25, 27, "10:30", "11:30", "VFX e IA: As Novas Fronteiras", "Bits", "ia"],
  [26, 27, "10:30", "11:30", "Sustentabilidade na Música", "Soundbeats II", "marketing"],
  [27, 27, "10:30", "11:30", "Vestir Uma Ideia: Criação e Mercado na Mesma Direção", "Arts & Crafts", "tech"],
  [28, 27, "11:00", "12:00", "Afinal, o Que É uma Vida Bem Vivida?", "BrainSpace", "edu"],
  [29, 27, "11:15", "12:00", "Política Nacional Aldir Blanc: Fortalecendo a Cultura em Todo Canto do Brasil", "MInC Conecta", "tech"],
  [30, 27, "11:15", "12:15", "Marca, Emoção e Experiência: A Arquitetura do Engajamento", "SportsON", "games"],
  [31, 27, "11:30", "12:15", "Conexões Que Movem o Entretenimento Global — com Tony Archibong do Youtube", "StoryVillage", "marketing"],
  [32, 27, "11:30", "12:30", "Microdramas: Pequenos Formatos, Grandes Negócios", "Screening Room", "marketing"],
  [33, 27, "11:30", "12:30", "Processos Formativos e Construção de Repertório na Era da IA", "Future.U", "ia"],
  [34, 27, "11:30", "12:30", "O Som do Futuro: IA Quântica, Música e Direitos", "Soundbeats", "ia"],
  [35, 27, "11:45", "12:45", "Entre Dados e Desejos: Como a Moda Decodifica o Presente", "Arts & Crafts", "tech"],
  [36, 27, "11:45", "12:45", "Arte, Emoção e Inovação: Por que o Futuro dos Negócios Depende de Formação Humanista", "Soundbeats II", "marketing"],
  [37, 27, "12:00", "13:00", "Screen Brasil: O Cinema Brasileiro pelo Mundo", "Bits", "tech"],
  [38, 27, "12:15", "13:00", "Arranjos Regionais: Como a Cooperação entre Estados está Fortalecendo o Audiovisual Brasileiro", "MInC Conecta", "tech"],
  [39, 27, "12:30", "13:30", "Laboratório dos Sentidos: As Nuances que Escolhemos Observar", "BrainSpace", "edu"],
  [40, 27, "13:15", "14:15", "Olimpíadas de Inverno: Vai Encarar o Brasil Abaixo de Zero?", "SportsON", "games"],
  [41, 27, "13:30", "14:30", "O Brasil no Mapa de Investimento", "Screening Room", "marketing"],
  [42, 27, "13:45", "14:45", "Art Talks for Lunch: Do Muro ao Mundo, com Toz", "Arts & Crafts", "tech"],
  [43, 27, "14:00", "14:45", "Diálogos Entre Brasil e Ruanda Sobre Economia Criativa", "MInC Conecta", "tech"],
  [44, 27, "14:00", "15:00", "Marcas, Dinheiro e Investimentos: Como Construir Confiança na Era dos Agentes de IA", "House of Brands", "ia"],
  [45, 27, "14:00", "15:00", "Inovação e Relevância Que Começam na Escuta", "StoryVillage", "marketing"],
  [46, 27, "14:00", "15:15", "Brasil: de Vizinho Isolado a Epicentro do Mercado Latino", "Soundbeats", "marketing"],
  [47, 27, "14:15", "15:15", "O Aprendiz e as Máquinas Companheiras", "Future.U", "edu"],
  [48, 27, "14:15", "15:15", "O Fenômeno da Indústria do Sertanejo no Brasil", "Soundbeats II", "marketing"],
  [49, 27, "14:30", "15:15", "Admirável Mundo Nuvem: Fluxo de Trabalho Inovador", "Bits", "tech"],
  [50, 27, "14:30", "15:30", "Playbook NFL: Como Se Tornar um Fenômeno da Cultura Pop", "SportsON", "games"],
  [51, 27, "14:30", "15:30", "Recriar O Mundo: As Novas Cartografias Da Cidade", "Arts & Crafts", "tech"],
  [52, 27, "14:45", "15:45", "Ecossistemas: A Transformação de Moscou em Hub Global para o Audiovisual", "Screening Room", "marketing"],
  [53, 27, "15:00", "15:45", "Governança de IA e Direitos de Criação em Contextos Ibero-Americanos", "MInC Conecta", "ia"],
  [54, 27, "15:00", "16:00", "Emoções Reinventadas pela Literatura", "BrainSpace", "edu"],
  [55, 27, "15:15", "16:00", "De Dancinhas à Distribuição: Como TikTok Revolucionou o Ciclo de Vida do Artista", "StoryVillage", "marketing"],
  [56, 27, "15:30", "16:30", "Ascensão de Gêneros Regionais e Misturas Musicais", "Soundbeats", "marketing"],
  [57, 27, "15:30", "16:30", "Liderança, Impacto e Influência Nas Indústrias Criativas", "Future.U", "edu"],
  [58, 27, "15:30", "16:30", "Marca Como Autora Cultural — Funciona Mesmo?", "House of Brands", "marketing"],
  [59, 27, "15:30", "16:30", "O Que Mudou no Modelo de Empresariado no Brasil?", "Soundbeats II", "marketing"],
  [60, 27, "15:45", "16:30", "A Chegada da IA na Pós-Produção", "Bits", "ia"],
  [61, 27, "15:45", "16:45", "Power Play: Vai Encarar o Sportwashing?", "SportsON", "games"],
  [62, 27, "15:45", "16:45", "Potências Criativas — com Pedro Batalha e Hisan Silva", "Arts & Crafts", "tech"],
  [63, 27, "16:00", "16:45", "Explorando Caminhos do Production Service na América Latina", "Screening Room", "marketing"],
  [64, 27, "16:15", "17:00", "O Elo Invisível: A Ciência da Confiança em Tempos de Caos", "BrainSpace", "edu"],
  [65, 27, "16:15", "17:00", "O Jeito Brasileiro de Fazer Rir com Paulo Vieira", "StoryVillage", "marketing"],
  [66, 27, "16:30", "18:00", "Economia Criativa de Base Comunitária: Cultura, Território e Desenvolvimento na Ibero-América", "MInC Conecta", "tech"],
  [67, 27, "16:45", "17:45", "O Som das Imagens: A Era das Experiências Multissensoriais", "Soundbeats", "marketing"],
  [68, 27, "16:45", "17:45", "Encontro de Produtores de Eventos: Bastidores, Resiliência e Complexidade", "Soundbeats II", "marketing"],
  [69, 27, "17:00", "18:00", "Reforma Tributária: Quais os Impactos no Setor Audiovisual", "Screening Room", "marketing"],
  [70, 27, "17:00", "18:00", "Code of Meaning: Novos Códigos, Novas Alfabetizações", "Future.U", "edu"],
  [71, 27, "17:00", "18:00", "IA Como Aliada no Mapeamento de Comportamentos e Comunidades", "House of Brands", "ia"],
  [72, 27, "17:00", "18:00", "Business of Art: Como Funciona o Mercado de Arte no Brasil", "Arts & Crafts", "tech"],
  [73, 27, "17:00", "18:00", "A Nova Economia do Esporte Feminino: Protagonismo, Marcas e Patrocínio", "SportsON", "games"],
  [74, 27, "17:15", "18:00", "A Criação de Novos Mundos: DPA 4 e Outros Universos", "Bits", "tech"],
  [75, 27, "17:15", "18:00", "Xand Avião: Estratégia e Visão de Quem Comanda um Império Milionário na Música", "StoryVillage", "marketing"],
  [76, 27, "17:30", "18:00", "S.O.S. Habilidades: Pensamento Divergente", "BrainSpace", "edu"],
  // Dia 28
  [77,  28, "10:00", "10:30", "S.O.S. Habilidades: Contemplação", "BrainSpace", "edu"],
  [78,  28, "10:00", "11:00", "Coprodução Internacional: Como Formar a Parceria Ideal", "Screening Room", "marketing"],
  [79,  28, "10:00", "11:00", "Como Construir Marcas Globais Fortes sem Perder a Conexão Local?", "House of Brands", "marketing"],
  [80,  28, "10:00", "11:00", "Qual É o Brasil Que o Mundo Escuta?", "Soundbeats", "marketing"],
  [81,  28, "10:00", "11:00", "Audiovisual em Toda Parte: Experiências de Promoção, Formação de Público e Acesso à Produção Brasileira", "MInC Conecta", "tech"],
  [82,  28, "10:15", "11:15", "Acabou o Patrocínio. E Agora?", "Soundbeats II", "marketing"],
  [83,  28, "10:15", "11:15", "Soberania Cognitiva na Era da IA", "Future.U", "ia"],
  [84,  28, "10:30", "11:30", "Reencantar o Mundo: Literatura para Grandes e Pequenos Visionários", "Arts & Crafts", "tech"],
  [85,  28, "10:30", "11:30", "A Dona da Bola: CONMEBOL e o Futuro do Futebol Sul-Americano", "SportsON", "games"],
  [86,  28, "10:30", "11:30", "Conexões Audiovisuais: o Workflow Remoto", "Bits", "tech"],
  [87,  28, "11:00", "12:00", "Astrid Fontenelle: História à Luz dos Afetos", "StoryVillage", "marketing"],
  [88,  28, "11:00", "12:00", "Por Que Nunca Fomos Tão Livres... E Tão Dependentes?", "BrainSpace", "edu"],
  [89,  28, "11:15", "12:00", "Dados, Plataformas e o Valor da Cultura no Século XXI", "MInC Conecta", "tech"],
  [90,  28, "11:30", "12:30", "Entre o Espontâneo e o Estratégico: Direções para Renovação da Audiência", "Screening Room", "marketing"],
  [91,  28, "11:30", "12:30", "O Papel das Indústrias Criativas na Proteção das Infâncias", "Future.U", "edu"],
  [92,  28, "11:30", "12:30", "Os 100 Anos de Tom Jobim e a Bossa-Nova como Identidade Carioca", "Soundbeats II", "marketing"],
  [93,  28, "11:30", "12:30", "Orgulho do Brasil: a Torcida Virando Identidade", "House of Brands", "marketing"],
  [94,  28, "11:30", "12:30", "O que o Algoritmo Não te Mostra e Como as Marcas Estão Usando Isso", "Soundbeats", "ia"],
  [95,  28, "11:45", "12:45", "Lançamento do Mapeamento da Indústria Criativa na Cidade do Rio de Janeiro", "Arts & Crafts", "tech"],
  [96,  28, "12:00", "13:00", "O Impacto da IA no Profissional Audiovisual", "Bits", "ia"],
  [97,  28, "12:15", "13:00", "Acessibilidade no Cinema", "MInC Conecta", "tech"],
  [98,  28, "12:15", "13:15", "Cenários para o Audiovisual Brasileiro em 2030", "StoryVillage", "marketing"],
  [99,  28, "12:30", "13:30", "Laboratório dos Sentidos: O Gosto das Histórias", "BrainSpace", "edu"],
  [100, 28, "13:30", "14:30", "Athleisure, Sportswear e High Fashion: Quando o Esporte Encontra o Luxo", "SportsON", "games"],
  [101, 28, "13:30", "14:30", "Acessibilidade e Inclusão no Entretenimento", "Soundbeats II", "marketing"],
  [102, 28, "13:30", "15:00", "Conversas no Aquário: O Futuro do Trabalho Criativo", "Future.U", "edu"],
  [103, 28, "13:45", "14:15", "Art Talks for Lunch: O Tempo na Construção do Gesto Visual", "Arts & Crafts", "tech"],
  [104, 28, "14:00", "15:00", "Os Expressivos Números do Samba e do Pagode", "Soundbeats", "marketing"],
  [105, 28, "14:00", "15:00", "E o Varejo Segue em Revolução", "House of Brands", "marketing"],
  [106, 28, "14:00", "15:00", "Licenciamentos e Co-produções na Netflix: Formatos para o Cinema Independente", "Screening Room", "marketing"],
  [107, 28, "14:00", "15:00", "Combate à Pirataria", "MInC Conecta", "tech"],
  [108, 28, "14:30", "15:30", "A Concepção de Universos Diegéticos em Cena", "Arts & Crafts", "tech"],
  [109, 28, "14:30", "15:30", "A Narrativa da Composição: Xamã e Ferrugem", "StoryVillage", "marketing"],
  [110, 28, "14:30", "15:30", "A Jornada do Audiovisual Brasileiro: Infraestrutura, Fomento e Futuro da Indústria", "Bits", "tech"],
  [111, 28, "14:45", "15:30", "Movimento e Código: Vai Encarar a Era dos Techno Esportes?", "SportsON", "games"],
  [112, 28, "14:45", "15:45", "As Festas Populares como Fator Acelerador do Business da Música", "Soundbeats II", "marketing"],
  [113, 28, "15:00", "15:45", "Masterclass Quando Tudo Muda: A Arte de Reagir com Clareza", "BrainSpace", "edu"],
  [114, 28, "15:15", "16:15", "Atualização 360º na Música", "Soundbeats", "marketing"],
  [115, 28, "15:15", "16:15", "Polímatas, Multipotenciais, Generalistas: Construindo Carreiras em Mundo em Mutação", "Future.U", "edu"],
  [116, 28, "15:15", "16:15", "Funcines: Apresentação e Debate Sobre os Novos Funcines", "MInC Conecta", "tech"],
  [117, 28, "15:30", "16:30", "Marketing como Alavanca Estratégica (para Outsiders e Especialistas)", "House of Brands", "marketing"],
  [118, 28, "15:30", "16:30", "Cultura em Cena: Impacto, Poder e Futuro da Economia Criativa", "Screening Room", "marketing"],
  [119, 28, "15:45", "16:30", "Lentes 2026: Não é Mais uma Questão de Ótica", "Bits", "tech"],
  [120, 28, "15:45", "16:30", "Histórias do Cinema Brasileiro e o Fôlego Que Nos Move", "StoryVillage", "marketing"],
  [121, 28, "15:45", "16:45", "A Estética da Torcida: Fandom e a Nova Arquibancada", "SportsON", "games"],
  [122, 28, "15:45", "16:45", "IA Generativa e a Criação de Imagens", "Arts & Crafts", "ia"],
  [123, 28, "16:00", "17:00", "Acumuladores de Conteúdo", "BrainSpace", "edu"],
  [124, 28, "16:00", "17:00", "A Tendência dos Festivais no Brasil", "Soundbeats II", "marketing"],
  [125, 28, "16:30", "17:30", "O Retrato da Música Eletrônica no Brasil", "Soundbeats", "marketing"],
  [126, 28, "16:30", "17:30", "Do Backstage ao Palco: a Infraestrutura por Trás da Criatividade", "Future.U", "edu"],
  [127, 28, "16:45", "17:45", "Do Asfalto ao Streaming: Esporte como IP Cultural", "StoryVillage", "marketing"],
  [128, 28, "17:00", "18:00", "O Futuro do Consumo de Conteúdo Esportivo", "SportsON", "games"],
  [129, 28, "17:00", "18:00", "Cocriação e Modelos de Negócios com Marcas no Audiovisual", "Screening Room", "marketing"],
  [130, 28, "17:00", "18:00", "Marketing de Antecipação na Era da Gen AI", "House of Brands", "ia"],
  [131, 28, "17:00", "18:00", "Business of Art: Residências Artísticas", "Arts & Crafts", "tech"],
  [132, 28, "17:15", "18:00", "As Inovações do Vertical", "Bits", "tech"],
  [133, 28, "17:15", "18:00", "Entre o Público e o Possível: Reinventando a Gestão Cultural no Brasil", "Soundbeats II", "marketing"],
  [134, 28, "17:30", "18:00", "S.O.S. Habilidades: Paciência", "BrainSpace", "edu"],
];

export const EVENTS: AppEvent[] = raw.map(([idx, day, start, end, title, room, trilha]) => ({
  idx,
  day,
  start,
  end,
  title,
  room,
  trilha,
  startMin: toMin(start),
  endMin:   toMin(end),
}));
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

Resultado esperado: sem erros.

- [ ] **Commit**

```bash
git add src/data/ src/domain/
git commit -m "feat: static data layer (events, trilhas, routes)"
```

---

## Task 5: Zustand store

**Files:**
- Create: `src/store/useAgendaStore.ts`

- [ ] **Criar `src/store/useAgendaStore.ts`**

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Day, RouteKey } from '../domain/types';

interface AgendaState {
  currentDay: Day;
  hidden:     Set<number>;
  favorites:  Set<number>;
  notes:      Record<number, string>;
  routes:     Record<1 | 2 | 3, Set<number>>;
}

interface AgendaActions {
  setDay:         (day: Day) => void;
  hideEvent:      (idx: number) => void;
  restoreAll:     () => void;
  toggleFavorite: (idx: number) => void;
  setNote:        (idx: number, text: string) => void;
  assignRoute:    (idx: number, route: RouteKey) => void;
}

type AgendaStore = AgendaState & AgendaActions;

const initialState: AgendaState = {
  currentDay: 26,
  hidden:     new Set(),
  favorites:  new Set(),
  notes:      {},
  routes:     { 1: new Set(), 2: new Set(), 3: new Set() },
};

// Serializer customizado para Set (JSON.stringify não suporta Set nativamente)
const storage = createJSONStorage(() => localStorage, {
  reviver: (_key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Set') {
      return new Set(value.values as number[]);
    }
    return value;
  },
  replacer: (_key, value) => {
    if (value instanceof Set) {
      return { __type: 'Set', values: [...value] };
    }
    return value;
  },
});

export const useAgendaStore = create<AgendaStore>()(
  persist(
    (set) => ({
      ...initialState,

      setDay: (day) => set({ currentDay: day }),

      hideEvent: (idx) =>
        set((s) => {
          const hidden = new Set(s.hidden);
          hidden.add(idx);
          const routes = {
            1: new Set(s.routes[1]),
            2: new Set(s.routes[2]),
            3: new Set(s.routes[3]),
          };
          routes[1].delete(idx);
          routes[2].delete(idx);
          routes[3].delete(idx);
          return { hidden, routes };
        }),

      restoreAll: () => set({ hidden: new Set() }),

      toggleFavorite: (idx) =>
        set((s) => {
          const favorites = new Set(s.favorites);
          if (favorites.has(idx)) favorites.delete(idx);
          else favorites.add(idx);
          return { favorites };
        }),

      setNote: (idx, text) =>
        set((s) => {
          const notes = { ...s.notes };
          if (text.trim()) notes[idx] = text;
          else delete notes[idx];
          return { notes };
        }),

      assignRoute: (idx, route) =>
        set((s) => {
          const routes = {
            1: new Set(s.routes[1]),
            2: new Set(s.routes[2]),
            3: new Set(s.routes[3]),
          };
          routes[1].delete(idx);
          routes[2].delete(idx);
          routes[3].delete(idx);
          if (route > 0) routes[route as 1 | 2 | 3].add(idx);
          return { routes };
        }),
    }),
    {
      name: 'rio2c-agenda-v2',
      storage,
    }
  )
);
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

Resultado esperado: sem erros.

- [ ] **Commit**

```bash
git add src/store/
git commit -m "feat: Zustand store with Set-aware localStorage persist"
```

---

## Task 6: Hooks customizados

**Files:**
- Create: `src/hooks/useNowIndicator.ts`
- Create: `src/hooks/useRouteColumns.ts`

- [ ] **Criar `src/hooks/useNowIndicator.ts`**

```typescript
import { useState, useEffect } from 'react';
import type { Day, NowIndicatorData } from '../domain/types';
import { getNowSP, isEventDay, fmt2 } from '../domain/timeUtils';
import { DAY_S, DAY_E, PX } from '../domain/constants';

export function useNowIndicator(currentDay: Day): NowIndicatorData | null {
  const [data, setData] = useState<NowIndicatorData | null>(null);

  useEffect(() => {
    function update() {
      const sp = getNowSP();
      const withinHours = sp.totalMin >= DAY_S && sp.totalMin <= DAY_E;

      if (!isEventDay(sp) || sp.day !== currentDay || !withinHours) {
        setData(null);
        return;
      }

      const nowTop  = (sp.totalMin - DAY_S) * PX;
      const slotMin = Math.floor(sp.totalMin / 30) * 30;
      const slotTop = Math.max((slotMin - DAY_S) * PX, 0);
      const bandH   = Math.min(30 * PX, (DAY_E - slotMin) * PX);

      setData({
        nowTop,
        slotTop,
        bandH,
        timeLabel: `${fmt2(sp.hour)}:${fmt2(sp.minute)}`,
      });
    }

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [currentDay]);

  return data;
}
```

- [ ] **Criar `src/hooks/useRouteColumns.ts`**

```typescript
import { useMemo } from 'react';
import type { Day, RouteColumnData } from '../domain/types';
import { EVENTS } from '../data/events';
import { ROUTE_COLS } from '../data/routes';
import { assignLanes } from '../domain/eventUtils';
import { useAgendaStore } from '../store/useAgendaStore';

export function useRouteColumns(day: Day): RouteColumnData[] {
  const { hidden, routes } = useAgendaStore();

  return useMemo(() => {
    const dayEvents = EVENTS.filter(e => e.day === day && !hidden.has(e.idx));

    return ROUTE_COLS.map(route => {
      const events =
        route.key === 0
          ? dayEvents.filter(
              e => !routes[1].has(e.idx) && !routes[2].has(e.idx) && !routes[3].has(e.idx)
            )
          : dayEvents.filter(e => routes[route.key as 1 | 2 | 3].has(e.idx));

      const { map: laneMap, n: numLanes } = assignLanes(events);
      return { route, events, laneMap, numLanes };
    });
  }, [day, hidden, routes]);
}
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

Resultado esperado: sem erros.

- [ ] **Commit**

```bash
git add src/hooks/
git commit -m "feat: hooks useNowIndicator and useRouteColumns"
```

---

## Task 7: Componentes UI + layout

**Files:**
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/layout/LiveBadge.tsx`
- Create: `src/components/layout/Header.tsx`

- [ ] **Criar `src/components/ui/Badge.tsx`**

```tsx
interface BadgeProps {
  label: string;
  color: string;
  className?: string;
}

export function Badge({ label, color, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${className}`}
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}33`,
      }}
    >
      {label}
    </span>
  );
}
```

- [ ] **Criar `src/components/layout/LiveBadge.tsx`**

```tsx
interface LiveBadgeProps {
  timeLabel: string;
}

export function LiveBadge({ timeLabel }: LiveBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5">
      <span
        className="w-1.5 h-1.5 bg-red-500 rounded-full"
        style={{ animation: 'livepulse 1.4s ease infinite' }}
      />
      {timeLabel} SP
    </span>
  );
}
```

Adicionar ao `src/index.css` (após as diretivas @tailwind):

```css
@keyframes livepulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.75); }
}
```

- [ ] **Criar `src/components/layout/Header.tsx`**

```tsx
import type { Day } from '../../domain/types';
import { TRILHAS } from '../../data/trilhas';
import { useAgendaStore } from '../../store/useAgendaStore';
import { useNowIndicator } from '../../hooks/useNowIndicator';
import { getNowSP, isEventDay } from '../../domain/timeUtils';
import { DAY_S, DAY_E } from '../../domain/constants';
import { LiveBadge } from './LiveBadge';

const DAYS: { day: Day; label: string }[] = [
  { day: 26, label: 'Ter 26/05' },
  { day: 27, label: 'Qua 27/05' },
  { day: 28, label: 'Qui 28/05' },
];

export function Header() {
  const { currentDay, hidden, routes, setDay, restoreAll } = useAgendaStore();
  const nowData = useNowIndicator(currentDay);

  // Contagem de eventos do dia
  const { EVENTS } = require('../../data/events'); // evitar import circular — ver nota abaixo
  const dayTotal = EVENTS.filter((e: { day: number; idx: number }) =>
    e.day === currentDay && !hidden.has(e.idx)
  ).length;
  const inRoutes = [
    ...routes[1], ...routes[2], ...routes[3],
  ].filter((idx: number) => EVENTS.find((e: { idx: number; day: number }) => e.idx === idx && e.day === currentDay)).length;
  const avail = dayTotal - inRoutes;

  // Live badge — mostrar se for dia de evento e dentro do horário
  const sp = getNowSP();
  const showLive = isEventDay(sp) && sp.totalMin >= DAY_S && sp.totalMin <= DAY_E;

  return (
    <header className="bg-[#1a1a2e] text-white px-4 py-3 sticky top-0 z-[200] shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="font-bold text-[15px] tracking-wide whitespace-nowrap">🎯 RIO2C 2026</span>

        {/* Tabs */}
        <div className="flex gap-1.5">
          {DAYS.map(({ day, label }) => (
            <button
              key={day}
              onClick={() => setDay(day)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                currentDay === day
                  ? 'bg-white text-[#1a1a2e]'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {showLive && nowData && <LiveBadge timeLabel={nowData.timeLabel} />}
          <span className="text-[11px] opacity-50">
            {inRoutes > 0 ? `${inRoutes} em rotas · ${avail} livres` : `${dayTotal} eventos`}
          </span>
          {hidden.size > 0 && (
            <button
              onClick={restoreAll}
              className="text-[11px] font-semibold text-white/65 border border-white/25 rounded-xl px-2.5 py-1 hover:bg-white/15 hover:text-white transition-all"
            >
              ↺ Restaurar
            </button>
          )}
        </div>
      </div>

      {/* Legenda trilhas */}
      <div className="flex flex-wrap gap-2.5 mt-2.5">
        {Object.values(TRILHAS).map(cfg => (
          <div key={cfg.label} className="flex items-center gap-1 text-[11px] font-medium opacity-85">
            <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: cfg.color }} />
            <span>{cfg.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
```

> **Nota sobre import circular:** O `require()` inline acima é uma solução temporária. A forma correta é importar `EVENTS` diretamente no topo: `import { EVENTS } from '../../data/events'`. O TypeScript pode emitir alerta de `noUnusedLocals` se os tipos inline forem simplificados — ajustar os tipos de acordo.

Reescrever o Header sem o `require` inline:

```tsx
import type { Day } from '../../domain/types';
import { EVENTS } from '../../data/events';
import { TRILHAS } from '../../data/trilhas';
import { useAgendaStore } from '../../store/useAgendaStore';
import { useNowIndicator } from '../../hooks/useNowIndicator';
import { getNowSP, isEventDay } from '../../domain/timeUtils';
import { DAY_S, DAY_E } from '../../domain/constants';
import { LiveBadge } from './LiveBadge';

const DAYS: { day: Day; label: string }[] = [
  { day: 26, label: 'Ter 26/05' },
  { day: 27, label: 'Qua 27/05' },
  { day: 28, label: 'Qui 28/05' },
];

export function Header() {
  const { currentDay, hidden, routes, setDay, restoreAll } = useAgendaStore();
  const nowData = useNowIndicator(currentDay);

  const dayTotal = EVENTS.filter(e => e.day === currentDay && !hidden.has(e.idx)).length;
  const inRoutes = [...routes[1], ...routes[2], ...routes[3]]
    .filter(idx => EVENTS.some(e => e.idx === idx && e.day === currentDay)).length;
  const avail = dayTotal - inRoutes;

  const sp = getNowSP();
  const showLive = isEventDay(sp) && sp.totalMin >= DAY_S && sp.totalMin <= DAY_E;

  return (
    <header className="bg-[#1a1a2e] text-white px-4 py-3 sticky top-0 z-[200] shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="font-bold text-[15px] tracking-wide whitespace-nowrap">🎯 RIO2C 2026</span>
        <div className="flex gap-1.5">
          {DAYS.map(({ day, label }) => (
            <button
              key={day}
              onClick={() => setDay(day)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                currentDay === day
                  ? 'bg-white text-[#1a1a2e]'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {showLive && nowData && <LiveBadge timeLabel={nowData.timeLabel} />}
          <span className="text-[11px] opacity-50">
            {inRoutes > 0 ? `${inRoutes} em rotas · ${avail} livres` : `${dayTotal} eventos`}
          </span>
          {hidden.size > 0 && (
            <button
              onClick={restoreAll}
              className="text-[11px] font-semibold text-white/65 border border-white/25 rounded-xl px-2.5 py-1 hover:bg-white/15 hover:text-white transition-all"
            >
              ↺ Restaurar
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5 mt-2.5">
        {Object.values(TRILHAS).map(cfg => (
          <div key={cfg.label} className="flex items-center gap-1 text-[11px] font-medium opacity-85">
            <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: cfg.color }} />
            <span>{cfg.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/components/
git commit -m "feat: UI components — Badge, LiveBadge, Header"
```

---

## Task 8: Timeline — TimeAxis e NowIndicator

**Files:**
- Create: `src/components/timeline/TimeAxis.tsx`
- Create: `src/components/timeline/NowIndicator.tsx`

- [ ] **Criar `src/components/timeline/TimeAxis.tsx`**

```tsx
import { DAY_S, DAY_E, PX, HDR_H } from '../../domain/constants';
import type { NowIndicatorData } from '../../domain/types';

interface TimeAxisProps {
  nowData: NowIndicatorData | null;
}

export function TimeAxis({ nowData }: TimeAxisProps) {
  const totalH = (DAY_E - DAY_S) * PX;
  const hours = Array.from({ length: DAY_E / 60 - DAY_S / 60 + 1 }, (_, i) => i + 10);

  return (
    <div
      className="flex-shrink-0 w-[52px] sticky left-0 z-[100] bg-[#f0f2f8]"
      style={{ height: totalH + HDR_H + 8 }}
    >
      {hours.map(h => {
        const top = HDR_H + (h * 60 - DAY_S) * PX;
        return (
          <span key={h}>
            <span
              className="absolute right-2 text-[10px] text-gray-400 whitespace-nowrap tabular-nums -translate-y-1/2"
              style={{ top }}
            >
              {h}:00
            </span>
            {h < 19 && (
              <span
                className="absolute right-2 text-[9px] text-gray-300 whitespace-nowrap tabular-nums -translate-y-1/2"
                style={{ top: top + 30 * PX }}
              >
                {h}:30
              </span>
            )}
          </span>
        );
      })}

      {/* Now tick */}
      {nowData && (
        <span
          className="absolute right-1 text-[9px] font-extrabold text-red-500 bg-white px-0.5 rounded tabular-nums -translate-y-1/2 z-[105] shadow-sm"
          style={{ top: HDR_H + nowData.nowTop }}
        >
          {nowData.timeLabel}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Criar `src/components/timeline/NowIndicator.tsx`**

```tsx
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
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/components/timeline/
git commit -m "feat: timeline TimeAxis and NowIndicator"
```

---

## Task 9: EventCard

**Files:**
- Create: `src/components/timeline/EventCard.tsx`

- [ ] **Criar `src/components/timeline/EventCard.tsx`**

```tsx
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { AppEvent } from '../../domain/types';
import { TRILHAS } from '../../data/trilhas';
import { CARD_W, PX, DAY_S } from '../../domain/constants';
import { getType, cleanTitle } from '../../domain/eventUtils';
import { useAgendaStore } from '../../store/useAgendaStore';

interface EventCardProps {
  event:    AppEvent;
  lane:     number;
  onTap:    (idx: number) => void;
  isDragOverlay?: boolean;
}

export function EventCard({ event, lane, onTap, isDragOverlay = false }: EventCardProps) {
  const { favorites, notes, hideEvent, toggleFavorite } = useAgendaStore();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(event.idx),
  });

  const top    = (event.startMin - DAY_S) * PX;
  const height = Math.max((event.endMin - event.startMin) * PX - 2, 18);
  const left   = lane * CARD_W + 1;
  const width  = CARD_W - 3;

  const trilhaCfg = TRILHAS[event.trilha];
  const isFaved   = favorites.has(event.idx);
  const hasNote   = !!(notes[event.idx]?.trim());
  const type      = getType(event.title);
  const title     = cleanTitle(event.title);

  const style = isDragOverlay
    ? {
        width,
        height,
        borderLeftColor: trilhaCfg.color,
        transform: CSS.Translate.toString(transform),
        opacity: 1,
      }
    : {
        top,
        height,
        left,
        width,
        borderLeftColor: trilhaCfg.color,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.25 : 1,
      };

  const showMeta = height > 36;
  const showRoom = height > 56;

  return (
    <div
      ref={setNodeRef}
      {...(isDragOverlay ? {} : listeners)}
      {...(isDragOverlay ? {} : attributes)}
      className={`${isDragOverlay ? 'relative' : 'absolute'} rounded-[7px] border-l-4 bg-white shadow-sm overflow-hidden touch-none select-none cursor-pointer transition-shadow active:shadow-md ${isFaved ? 'bg-amber-50' : ''}`}
      style={style}
      onClick={() => !isDragging && onTap(event.idx)}
    >
      {/* Botão favorito */}
      <button
        className={`absolute top-0.5 left-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[13px] border-none transition-all ${
          isFaved ? 'text-amber-400 bg-amber-100/70' : 'text-gray-400 bg-black/5'
        } hover:text-amber-400 hover:scale-110`}
        onClick={e => { e.stopPropagation(); toggleFavorite(event.idx); }}
        title="Favoritar"
      >
        ★
      </button>

      {/* Botão remover */}
      <button
        className="absolute top-[3px] right-[3px] w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-gray-500 bg-black/6 border-none transition-all hover:bg-red-100 hover:text-red-600 hover:scale-110 font-mono"
        onClick={e => { e.stopPropagation(); hideEvent(event.idx); }}
        title="Remover"
      >
        ✕
      </button>

      {/* Badge de nota */}
      {hasNote && (
        <div className="absolute bottom-1 right-1 w-2.5 h-3 bg-indigo-500 rounded-[1px] opacity-75 pointer-events-none">
          <div className="absolute top-0 right-0 w-1 h-1 bg-[#f0f2f8] rounded-[0_0_0_2px]" />
          <div className="absolute left-0.5 top-[5px] w-1.5 h-px bg-white/85 shadow-[0_2.5px_0_rgba(255,255,255,0.85)]" />
        </div>
      )}

      {/* Conteúdo */}
      <div className="text-[9px] text-gray-400 mb-px pl-5 pr-4 pt-1 tabular-nums">
        {event.start}–{event.end}
      </div>
      <div className="text-[11px] font-semibold leading-[1.35] text-gray-900 pl-5 pr-4">
        {title}
      </div>
      {showMeta && (
        <div className="flex flex-wrap gap-1 mt-0.5 pl-5 pr-4 items-center">
          <span className="text-[9px] px-1.5 py-px rounded-[3px] font-semibold bg-black/6 text-gray-700">
            {type}
          </span>
          {showRoom && (
            <span className="text-[9px] text-gray-500 truncate max-w-[130px]">
              📍 {event.room}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/components/timeline/EventCard.tsx
git commit -m "feat: EventCard with useDraggable"
```

---

## Task 10: RouteColumn

**Files:**
- Create: `src/components/timeline/RouteColumn.tsx`

- [ ] **Criar `src/components/timeline/RouteColumn.tsx`**

```tsx
import { useDroppable } from '@dnd-kit/core';
import type { RouteColumnData, NowIndicatorData } from '../../domain/types';
import { CARD_W, PX, DAY_S, DAY_E, HDR_H } from '../../domain/constants';
import { EventCard } from './EventCard';
import { NowIndicator } from './NowIndicator';

interface RouteColumnProps {
  data:    RouteColumnData;
  onTap:   (idx: number) => void;
  nowData: NowIndicatorData | null;
  stickyTop: number;
}

export function RouteColumn({ data, onTap, nowData, stickyTop }: RouteColumnProps) {
  const { route, events, laneMap, numLanes } = data;
  const colWidth  = Math.max(numLanes, 1) * CARD_W;
  const totalH    = (DAY_E - DAY_S) * PX;

  const { setNodeRef, isOver } = useDroppable({ id: String(route.key) });

  return (
    <div
      className="flex-none relative flex flex-col rounded-lg transition-all"
      style={{
        width: colWidth,
        outline: isOver ? `2px dashed rgba(99,102,241,0.5)` : 'none',
        outlineOffset: isOver ? '-2px' : '0',
        background: isOver ? 'rgba(99,102,241,0.04)' : 'transparent',
      }}
    >
      {/* Header da coluna */}
      <div
        className="text-center text-[10px] font-extrabold px-1.5 rounded-t-[6px] h-9 flex items-center justify-center tracking-[0.6px] uppercase sticky z-[90] border-b-2"
        style={{
          top:              stickyTop,
          background:       `${route.color}18`,
          color:            route.color,
          borderBottomColor: route.color,
        }}
      >
        {events.length > 0 ? `${route.label} (${events.length})` : route.label}
      </div>

      {/* Body */}
      <div
        ref={setNodeRef}
        className="relative flex-1"
        style={{ height: totalH }}
      >
        {/* Grid lines */}
        {Array.from({ length: DAY_E / 60 - DAY_S / 60 + 1 }, (_, i) => i + 10).map(h => {
          const top = (h * 60 - DAY_S) * PX;
          return (
            <span key={h}>
              <div className="absolute left-0 right-0 border-t border-[#dde1ea]" style={{ top }} />
              {h < 19 && (
                <div className="absolute left-0 right-0 border-t border-dashed border-[#eaedf3]" style={{ top: top + 30 * PX }} />
              )}
            </span>
          );
        })}

        {/* Placeholder quando coluna está vazia */}
        {events.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] text-gray-300 text-center leading-relaxed w-[130px] pointer-events-none select-none">
            {route.key === 0 ? 'Todos os eventos\ndistribuídos ✓' : 'Segure e arraste\neventos para cá'}
          </div>
        )}

        {/* Now indicator */}
        {nowData && <NowIndicator data={nowData} />}

        {/* Cards */}
        {events.map(e => (
          <EventCard
            key={e.idx}
            event={e}
            lane={laneMap[e.idx] ?? 0}
            onTap={onTap}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/components/timeline/RouteColumn.tsx
git commit -m "feat: RouteColumn with useDroppable and NowIndicator"
```

---

## Task 11a: MobileEventCard

**Files:**
- Create: `src/components/mobile/MobileEventCard.tsx`

Layout do card mobile conforme design "Monochrome Logic": fundo branco, borda 1px `#E2E8F0`, borda esquerda **2px** colorida pela trilha, trilha label colorida uppercase, título bold, localização à direita, duração em minutos.

- [ ] **Criar `src/components/mobile/MobileEventCard.tsx`**

```tsx
import type { AppEvent } from '../../domain/types';
import { TRILHAS } from '../../data/trilhas';
import { useAgendaStore } from '../../store/useAgendaStore';
import { getType, cleanTitle } from '../../domain/eventUtils';

interface MobileEventCardProps {
  event:  AppEvent;
  onTap:  (idx: number) => void;
}

export function MobileEventCard({ event, onTap }: MobileEventCardProps) {
  const { favorites, notes, hideEvent, toggleFavorite } = useAgendaStore();

  const trilhaCfg = TRILHAS[event.trilha];
  const isFaved   = favorites.has(event.idx);
  const hasNote   = !!(notes[event.idx]?.trim());
  const type      = getType(event.title);
  const title     = cleanTitle(event.title);
  const durationMin = event.endMin - event.startMin;

  return (
    <div
      className="relative bg-white border border-[#E2E8F0] rounded-2xl shadow-card active:shadow-card-hover transition-shadow cursor-pointer overflow-hidden"
      style={{ borderLeftWidth: 2, borderLeftColor: trilhaCfg.color }}
      onClick={() => onTap(event.idx)}
    >
      {/* Linha superior: trilha label + localização */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.05em]"
          style={{ color: trilhaCfg.color }}
        >
          {trilhaCfg.label.replace(/^[^\w]+/, '')}
        </span>
        <span className="text-[10px] text-[#78767b] flex items-center gap-1 truncate max-w-[140px]">
          📍 {event.room}
        </span>
      </div>

      {/* Título */}
      <div className="px-3 pb-1 text-[14px] font-semibold leading-snug text-[#191c1e]">
        {title}
      </div>

      {/* Rodapé: tipo + duração + favorito + nota */}
      <div className="flex items-center justify-between px-3 pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] bg-[#eceef0] text-[#47464b] px-2 py-0.5 rounded-full font-medium">
            {type}
          </span>
          <span className="text-[10px] text-[#78767b] tabular-nums">
            {durationMin} min
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasNote && (
            <span className="text-[10px] text-indigo-400">●</span>
          )}
          <button
            className={`text-[16px] leading-none border-none bg-transparent transition-colors ${
              isFaved ? 'text-[#191c1e]' : 'text-[#c8c5cb]'
            } hover:text-[#191c1e]`}
            onClick={e => { e.stopPropagation(); toggleFavorite(event.idx); }}
            title="Favoritar"
          >
            ★
          </button>
          <button
            className="text-[11px] text-[#c8c5cb] hover:text-[#ba1a1a] transition-colors border-none bg-transparent"
            onClick={e => { e.stopPropagation(); hideEvent(event.idx); }}
            title="Remover"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/components/mobile/MobileEventCard.tsx
git commit -m "feat: MobileEventCard — design Monochrome Logic"
```

---

## Task 11b: MobileTimeline

**Files:**
- Create: `src/components/mobile/MobileTimeline.tsx`

Layout vertical conforme screenshot do design: eixo de tempo à esquerda (64px), linha vertical cinza, cards à direita agrupados por horário. Route filter pills no topo. Now indicator como linha horizontal vermelha sobre o eixo.

- [ ] **Criar `src/components/mobile/MobileTimeline.tsx`**

```tsx
import type { Day, MobileRouteFilter } from '../../domain/types';
import { EVENTS } from '../../data/events';
import { ROUTE_COLS } from '../../data/routes';
import { useAgendaStore } from '../../store/useAgendaStore';
import { useNowIndicator } from '../../hooks/useNowIndicator';
import { groupEventsByTime, cleanTitle } from '../../domain/eventUtils';
import { DAY_S, PX } from '../../domain/constants';
import { MobileEventCard } from './MobileEventCard';

interface MobileTimelineProps {
  mobileFilter:    MobileRouteFilter;
  onFilterChange:  (f: MobileRouteFilter) => void;
  onTapEvent:      (idx: number) => void;
}

export function MobileTimeline({ mobileFilter, onFilterChange, onTapEvent }: MobileTimelineProps) {
  const { currentDay, hidden, routes } = useAgendaStore();
  const nowData = useNowIndicator(currentDay as Day);

  // Filtrar eventos do dia
  const dayEvents = EVENTS.filter(e => e.day === currentDay && !hidden.has(e.idx));

  // Aplicar filtro de rota
  const filtered =
    mobileFilter === 'all'
      ? dayEvents
      : dayEvents.filter(e => routes[mobileFilter].has(e.idx));

  const groups = groupEventsByTime(filtered);

  const ROUTE_FILTERS: { key: MobileRouteFilter; label: string }[] = [
    { key: 'all', label: 'Todas as Rotas' },
    { key: 1,     label: 'Rota 1' },
    { key: 2,     label: 'Rota 2' },
    { key: 3,     label: 'Rota 3' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Route filter pills */}
      <div className="sticky top-[72px] z-[150] bg-surface/80 backdrop-blur-[8px] border-b border-[#eceef0] px-4 py-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#78767b] mb-1.5">
          Rotas
        </p>
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {ROUTE_FILTERS.map(f => (
            <button
              key={String(f.key)}
              onClick={() => onFilterChange(f.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                mobileFilter === f.key
                  ? 'bg-[#191c1e] text-white border-[#191c1e]'
                  : 'bg-white text-[#47464b] border-[#c8c5cb] hover:border-[#78767b]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="flex-1 px-0 py-4">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#78767b] text-sm gap-3">
            <span>Nenhum evento nesta rota.</span>
            {mobileFilter !== 'all' && (
              <button
                onClick={() => onFilterChange('all')}
                className="px-4 py-2 bg-[#191c1e] text-white rounded-lg text-[13px] font-semibold"
              >
                Ver todas as rotas
              </button>
            )}
          </div>
        ) : (
          groups.map(group => (
            <div key={group.time} className="flex gap-0 mb-6">
              {/* Eixo de tempo — 64px */}
              <div className="w-16 flex-shrink-0 flex flex-col items-end pr-3 pt-1">
                <span className="text-[14px] font-semibold text-[#191c1e] tabular-nums">
                  {group.time}
                </span>
                <span className="text-[11px] text-[#78767b] tabular-nums">
                  {group.events[0].endMin - group.events[0].startMin} min
                </span>
              </div>

              {/* Linha vertical + conteúdo */}
              <div className="flex gap-3 flex-1 relative">
                {/* Linha vertical */}
                <div className="w-px bg-[#E2E8F0] self-stretch mx-0" />

                {/* Cards */}
                <div className="flex flex-col gap-2 flex-1 min-w-0 pr-4">
                  {group.events.map(e => (
                    <MobileEventCard key={e.idx} event={e} onTap={onTapEvent} />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/components/mobile/
git commit -m "feat: MobileTimeline — layout vertical com route filter e now indicator"
```

---

## Task 11: Timeline (DndContext + DragOverlay)

**Files:**
- Create: `src/components/timeline/Timeline.tsx`

- [ ] **Criar `src/components/timeline/Timeline.tsx`**

```tsx
import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import type { Day, RouteKey, AppEvent } from '../../domain/types';
import { EVENTS } from '../../data/events';
import { CARD_W } from '../../domain/constants';
import { useAgendaStore } from '../../store/useAgendaStore';
import { useRouteColumns } from '../../hooks/useRouteColumns';
import { useNowIndicator } from '../../hooks/useNowIndicator';
import { TimeAxis } from './TimeAxis';
import { RouteColumn } from './RouteColumn';
import { EventCard } from './EventCard';

// Altura do header sticky da página (header do app)
const STICKY_TOP = 96;

interface TimelineProps {
  onTapEvent: (idx: number) => void;
}

export function Timeline({ onTapEvent }: TimelineProps) {
  const { currentDay, assignRoute } = useAgendaStore();
  const columns  = useRouteColumns(currentDay as Day);
  const nowData  = useNowIndicator(currentDay as Day);

  const [activeEvent, setActiveEvent] = useState<AppEvent | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    })
  );

  function handleDragStart({ active }: DragStartEvent) {
    const idx = parseInt(active.id as string, 10);
    const ev = EVENTS.find(e => e.idx === idx) ?? null;
    setActiveEvent(ev);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveEvent(null);
    if (!over) return;
    const idx      = parseInt(active.id as string, 10);
    const routeKey = parseInt(over.id as string, 10) as RouteKey;
    assignRoute(idx, routeKey);
  }

  const isEmpty = columns.every(c => c.events.length === 0);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
        Nenhum evento para exibir.
        <button
          className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg text-[13px] font-semibold"
          onClick={() => useAgendaStore.getState().restoreAll()}
        >
          ↺ Restaurar todos
        </button>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex pb-10 overflow-x-auto min-h-[calc(100vh-96px)]">
        <TimeAxis nowData={nowData} />
        <div className="flex gap-4 px-4 flex-1 items-start">
          {columns.map(col => (
            <RouteColumn
              key={col.route.key}
              data={col}
              onTap={onTapEvent}
              nowData={nowData}
              stickyTop={STICKY_TOP}
            />
          ))}
        </div>
      </div>

      {/* Ghost card durante o drag */}
      <DragOverlay>
        {activeEvent && (
          <div style={{ width: CARD_W - 3 }}>
            <EventCard
              event={activeEvent}
              lane={0}
              onTap={() => {}}
              isDragOverlay
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/components/timeline/Timeline.tsx
git commit -m "feat: Timeline with DndContext, DragOverlay, and sensors"
```

---

## Task 12: EventModal

**Files:**
- Create: `src/components/modal/EventModal.tsx`

- [ ] **Criar `src/components/modal/EventModal.tsx`**

```tsx
import { useEffect } from 'react';
import type { AppEvent, RouteKey } from '../../domain/types';
import { TRILHAS } from '../../data/trilhas';
import { ROUTE_COLORS, ROUTE_LABELS } from '../../data/routes';
import { useAgendaStore } from '../../store/useAgendaStore';
import { getType, cleanTitle } from '../../domain/eventUtils';
import { Badge } from '../ui/Badge';

interface EventModalProps {
  event:   AppEvent;
  onClose: () => void;
}

function getRouteKey(routes: Record<1|2|3, Set<number>>, idx: number): RouteKey {
  if (routes[1].has(idx)) return 1;
  if (routes[2].has(idx)) return 2;
  if (routes[3].has(idx)) return 3;
  return 0;
}

export function EventModal({ event, onClose }: EventModalProps) {
  const { favorites, notes, routes, hideEvent, toggleFavorite, setNote, assignRoute } =
    useAgendaStore();

  const isFaved    = favorites.has(event.idx);
  const note       = notes[event.idx] ?? '';
  const currentRoute = getRouteKey(routes, event.idx);
  const trilhaCfg  = TRILHAS[event.trilha];
  const type       = getType(event.title);
  const title      = cleanTitle(event.title);

  // Fechar no Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleRemove() {
    hideEvent(event.idx);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/55 z-[500] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[440px] max-h-[88vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <Badge label={trilhaCfg.label} color={trilhaCfg.color} />
          <button
            onClick={onClose}
            className="ml-auto w-[26px] h-[26px] rounded-full bg-gray-100 flex items-center justify-center text-[12px] text-gray-500 hover:bg-red-100 hover:text-red-600 transition-all border-none"
          >
            ✕
          </button>
        </div>

        {/* Corpo */}
        <div className="px-4 py-3.5">
          <div className="text-[15px] font-bold text-gray-900 leading-snug mb-2.5">{title}</div>

          {/* Meta */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
              🕐 {event.start} – {event.end}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
              📍 {event.room}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
              {type}
            </span>
          </div>

          {/* Rotas */}
          <div className="flex gap-1.5 mb-3">
            {([0, 1, 2, 3] as RouteKey[]).map(k => (
              <button
                key={k}
                onClick={() => assignRoute(event.idx, k)}
                className="flex-1 py-1.5 px-1 border-[1.5px] rounded-[7px] text-[10px] font-bold text-center leading-tight cursor-pointer transition-all"
                style={
                  currentRoute === k
                    ? { background: ROUTE_COLORS[k], borderColor: ROUTE_COLORS[k], color: '#fff' }
                    : { background: '#fff', borderColor: '#e5e7eb', color: '#6b7280' }
                }
              >
                {ROUTE_LABELS[k]}
              </button>
            ))}
          </div>

          {/* Ações */}
          <div className="flex gap-2 mb-3.5">
            <button
              onClick={() => toggleFavorite(event.idx)}
              className={`flex-1 py-2.5 rounded-lg text-[12px] font-semibold border-none transition-all ${
                isFaved
                  ? 'bg-amber-400 text-white'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              {isFaved ? '★ Favoritado' : '☆ Favoritar'}
            </button>
            <button
              onClick={handleRemove}
              className="flex-1 py-2.5 bg-red-100 text-red-900 hover:bg-red-200 rounded-lg text-[12px] font-semibold border-none transition-all"
            >
              ✕ Remover
            </button>
          </div>

          {/* Notas */}
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
            Notas
          </label>
          <textarea
            value={note}
            onChange={e => setNote(event.idx, e.target.value)}
            placeholder="Anote algo sobre este painel..."
            className="w-full px-3 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-[inherit] resize-y min-h-[80px] outline-none focus:border-indigo-400 text-gray-900 placeholder:text-gray-300 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/components/modal/
git commit -m "feat: EventModal with routes, notes, favorite, remove"
```

---

## Task 13: App.tsx — wiring final responsivo

**Files:**
- Modify: `src/App.tsx`

- [ ] **Reescrever `src/App.tsx` completo**

```tsx
import { useState, useEffect } from 'react';
import type { AppEvent, MobileRouteFilter } from './domain/types';
import { EVENTS } from './data/events';
import { useAgendaStore } from './store/useAgendaStore';
import { Header } from './components/layout/Header';
import { Timeline } from './components/timeline/Timeline';
import { MobileTimeline } from './components/mobile/MobileTimeline';
import { EventModal } from './components/modal/EventModal';

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export default function App() {
  const [modalEvent, setModalEvent] = useState<AppEvent | null>(null);
  const [mobileFilter, setMobileFilter] = useState<MobileRouteFilter>('all');
  const { hidden } = useAgendaStore();
  const isMobile = useIsMobile();

  function openModal(idx: number) {
    if (hidden.has(idx)) return;
    const ev = EVENTS.find(e => e.idx === idx) ?? null;
    setModalEvent(ev);
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      <Header />
      {isMobile ? (
        <MobileTimeline
          mobileFilter={mobileFilter}
          onFilterChange={setMobileFilter}
          onTapEvent={openModal}
        />
      ) : (
        <Timeline onTapEvent={openModal} />
      )}
      {modalEvent && (
        <EventModal event={modalEvent} onClose={() => setModalEvent(null)} />
      )}
    </div>
  );
}
```

- [ ] **Rodar dev server e verificar visualmente**

```bash
npm run dev
```

Verificar:
- [ ] Header com logo, tabs e legenda de trilhas aparece
- [ ] 4 colunas de rota renderizadas
- [ ] Cards aparecem nas posições corretas
- [ ] Tap em card abre o modal
- [ ] Modal exibe título, meta, rotas, favorito, notas
- [ ] Remover evento funciona
- [ ] Trocar de dia nas tabs funciona
- [ ] Drag entre colunas funciona (hold 180ms → arrastar → soltar)
- [ ] Estado persiste ao recarregar a página

- [ ] **Build de produção sem erros**

```bash
npm run build
```

Resultado esperado: pasta `dist/` criada sem erros de TypeScript ou Vite.

- [ ] **Commit**

```bash
git add src/App.tsx
git commit -m "feat: App.tsx — wiring completo da aplicação React"
```

---

## Task 14: GitHub Actions — atualizar workflow de deploy

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Reescrever `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Commit e push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: atualizar deploy para build Vite + dist/"
git push origin main
```

- [ ] **Verificar deploy no GitHub Actions**

Acessar `https://github.com/BryamFLA/rio2c-agenda/actions` e confirmar que o job completa com sucesso.

- [ ] **Verificar app em produção**

Acessar `https://bryamfla.github.io/rio2c-agenda/` e confirmar que a versão React está no ar.

---

## Self-Review

**Cobertura da spec + design system:**
- ✅ Timeline horizontal com eixo de horários (desktop)
- ✅ Layout vertical mobile com time-axis 64px (Task 11a/11b)
- ✅ Route filter pills no mobile (Task 11b)
- ✅ 4 colunas de rotas (Rota 1, 2, 3, Disponíveis) no desktop
- ✅ Cards com trilha, favorito, badge de nota, remoção
- ✅ Design "Monochrome Logic": Inter, `#f7f9fb` bg, white cards, 1px border, 2px strip
- ✅ Cores das trilhas atualizadas (Task 4 + tailwind.config)
- ✅ Header glassmorphism backdrop-blur
- ✅ Modal frosted glass overlay
- ✅ Drag and drop via @dnd-kit (desktop)
- ✅ Indicador de horário atual (SP)
- ✅ Persistência localStorage via Zustand persist
- ✅ Legenda de trilhas no header
- ✅ Tabs por dia
- ✅ Botão restaurar todos
- ✅ Deploy GitHub Pages atualizado

**Tipos consistentes entre tasks:**
- `AppEvent` definido em Task 2, usado em Tasks 9–13 ✅
- `MobileRouteFilter` definido em Task 2, usado em Tasks 11b e 13 ✅
- `TimeGroup` definido em Task 2, usado em Task 11b ✅
- `RouteColumnData` definido em Task 2, usado em Tasks 6, 10 ✅
- `NowIndicatorData` definido em Task 2, usado em Tasks 6, 8, 10, 11 ✅
- `assignRoute(idx, RouteKey)` no store (Task 5), chamado em Timeline (Task 11) e Modal (Task 12) ✅
- `groupEventsByTime` definido em Task 3, usado em Task 11b ✅
- `CARD_W`, `PX`, `DAY_S`, `DAY_E` em constants (Task 2), usados em Tasks 9–11 ✅
- Tailwind tokens (`bg-surface`, `text-on-surface`, `font-sans`) configurados na Task 1, usados em Tasks 7–13 ✅
