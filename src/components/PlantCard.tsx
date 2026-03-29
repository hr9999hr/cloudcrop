import { motion } from "framer-motion";
import { Scissors, Sprout } from "lucide-react";
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer group"
        onClick={() => onPlant(plant.id)}
      >
        {/* Dirt plot */}
        <div className="w-full aspect-square rounded-xl bg-gradient-to-b from-[hsl(var(--earth-light))] to-[hsl(var(--earth))] border-2 border-[hsl(var(--earth))] flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
          {/* Soil texture lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-px bg-foreground/30 my-3 mx-2" style={{ marginTop: `${20 + i * 20}%` }} />
            ))}
          </div>
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-center z-10"
          >
            <Sprout className="w-6 h-6 mx-auto text-primary/50 mb-1" />
            <p className="text-[10px] font-bold text-foreground/50">Plant</p>
          </motion.div>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-1 font-semibold">Slot {plant.id}</p>
      </motion.div>
    );
  }

  const isReady = plant.status === 'ready';

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer group"
      onClick={() => isReady ? onHarvest(plant.id) : onPlantClick?.(plant)}
    >
      {/* Growing plot */}
      <div className={`w-full aspect-square rounded-xl bg-gradient-to-b from-[hsl(var(--earth-light))] to-[hsl(var(--earth))] border-2 flex flex-col items-center justify-center shadow-md relative overflow-hidden ${isReady ? 'border-[hsl(var(--harvest))] ring-2 ring-[hsl(var(--harvest))]/30' : 'border-[hsl(var(--earth))]'}`}>
        
        {/* Progress ring behind emoji */}
        <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity="0.3" />
          <motion.circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke={isReady ? "hsl(var(--harvest))" : "hsl(var(--growth))"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - plant.progress / 100) }}
            transition={{ duration: 0.5 }}
            transform="rotate(-90 50 50)"
          />
        </svg>

        {/* Plant emoji */}
        <motion.span
          className="text-4xl z-10"
          animate={isReady ? { y: [0, -4, 0], scale: [1, 1.1, 1] } : { scale: [0.95, 1, 0.95] }}
          transition={{ repeat: Infinity, duration: isReady ? 1 : 3 }}
        >
          {plant.plantEmoji}
        </motion.span>

        {/* Ready sparkle badge */}
        {isReady && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 bg-[hsl(var(--harvest))] rounded-full p-1"
          >
            <Scissors className="w-3 h-3 text-foreground" />
          </motion.div>
        )}
      </div>

      {/* Label */}
      <div className="text-center mt-1">
        <p className="text-[10px] font-bold text-foreground truncate">{plant.plantName}</p>
        <p className="text-[9px] text-muted-foreground font-semibold">
          {isReady ? '✨ Harvest!' : `${Math.round(plant.progress)}%`}
        </p>
      </div>
    </motion.div>
  );
}
