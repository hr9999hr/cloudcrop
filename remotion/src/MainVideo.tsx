import { AbsoluteFill, Series } from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { TechScene } from "./scenes/TechScene";
import { ImpactScene } from "./scenes/ImpactScene";
import { ClosingScene } from "./scenes/ClosingScene";

export const MainVideo = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={150}><TitleScene /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><ProblemScene /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><SolutionScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><FeaturesScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><TechScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><ImpactScene /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><ClosingScene /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
