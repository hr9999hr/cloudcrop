import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const stack = [
  { label: "Frontend", value: "React 18 + TypeScript + Vite + Tailwind + Framer Motion" },
  { label: "State", value: "Zustand with cloud persistence" },
  { label: "Backend", value: "Lovable Cloud (PostgreSQL, Auth, Edge Functions)" },
  { label: "Weather", value: "Real weather API integration" },
  { label: "Auth", value: "Email/password with verification" },
  { label: "Deploy", value: "Lovable platform with auto-deploy" },
];

export const TechScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      padding: 80,
    }}>
      <div style={{
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 52, fontWeight: 900, color: "white", fontFamily: "sans-serif",
        marginBottom: 50,
      }}>Technical Overview</div>

      {stack.map((item, i) => {
        const delay = 10 + i * 10;
        const s = spring({ frame: frame - delay, fps, config: { damping: 20 } });
        const x = interpolate(s, [0, 1], [-40, 0]);
        const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 24,
            transform: `translateX(${x}px)`, opacity,
            marginBottom: 16, padding: "14px 24px",
            background: "rgba(255,255,255,0.05)", borderRadius: 12,
          }}>
            <div style={{
              fontSize: 16, fontWeight: 700, color: "#4ade80",
              fontFamily: "monospace", width: 120, flexShrink: 0,
            }}>{item.label}</div>
            <div style={{ fontSize: 18, color: "#e2e8f0", fontFamily: "sans-serif" }}>
              {item.value}
            </div>
          </div>
        );
      })}

      <div style={{
        opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" }),
        marginTop: 30, padding: "16px 24px",
        background: "rgba(254, 249, 195, 0.1)", borderRadius: 12,
        borderLeft: "4px solid #f59e0b",
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24", fontFamily: "sans-serif" }}>
          AI Disclosure
        </div>
        <div style={{ fontSize: 14, color: "#d1d5db", fontFamily: "sans-serif", marginTop: 4 }}>
          Lovable AI used for code generation and UI prototyping. All logic and design directed by team.
        </div>
      </div>
    </AbsoluteFill>
  );
};
