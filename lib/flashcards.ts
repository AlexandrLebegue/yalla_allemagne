import fs from 'fs';
import path from 'path';
import type { CardDeck, DeckProgress } from '@/models/Flashcard';

const CARDS_DIR = path.join(process.cwd(), 'data', 'cards');

// ── Server-side (used in Server Components only) ──────────────────────────────

export function getAllDecks(): CardDeck[] {
  const files = fs.readdirSync(CARDS_DIR).filter((f) => f.endsWith('.json'));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(CARDS_DIR, file), 'utf-8');
    return JSON.parse(raw) as CardDeck;
  });
}

export function getDeckById(id: string): CardDeck | null {
  const filePath = path.join(CARDS_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as CardDeck;
}

// ── Client-side (localStorage helpers — call only in useEffect / handlers) ───

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
