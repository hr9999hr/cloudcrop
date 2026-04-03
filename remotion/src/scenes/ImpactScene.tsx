import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const sdgs = [
  { num: "2", title: "Zero Hunger", color: "#DDA63A" },
  { num: "4", title: "Quality Education", color: "#C5192D" },
  { num: "11", title: "Sustainable Cities", color: "#FD9D24" },
  { num: "12", title: "Responsible Use", color: "#BF8B2E" },
  { num: "13", title: "Climate Action", color: "#3F7E44" },
];

const metrics = [
  { stat: "8.5M", label: "Potential Users", color: "#4ade80" },
  { stat: "3x", label: "Engagement Boost", color: "#38bdf8" },
  { stat: "8", label: "Hub Locations", color: "#fbbf24" },
  { stat: "5", label: "SDGs Aligned", color: "#a78bfa" },
];

export const ImpactScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #ecfdf5 0%, #f0fdf4 100%)",
    }}>
      <div style={{
        position: "absolute", left: 80, top: 50,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a5c2e", fontFamily: "sans-serif", letterSpacing: 4, textTransform: "uppercase" }}>
          Impact
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, color: "#1a5c2e", fontFamily: "sans-serif", marginTop: 4 }}>
          Making a Difference
        </div>
      </div>

      {/* SDG badges */}
      <div style={{ position: "absolute", left: 80, top: 170, display: "flex", gap: 16 }}>
        {sdgs.map((sdg, i) => {
          const delay = 10 + i * 8;
          const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
          const scale = interpolate(s, [0, 1], [0.7, 1]);
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              padding: "14px 20px", borderRadius: 14,
              background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              transform: `scale(${scale})`, opacity,
              borderTop: `4px solid ${sdg.color}`,
              textAlign: "center", minWidth: 160,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: sdg.color, fontFamily: "sans-serif" }}>
                SDG {sdg.num}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e", fontFamily: "sans-serif", marginTop: 4 }}>
                {sdg.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Big metrics */}
      <div style={{
        position: "absolute", left: 80, right: 80, bottom: 80,
        display: "flex", gap: 24,
      }}>
        {metrics.map((m, i) => {
          const delay = 60 + i * 15;
          const s = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 80 } });
          const y = interpolate(s, [0, 1], [60, 0]);
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp" });

          // Count animation
          const numVal = parseFloat(m.stat.replace(/[^0-9.]/g, ''));
          const suffix = m.stat.replace(/[0-9.]/g, '');
          const progress = interpolate(frame, [delay, delay + 40], [0, 1], { extrapolateRight: "clamp" });
          const displayNum = numVal > 100 ? Math.round(numVal * progress).toString() : (numVal * progress).toFixed(m.stat.includes('.') ? 1 : 0);

          return (
            <div key={i} style={{
              flex: 1, padding: "40px 24px",
              background: "#1a5c2e", borderRadius: 20,
              transform: `translateY(${y}px)`, opacity,
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(26,92,46,0.3)",
            }}>
              <div style={{ fontSize: 60, fontWeight: 900, color: m.color, fontFamily: "sans-serif" }}>
                {displayNum}{suffix}
              </div>
              <div style={{ fontSize: 16, color: "#a7f3d0", fontFamily: "sans-serif", marginTop: 8 }}>
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
