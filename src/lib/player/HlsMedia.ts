import Hls, { Level, LevelParsed, MediaPlaylist } from "hls.js";
import { BasePlayer } from "./InterfacePlayer";
import { EventBus } from "./event-bus";

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

  videoTrcks: Array<LevelParsed> | undefined = [];
  audioTracks: MediaPlaylist[] | undefined = [];
  subtitleTracks: Array<MediaPlaylist> | undefined = [];

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
      }
      this.hls.on(Hls.Events.MANIFEST_LOADED, (event, data) => {
        this.audioTracks = data?.audioTracks;
        this.videoTrcks = data?.levels;
        this.subtitleTracks = data?.subtitles;

        this.eventBus.publish("audios", data?.audioTracks);
        this.eventBus.publish("videos", data?.levels);
        this.eventBus.publish("subtitles", data?.subtitles);
      });
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

  changeVideoLevel(level: number): void {
    if (!this.hls) {
      return;
    }
    this.hls.currentLevel = level;
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
    if (this.hls) {
      this.hls.stopLoad();
      this.hls.destroy();
      this.hls = null;
    }
  }

  get audios(): any {
    return this.audioTracks;
  }
  get videoTracks(): any {
    return this.videoTracks;
  }
  get subtitles(): any {
    return this.subtitleTracks;
  }
  listeners(): void {}
}
