import { AbsoluteFill, Series, Audio, Sequence, staticFile } from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { TechScene } from "./scenes/TechScene";
import { ImpactScene } from "./scenes/ImpactScene";
import { ClosingScene } from "./scenes/ClosingScene";

// Audio durations in frames (30fps):
// intro: 11.24s = 337f, problem: 10.63s = 319f, features: 13.19s = 396f
// tech: 10.54s = 316f, impact: 10.96s = 329f, closing: 2.14s = 64f
// Total: ~1761 frames ≈ 59s

export const MainVideo = () => {
  return (
    <AbsoluteFill>
      {/* Narration audio segments */}
      <Sequence from={0}><Audio src={staticFile("audio/intro.mp3")} volume={0.9} /></Sequence>
      <Sequence from={337}><Audio src={staticFile("audio/problem.mp3")} volume={0.9} /></Sequence>
      <Sequence from={656}><Audio src={staticFile("audio/features.mp3")} volume={0.9} /></Sequence>
      <Sequence from={1052}><Audio src={staticFile("audio/tech.mp3")} volume={0.9} /></Sequence>
      <Sequence from={1368}><Audio src={staticFile("audio/impact.mp3")} volume={0.9} /></Sequence>
      <Sequence from={1697}><Audio src={staticFile("audio/closing.mp3")} volume={0.9} /></Sequence>

      {/* Visual scenes synced to narration */}
      <Series>
        <Series.Sequence durationInFrames={337}><TitleScene /></Series.Sequence>
        <Series.Sequence durationInFrames={319}><ProblemScene /></Series.Sequence>
        <Series.Sequence durationInFrames={396}><SolutionScene /></Series.Sequence>
        <Series.Sequence durationInFrames={316}><TechScene /></Series.Sequence>
        <Series.Sequence durationInFrames={329}><ImpactScene /></Series.Sequence>
        <Series.Sequence durationInFrames={73}><ClosingScene /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
