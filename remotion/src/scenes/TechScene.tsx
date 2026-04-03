import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const TechScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{
        background: "linear-gradient(135deg, #fef3c7 0%, #ecfdf5 100%)",
      }} />

      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "50%",
        overflow: "hidden",
        opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <Img src={staticFile("images/happy-users.jpg")} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${interpolate(frame, [0, 556], [1.1, 1], { extrapolateRight: "clamp" })})`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 60%, #ecfdf5 100%)",
        }} />
      </div>

      <div style={{
        position: "absolute", right: 80, top: 120, width: 700,
        opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontSize: 16, fontWeight: 800, color: "#16a34a", fontFamily: "sans-serif",
          letterSpacing: 4,
        }}>
          🌍 IMPACT
        </div>
        <div style={{
          fontSize: 48, fontWeight: 900, color: "#1a3a2a", fontFamily: "sans-serif",
          marginTop: 8, lineHeight: 1.2,
        }}>
          More Than<br />Just a Game
        </div>
      </div>

      {[
        { num: "🌱", stat: "Local Farmers", desc: "Supporting small-scale agriculture across Malaysia", color: "#16a34a" },
        { num: "♻️", stat: "Reduce Waste", desc: "Connecting surplus produce to urban consumers", color: "#0ea5e9" },
        { num: "🎓", stat: "Education", desc: "Teaching food literacy through gameplay", color: "#f59e0b" },
        { num: "🤝", stat: "Community", desc: "8 collection hubs building local food networks", color: "#8b5cf6" },
      ].map((item, i) => {
        const delay = 30 + i * 18;
        const sp = spring({ frame: frame - delay, fps, config: { damping: 15 } });
        const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });
        const y = interpolate(sp, [0, 1], [25, 0]);

        return (
          <div key={i} style={{
            position: "absolute", right: 80, top: 280 + i * 130, width: 700,
            display: "flex", alignItems: "center", gap: 20,
            padding: "20px 24px", borderRadius: 20,
            background: "rgba(255,255,255,0.8)",
            transform: `translateY(${y}px)`, opacity,
            boxShadow: "0 2px 15px rgba(0,0,0,0.05)",
            borderLeft: `4px solid ${item.color}`,
          }}>
            <div style={{ fontSize: 36 }}>{item.num}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#1a3a2a", fontFamily: "sans-serif" }}>
                {item.stat}
              </div>
              <div style={{ fontSize: 15, color: "#6b7280", fontFamily: "sans-serif", marginTop: 2 }}>
                {item.desc}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
