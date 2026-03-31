import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Gift, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore, SEED_OPTIONS } from "@/store/gameStore";
import { toast } from "sonner";

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export default function CheckInStreak() {
  const checkinStreak = useGameStore((s) => s.checkinStreak);
  const checkinLastDate = useGameStore((s) => s.checkinLastDate);
  const setCheckin = useGameStore((s) => s.setCheckin);
  const plants = useGameStore((s) => s.plants);
  const coins = useGameStore((s) => s.coins);
  const addToInventory = useGameStore((s) => s.addToInventory);

  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  const alreadyCheckedIn = checkinLastDate === today;

  const currentStreak = useMemo(() => {
    if (checkinLastDate === today) return checkinStreak;
    if (checkinLastDate === yesterday) return checkinStreak;
    return 0;
  }, [checkinStreak, checkinLastDate, today, yesterday]);

  const hasDeadPlant = plants.some((p) => p.status === "dead");
  const cheapestSeedCost = Math.min(...SEED_OPTIONS.map((s) => s.costCC));
  const cantAffordSeed = coins < cheapestSeedCost;
  const eligibleForFreeSeed = hasDeadPlant && cantAffordSeed;

  const handleCheckIn = () => {
    if (alreadyCheckedIn) return;

    let newStreak: number;
    if (checkinLastDate === yesterday) {
      newStreak = checkinStreak + 1;
    } else {
      newStreak = 1;
    }

    setCheckin(newStreak, today);

    if (newStreak >= 7 && eligibleForFreeSeed) {
      const randomSeed = SEED_OPTIONS[Math.floor(Math.random() * SEED_OPTIONS.length)];
      addToInventory({
        name: `${randomSeed.name} Seed`,
        emoji: randomSeed.emoji,
        category: "seeds",
        quantity: 1,
        description: randomSeed.description,
      });
      setCheckin(0, today);
      toast.success(`🎁 7-Day Streak! You got a free ${randomSeed.emoji} ${randomSeed.name} Seed!`);
    } else {
      toast.success(`📅 Day ${newStreak} check-in! ${newStreak >= 7 ? "Streak complete!" : `${7 - newStreak} days to go!`}`);
    }
  };

  const days = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 rounded-xl border border-border shadow-sm bg-card overflow-hidden"
    >
      <div className="p-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-foreground">Daily Check-in</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {alreadyCheckedIn ? "✅ Checked in today" : "Tap to check in!"}
        </span>
      </div>

      <div className="px-3 pb-2">
        <div className="flex items-center gap-1.5">
          {days.map((day) => {
            const filled = day <= currentStreak;
            const isToday = day === currentStreak + 1 && !alreadyCheckedIn;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    filled
                      ? "bg-primary text-primary-foreground"
                      : isToday
                      ? "bg-primary/20 border-2 border-primary border-dashed text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {filled ? "✓" : day}
                </div>
                <span className="text-[8px] text-muted-foreground">D{day}</span>
              </div>
            );
          })}
          <div className="flex flex-col items-center gap-0.5 pl-1">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                currentStreak >= 7 && eligibleForFreeSeed
                  ? "bg-primary/20 text-primary animate-pulse"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Gift className="w-4 h-4" />
            </div>
            <span className="text-[8px] text-muted-foreground">🌱</span>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 flex items-center justify-between gap-2">
        <div className="flex-1">
          {eligibleForFreeSeed ? (
            <p className="text-[10px] text-primary font-medium flex items-center gap-1">
              <Sprout className="w-3 h-3" />
              {currentStreak >= 7
                ? "Claim your free seed now!"
                : `${7 - currentStreak} more days for a free seed!`}
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground">
              🌱 Free seed reward unlocks when a plant dies & you're low on coins
            </p>
          )}
        </div>
        <Button
          size="sm"
          className="h-7 text-[10px] px-3 gap-1"
          disabled={alreadyCheckedIn}
          onClick={handleCheckIn}
        >
          <CalendarCheck className="w-3 h-3" />
          {alreadyCheckedIn ? "Done" : "Check In"}
        </Button>
      </div>
    </motion.div>
  );
}
