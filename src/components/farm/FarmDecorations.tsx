import { motion } from "framer-motion";
import { WeatherType } from "@/store/gameStore";

interface FarmDecorationsProps {
  weather: WeatherType;
}

export function FarmDecorations({ weather }: FarmDecorationsProps) {
  const isRainy = weather === 'rainy' || weather === 'monsoon';

  return (
    <div className="absolute inset-0 pointer-events-none z-[5]">
      {/* Bottom-left flowers */}
      <div className="absolute bottom-4 left-3 flex gap-1 items-end">
        {['🌻', '🌷', '🌼'].map((f, i) => (
          <motion.span
            key={i}
            className="text-lg"
            animate={{ rotate: isRainy ? [-5, 5, -5] : [-2, 2, -2] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity }}
            style={{ display: 'inline-block' }}
          >
            {f}
          </motion.span>
        ))}
      </div>

      {/* Bottom-right flowers */}
      <div className="absolute bottom-4 right-3 flex gap-1 items-end">
        {['🌸', '🌺', '💐'].map((f, i) => (
          <motion.span
            key={i}
            className="text-lg"
            animate={{ rotate: isRainy ? [5, -5, 5] : [2, -2, 2] }}
            transition={{ duration: 2.5 + i * 0.3, repeat: Infinity }}
            style={{ display: 'inline-block' }}
          >
            {f}
          </motion.span>
        ))}
      </div>

      {/* Small pond bottom-center */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <motion.div
          className="relative"
          style={{
            width: 50,
            height: 22,
            borderRadius: '50%',
            background: 'linear-gradient(180deg, hsla(200 70% 55% / 0.5), hsla(210 60% 45% / 0.6))',
            boxShadow: '0 2px 8px hsla(200 70% 40% / 0.3)',
          }}
        >
          {/* Water shimmer */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent 30%, hsla(200 80% 80% / 0.4) 50%, transparent 70%)' }}
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Lily pad */}
          <span className="absolute -top-1 left-2 text-[10px]">🍃</span>
        </motion.div>
      </div>

      {/* Grass tufts along edges */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.span
            key={i}
            className="text-base opacity-60"
            animate={{ scaleY: isRainy ? [1, 0.85, 1] : [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            style={{ display: 'inline-block', transformOrigin: 'bottom' }}
          >
            🌿
          </motion.span>
        ))}
      </div>

      {/* Fence posts top-left */}
      <div className="absolute top-3 left-3 flex gap-2 opacity-50">
        {['🪵', '🪵', '🪵'].map((f, i) => (
          <span key={i} className="text-[10px]">{f}</span>
        ))}
      </div>

      {/* Bird on sunny/heatwave days */}
      {!isRainy && (
        <motion.span
          className="absolute top-6 text-sm"
          animate={{
            x: [-20, 300],
            y: [0, -15, 5, -10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatDelay: 4 }}
          style={{ left: '5%' }}
        >
          🐦
        </motion.span>
      )}

      {/* Fireflies on rainy days, dragonfly on sunny */}
      {isRainy ? (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4,
                height: 4,
                background: 'hsla(60 80% 70% / 0.7)',
                boxShadow: '0 0 6px hsla(60 80% 70% / 0.5)',
                top: `${30 + i * 15}%`,
                left: `${20 + i * 25}%`,
              }}
              animate={{
                x: [0, 10, -5, 8, 0],
                y: [0, -8, 3, -5, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.2 }}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
