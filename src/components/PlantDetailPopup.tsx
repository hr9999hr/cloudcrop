import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Droplets, Beaker, Bug, Shield } from "lucide-react";
import { PlantSlot, useGameStore } from "@/store/gameStore";
import { useNavigate } from "react-router-dom";

interface PlantDetailPopupProps {
  open: boolean;
  plant: PlantSlot | null;
  onClose: () => void;
}

export function PlantDetailPopup({ open, plant, onClose }: PlantDetailPopupProps) {
  const { waterPlant, fertilizePlant, waterDrops, inventory } = useGameStore();
  const navigate = useNavigate();
  const fertilizerCount = inventory.filter(i => i.category === 'fertilizers').reduce((a, i) => a + i.quantity, 0);
  const hasFertilizer = fertilizerCount > 0;

  if (!open || !plant || plant.status === 'empty') return null;

  const isReady = plant.status === 'ready';
  const growthPercent = Math.round(plant.progress);
  const healthPercent = Math.round(plant.health ?? 100);

  const actions = [
    {
      label: 'Water',
      icon: <Droplets className="w-5 h-5" />,
      color: 'text-water',
      bg: 'bg-water/10',
      disabled: waterDrops <= 0 || isReady,
      onClick: () => waterPlant(plant.id),
      subtitle: `${waterDrops} drops left`,
    },
    {
      label: 'Fertilizer',
      icon: <Beaker className="w-5 h-5" />,
      color: 'text-primary',
      bg: 'bg-primary/10',
      disabled: isReady,
      onClick: () => {
        if (!hasFertilizer) {
          onClose();
          navigate('/fertilizer');
        } else {
          fertilizePlant(plant.id);
        }
      },
      subtitle: hasFertilizer ? `${fertilizerCount} bags` : 'Buy fertilizer →',
    },
    {
      label: 'Pest & Disease Control',
      icon: <Bug className="w-5 h-5" />,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      disabled: true,
      onClick: () => {},
      subtitle: 'Coming soon',
    },
    {
      label: 'Plant Insurance',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-accent-foreground',
      bg: 'bg-accent/20',
      disabled: true,
      onClick: () => {},
      subtitle: 'Coming soon',
    },
  ];

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
          <div className="flex items-start gap-4 mb-4">
            {/* Plant display */}
            <div className="bg-muted rounded-xl p-6 flex flex-col items-center justify-center min-w-[140px]">
              <motion.span
                className="text-6xl mb-2"
                animate={isReady ? { y: [0, -5, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {plant.plantEmoji}
              </motion.span>
              <p className="text-sm font-bold text-foreground">{plant.plantName}</p>
              {isReady && (
                <span className="text-xs font-bold text-harvest mt-1">Ready to harvest! ✨</span>
              )}
            </div>

            {/* Plant info */}
            <div className="flex-1">
              <h3 className="text-sm font-extrabold text-foreground mb-2">Growth</h3>
              <div className="w-full bg-muted rounded-full h-2.5 mb-1 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-growth"
                  animate={{ width: `${growthPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold mb-3">
                {growthPercent}% — {isReady ? '🎉 Harvest ready!' : `${Math.round(100 - growthPercent)}% to go`}
              </p>

              <h3 className="text-sm font-extrabold text-foreground mb-2">Health ❤️</h3>
              <div className="w-full bg-muted rounded-full h-2.5 mb-1 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${healthPercent >= 50 ? 'bg-red-400' : 'bg-destructive'}`}
                  animate={{ width: `${healthPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">
                {healthPercent}% — {healthPercent >= 70 ? '💚 Healthy' : healthPercent >= 40 ? '💛 Needs water' : '❤️‍🩹 Critical! Water now!'}
              </p>
              {healthPercent < 50 && (
                <p className="text-[10px] text-destructive font-bold mt-1">⚠️ Low health slows growth & reduces harvest!</p>
              )}
            </div>
          </div>

          {/* Action buttons - side panel style */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {actions.map((act) => (
              <Button
                key={act.label}
                variant="outline"
                disabled={act.disabled}
                onClick={act.onClick}
                className={`flex flex-col items-center gap-1 h-auto py-3 rounded-xl ${act.bg} border-transparent hover:border-border`}
              >
                <span className={act.color}>{act.icon}</span>
                <span className="text-xs font-bold">{act.label}</span>
                <span className="text-[10px] text-muted-foreground">{act.subtitle}</span>
              </Button>
            ))}
          </div>

          <Button variant="outline" onClick={onClose} className="w-full rounded-xl">
            Close
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
