import { useState, useEffect, useRef } from "react";
import { useGameStore, PlantSlot, LEVEL_CONFIG, getWeatherInfo } from "@/store/gameStore";
import { PlantCard } from "@/components/PlantCard";
import { WelcomePopup } from "@/components/WelcomePopup";
import { PlantSelectionDialog } from "@/components/PlantSelectionDialog";
import { HarvestPopup } from "@/components/HarvestPopup";
import { PlantDetailPopup } from "@/components/PlantDetailPopup";
import { LevelUpPopup } from "@/components/LevelUpPopup";
import { motion } from "framer-motion";
import { Star, Lock } from "lucide-react";
import logo from "@/assets/logo.png";

import farmBg from "@/assets/farm/farm-bg.jpg";
import { WeatherEffects } from "@/components/farm/WeatherEffects";


export default function GardenDashboard() {
  const { plants, updateProgress, farmerLevel, totalHarvests, weather } = useGameStore();
  const weatherInfo = getWeatherInfo(weather);
  const [plantDialogSlot, setPlantDialogSlot] = useState<number | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantSlot | null>(null);
  const [harvestSlot, setHarvestSlot] = useState<{ slotId: number; plantName: string; emoji: string; yieldCoins: number; quantity: number } | null>(null);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const prevLevel = useRef(farmerLevel);
  const isInitialLoad = useRef(true);

  const harvestPlant = useGameStore((s) => s.harvestPlant);

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [updateProgress]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      prevLevel.current = farmerLevel;
      return;
    }
    if (farmerLevel > prevLevel.current) {
      setLevelUpLevel(farmerLevel);
    }
    prevLevel.current = farmerLevel;
  }, [farmerLevel]);

  const currentLevelCfg = LEVEL_CONFIG.find(c => c.level === farmerLevel)!;
  const nextLevelCfg = LEVEL_CONFIG.find(c => c.level === farmerLevel + 1);
  const progressToNext = nextLevelCfg
    ? ((totalHarvests - currentLevelCfg.harvestsNeeded) / (nextLevelCfg.harvestsNeeded - currentLevelCfg.harvestsNeeded)) * 100
    : 100;

  const handleHarvest = (slotId: number) => {
    const plant = plants.find(p => p.id === slotId);
    if (!plant || plant.status !== 'ready') return;
    const healthFactor = Math.max(0.3, (plant.health ?? 100) / 100);
    const quantity = Math.max(1, Math.floor((plant.progress / 20) * healthFactor));
    setHarvestSlot({ slotId, plantName: plant.plantName || '', emoji: plant.plantEmoji || '', yieldCoins: plant.yieldCoins, quantity });
  };

  const handleSell = () => { if (harvestSlot) harvestPlant(harvestSlot.slotId, 'sell'); };
  const handleBag = () => { if (harvestSlot) harvestPlant(harvestSlot.slotId, 'bag'); };

  const handlePlantClick = (plant: PlantSlot) => {
    if (plant.status === 'growing' || plant.status === 'ready') setSelectedPlant(plant);
  };

  const maxSlots = nextLevelCfg ? nextLevelCfg.slots : currentLevelCfg.slots;

  return (
    <div className="max-w-2xl mx-auto">
      <WelcomePopup />

      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <img src={logo} alt="CloudCrop" className="h-12 w-12 rounded-2xl shadow-lg" />
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-foreground">My Farm 🌾</h1>
          <p className="text-[11px] text-muted-foreground">Grow crops, harvest & earn!</p>
        </div>
      </div>

      {/* Level Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-xl p-3 border border-border shadow-sm bg-card"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="rounded-full p-1.5" style={{ background: 'linear-gradient(135deg, hsl(45 80% 55%), hsl(35 90% 45%))' }}>
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-foreground">Level {farmerLevel}</p>
              <p className="text-[10px] text-muted-foreground">{totalHarvests} harvests</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-primary">{plants.length} plots</p>
            {nextLevelCfg && (
              <p className="text-[10px] text-muted-foreground">{nextLevelCfg.harvestsNeeded - totalHarvests} to Lv.{nextLevelCfg.level}</p>
            )}
          </div>
        </div>
        <div className="w-full rounded-full h-2 overflow-hidden bg-muted">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, hsl(120 50% 45%), hsl(80 70% 50%))' }}
            animate={{ width: `${Math.min(100, progressToNext)}%` }}
          />
        </div>
      </motion.div>

      {/* Weather Banner */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-xl p-2.5 border border-border shadow-sm bg-card flex items-center gap-3"
      >
        <span className="text-2xl">{weatherInfo.label.split(' ')[0]}</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{weatherInfo.label}</p>
          <p className="text-[10px] text-muted-foreground">{weatherInfo.desc}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-primary">💧 {weatherInfo.waterNeeded} water</p>
          <p className="text-[10px] text-muted-foreground">needed today</p>
        </div>
      </motion.div>

      {/* Isometric 3D Farm Scene */}
      <div className="relative w-full" style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Farm background image — contains the full scene with soil grid baked in */}
        <img
          src={farmBg}
          alt="Farm"
          className="w-full h-auto"
          draggable={false}
          width={1024}
          height={1024}
          style={{ borderRadius: 16 }}
        />

        {/* Weather tint overlay */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: 16,
            background: weather === 'rainy'
              ? 'rgba(50, 70, 80, 0.3)'
              : weather === 'monsoon'
              ? 'rgba(30, 50, 60, 0.45)'
              : weather === 'heatwave'
              ? 'rgba(120, 90, 20, 0.15)'
              : 'rgba(0,0,0,0)',
          }}
        />

        {/* Weather effects */}
        <div className="absolute inset-0" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <WeatherEffects weather={weather} />
        </div>

        {/* Farm label floating at top */}
        <div className="absolute z-20 flex justify-center" style={{ top: '2%', left: 0, right: 0 }}>
          <span className="text-[11px] font-extrabold text-white bg-black/40 px-4 py-1 rounded-full backdrop-blur-md shadow-lg border border-white/10">
            🌾 Farm Plots — Level {farmerLevel}
          </span>
        </div>

        {/* Interactive isometric grid overlay — each slot manually positioned on soil pits */}
        {(() => {
          const allSlots = [
            ...plants.map((p) => ({ type: 'active' as const, plant: p })),
            ...Array.from({ length: maxSlots - plants.length }, () => ({ type: 'locked' as const, plant: null })),
          ];
          const slots = allSlots.slice(0, 9);

          // Manually mapped positions (% of image) for each of the 9 soil pits
          // Row 0 (top): slots 0,1,2
          // Row 1 (mid): slots 3,4,5
          // Row 2 (bot): slots 6,7,8
          const slotPositions = [
            // row 0
            { left: 37, top: 18, w: 18, h: 16 }, // slot 0 - top center
            { left: 50, top: 25, w: 18, h: 16 }, // slot 1 - top right
            { left: 63, top: 32, w: 18, h: 16 }, // slot 2 - right
            // row 1
            { left: 24, top: 25, w: 18, h: 16 }, // slot 3 - left
            { left: 37, top: 32, w: 18, h: 16 }, // slot 4 - center
            { left: 50, top: 39, w: 18, h: 16 }, // slot 5 - mid right
            // row 2
            { left: 11, top: 32, w: 18, h: 16 }, // slot 6 - bottom left
            { left: 24, top: 39, w: 18, h: 16 }, // slot 7 - bottom center
            { left: 37, top: 46, w: 18, h: 16 }, // slot 8 - bottom right
          ];

          return slots.map((slot, idx) => {
            const pos = slotPositions[idx];
            if (!pos) return null;
            const row = Math.floor(idx / 3);
            const col = idx % 3;

            if (slot.type === 'active' && slot.plant) {
              return (
                <motion.div
                  key={slot.plant.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    width: `${pos.w}%`,
                    height: `${pos.h}%`,
                    zIndex: 10 + row + col,
                  }}
                >
                  <PlantCard
                    plant={slot.plant}
                    onPlant={(id) => setPlantDialogSlot(id)}
                    onHarvest={handleHarvest}
                    onPlantClick={handlePlantClick}
                  />
                </motion.div>
              );
            }
            return (
              <motion.div
                key={`locked-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  width: `${pos.w}%`,
                  height: `${pos.h}%`,
                  zIndex: 10 + row + col,
                }}
              >
                <div className="bg-black/25 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md">
                  <Lock className="w-3.5 h-3.5 text-white/50 mx-auto" />
                  <p className="text-[7px] font-bold text-white/50 mt-0.5">Lv.{farmerLevel + 1}</p>
                </div>
              </motion.div>
            );
          });
        })()}
      </div>

      <PlantSelectionDialog open={plantDialogSlot !== null} slotId={plantDialogSlot || 0} onClose={() => setPlantDialogSlot(null)} />
      <PlantDetailPopup open={selectedPlant !== null} plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      <HarvestPopup
        open={harvestSlot !== null}
        plantName={harvestSlot?.plantName || ''}
        emoji={harvestSlot?.emoji || ''}
        yieldCoins={harvestSlot?.yieldCoins || 0}
        quantity={harvestSlot?.quantity || 0}
        onSell={handleSell}
        onBag={handleBag}
        onClose={() => setHarvestSlot(null)}
      />
      <LevelUpPopup open={levelUpLevel !== null} level={levelUpLevel || 1} onClose={() => setLevelUpLevel(null)} />
    </div>
  );
}
