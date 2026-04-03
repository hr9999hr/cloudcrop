import { AbsoluteFill, Series, Audio, Sequence, staticFile } from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { TechScene } from "./scenes/TechScene";
import { ImpactScene } from "./scenes/ImpactScene";
import { ClosingScene } from "./scenes/ClosingScene";

// Audio durations at 30fps (Sarah voice):
// intro: 11.05s = 332f, problem: 13.37s = 401f, features(solution): 22.85s = 685f
// tech(features): 18.53s = 556f, impact(tech/impact): 18.44s = 553f, closing: 5.20s = 156f
// Total: 2683 frames

export const MainVideo = () => {
  return (
    <AbsoluteFill>
      {/* Narration audio segments */}
      <Sequence from={0}><Audio src={staticFile("audio/intro.mp3")} volume={0.95} /></Sequence>
      <Sequence from={332}><Audio src={staticFile("audio/problem.mp3")} volume={0.95} /></Sequence>
      <Sequence from={733}><Audio src={staticFile("audio/features.mp3")} volume={0.95} /></Sequence>
      <Sequence from={1418}><Audio src={staticFile("audio/tech.mp3")} volume={0.95} /></Sequence>
      <Sequence from={1974}><Audio src={staticFile("audio/impact.mp3")} volume={0.95} /></Sequence>
      <Sequence from={2527}><Audio src={staticFile("audio/closing.mp3")} volume={0.95} /></Sequence>

      {/* Visual scenes synced to narration */}
      <Series>
        <Series.Sequence durationInFrames={332}><TitleScene /></Series.Sequence>
        <Series.Sequence durationInFrames={401}><ProblemScene /></Series.Sequence>
        <Series.Sequence durationInFrames={685}><SolutionScene /></Series.Sequence>
        <Series.Sequence durationInFrames={556}><FeaturesScene /></Series.Sequence>
        <Series.Sequence durationInFrames={553}><TechScene /></Series.Sequence>
        <Series.Sequence durationInFrames={156}><ClosingScene /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
