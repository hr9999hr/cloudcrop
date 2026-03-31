import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Droplets, Beaker, Bug, Shield } from "lucide-react";
import { PlantSlot, useGameStore, getWeatherInfo } from "@/store/gameStore";
import { useNavigate } from "react-router-dom";
import ccCoin from "@/assets/cc-coin.png";
import { formatDuration } from "@/lib/formatDuration";

interface PlantDetailPopupProps {
  open: boolean;
  plant: PlantSlot | null;
  onClose: () => void;
}

type ActionAnimation = 'water' | 'fertilizer' | null;

function WaterAnimation() {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Water drops falling */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg"
          style={{ left: `${8 + Math.random() * 84}%`, top: '-10%' }}
          initial={{ y: 0, opacity: 1, scale: 0.6 + Math.random() * 0.6 }}
          animate={{
            y: ['0%', '120%'],
            opacity: [1, 1, 0.3],
            rotate: [0, Math.random() > 0.5 ? 15 : -15],
          }}
          transition={{
            duration: 0.7 + Math.random() * 0.5,
            delay: i * 0.08,
            ease: 'easeIn',
          }}
        >
          💧
        </motion.div>
      ))}
      {/* Blue splash overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ background: 'radial-gradient(ellipse at 50% 80%, hsla(200 80% 60% / 0.25), transparent 70%)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1.4] }}
        transition={{ duration: 1, delay: 0.4 }}
      />
      {/* Splash ripples */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute rounded-full border-2 border-blue-400/40"
          style={{ left: '30%', bottom: '25%', width: 60, height: 30 }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.3, 1.5 + i * 0.5] }}
          transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
        />
      ))}
    </motion.div>
  );
}

function FertilizerAnimation() {
  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Sparkle particles rising */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-sm"
          style={{
            left: `${10 + Math.random() * 80}%`,
            bottom: `${10 + Math.random() * 30}%`,
          }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{
            y: [0, -40 - Math.random() * 60],
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 0.8, 0],
            x: [0, (Math.random() - 0.5) * 30],
          }}
          transition={{
            duration: 1 + Math.random() * 0.5,
            delay: i * 0.06,
            ease: 'easeOut',
          }}
        >
          {['✨', '🌟', '⚡', '💫'][i % 4]}
        </motion.div>
      ))}
      {/* Green glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ background: 'radial-gradient(ellipse at 50% 70%, hsla(120 60% 50% / 0.2), transparent 60%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5, 0] }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
      {/* Growth burst ring */}
      <motion.div
        className="absolute rounded-full border-2 border-green-400/50"
        style={{ left: '35%', top: '40%', width: 50, height: 50 }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: [0, 0.8, 0], scale: [0.2, 2.5] }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </motion.div>
  );
}

export function PlantDetailPopup({ open, plant, onClose }: PlantDetailPopupProps) {
  const { waterPlant, fertilizePlant, waterDrops, inventory, weather } = useGameStore();
  const navigate = useNavigate();
  const weatherInfo = getWeatherInfo(weather);
  const fertilizerCount = inventory.filter(i => i.category === 'fertilizers').reduce((a, i) => a + i.quantity, 0);
  const hasFertilizer = fertilizerCount > 0;
  const [actionAnim, setActionAnim] = useState<ActionAnimation>(null);

  if (!open || !plant || plant.status === 'empty') return null;

  const isReady = plant.status === 'ready';
  const isDead = plant.status === 'dead';
  const growthPercent = Math.round(plant.progress);
  const healthPercent = Math.round(plant.health ?? 100);

  // Watering cycle info (SRS-aligned)
  const now = Date.now();
  const intervalMs = plant.wateringIntervalMs || 45000;
  const cycleStart = plant.currentCycleStart || plant.plantedAt || now;
  const cycleElapsed = now - cycleStart;
  const cycleRemaining = Math.max(0, intervalMs - cycleElapsed);
  const cycleRemainingSec = Math.ceil(cycleRemaining / 1000);
  const cycleRemainingLabel = formatDuration(cycleRemaining);
  const cycleLabel = formatDuration(intervalMs);
  const isOverdue = cycleElapsed > intervalMs && !plant.wateredThisCycle;
  const wouldOverwater = plant.wateredThisCycle && !(weather === 'heatwave' && !plant.heatwaveWateredTwice);

  // Fertilizer: shifts time (SRS FUN-014)
  const isFertilized = false; // no longer time-boost based
  const fertTimeLeft = 0;

  const playAnimation = (type: ActionAnimation, callback: () => void) => {
    setActionAnim(type);
    callback();
    setTimeout(() => setActionAnim(null), 1500);
  };

  const actions = [
    {
      label: 'Water',
      icon: <Droplets className="w-5 h-5" />,
      color: 'text-water',
      bg: isOverdue ? 'bg-destructive/15' : 'bg-water/10',
      disabled: isReady || isDead,
      onClick: () => {
        if (waterDrops <= 0) {
          onClose();
          navigate('/missions');
        } else {
          playAnimation('water', () => waterPlant(plant.id));
        }
      },
      subtitle: waterDrops <= 0
        ? 'Get drops → Missions'
        : isOverdue
        ? `⚠️ Overdue! ${waterDrops} drops left`
        : plant.wateredThisCycle
        ? wouldOverwater
          ? `⚠️ Overwatering! -10% health · ${cycleRemainingLabel} til next`
          : `✅ Watered · ${cycleRemainingLabel} til next cycle`
        : `Water now! ${cycleRemainingLabel} left · ${waterDrops} drops`,
    },
    {
      label: 'Fertilizer',
      icon: <Beaker className="w-5 h-5" />,
      color: 'text-primary',
      bg: 'bg-primary/10',
      disabled: isReady || isDead,
      onClick: () => {
        if (!hasFertilizer) {
          onClose();
          navigate('/fertilizer');
        } else {
          playAnimation('fertilizer', () => fertilizePlant(plant.id));
        }
      },
      subtitle: hasFertilizer
        ? `${fertilizerCount} bags · Skip 24h growth`
        : 'Buy fertilizer →',
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
          className="bg-card rounded-2xl p-6 max-w-md mx-4 w-full shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action animations */}
          <AnimatePresence>
            {actionAnim === 'water' && <WaterAnimation />}
            {actionAnim === 'fertilizer' && <FertilizerAnimation />}
          </AnimatePresence>
          <div className="flex items-start gap-4 mb-4">
            {/* Plant display */}
            <div className="bg-muted rounded-xl p-6 flex flex-col items-center justify-center min-w-[140px]">
              <motion.span
                className="text-6xl mb-2"
                animate={isReady ? { y: [0, -5, 0] } : isDead ? { opacity: 0.4 } : {}}
                transition={{ repeat: isReady ? Infinity : 0, duration: 1.5 }}
              >
                {isDead ? '💀' : plant.plantEmoji}
              </motion.span>
              <p className="text-sm font-bold text-foreground">{plant.plantName}</p>
              {isReady && (
                <span className="text-xs font-bold text-harvest mt-1">Ready to harvest! ✨</span>
              )}
              {isDead && (
                <span className="text-xs font-bold text-destructive mt-1">Plant died! 😢</span>
              )}
            </div>

            {/* Plant info */}
            <div className="flex-1">
              <h3 className="text-sm font-extrabold text-foreground mb-2">Growth 🌱</h3>
              <div className="w-full bg-muted rounded-full h-2.5 mb-1 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-growth"
                  animate={{ width: `${growthPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-muted-foreground font-semibold">
                  {growthPercent}% — {isReady ? '🎉 Harvest ready!' : isDead ? '💀 Dead' : `${Math.round(100 - growthPercent)}% to go`}
                </p>
              </div>

              <h3 className="text-sm font-extrabold text-foreground mb-2">Health ❤️</h3>
              <div className="w-full bg-muted rounded-full h-2.5 mb-1 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${healthPercent >= 60 ? 'bg-green-500' : healthPercent >= 30 ? 'bg-yellow-500' : 'bg-destructive'}`}
                  animate={{ width: `${healthPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">
                {healthPercent}% — {healthPercent >= 70 ? '💚 Healthy' : healthPercent >= 40 ? '💛 Thirsty' : healthPercent > 0 ? '❤️‍🩹 Critical!' : '💀 Dead'}
              </p>

              {isOverdue && (
                <p className="text-[10px] text-destructive font-bold mt-1 animate-pulse">
                  ⚠️ Overdue! Water now — health dropping!
                </p>
              )}
              {/* SRS penalty breakdown */}
              {((plant.missedWaterings || 0) > 0 || (plant.heatwaveFailures || 0) > 0 || (plant.monsoonDays || 0) > 0) && (
                <div className="mt-1 space-y-0.5">
                  {(plant.missedWaterings || 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <img src={ccCoin} alt="CC" className="w-3 h-3" />
                      <p className="text-[10px] text-destructive font-bold">-{(plant.missedWaterings || 0) * 15} CC missed watering ({plant.missedWaterings}×)</p>
                    </div>
                  )}
                  {(plant.heatwaveFailures || 0) > 0 && (
                    <p className="text-[10px] text-destructive font-bold">🔥 -{((plant.heatwaveFailures || 0) * 30)}% heatwave penalty ({plant.heatwaveFailures}×)</p>
                  )}
                  {(plant.monsoonDays || 0) > 0 && (
                    <p className="text-[10px] text-destructive font-bold">⛈️ -{((plant.monsoonDays || 0) * 30)}% root rot ({plant.monsoonDays}×)</p>
                  )}
                </div>
              )}

              {/* Weather & watering info */}
              <div className="mt-2 p-1.5 bg-muted/50 rounded-lg space-y-0.5">
                <p className="text-[10px] text-muted-foreground">
                  {weatherInfo.label} · {weatherInfo.desc}
                </p>
                {!isReady && !isDead && (
                  <p className="text-[10px] text-muted-foreground">
                    💧 Cycle: 8-12 hours
                    {plant.wateredThisCycle ? ` · ✅ Watered · ${cycleRemainingLabel} left` : isOverdue ? ' · ⚠️ OVERDUE' : ` · Water now! ${cycleRemainingLabel} left`}
                    {(weather === 'rainy' || weather === 'monsoon') && ' · ☔ Auto-watered'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {actions.map((act) => (
              <Button
                key={act.label}
                variant="outline"
                disabled={act.disabled}
                onClick={act.onClick}
                className={`flex flex-col items-center gap-1 h-auto py-3 px-2 rounded-xl whitespace-normal ${act.bg} border-transparent hover:border-border`}
              >
                <span className={act.color}>{act.icon}</span>
                <span className="text-xs font-bold">{act.label}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight break-words w-full">{act.subtitle}</span>
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
