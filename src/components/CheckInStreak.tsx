import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Gift, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore, SEED_OPTIONS } from "@/store/gameStore";
import { toast } from "sonner";

const STREAK_KEY = "cloudcrop_checkin_streak";
const LAST_CHECKIN_KEY = "cloudcrop_last_checkin";

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadStreak(): { streak: number; lastDate: string | null } {
  try {
    const streak = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
    const lastDate = localStorage.getItem(LAST_CHECKIN_KEY);
    return { streak, lastDate };
  } catch {
    return { streak: 0, lastDate: null };
  }
}

function saveStreak(streak: number, date: string) {
  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(LAST_CHECKIN_KEY, date);
}

export default function CheckInStreak() {
  const [streakData, setStreakData] = useState(loadStreak);
  const plants = useGameStore((s) => s.plants);
  const coins = useGameStore((s) => s.coins);
  const addToInventory = useGameStore((s) => s.addToInventory);

  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  const alreadyCheckedIn = streakData.lastDate === today;

  const currentStreak = useMemo(() => {
    if (streakData.lastDate === today) return streakData.streak;
    if (streakData.lastDate === yesterday) return streakData.streak;
    return 0;
  }, [streakData, today, yesterday]);

  // Free seed reward is always available as a goal
  const eligibleForFreeSeed = true;

  const handleCheckIn = () => {
    if (alreadyCheckedIn) return;

    let newStreak: number;
    if (streakData.lastDate === yesterday) {
      newStreak = streakData.streak + 1;
    } else {
      newStreak = 1;
    }

    saveStreak(newStreak, today);
    setStreakData({ streak: newStreak, lastDate: today });

    if (newStreak >= 7 && eligibleForFreeSeed) {
      const randomSeed = SEED_OPTIONS[Math.floor(Math.random() * SEED_OPTIONS.length)];
      addToInventory({
        name: `${randomSeed.name} Seed`,
        emoji: randomSeed.emoji,
        category: "seeds",
        quantity: 1,
        description: randomSeed.description,
      });
      saveStreak(0, today);
      setStreakData({ streak: 0, lastDate: today });
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
