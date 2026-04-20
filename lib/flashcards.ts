import fs from 'fs';
import path from 'path';
import type { CardDeck } from '@/models/Flashcard';

const CARDS_DIR = path.join(process.cwd(), 'data', 'cards');

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
