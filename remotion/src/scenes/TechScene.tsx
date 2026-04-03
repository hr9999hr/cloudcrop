import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const stack = [
  { label: "Frontend", value: "React 18 + TypeScript + Vite + Tailwind + Framer Motion", color: "#3b82f6" },
  { label: "State", value: "Zustand with cloud persistence", color: "#8b5cf6" },
  { label: "Backend", value: "Lovable Cloud (PostgreSQL, Auth, Edge Functions)", color: "#4ade80" },
  { label: "Sync", value: "Auto-save game state to cloud on every change", color: "#06b6d4" },
  { label: "Weather", value: "Real weather API affecting game mechanics", color: "#f59e0b" },
  { label: "Auth", value: "Email/password with verification & reset", color: "#ec4899" },
];

export const TechScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#0f172a" }}>
      {/* Grid pattern */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "repeating-linear-gradient(0deg, white 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, white 0px, transparent 1px, transparent 40px)" }} />

      <div style={{
        position: "absolute", left: 80, top: 70,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#3b82f6", fontFamily: "sans-serif", letterSpacing: 4, textTransform: "uppercase" }}>
          Architecture
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, color: "white", fontFamily: "sans-serif", marginTop: 4 }}>
          Technical Overview
        </div>
      </div>

      {/* Stack items */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 200 }}>
        {stack.map((item, i) => {
          const delay = 15 + i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 18 } });
          const x = interpolate(s, [0, 1], [-60, 0]);
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
          const barWidth = interpolate(s, [0, 1], [0, 100]);

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 24,
              transform: `translateX(${x}px)`, opacity,
              marginBottom: 18, padding: "16px 24px",
              background: "rgba(255,255,255,0.04)", borderRadius: 12,
              position: "relative", overflow: "hidden",
            }}>
              {/* Progress bar bg */}
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${barWidth}%`, background: `${item.color}08`,
              }} />
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: 3, background: item.color,
              }} />
              <div style={{
                fontSize: 14, fontWeight: 700, color: item.color,
                fontFamily: "monospace", width: 100, flexShrink: 0, position: "relative",
              }}>{item.label}</div>
              <div style={{ fontSize: 17, color: "#e2e8f0", fontFamily: "sans-serif", position: "relative" }}>
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Disclosure */}
      <div style={{
        position: "absolute", bottom: 60, left: 80, right: 80,
        opacity: interpolate(frame, [200, 230], [0, 1], { extrapolateRight: "clamp" }),
        padding: "16px 24px", borderRadius: 12,
        background: "rgba(254,249,195,0.08)", borderLeft: "3px solid #f59e0b",
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24", fontFamily: "sans-serif" }}>AI Disclosure: </span>
        <span style={{ fontSize: 13, color: "#d1d5db", fontFamily: "sans-serif" }}>
          Lovable AI used for code generation & UI prototyping. All logic and design directed by team.
        </span>
      </div>
    </AbsoluteFill>
  );
};
