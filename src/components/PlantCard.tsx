import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { PlantSlot } from "@/store/gameStore";

// Farm asset imports
import soilPlot from "@/assets/farm/soil-plot.png";
import stageSeedling from "@/assets/farm/stage-seedling.png";
import stageGrowing from "@/assets/farm/stage-growing.png";
import cropTomato from "@/assets/farm/crop-tomato.png";
import cropCarrot from "@/assets/farm/crop-carrot.png";
import cropLettuce from "@/assets/farm/crop-lettuce.png";
import cropCorn from "@/assets/farm/crop-corn.png";
import cropChili from "@/assets/farm/crop-chili.png";

interface PlantCardProps {
  plant: PlantSlot;
  onPlant: (slotId: number) => void;
  onHarvest: (slotId: number) => void;
  onPlantClick?: (plant: PlantSlot) => void;
}

const CROP_IMAGES: Record<string, string> = {
  Tomato: cropTomato,
  Carrot: cropCarrot,
  Lettuce: cropLettuce,
  Corn: cropCorn,
  Chili: cropChili,
};

function getCropImage(plantName: string | null, progress: number): string {
  if (progress < 25) return stageSeedling;
  if (progress < 60) return stageGrowing;
  if (plantName && CROP_IMAGES[plantName]) return CROP_IMAGES[plantName];
  return stageGrowing;
}

function getGrowthLabel(progress: number): string {
  if (progress < 25) return 'Sprouting';
  if (progress < 50) return 'Growing';
  if (progress < 75) return 'Maturing';
  if (progress < 100) return 'Almost Ready';
  return 'Ready!';
}

export function PlantCard({ plant, onPlant, onHarvest, onPlantClick }: PlantCardProps) {
  if (plant.status === 'empty') {
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.96 }}
        className="cursor-pointer relative w-full h-full rounded-lg overflow-hidden"
        onClick={() => onPlant(plant.id)}
        style={{
          background: 'linear-gradient(145deg, hsl(30 55% 42%), hsl(25 50% 32%))',
          border: '2px solid hsla(30 40% 50% / 0.5)',
          boxShadow: '0 4px 12px hsla(0 0% 0% / 0.2), inset 0 1px 0 hsla(0 0% 100% / 0.1)',
        }}
      >
        {/* Soil texture */}
        <img
          src={soilPlot}
          alt="Empty plot"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          draggable={false}
        />
        {/* Tilled row lines */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, hsla(0 0% 0% / 0.15) 8px, hsla(0 0% 0% / 0.15) 9px)', }}
        />
        {/* Plant button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="bg-white/25 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg"
          >
            <p className="text-[11px] font-extrabold text-white drop-shadow-md">+ Plant</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const isReady = plant.status === 'ready';
  const cropImage = getCropImage(plant.plantName, plant.progress);
  const growthLabel = getGrowthLabel(plant.progress);

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.08, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer relative"
      onClick={() => isReady ? onHarvest(plant.id) : onPlantClick?.(plant)}
    >
      {/* Crop image with growth-based opacity/scale */}
      <motion.img
        src={cropImage}
        alt={plant.plantName || 'Growing crop'}
        className="w-full h-auto drop-shadow-lg"
        draggable={false}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: isReady ? [1, 1.02, 1] : 1,
        }}
        transition={isReady ? { repeat: Infinity, duration: 2 } : { duration: 0.5 }}
      />

      {/* Progress bar overlay at bottom */}
      {!isReady && (
        <div className="absolute bottom-[12%] left-[15%] right-[15%]">
          <div className="h-1.5 rounded-full bg-black/30 overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #4ade80, #facc15)' }}
              animate={{ width: `${plant.progress}%` }}
            />
          </div>
          <p className="text-[7px] font-extrabold text-white text-center mt-0.5 drop-shadow-md">
            {growthLabel} • {Math.round(plant.progress)}%
          </p>
        </div>
      )}

      {/* Harvest ready effects */}
      {isReady && (
        <>
          {/* Golden glow */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ boxShadow: 'inset 0 0 30px rgba(255,200,50,0.5)' }}
          />
          {/* Harvest badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 rounded-full p-1 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
          >
            <Scissors className="w-3 h-3 text-amber-900" />
          </motion.div>
          {/* Sparkles */}
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-xs pointer-events-none"
              style={{ left: `${10 + i * 18}%`, top: `${5 + (i % 3) * 15}%` }}
              animate={{ opacity: [0, 1, 0], y: [0, -10, -20], scale: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.35 }}
            >
              ✨
            </motion.span>
          ))}
          {/* Harvest label */}
          <div className="absolute bottom-[10%] left-[10%] right-[10%]">
            <motion.div
              className="rounded-lg px-2 py-1 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.9), rgba(245,158,11,0.9))' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <p className="text-[8px] font-extrabold text-amber-900">🎉 Harvest!</p>
            </motion.div>
          </div>
        </>
      )}

      {/* Plant name label */}
      <div className="text-center mt-0.5">
        <p className="text-[9px] font-extrabold text-foreground">{plant.plantName}</p>
      </div>
    </motion.div>
  );
}
