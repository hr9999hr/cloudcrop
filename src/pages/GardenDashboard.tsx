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
import { FarmDecorations } from "@/components/farm/FarmDecorations";

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

      {/* Hay Day-style Isometric Farm */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          aspectRatio: '4 / 3.5',
        }}
      >
        {/* Farm background image */}
        <img
          src={farmBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        {/* Weather tint overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: weather === 'rainy'
              ? 'rgba(50, 70, 80, 0.35)'
              : weather === 'monsoon'
              ? 'rgba(30, 50, 60, 0.5)'
              : weather === 'heatwave'
              ? 'rgba(120, 90, 20, 0.2)'
              : 'rgba(0,0,0,0)',
          }}
        />

        {/* Weather effects overlay */}
        <WeatherEffects weather={weather} />

        {/* Farm decorations */}
        <FarmDecorations weather={weather} />

        {/* Farm label */}
        <div className="absolute top-3 left-0 right-0 z-20 flex justify-center">
          <span className="text-xs font-extrabold text-white/90 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
            🌾 Farm Plots — Level {farmerLevel}
          </span>
        </div>

        {/* Manual coordinate-mapped plant slots */}
        {(() => {
          // Diamond layout: 9 slots mapped to bg soil pits (% of container)
          const SLOT_POSITIONS = [
            { left: 50, top: 18 },   // 0: top center
            { left: 36, top: 28 },   // 1: row 2 left
            { left: 64, top: 28 },   // 2: row 2 right
            { left: 22, top: 38 },   // 3: row 3 far left
            { left: 50, top: 38 },   // 4: row 3 center
            { left: 78, top: 38 },   // 5: row 3 far right
            { left: 36, top: 48 },   // 6: row 4 left
            { left: 64, top: 48 },   // 7: row 4 right
            { left: 50, top: 58 },   // 8: bottom center
          ];
          const slotW = 18; // % of container width
          const slotH = 16; // % of container height

          const allSlots = [
            ...plants.map((p) => ({ type: 'active' as const, plant: p })),
            ...Array.from({ length: maxSlots - plants.length }, () => ({ type: 'locked' as const, plant: null })),
          ];

          return allSlots.map((slot, idx) => {
            if (idx >= SLOT_POSITIONS.length) return null;
            const pos = SLOT_POSITIONS[idx];

            if (slot.type === 'active' && slot.plant) {
              return (
                <motion.div
                  key={slot.plant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="absolute z-10"
                  style={{
                    left: `${pos.left - slotW / 2}%`,
                    top: `${pos.top - slotH / 2}%`,
                    width: `${slotW}%`,
                    height: `${slotH}%`,
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
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="absolute z-10 flex flex-col items-center justify-center"
                style={{
                  left: `${pos.left - slotW / 2}%`,
                  top: `${pos.top - slotH / 2}%`,
                  width: `${slotW}%`,
                  height: `${slotH}%`,
                }}
              >
                <Lock className="w-5 h-5 text-white/40" />
                <p className="text-[8px] font-bold text-white/40 mt-0.5">Lv.{farmerLevel + 1}</p>
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
