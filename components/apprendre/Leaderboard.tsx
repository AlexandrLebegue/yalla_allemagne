'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';
import type { LeaderboardEntry } from '@/lib/firestore';

interface Props {
  deckId: string;
  deckTitle: string;
  refreshKey?: number;
}

const RANK_ICONS = [
  <FaTrophy key="1" className="text-yellow-500" />,
  <FaMedal key="2" className="text-gray-400" />,
  <FaMedal key="3" className="text-amber-600" />,
];

export default function Leaderboard({ deckId, deckTitle, refreshKey = 0 }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?deckId=${encodeURIComponent(deckId)}`)
      .then((r) => {
        if (!r.ok) throw new Error('unavailable');
        return r.json() as Promise<LeaderboardEntry[]>;
      })
      .then((data) => {
        setEntries(data);
        setUnavailable(false);
      })
      .catch(() => setUnavailable(true))
      .finally(() => setLoading(false));
  }, [deckId, refreshKey]);

  if (unavailable) return null;

  return (
    <div className="card bg-white mt-4">
      <div className="flex items-center gap-2 mb-4">
        <FaTrophy className="text-yellow-500 text-lg" />
        <h3 className="font-heading font-semibold text-text-dark">
          Tableau des scores — {deckTitle}
        </h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <motion.div
            className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : entries.length === 0 ? (
        <p className="text-text-gray text-sm text-center py-4">
          Aucun score pour l&apos;instant. Sois le premier !
        </p>
      ) : (
        <AnimatePresence>
          <ol className="space-y-2">
            {entries.map((entry, i) => (
              <motion.li
                key={entry.id ?? i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              >
                <span className="w-6 text-center text-sm font-bold text-text-gray">
                  {i < 3 ? RANK_ICONS[i] : `${i + 1}.`}
                </span>
                <span className="flex-1 font-medium text-text-dark truncate">{entry.name}</span>
                <span className="text-sm text-text-gray">{entry.score}/{entry.total}</span>
                <span
                  className={`text-sm font-bold w-12 text-right ${
                    entry.percentage >= 70
                      ? 'text-green-600'
                      : entry.percentage >= 40
                      ? 'text-secondary'
                      : 'text-accent'
                  }`}
                >
                  {entry.percentage}%
                </span>
              </motion.li>
            ))}
          </ol>
        </AnimatePresence>
      )}

      <p className="text-xs text-text-gray mt-3 flex items-center gap-1">
        <FaStar className="text-yellow-400" /> Top 20 des meilleurs scores
      </p>
    </div>
  );
}
