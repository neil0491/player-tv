import Hls from "hls.js";
import { BasePlayer } from "./InterfacePlayer";
import { EventBus } from "./event-bus";
import { EVENTS } from "./constants";

export const hslSource = "https://webos.tvcom.uz/thirdparty/hls.min.js";

// _isScriptLoaded(url: string): boolean {
//     const scripts = document.getElementsByTagName("script");
//     for (let i = 0; i < scripts.length; i++) {
//       if (scripts[i].src === url) {
//         return true;
//       }
//     }
//     return false;
//   }

//   _loadHlsScript(url: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       if (this._isScriptLoaded(url)) {
//         console.log(`${url} уже загружен`);
//         //@ts-ignore
//         resolve(window.Hls); // Скрипт уже загружен, сразу разрешаем промис
//         return;
//       }
//       const script = document.createElement("script");
//       script.src = url;
//       script.type = "text/javascript";
//       script.async = true;

//       script.onload = () => {
//         // Проверяем, что Hls был загружен и доступен в глобальном объекте
//         //@ts-ignore
//         if (typeof Hls !== "undefined") {
//           console.log("HLS.js успешно загружен");
//           //@ts-ignore
//           resolve();
//         } else {
//           reject(new Error("HLS.js не найден после загрузки скрипта"));
//         }
//       };

//       script.onerror = () => {
//         reject(new Error("Ошибка загрузки скрипта HLS.js"));
//       };
//       document.head.appendChild(script);
//     });
//   }

export class HlsMedia extends BasePlayer {
  video: HTMLVideoElement | null = null;
  hls: Hls | null = null;

  eventBus: EventBus;

  constructor(url: string, eventBus: EventBus) {
    super();
    this.video = document.createElement("video");
    this.video.width = 800;
    this.video.height = (800 * 9) / 16;
    this.video.controls = true;
    this.video.id = "player";
    this.eventBus = eventBus;
    this._init(url);
  }

  get VideoElement() {
    return this.video;
  }

  _init(url: string) {
    if (Hls.isSupported()) {
      this.destroy();
      this.hls = new Hls();
      this.hls.loadSource(url);
      if (this.video) {
        this.hls.attachMedia(this.video);
        this.listeners();
      }
      // this.hls.on(Hls.Events.)
      this.hls.on(Hls.Events.MANIFEST_LOADED, (event, data) => {
        this.hls?.startLoad(500);
        this.eventBus.publish(EVENTS.INFO, {
          levels: data?.levels || [],
          audios: data?.audioTracks || [],
          subtitles: data?.subtitles ? data.subtitles : [],
        });
        this.eventBus.publish(EVENTS.CURRENT_LEVEL, this.hls?.currentLevel);
        this.eventBus.publish(EVENTS.CURRENT_AUDIO, this.hls?.audioTrack);
        this.eventBus.publish(EVENTS.CURRENT_SUBTITLE, this.hls?.subtitleTrack);
      });
      this.hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          this.eventBus.publish(EVENTS.ERROR, data);
        }
      });
      this.hls.on(Hls.Events.SUBTITLE_TRACK_SWITCH, (event, data) => {});
      this.hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (event, data) => {});
      this.hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {});
    }
  }

  changeUr(url: string) {
    this._init(url);
  }

  play() {
    if (this.video) {
      this.video.play();
    }
  }
  pause() {
    if (this.video) {
      this.video.pause();
    }
  }

  togglePlay() {
    if (this.video?.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  seekTo(time: number): void {
    if (this.video) {
      this.video.currentTime = this.video.currentTime + time;
    }
  }

  getDuration(): number {
    return this.video?.duration || 0;
  }

  changeVideoLevel(level: number): void {
    if (!this.hls) {
      return;
    }
    this.hls.nextLevel = level;
  }

  changeAudioLevel(level: number): void {
    if (!this.hls) {
      return;
    }
    this.hls.audioTrack = level;
  }

  changeSubtitleLevel(level: number): void {
    if (!this.hls) {
      return;
    }
    this.hls.subtitleTrack = level;
  }

  destroy(): void {
    this.removeListeners();
    if (this.hls) {
      this.hls.stopLoad();
      this.hls.destroy();
      this.hls = null;
    }
  }

  publishPlay(): void {
    this.eventBus.publish(EVENTS.STATUS_PLAYER, true);
  }
  publishPause(): void {
    this.eventBus.publish(EVENTS.STATUS_PLAYER, false);
  }
  publishTimeUpdate(e: Event): void {
    //@ts-ignore
    this.eventBus.publish(EVENTS.PROGRESS_TIME, e.target?.currentTime);
  }
  setLoading(e: Event): void {
    this.eventBus.publish(EVENTS.LOADING, true);
  }

  setLoaded(): void {
    this.eventBus.publish(EVENTS.LOADING, false);
  }

  listeners(): void {
    this.video?.addEventListener("error", this.setLoaded.bind(this));
    this.video?.addEventListener("waiting", this.setLoading.bind(this));
    this.video?.addEventListener("play", this.publishPlay.bind(this));
    this.video?.addEventListener("pause", this.publishPause.bind(this));
    this.video?.addEventListener(
      "timeupdate",
      this.publishTimeUpdate.bind(this)
    );
  }

  removeListeners(): void {
    this.video?.removeEventListener("error", this.setLoaded.bind(this));
    this.video?.removeEventListener("waiting", this.setLoading.bind(this));
    this.video?.removeEventListener("play", this.publishPlay.bind(this));
    this.video?.removeEventListener("pause", this.publishPause.bind(this));
    this.video?.removeEventListener(
      "timeupdate",
      this.publishTimeUpdate.bind(this)
    );
  }
}
