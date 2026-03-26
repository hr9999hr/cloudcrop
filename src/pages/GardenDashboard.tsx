import { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { PlantCard } from "@/components/PlantCard";
import { WelcomePopup } from "@/components/WelcomePopup";
import { PlantSelectionDialog } from "@/components/PlantSelectionDialog";
import { HarvestPopup } from "@/components/HarvestPopup";
import logo from "@/assets/logo.png";

export default function GardenDashboard() {
  const { plants, updateProgress } = useGameStore();
  const [plantDialogSlot, setPlantDialogSlot] = useState<number | null>(null);
  const [harvestResult, setHarvestResult] = useState<{ open: boolean; plantName: string; emoji: string; coins: number }>({
    open: false, plantName: '', emoji: '', coins: 0,
  });

  const harvestPlant = useGameStore((s) => s.harvestPlant);

  // Update progress every second
  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [updateProgress]);

  const handleHarvest = (slotId: number) => {
    const result = harvestPlant(slotId);
    setHarvestResult({ open: true, ...result });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <WelcomePopup />

      <div className="mb-6 flex items-center gap-4">
        <img
          src={logo}
          alt="CloudCrop"
          className="h-16 w-16 md:h-20 md:w-20 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200"
          style={{ filter: 'drop-shadow(0 4px 12px hsla(142, 45%, 38%, 0.25))' }}
        />
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">My Garden 🌿</h1>
          <p className="text-sm text-muted-foreground">Grow crops, earn coins, feed the world!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onPlant={(id) => setPlantDialogSlot(id)}
            onHarvest={handleHarvest}
          />
        ))}
      </div>

      <PlantSelectionDialog
        open={plantDialogSlot !== null}
        slotId={plantDialogSlot || 0}
        onClose={() => setPlantDialogSlot(null)}
      />

      <HarvestPopup
        open={harvestResult.open}
        plantName={harvestResult.plantName}
        emoji={harvestResult.emoji}
        coins={harvestResult.coins}
        onClose={() => setHarvestResult((r) => ({ ...r, open: false }))}
      />
    </div>
  );
}
