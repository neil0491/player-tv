import { BasePlayer } from "./InterfacePlayer";

// export class AVPlayer extends BasePlayer {
export class AVPlayer {
  playerStates = {
    IDLE: "IDLE",
    NONE: "NONE",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
    READY: "READY",
  };
  //@ts-ignore
  avplay: any = webapis.avplay;

  video: HTMLObjectElement | null = null;
  constructor(url: string) {
    // super();
    this.video = document.createElement("object");
    this.video.id = "player";
    this.video.type = "application/avplayer";
  }

  get VideoElement() {
    return this.video;
  }

  _prepareAndPlay() {
    this.avplay.prepareAsync(this.play, () => {
      console.log("Error Start Play");
    });

    // // Init subtitles
    // if (config.subtitles) {
    //   downloadAndSetSubtitles();
    // }
  }

  play() {
    try {
      switch (this.avplay.getState()) {
        case this.playerStates.IDLE: // Fallthrough
        case this.playerStates.NONE:
          this._prepareAndPlay();
          break;
        case this.playerStates.READY: // Fallthrough
        case this.playerStates.PAUSED:
          this.avplay.play();
          break;
        default:
          break;
      }
    } catch (error) {}
  }

  pause() {
    var playerState = this.avplay.getState();

    if (
      playerState === this.playerStates.PLAYING ||
      playerState === this.playerStates.READY
    ) {
      this.avplay.pause();
    }
  }

  togglePlay() {
    if (this.avplay.getState() === this.playerStates.PLAYING) {
      this.pause();
    } else {
      this.play();
    }
  }
  changeUr(url: string) {
    this.destroy();
    // this._init(url);
  }

  destroy(): void {}
  listeners(): void {}
  seekTo(): void {}
}
