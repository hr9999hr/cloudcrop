import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SEED_OPTIONS, useGameStore } from "@/store/gameStore";
import { SeedDetailPopup } from "@/components/SeedDetailPopup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PlantSelectionDialogProps {
  open: boolean;
  slotId: number;
  onClose: () => void;
}

export function PlantSelectionDialog({ open, slotId, onClose }: PlantSelectionDialogProps) {
  const { plantSeed, inventory, coins } = useGameStore();
  const navigate = useNavigate();
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);

  const availableSeeds = inventory.filter((i) => i.category === 'seeds' && i.quantity > 0);
  const cheapestSeedCost = Math.min(...SEED_OPTIONS.map((s) => s.costCC));
  const cantAffordSeed = coins < cheapestSeedCost;

  const handleConfirmPlant = () => {
    if (!selectedSeed) return;
    const seedOption = SEED_OPTIONS.find((s) => selectedSeed.includes(s.name));
    if (!seedOption) return;

    plantSeed(slotId, seedOption.name, seedOption.emoji, seedOption.durationMs, seedOption.yieldCoins);
    setSelectedSeed(null);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9 }}
            className="bg-card rounded-2xl p-6 max-w-md mx-4 w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-extrabold text-foreground mb-1">Choose a Seed 🌱</h2>
            <p className="text-sm text-muted-foreground mb-4">Select from your inventory to plant</p>

            {availableSeeds.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl">🫗</span>
                <p className="text-sm text-muted-foreground mt-2">No seeds available! Visit the Marketplace to buy more.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableSeeds.map((seed) => {
                  const opt = SEED_OPTIONS.find((s) => seed.name.includes(s.name));
                  return (
                    <motion.div
                      key={seed.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 p-3 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => setSelectedSeed(seed.name)}
                    >
                      <span className="text-3xl">{seed.emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-foreground">{seed.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {opt ? (
                            <><span>⏱ {(opt.durationMs / 60000).toFixed(1)} min ·</span> <span>→ {opt.yieldCoins} CC</span></>
                          ) : null}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">x{seed.quantity}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <Button variant="outline" onClick={onClose} className="w-full mt-4 rounded-xl">
              Cancel
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <SeedDetailPopup
        open={selectedSeed !== null}
        seedName={selectedSeed}
        onConfirm={handleConfirmPlant}
        onClose={() => setSelectedSeed(null)}
      />
    </>
  );
}
