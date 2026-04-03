import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const TitleScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 80 } });
  const subtitleOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" });
  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 8, stiffness: 60 } });
  const pulse = 1 + Math.sin(frame * 0.06) * 0.02;
  const bgShift = interpolate(frame, [0, 332], [0, -30], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Warm green gradient background matching website */}
      <AbsoluteFill style={{
        background: "linear-gradient(135deg, #2d8a4e 0%, #4aba6e 30%, #8ed1a0 60%, #d4edda 100%)",
        transform: `translateY(${bgShift}px)`,
      }} />

      {/* Floating leaf particles */}
      {[...Array(18)].map((_, i) => {
        const x = (i * 137) % 1920;
        const baseY = (i * 89) % 1080;
        const drift = Math.sin(frame * 0.02 + i * 1.1) * 40;
        const float = Math.cos(frame * 0.015 + i * 0.9) * 25;
        const size = 15 + (i % 4) * 12;
        const rotation = frame * 0.5 + i * 30;
        return (
          <div key={i} style={{
            position: "absolute", left: x + float, top: baseY + drift,
            width: size, height: size * 0.6, borderRadius: "50% 50% 50% 0",
            background: `rgba(255,255,255,${0.08 + (i % 3) * 0.05})`,
            transform: `rotate(${rotation}deg)`,
          }} />
        );
      })}

      {/* Sunburst effect */}
      <div style={{
        position: "absolute", top: -200, right: -200,
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0.1) 40%, transparent 70%)",
        opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
      }} />

      {/* Logo */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(-50%, -70%) scale(${interpolate(logoScale, [0, 1], [0.3, 1]) * pulse})`,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <Img src={staticFile("images/logo.png")} style={{ width: 200, height: 200, borderRadius: 30 }} />
      </div>

      {/* Title */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(-50%, 40px) scale(${interpolate(titleSpring, [0, 1], [0.5, 1])})`,
        opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 120, fontWeight: 900, color: "white", fontFamily: "sans-serif",
        letterSpacing: -2,
        textShadow: "0 4px 30px rgba(0,100,0,0.4), 0 2px 10px rgba(0,0,0,0.2)",
      }}>
        CloudCrop
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, 170px)",
        opacity: subtitleOpacity,
        fontSize: 36, color: "white", fontFamily: "sans-serif", fontWeight: 600,
        textShadow: "0 2px 15px rgba(0,0,0,0.3)",
        textAlign: "center",
      }}>
        Grow crops, earn coins, feed the world! 🌍
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, 230px)",
        opacity: taglineOpacity,
        fontSize: 24, color: "#fff9", fontFamily: "sans-serif", fontWeight: 400,
      }}>
        The gamified farming revolution
      </div>

      {/* Bottom badge */}
      <div style={{
        position: "absolute", bottom: 50, left: "50%",
        transform: "translateX(-50%)",
        opacity: interpolate(frame, [100, 130], [0, 1], { extrapolateRight: "clamp" }),
        padding: "12px 36px", borderRadius: 30,
        background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)",
        fontSize: 16, color: "white", fontFamily: "sans-serif", letterSpacing: 3,
        fontWeight: 700,
      }}>
        🌱 HACKATHON 2026 — FOOD SECURITY
      </div>
    </AbsoluteFill>
  );
};
