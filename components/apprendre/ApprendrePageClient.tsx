'use client';

import { useState } from 'react';
import type { CardDeck, SwipeResult } from '@/models/Flashcard';
import DeckSelector from './DeckSelector';
import SwipeArena from './SwipeArena';
import SessionResults from './SessionResults';

type AppView = 'select' | 'swipe' | 'results';

interface Props {
  decks: CardDeck[];
}

export default function ApprendrePageClient({ decks }: Props) {
  const [view, setView] = useState<AppView>('select');
  const [activeDeck, setActiveDeck] = useState<CardDeck | null>(null);
  const [sessionResults, setSessionResults] = useState<Record<string, SwipeResult>>({});
  const [unknownOnly, setUnknownOnly] = useState(false);

  const handleSelectDeck = (deck: CardDeck) => {
    setActiveDeck(deck);
    setSessionResults({});
    setUnknownOnly(false);
    setView('swipe');
  };

  const handleComplete = (results: Record<string, SwipeResult>) => {
    setSessionResults(results);
    setView('results');
  };

  const handleRestartUnknown = () => {
    setSessionResults({});
    setUnknownOnly(true);
    setView('swipe');
  };

  const handleRestartAll = () => {
    setSessionResults({});
    setUnknownOnly(false);
    setView('swipe');
  };

  const handleBackToSelect = () => {
    setActiveDeck(null);
    setSessionResults({});
    setUnknownOnly(false);
    setView('select');
  };

  return (
    <main className="min-h-screen bg-off-white">
      {view === 'select' && (
        <DeckSelector decks={decks} onSelectDeck={handleSelectDeck} />
      )}

      {view === 'swipe' && activeDeck && (
        <SwipeArena
          deck={activeDeck}
          unknownOnly={unknownOnly}
          previousResults={unknownOnly ? sessionResults : {}}
          onComplete={handleComplete}
          onExit={handleBackToSelect}
        />
      )}

      {view === 'results' && activeDeck && (
        <SessionResults
          deck={activeDeck}
          results={sessionResults}
          onRestartUnknown={handleRestartUnknown}
          onRestartAll={handleRestartAll}
          onBackToSelect={handleBackToSelect}
        />
      )}
    </main>
  );
}
