import { useState, useEffect } from "react";
import { useGameStore, PlantSlot } from "@/store/gameStore";
import { PlantCard } from "@/components/PlantCard";
import { WelcomePopup } from "@/components/WelcomePopup";
import { PlantSelectionDialog } from "@/components/PlantSelectionDialog";
import { HarvestPopup } from "@/components/HarvestPopup";
import { PlantDetailPopup } from "@/components/PlantDetailPopup";
import logo from "@/assets/logo.png";

export default function GardenDashboard() {
  const { plants, updateProgress } = useGameStore();
  const [plantDialogSlot, setPlantDialogSlot] = useState<number | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantSlot | null>(null);
  const [harvestSlot, setHarvestSlot] = useState<{ slotId: number; plantName: string; emoji: string; yieldCoins: number; quantity: number } | null>(null);

  const harvestPlant = useGameStore((s) => s.harvestPlant);

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [updateProgress]);

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
            onPlantClick={handlePlantClick}
          />
        ))}
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
