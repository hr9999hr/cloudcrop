import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";

export function WelcomePopup() {
  const { hasSeenWelcome, setHasSeenWelcome } = useGameStore();

  if (hasSeenWelcome) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
        onClick={() => setHasSeenWelcome(true)}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-card rounded-2xl p-8 max-w-sm mx-4 shadow-2xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-6xl mb-4"
          >
            🌱
          </motion.div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">
            Welcome to CloudCrop!
          </h2>
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            You received <span className="font-bold text-foreground">3 seeds</span> 🌱 and{" "}
            <span className="font-bold text-water">3 water drops</span> 💧 to get started!
          </p>
          <div className="bg-muted rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-xs text-muted-foreground">
              🥬 Help users discover organic food
            </p>
            <p className="text-xs text-muted-foreground">
              🧑‍🌾 Support local farmers & reduce food waste
            </p>
            <p className="text-xs text-muted-foreground">
              🪙 Grow crops → Earn CC Coins → Buy real veggies!
            </p>
          </div>
          <Button
            onClick={() => setHasSeenWelcome(true)}
            className="w-full gradient-farm text-primary-foreground font-bold text-base py-5 rounded-xl"
          >
            Start Farming! 🚜
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
