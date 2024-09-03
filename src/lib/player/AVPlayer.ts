import { EVENTS } from "./constants";
import { EventBus } from "./event-bus";
import { BasePlayer } from "./InterfacePlayer";
import { avplay, AVPlayPlaybackCallback } from "tizen-tv-webapis";

export class AVPlayer extends BasePlayer {
  eventBus: EventBus;

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
  constructor(url: string, eventBus: EventBus) {
    super();
    this.eventBus = eventBus;
    this.video = document.createElement("object");
    this.video.id = "player";
    this.video.type = "application/avplayer";
    if (avplay) {
      this._init(url, this);
    }
  }

  get VideoElement() {
    return this.video;
  }

  getDuration() {
    return avplay.getDuration();
  }

  _prepareAndPlay() {
    avplay.prepareAsync(this.play, (e: any) => {
      console.log("Error Start Play", e);
      this.eventBus.publish(EVENTS.STATUS_PLAYER, false);
    });

    // // Init subtitles
    // if (config.subtitles) {
    //   downloadAndSetSubtitles();
    // }
  }

  _init(url: string, ctx: any): void {
    try {
      avplay.open(url);
      avplay.setDisplayRect(0, 0, window.innerWidth, window.innerHeight);
      avplay.setDisplayMethod("PLAYER_DISPLAY_MODE_FULL_SCREEN");
      const that = ctx;

      const listeners = (): AVPlayPlaybackCallback => ({
        onbufferingstart: function onbufferingstart() {
          console.log("Buffering start.");
          that.eventBus.publish(EVENTS.LOADING, true);
        },
        onbufferingprogress: function onbufferingprogress(percent) {
          console.log("Buffering progress data : " + percent);
        },
        onbufferingcomplete: function onbufferingcomplete() {
          console.log("Buffering complete.");
          that.eventBus.publish(EVENTS.LOADING, false);

          // videoDuration = videoDuration || webapis.avplay.getDuration();
        },
        oncurrentplaytime: function oncurrentplaytime(currentPlayTime) {
          // console.log("Current playtime: " + currentPlayTime);
          that.eventBus.publish(
            EVENTS.PROGRESS_TIME,
            currentPlayTime ? Math.floor(currentPlayTime / 1000) : 0
          );
          // currentTime = currentPlayTime;
          // updateTime();
        },
        onevent: function onevent(eventType, eventData) {
          console.log("event type: " + eventType + ", data: " + eventData);
        },
        onstreamcompleted: function onstreamcompleted() {
          console.log("Stream Completed");
          avplay.stop();
        },
        onerror: function onerror(eventType) {
          console.error("event type error : " + eventType);
        },
        onsubtitlechange: function onsubtitlechange(duration, text) {
          console.log("Subtitles running", duration, text);
        },
      });

      avplay.setListener(listeners());

      const totalTrack = avplay.getTotalTrackInfo();
      for (var i = 0; i < totalTrack.length; i++) {
        // console.log(totalTrack[i]);
      }
    } catch (e) {}
  }

  play() {
    try {
      switch (avplay.getState()) {
        case this.playerStates.IDLE: // Fallthrough
        case this.playerStates.NONE:
          this._prepareAndPlay();
          this.eventBus.publish(EVENTS.STATUS_PLAYER, true);

          break;
        case this.playerStates.READY: // Fallthrough
        case this.playerStates.PAUSED:
          avplay.play();
          this.eventBus.publish(EVENTS.STATUS_PLAYER, true);

          break;
        default:
          this.eventBus.publish(EVENTS.STATUS_PLAYER, false);

          break;
      }
    } catch (error) {
      this.eventBus.publish(EVENTS.STATUS_PLAYER, false);
    }
  }

  pause() {
    var playerState = avplay.getState();

    if (
      playerState === this.playerStates.PLAYING ||
      playerState === this.playerStates.READY
    ) {
      this.eventBus.publish(EVENTS.STATUS_PLAYER, false);
      avplay.pause();
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
    this._init(url, this);
    // this._init(url);
  }

  changeAudioLevel(number: number): void {}
  changeSubtitleLevel(number: number): void {}
  changeVideoLevel(number: number): void {}

  destroy(): void {
    avplay.stop();
    avplay.close();
    // console.log(webapis.avplay.getState());
  }
  listeners(): void {}
  seekTo(n: number): void {
    avplay.seekTo(n * 1000);
  }
}
