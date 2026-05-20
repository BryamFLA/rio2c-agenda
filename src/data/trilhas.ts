import type { TrilhaKey, TrilhaConfig } from '../domain/types';

export const TRILHAS: Record<TrilhaKey, TrilhaConfig> = {
  games:     { label: '🎮 Games & eSports',      color: '#6366F1' },
  creator:   { label: '💡 Creator Economy',      color: '#F59E0B' },
  ia:        { label: '🤖 Tecnologia & IA',      color: '#0EA5E9' },
  tech:      { label: '💻 Tech & Produção',      color: '#10B981' },
  marketing: { label: '📣 Marketing & Marcas',   color: '#EC4899' },
  edu:       { label: '🎓 Educação & Carreira',  color: '#8B5CF6' },
};
