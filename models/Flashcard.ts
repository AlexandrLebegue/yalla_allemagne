export type SwipeResult = 'known' | 'unknown';

export interface FlashCard {
  id: string;
  front: string;
  back: string;
  phonetic?: string;
  example?: string;
  exampleTranslation?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface CardDeck {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  cards: FlashCard[];
}

export interface DeckProgress {
  deckId: string;
  knownIds: string[];
  unknownIds: string[];
  completedAt: string | null;
  totalSessions: number;
}
