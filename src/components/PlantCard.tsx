import { motion } from "framer-motion";
import { Sprout, Scissors } from "lucide-react";
import { PlantSlot } from "@/store/gameStore";

interface PlantCardProps {
  plant: PlantSlot;
  onPlant: (slotId: number) => void;
  onHarvest: (slotId: number) => void;
  onPlantClick?: (plant: PlantSlot) => void;
}

export function PlantCard({ plant, onPlant, onHarvest, onPlantClick }: PlantCardProps) {
  if (plant.status === 'empty') {
    return (
      <motion.div
        whileHover={{ scale: 1.08, z: 10 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer"
        onClick={() => onPlant(plant.id)}
      >
        <div className="relative" style={{ width: '100%', paddingBottom: '70%' }}>
          {/* Diamond-shaped soil plot */}
          <div
            className="absolute inset-0 rounded-md overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, hsl(30 40% 48%) 0%, hsl(22 45% 32%) 100%)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.15)',
            }}
          >
            {/* Furrows */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-1 right-1 h-[2px] rounded-full"
                style={{ top: `${20 + i * 20}%`, background: 'hsl(20 35% 25%)', opacity: 0.35 }}
              />
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                <Sprout className="w-6 h-6 text-green-400/40" />
              </motion.div>
              <p className="text-[8px] font-bold text-white/35 mt-0.5">Plant</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const isReady = plant.status === 'ready';

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.08, z: 10 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={() => isReady ? onHarvest(plant.id) : onPlantClick?.(plant)}
    >
      <div className="relative" style={{ width: '100%', paddingBottom: '70%' }}>
        <div
          className="absolute inset-0 rounded-md overflow-hidden"
          style={{
            background: isReady
              ? 'linear-gradient(160deg, hsl(38 55% 50%) 0%, hsl(28 50% 36%) 100%)'
              : 'linear-gradient(160deg, hsl(30 40% 48%) 0%, hsl(22 45% 32%) 100%)',
            boxShadow: isReady
              ? '0 6px 16px rgba(255,170,30,0.35), inset 0 1px 3px rgba(255,255,255,0.2)'
              : '0 6px 12px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.15)',
          }}
        >
          {/* Furrows */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1 right-1 h-[2px] rounded-full"
              style={{ top: `${20 + i * 20}%`, background: 'hsl(20 35% 25%)', opacity: 0.2 }}
            />
          ))}

          {/* Progress bar */}
          {!isReady && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/25 rounded-b-md">
              <motion.div
                className="h-full rounded-br-md"
                style={{ background: 'linear-gradient(90deg, hsl(120 55% 40%), hsl(75 70% 50%))' }}
                animate={{ width: `${plant.progress}%` }}
              />
            </div>
          )}

          {/* Crop — positioned to "pop out" of the soil in isometric view */}
          <div className="absolute inset-0 flex flex-col items-center" style={{ justifyContent: 'flex-start', paddingTop: '8%' }}>
            <motion.span
              className="drop-shadow-lg"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))',
                transformOrigin: 'bottom center',
              }}
              animate={
                isReady
                  ? { y: [0, -5, 0], rotate: [-3, 3, -3] }
                  : { scale: [0.85 + plant.progress / 300, 0.9 + plant.progress / 300, 0.85 + plant.progress / 300] }
              }
              transition={{ repeat: Infinity, duration: isReady ? 1 : 3 }}
            >
              {plant.plantEmoji}
            </motion.span>

            {!isReady && (
              <p className="text-[8px] font-extrabold text-white/55 drop-shadow mt-0.5">
                {Math.round(plant.progress)}%
              </p>
            )}
          </div>

          {/* Harvest indicator */}
          {isReady && (
            <>
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: [0.05, 0.2, 0.05] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ background: 'radial-gradient(circle, rgba(255,210,60,0.5) 0%, transparent 65%)' }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0.5 right-0.5 rounded-full p-0.5"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 0 8px rgba(251,191,36,0.6)' }}
              >
                <Scissors className="w-2.5 h-2.5 text-amber-900" />
              </motion.div>
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-[10px]"
                  style={{ left: `${15 + i * 28}%`, top: `${10 + i * 8}%` }}
                  animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }}
                  transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.5 }}
                >
                  ✨
                </motion.span>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Label below plot */}
      <div className="text-center mt-1" style={{ transform: 'rotateX(0deg)' }}>
        <p className="text-[9px] font-extrabold text-foreground leading-tight">{plant.plantName}</p>
        {isReady && (
          <motion.p
            className="text-[8px] font-bold"
            style={{ color: 'hsl(38 80% 45%)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Harvest!
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
