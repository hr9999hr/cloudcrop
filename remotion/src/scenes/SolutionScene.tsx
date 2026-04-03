import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const features = [
  { title: "Virtual Farm Simulation", desc: "Grow crops in real-time with realistic mechanics" },
  { title: "Learn-to-Earn Missions", desc: "Watch farming tutorials to earn rewards" },
  { title: "Marketplace & Delivery", desc: "Buy real seeds and produce at local hubs" },
  { title: "Dual Economy (CC + RM)", desc: "Bridge virtual farming with real purchases" },
  { title: "Real Weather Integration", desc: "Climate affects crop growth in-game" },
];

export const SolutionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0a2e14 0%, #1a5c2e 100%)",
      padding: 80,
    }}>
      <div style={{
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 52, fontWeight: 900, color: "white", fontFamily: "sans-serif",
        marginBottom: 16,
      }}>
        Our Solution: CloudCrop
      </div>
      <div style={{
        opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 20, color: "#a7f3d0", fontFamily: "sans-serif", marginBottom: 50,
      }}>
        A gamified platform turning food production into an engaging experience
      </div>

      {features.map((f, i) => {
        const delay = 20 + i * 15;
        const s = spring({ frame: frame - delay, fps, config: { damping: 20 } });
        const x = interpolate(s, [0, 1], [-60, 0]);
        const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 20,
            transform: `translateX(${x}px)`, opacity,
            marginBottom: 20, padding: "18px 28px",
            background: "rgba(255,255,255,0.08)", borderRadius: 14,
            borderLeft: "4px solid #4ade80",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 900, color: "#0a2e14", fontFamily: "sans-serif",
            }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "white", fontFamily: "sans-serif" }}>
                {f.title}
              </div>
              <div style={{ fontSize: 15, color: "#86efac", fontFamily: "sans-serif" }}>
                {f.desc}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
