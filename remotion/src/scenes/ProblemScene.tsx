import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const stats = [
  { number: "828M", label: "People go hungry daily", emoji: "😢", color: "#ef4444" },
  { number: "60%", label: "Youth disconnected from farming", emoji: "📱", color: "#f59e0b" },
  { number: "1/3", label: "Food wasted globally", emoji: "🗑️", color: "#8b5cf6" },
];

export const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }} />

      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: 0, right: 0,
          top: i * 135, height: 1,
          background: "rgba(255,255,255,0.03)",
        }} />
      ))}

      <div style={{
        position: "absolute", left: 100, top: 80,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateX(${interpolate(frame, [0, 20], [-50, 0], { extrapolateRight: "clamp" })}px)`,
      }}>
        <div style={{
          fontSize: 18, fontWeight: 800, color: "#ef4444", fontFamily: "sans-serif",
          letterSpacing: 6, textTransform: "uppercase",
        }}>
          ⚠️ The Problem
        </div>
        <div style={{
          fontSize: 56, fontWeight: 900, color: "white", fontFamily: "sans-serif",
          marginTop: 8, lineHeight: 1.1,
        }}>
          Food Insecurity<br />is Growing
        </div>
      </div>

      <div style={{
        position: "absolute", left: 100, right: 100, top: 340,
        display: "flex", gap: 40,
      }}>
        {stats.map((s, i) => {
          const delay = 25 + i * 20;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
          const scale = interpolate(sp, [0, 1], [0.5, 1]);
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });
          const yOff = interpolate(sp, [0, 1], [30, 0]);

          return (
            <div key={i} style={{
              flex: 1, padding: "40px 30px", borderRadius: 24,
              background: `linear-gradient(135deg, ${s.color}15, ${s.color}08)`,
              border: `2px solid ${s.color}40`,
              transform: `scale(${scale}) translateY(${yOff}px)`, opacity,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>{s.emoji}</div>
              <div style={{
                fontSize: 72, fontWeight: 900, color: s.color,
                fontFamily: "sans-serif",
              }}>
                {s.number}
              </div>
              <div style={{
                fontSize: 18, color: "#a0aec0", fontFamily: "sans-serif",
                marginTop: 8, fontWeight: 500,
              }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: "absolute", bottom: 80, left: "50%",
        transform: "translateX(-50%)",
        opacity: interpolate(frame, [200, 230], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 28, color: "#fbbf24", fontFamily: "sans-serif", fontWeight: 700,
        textAlign: "center",
      }}>
        What if we could make farming... FUN? 🎮
      </div>
    </AbsoluteFill>
  );
};
