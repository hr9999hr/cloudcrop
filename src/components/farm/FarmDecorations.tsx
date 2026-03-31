import { motion } from "framer-motion";
import { WeatherType } from "@/store/gameStore";

interface FarmDecorationsProps {
  weather: WeatherType;
}

export function FarmDecorations({ weather }: FarmDecorationsProps) {
  const isRainy = weather === 'rainy' || weather === 'monsoon';
  const isHot = weather === 'heatwave';

  return (
    <div className="absolute inset-0 pointer-events-none z-[5]">

      {/* === TOP-LEFT: Barn & Silo === */}
      <div className="absolute top-2 left-2 flex items-end gap-1">
        <motion.span
          className="text-2xl"
          animate={{ y: isRainy ? [0, -1, 0] : [0, 0, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ display: 'inline-block' }}
        >
          🏚️
        </motion.span>
        <span className="text-lg opacity-80">🏗️</span>
      </div>

      {/* === TOP-RIGHT: Trees cluster === */}
      <div className="absolute top-1 right-2 flex items-end gap-0.5">
        {['🌳', '🌲', '🌳', '🌲'].map((t, i) => (
          <motion.span
            key={i}
            className={i % 2 === 0 ? 'text-2xl' : 'text-xl'}
            animate={{ rotate: isRainy ? [-3, 3, -3] : [-1, 1, -1] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity }}
            style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
          >
            {t}
          </motion.span>
        ))}
      </div>

      {/* === BOTTOM-LEFT: Cow & Fence === */}
      <div className="absolute bottom-2 left-2 flex items-end gap-1">
        <span className="text-[10px] opacity-60">🪵🪵🪵</span>
        <motion.span
          className="text-xl"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ display: 'inline-block' }}
        >
          🐄
        </motion.span>
        <motion.span
          className="text-lg"
          animate={{ x: [0, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          style={{ display: 'inline-block' }}
        >
          🐔
        </motion.span>
      </div>

      {/* === BOTTOM-RIGHT: Well & Tractor === */}
      <div className="absolute bottom-2 right-2 flex items-end gap-1.5">
        <motion.span
          className="text-xl"
          animate={{ rotate: [0, -2, 0, 2, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ display: 'inline-block' }}
        >
          🚜
        </motion.span>
        <span className="text-lg">⛲</span>
      </div>

      {/* === TOP-CENTER: Birds flying === */}
      {!isRainy && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2">
          {['🕊️', '🐦'].map((bird, i) => (
            <motion.span
              key={i}
              className="absolute text-sm"
              animate={{
                x: [-(30 + i * 20), 80 + i * 30],
                y: [0, -(8 + i * 5), 3, -(6 + i * 3), 0],
              }}
              transition={{ duration: 7 + i * 3, repeat: Infinity, repeatDelay: 2 + i }}
              style={{ display: 'inline-block', top: i * 8 }}
            >
              {bird}
            </motion.span>
          ))}
        </div>
      )}

      {/* === LEFT-CENTER: Haystacks === */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
        <span className="text-base opacity-70">🌾</span>
        <span className="text-sm opacity-60">🌾</span>
      </div>

      {/* === RIGHT-CENTER: Flowers & Bushes === */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
        {['🌻', '🌷'].map((f, i) => (
          <motion.span
            key={i}
            className="text-base"
            animate={{ rotate: isRainy ? [-5, 5, -5] : [-2, 2, -2] }}
            transition={{ duration: 2 + i * 0.6, repeat: Infinity }}
            style={{ display: 'inline-block' }}
          >
            {f}
          </motion.span>
        ))}
      </div>

      {/* === BOTTOM-CENTER: Grass strip === */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className="text-xs opacity-40"
            animate={{ scaleY: isRainy ? [1, 0.85, 1] : [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            style={{ display: 'inline-block', transformOrigin: 'bottom' }}
          >
            {i % 3 === 0 ? '🌿' : '🍃'}
          </motion.span>
        ))}
      </div>

      {/* === Hot weather: dragonflies === */}
      {isHot && (
        <>
          {[0, 1].map((i) => (
            <motion.span
              key={`df-${i}`}
              className="absolute text-sm"
              style={{ top: `${25 + i * 20}%`, left: `${15 + i * 55}%` }}
              animate={{
                x: [0, 15, -8, 12, 0],
                y: [0, -10, 5, -8, 0],
              }}
              transition={{ duration: 5 + i * 2, repeat: Infinity }}
            >
              🪰
            </motion.span>
          ))}
        </>
      )}

      {/* === Rainy weather: worms/snails === */}
      {isRainy && (
        <motion.span
          className="absolute text-sm"
          style={{ bottom: '15%', left: '30%' }}
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🐌
        </motion.span>
      )}
    </div>
  );
}
