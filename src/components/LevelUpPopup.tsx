import { motion, AnimatePresence } from "framer-motion";
import { Star, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEVEL_CONFIG } from "@/store/gameStore";

interface LevelUpPopupProps {
  open: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpPopup({ open, level, onClose }: LevelUpPopupProps) {
  const cfg = LEVEL_CONFIG.find((c) => c.level === level);
  const newSlots = cfg?.slots ?? 3;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-card rounded-2xl p-6 max-w-sm mx-4 w-full shadow-2xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti emojis */}
          <div className="flex justify-center gap-2 mb-2 text-2xl">
            <motion.span animate={{ y: [0, -10, 0], rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 1.5 }}>🎉</motion.span>
            <motion.span animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}>🎊</motion.span>
            <motion.span animate={{ y: [0, -10, 0], rotate: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>🎉</motion.span>
          </div>

          {/* Star badge */}
          <motion.div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, hsl(45 90% 55%), hsl(35 85% 45%))' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Star className="w-8 h-8 text-white" fill="white" />
          </motion.div>

          <h2 className="text-2xl font-extrabold text-foreground mb-1">Level Up!</h2>
          <p className="text-lg font-bold text-primary mb-2">🌟 Level {level} Reached!</p>
          <p className="text-sm text-muted-foreground mb-4">
            Congratulations, farmer! You've unlocked <span className="font-bold text-foreground">{newSlots} farm plots</span>. Keep growing!
          </p>

          <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-muted rounded-xl">
            <Sprout className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground">+{newSlots - (LEVEL_CONFIG.find(c => c.level === level - 1)?.slots ?? 3)} new plots unlocked!</span>
          </div>

          <Button onClick={onClose} className="w-full rounded-xl font-bold">
            Awesome! 🚀
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
