import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const features = [
  { num: "01", title: "Plant & Grow", desc: "Real-time crop simulation with weather effects", color: "#4ade80" },
  { num: "02", title: "Water & Nurture", desc: "8-12h realistic watering cycles", color: "#38bdf8" },
  { num: "03", title: "Learn & Earn", desc: "Watch tutorials, earn CC Coins", color: "#fbbf24" },
  { num: "04", title: "Shop Real Produce", desc: "Seeds, fruits, fertilizers from vendors", color: "#f472b6" },
  { num: "05", title: "Collect at Hubs", desc: "8 locations across Malaysia", color: "#a78bfa" },
  { num: "06", title: "Track Everything", desc: "Wallet, invoices, delivery status", color: "#34d399" },
];

export const SolutionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0a2e14 0%, #1a5c2e 50%, #0d3b1a 100%)",
    }}>
      {/* Header */}
      <div style={{
        position: "absolute", left: 80, top: 60,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", fontFamily: "sans-serif", letterSpacing: 4, textTransform: "uppercase" }}>
          The Solution
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, color: "white", fontFamily: "sans-serif", marginTop: 4 }}>
          How CloudCrop Works
        </div>
        <div style={{ fontSize: 18, color: "#a7f3d0", fontFamily: "sans-serif", marginTop: 8 }}>
          From virtual seeds to real food on your table
        </div>
      </div>

      {/* Feature cards - 3x2 grid */}
      <div style={{
        position: "absolute", left: 80, right: 80, top: 220,
        display: "flex", flexWrap: "wrap", gap: 20,
      }}>
        {features.map((f, i) => {
          const delay = 20 + i * 18;
          const s = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const scale = interpolate(s, [0, 1], [0.85, 1]);
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp" });
          const cardW = "calc(33.33% - 14px)";

          return (
            <div key={i} style={{
              width: cardW, padding: "28px 24px",
              background: "rgba(255,255,255,0.06)", borderRadius: 16,
              transform: `scale(${scale})`, opacity,
              borderLeft: `3px solid ${f.color}`,
            }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: f.color, fontFamily: "monospace", opacity: 0.5 }}>
                {f.num}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "white", fontFamily: "sans-serif", marginTop: 4 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 14, color: "#a7f3d0", fontFamily: "sans-serif", marginTop: 8 }}>
                {f.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
