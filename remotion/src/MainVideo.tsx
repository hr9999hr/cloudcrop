import { AbsoluteFill, Series, Audio, Sequence, staticFile } from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { TechScene } from "./scenes/TechScene";
import { ImpactScene } from "./scenes/ImpactScene";
import { ClosingScene } from "./scenes/ClosingScene";

// Audio durations at 30fps:
// intro: 16.53s = 496f, problem: 16.72s = 502f, features: 24.66s = 740f
// tech: 14.91s = 448f, impact: 17.14s = 515f, closing: 4.69s = 141f
// Total: 2842 frames

export const MainVideo = () => {
  return (
    <AbsoluteFill>
      {/* Narration audio segments */}
      <Sequence from={0}><Audio src={staticFile("audio/intro.mp3")} volume={0.9} /></Sequence>
      <Sequence from={496}><Audio src={staticFile("audio/problem.mp3")} volume={0.9} /></Sequence>
      <Sequence from={998}><Audio src={staticFile("audio/features.mp3")} volume={0.9} /></Sequence>
      <Sequence from={1738}><Audio src={staticFile("audio/tech.mp3")} volume={0.9} /></Sequence>
      <Sequence from={2186}><Audio src={staticFile("audio/impact.mp3")} volume={0.9} /></Sequence>
      <Sequence from={2701}><Audio src={staticFile("audio/closing.mp3")} volume={0.9} /></Sequence>

      {/* Visual scenes synced to narration */}
      <Series>
        <Series.Sequence durationInFrames={496}><TitleScene /></Series.Sequence>
        <Series.Sequence durationInFrames={502}><ProblemScene /></Series.Sequence>
        <Series.Sequence durationInFrames={740}><SolutionScene /></Series.Sequence>
        <Series.Sequence durationInFrames={448}><TechScene /></Series.Sequence>
        <Series.Sequence durationInFrames={515}><ImpactScene /></Series.Sequence>
        <Series.Sequence durationInFrames={141}><ClosingScene /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
