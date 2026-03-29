import { motion } from "framer-motion";
import { Sprout, Scissors } from "lucide-react";
import { PlantSlot } from "@/store/gameStore";

interface PlantCardProps {
  plant: PlantSlot;
  onPlant: (slotId: number) => void;
  onHarvest: (slotId: number) => void;
  onPlantClick?: (plant: PlantSlot) => void;
}

// Growth stage visuals per crop type
const GROWTH_STAGES: Record<string, { stages: string[]; colors: string[] }> = {
  Tomato: {
    stages: ['🌱', '🪴', '🍃', '🌿', '🍅'],
    colors: ['hsl(120 40% 35%)', 'hsl(110 45% 38%)', 'hsl(100 50% 40%)', 'hsl(80 55% 42%)', 'hsl(0 70% 50%)'],
  },
  Carrot: {
    stages: ['🌱', '🪴', '🌿', '🥕', '🥕'],
    colors: ['hsl(120 40% 35%)', 'hsl(110 45% 38%)', 'hsl(100 50% 40%)', 'hsl(30 80% 50%)', 'hsl(25 85% 52%)'],
  },
  Lettuce: {
    stages: ['🌱', '🪴', '🌿', '🥬', '🥬'],
    colors: ['hsl(120 40% 35%)', 'hsl(110 45% 38%)', 'hsl(100 50% 40%)', 'hsl(120 60% 45%)', 'hsl(120 65% 48%)'],
  },
  Corn: {
    stages: ['🌱', '🪴', '🌾', '🌽', '🌽'],
    colors: ['hsl(120 40% 35%)', 'hsl(110 45% 38%)', 'hsl(45 60% 45%)', 'hsl(50 80% 50%)', 'hsl(48 85% 52%)'],
  },
  Chili: {
    stages: ['🌱', '🪴', '🌿', '🌶️', '🌶️'],
    colors: ['hsl(120 40% 35%)', 'hsl(110 45% 38%)', 'hsl(100 50% 40%)', 'hsl(5 80% 48%)', 'hsl(0 85% 50%)'],
  },
};

const DEFAULT_STAGES = {
  stages: ['🌱', '🪴', '🌿', '🍀', '🌸'],
  colors: ['hsl(120 40% 35%)', 'hsl(110 45% 38%)', 'hsl(100 50% 40%)', 'hsl(90 55% 42%)', 'hsl(80 60% 45%)'],
};

function getGrowthVisual(plantName: string | null, progress: number) {
  const config = (plantName && GROWTH_STAGES[plantName]) || DEFAULT_STAGES;
  let stageIdx: number;
  if (progress >= 100) stageIdx = 4;
  else if (progress >= 75) stageIdx = 3;
  else if (progress >= 50) stageIdx = 2;
  else if (progress >= 25) stageIdx = 1;
  else stageIdx = 0;
  return { emoji: config.stages[stageIdx], glowColor: config.colors[stageIdx], stageIdx };
}

export function PlantCard({ plant, onPlant, onHarvest, onPlantClick }: PlantCardProps) {
  if (plant.status === 'empty') {
    return (
      <motion.div
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.94 }}
        className="cursor-pointer"
        onClick={() => onPlant(plant.id)}
      >
        <div className="relative" style={{ width: '100%', paddingBottom: '75%' }}>
          <div
            className="absolute inset-0 rounded-md overflow-hidden"
            style={{
              background: 'linear-gradient(170deg, hsl(28 38% 50%) 0%, hsl(22 42% 34%) 100%)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.12), inset 0 -2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {/* Soil rows */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute left-[8%] right-[8%] rounded-full"
                style={{
                  top: `${15 + i * 17}%`,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent 5%, hsl(18 30% 26%) 30%, hsl(18 30% 26%) 70%, transparent 95%)',
                  opacity: 0.4,
                }}
              />
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                <Sprout className="w-5 h-5 text-green-400/35" />
              </motion.div>
              <p className="text-[7px] font-bold text-white/30 mt-0.5">Plant</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const isReady = plant.status === 'ready';
  const { emoji, glowColor, stageIdx } = getGrowthVisual(plant.plantName, plant.progress);
  // Scale the crop size based on growth
  const cropScale = 0.6 + (stageIdx * 0.1);

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.94 }}
      className="cursor-pointer"
      onClick={() => isReady ? onHarvest(plant.id) : onPlantClick?.(plant)}
    >
      <div className="relative" style={{ width: '100%', paddingBottom: '75%' }}>
        <div
          className="absolute inset-0 rounded-md overflow-hidden"
          style={{
            background: isReady
              ? 'linear-gradient(170deg, hsl(36 52% 52%) 0%, hsl(26 48% 38%) 100%)'
              : 'linear-gradient(170deg, hsl(28 38% 50%) 0%, hsl(22 42% 34%) 100%)',
            boxShadow: isReady
              ? '0 4px 16px rgba(255,180,40,0.4), inset 0 1px 3px rgba(255,255,255,0.18)'
              : '0 4px 10px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.12)',
          }}
        >
          {/* Soil rows */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute left-[8%] right-[8%] rounded-full"
              style={{
                top: `${15 + i * 17}%`,
                height: '3px',
                background: 'linear-gradient(90deg, transparent 5%, hsl(18 30% 26%) 30%, hsl(18 30% 26%) 70%, transparent 95%)',
                opacity: 0.18,
              }}
            />
          ))}

          {/* Greenery sprouts on soil at later stages */}
          {stageIdx >= 1 && !isReady && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(Math.min(stageIdx * 2, 6))].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-[8px]"
                  style={{
                    left: `${12 + (i % 3) * 30 + (i > 2 ? 15 : 0)}%`,
                    bottom: `${15 + (i % 2) * 12}%`,
                    opacity: 0.5 + stageIdx * 0.1,
                  }}
                  animate={{ y: [0, -1, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }}
                >
                  🌱
                </motion.span>
              ))}
            </div>
          )}

          {/* Progress bar at bottom */}
          {!isReady && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/25">
              <motion.div
                className="h-full"
                style={{ background: `linear-gradient(90deg, ${glowColor}, hsl(80 70% 50%))` }}
                animate={{ width: `${plant.progress}%` }}
              />
            </div>
          )}

          {/* Main crop display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              style={{
                filter: `drop-shadow(0 3px 5px rgba(0,0,0,0.35))`,
                transformOrigin: 'bottom center',
              }}
              animate={
                isReady
                  ? { y: [0, -6, 0], rotate: [-3, 3, -3], scale: [1, 1.08, 1] }
                  : { scale: [cropScale - 0.02, cropScale + 0.02, cropScale - 0.02] }
              }
              transition={{ repeat: Infinity, duration: isReady ? 1 : 3.5 }}
            >
              <span style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)' }}>{emoji}</span>
            </motion.div>

            {!isReady && (
              <p className="text-[7px] font-extrabold text-white/50 drop-shadow mt-0.5">
                {Math.round(plant.progress)}%
              </p>
            )}
          </div>

          {/* Harvest effects */}
          {isReady && (
            <>
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: [0.05, 0.25, 0.05] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ background: 'radial-gradient(circle, rgba(255,210,60,0.45) 0%, transparent 60%)' }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0.5 right-0.5 rounded-full p-0.5"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 0 8px rgba(251,191,36,0.6)' }}
              >
                <Scissors className="w-2.5 h-2.5 text-amber-900" />
              </motion.div>
              {[...Array(4)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-[9px]"
                  style={{ left: `${10 + i * 22}%`, top: `${5 + (i % 2) * 15}%` }}
                  animate={{ opacity: [0, 1, 0], y: [0, -8, -16] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                >
                  ✨
                </motion.span>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Label */}
      <div className="text-center mt-1" style={{ transform: 'rotateX(0deg) translateZ(1px)' }}>
        <p className="text-[9px] font-extrabold text-foreground leading-tight">{plant.plantName}</p>
        {isReady ? (
          <motion.p
            className="text-[8px] font-bold"
            style={{ color: 'hsl(38 80% 45%)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Harvest!
          </motion.p>
        ) : (
          <p className="text-[7px] font-semibold text-muted-foreground">
            Stage {stageIdx + 1}/5
          </p>
        )}
      </div>
    </motion.div>
  );
}
