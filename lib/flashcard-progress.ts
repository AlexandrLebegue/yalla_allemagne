import type { DeckProgress } from '@/models/Flashcard';

const STORAGE_KEY = (deckId: string) => `yalla_apprendre_progress_${deckId}`;

export function getProgress(deckId: string): DeckProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(deckId));
    return raw ? (JSON.parse(raw) as DeckProgress) : null;
  } catch {
    return null;
  }
}

export function saveProgress(deckId: string, progress: DeckProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY(deckId), JSON.stringify(progress));
  } catch {
    // ignore storage errors (private mode, full storage, etc.)
  }
}

export function clearProgress(deckId: string): void {
  try {
    localStorage.removeItem(STORAGE_KEY(deckId));
  } catch {
    // ignore
  }
}
