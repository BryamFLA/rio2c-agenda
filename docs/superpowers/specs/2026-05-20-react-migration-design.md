# Design Spec — Migração para React

**Data:** 2026-05-20  
**Projeto:** rio2c-agenda  
**Status:** Aprovado

---

## Contexto

O app `rio2c-agenda` é uma agenda interativa para o evento RIO2C 2026 (26–28/05), atualmente implementada como um único `index.html` de 47KB com JavaScript vanilla. O objetivo desta migração é transportar a aplicação para uma stack React moderna e limpa, mantendo toda a lógica de negócio existente.

**Stack escolhida:**
- React 18 + TypeScript
- Vite (bundler)
- Tailwind CSS (estilização)
- Zustand (estado global + persistência)
- @dnd-kit/core (drag and drop)
- Deploy: GitHub Pages (mantido)

---

## Funcionalidades a preservar (escopo fechado)

1. Timeline horizontal com eixo de horários (10h–19h, 1,5px/min)
2. 4 colunas de rotas: Rota 1, Rota 2, Rota 3, Disponíveis
3. Cards de evento: cor da trilha, favorito (estrela), badge de nota, remoção
4. Modal de evento: detalhes, atribuição de rota, favorito, notas, remover
5. Drag and drop entre colunas (corrigido via @dnd-kit)
6. Indicador de horário atual (timezone América/São_Paulo)
7. Persistência em localStorage: ocultos, favoritos, notas, rotas
8. Legenda de trilhas no header
9. Tabs por dia (26, 27, 28)
10. Botão "Restaurar todos"

---

## Estrutura de Pastas

```
rio2c-agenda/
├── src/
│   ├── data/
│   │   ├── events.ts          # Event[] — 135 eventos dos 3 dias
│   │   ├── trilhas.ts         # Record<TrilhaKey, TrilhaConfig>
│   │   └── routes.ts          # ROUTE_COLS, ROUTE_COLORS, ROUTE_LABELS
│   │
│   ├── domain/
│   │   ├── types.ts           # interfaces: Event, TrilhaConfig, RouteCol, etc.
│   │   ├── eventUtils.ts      # toMin, getType, assignLanes (puras, testáveis)
│   │   └── timeUtils.ts       # getNowSP, isEventDay (puras, testáveis)
│   │
│   ├── store/
│   │   └── useAgendaStore.ts  # Zustand store com persist middleware
│   │
│   ├── hooks/
│   │   ├── useNowIndicator.ts # polling 60s → retorna { nowTop, slotTop, bandH, nowSP }
│   │   └── useRouteColumns.ts # deriva RouteColumnData[] do store para o render
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── LiveBadge.tsx
│   │   ├── timeline/
│   │   │   ├── Timeline.tsx       # container DndContext + scroll
│   │   │   ├── TimeAxis.tsx       # eixo sticky esquerdo
│   │   │   ├── RouteColumn.tsx    # useDroppable + cards
│   │   │   ├── EventCard.tsx      # useDraggable + interações
│   │   │   └── NowIndicator.tsx   # faixa âmbar + linha vermelha
│   │   ├── modal/
│   │   │   └── EventModal.tsx
│   │   └── ui/
│   │       └── Badge.tsx
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html                 # root do Vite
├── vite.config.ts             # base: '/rio2c-agenda/'
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Regras de dependência entre camadas

| Camada | Pode importar de |
|--------|-----------------|
| `data/` | nada interno |
| `domain/` | `data/` apenas |
| `store/` | `domain/`, `data/` |
| `hooks/` | `store/`, `domain/` |
| `components/` | `hooks/`, `store/`, `domain/`, `data/`, `ui/` |

---

## Tipos principais (`domain/types.ts`)

```typescript
export type TrilhaKey = 'games' | 'creator' | 'ia' | 'tech' | 'marketing' | 'edu';
export type RouteKey  = 0 | 1 | 2 | 3;
export type Day       = 26 | 27 | 28;

export interface AppEvent {
  idx:      number;
  day:      Day;
  start:    string;   // "HH:MM"
  end:      string;
  title:    string;
  room:     string;
  trilha:   TrilhaKey;
  startMin: number;   // derivado
  endMin:   number;   // derivado
  type:     string;   // derivado por getType()
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
```

---

## Store Zustand (`store/useAgendaStore.ts`)

```typescript
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
```

**Persistência:** middleware `persist` do Zustand com serializer customizado para `Set`
(serializa como `number[]`, desserializa como `new Set(arr)`).

---

## Drag and Drop (`@dnd-kit/core`)

- `<DndContext>` com `PointerSensor` configurado:
  ```typescript
  activationConstraint: { delay: 180, tolerance: 8 }
  ```
- `useDraggable({ id: String(idx) })` em cada `<EventCard>`
- `useDroppable({ id: String(routeKey) })` em cada `<RouteColumn>`
- `<DragOverlay>` renderiza o ghost card durante o drag
- `onDragEnd`: extrai `active.id` (idx) e `over.id` (routeKey), chama `assignRoute`

---

## Indicador de horário atual

- Hook `useNowIndicator(currentDay)` faz polling via `setInterval(60_000)`
- Retorna `null` se não for dia de evento ou fora do horário
- Retorna `{ nowTop, slotTop, bandH }` em pixels para o `NowIndicator.tsx`
- `NowIndicator` é renderizado dentro de cada `RouteColumn`

---

## Deploy (GitHub Actions)

O workflow existente em `.github/` será atualizado para:
1. `npm ci`
2. `npm run build`
3. Deploy da pasta `dist/` para GitHub Pages

O `index.html` da raiz será removido — substituído pelo `dist/` gerado pelo Vite.

---

## O que NÃO está no escopo

- Nenhuma feature nova além das já existentes no HTML atual
- Sem backend, API ou autenticação
- Sem roteamento (app é single-page, sem URLs por dia/evento)
- Sem testes automatizados nesta iteração
