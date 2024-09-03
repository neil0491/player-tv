import { BasePlayer } from "./InterfacePlayer";
import { avplay } from 'tizen-tv-webapis';

export class AVPlayer extends BasePlayer {
  // export class AVPlayer {
  playerStates = {
    IDLE: "IDLE",
    NONE: "NONE",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
    READY: "READY",
  };
  // avplay: any = webapis.avplay;

  video: HTMLObjectElement | null = null;
  constructor(url: string) {
    super();
    this.video = document.createElement("object");
    this.video.id = "player";
    this.video.type = "application/avplayer";
    this._init(url);
  }

  get VideoElement() {
    return this.video;
  }

  _prepareAndPlay() {
    avplay.prepareAsync(this.play, (e: any) => {
      console.log("Error Start Play", e);
      alert("ERROR");
    });

    // // Init subtitles
    // if (config.subtitles) {
    //   downloadAndSetSubtitles();
    // }
  }

  _init(url: string) {
    try {
      webapis.avplay.open(url);
      webapis.avplay.setDisplayRect(
        0,
        0,
        window.innerWidth/2,
        window.innerHeight/2
      );
      webapis.avplay.setDisplayMethod("PLAYER_DISPLAY_MODE_AUTO_ASPECT_RATIO");
    } catch (e) {}
  }

  play() {
    try {
      switch (webapis.avplay.getState()) {
        case this.playerStates.IDLE: // Fallthrough
        case this.playerStates.NONE:
          this._prepareAndPlay();
          break;
        case this.playerStates.READY: // Fallthrough
        case this.playerStates.PAUSED:
          webapis.avplay.play();
          break;
        default:
          break;
      }
    } catch (error) {}
  }

  pause() {
    var playerState = webapis.avplay.getState();

    if (
      playerState === this.playerStates.PLAYING ||
      playerState === this.playerStates.READY
    ) {
      webapis.avplay.pause();
    }
  }

  togglePlay() {
    if (avplay.getState() === this.playerStates.PLAYING) {
      this.pause();
    } else {
      this.play();
    }
  }
  changeUr(url: string) {
    this.destroy();
    this._init(url);
    // this._init(url);
  }
  changeAudioLevel(number: number): void {}
  changeSubtitleLevel(number: number): void {}
  changeVideoLevel(number: number): void {}

  destroy(): void {
    webapis.avplay.close();
  }
  listeners(): void {}
  seekTo(): void {}
}
