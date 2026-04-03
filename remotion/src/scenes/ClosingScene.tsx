import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const ClosingScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const scale = interpolate(s, [0, 1], [0.8, 1]);
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0a2e14 0%, #1a5c2e 50%, #0d3b1a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      {/* Particles */}
      {[...Array(10)].map((_, i) => {
        const x = (i * 197) % 1920;
        const y = (i * 113) % 1080;
        const drift = Math.sin(frame * 0.03 + i * 1.3) * 20;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y + drift,
            width: 40 + i * 10, height: 40 + i * 10, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(74,222,128,${0.06 + (i%3)*0.03}) 0%, transparent 70%)`,
          }} />
        );
      })}

      <div style={{
        transform: `scale(${scale})`, opacity,
        fontSize: 80, fontWeight: 900, color: "white", fontFamily: "sans-serif",
        textShadow: "0 0 80px rgba(74,222,128,0.4)",
        textAlign: "center",
      }}>
        Let's Grow Together
      </div>

      <div style={{
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
        width: 300, height: 3, marginTop: 20,
        background: "linear-gradient(90deg, transparent, #4ade80, transparent)",
      }} />

      <div style={{
        opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 24, color: "#a7f3d0", fontFamily: "sans-serif", marginTop: 24,
      }}>
        CloudCrop - Food security made fun
      </div>

      <div style={{
        opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 14, color: "#6ee7b780", fontFamily: "sans-serif", marginTop: 30,
        letterSpacing: 2,
      }}>
        THANK YOU
      </div>
    </AbsoluteFill>
  );
};
