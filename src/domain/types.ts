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
