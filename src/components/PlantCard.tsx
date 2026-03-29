import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { PlantSlot } from "@/store/gameStore";

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

// Diamond clip path for isometric look
const DIAMOND_CLIP = 'polygon(50% 0%, 100% 40%, 50% 80%, 0% 40%)';

export function PlantCard({ plant, onPlant, onHarvest, onPlantClick }: PlantCardProps) {
  // === EMPTY PLOT ===
  if (plant.status === 'empty') {
    return (
      <motion.div
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer relative w-full h-full"
        onClick={() => onPlant(plant.id)}
      >
        {/* Diamond soil shape */}
        <div
          className="w-full h-full relative"
          style={{
            clipPath: DIAMOND_CLIP,
            background: 'linear-gradient(160deg, hsl(28 55% 48%), hsl(22 50% 35%))',
            boxShadow: '0 6px 20px hsla(0 0% 0% / 0.3)',
          }}
        >
          {/* Tilled rows */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 6px, hsla(25 40% 25% / 0.4) 6px, hsla(25 40% 25% / 0.4) 7px)',
            }}
          />
          {/* Highlight edge */}
          <div className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(135deg, hsla(0 0% 100% / 0.3) 0%, transparent 40%, transparent 60%, hsla(0 0% 0% / 0.2) 100%)',
            }}
          />
        </div>
        {/* Border glow around diamond */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: DIAMOND_CLIP,
            border: 'none',
            boxShadow: 'inset 0 0 0 2px hsla(30 50% 55% / 0.5)',
          }}
        />
        {/* Plant label */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: '20%' }}>
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1"
          >
            <p className="text-[10px] font-extrabold text-white drop-shadow-md">+ Plant</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // === GROWING / READY ===
  const isReady = plant.status === 'ready';
  const cropImage = getCropImage(plant.plantName, plant.progress);
  const growthLabel = getGrowthLabel(plant.progress);

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer relative w-full h-full"
      onClick={() => isReady ? onHarvest(plant.id) : onPlantClick?.(plant)}
    >
      {/* Diamond soil shape */}
      <div
        className="w-full h-full relative"
        style={{
          clipPath: DIAMOND_CLIP,
          background: isReady
            ? 'linear-gradient(160deg, hsl(40 65% 50%), hsl(30 55% 38%))'
            : 'linear-gradient(160deg, hsl(28 55% 48%), hsl(22 50% 35%))',
        }}
      >
        {/* Tilled rows */}
        <div className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 6px, hsla(25 40% 25% / 0.4) 6px, hsla(25 40% 25% / 0.4) 7px)',
          }}
        />
        {/* Edge highlight */}
        <div className="absolute inset-0 opacity-15"
          style={{
            background: 'linear-gradient(135deg, hsla(0 0% 100% / 0.3) 0%, transparent 40%, transparent 60%, hsla(0 0% 0% / 0.2) 100%)',
          }}
        />
        {/* Ready golden overlay */}
        {isReady && (
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ background: 'hsla(45 90% 60% / 0.3)' }}
          />
        )}
      </div>

      {/* Crop image - positioned above the diamond */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: '18%' }}>
        <motion.img
          src={cropImage}
          alt={plant.plantName || 'Growing crop'}
          className="w-[55%] h-[55%] object-contain drop-shadow-lg"
          style={{ filter: isReady ? 'drop-shadow(0 0 8px hsla(45 80% 50% / 0.5))' : undefined }}
          draggable={false}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: 1,
            scale: isReady ? [1, 1.06, 1] : 1,
          }}
          transition={isReady ? { repeat: Infinity, duration: 2 } : { duration: 0.4 }}
        />
      </div>

      {/* Progress indicator */}
      {!isReady && (
        <div className="absolute bottom-[5%] left-[20%] right-[20%]">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsla(0 0% 0% / 0.35)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(120 60% 50%), hsl(60 80% 55%))' }}
              animate={{ width: `${plant.progress}%` }}
            />
          </div>
          <p className="text-[7px] font-extrabold text-white text-center mt-0.5 drop-shadow-md">
            {Math.round(plant.progress)}%
          </p>
        </div>
      )}

      {/* Harvest effects */}
      {isReady && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-[10%] right-[15%] rounded-full p-1 shadow-lg z-10"
            style={{ background: 'linear-gradient(135deg, hsl(45 90% 55%), hsl(35 85% 45%))' }}
          >
            <Scissors className="w-2.5 h-2.5 text-amber-900" />
          </motion.div>
          {[...Array(4)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-[10px] pointer-events-none z-10"
              style={{ left: `${20 + i * 18}%`, top: `${8 + (i % 2) * 15}%` }}
              animate={{ opacity: [0, 1, 0], y: [0, -8, -16], scale: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
            >
              ✨
            </motion.span>
          ))}
          <div className="absolute bottom-[8%] left-[15%] right-[15%] z-10">
            <motion.div
              className="rounded-md px-1 py-0.5 text-center"
              style={{ background: 'linear-gradient(135deg, hsla(45 90% 55% / 0.9), hsla(35 85% 45% / 0.9))' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <p className="text-[7px] font-extrabold text-amber-900">Harvest!</p>
            </motion.div>
          </div>
        </>
      )}

      {/* Plant name below diamond */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <p className="text-[8px] font-extrabold text-white drop-shadow-md">{plant.plantName}</p>
      </div>
    </motion.div>
  );
}
