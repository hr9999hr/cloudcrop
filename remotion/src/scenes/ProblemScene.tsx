import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const problems = [
  { stat: "73%", label: "Urban — No Farming", sub: "experience or access" },
  { stat: "10.4%", label: "Food Price Increase", sub: "in 2023 alone" },
  { stat: "17K", label: "Tonnes Wasted Daily", sub: "enough to feed 12M" },
  { stat: "40%+", label: "Income on Food", sub: "for low-income families" },
];

export const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerX = interpolate(
    spring({ frame, fps, config: { damping: 20 } }), [0, 1], [-100, 0]
  );

  return (
    <AbsoluteFill style={{ background: "#fafafa" }}>
      {/* Red accent stripe */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: 8, height: "100%",
        background: "linear-gradient(180deg, #dc2626, #991b1b)",
      }} />

      <div style={{
        position: "absolute", left: 80, top: 80,
        transform: `translateX(${headerX}px)`,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#dc2626", fontFamily: "sans-serif", letterSpacing: 3, textTransform: "uppercase" }}>
          The Crisis
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, color: "#1a1a2e", fontFamily: "sans-serif", marginTop: 8 }}>
          Malaysia's Food Emergency
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex", gap: 24 }}>
        {problems.map((p, i) => {
          const delay = 30 + i * 20;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
          const y = interpolate(s, [0, 1], [80, 0]);
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });

          // Count up animation
          const numVal = parseFloat(p.stat.replace(/[^0-9.]/g, ''));
          const suffix = p.stat.replace(/[0-9.]/g, '');
          const progress = interpolate(frame, [delay, delay + 40], [0, 1], { extrapolateRight: "clamp" });
          const displayNum = (numVal * progress).toFixed(p.stat.includes('.') ? 1 : 0);

          return (
            <div key={i} style={{
              flex: 1, background: "white", borderRadius: 20, padding: "40px 30px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              transform: `translateY(${y}px)`, opacity,
              textAlign: "center",
              borderBottom: "4px solid #dc2626",
            }}>
              <div style={{ fontSize: 64, fontWeight: 900, color: "#dc2626", fontFamily: "sans-serif" }}>
                {displayNum}{suffix}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", fontFamily: "sans-serif", marginTop: 12 }}>
                {p.label}
              </div>
              <div style={{ fontSize: 14, color: "#9ca3af", fontFamily: "sans-serif", marginTop: 4 }}>
                {p.sub}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
