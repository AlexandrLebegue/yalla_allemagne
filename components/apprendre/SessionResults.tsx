'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRedo, FaListAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { CardDeck, SwipeResult, DeckProgress } from '@/models/Flashcard';
import { getProgress, saveProgress } from '@/lib/flashcards';

interface Props {
  deck: CardDeck;
  results: Record<string, SwipeResult>;
  onRestartUnknown: () => void;
  onRestartAll: () => void;
  onBackToSelect: () => void;
}

export default function SessionResults({ deck, results, onRestartUnknown, onRestartAll, onBackToSelect }: Props) {
  const [showKnown, setShowKnown] = useState(false);
  const [showUnknown, setShowUnknown] = useState(true);

  const knownIds = Object.entries(results)
    .filter(([, r]) => r === 'known')
    .map(([id]) => id);
  const unknownIds = Object.entries(results)
    .filter(([, r]) => r === 'unknown')
    .map(([id]) => id);

  const total = Object.keys(results).length;
  const knownCount = knownIds.length;
  const pct = total > 0 ? Math.round((knownCount / total) * 100) : 0;

  const getCard = (id: string) => deck.cards.find((c) => c.id === id);

  useEffect(() => {
    const existing: DeckProgress = getProgress(deck.id) ?? {
      deckId: deck.id,
      knownIds: [],
      unknownIds: [],
      completedAt: null,
      totalSessions: 0,
    };

    // Merge: a card known this session overrides its previous state
    const mergedKnown = Array.from(
      new Set([...existing.knownIds.filter((id) => !unknownIds.includes(id)), ...knownIds])
    );
    const mergedUnknown = Array.from(
      new Set([...existing.unknownIds.filter((id) => !knownIds.includes(id)), ...unknownIds])
    );

    saveProgress(deck.id, {
      deckId: deck.id,
      knownIds: mergedKnown,
      unknownIds: mergedUnknown,
      completedAt: new Date().toISOString(),
      totalSessions: existing.totalSessions + 1,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scoreColor =
    pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-secondary' : 'text-accent';

  const scoreEmoji = pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚';

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Score card */}
        <div className="card bg-white text-center mb-6">
          <p className="text-5xl mb-3">{scoreEmoji}</p>
          <h2 className="text-2xl font-heading font-bold text-text-dark mb-1">
            Session terminée !
          </h2>
          <p className={`text-4xl font-heading font-bold ${scoreColor} my-3`}>
            {knownCount} / {total}
          </p>
          <p className="text-text-gray text-sm mb-4">
            Tu connais <strong>{pct}%</strong> des cartes de ce deck
          </p>

          {/* Visual bar */}
          <div className="h-3 bg-light-gray rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {unknownIds.length > 0 && (
              <button
                className="btn btn-primary flex items-center justify-center gap-2"
                onClick={onRestartUnknown}
              >
                <FaRedo className="text-sm" /> Retravailler les {unknownIds.length} cartes inconnues
              </button>
            )}
            <button
              className="btn btn-secondary flex items-center justify-center gap-2"
              onClick={onRestartAll}
            >
              <FaRedo className="text-sm" /> Tout recommencer
            </button>
            <button
              className="btn flex items-center justify-center gap-2 bg-white border border-border text-text-dark hover:bg-light-gray"
              onClick={onBackToSelect}
            >
              <FaListAlt className="text-sm" /> Choisir un autre deck
            </button>
          </div>
        </div>

        {/* Unknown cards list */}
        {unknownIds.length > 0 && (
          <div className="card bg-white mb-4">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setShowUnknown((v) => !v)}
            >
              <span className="font-heading font-semibold text-accent">
                ✗ À revoir ({unknownIds.length})
              </span>
              {showUnknown ? <FaChevronUp className="text-text-gray" /> : <FaChevronDown className="text-text-gray" />}
            </button>
            {showUnknown && (
              <ul className="mt-4 space-y-3">
                {unknownIds.map((id) => {
                  const card = getCard(id);
                  return card ? (
                    <li key={id} className="border-l-4 border-accent pl-3 py-1">
                      <p className="text-sm font-medium text-text-dark">{card.front}</p>
                      <p className="text-sm text-accent">{card.back}</p>
                      {card.phonetic && (
                        <p className="text-xs text-text-gray font-mono">/{card.phonetic}/</p>
                      )}
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </div>
        )}

        {/* Known cards list */}
        {knownIds.length > 0 && (
          <div className="card bg-white">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setShowKnown((v) => !v)}
            >
              <span className="font-heading font-semibold text-green-600">
                ✓ Connus ({knownIds.length})
              </span>
              {showKnown ? <FaChevronUp className="text-text-gray" /> : <FaChevronDown className="text-text-gray" />}
            </button>
            {showKnown && (
              <ul className="mt-4 space-y-3">
                {knownIds.map((id) => {
                  const card = getCard(id);
                  return card ? (
                    <li key={id} className="border-l-4 border-green-500 pl-3 py-1">
                      <p className="text-sm font-medium text-text-dark">{card.front}</p>
                      <p className="text-sm text-green-600">{card.back}</p>
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
