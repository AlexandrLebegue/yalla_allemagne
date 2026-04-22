'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRedo, FaListAlt, FaChevronDown, FaChevronUp, FaPaperPlane } from 'react-icons/fa';
import type { CardDeck, SwipeResult, DeckProgress } from '@/models/Flashcard';
import { getProgress, saveProgress } from '@/lib/flashcard-progress';
import Leaderboard from './Leaderboard';

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
  const [playerName, setPlayerName] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [leaderboardKey, setLeaderboardKey] = useState(0);
  const savedRef = useRef(false);

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

  // Persist progress once per render
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    const existing: DeckProgress = getProgress(deck.id) ?? {
      deckId: deck.id,
      knownIds: [],
      unknownIds: [],
      completedAt: null,
      totalSessions: 0,
    };
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

  const handleSubmitScore = async () => {
    if (!playerName.trim() || submitState !== 'idle') return;
    setSubmitState('loading');
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName.trim(),
          score: knownCount,
          total,
          deckId: deck.id,
          deckTitle: deck.title,
        }),
      });
      if (res.ok) {
        setSubmitState('done');
        setLeaderboardKey((k) => k + 1);
      } else {
        setSubmitState('error');
      }
    } catch {
      setSubmitState('error');
    }
  };

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
        <div className="card bg-white text-center mb-4">
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

          <div className="h-3 bg-light-gray rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Submit score */}
          <div className="border-t border-border pt-4 mb-4">
            <p className="text-sm font-medium text-text-dark mb-2">
              Poster mon score au tableau
            </p>
            {submitState === 'done' ? (
              <p className="text-green-600 text-sm font-medium">✓ Score publié !</p>
            ) : (
              <div className="flex gap-2">
                <input
                  className="input flex-1 text-sm"
                  placeholder="Ton prénom ou pseudo"
                  maxLength={30}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitScore()}
                  disabled={submitState === 'loading'}
                />
                <motion.button
                  className="btn btn-primary flex items-center gap-1 px-3 disabled:opacity-50"
                  onClick={handleSubmitScore}
                  disabled={!playerName.trim() || submitState === 'loading'}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPaperPlane className="text-sm" />
                </motion.button>
              </div>
            )}
            {submitState === 'error' && (
              <p className="text-accent text-xs mt-1">Erreur — leaderboard non disponible.</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {unknownIds.length > 0 && (
              <button
                className="btn btn-primary flex items-center justify-center gap-2"
                onClick={onRestartUnknown}
              >
                <FaRedo className="text-sm" /> Retravailler les {unknownIds.length} Non
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

        {/* Leaderboard */}
        <Leaderboard deckId={deck.id} deckTitle={deck.title} refreshKey={leaderboardKey} />

        {/* Unknown cards list */}
        {unknownIds.length > 0 && (
          <div className="card bg-white mb-4 mt-4">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setShowUnknown((v) => !v)}
            >
              <span className="font-heading font-semibold text-accent">
                Non — À revoir ({unknownIds.length})
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
                Oui — Connus ({knownIds.length})
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
