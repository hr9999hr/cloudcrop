import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import ccCoin from "@/assets/cc-coin.png";
import { SEED_OPTIONS } from "@/store/gameStore";
import { formatDuration } from "@/lib/formatDuration";

interface SeedDetailPopupProps {
  open: boolean;
  seedName: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

const plantDescriptions: Record<string, string> = {
  Kangkung: 'Water spinach thrives in wet conditions. The ultimate beginner crop — fast and cheap!',
  Sawi: 'Mustard greens prefer cool weather. Low risk, steady income for casual players.',
  Bayam: 'Spinach grows quickly in warm soil. Similar to Sawi, adds variety to your garden.',
  Timun: 'Cucumbers need plenty of water and warm weather. Mid-tier crop with good balance.',
  Bendi: 'Okra loves heat and sunshine. A solid mid-tier crop with reliable returns.',
  Tomato: 'Tomatoes grow best in warm weather with consistent watering. Kids love watching them turn red!',
  'Kacang Panjang': 'Long beans climb and grow tall. Takes a full week but great for daily players.',
  'Cili Padi': "Bird's eye chili — the iconic Malaysian crop. High-value and fiery!",
  Terung: 'Eggplant requires patience and rich soil. Premium crop with heavy payout.',
  Labu: 'Pumpkin is the "Boss" crop! Takes two weeks but the payout is massive.',
};

export function SeedDetailPopup({ open, seedName, onConfirm, onClose }: SeedDetailPopupProps) {
  if (!open || !seedName) return null;

  const seedOption = SEED_OPTIONS.find((s) => seedName.includes(s.name));
  if (!seedOption) return null;

  const durationLabel = formatDuration(seedOption.durationMs);

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
          <h2 className="text-xl font-extrabold text-foreground mb-4">{seedOption.name}</h2>

          {/* Seed to Harvest visual */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-muted rounded-xl p-4 flex flex-col items-center min-w-[100px]">
              <span className="text-4xl mb-1">🌱</span>
              <p className="text-xs font-bold text-muted-foreground">Seedling</p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
            <div className="bg-muted rounded-xl p-4 flex flex-col items-center min-w-[100px]">
              <span className="text-4xl mb-1">{seedOption.emoji}</span>
              <p className="text-xs font-bold text-muted-foreground">{seedOption.name}</p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-muted rounded-xl p-4 mb-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {plantDescriptions[seedOption.name] || seedOption.description}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <img src={ccCoin} alt="CC" className="w-4 h-4" />
              <span className="font-bold text-foreground">{seedOption.costCC} CC</span>
              <span className="text-muted-foreground">seed cost</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-bold text-foreground">{durationLabel}</span>
              <span className="text-muted-foreground">growth time</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <img src={ccCoin} alt="CC" className="w-4 h-4" />
              <span className="font-bold text-foreground">{seedOption.yieldCoins} CC</span>
              <span className="text-muted-foreground">harvest yield</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Net profit:</span>
              <span className="font-bold text-primary">{seedOption.yieldCoins - seedOption.costCC} CC</span>
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
