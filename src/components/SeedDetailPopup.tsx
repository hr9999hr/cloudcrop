import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import ccCoin from "@/assets/cc-coin.png";
import { SEED_OPTIONS } from "@/store/gameStore";

interface SeedDetailPopupProps {
  open: boolean;
  seedName: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

// Map seed to harvest emoji
const harvestEmojis: Record<string, string> = {
  Tomato: '🍅',
  Carrot: '🥕',
  Lettuce: '🥬',
  Corn: '🌽',
  Chili: '🌶️',
};

const seedEmojis: Record<string, string> = {
  Tomato: '🌱',
  Carrot: '🌱',
  Lettuce: '🌱',
  Corn: '🌱',
  Chili: '🌱',
};

const plantDescriptions: Record<string, string> = {
  Tomato: 'Tomatoes grow best in warm weather with consistent watering. They need full sunlight and well-drained soil.',
  Carrot: 'Carrots prefer cool weather and loose, sandy soil. Keep the soil moist but not waterlogged for best results.',
  Lettuce: 'Lettuce thrives in cool conditions with partial shade. It grows quickly and is great for beginners.',
  Corn: 'Corn needs full sun and rich soil. It grows tall and requires plenty of water during hot weather.',
  Chili: 'Chili peppers love heat and sunshine. They need warm soil and regular watering for a spicy harvest.',
};

export function SeedDetailPopup({ open, seedName, onConfirm, onClose }: SeedDetailPopupProps) {
  if (!open || !seedName) return null;

  const seedOption = SEED_OPTIONS.find((s) => seedName.includes(s.name));
  if (!seedOption) return null;

  const durationMin = (seedOption.durationMs / 60000).toFixed(1);

  return (
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
          <h2 className="text-xl font-extrabold text-foreground mb-4">{seedOption.name} Tree</h2>

          {/* Seed to Harvest visual */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-muted rounded-xl p-4 flex flex-col items-center min-w-[100px]">
              <span className="text-4xl mb-1">{seedEmojis[seedOption.name] || '🌱'}</span>
              <p className="text-xs font-bold text-muted-foreground">Seedling</p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
            <div className="bg-muted rounded-xl p-4 flex flex-col items-center min-w-[100px]">
              <span className="text-4xl mb-1">{harvestEmojis[seedOption.name] || seedOption.emoji}</span>
              <p className="text-xs font-bold text-muted-foreground">{seedOption.name} Plant</p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-muted rounded-xl p-4 mb-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {plantDescriptions[seedOption.name] || 'A wonderful crop to grow!'}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-bold text-foreground">{durationMin} minutes</span>
              <span className="text-muted-foreground">growth time</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <img src={ccCoin} alt="CC" className="w-4 h-4" />
              <span className="font-bold text-foreground">{seedOption.yieldCoins} CC coins</span>
              <span className="text-muted-foreground">when sold</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="rounded-xl gradient-farm text-primary-foreground font-bold">
              Plant it 🌱
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
