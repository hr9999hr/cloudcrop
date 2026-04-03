import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const problems = [
  { title: "Urban Disconnect", stat: "73%", desc: "of Malaysians have no farming experience" },
  { title: "Rising Food Costs", stat: "10.4%", desc: "food price increase in 2023" },
  { title: "Food Waste Crisis", stat: "17K", desc: "tonnes of food wasted daily in Malaysia" },
  { title: "Low Engagement", stat: "40%+", desc: "income spent on food by low-income families" },
];

export const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #fafafa 0%, #f0fdf4 100%)",
      padding: 80,
    }}>
      <div style={{
        opacity: headerOpacity,
        fontSize: 56, fontWeight: 900, color: "#1a5c2e",
        fontFamily: "sans-serif", marginBottom: 60,
      }}>
        The Problem
      </div>

      <div style={{ display: "flex", gap: 30 }}>
        {problems.map((p, i) => {
          const delay = 15 + i * 18;
          const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 120 } });
          const y = interpolate(s, [0, 1], [40, 0]);
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              flex: 1, background: "white", borderRadius: 20, padding: 36,
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              transform: `translateY(${y}px)`, opacity,
              display: "flex", flexDirection: "column", alignItems: "center",
              borderTop: "4px solid #2d8a4e",
            }}>
              <div style={{
                fontSize: 52, fontWeight: 900, color: "#1a5c2e",
                fontFamily: "sans-serif",
              }}>{p.stat}</div>
              <div style={{
                fontSize: 20, fontWeight: 700, color: "#1a1a2e",
                fontFamily: "sans-serif", marginTop: 12, textAlign: "center",
              }}>{p.title}</div>
              <div style={{
                fontSize: 15, color: "#6b7280", marginTop: 8,
                fontFamily: "sans-serif", textAlign: "center", lineHeight: 1.4,
              }}>{p.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
