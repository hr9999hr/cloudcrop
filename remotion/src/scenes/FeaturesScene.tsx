import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const left = [
  { title: "Isometric Farm View", desc: "Beautiful farm grid with weather effects" },
  { title: "Smart Watering (8-12h)", desc: "Realistic watering cycles & health" },
  { title: "Health & Progress", desc: "Real-time bars and harvest indicators" },
];
const right = [
  { title: "Multi-vendor Market", desc: "Seeds, produce, and fertilizers" },
  { title: "Order & Delivery", desc: "8 collection hubs across Malaysia" },
  { title: "Wallet & Invoices", desc: "Full transaction history & reports" },
];

export const FeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #fafafa 0%, #ecfdf5 100%)",
      padding: 80,
    }}>
      <div style={{
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 52, fontWeight: 900, color: "#1a5c2e", fontFamily: "sans-serif",
        marginBottom: 50,
      }}>Key Features</div>

      <div style={{ display: "flex", gap: 40 }}>
        {[left, right].map((col, ci) => (
          <div key={ci} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
            {col.map((f, i) => {
              const delay = 15 + (ci * 3 + i) * 12;
              const s = spring({ frame: frame - delay, fps, config: { damping: 18 } });
              const scale = interpolate(s, [0, 1], [0.9, 1]);
              const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp" });

              return (
                <div key={i} style={{
                  background: ci === 0 ? "#ecfdf5" : "#fef3c7",
                  borderRadius: 16, padding: 28,
                  transform: `scale(${scale})`, opacity,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", fontFamily: "sans-serif" }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: 16, color: "#6b7280", fontFamily: "sans-serif", marginTop: 6 }}>
                    {f.desc}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
