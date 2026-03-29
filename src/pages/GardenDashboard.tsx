import { useState, useEffect } from "react";
import { useGameStore, PlantSlot, LEVEL_CONFIG } from "@/store/gameStore";
import { PlantCard } from "@/components/PlantCard";
import { WelcomePopup } from "@/components/WelcomePopup";
import { PlantSelectionDialog } from "@/components/PlantSelectionDialog";
import { HarvestPopup } from "@/components/HarvestPopup";
import { PlantDetailPopup } from "@/components/PlantDetailPopup";
import { motion } from "framer-motion";
import { Star, Lock } from "lucide-react";
import logo from "@/assets/logo.png";
import soilPlot from "@/assets/farm/soil-plot.png";

export default function GardenDashboard() {
  const { plants, updateProgress, farmerLevel, totalHarvests } = useGameStore();
  const [plantDialogSlot, setPlantDialogSlot] = useState<number | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantSlot | null>(null);
  const [harvestSlot, setHarvestSlot] = useState<{ slotId: number; plantName: string; emoji: string; yieldCoins: number; quantity: number } | null>(null);

  const harvestPlant = useGameStore((s) => s.harvestPlant);

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [updateProgress]);

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

      {/* Hay Day-style Farm Scene */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(170deg, hsl(90 60% 58%) 0%, hsl(100 55% 45%) 50%, hsl(105 48% 38%) 100%)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          padding: '1rem',
          minHeight: '460px',
        }}
      >
        {/* Grass texture overlay */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(hsl(80 70% 75%) 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }}
        />
        {/* Darker grass patches */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, hsl(100 40% 30%) 0%, transparent 50%), radial-gradient(circle at 70% 60%, hsl(90 40% 30%) 0%, transparent 40%)' }}
        />

        {/* Farm label */}
        <div className="relative z-10 flex justify-center mb-3">
          <span className="text-[11px] font-extrabold text-white/90 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
            🌾 Farm Plots — Level {farmerLevel}
          </span>
        </div>

        {/* Fenced farm area with isometric grid */}
        <div className="relative z-10 mx-auto" style={{ maxWidth: '500px' }}>
          {/* Fence / border around plots */}
          <div
            className="relative rounded-xl p-4"
            style={{
              background: 'linear-gradient(135deg, hsla(35 60% 45% / 0.25), hsla(30 50% 35% / 0.15))',
              border: '3px solid hsla(35 50% 40% / 0.35)',
              boxShadow: 'inset 0 2px 10px hsla(0 0% 0% / 0.1), 0 4px 20px hsla(0 0% 0% / 0.15)',
            }}
          >
            {/* Dirt path texture inside fence */}
            <div className="absolute inset-0 rounded-xl opacity-[0.06]"
              style={{ backgroundImage: 'radial-gradient(hsla(30 40% 50% / 0.5) 2px, transparent 2px)', backgroundSize: '8px 8px' }}
            />

            {/* Grid of plots - standard flat grid, no extreme rotation */}
            <div
              className="grid gap-2 relative z-10"
              style={{
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            >
              {plants.map((plant) => (
                <motion.div
                  key={plant.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: plant.id * 0.08 }}
                  className="aspect-square"
                >
                  <PlantCard
                    plant={plant}
                    onPlant={(id) => setPlantDialogSlot(id)}
                    onHarvest={handleHarvest}
                    onPlantClick={handlePlantClick}
                  />
                </motion.div>
              ))}

              {/* Locked plots */}
              {Array.from({ length: maxSlots - plants.length }, (_, i) => (
                <motion.div
                  key={`locked-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="relative aspect-square rounded-lg overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsla(30 30% 50% / 0.3), hsla(30 20% 40% / 0.2))',
                    border: '2px dashed hsla(0 0% 100% / 0.15)',
                  }}
                >
                  <img src={soilPlot} alt="Locked plot" className="w-full h-full object-cover opacity-30 grayscale" loading="lazy" width={512} height={512} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Lock className="w-6 h-6 text-white/30" />
                    <p className="text-[9px] font-bold text-white/35 mt-1">Lv.{farmerLevel + 1}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative fence posts */}
          <div className="flex justify-between mt-2 px-2">
            <span className="text-lg">🌻</span>
            <span className="text-lg">🌻</span>
            <span className="text-lg">🌻</span>
          </div>
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
    </div>
  );
}
