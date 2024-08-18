export abstract class BasePlayer {
  abstract play(): void;
  abstract pause(): void;
  abstract togglePlay(): void;
  abstract seekTo(): void;
  abstract listeners(): void;
  abstract destroy(): void;
}
