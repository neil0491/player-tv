export abstract class BasePlayer {
  abstract play(): void;
  abstract pause(): void;
  abstract togglePlay(): void;
  abstract seekTo(number: number): void;
  abstract listeners(): void;
  abstract destroy(): void;
  abstract changeVideoLevel(number: number): void;
  abstract changeAudioLevel(number: number): void;
  abstract changeSubtitleLevel(number: number): void;
  abstract getDuration(): number;
  // abstract getAudios(): void;
  // abstract getVideos(): void;
  // abstract getSubtitles(): void;
}
