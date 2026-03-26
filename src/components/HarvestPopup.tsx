import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package } from "lucide-react";
import ccCoin from "@/assets/cc-coin.png";

interface HarvestPopupProps {
  open: boolean;
  plantName: string;
  emoji: string;
  yieldCoins: number;
  quantity: number;
  onSell: () => void;
  onBag: () => void;
  onClose: () => void;
}

export function HarvestPopup({ open, plantName, emoji, yieldCoins, quantity, onSell, onBag, onClose }: HarvestPopupProps) {
  const [action, setAction] = useState<'choose' | 'sold' | 'bagged'>('choose');

  if (!open) return null;

  const handleSell = () => {
    onSell();
    setAction('sold');
  };

  const handleBag = () => {
    onBag();
    setAction('bagged');
  };

  const handleClose = () => {
    setAction('choose');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
        onClick={handleClose}
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
            You harvested <span className="font-bold text-foreground">{quantity}x {plantName}</span>!
          </p>

          {action === 'choose' && (
            <div className="space-y-3">
              <div className="bg-muted rounded-xl p-3 mb-2">
                <p className="text-xs text-muted-foreground mb-1">Sell value</p>
                <div className="flex items-center justify-center gap-2">
                  <img src={ccCoin} alt="CC" className="w-6 h-6" />
                  <span className="text-xl font-extrabold text-coin">+{yieldCoins} CC</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleBag} variant="outline" className="rounded-xl py-5 font-bold">
                  <Package className="w-4 h-4 mr-1" /> Put in Bag
                </Button>
                <Button onClick={handleSell} className="rounded-xl py-5 font-bold gradient-coin">
                  <ShoppingCart className="w-4 h-4 mr-1" /> Sell
                </Button>
              </div>
            </div>
          )}

          {action === 'sold' && (
            <div className="space-y-3">
              <div className="gradient-coin rounded-xl p-3 inline-flex items-center gap-2">
                <img src={ccCoin} alt="CC" className="w-6 h-6" />
                <span className="text-xl font-extrabold">+{yieldCoins} CC Coins</span>
              </div>
              <p className="text-sm text-muted-foreground">Coins added to your wallet!</p>
              <Button onClick={handleClose} className="w-full gradient-farm text-primary-foreground font-bold rounded-xl py-5">
                Choose Next Plant 🌱
              </Button>
            </div>
          )}

          {action === 'bagged' && (
            <div className="space-y-3">
              <div className="bg-primary/10 rounded-xl p-3 inline-flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <span className="text-lg font-extrabold text-primary">{quantity}x {plantName} added to inventory</span>
              </div>
              <Button onClick={handleClose} className="w-full gradient-farm text-primary-foreground font-bold rounded-xl py-5">
                Choose Next Plant 🌱
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
