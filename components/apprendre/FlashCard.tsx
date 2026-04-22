'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from 'framer-motion';
import type { FlashCard as FlashCardType, SwipeResult } from '@/models/Flashcard';

interface Props {
  card: FlashCardType;
  isTop: boolean;
  stackOffset: number;
  onSwipe: (direction: SwipeResult) => void;
  sharedX?: MotionValue<number>;
}

interface HintBadgesProps {
  rightOpacity: MotionValue<number>;
  leftOpacity: MotionValue<number>;
}

function HintBadges({ rightOpacity, leftOpacity }: HintBadgesProps) {
  return (
    <>
      <motion.div
        className="absolute top-5 left-5 bg-green-500 text-white font-bold text-lg px-3 py-1 rounded-lg border-2 border-green-600"
        style={{ opacity: rightOpacity }}
      >
        Oui ✓
      </motion.div>
      <motion.div
        className="absolute top-5 right-5 bg-accent text-white font-bold text-lg px-3 py-1 rounded-lg border-2 border-red-700"
        style={{ opacity: leftOpacity }}
      >
        Non ✗
      </motion.div>
    </>
  );
}

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

// flipState: 0 = front (question), 1 = back showing hint, 2 = back showing full answer
type FlipState = 0 | 1 | 2;

export default function FlashCard({ card, isTop, stackOffset, onSwipe, sharedX }: Props) {
  const ownX = useMotionValue(0);
  const x = sharedX ?? ownX;

  const [flipState, setFlipState] = useState<FlipState>(0);
  const isDraggingOff = useRef(false);

  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);
  const rightOpacity = useTransform(x, [0, 60, 150], [0, 0.6, 1]);
  const leftOpacity = useTransform(x, [-150, -60, 0], [1, 0.6, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!isTop) return;
    const { offset, velocity } = info;
    if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) {
      triggerSwipe('known');
    } else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) {
      triggerSwipe('unknown');
    }
  };

  const triggerSwipe = (result: SwipeResult) => {
    if (isDraggingOff.current) return;
    isDraggingOff.current = true;
    const target = result === 'known' ? 700 : -700;
    animate(x, target, { type: 'spring', stiffness: 300, damping: 25 }).then(() => {
      onSwipe(result);
      isDraggingOff.current = false;
      x.set(0);
      setFlipState(0);
    });
  };

  const handleCardClick = () => {
    if (!isTop) return;
    if (flipState === 0) {
      setFlipState(card.hint ? 1 : 2);
    } else if (flipState === 1) {
      setFlipState(2);
    }
    // flipState 2: answer already visible, nothing more to reveal
  };

  const scale = 1 - stackOffset * 0.05;
  const yOffset = stackOffset * 10;
  const isFlipped = flipState > 0;

  return (
    <motion.div
      className="absolute"
      style={{
        scale,
        y: yOffset,
        zIndex: 10 - stackOffset,
        x: isTop ? x : undefined,
        rotate: isTop ? rotate : undefined,
      }}
      drag={isTop ? 'x' : false}
      dragElastic={0.08}
      dragDirectionLock
      dragSnapToOrigin={!isDraggingOff.current}
      onDragEnd={handleDragEnd}
    >
      <div
        className="w-72 h-[26rem] md:w-80 md:h-[28rem] cursor-pointer select-none"
        style={{ perspective: '1000px' }}
        onClick={handleCardClick}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          {/* Front face — question */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {isTop && <HintBadges rightOpacity={rightOpacity} leftOpacity={leftOpacity} />}

            {card.tags && card.tags.length > 0 && (
              <span className="text-xs font-medium text-text-gray uppercase tracking-wide mb-4 bg-light-gray px-3 py-1 rounded-full">
                {card.tags[0]}
              </span>
            )}

            <p className="text-2xl md:text-3xl font-heading font-bold text-text-dark leading-snug mb-6">
              {card.front}
            </p>

            {isTop && (
              <p className="text-sm text-text-gray mt-auto">
                {card.hint ? 'Tap pour voir l\'indice' : 'Tap pour voir la réponse'}
              </p>
            )}
          </div>

          {/* Back face — hint then answer */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {isTop && <HintBadges rightOpacity={rightOpacity} leftOpacity={leftOpacity} />}

            {flipState === 1 && card.hint ? (
              <>
                <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 mb-4">
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                    Indice
                  </p>
                  <p className="text-base text-text-dark">{card.hint}</p>
                </div>

                {card.tags && card.tags.length > 0 && (
                  <span className="text-xs font-medium text-text-gray uppercase tracking-wide mb-4 bg-light-gray px-3 py-1 rounded-full">
                    {card.tags[0]}
                  </span>
                )}

                {isTop && (
                  <p className="text-sm text-text-gray mt-auto">Tap pour voir la réponse</p>
                )}
              </>
            ) : (
              <>
                <p className="text-xl md:text-2xl font-heading font-bold text-accent mb-2">
                  {card.back}
                </p>

                {card.phonetic && (
                  <p className="text-sm text-text-gray font-mono mb-3">/{card.phonetic}/</p>
                )}

                {card.hint && (
                  <p className="text-xs text-text-gray italic mb-3 px-2">{card.hint}</p>
                )}

                {card.example && (
                  <div className="mt-3 pt-3 border-t border-border w-full text-left">
                    <p className="text-sm text-text-dark italic">&quot;{card.example}&quot;</p>
                    {card.exampleTranslation && (
                      <p className="text-xs text-text-gray mt-1">{card.exampleTranslation}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
