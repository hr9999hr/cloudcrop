import { motion } from "framer-motion";
import { PlantSlot } from "@/store/gameStore";

import soilPlot from "@/assets/farm/soil-plot.png";
import stageSeedling from "@/assets/farm/stage-seedling.png";
import stageGrowing from "@/assets/farm/stage-growing.png";
import cropKangkung from "@/assets/farm/crop-kangkung.png";
import cropSawi from "@/assets/farm/crop-sawi.png";
import cropBayam from "@/assets/farm/crop-bayam.png";
import cropTimun from "@/assets/farm/crop-timun.png";
import cropBendi from "@/assets/farm/crop-bendi.png";
import cropTomato from "@/assets/farm/crop-tomato.png";
import cropKacangPanjang from "@/assets/farm/crop-kacang-panjang.png";
import cropCiliPadi from "@/assets/farm/crop-cili-padi.png";
import cropTerung from "@/assets/farm/crop-terung.png";
import cropLabu from "@/assets/farm/crop-labu.png";

interface PlantCardProps {
  plant: PlantSlot;
  onPlant: (slotId: number) => void;
  onHarvest: (slotId: number) => void;
  onPlantClick?: (plant: PlantSlot) => void;
}

const CROP_IMAGES: Record<string, string> = {
  Kangkung: cropKangkung,
  Sawi: cropSawi,
  Bayam: cropBayam,
  Timun: cropTimun,
  Bendi: cropBendi,
  Tomato: cropTomato,
  'Kacang Panjang': cropKacangPanjang,
  'Cili Padi': cropCiliPadi,
  Terung: cropTerung,
  Labu: cropLabu,
};

function getCropImage(plantName: string | null, progress: number): string {
  if (progress < 25) return stageSeedling;
  if (progress < 60) return stageGrowing;
  if (plantName && CROP_IMAGES[plantName]) return CROP_IMAGES[plantName];
  return stageGrowing;
}

export function PlantCard({ plant, onPlant, onHarvest, onPlantClick }: PlantCardProps) {
  // === DEAD PLANT ===
  if (plant.status === 'dead') {
    return (
      <motion.div
        whileHover={{ scale: 1.06, y: -3 }}
        whileTap={{ scale: 0.96 }}
        className="cursor-pointer relative w-full h-full flex items-center justify-center"
        onClick={() => onPlant(plant.id)}
      >
        <img src={soilPlot} alt="Dead plot" className="w-full h-auto drop-shadow-md opacity-60" draggable={false} loading="lazy" width={512} height={512} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md text-center">
            <p className="text-[10px] font-extrabold text-red-300">☠️ Dead</p>
            <p className="text-[8px] text-white/60">Tap to replant</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // === EMPTY PLOT ===
  if (plant.status === 'empty') {
    return (
      <motion.div
        whileHover={{ scale: 1.06, y: -3 }}
        whileTap={{ scale: 0.96 }}
        className="cursor-pointer relative w-full h-full flex items-center justify-center"
        onClick={() => onPlant(plant.id)}
      >
        <img src={soilPlot} alt="Empty plot" className="w-full h-auto drop-shadow-md" draggable={false} loading="lazy" width={512} height={512} />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="bg-white/25 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md"
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
  const cropScale = 0.6 + (plant.progress / 100) * 0.4;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.96 }}
      className="cursor-pointer relative w-full h-full flex items-center justify-center"
      style={{ overflow: 'visible' }}
      onClick={() => isReady ? onHarvest(plant.id) : onPlantClick?.(plant)}
    >
      <img
        src={soilPlot}
        alt=""
        className="w-full h-auto drop-shadow-md"
        draggable={false}
        loading="lazy"
        width={512}
        height={512}
        style={{ filter: isReady ? 'brightness(1.05)' : undefined }}
      />

      <motion.img
        src={cropImage}
        alt={plant.plantName || 'Growing crop'}
        className="absolute drop-shadow-lg pointer-events-none"
        style={{
          width: '75%',
          bottom: '25%',
          left: '12.5%',
          zIndex: 10,
          filter: isReady ? 'drop-shadow(0 0 6px hsla(45 90% 55% / 0.5))' : undefined,
          transform: `scale(${cropScale})`,
          transformOrigin: 'bottom center',
        }}
        draggable={false}
        loading="lazy"
        width={512}
        height={512}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: 1,
          scale: isReady ? [cropScale, cropScale * 1.04, cropScale] : cropScale,
        }}
        transition={isReady ? { repeat: Infinity, duration: 2 } : { duration: 0.4 }}
      />

      {/* Progress bar */}
      {!isReady && (
        <div className="absolute bottom-[2%] left-[15%] right-[15%]" style={{ zIndex: 20 }}>
          {/* Health bar */}
          <div className="h-1 rounded-full overflow-hidden mb-0.5" style={{ background: 'hsla(0 0% 0% / 0.3)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: (plant.health ?? 100) >= 50 ? 'hsl(0 70% 60%)' : 'hsl(0 80% 45%)' }}
              animate={{ width: `${plant.health ?? 100}%` }}
            />
          </div>
          {/* Growth bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsla(0 0% 0% / 0.3)' }}>
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
          {[...Array(4)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-[10px] pointer-events-none z-10"
              style={{ left: `${15 + i * 20}%`, top: `${5 + (i % 2) * 12}%` }}
              animate={{ opacity: [0, 1, 0], y: [0, -8, -16], scale: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
            >
              ✨
            </motion.span>
          ))}
          <div className="absolute bottom-[2%] left-[15%] right-[15%]" style={{ zIndex: 50 }}>
            <motion.div
              className="rounded-md px-1 py-0.5 text-center"
              style={{ background: 'linear-gradient(135deg, hsla(45 90% 55% / 0.9), hsla(35 85% 45% / 0.9))' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <p className="text-[8px] font-extrabold text-amber-900">Harvest!</p>
            </motion.div>
          </div>
        </>
      )}

      {/* Plant name + emoji below */}
      <div className="absolute -bottom-[10%] left-0 right-0 text-center" style={{ zIndex: 50 }}>
        <p className="text-[8px] font-extrabold text-white drop-shadow-md">
          {plant.plantEmoji} {plant.plantName}
        </p>
      </div>
    </motion.div>
  );
}
