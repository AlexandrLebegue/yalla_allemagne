'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaGraduationCap } from 'react-icons/fa';
import type { CardDeck, DeckProgress } from '@/models/Flashcard';
import { getProgress } from '@/lib/flashcard-progress';

interface Props {
  decks: CardDeck[];
  onSelectDeck: (deck: CardDeck) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function DeckSelector({ decks, onSelectDeck }: Props) {
  const [progressMap, setProgressMap] = useState<Record<string, DeckProgress | null>>({});

  useEffect(() => {
    const map: Record<string, DeckProgress | null> = {};
    decks.forEach((d) => {
      map[d.id] = getProgress(d.id);
    });
    setProgressMap(map);
  }, [decks]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-accent to-red-700 text-white py-16 px-4">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <FaGraduationCap className="text-5xl opacity-90" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Apprendre l&apos;allemand
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Swipe à droite si tu connais, à gauche si tu dois réviser. Simple et efficace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Deck grid */}
      <section className="container py-12">
        <motion.h2
          className="text-2xl font-heading font-semibold text-text-dark mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Choisir un deck
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck, i) => {
            const progress = progressMap[deck.id];
            const known = progress?.knownIds.length ?? 0;
            const total = deck.cards.length;
            const pct = total > 0 ? Math.round((known / total) * 100) : 0;
            const hasProgress = (progress?.totalSessions ?? 0) > 0;

            return (
              <motion.div
                key={deck.id}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
                className="card bg-white cursor-pointer flex flex-col"
                onClick={() => onSelectDeck(deck)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{deck.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-text-dark text-lg leading-tight">
                      {deck.title}
                    </h3>
                    <p className="text-sm text-text-gray">{total} cartes</p>
                  </div>
                </div>

                <p className="text-text-gray text-sm mb-4 flex-1">{deck.description}</p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-text-gray mb-1">
                    <span>{hasProgress ? `${known} / ${total} connues` : 'Pas encore commencé'}</span>
                    {hasProgress && <span>{pct}%</span>}
                  </div>
                  <div className="h-2 bg-light-gray rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 + 0.4 }}
                    />
                  </div>
                </div>

                <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                  <FaPlay className="text-sm" />
                  {hasProgress ? 'Continuer' : 'Commencer'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
