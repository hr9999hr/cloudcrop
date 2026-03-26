import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlantSlot, useGameStore } from "@/store/gameStore";

interface PlantCardProps {
  plant: PlantSlot;
  onPlant: (slotId: number) => void;
  onHarvest: (slotId: number) => void;
  onPlantClick?: (plant: PlantSlot) => void;
}

export function PlantCard({ plant, onPlant, onHarvest, onPlantClick }: PlantCardProps) {
  const { waterDrops, inventory } = useGameStore();

  if (plant.status === 'empty') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-card border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] cursor-pointer hover:border-primary/40 transition-colors"
        onClick={() => onPlant(plant.id)}
      >
        <span className="text-4xl mb-3">🕳️</span>
        <p className="text-sm font-semibold text-muted-foreground">Empty Slot</p>
        <p className="text-xs text-muted-foreground mt-1">Tap to plant</p>
      </motion.div>
    );
  }

  const isReady = plant.status === 'ready';
  const progressColor = isReady ? 'bg-harvest' : 'bg-growth';

  return (
    <motion.div
      layout
      className={`bg-card border rounded-2xl p-5 min-h-[220px] flex flex-col items-center relative overflow-hidden cursor-pointer ${isReady ? 'border-harvest ring-2 ring-harvest/20' : 'border-border'}`}
      onClick={() => onPlantClick?.(plant)}
    >
      {isReady && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 bg-harvest text-xs font-bold px-2 py-1 rounded-full"
        >
          Ready! ✨
        </motion.div>
      )}

      <motion.span
        className="text-5xl mb-3"
        animate={isReady ? { y: [0, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {plant.plantEmoji}
      </motion.span>

      <p className="text-sm font-bold text-foreground">{plant.plantName}</p>

      <div className="w-full bg-muted rounded-full h-2.5 mt-3 mb-2 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${progressColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${plant.progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-xs text-muted-foreground font-semibold">
        {isReady ? '🎉 Ready to harvest!' : `${Math.round(plant.progress)}% grown`}
      </p>

      <div className="flex gap-2 mt-auto pt-3 w-full">
        {isReady ? (
          <Button
            size="sm"
            onClick={(e) => { e.stopPropagation(); onHarvest(plant.id); }}
            className="w-full gradient-coin font-bold rounded-xl"
          >
            <Scissors className="w-4 h-4 mr-1" /> Harvest
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onPlantClick?.(plant); }}
            className="w-full rounded-xl text-xs"
          >
            View Details 🔍
          </Button>
        )}
      </div>
    </motion.div>
  );
}
