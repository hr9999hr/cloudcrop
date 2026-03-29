import { useState, useEffect } from "react";
import { useGameStore, PlantSlot, LEVEL_CONFIG } from "@/store/gameStore";
import { PlantCard } from "@/components/PlantCard";
import { WelcomePopup } from "@/components/WelcomePopup";
import { PlantSelectionDialog } from "@/components/PlantSelectionDialog";
import { HarvestPopup } from "@/components/HarvestPopup";
import { PlantDetailPopup } from "@/components/PlantDetailPopup";
import { motion } from "framer-motion";
import { Star, Lock, Fence } from "lucide-react";
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

  const maxSlots = nextLevelCfg ? nextLevelCfg.slots : currentLevelCfg.slots;

  return (
    <div className="max-w-2xl mx-auto">
      <WelcomePopup />

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <img src={logo} alt="CloudCrop" className="h-14 w-14 rounded-2xl shadow-lg" />
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-foreground">My Farm 🌾</h1>
          <p className="text-xs text-muted-foreground">Your Hay Day-style farm awaits!</p>
        </div>
      </div>

      {/* Level Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-2xl p-3 border border-border shadow-sm"
        style={{ background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(100 30% 95%) 100%)' }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="rounded-full p-1.5" style={{ background: 'linear-gradient(135deg, hsl(45 80% 55%), hsl(35 90% 45%))' }}>
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-foreground">Level {farmerLevel} Farmer</p>
              <p className="text-[10px] text-muted-foreground">{totalHarvests} harvests</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-primary">{plants.length} plots</p>
            {nextLevelCfg && (
              <p className="text-[10px] text-muted-foreground">
                {nextLevelCfg.harvestsNeeded - totalHarvests} to next
              </p>
            )}
          </div>
        </div>
        <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, hsl(120 50% 45%), hsl(80 70% 50%))' }}
            animate={{ width: `${Math.min(100, progressToNext)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {LEVEL_CONFIG.map(cfg => (
            <span key={cfg.level} className={`text-[9px] font-bold ${farmerLevel >= cfg.level ? 'text-primary' : 'text-muted-foreground/50'}`}>
              Lv.{cfg.level} • {cfg.slots} plots
            </span>
          ))}
        </div>
      </motion.div>

      {/* Farm Field - Hay Day style */}
      <div
        className="relative rounded-2xl p-5 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, hsl(95 50% 55%) 0%, hsl(100 45% 42%) 50%, hsl(105 40% 35%) 100%)',
          boxShadow: 'inset 0 2px 20px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        {/* Grass texture overlay */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, white 1px, transparent 1px),
              radial-gradient(circle at 60% 70%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
              radial-gradient(circle at 40% 90%, white 1px, transparent 1px)`,
            backgroundSize: '100px 80px, 80px 100px, 120px 60px, 60px 120px',
          }}
        />

        {/* Decorative wooden fence top */}
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <div className="flex items-center gap-1">
            <span className="text-lg">🌳</span>
            <span className="text-sm">🌿</span>
          </div>
          <div className="flex-1 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, hsl(30 50% 40%), hsl(35 45% 55%), hsl(30 50% 40%))' }} />
          <span className="text-xs font-extrabold text-white/80 px-2 py-0.5 rounded-full" style={{ background: 'hsla(30, 50%, 35%, 0.7)', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            🌾 Farm Plots
          </span>
          <div className="flex-1 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, hsl(30 50% 40%), hsl(35 45% 55%), hsl(30 50% 40%))' }} />
          <div className="flex items-center gap-1">
            <span className="text-sm">🌿</span>
            <span className="text-lg">🌳</span>
          </div>
        </div>

        {/* Plot grid */}
        <div className="grid grid-cols-3 gap-4 relative z-10">
          {plants.map((plant) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: plant.id * 0.08 }}
            >
              <PlantCard
                plant={plant}
                onPlant={(id) => setPlantDialogSlot(id)}
                onHarvest={handleHarvest}
                onPlantClick={handlePlantClick}
              />
            </motion.div>
          ))}

          {/* Locked slots */}
          {Array.from({ length: maxSlots - plants.length }, (_, i) => (
            <motion.div
              key={`locked-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="w-full aspect-square rounded-lg flex flex-col items-center justify-center"
                style={{
                  background: 'linear-gradient(180deg, hsla(30, 20%, 40%, 0.4) 0%, hsla(25, 25%, 30%, 0.4) 100%)',
                  border: '2px dashed hsla(30, 20%, 60%, 0.3)',
                }}
              >
                <Lock className="w-5 h-5 text-white/25 mb-0.5" />
                <p className="text-[9px] font-bold text-white/30">Lv.{farmerLevel + 1}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative bottom */}
        <div className="flex justify-center gap-2 mt-4 relative z-10">
          <span className="text-sm">🌻</span>
          <span className="text-xs">🌼</span>
          <span className="text-sm">🐝</span>
          <span className="text-xs">🌼</span>
          <span className="text-sm">🌻</span>
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
