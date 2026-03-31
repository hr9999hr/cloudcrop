import { motion } from "framer-motion";
import { WeatherType } from "@/store/gameStore";

interface WeatherEffectsProps {
  weather: WeatherType;
}

function RainEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: -20,
            height: `${12 + Math.random() * 10}px`,
            background: 'linear-gradient(180deg, transparent, hsla(210 70% 75% / 0.6))',
          }}
          animate={{
            y: [0, 600],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            delay: Math.random() * 1.5,
            ease: 'linear',
          }}
        />
      ))}
      {/* Puddle ripples at bottom */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute rounded-full border border-blue-300/30"
          style={{
            bottom: `${5 + Math.random() * 15}%`,
            left: `${15 + i * 20}%`,
            width: 0,
            height: 0,
          }}
          animate={{
            width: [0, 20],
            height: [0, 8],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

function MonsoonEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Heavy rain */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] rounded-full"
          style={{
            left: `${Math.random() * 120 - 10}%`,
            top: -20,
            height: `${16 + Math.random() * 14}px`,
            background: 'linear-gradient(180deg, transparent, hsla(210 60% 65% / 0.7))',
            transform: 'rotate(15deg)',
          }}
          animate={{
            y: [0, 650],
            x: [0, 40],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.3,
            repeat: Infinity,
            delay: Math.random() * 1,
            ease: 'linear',
          }}
        />
      ))}
      {/* Dark overlay for storm feel */}
      <div className="absolute inset-0 bg-black/10 rounded-2xl" />
      {/* Lightning flash */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-2xl"
        animate={{ opacity: [0, 0, 0.3, 0, 0, 0, 0, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />
    </div>
  );
}

function SunnyEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Sun glow top-right */}
      <motion.div
        className="absolute -top-10 -right-10 rounded-full"
        style={{
          width: 120,
          height: 120,
          background: 'radial-gradient(circle, hsla(45 95% 65% / 0.4) 0%, hsla(45 95% 65% / 0.1) 50%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      {/* Sun rays */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute -top-4 -right-4"
          style={{
            width: 2,
            height: 40 + i * 5,
            background: 'linear-gradient(180deg, hsla(45 90% 65% / 0.3), transparent)',
            transformOrigin: 'top center',
            transform: `rotate(${200 + i * 15}deg)`,
          }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {/* Floating butterflies */}
      {['🦋', '🦋'].map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-sm"
          style={{ top: `${20 + i * 25}%`, left: `${10 + i * 60}%` }}
          animate={{
            x: [0, 20, -10, 15, 0],
            y: [0, -10, 5, -15, 0],
          }}
          transition={{ duration: 6 + i * 2, repeat: Infinity }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

function HeatwaveEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Heat shimmer overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, hsla(30 80% 55% / 0.08) 0%, transparent 40%)',
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {/* Intense sun */}
      <motion.div
        className="absolute -top-6 -right-6 rounded-full"
        style={{
          width: 140,
          height: 140,
          background: 'radial-gradient(circle, hsla(35 100% 55% / 0.5) 0%, hsla(35 90% 55% / 0.15) 40%, transparent 65%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      {/* Heat waves rising */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            bottom: '10%',
            left: `${15 + i * 18}%`,
            width: 30,
            height: 2,
            borderRadius: '50%',
            background: 'hsla(30 70% 55% / 0.2)',
          }}
          animate={{
            y: [0, -80],
            opacity: [0.4, 0],
            scaleX: [1, 1.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

export function WeatherEffects({ weather }: WeatherEffectsProps) {
  switch (weather) {
    case 'rainy': return <RainEffect />;
    case 'monsoon': return <MonsoonEffect />;
    case 'sunny': return <SunnyEffect />;
    case 'heatwave': return <HeatwaveEffect />;
    default: return null;
  }
}
