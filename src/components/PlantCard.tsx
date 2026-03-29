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
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="cursor-pointer group"
        onClick={() => onPlant(plant.id)}
      >
        <div className="relative w-full aspect-square">
          {/* Tilled soil plot - Hay Day style */}
          <div className="absolute inset-0 rounded-lg overflow-hidden shadow-md"
            style={{
              background: 'linear-gradient(180deg, hsl(30 35% 45%) 0%, hsl(25 40% 35%) 100%)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            {/* Soil furrow lines */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute left-2 right-2 h-[3px] rounded-full"
                style={{
                  top: `${25 + i * 25}%`,
                  background: 'linear-gradient(90deg, transparent 0%, hsl(20 30% 28%) 20%, hsl(20 30% 28%) 80%, transparent 100%)',
                  opacity: 0.4,
                }}
              />
            ))}
            {/* Center icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                <Sprout className="w-7 h-7 text-green-300/50 drop-shadow-sm" />
              </motion.div>
              <p className="text-[9px] font-bold text-white/40 mt-0.5">Tap to plant</p>
            </div>
          </div>
          {/* Grass border around plot */}
          <div className="absolute -inset-1 rounded-xl -z-10"
            style={{ background: 'radial-gradient(circle, hsl(100 45% 42%) 0%, transparent 70%)' }}
          />
        </div>
      </motion.div>
    );
  }

  const isReady = plant.status === 'ready';

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.96 }}
      className="cursor-pointer group"
      onClick={() => isReady ? onHarvest(plant.id) : onPlantClick?.(plant)}
    >
      <div className="relative w-full aspect-square">
        {/* Soil plot with crop */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden shadow-md"
          style={{
            background: isReady
              ? 'linear-gradient(180deg, hsl(35 50% 50%) 0%, hsl(30 45% 38%) 100%)'
              : 'linear-gradient(180deg, hsl(30 35% 45%) 0%, hsl(25 40% 35%) 100%)',
            boxShadow: isReady
              ? 'inset 0 2px 4px rgba(255,255,255,0.2), 0 0 16px rgba(255,180,50,0.3), 0 4px 8px rgba(0,0,0,0.2)'
              : 'inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          {/* Soil lines */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute left-2 right-2 h-[3px] rounded-full"
              style={{
                top: `${25 + i * 25}%`,
                background: 'linear-gradient(90deg, transparent 0%, hsl(20 30% 28%) 20%, hsl(20 30% 28%) 80%, transparent 100%)',
                opacity: 0.25,
              }}
            />
          ))}

          {/* Growing progress bar at bottom */}
          {!isReady && (
            <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-black/20">
              <motion.div
                className="h-full rounded-r-full"
                style={{ background: 'linear-gradient(90deg, hsl(120 60% 40%), hsl(80 70% 50%))' }}
                animate={{ width: `${plant.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}

          {/* Crop emoji */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl drop-shadow-lg"
              style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}
              animate={
                isReady
                  ? { y: [0, -6, 0], rotate: [-2, 2, -2] }
                  : { scale: [0.95 + (plant.progress / 500), 1 + (plant.progress / 500), 0.95 + (plant.progress / 500)] }
              }
              transition={{ repeat: Infinity, duration: isReady ? 1.2 : 3 }}
            >
              {plant.plantEmoji}
            </motion.span>

            {!isReady && (
              <p className="text-[9px] font-extrabold text-white/60 mt-0.5 drop-shadow">
                {Math.round(plant.progress)}%
              </p>
            )}
          </div>

          {/* Ready harvest glow */}
          {isReady && (
            <>
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ background: 'radial-gradient(circle, rgba(255,200,50,0.4) 0%, transparent 70%)' }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 bg-amber-400 rounded-full p-1 shadow-lg"
                style={{ boxShadow: '0 0 8px rgba(255,180,50,0.6)' }}
              >
                <Scissors className="w-3 h-3 text-amber-900" />
              </motion.div>
              {/* Sparkles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-300 text-xs"
                  style={{ left: `${20 + i * 25}%`, top: `${15 + i * 10}%` }}
                  animate={{ opacity: [0, 1, 0], y: [0, -8, -16], scale: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Green grass glow underneath */}
        <div className="absolute -inset-1 rounded-xl -z-10"
          style={{
            background: isReady
              ? 'radial-gradient(circle, hsl(45 80% 50% / 0.25) 0%, transparent 70%)'
              : 'radial-gradient(circle, hsl(100 45% 42% / 0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Name label */}
      <div className="text-center mt-1.5">
        <p className="text-[10px] font-extrabold text-foreground leading-tight">{plant.plantName}</p>
        {isReady && (
          <motion.p
            className="text-[9px] font-bold text-amber-600"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Tap to harvest!
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
