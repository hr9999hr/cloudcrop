import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

const features = [
  { emoji: "🌱", title: "Plant & Grow", desc: "Real-time crop simulation with weather", color: "#4ade80" },
  { emoji: "💧", title: "Water & Nurture", desc: "8-12 hour realistic watering cycles", color: "#38bdf8" },
  { emoji: "🎯", title: "Daily Missions", desc: "Complete tasks, earn CC Coins", color: "#fbbf24" },
  { emoji: "🛒", title: "Shop Real Produce", desc: "Buy seeds & fruits from local farmers", color: "#f472b6" },
  { emoji: "📦", title: "Collect at Hubs", desc: "8 locations across Malaysia", color: "#a78bfa" },
  { emoji: "💰", title: "Track Everything", desc: "Wallet, invoices & delivery tracking", color: "#34d399" },
];

export const SolutionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imageReveal = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  const imageScale = interpolate(frame, [0, 40], [1.1, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Warm green/cream background like the website */}
      <AbsoluteFill style={{
        background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #fef3c7 70%, #fde68a40 100%)",
      }} />

      {/* Game screenshot on right */}
      <div style={{
        position: "absolute", right: 60, top: 80, bottom: 80,
        width: 700, borderRadius: 30, overflow: "hidden",
        opacity: imageReveal,
        boxShadow: "0 20px 60px rgba(0,100,0,0.2)",
      }}>
        <Img src={staticFile("images/game-farm.jpg")} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${imageScale})`,
        }} />
        {/* Glass overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 60%, rgba(0,50,0,0.6) 100%)",
        }} />
        <div style={{
          position: "absolute", bottom: 20, left: 20, right: 20,
          fontSize: 18, color: "white", fontFamily: "sans-serif", fontWeight: 700,
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          🎮 In-game farm view
        </div>
      </div>

      {/* Header */}
      <div style={{
        position: "absolute", left: 80, top: 80,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontSize: 16, fontWeight: 800, color: "#16a34a", fontFamily: "sans-serif",
          letterSpacing: 4, textTransform: "uppercase",
        }}>
          ✨ How it works
        </div>
        <div style={{
          fontSize: 48, fontWeight: 900, color: "#1a3a2a", fontFamily: "sans-serif",
          marginTop: 8, lineHeight: 1.15,
        }}>
          Virtual Seeds,<br />Real Food
        </div>
      </div>

      {/* Feature list on left */}
      <div style={{
        position: "absolute", left: 80, top: 260, width: 520,
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {features.map((f, i) => {
          const delay = 30 + i * 15;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const x = interpolate(sp, [0, 1], [-60, 0]);
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 18px", borderRadius: 16,
              background: "rgba(255,255,255,0.7)",
              transform: `translateX(${x}px)`, opacity,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              borderLeft: `4px solid ${f.color}`,
            }}>
              <div style={{ fontSize: 30 }}>{f.emoji}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1a3a2a", fontFamily: "sans-serif" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 14, color: "#6b7280", fontFamily: "sans-serif" }}>
                  {f.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
