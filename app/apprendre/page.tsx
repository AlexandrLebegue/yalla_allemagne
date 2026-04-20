import { getAllDecks } from '@/lib/flashcards';
import ApprendrePageClient from '@/components/apprendre/ApprendrePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apprendre l\'allemand — Flashcards | Yalla Allemagne',
  description:
    'Révise le vocabulaire allemand avec des flashcards style Tinder. Vocabulaire dentaire, phrases du cabinet et plus.',
};

export default function ApprendrePage() {
  const decks = getAllDecks();
  return <ApprendrePageClient decks={decks} />;
}
