'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck, FaArrowLeft } from 'react-icons/fa';
import type { CardDeck, SwipeResult } from '@/models/Flashcard';
import FlashCard from './FlashCard';

interface Props {
  deck: CardDeck;
  unknownOnly: boolean;
  previousResults: Record<string, SwipeResult>;
  onComplete: (results: Record<string, SwipeResult>) => void;
  onExit: () => void;
}

const STACK_SIZE = 3;

export default function SwipeArena({ deck, unknownOnly, previousResults, onComplete, onExit }: Props) {
  const cards = useMemo(() => {
    if (unknownOnly) {
      return deck.cards.filter((c) => previousResults[c.id] === 'unknown');
    }
    return deck.cards;
  }, [deck.cards, unknownOnly, previousResults]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<string, SwipeResult>>({});

  const handleSwipe = (result: SwipeResult) => {
    const card = cards[currentIndex];
    const newResults = { ...results, [card.id]: result };
    setResults(newResults);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= cards.length) {
      onComplete(newResults);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const progressPct = cards.length > 0 ? Math.round((currentIndex / cards.length) * 100) : 0;
  const remaining = cards.length - currentIndex;
  const visibleCards = cards.slice(currentIndex, currentIndex + STACK_SIZE);

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center px-4">
        <p className="text-2xl font-heading font-bold text-text-dark">Aucune carte à réviser !</p>
        <p className="text-text-gray">Tu connais déjà toutes les cartes de ce deck.</p>
        <button className="btn btn-primary" onClick={onExit}>
          Retour aux decks
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-3">
        <div className="container flex items-center justify-between">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-text-gray hover:text-accent transition-colors text-sm"
          >
            <FaArrowLeft /> Quitter
          </button>
          <div className="text-center">
            <span className="text-sm font-medium text-text-dark">
              {deck.emoji} {deck.title}
            </span>
            {unknownOnly && (
              <span className="ml-2 text-xs text-accent font-medium">— Révision</span>
            )}
          </div>
          <span className="text-sm text-text-gray">{currentIndex + 1} / {cards.length}</span>
        </div>

        {/* Progress bar */}
        <div className="container mt-2">
          <div className="h-1.5 bg-light-gray rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="relative flex items-center justify-center" style={{ height: '30rem' }}>
          <AnimatePresence mode="popLayout">
            {visibleCards.map((card, offset) => (
              <FlashCard
                key={card.id}
                card={card}
                isTop={offset === 0}
                stackOffset={offset}
                onSwipe={handleSwipe}
              />
            ))}
          </AnimatePresence>

          {remaining === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-text-gray text-center"
            >
              Toutes les cartes ont été vues !
            </motion.p>
          )}
        </div>

        {/* Manual swipe buttons */}
        <div className="flex items-center gap-8 mt-6">
          <motion.button
            className="w-16 h-16 rounded-full bg-white border-2 border-accent text-accent flex items-center justify-center shadow-md text-xl font-bold"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSwipe('unknown')}
            aria-label="Non"
          >
            <FaTimes />
          </motion.button>

          <p className="text-sm text-text-gray text-center max-w-[120px]">
            Swipe ou utilise les boutons
          </p>

          <motion.button
            className="w-16 h-16 rounded-full bg-white border-2 border-green-500 text-green-500 flex items-center justify-center shadow-md text-xl font-bold"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSwipe('known')}
            aria-label="Oui"
          >
            <FaCheck />
          </motion.button>
        </div>

        <p className="mt-4 text-xs text-text-gray">
          ← Non &nbsp;|&nbsp; Oui →
        </p>
      </div>
    </div>
  );
}
