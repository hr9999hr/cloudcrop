import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const sdgs = [
  { num: "SDG 2", title: "Zero Hunger", color: "#DDA63A" },
  { num: "SDG 4", title: "Quality Education", color: "#C5192D" },
  { num: "SDG 11", title: "Sustainable Cities", color: "#FD9D24" },
  { num: "SDG 12", title: "Responsible Consumption", color: "#BF8B2E" },
  { num: "SDG 13", title: "Climate Action", color: "#3F7E44" },
];

const metrics = [
  { stat: "8.5M", label: "Potential Users" },
  { stat: "3x", label: "Engagement Boost" },
  { stat: "8", label: "Hub Locations" },
];

export const ImpactScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)",
      padding: 80,
    }}>
      <div style={{
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 52, fontWeight: 900, color: "#1a5c2e", fontFamily: "sans-serif",
        marginBottom: 40,
      }}>Impact & SDG Alignment</div>

      <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
        {sdgs.map((sdg, i) => {
          const delay = 10 + i * 10;
          const s = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const scale = interpolate(s, [0, 1], [0.8, 1]);
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              flex: 1, background: "white", borderRadius: 14, padding: 20,
              borderTop: `4px solid ${sdg.color}`,
              transform: `scale(${scale})`, opacity,
              boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: sdg.color, fontFamily: "sans-serif" }}>
                {sdg.num}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e", fontFamily: "sans-serif", marginTop: 6 }}>
                {sdg.title}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 30 }}>
        {metrics.map((m, i) => {
          const delay = 60 + i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12 } });
          const y = interpolate(s, [0, 1], [30, 0]);
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              flex: 1, background: "#1a5c2e", borderRadius: 20, padding: 36,
              transform: `translateY(${y}px)`, opacity,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 56, fontWeight: 900, color: "#4ade80", fontFamily: "sans-serif" }}>
                {m.stat}
              </div>
              <div style={{ fontSize: 18, color: "#a7f3d0", fontFamily: "sans-serif", marginTop: 8 }}>
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
