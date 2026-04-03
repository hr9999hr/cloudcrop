import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const ImpactScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#000" }}>
        <Img src={staticFile("images/fresh-produce.jpg")} style={{
          width: "100%", height: "100%", objectFit: "cover",
          opacity: 0.35,
          transform: `scale(${interpolate(frame, [0, 553], [1.1, 1.0], { extrapolateRight: "clamp" })})`,
        }} />
      </AbsoluteFill>

      <AbsoluteFill style={{
        background: "linear-gradient(180deg, rgba(0,40,0,0.7) 0%, rgba(0,20,0,0.85) 100%)",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 18, fontWeight: 800, color: "#4ade80", fontFamily: "sans-serif",
          letterSpacing: 6,
        }}>
          🌾 THE VISION
        </div>

        <div style={{
          opacity: interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 12 } }), [0, 1], [0.8, 1])})`,
          fontSize: 64, fontWeight: 900, color: "white", fontFamily: "sans-serif",
          marginTop: 20, textAlign: "center", lineHeight: 1.2,
          textShadow: "0 0 60px rgba(74,222,128,0.3)",
        }}>
          Every Seed Planted<br />
          <span style={{ color: "#4ade80" }}>Fights Hunger</span>
        </div>

        <div style={{
          display: "flex", gap: 60, marginTop: 60,
        }}>
          {[
            { num: "🌱→🍅", label: "Virtual to Real" },
            { num: "8 Hubs", label: "Across Malaysia" },
            { num: "0 Waste", label: "Direct to Consumer" },
          ].map((s, i) => {
            const delay = 40 + i * 15;
            const opacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: "clamp" });
            const y = interpolate(frame, [delay, delay + 20], [20, 0], { extrapolateRight: "clamp" });

            return (
              <div key={i} style={{
                opacity, transform: `translateY(${y}px)`,
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: 36, color: "white", fontFamily: "sans-serif", fontWeight: 800,
                }}>
                  {s.num}
                </div>
                <div style={{
                  fontSize: 16, color: "#a7f3d0", fontFamily: "sans-serif",
                  marginTop: 8, fontWeight: 500,
                }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          position: "absolute", bottom: 60,
          opacity: interpolate(frame, [200, 230], [0, 1], { extrapolateRight: "clamp" }),
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 30px", borderRadius: 30,
          background: "rgba(251,191,36,0.15)", border: "2px solid rgba(251,191,36,0.4)",
        }}>
          <Img src={staticFile("images/cc-coin.png")} style={{ width: 30, height: 30 }} />
          <div style={{
            fontSize: 18, color: "#fde68a", fontFamily: "sans-serif", fontWeight: 700,
          }}>
            Every coin spent supports local farmers
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
