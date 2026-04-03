import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const TitleScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.04) * 0.015;
  
  // Cinematic zoom
  const bgScale = interpolate(frame, [0, 337], [1.1, 1.0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0a2e14 0%, #1a5c2e 40%, #0d3b1a 100%)",
      transform: `scale(${bgScale})`,
    }}>
      {/* Animated particles */}
      {[...Array(12)].map((_, i) => {
        const x = (i * 173) % 1920;
        const baseY = (i * 97) % 1080;
        const drift = Math.sin(frame * 0.015 + i * 0.8) * 30;
        const float = Math.cos(frame * 0.02 + i * 1.2) * 20;
        const size = 20 + (i % 5) * 15;
        return (
          <div key={i} style={{
            position: "absolute", left: x + float, top: baseY + drift,
            width: size, height: size, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(74,222,128,${0.08 + (i%3)*0.04}) 0%, transparent 70%)`,
          }} />
        );
      })}

      {/* Green accent line */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, 80px)",
        width: interpolate(frame, [20, 50], [0, 400], { extrapolateRight: "clamp" }),
        height: 3, background: "linear-gradient(90deg, transparent, #4ade80, transparent)",
        opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          opacity: titleOpacity,
          transform: `scale(${interpolate(titleScale, [0,1], [0.8, 1]) * pulse})`,
          fontSize: 110, fontWeight: 900, color: "white",
          fontFamily: "sans-serif", letterSpacing: -3,
          textShadow: "0 0 80px rgba(74,222,128,0.4), 0 4px 20px rgba(0,0,0,0.5)",
        }}>
          CloudCrop
        </div>

        <div style={{
          opacity: subtitleOpacity, marginTop: 30,
          fontSize: 34, color: "#a7f3d0", fontFamily: "sans-serif", fontWeight: 300,
          letterSpacing: 4, textTransform: "uppercase",
        }}>
          Gamifying Urban Agriculture
        </div>

        <div style={{
          opacity: taglineOpacity, marginTop: 12,
          fontSize: 22, color: "#6ee7b7", fontFamily: "sans-serif", fontWeight: 300,
        }}>
          for Food Security
        </div>

        {/* Bottom badge */}
        <div style={{
          position: "absolute", bottom: 60,
          opacity: interpolate(frame, [90, 120], [0, 1], { extrapolateRight: "clamp" }),
          padding: "10px 30px", borderRadius: 30,
          background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)",
          fontSize: 14, color: "#86efac", fontFamily: "sans-serif", letterSpacing: 2,
        }}>
          HACKATHON 2026 | FOOD SECURITY
        </div>
      </div>
    </AbsoluteFill>
  );
};
