import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const ClosingScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 10, stiffness: 60 } });
  const scale = interpolate(s, [0, 1], [0.6, 1]);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #2d8a4e 0%, #4aba6e 40%, #16a34a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      {/* Confetti particles */}
      {[...Array(20)].map((_, i) => {
        const x = (i * 97) % 1920;
        const drift = Math.sin(frame * 0.05 + i * 1.5) * 30;
        const fall = (frame * (2 + i % 3)) % 1200 - 100;
        const colors = ["#fbbf24", "#f472b6", "#38bdf8", "#a78bfa", "#fff"];
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: fall + drift,
            width: 8 + i % 5 * 3, height: 8 + i % 3 * 4,
            borderRadius: i % 2 === 0 ? "50%" : 2,
            background: colors[i % colors.length],
            opacity: 0.6,
            transform: `rotate(${frame * 3 + i * 45}deg)`,
          }} />
        );
      })}

      {/* Logo */}
      <div style={{
        transform: `scale(${interpolate(s, [0, 1], [0.3, 1]) * pulse})`,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        marginBottom: 20,
      }}>
        <Img src={staticFile("images/logo.png")} style={{ width: 120, height: 120, borderRadius: 20 }} />
      </div>

      <div style={{
        transform: `scale(${scale})`,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 80, fontWeight: 900, color: "white", fontFamily: "sans-serif",
        textShadow: "0 4px 30px rgba(0,0,0,0.3)",
        textAlign: "center",
      }}>
        Grow Virtual.
        <br />
        <span style={{ color: "#fde68a" }}>Eat Real.</span>
      </div>

      <div style={{
        opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 28, color: "rgba(255,255,255,0.9)", fontFamily: "sans-serif",
        marginTop: 20, fontWeight: 600,
      }}>
        🌱 Join the farming revolution today!
      </div>

      <div style={{
        opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif",
        marginTop: 40, letterSpacing: 4, fontWeight: 700,
      }}>
        CLOUDCROP — FOOD SECURITY MADE FUN
      </div>
    </AbsoluteFill>
  );
};
