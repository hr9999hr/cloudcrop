import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HarvestPopupProps {
  open: boolean;
  plantName: string;
  emoji: string;
  coins: number;
  onClose: () => void;
}

export function HarvestPopup({ open, plantName, emoji, coins, onClose }: HarvestPopupProps) {
  if (!open) return null;

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
          initial={{ scale: 0.5, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-card rounded-2xl p-8 max-w-sm mx-4 shadow-2xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
            className="text-7xl mb-4"
          >
            {emoji}
          </motion.div>
          <h2 className="text-2xl font-extrabold text-foreground mb-1">🎉 Congratulations!</h2>
          <p className="text-muted-foreground text-sm mb-4">
            You harvested <span className="font-bold text-foreground">{plantName}</span>!
          </p>
          <div className="gradient-coin rounded-xl p-3 mb-6 inline-flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="text-xl font-extrabold">+{coins} CC Coins</span>
          </div>
          <div className="space-y-2">
            <Button onClick={onClose} className="w-full gradient-farm text-primary-foreground font-bold rounded-xl py-5">
              Plant Next Crop 🌱
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
