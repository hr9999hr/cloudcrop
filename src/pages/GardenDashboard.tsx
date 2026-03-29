import { useState, useEffect, useRef } from "react";
import { useGameStore, PlantSlot, LEVEL_CONFIG } from "@/store/gameStore";
import { PlantCard } from "@/components/PlantCard";
import { WelcomePopup } from "@/components/WelcomePopup";
import { PlantSelectionDialog } from "@/components/PlantSelectionDialog";
import { HarvestPopup } from "@/components/HarvestPopup";
import { PlantDetailPopup } from "@/components/PlantDetailPopup";
import { LevelUpPopup } from "@/components/LevelUpPopup";
import { motion } from "framer-motion";
import { Star, Lock } from "lucide-react";
import logo from "@/assets/logo.png";
import soilPlot from "@/assets/farm/soil-plot.png";

export default function GardenDashboard() {
  const { plants, updateProgress, farmerLevel, totalHarvests } = useGameStore();
  const [plantDialogSlot, setPlantDialogSlot] = useState<number | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantSlot | null>(null);
  const [harvestSlot, setHarvestSlot] = useState<{ slotId: number; plantName: string; emoji: string; yieldCoins: number; quantity: number } | null>(null);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const prevLevel = useRef(farmerLevel);

  const harvestPlant = useGameStore((s) => s.harvestPlant);

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [updateProgress]);

  useEffect(() => {
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
    const quantity = Math.max(1, Math.floor(plant.progress / 20));
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

      {/* Hay Day-style Isometric Farm */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(170deg, hsl(85 55% 55%) 0%, hsl(95 50% 45%) 50%, hsl(100 45% 38%) 100%)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          padding: '2rem 1rem 1.5rem',
        }}
      >
        {/* Grass texture */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(hsl(80 70% 75%) 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }}
        />

        {/* Farm label */}
        <div className="relative z-10 flex justify-center mb-6">
          <span className="text-xs font-extrabold text-white/90 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
            🌾 Farm Plots — Level {farmerLevel}
          </span>
        </div>

        {/* Isometric diamond grid container */}
        <div className="relative z-10 flex justify-center">
          <div style={{ position: 'relative' }}>
            {/* Render all slots (active + locked) in an isometric diamond layout */}
            {(() => {
              const allSlots = [
                ...plants.map((p, i) => ({ type: 'active' as const, plant: p, index: i })),
                ...Array.from({ length: maxSlots - plants.length }, (_, i) => ({ type: 'locked' as const, plant: null, index: plants.length + i })),
              ];
              const cols = 3;
              const tileW = 120;
              const tileH = 70;
              const rows = Math.ceil(allSlots.length / cols);
              const containerW = (cols + 1) * tileW * 0.5 + tileW * 0.5;
              const containerH = rows * tileH + tileH;

              return (
                <div style={{ width: containerW, height: containerH, position: 'relative' }}>
                  {allSlots.map((slot, idx) => {
                    const row = Math.floor(idx / cols);
                    const col = idx % cols;
                    // Isometric position: convert grid (row, col) to screen (x, y)
                    const isoX = (col - row) * (tileW * 0.5) + containerW * 0.5 - tileW * 0.5;
                    const isoY = (col + row) * (tileH * 0.5) + 10;

                    if (slot.type === 'active' && slot.plant) {
                      return (
                        <motion.div
                          key={slot.plant.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          style={{
                            position: 'absolute',
                            left: isoX,
                            top: isoY,
                            width: tileW,
                            height: tileH + 30,
                            zIndex: row + col,
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
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 0.4 + idx * 0.06 }}
                        style={{
                          position: 'absolute',
                          left: isoX,
                          top: isoY,
                          width: tileW,
                          height: tileH + 30,
                          zIndex: row + col,
                        }}
                      >
                      <div className="w-full h-full relative">
                          <img src={soilPlot} alt="" className="w-full h-full object-contain opacity-30" draggable={false} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Lock className="w-5 h-5 text-white/40" />
                            <p className="text-[8px] font-bold text-white/40 mt-0.5">Lv.{farmerLevel + 1}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="relative z-10 flex justify-around mt-4 px-4">
          <span className="text-2xl">🌳</span>
          <span className="text-xl">🌻</span>
          <span className="text-lg">🐔</span>
          <span className="text-xl">🌻</span>
          <span className="text-2xl">🌳</span>
        </div>
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
