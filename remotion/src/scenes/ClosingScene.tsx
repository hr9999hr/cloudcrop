import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const ClosingScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 15, stiffness: 60 } });
  const scale = interpolate(s, [0, 1], [0.85, 1]);
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #1a5c2e 0%, #0a2e14 60%, #0d1f0f 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      {[...Array(8)].map((_, i) => {
        const x = 100 + i * 220;
        const y = 200 + (i % 4) * 180;
        const drift = Math.sin(frame * 0.025 + i * 1.5) * 15;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y + drift,
            width: 60 + i * 15, height: 60 + i * 15,
            borderRadius: "50%",
            background: `rgba(74, 222, 128, ${0.04 + (i % 3) * 0.02})`,
          }} />
        );
      })}

      <div style={{
        transform: `scale(${scale})`, opacity,
        fontSize: 72, fontWeight: 900, color: "white",
        fontFamily: "sans-serif", textAlign: "center",
        textShadow: "0 4px 30px rgba(74,222,128,0.3)",
      }}>
        Let's Grow Together
      </div>

      <div style={{
        opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 24, color: "#a7f3d0", fontFamily: "sans-serif", marginTop: 20,
        textAlign: "center",
      }}>
        CloudCrop - Making food security fun, accessible, and rewarding
      </div>

      <div style={{
        opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 16, color: "#6ee7b7", fontFamily: "sans-serif", marginTop: 30,
      }}>
        Thank you!
      </div>
    </AbsoluteFill>
  );
};
