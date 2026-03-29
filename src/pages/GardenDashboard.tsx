import { useState, useEffect } from "react";
import { useGameStore, PlantSlot, LEVEL_CONFIG } from "@/store/gameStore";
import { PlantCard } from "@/components/PlantCard";
import { WelcomePopup } from "@/components/WelcomePopup";
import { PlantSelectionDialog } from "@/components/PlantSelectionDialog";
import { HarvestPopup } from "@/components/HarvestPopup";
import { PlantDetailPopup } from "@/components/PlantDetailPopup";
import { motion } from "framer-motion";
import { TreePine, Star, Lock } from "lucide-react";
import logo from "@/assets/logo.png";

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

  const handleSell = () => {
    if (harvestSlot) harvestPlant(harvestSlot.slotId, 'sell');
  };

  const handleBag = () => {
    if (harvestSlot) harvestPlant(harvestSlot.slotId, 'bag');
  };

  const handlePlantClick = (plant: PlantSlot) => {
    if (plant.status === 'growing' || plant.status === 'ready') {
      setSelectedPlant(plant);
    }
  };

  // Show locked slots for next level preview
  const maxSlots = nextLevelCfg ? nextLevelCfg.slots : currentLevelCfg.slots;

  return (
    <div className="max-w-2xl mx-auto">
      <WelcomePopup />

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <img
          src={logo}
          alt="CloudCrop"
          className="h-14 w-14 rounded-2xl shadow-lg"
        />
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-foreground">My Farm 🌿</h1>
          <p className="text-xs text-muted-foreground">Grow crops, earn coins, feed the world!</p>
        </div>
      </div>

      {/* Level & XP Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 bg-card border border-border rounded-2xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-full p-2">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-foreground">Farmer Level {farmerLevel}</p>
              <p className="text-[10px] text-muted-foreground">{totalHarvests} total harvests</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-primary">{plants.length} slots</p>
            {nextLevelCfg && (
              <p className="text-[10px] text-muted-foreground">
                {nextLevelCfg.harvestsNeeded - totalHarvests} more to Lv.{nextLevelCfg.level}
              </p>
            )}
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${Math.min(100, progressToNext)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {LEVEL_CONFIG.map(cfg => (
            <span key={cfg.level} className={`text-[9px] font-bold ${farmerLevel >= cfg.level ? 'text-primary' : 'text-muted-foreground'}`}>
              Lv.{cfg.level} ({cfg.slots} plots)
            </span>
          ))}
        </div>
      </motion.div>

      {/* Farm Grid */}
      <div className="relative bg-gradient-to-b from-[hsl(var(--sky))]/30 to-[hsl(var(--growth))]/10 rounded-2xl p-4 border border-border">
        {/* Decorative fence top */}
        <div className="flex items-center gap-2 mb-3">
          <TreePine className="w-4 h-4 text-primary/60" />
          <div className="flex-1 h-px bg-[hsl(var(--earth-light))]" />
          <span className="text-xs font-bold text-muted-foreground">🌾 Farm Plots</span>
          <div className="flex-1 h-px bg-[hsl(var(--earth-light))]" />
          <TreePine className="w-4 h-4 text-primary/60" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {plants.map((plant) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: plant.id * 0.05 }}
            >
              <PlantCard
                plant={plant}
                onPlant={(id) => setPlantDialogSlot(id)}
                onHarvest={handleHarvest}
                onPlantClick={handlePlantClick}
              />
            </motion.div>
          ))}

          {/* Locked slots preview */}
          {Array.from({ length: maxSlots - plants.length }, (_, i) => (
            <motion.div
              key={`locked-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full aspect-square rounded-xl bg-muted/50 border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center"
            >
              <Lock className="w-5 h-5 text-muted-foreground/30 mb-1" />
              <p className="text-[9px] text-muted-foreground/40 font-bold">Lv.{farmerLevel + 1}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <PlantSelectionDialog
        open={plantDialogSlot !== null}
        slotId={plantDialogSlot || 0}
        onClose={() => setPlantDialogSlot(null)}
      />

      <PlantDetailPopup
        open={selectedPlant !== null}
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
      />

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
