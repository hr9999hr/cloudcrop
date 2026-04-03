import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const TitleScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = interpolate(
    spring({ frame, fps, config: { damping: 20, stiffness: 80 } }),
    [0, 1], [60, 0]
  );
  const titleOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const pulseScale = 1 + Math.sin(frame * 0.05) * 0.02;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #1a5c2e 0%, #0a2e14 60%, #0d1f0f 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      {/* Floating circles */}
      {[...Array(6)].map((_, i) => {
        const x = 200 + i * 280;
        const y = 150 + (i % 3) * 250;
        const drift = Math.sin(frame * 0.02 + i) * 20;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y + drift,
            width: 80 + i * 20, height: 80 + i * 20,
            borderRadius: "50%",
            background: `rgba(74, 222, 128, ${0.05 + (i % 3) * 0.03})`,
          }} />
        );
      })}

      <div style={{
        transform: `translateY(${titleY}px) scale(${pulseScale})`,
        opacity: titleOpacity,
        fontSize: 96, fontWeight: 900, color: "white",
        fontFamily: "sans-serif", letterSpacing: -2,
        textShadow: "0 4px 30px rgba(74,222,128,0.3)",
      }}>
        CloudCrop
      </div>

      <div style={{
        opacity: subtitleOpacity,
        fontSize: 32, color: "#a7f3d0",
        fontFamily: "sans-serif", fontWeight: 400, marginTop: 16,
      }}>
        Gamifying Urban Agriculture for Food Security
      </div>

      <div style={{
        opacity: taglineOpacity,
        fontSize: 20, color: "#6ee7b7",
        fontFamily: "sans-serif", marginTop: 24,
      }}>
        A mobile-first web platform that makes growing food fun, educational, and rewarding
      </div>

      <div style={{
        position: "absolute", bottom: 60,
        opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 16, color: "#4ade8080",
        fontFamily: "sans-serif",
      }}>
        Hackathon 2026 | Food Security Theme
      </div>
    </AbsoluteFill>
  );
};
