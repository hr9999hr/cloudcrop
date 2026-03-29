import { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle2, Droplets, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  reward: number;
  emoji: string;
}

const MISSIONS: Mission[] = [
  {
    id: "mission-kangkung",
    title: "How to Grow Kangkung",
    description: "Learn to grow kangkung (water spinach) at home — one of the easiest crops to start with!",
    youtubeId: "sBxdWFRjDuc",
    reward: 3,
    emoji: "🥬",
  },
  {
    id: "mission-tomato",
    title: "Growing Tomatoes: Seed to Harvest",
    description: "A complete guide on growing juicy tomatoes from seed all the way to harvest day.",
    youtubeId: "eySTo2GgvoY",
    reward: 3,
    emoji: "🍅",
  },
  {
    id: "mission-chili",
    title: "Beginner's Guide to Growing Chili",
    description: "Master the art of sowing chili pepper seeds and growing fiery chilies at home.",
    youtubeId: "HOVB4LKjJzs",
    reward: 3,
    emoji: "🌶️",
  },
  {
    id: "mission-watering",
    title: "How to Water Plants Properly",
    description: "Learn the right way to water your plants — avoid common mistakes that kill crops!",
    youtubeId: "h7a43SV1ZdE",
    reward: 3,
    emoji: "💧",
  },
  {
    id: "mission-fertilizer",
    title: "DIY Organic Fertilizer",
    description: "Make your own organic fertilizer for free using simple household and garden leftovers.",
    youtubeId: "dcGVQCz-A1s",
    reward: 3,
    emoji: "🧪",
  },
];

const COMPLETED_KEY = "cloudcrop_completed_missions";

function getCompletedMissions(): string[] {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCompletedMissions(ids: string[]) {
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(ids));
}

export default function MissionsPage() {
  const [completed, setCompleted] = useState<string[]>(getCompletedMissions);
  const [watchingId, setWatchingId] = useState<string | null>(null);
  const [watchTimers, setWatchTimers] = useState<Record<string, number>>({});
  const addWaterDrops = useGameStore((s) => s.addWaterDrops);

  const watchingMission = MISSIONS.find((m) => m.id === watchingId);
  const totalEarned = completed.length * 3;
  const totalPossible = MISSIONS.length * 3;

  // Timer: require 30 seconds of watching before claiming
  useEffect(() => {
    if (!watchingId || completed.includes(watchingId)) return;
    const interval = setInterval(() => {
      setWatchTimers((prev) => ({
        ...prev,
        [watchingId]: Math.min(30, (prev[watchingId] || 0) + 1),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [watchingId, completed]);

  const handleClaim = (missionId: string) => {
    if (completed.includes(missionId)) return;
    const newCompleted = [...completed, missionId];
    setCompleted(newCompleted);
    saveCompletedMissions(newCompleted);
    addWaterDrops(3);
    toast.success("🎉 Mission Complete! +3 💧 Water Drops earned!");
    setWatchingId(null);
  };

  const canClaim = (missionId: string) => {
    return (watchTimers[missionId] || 0) >= 30 && !completed.includes(missionId);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" /> Missions
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Watch planting tutorials to earn water drops 💧
        </p>
      </div>

      {/* Progress card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-xl p-4 border border-border shadow-sm bg-card"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground">
              {totalEarned} / {totalPossible} 💧 Earned
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {completed.length}/{MISSIONS.length} completed
          </span>
        </div>
        <div className="w-full rounded-full h-2.5 overflow-hidden bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(completed.length / MISSIONS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Mission list */}
      <div className="space-y-3">
        {MISSIONS.map((mission, idx) => {
          const isDone = completed.includes(mission.id);
          const watchProgress = watchTimers[mission.id] || 0;

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-xl border shadow-sm overflow-hidden transition-colors ${
                isDone
                  ? "bg-primary/5 border-primary/20"
                  : "bg-card border-border"
              }`}
            >
              <div className="p-3.5 flex items-start gap-3">
                <div
                  className={`text-2xl rounded-lg p-2 flex-shrink-0 ${
                    isDone ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  {mission.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground truncate">
                      {mission.title}
                    </h3>
                    {isDone && (
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                    {mission.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      +{mission.reward} 💧
                    </span>
                    {isDone ? (
                      <span className="text-[10px] font-bold text-primary">
                        ✅ Completed
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-[10px] px-2 gap-1"
                        onClick={() => setWatchingId(mission.id)}
                      >
                        <Play className="w-3 h-3" /> Watch Video
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {watchingMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setWatchingId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video header */}
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{watchingMission.emoji}</span>
                  <h3 className="text-sm font-bold text-foreground truncate">
                    {watchingMission.title}
                  </h3>
                </div>
                <button
                  onClick={() => setWatchingId(null)}
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* YouTube embed */}
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${watchingMission.youtubeId}?autoplay=1&rel=0`}
                  title={watchingMission.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Claim section */}
              <div className="p-4">
                {completed.includes(watchingMission.id) ? (
                  <div className="text-center py-2">
                    <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-1" />
                    <p className="text-sm font-bold text-primary">
                      Already Completed! ✅
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">
                        Watch for at least 30 seconds to claim reward
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {Math.min(30, watchTimers[watchingMission.id] || 0)}/30s
                      </span>
                    </div>
                    <div className="w-full rounded-full h-2 overflow-hidden bg-muted mb-3">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        animate={{
                          width: `${((watchTimers[watchingMission.id] || 0) / 30) * 100}%`,
                        }}
                      />
                    </div>
                    <Button
                      className="w-full gap-2"
                      disabled={!canClaim(watchingMission.id)}
                      onClick={() => handleClaim(watchingMission.id)}
                    >
                      <Droplets className="w-4 h-4" />
                      {canClaim(watchingMission.id)
                        ? `Claim +${watchingMission.reward} 💧 Water Drops`
                        : `Watching... ${30 - (watchTimers[watchingMission.id] || 0)}s left`}
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
