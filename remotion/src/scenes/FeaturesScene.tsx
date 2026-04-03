import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const FeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const parallax = interpolate(frame, [0, 556], [0, -40], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Background with website colors */}
      <AbsoluteFill style={{
        background: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 40%, #bbf7d0 100%)",
      }} />

      {/* Decorative circles */}
      {[
        { x: -100, y: -100, size: 400, color: "#4ade8030" },
        { x: 1600, y: 700, size: 350, color: "#fbbf2420" },
        { x: 800, y: -150, size: 250, color: "#38bdf820" },
      ].map((c, i) => (
        <div key={i} style={{
          position: "absolute", left: c.x, top: c.y + parallax * (i + 1) * 0.3,
          width: c.size, height: c.size, borderRadius: "50%",
          background: c.color,
        }} />
      ))}

      {/* Header */}
      <div style={{
        position: "absolute", left: "50%", top: 60,
        transform: "translateX(-50%)",
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 18, fontWeight: 800, color: "#f59e0b", fontFamily: "sans-serif",
          letterSpacing: 4,
        }}>
          🚀 TECHNOLOGY
        </div>
        <div style={{
          fontSize: 52, fontWeight: 900, color: "#166534", fontFamily: "sans-serif",
          marginTop: 8,
        }}>
          Built for the Future
        </div>
      </div>

      {/* Tech stack cards */}
      {[
        { icon: "⚛️", title: "React + TypeScript", desc: "Modern, fast, reliable web technology", x: 100, y: 220, w: 500 },
        { icon: "🌦️", title: "Real Weather API", desc: "Your farm responds to actual weather conditions", x: 660, y: 220, w: 500 },
        { icon: "🎮", title: "Gamification Engine", desc: "XP, levels, streaks, missions — keeps players engaged", x: 100, y: 420, w: 500 },
        { icon: "☁️", title: "Cloud Backend", desc: "Save progress, sync across devices, real-time updates", x: 660, y: 420, w: 500 },
        { icon: "💳", title: "E-Commerce Integration", desc: "Real marketplace with wallet & invoice system", x: 100, y: 620, w: 500 },
        { icon: "📱", title: "Responsive PWA", desc: "Works on any device — phone, tablet, or desktop", x: 660, y: 620, w: 500 },
      ].map((card, i) => {
        const delay = 15 + i * 12;
        const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 150 } });
        const scale = interpolate(sp, [0, 1], [0.85, 1]);
        const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            position: "absolute", left: card.x, top: card.y, width: card.w,
            padding: "28px 24px", borderRadius: 20,
            background: "rgba(255,255,255,0.85)",
            transform: `scale(${scale})`, opacity,
            boxShadow: "0 4px 20px rgba(0,80,0,0.08)",
            display: "flex", alignItems: "center", gap: 18,
          }}>
            <div style={{
              fontSize: 40, width: 60, height: 60, borderRadius: 16,
              background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1a3a2a", fontFamily: "sans-serif" }}>
                {card.title}
              </div>
              <div style={{ fontSize: 15, color: "#6b7280", fontFamily: "sans-serif", marginTop: 4 }}>
                {card.desc}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
